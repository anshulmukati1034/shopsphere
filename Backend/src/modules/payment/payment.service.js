import sequelize from "../../config/db.js";
// import Order from "../order/order.model.js";
// import OrderItem from "../order/orderItem.model.js";
// import Payment from "./payment.model.js";
// import Inventory from "../product/inventory.model.js";
import {Order, OrderItem, Payment, Inventory} from "../../database/index.js";
import { verifyPaymentSignature } from "./razorpay.service .js";

/**
 * STEP 2 — Verify payment after Razorpay Checkout's success handler fires.
 *
 * This gives the user INSTANT feedback. It is NOT the sole source of truth —
 * the webhook (see webhook.controller.js / webhook flow) independently
 * confirms the same event and is what you should trust if this never runs
 * (e.g. the user closes the browser right after paying).
 *
 * Inventory is decremented HERE, inside a single DB transaction with the
 * order/payment status update, and ONLY after the signature is verified.
 * See the explanation at the bottom of this file for why that ordering matters.
 *
 * Throws { statusCode, message } on expected failure conditions so the
 * controller can translate them into HTTP responses without knowing
 * anything about verification/inventory internals.
 *
 * @returns {object} { orderId, orderNumber, flagged? } on success
 */
export const verifyPaymentService = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw { statusCode: 400, message: "Missing required fields" };
  }

  // --- 1. Verify signature BEFORE touching the database at all ---
  const isValid = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    // Mark the payment attempt as failed. No transaction needed — there's
    // nothing else to roll back alongside this single write.
    await Payment.update(
      { status: "FAILED", failureReason: "Signature verification failed" },
      { where: { razorpayOrderId } },
    );
    throw { statusCode: 400, message: "Invalid payment signature" };
  }

  // --- 2. Signature is valid — now do order confirmation + inventory decrement atomically ---
  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findOne({
      where: { razorpayOrderId },
      transaction,
      lock: transaction.LOCK.UPDATE, // prevent a concurrent webhook call from racing this
    });

    if (!payment) {
      await transaction.rollback();
      throw { statusCode: 404, message: "Payment record not found" };
    }

    // --- Idempotency: webhook may have already processed this. Don't double-decrement stock. ---
    if (payment.status === "PAID") {
      await transaction.commit();
      return { orderId: payment.orderId, alreadyVerified: true };
    }

    const order = await Order.findByPk(payment.orderId, { transaction, lock: transaction.LOCK.UPDATE });

    if (!order) {
      await transaction.rollback();
      throw { statusCode: 404, message: "Order not found" };
    }

    const orderItems = await OrderItem.findAll({ where: { orderId: order.id }, transaction });

    // --- Decrement inventory now, with a row lock + a quantity-floor guard ---
    // Locking the inventory row and checking quantity right before decrementing
    // — inside the same transaction — means this can never push stock negative,
    // and a race that already depleted stock is caught explicitly below.
    for (const item of orderItems) {
      const whereClause = item.variantId
        ? { productId: item.productId, variantId: item.variantId }
        : { productId: item.productId, variantId: null };

      const inventory = await Inventory.findOne({
        where: whereClause,
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!inventory || inventory.quantity < item.quantity) {
        // Stock vanished between checkout and payment (rare, but must be handled).
        // Payment was genuinely captured, so we still record it as PAID — this
        // needs manual ops attention (backorder / refund decision), not a
        // silent failure. Flagging via orderStatus + notes keeps it visible.
        await transaction.rollback();

        await Payment.update(
          { status: "PAID", razorpayPaymentId, razorpaySignature },
          { where: { id: payment.id } },
        );
        await Order.update(
          {
            paymentStatus: "PAID",
            orderStatus: "PROCESSING",
            notes: "Stock conflict at fulfillment — needs manual review",
          },
          { where: { id: order.id } },
        );

        return { orderId: order.id, flagged: true };
      }

      inventory.quantity -= item.quantity;
      inventory.soldQuantity += item.quantity;
      await inventory.save({ transaction });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "PAID";
    await payment.save({ transaction });

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    await order.save({ transaction });

    await transaction.commit();

    return { orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/*
 * ─────────────────────────────────────────────────────────────────────────
 * WHY INVENTORY IS UPDATED ONLY AFTER PAYMENT VERIFICATION
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. Unpaid carts shouldn't lock real stock.
 *    Anyone can start a checkout and never pay — closed tab, declined card,
 *    changed mind. If stock was decremented at order-creation time, every
 *    abandoned checkout would falsely shrink your available inventory,
 *    eventually selling out items that are actually still in the warehouse.
 *
 * 2. Payment can fail or never complete after the Razorpay order exists.
 *    Creating a Razorpay order does not mean money changed hands. Only a
 *    verified signature (or a captured webhook event) proves that. Decrementing
 *    stock before that point risks giving away inventory for free.
 *
 * 3. Atomicity with the order/payment update prevents inconsistent states.
 *    By decrementing inventory in the SAME transaction as marking the order
 *    CONFIRMED, you guarantee these two facts can never disagree — either both
 *    happen or neither does. If inventory updated separately (e.g. via a queued
 *    job after commit), a crash between the two steps could leave a "CONFIRMED"
 *    order with stock that was never actually deducted, or vice versa.
 *
 * 4. Row-level locking avoids overselling under concurrency.
 *    Two customers can pay for the last unit at nearly the same moment. Locking
 *    the inventory row (`lock: transaction.LOCK.UPDATE`) and checking
 *    `quantity >= item.quantity` right before decrementing — inside the same
 *    transaction — ensures only one of those two payments can succeed in
 *    actually claiming that final unit; everything serializes correctly.
 */
import sequelize from "../../config/db.js";
// import Order from "../order/order.model.js";
// import OrderItem from "../order/orderItem.model.js";
// import Payment from "./payment.model.js";
// import Inventory from "../product/inventory.model.js";
import WebhookEvent from "./webhook.model.js";
import {Order, OrderItem, Payment, Inventory} from "./webhook.model.js";
import { verifyWebhookSignature } from "./razorpay.service .js";

/**
 * Razorpay webhook handler — the SOURCE OF TRUTH for payment confirmation.
 *
 * IMPORTANT: the route mounting this controller MUST use express.raw(), not
 * express.json(). The signature is computed over the exact raw bytes Razorpay
 * sent; if the body was already JSON-parsed and re-stringified, verification
 * will fail even for a completely legitimate request.
 *
 * Razorpay uses at-least-once delivery and retries on any non-2xx response,
 * so the same event can arrive more than once. We dedupe on the
 * x-razorpay-event-id header before doing any order/inventory work.
 */
export const razorpayWebhookHandler = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];
    const rawBody = req.body; // Buffer, because of express.raw() on this route

    if (!signature) {
      return res.status(400).json({ success: false, message: "Missing signature header" });
    }

    const isValid = verifyWebhookSignature({ rawBody, signature });

    if (!isValid) {
      console.warn("Razorpay webhook: invalid signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    const event = payload.event;

    // --- Idempotency check ---
    if (eventId) {
      const existing = await WebhookEvent.findOne({ where: { eventId } });
      if (existing?.processedAt) {
        return res.status(200).json({ success: true, message: "Already processed" });
      }
      if (!existing) {
        await WebhookEvent.create({ eventId, eventType: event, payload });
      }
    }

    if (event === "payment.captured") {
      await handlePaymentCaptured(payload);
    } else if (event === "payment.failed") {
      await handlePaymentFailed(payload);
    } else {
      console.log(`Razorpay webhook: unhandled event "${event}" — acknowledged, no action taken`);
    }

    if (eventId) {
      await WebhookEvent.update({ processedAt: new Date() }, { where: { eventId } });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("razorpayWebhookHandler error:", error);
    // 500 here is intentional — Razorpay retries with backoff, which is what
    // we want if the failure was on our end (DB hiccup, etc).
    return res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};

/**
 * Same atomic confirm-order + decrement-inventory logic as the
 * frontend-driven verifyPayment controller. Kept idempotent so it's safe
 * whether this fires before, after, or instead of that request.
 */
async function handlePaymentCaptured(payload) {
  const paymentEntity = payload.payload.payment.entity;
  const { order_id: razorpayOrderId, id: razorpayPaymentId, method } = paymentEntity;

  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findOne({
      where: { razorpayOrderId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!payment) {
      console.warn(`Webhook payment.captured: no Payment row for ${razorpayOrderId}`);
      await transaction.rollback();
      return;
    }

    // Already processed (likely by the frontend verify call) — nothing to do.
    if (payment.status === "PAID") {
      await transaction.commit();
      return;
    }

    const order = await Order.findByPk(payment.orderId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!order) {
      await transaction.rollback();
      return;
    }

    const orderItems = await OrderItem.findAll({ where: { orderId: order.id }, transaction });

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
        // Same rare-conflict handling as the verify controller: payment was
        // genuinely captured, so we record that, but flag for manual review
        // instead of silently failing or fabricating stock.
        payment.status = "PAID";
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.method = method;
        payment.rawResponse = paymentEntity;
        await payment.save({ transaction });

        order.paymentStatus = "PAID";
        order.orderStatus = "PROCESSING";
        order.notes = "Stock conflict at fulfillment — needs manual review";
        await order.save({ transaction });

        await transaction.commit();
        console.warn(`Stock conflict for order ${order.id} during webhook processing`);
        return;
      }

      inventory.quantity -= item.quantity;
      inventory.soldQuantity += item.quantity;
      await inventory.save({ transaction });
    }

    payment.status = "PAID";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.method = method;
    payment.rawResponse = paymentEntity;
    await payment.save({ transaction });

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    await order.save({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error; // bubble up so the outer handler returns 500 and Razorpay retries
  }
}

async function handlePaymentFailed(payload) {
  const paymentEntity = payload.payload.payment.entity;
  const { order_id: razorpayOrderId, error_description } = paymentEntity;

  const payment = await Payment.findOne({ where: { razorpayOrderId } });
  if (!payment || payment.status === "PAID") return; // never downgrade a confirmed payment

  payment.status = "FAILED";
  payment.failureReason = error_description || "Payment failed";
  payment.rawResponse = paymentEntity;
  await payment.save();

  // Order itself stays PENDING/unconfirmed — inventory was never touched,
  // so there's nothing to roll back here. The user can simply retry payment
  // against the same Order if your frontend supports that, or you can leave
  // it as an abandoned PENDING order to be cleaned up later.
}
import sequelize from "../../config/db.js";
// import Order from "./order.model.js";
// import OrderItem from "./orderItem.model.js";
// import Payment from "../payment/payment.model.js";
// import Inventory from "../product/inventory.model.js";
// import Product from "../product/product.model.js";
// import ProductVariant from "../product/productVariant.model.js";
import {Order, OrderItem, Payment, Inventory, Product, ProductVariant} from "../../database/index.js";

import { createRazorpayOrder } from "../../services/razorpayService.js";

/**
 * Generates a human-friendly, reasonably-unique order number.
 * Swap this out for whatever numbering scheme you already use elsewhere.
 */
function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Checks that enough stock currently EXISTS for every item in the cart.
 * This is a read-only check — it does NOT reserve or decrement anything.
 * Actual decrement happens later, atomically, only once payment is confirmed.
 *
 * Throws a ServiceError-shaped object ({ statusCode, message }) on failure so
 * the controller can translate it into an HTTP response without knowing
 * anything about stock-checking internals.
 */
async function assertStockAvailable(items, transaction) {
  for (const item of items) {
    const inventory = await Inventory.findOne({
      where: item.variantId
        ? { productId: item.productId, variantId: item.variantId }
        : { productId: item.productId, variantId: null },
      transaction,
    });

    if (!inventory || inventory.quantity < item.quantity) {
      throw {
        statusCode: 400,
        message: `Insufficient stock for product ${item.productId}`,
      };
    }
  }
}

/**
 * Resolves trusted, server-side prices for each cart line and computes
 * subtotal. Client-supplied prices are never trusted — we always re-fetch
 * from the Product/ProductVariant tables.
 */
async function resolveItemsAndSubtotal(items, transaction) {
  let subtotal = 0;
  const resolvedItems = [];

  for (const item of items) {
    let unitPrice;

    if (item.variantId) {
      const variant = await ProductVariant.findByPk(item.variantId, { transaction });
      if (!variant) {
        throw { statusCode: 404, message: "Variant not found" };
      }
      unitPrice = Number(variant.discountPrice ?? variant.price);
    } else {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        throw { statusCode: 404, message: "Product not found" };
      }
      unitPrice = Number(product.discountPrice ?? product.basePrice);
    }

    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    resolvedItems.push({
      productId: item.productId,
      variantId: item.variantId || null,
      quantity: item.quantity,
      price: unitPrice,
      total: lineTotal,
    });
  }

  return { resolvedItems, subtotal };
}

/**
 * STEP 1 — Checkout initiation (the actual business logic).
 *
 * Creates the Order + OrderItems as PENDING, WITHOUT touching inventory,
 * then creates the matching Razorpay order and a Payment row (status CREATED).
 *
 * Inventory is only ever decremented later, after payment is verified
 * (see payment.service.js) — see the detailed explanation in that file for why.
 *
 * @param {string} userId
 * @param {object} payload - { addressId, items, shippingCharge, discount, tax }
 * @returns {object} data needed by the frontend to open Razorpay Checkout
 */
export const initiateCheckoutService = async (userId, payload) => {
  const { addressId, items, shippingCharge = 0, discount = 0, tax = 0 } = payload;

  if (!addressId || !Array.isArray(items) || items.length === 0) {
    throw { statusCode: 400, message: "addressId and items are required" };
  }

  const transaction = await sequelize.transaction();

  try {
    await assertStockAvailable(items, transaction);

    const { resolvedItems, subtotal } = await resolveItemsAndSubtotal(items, transaction);

    const totalAmount = subtotal + Number(shippingCharge) + Number(tax) - Number(discount);

    const order = await Order.create(
      {
        orderNumber: generateOrderNumber(),
        userId,
        addressId,
        subtotal,
        shippingCharge,
        discount,
        tax,
        totalAmount,
        paymentMethod: "ONLINE",
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
      },
      { transaction },
    );

    await OrderItem.bulkCreate(
      resolvedItems.map((item) => ({ ...item, orderId: order.id })),
      { transaction },
    );

    // Razorpay order creation happens INSIDE the same transaction's logical
    // scope, but it's an external API call — if it throws, we still want to
    // roll back the Order/OrderItem rows we just created. The try/catch below
    // handles that.
    const razorpayOrder = await createRazorpayOrder({
      amountInRupees: totalAmount,
      receipt: order.orderNumber,
      notes: { orderId: order.id, orderNumber: order.orderNumber },
    });

    await Payment.create(
      {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: "INR",
        status: "CREATED",
        rawResponse: razorpayOrder,
      },
      { transaction },
    );

    await transaction.commit();

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise, what Checkout expects
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // public key — safe to send to frontend
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
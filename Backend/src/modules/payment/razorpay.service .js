import crypto from "crypto";
import razorpay from "../../config/razorpay.js";

/**
 * Creates a Razorpay order. Amount must be passed in rupees (e.g. 499.50);
 * this function converts it to paise internally since that's what Razorpay's API expects.
 */
export const createRazorpayOrder = async ({ amountInRupees, receipt, notes }) => {
  const amountInPaise = Math.round(Number(amountInRupees) * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes,
  });

  return razorpayOrder;
};

/**
 * Verifies the signature Razorpay Checkout returns to the frontend after a
 * successful payment. This proves the (order_id, payment_id) pair genuinely
 * came from Razorpay and wasn't forged by a tampered client.
 */
export const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, signature }) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature || "");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

/**
 * Verifies a Razorpay WEBHOOK signature. This is a different secret
 * (RAZORPAY_WEBHOOK_SECRET, set by you when configuring the webhook on the
 * dashboard) and a different signing scheme than the checkout signature above.
 * Must be called with the RAW request body, not a JSON-parsed object.
 */
export const verifyWebhookSignature = ({ rawBody, signature }) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature || "");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};
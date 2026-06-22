import { verifyPaymentService } from "./payment.service.js";

/**
 * STEP 2 — Verify payment (HTTP layer only).
 *
 * All business logic — signature verification, idempotency checks, atomic
 * order confirmation + inventory decrement — lives in payment.service.js.
 * This controller just extracts request fields, calls the service, and
 * shapes the HTTP response.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const result = await verifyPaymentService({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (result.alreadyVerified) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        data: { orderId: result.orderId },
      });
    }

    if (result.flagged) {
      return res.status(200).json({
        success: true,
        message: "Payment verified, but stock conflict detected — order flagged for review",
        data: { orderId: result.orderId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { orderId: result.orderId, orderNumber: result.orderNumber },
    });
  } catch (error) {
    if (error && error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    console.error("verifyPayment error:", error);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
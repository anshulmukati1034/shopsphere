import express from "express";
import { verifyPayment } from "./payment.controller.js";
import { razorpayWebhookHandler } from "./webhook.controller.js";

const router = express.Router();

// Frontend-driven verification — normal JSON body
router.post("/verify", express.json(), verifyPayment);

// Webhook — CRITICAL: raw body required for signature verification.
// If express.json() runs before this on the same path (e.g. a global
// app.use(express.json()) earlier in your middleware chain), the signature
// check will fail for every request. Mount global JSON parsing AFTER this
// route, or exclude this path from it.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhookHandler,
);

export default router;
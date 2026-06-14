import express from "express";
// import authMiddleware from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../modules/auth/auth.validation.js";
import * as rateLimitMiddleware from "../../middleware/rateLimit.middleware.js";
import * as authController from "./auth.controller.js";

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  rateLimitMiddleware.authLimiter,
  authController.signupController,
);

router.post(
  "/login",
  validate(loginSchema),
  rateLimitMiddleware.authLimiter,
  authController.loginController,
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  rateLimitMiddleware.authLimiter,
  authController.forgotPasswordController,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  rateLimitMiddleware.authLimiter,
  authController.resetPasswordController,
);

router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  rateLimitMiddleware.otpLimiter,
  authController.verifyOtpController,
);

router.post(
  "/resend-otp",
  validate(resendOtpSchema),
  rateLimitMiddleware.otpLimiter,
  authController.resendOtpController,
);

export default router;

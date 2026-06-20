import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware.js";

import * as cartController from "./cart.controller.js";

const router = express.Router();


// Add item

router.post(
  "/",
  authMiddleware,
  cartController.addToCart
);


// Get cart

router.get(
  "/",
  authMiddleware,
  cartController.getCart
);


// Update quantity

router.patch(
  "/items/:id",
  authMiddleware,
  cartController.updateCartItem
);


// Remove item

router.delete(
  "/items/:id",
  authMiddleware,
  cartController.removeCartItem
);


// Clear cart

router.delete(
  "/",
  authMiddleware,
  cartController.clearCart
);

export default router;
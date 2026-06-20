import express from "express";

import * as wishlistController from "./wishlist.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:productId", wishlistController.addToWishlist);

router.get("/", wishlistController.getWishlist);

router.delete("/:productId", wishlistController.removeWishlist);

export default router;
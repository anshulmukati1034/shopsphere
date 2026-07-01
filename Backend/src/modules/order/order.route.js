import express from "express";
import * as orderController from "./order.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js"; // adjust to your actual middleware path

const router = express.Router();

router.use(authMiddleware);

router.post("/", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrder);

export default router;
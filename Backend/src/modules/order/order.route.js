import express from "express";
import { initiateCheckout } from "./order.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/checkout", authMiddleware,  initiateCheckout);

export default router;
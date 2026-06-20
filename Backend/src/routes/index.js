import express from "express";
import authRoutes from "../modules/auth/auth.route.js";
import userRoutes from "../modules/user/user.route.js";
import categoryRoute from "../modules/category/category.routes.js";
import productRoute from "../modules/product/product.route.js";
import brandRoute from "../modules/brand/brand.route.js";
import cartRoute from "../modules/cart/cart.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoute);
router.use("/products", productRoute);
router.use("/category", categoryRoute);
router.use("/brands", brandRoute);


export default router;
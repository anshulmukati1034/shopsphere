import express from "express";
import authRoutes from "../modules/auth/auth.route.js";
import userRoutes from "../modules/user/user.route.js";
import categoryRoutes from "../modules/category/category.routes.js";
import productRoutes from "../modules/product/product.route.js";
import brandRoutes from "../modules/brand/brand.route.js";
import cartRoutes from "../modules/cart/cart.route.js";
import wishlistRoutes from "../modules/wishlist/wishlist.routes.js";
import addressRoutes from "../modules/address/address.route.js";
import oderRoutes from "../modules/order/order.route.js";
import paymentRoute from "../modules/payment/payment.route.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes);
router.use("/products", productRoutes);
router.use("/category", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/address", addressRoutes);
router.use("/orders", oderRoutes);
router.use("/payments", paymentRoute);



export default router;
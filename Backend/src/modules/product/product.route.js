import express from "express";

import * as productRoute from "./product.controller.js";

import { validate } from "../../middlewares/validate.js";
import { productValidation } from "./product.validation.js";

const router = express.Router();


// GET ALL PRODUCTS
router.get(
  "/",
  productRoute.getProducts
);


// GET FEATURED PRODUCTS
router.get(
  "/featured",
  productRoute.getFeaturedProducts
);



// GET PRODUCT DETAILS
router.get(
  "/:slug",
  validate(productValidation.getBySlug),
  productRoute.getProductBySlug
);

export default router;
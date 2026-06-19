import express from "express";

import {
  getBrands,
  getFeaturedBrands,
  getBrandBySlug,
} from "./brand.controller.js";

import { validate } from "../../middleware/validate.middleware.js";

import {
  brandValidation,
} from "./brand.validation.js";

const router = express.Router();

router.get(
  "/",
  getBrands
);

router.get(
  "/featured",
  getFeaturedBrands
);

router.get(
  "/:slug",
  validate(
    brandValidation.getBySlug
  ),
  getBrandBySlug
);

export default router;
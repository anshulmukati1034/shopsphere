import express from "express";

import * as categoryController from "./category.controller.js";

const router = express.Router();

router.get("/", categoryController.getCategories);

router.get("/:slug", categoryController.getCategoryBySlug);

router.get(
  "/:slug/children",
  categoryController.getChildrenCategories
);

export default router;
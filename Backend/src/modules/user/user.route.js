import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { changePasswordSchema } from "./user.validation.js";
import * as userController from "./user.controller.js";
import * as rateLimitMiddleware from "../../middleware/rateLimit.middleware.js";
const router = express.Router();

router.get("/profile", authMiddleware, userController.getUserProfileController);
router.post(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  userController.changePasswordController,
);

router.put(
  "/profile",
  authMiddleware,
  upload.single("image"),
  userController.updateProfile
);


export default router;

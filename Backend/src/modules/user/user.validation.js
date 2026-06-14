import Joi from "joi";

const passwordField = Joi.string()
  .min(8)
  .max(20)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password cannot exceed 20 characters",
    "string.pattern.base": "Password must contain uppercase, lowercase, number and special character",
    "any.required": "Password is required",
  });

const confirmPasswordField = Joi.any()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  });

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({ "string.empty": "Old password is required", "any.required": "Old password is required" }),
  password: passwordField,
  confirmPassword: confirmPasswordField,
});
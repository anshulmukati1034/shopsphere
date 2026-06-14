import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Common Fields
|--------------------------------------------------------------------------
*/

const nameField = Joi.string().trim().min(3).max(50).required().messages({
  "string.empty": "Name is required",
  "string.min": "Name must be at least 3 characters",
  "string.max": "Name cannot exceed 50 characters",
  "any.required": "Name is required",
});

const emailField = Joi.string().trim().lowercase().email().required().messages({
  "string.empty": "Email is required",
  "string.email": "Please enter a valid email",
  "any.required": "Email is required",
});

const passwordField = Joi.string()
  .min(8)
  .max(20)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password cannot exceed 20 characters",
    "string.pattern.base":
      "Password must contain uppercase, lowercase, number and special character",
    "any.required": "Password is required",
  });

const otpField = Joi.string()
  .length(6)
  .pattern(/^[0-9]+$/)
  .required()
  .messages({
    "string.length": "OTP must be 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
    "any.required": "OTP is required",
  });

const tokenField = Joi.string().required().messages({
  "string.empty": "Token is required",
  "any.required": "Token is required",
});

const roleField = Joi.string()
  .valid("user", "admin")
  .default("user")
  .messages({
    "string.only": "Role must be either 'user' or 'admin'",
  });

const confirmPasswordField = Joi.any()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  });

/*
|--------------------------------------------------------------------------
| Auth Schemas
|--------------------------------------------------------------------------
*/

export const signupSchema = Joi.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: roleField.optional(),
});

export const loginSchema = Joi.object({
  email: emailField,
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const verifyOtpSchema = Joi.object({
  email: emailField,
  otp: otpField,
});

export const resendOtpSchema = Joi.object({
  email: emailField,
});

export const forgotPasswordSchema = Joi.object({
  email: emailField,
});

export const resetPasswordSchema = Joi.object({
  token: tokenField,
  password: passwordField,
  confirmPassword: confirmPasswordField,
});

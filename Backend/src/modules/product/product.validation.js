import Joi from "joi";

export const productValidation = {
  getBySlug: Joi.object({
    slug: Joi.string()
      .trim()
      .required()
      .max(220)
      .messages({
        "any.required": "Slug is required",
        "string.empty": "Slug is required",
      }),
  }),
};
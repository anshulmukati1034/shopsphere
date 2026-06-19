import Joi from "joi";

export const brandValidation = {
  getBySlug: Joi.object({
    slug: Joi.string()
      .trim()
      .required(),
  }),
};
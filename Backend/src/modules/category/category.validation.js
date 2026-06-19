import Joi from "joi";

const nameField = Joi.string().trim().min(3).max(100).required().messages({
  "string.empty": "Name is required",
  "string.min": "Name must be at least 3 characters",
  "string.max": "Name cannot exceed 100 characters",
  "any.required": "Name is required",
});

const parentIdField = Joi.string()
  .uuid({ version: "uuidv4" })
  .allow(null, "")
  .messages({
    "string.guid": "Parent category ID must be a valid UUID",
  });

const descriptionField = Joi.string().trim().max(1000).allow("", null).messages({
  "string.max": "Description cannot exceed 1000 characters",
});

const imageUrlField = Joi.string().trim().uri().allow("", null).messages({
  "string.uri": "Image URL must be a valid URL",
});

const metaTitleField = Joi.string().trim().max(70).allow("", null).messages({
  "string.max": "Meta title cannot exceed 70 characters",
});

const metaDescriptionField = Joi.string().trim().max(160).allow("", null).messages({
  "string.max": "Meta description cannot exceed 160 characters",
});

const isActiveField = Joi.boolean().messages({
  "boolean.base": "isActive must be a boolean value",
});

const sortOrderField = Joi.number().integer().min(0).messages({
  "number.base": "Sort order must be a number",
  "number.integer": "Sort order must be an integer",
  "number.min": "Sort order cannot be negative",
});

export const createCategorySchema = Joi.object({
  parentId: parentIdField.optional(),
  name: nameField,
  description: descriptionField.optional(),
  imageUrl: imageUrlField.optional(),
  metaTitle: metaTitleField.optional(),
  metaDescription: metaDescriptionField.optional(),
  isActive: isActiveField.optional(),
  sortOrder: sortOrderField.optional(),
});

export const updateCategorySchema = Joi.object({
  parentId: parentIdField.optional(),
  name: nameField.optional(),
  description: descriptionField.optional(),
  imageUrl: imageUrlField.optional(),
  metaTitle: metaTitleField.optional(),
  metaDescription: metaDescriptionField.optional(),
  isActive: isActiveField.optional(),
  sortOrder: sortOrderField.optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update the category",
  });

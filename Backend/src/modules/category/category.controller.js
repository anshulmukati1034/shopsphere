import * as categoryService from "./category.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { STATUS } from "../../utils/constants/status.js";
import { CATEGORY_MESSAGES } from "../../utils/constants/messages.js";


export const getCategories = async (req, res, next) => {
  try {
    const data = await categoryService.getCategoriesService();

    successResponse(res, STATUS.OK, true, data, CATEGORY_MESSAGES.CATEGORIES_FETCHED);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlugService(
      req.params.slug
    );

    if (!category) {
      return errorResponse(res, STATUS.NOT_FOUND, false, CATEGORY_MESSAGES.CATEGORY_NOT_FOUND);
    }

    return successResponse(res, STATUS.OK, true, category, CATEGORY_MESSAGES.CATEGORY_BY_SLUG_FETCHED);
  } catch (error) {
    next(error);
  }
};

export const getChildrenCategories = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await categoryService.getChildrenCategoriesService(
        req.params.slug
      );

    return successResponse(res, STATUS.OK, true, data, CATEGORY_MESSAGES.CHILD_CATEGORIES_FETCHED);
  } catch (error) {
    next(error);
  }
};
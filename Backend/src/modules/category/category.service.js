import { Category } from "../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { CATEGORY_MESSAGES } from "../../utils/constants/messages.js";
import { STATUS } from "../../utils/constants/status.js";

// GET ALL CATEGORIES
export const getCategoriesService = async () => {
  try {
    return await Category.findAll({
      where: {
        parentId: null,
        isActive: true,
      },
      attributes: [
        "id",
        "name",
        "slug",
        "imageUrl",
        "parentId",
      ],
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
  } catch (error) {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CATEGORY_MESSAGES.CATEGORY_FETCH_FAILED
    );
  }
};

// GET CATEGORY BY SLUG
export const getCategoryBySlugService = async (slug) => {
  try {
    const category = await Category.findOne({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!category) {
      throw new AppError(
        STATUS.NOT_FOUND,
        CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
      );
    }

    return category;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CATEGORY_MESSAGES.CATEGORY_FETCH_FAILED
    );
  }
};

// GET CHILD CATEGORIES
export const getChildrenCategoriesService = async (slug) => {
  try {
    const parent = await Category.findOne({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!parent) {
      throw new AppError(
        STATUS.NOT_FOUND,
        CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
      );
    }

    const categories = await Category.findAll({
      where: {
        parentId: parent.id,
        isActive: true,
      },
      attributes: [
        "id",
        "name",
        "slug",
        "imageUrl",
      ],
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });

    return categories;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CATEGORY_MESSAGES.CATEGORY_FETCH_FAILED
    );
  }
};
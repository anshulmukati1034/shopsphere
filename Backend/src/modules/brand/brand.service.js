import { Brand } from "../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { STATUS } from "../../utils/constants/status.js";
import { BRAND_MESSAGES } from "../../utils/constants/messages.js";

// GET ALL BRANDS
export const getBrandsService = async () => {
  try {
    return await Brand.findAll({
      where: {
        isActive: true,
      },

      attributes: ["id", "name", "slug", "logoUrl"],

      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
  } catch (error) {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      BRAND_MESSAGES.BRAND_FETCH_FAILED,
    );
  }
};

// GET FEATURED BRANDS
export const getFeaturedBrandsService = async () => {
  try {
    return await Brand.findAll({
      where: {
        isActive: true,
        isFeatured: true,
      },

      attributes: ["id", "name", "slug", "logoUrl"],

      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
      ],
    });
  } catch (error) {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      BRAND_MESSAGES.BRAND_FETCH_FAILED,
    );
  }
};

// GET BRAND BY SLUG
export const getBrandBySlugService = async (slug) => {
  try {
    const brand = await Brand.findOne({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!brand) {
      throw new AppError(STATUS.NOT_FOUND, BRAND_MESSAGES.BRAND_NOT_FOUND);
    }

    return brand;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      BRAND_MESSAGES.BRAND_FETCH_FAILED,
    );
  }
};

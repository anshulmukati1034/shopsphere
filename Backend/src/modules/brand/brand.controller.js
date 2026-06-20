import * as brandService from "./brand.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { STATUS } from "../../utils/constants/status.js";
import { BRAND_MESSAGES } from "../../utils/constants/messages.js";

export const getBrands = async (
  req,
  res,
  next
) => {
  try {
    const data = await brandService.getBrandsService();

    successResponse(res, STATUS.OK, true, data, BRAND_MESSAGES.BRANDS_FETCHED);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedBrands = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await brandService.getFeaturedBrandsService();

    successResponse(res, STATUS.OK, true, data, BRAND_MESSAGES.FEATURED_BRANDS_FETCHED );
  } catch (error) {
    next(error);
  }
};

export const getBrandBySlug = async (
  req,
  res,
  next
) => {
  try {
    const brand =
      await brandService.getBrandBySlugService(
        req.params.slug
      );

    if (!brand) {
      return errorResponse(res, STATUS.NOT_FOUND, false, BRAND_MESSAGES.BRAND_NOT_FOUND);
    }

    successResponse(res, STATUS.OK, true, brand, BRAND_MESSAGES.BRAND_FETCHED);  
  } catch (error) {
    next(error);
  }
};
import * as productService from "./product.service.js";
import { successResponse } from "../../utils/response.js";
import { STATUS } from "../../utils/constants/status.js";
import { PRODUCT_MESSAGES } from "../../utils/constants/messages.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProductsService(req.query);

    return successResponse(
      res,
      STATUS.OK,
      true,
      PRODUCT_MESSAGES.PRODUCTS_FETCHED,
      result
    );
  } catch (error) {
    next(error);
  }
};

// GET FEATURED PRODUCTS
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products =
      await productService.getFeaturedProductsService();

    return successResponse(
      res,
      STATUS.OK,
      true,
      PRODUCT_MESSAGES.FEATURED_PRODUCTS_FETCHED,
      products
    );
  } catch (error) {
    next(error);
  }
};

// GET PRODUCT BY SLUG
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product =
      await productService.getProductBySlugService(slug);

    return successResponse(
      res,
      STATUS.OK,
      true,
      PRODUCT_MESSAGES.PRODUCT_FETCHED,
      product
    );
  } catch (error) {
    next(error);
  }
};
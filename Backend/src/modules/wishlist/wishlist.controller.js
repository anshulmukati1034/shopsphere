import * as wishlistService from "./wishlist.service.js";

import { successResponse } from "../../utils/response.js";

import { STATUS } from "../../utils/constants/status.js";

import { WISHLIST_MESSAGES } from "../../utils/constants/messages.js";

export const addToWishlist = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await wishlistService.addToWishlistService(
        req.user.id,
        req.params.productId
      );

    return successResponse(
      res,
      STATUS.CREATED,
      true,
      WISHLIST_MESSAGES.ADDED,
      {
        data,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await wishlistService.getWishlistService(
        req.user.id
      );

    return successResponse(
      res,
      STATUS.OK,
      true,
      WISHLIST_MESSAGES.FETCHED,
      {
        data,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const removeWishlist = async (
  req,
  res,
  next
) => {
  try {
    await wishlistService.removeWishlistService(
      req.user.id,
      req.params.productId
    );

    return successResponse(
      res,
      STATUS.OK,
      true,
      WISHLIST_MESSAGES.REMOVED
    );
  } catch (error) {
    next(error);
  }
};
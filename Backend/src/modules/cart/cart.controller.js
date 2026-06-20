import * as cartService from "./cart.service.js";
import { STATUS } from "../../utils/constants/status.js";
import { CART_MESSAGES } from "../../utils/constants/messages.js";
import { successResponse } from "../../utils/response.js"
// ==========================
// ADD TO CART
// ==========================

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId, variantId, quantity } = req.body;

    const data = await cartService.addToCartService({
      userId,
      productId,
      variantId,
      quantity,
    });

   return successResponse(res, STATUS.CREATED, true, CART_MESSAGES.CART_ITEM_ADDED, data.data);
  } catch (error) {
    next(error);
  }
};

// ==========================
// GET CART
// ==========================

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await cartService.getCartService(userId);

    return successResponse(res, STATUS.OK, true, CART_MESSAGES.CART_FETCHED, data.data);
  } catch (error) {
    next(error);
  }
};

// ==========================
// UPDATE CART ITEM
// ==========================

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const { quantity } = req.body;

    const data = await cartService.updateCartItemService({
      itemId: id,
      quantity,
      userId,
    });

    return successResponse(res, STATUS.OK, true, CART_MESSAGES.CART_UPDATED, data.data);
  } catch (error) {
    next(error);
  }
};

// ==========================
// REMOVE CART ITEM
// ==========================

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    await cartService.removeCartItemService({
      itemId: id,
      userId,
    });

    return successResponse(res, STATUS.OK, true, CART_MESSAGES.CART_ITEM_REMOVED, true);
  } catch (error) {
    next(error);
  }
};

// ==========================
// CLEAR CART
// ==========================

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await cartService.clearCartService(userId);

    return successResponse(res, STATUS.OK, true, CART_MESSAGES.CART_CLEARED, true);
  } catch (error) {
    next(error);
  }
};

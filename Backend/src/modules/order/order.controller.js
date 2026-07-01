import * as orderService from "./order.service.js";
import { STATUS } from "../../utils/constants/status.js";
import { ORDER_MESSAGES } from "../../utils/constants/messages.js";
import { successResponse } from "../../utils/response.js";

// ==========================
// CREATE ORDER (from cart)
// ==========================

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { addressId, notes } = req.body;

    const data = await orderService.createOrderService({
      userId,
      addressId,
      notes,
    });

    return successResponse(
      res,
      STATUS.CREATED,
      true,
      ORDER_MESSAGES.ORDER_CREATED,
      data.data
    );
  } catch (error) {
    next(error);
  }
};

// ==========================
// GET SINGLE ORDER
// ==========================

export const getOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const data = await orderService.getOrderService({
      orderId: id,
      userId,
    });

    return successResponse(
      res,
      STATUS.OK,
      true,
      ORDER_MESSAGES.ORDER_FETCHED,
      data.data
    );
  } catch (error) {
    next(error);
  }
};

// ==========================
// GET ALL ORDERS (for logged in user)
// ==========================

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await orderService.getUserOrdersService(userId);

    return successResponse(
      res,
      STATUS.OK,
      true,
      ORDER_MESSAGES.ORDER_LIST_FETCHED,
      data.data
    );
  } catch (error) {
    next(error);
  }
};
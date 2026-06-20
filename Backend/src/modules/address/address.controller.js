import * as addressService from "./address.service.js";

import { successResponse } from "../../utils/response.js";

import { STATUS } from "../../utils/constants/status.js";

import { ADDRESS_MESSAGES } from "../../utils/constants/messages.js";

export const createAddress = async (req, res, next) => {
  try {
    const data = await addressService.createAddressService(
      req.user.id,
      req.body,
    );

    return successResponse(
      res,
      STATUS.CREATED,
      true,
      ADDRESS_MESSAGES.CREATED,
      { data },
    );
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const data = await addressService.getAddressesService(req.user.id);

    return successResponse(res, STATUS.OK, true, ADDRESS_MESSAGES.FETCHED, {
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (req, res, next) => {
  try {
    const data = await addressService.getAddressByIdService(
      req.user.id,
      req.params.id,
    );

    return successResponse(res, STATUS.OK, true, ADDRESS_MESSAGES.FETCHED, {
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const data = await addressService.updateAddressService(
      req.user.id,
      req.params.id,
      req.body,
    );

    return successResponse(res, STATUS.OK, true, ADDRESS_MESSAGES.UPDATED, {
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddressService(req.user.id, req.params.id);

    return successResponse(res, STATUS.OK, true, ADDRESS_MESSAGES.DELETED);
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const data = await addressService.setDefaultAddressService(
      req.user.id,
      req.params.id,
    );

    return successResponse(
      res,
      STATUS.OK,
      true,
      ADDRESS_MESSAGES.DEFAULT_UPDATED,
      { data },
    );
  } catch (error) {
    next(error);
  }
};

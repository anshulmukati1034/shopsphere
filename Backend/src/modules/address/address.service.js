import { Address } from "../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { STATUS } from "../../utils/constants/status.js";
import { ADDRESS_MESSAGES } from "../../utils/constants/messages.js";

// Create
export const createAddressService = async (userId, body) => {
  try {
    if (body.isDefault) {
      await Address.update(
        { isDefault: false },
        {
          where: { userId },
        },
      );
    }

    const address = await Address.create({
      ...body,
      userId,
    });

    return address;
  } catch (error) {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      ADDRESS_MESSAGES.CREATE_FAILED,
    );
  }
};

// Get All

export const getAddressesService = async (userId) => {
  try {
    return await Address.findAll({
      where: {
        userId,
      },

      order: [
        ["isDefault", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  } catch {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      ADDRESS_MESSAGES.FETCH_FAILED,
    );
  }
};

// Get By Id

export const getAddressByIdService = async (userId, id) => {
  try {
    const address = await Address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new AppError(STATUS.NOT_FOUND, ADDRESS_MESSAGES.NOT_FOUND);
    }

    return address;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      ADDRESS_MESSAGES.FETCH_FAILED,
    );
  }
};

// Update

export const updateAddressService = async (userId, id, body) => {
  try {
    const address = await Address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new AppError(STATUS.NOT_FOUND, ADDRESS_MESSAGES.NOT_FOUND);
    }

    if (body.isDefault) {
      await Address.update(
        { isDefault: false },
        {
          where: { userId },
        },
      );
    }

    await address.update(body);

    return address;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      ADDRESS_MESSAGES.UPDATE_FAILED,
    );
  }
};

// Delete

export const deleteAddressService = async (userId, id) => {
  try {
    const address = await Address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new AppError(STATUS.NOT_FOUND, ADDRESS_MESSAGES.NOT_FOUND);
    }

    await address.destroy();

    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      ADDRESS_MESSAGES.DELETE_FAILED,
    );
  }
};

// Set Default

export const setDefaultAddressService = async (userId, id) => {
  try {
    const address = await Address.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      throw new AppError(STATUS.NOT_FOUND, ADDRESS_MESSAGES.NOT_FOUND);
    }

    await Address.update(
      {
        isDefault: false,
      },
      {
        where: {
          userId,
        },
      },
    );

    address.isDefault = true;

    await address.save();

    return address;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      ADDRESS_MESSAGES.UPDATE_FAILED,
    );
  }
};

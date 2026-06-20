import sequelize from "../../config/db.js";

import {
  Cart,
  CartItem,
  Product,
  ProductVariant,
  ProductImage,
} from "../../database/index.js";

import { AppError } from "../../utils/appError.js";
import { STATUS } from "../../utils/constants/status.js";
import { CART_MESSAGES } from "../../utils/constants/messages.js";

// create cart automatically

const getOrCreateCart = async (userId, transaction) => {
  let cart = await Cart.findOne({
    where: { userId },
    transaction,
  });

  if (!cart) {
    cart = await Cart.create({ userId }, { transaction });
  }

  return cart;
};

// add to cart

export const addToCartService = async ({
  userId,
  productId,
  variantId,
  quantity,
}) => {
  const transaction = await sequelize.transaction();

  try {
    const cart = await getOrCreateCart(userId, transaction);

    const product = await Product.findOne({
      where: {
        id: productId,
        isActive: true,
      },
      transaction,
    });

    if (!product) {
      throw new AppError(STATUS.NOT_FOUND, CART_MESSAGES.PRODUCT_NOT_FOUND);
    }

    let price = product.basePrice;

    if (variantId) {
      const variant = await ProductVariant.findOne({
        where: {
          id: variantId,
          productId,
          isActive: true,
        },
        transaction,
      });

      if (!variant) {
        throw new AppError(STATUS.NOT_FOUND, CART_MESSAGES.VARIANT_NOT_FOUND);
      }

      price = variant.price;
    }

    let item = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
      transaction,
    });

    if (item) {
      item.quantity += quantity;

      await item.save({ transaction });
    } else {
      item = await CartItem.create(
        {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          priceAtAddition: price,
        },
        { transaction },
      );
    }

    await transaction.commit();

    return {
      msg: CART_MESSAGES.CART_ITEM_ADDED,
      data: item,
    };
  } catch (error) {
    await transaction.rollback();

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CART_MESSAGES.CART_ADD_FAILED,
    );
  }
};

// get cart

export const getCartService = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: { userId },

      include: [
        {
          model: CartItem,
          as: "items",

          include: [
            {
              model: Product,
              as: "product",

              include: [
                {
                  model: ProductImage,
                  as: "images",
                  required: false,
                  where: {
                    isPrimary: true,
                  },
                  attributes: ["imageUrl"],
                },
              ],
            },

            {
              model: ProductVariant,
              as: "variant",
            },
          ],
        },
      ],
    });

    return {
      msg: CART_MESSAGES.CART_FETCHED,
      data: cart,
    };
  } catch (error) {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CART_MESSAGES.CART_FETCH_FAILED,
    );
  }
};

// update quantity

export const updateCartItemService = async ({ itemId, quantity, userId }) => {
  try {
    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      throw new AppError(STATUS.NOT_FOUND, CART_MESSAGES.CART_NOT_FOUND);
    }

    const item = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new AppError(STATUS.NOT_FOUND, CART_MESSAGES.CART_ITEM_NOT_FOUND);
    }

    item.quantity = quantity;

    await item.save();

    return {
      msg: CART_MESSAGES.CART_UPDATED,
      data: item,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CART_MESSAGES.CART_UPDATE_FAILED,
    );
  }
};

// remove item

export const removeCartItemService = async ({ itemId, userId }) => {
  try {
    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      throw new AppError(STATUS.NOT_FOUND, CART_MESSAGES.CART_NOT_FOUND);
    }

    const item = await CartItem.findOne({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new AppError(STATUS.NOT_FOUND, CART_MESSAGES.CART_ITEM_NOT_FOUND);
    }

    await item.destroy();

    return {
      msg: CART_MESSAGES.CART_ITEM_REMOVED,
      data: true,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CART_MESSAGES.CART_REMOVE_FAILED,
    );
  }
};

// clear cart

export const clearCartService = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      return {
        msg: CART_MESSAGES.CART_CLEARED,
        data: true,
      };
    }

    await CartItem.destroy({
      where: {
        cartId: cart.id,
      },
    });

    return {
      msg: CART_MESSAGES.CART_CLEARED,
      data: true,
    };
  } catch (error) {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      CART_MESSAGES.CART_CLEAR_FAILED,
    );
  }
};

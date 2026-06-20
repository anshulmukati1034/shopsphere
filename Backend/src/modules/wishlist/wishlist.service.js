import { Wishlist, Product, ProductImage } from "../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { STATUS } from "../../utils/constants/status.js";
import { WISHLIST_MESSAGES } from "../../utils/constants/messages.js";

// Add to wishlist
export const addToWishlistService = async (userId, productId) => {
  try {
    const product = await Product.findOne({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      throw new AppError(
        STATUS.NOT_FOUND,
        WISHLIST_MESSAGES.PRODUCT_NOT_FOUND
      );
    }

    const exists = await Wishlist.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (exists) {
      throw new AppError(
        STATUS.BAD_REQUEST,
        WISHLIST_MESSAGES.ALREADY_IN_WISHLIST
      );
    }

    const wishlist = await Wishlist.create({
      userId,
      productId,
    });

    return wishlist;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      WISHLIST_MESSAGES.ADD_FAILED
    );
  }
};

// Get wishlist
export const getWishlistService = async (userId) => {
  try {
    return await Wishlist.findAll({
      where: {
        userId,
      },

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
      ],

      order: [["createdAt", "DESC"]],
    });
  } catch {
    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      WISHLIST_MESSAGES.FETCH_FAILED
    );
  }
};

// Remove wishlist
export const removeWishlistService = async (
  userId,
  productId
) => {
  try {
    const item = await Wishlist.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!item) {
      throw new AppError(
        STATUS.NOT_FOUND,
        WISHLIST_MESSAGES.NOT_FOUND
      );
    }

    await item.destroy();

    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      STATUS.INTERNAL_SERVER_ERROR,
      WISHLIST_MESSAGES.REMOVE_FAILED
    );
  }
};
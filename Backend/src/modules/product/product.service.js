import { Op } from "sequelize";
import {
  Product,
  Category,
  Brand,
  ProductImage,
  ProductVariant,
  ProductAttribute,
  Inventory,
} from "../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { STATUS } from "../../utils/constants/status.js";
import { PRODUCT_MESSAGES } from "../../utils/constants/messages.js";

import { getPagination, getPagingData } from "../../utils/pagination.js";

// GET ALL PRODUCTS
export const getProductsService = async (query) => {
  try {
    const { page, limit, offset } = getPagination(query.page, query.limit);

    const where = {
      isActive: true,
    };

    if (query.search) {
      where.name = {
        [Op.iLike]: `%${query.search}%`,
      };
    }

    if (query.featured === "true") {
      where.isFeatured = true;
    }

    if (query.minPrice || query.maxPrice) {
      where.basePrice = {};
    }

    if (query.minPrice) {
      where.basePrice[Op.gte] = query.minPrice;
    }

    if (query.maxPrice) {
      where.basePrice[Op.lte] = query.maxPrice;
    }

    const categoryWhere = {};
    if (query.category) categoryWhere.slug = query.category;

    const brandWhere = {};
    if (query.brand) brandWhere.slug = query.brand;

    const result = await Product.findAndCountAll({
      where,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
          required: !!query.category,
          where: Object.keys(categoryWhere).length ? categoryWhere : undefined,
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name", "slug", "logoUrl"],
          required: !!query.brand,
          where: Object.keys(brandWhere).length ? brandWhere : undefined,
        },
        {
          model: ProductImage,
          as: "images",
          required: false,
          where: { isPrimary: true },
          attributes: ["imageUrl"],
        },
      ],
    });

    return {
      status: STATUS.SUCCESS,
      message: PRODUCT_MESSAGES.PRODUCTS_FETCHED,
      data: getPagingData(result.count, result.rows, page, limit),
    };
  } catch (error) {
    throw new AppError(
      PRODUCT_MESSAGES.PRODUCT_FETCH_FAILED,
      STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

// FEATURED PRODUCTS
export const getFeaturedProductsService = async () => {
  try {
    const products = await Product.findAll({
      where: {
        isActive: true,
        isFeatured: true,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name", "slug"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
        {
          model: ProductImage,
          as: "images",
          required: false,
          where: { isPrimary: true },
          attributes: ["imageUrl"],
        },
      ],
    });

    return {
      status: STATUS.SUCCESS,
      message: PRODUCT_MESSAGES.FEATURED_PRODUCTS_FETCHED,
      data: products,
    };
  } catch (error) {
    throw new AppError(
      PRODUCT_MESSAGES.PRODUCT_FETCH_FAILED,
      STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

// PRODUCT DETAILS
export const getProductBySlugService = async (slug) => {
  try {
    const product = await Product.findOne({
      where: {
        slug,
        isActive: true,
      },
      include: [
        { model: Brand, as: "brand" },
        { model: Category, as: "category" },
        { model: ProductImage, as: "images" },
        { model: ProductVariant, as: "variants" },
        { model: ProductAttribute, as: "attributes" },
        { model: Inventory, as: "inventory" },
      ],
    });

    if (!product) {
      throw new AppError(PRODUCT_MESSAGES.PRODUCT_NOT_FOUND, STATUS.NOT_FOUND);
    }

    return {
      status: STATUS.SUCCESS,
      message: PRODUCT_MESSAGES.PRODUCT_FETCHED,
      data: product,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      PRODUCT_MESSAGES.PRODUCT_FETCH_FAILED,
      STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};

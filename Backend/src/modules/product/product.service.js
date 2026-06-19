import { Op } from "sequelize";

import Product from "./product.model.js";
import Category from "../category/category.model.js";
import Brand from "../brand/brand.model.js";
import ProductImage from "./productImage.model.js";
import ProductVariant from "./productVariant.model.js";
import ProductAttribute from "./productAttribute.model.js";
import Inventory from "./inventory.model.js";

import { getPagination, getPagingData } from "../../utils/pagination.js";


// GET ALL PRODUCTS
export const getProductsService = async (query) => {
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

    if (query.category) {
        categoryWhere.slug = query.category;
    }

    const brandWhere = {};

    if (query.brand) {
        brandWhere.slug = query.brand;
    }

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

                where: {
                    isPrimary: true,
                },

                attributes: ["imageUrl"],
            },
        ],
    });

    return getPagingData(result.count, result.rows, page, limit);
};


// FEATURED PRODUCTS
export const getFeaturedProductsService = async () => {
    return await Product.findAll({
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

                where: {
                    isPrimary: true,
                },

                attributes: ["imageUrl"],
            },
        ],
    });
};


// PRODUCT DETAILS
export const getProductBySlugService = async (slug) => {
    return await Product.findOne({
        where: {
            slug,
            isActive: true,
        },

        include: [
            {
                model: Brand,
                as: "brand",
            },

            {
                model: Category,
                as: "category",
            },

            {
                model: ProductImage,
                as: "images",
            },

            {
                model: ProductVariant,
                as: "variants",
            },

            {
                model: ProductAttribute,
                as: "attributes",
            },

            {
                model: Inventory,
                as: "inventory",
            },
        ],
    });
};

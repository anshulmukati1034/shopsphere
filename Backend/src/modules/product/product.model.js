import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import { generateSlug } from "../../utils/slugify.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "category_id",
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    brandId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "brand_id",
      references: {
        model: "brands",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(220),
      unique: true,
    },

    sku: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },

    description: DataTypes.TEXT,

    shortDescription: {
      type: DataTypes.STRING(500),
      field: "short_description",
    },

    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "base_price",
    },

    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      field: "discount_price",
    },

    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_featured",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },

    metaTitle: {
      type: DataTypes.STRING,
      field: "meta_title",
    },

    metaDescription: {
      type: DataTypes.TEXT,
      field: "meta_description",
    },
  },
  {
    tableName: "products",

    paranoid: true,

    hooks: {
      beforeValidate: (product) => {
        if (product.name) {
          product.slug = generateSlug(product.name);
        }
      },
    },

    indexes: [
      {
        unique: true,
        fields: ["slug"],
      },

      {
        unique: true,
        fields: ["sku"],
      },

      {
        fields: ["category_id"],
      },

      {
        fields: ["brand_id"],
      },

      {
        fields: ["is_active"],
      },

      {
        fields: ["is_featured"],
      },
    ],
  },
);

export default Product;

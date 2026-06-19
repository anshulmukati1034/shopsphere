import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    sku: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      field: "discount_price",
    },

    imageUrl: {
      type: DataTypes.STRING,
      field: "image_url",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  {
    tableName: "product_variants",

    paranoid: true,

    indexes: [
      {
        unique: true,
        fields: ["sku"],
      },

      {
        fields: ["product_id"],
      },

      {
        fields: ["is_active"],
      },
    ],
  }
);

export default ProductVariant;
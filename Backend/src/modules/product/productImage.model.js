import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ProductImage = sequelize.define(
  "ProductImage",
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

    variantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "variant_id",
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url",
    },

    altText: {
      type: DataTypes.STRING,
      field: "alt_text",
    },

    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_primary",
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  {
    tableName: "product_images",

    paranoid: true,

    indexes: [
      {
        fields: ["product_id"],
      },

      {
        fields: ["variant_id"],
      },

      {
        fields: ["is_primary"],
      },
    ],
  }
);

export default ProductImage;
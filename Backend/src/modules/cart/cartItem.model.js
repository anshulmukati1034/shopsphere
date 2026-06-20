import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "cart_id",
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

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },

    priceAtAddition: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "price_at_addition",
    },
  },
  {
    tableName: "cart_items",

    paranoid: true,

    indexes: [
      {
        fields: ["cart_id"],
      },

      {
        fields: ["product_id"],
      },

      {
        fields: ["variant_id"],
      },

      {
        unique: true,
        fields: [
          "cart_id",
          "product_id",
          "variant_id",
        ],
      },
    ],
  }
);

export default CartItem;
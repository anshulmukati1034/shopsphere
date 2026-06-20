import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    shippingCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    paymentMethod: {
      type: DataTypes.ENUM("COD", "ONLINE"),
      defaultValue: "COD",
    },

    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED", "REFUNDED"),
      defaultValue: "PENDING",
    },

    orderStatus: {
      type: DataTypes.ENUM(
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ),
      defaultValue: "PENDING",
    },

    notes: {
      type: DataTypes.TEXT,
    },
  },

  {
    tableName: "orders",

    timestamps: true,
  },
);

export default Order;

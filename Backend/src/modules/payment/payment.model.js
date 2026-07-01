import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "order_id",
      references: {
        model: "orders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    gateway: {
      type: DataTypes.ENUM("RAZORPAY"),
      defaultValue: "RAZORPAY",
    },

    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "razorpay_order_id",
    },

    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: "razorpay_payment_id",
    },

    razorpaySignature: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "razorpay_signature",
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "INR",
    },

    status: {
      type: DataTypes.ENUM(
        "CREATED",
        "AUTHORIZED",
        "PAID",
        "FAILED",
        "REFUNDED"
      ),
      defaultValue: "CREATED",
    },

    method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    capturedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    refundId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "failure_reason",
    },

    rawResponse: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "raw_response",
    },
  },
  {
    tableName: "payments",
    timestamps: true,

    indexes: [
      {
        fields: ["order_id"],
      },
      {
        fields: ["status"],
      },
      {
        unique: true,
        fields: ["razorpay_order_id"],
      },
      {
        unique: true,
        fields: ["razorpay_payment_id"],
      },
    ],
  }
);

export default Payment;
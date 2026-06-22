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

    // Razorpay order_id (order_xxx) — created BEFORE checkout opens
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "razorpay_order_id",
    },

    // Razorpay payment_id (pay_xxx) — only present after a payment attempt
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: false,
      defaultValue: "INR",
    },

    status: {
      type: DataTypes.ENUM(
        "CREATED",    // razorpay order created, payment not attempted yet
        "AUTHORIZED", // authorized but not captured (manual capture flow)
        "PAID",       // payment captured + verified
        "FAILED",     // payment failed
        "REFUNDED",   // fully refunded
      ),
      defaultValue: "CREATED",
    },

    method: {
      type: DataTypes.STRING(50), // card, upi, netbanking, wallet, etc.
      allowNull: true,
    },

    rawResponse: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: "raw_response",
    },

    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "failure_reason",
    },
  },

  {
    tableName: "payments",

    timestamps: true,

    indexes: [
      { unique: true, fields: ["razorpay_order_id"] },
      { fields: ["razorpay_payment_id"] },
      { fields: ["order_id"] },
      { fields: ["status"] },
    ],
  },
);

export default Payment;
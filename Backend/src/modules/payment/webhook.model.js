import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const WebhookEvent = sequelize.define(
  "WebhookEvent",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // x-razorpay-event-id header value — unique per webhook event
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "event_id",
    },

    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "event_type",
    },

    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "processed_at",
    },
  },

  {
    tableName: "webhook_events",

    timestamps: true,

    indexes: [
      { unique: true, fields: ["event_id"] },
      { fields: ["event_type"] },
    ],
  },
);

export default WebhookEvent;
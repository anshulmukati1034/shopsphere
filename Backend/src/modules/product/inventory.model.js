import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Inventory = sequelize.define(
  "Inventory",
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

    // Total Available Stock
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },

    // Reserved for pending orders
    reservedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: "reserved_quantity",
    },

    // Total sold items
    soldQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: "sold_quantity",
    },

    lowStockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      field: "low_stock_threshold",
    },

    warehouseLocation: {
      type: DataTypes.STRING(100),
      field: "warehouse_location",
    },

    lastRestockedAt: {
      type: DataTypes.DATE,
      field: "last_restocked_at",
    },
  },

  {
    tableName: "inventory",

    paranoid: true,

    indexes: [
      {
        fields: ["product_id"],
      },
      {
        fields: ["variant_id"],
      },
      {
        unique: true,
        fields: ["product_id", "variant_id"],
      },
    ],
  }
);

export default Inventory;
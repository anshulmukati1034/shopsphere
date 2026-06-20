import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    addressLine2: {
      type: DataTypes.STRING,
    },

    landmark: {
      type: DataTypes.STRING,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "India",
    },

    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "HOME",
        "WORK",
        "OTHER"
      ),
      defaultValue: "HOME",
    },

    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "addresses",

    timestamps: true,
  }
);

export default Address;
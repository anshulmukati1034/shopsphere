import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: "user_id",
    },
  },
  {
    tableName: "carts",

    paranoid: true,

    indexes: [
      {
        unique: true,
        fields: ["user_id"],
      },
    ],
  }
);

export default Cart;
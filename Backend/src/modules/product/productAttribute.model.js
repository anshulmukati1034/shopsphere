import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ProductAttribute = sequelize.define(
  "ProductAttribute",
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

    attributeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "attribute_name",
    },

    attributeValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "attribute_value",
    },

    unit: {
      type: DataTypes.STRING(30),
    },
  },
  {
    tableName: "product_attributes",

    paranoid: true,

    indexes: [
      {
        fields: ["product_id"],
      },

      {
        fields: ["attribute_name"],
      },
    ],
  }
);

export default ProductAttribute;
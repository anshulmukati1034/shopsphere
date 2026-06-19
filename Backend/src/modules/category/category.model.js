import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import { generateSlug } from "../../utils/slugify.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "parent_id",
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(150),
      unique: true,
    },

    description: DataTypes.TEXT,

    imageUrl: {
      type: DataTypes.STRING,
      field: "image_url",
    },

    metaTitle: {
      type: DataTypes.STRING,
      field: "meta_title",
    },

    metaDescription: {
      type: DataTypes.TEXT,
      field: "meta_description",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  {
    tableName: "categories",

    paranoid: true,

    hooks: {
      beforeValidate: (category) => {
        if (category.name) {
          category.slug = generateSlug(category.name);
        }
      },
    },

    indexes: [
      {
        unique: true,
        fields: ["slug"],
      },

      {
        fields: ["parent_id"],
      },

      {
        fields: ["is_active"],
      },
    ],
  }
);

export default Category;
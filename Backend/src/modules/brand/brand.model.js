import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import { generateSlug } from "../../utils/slugify.js";

const Brand = sequelize.define(
  "Brand",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    logoUrl: {
      type: DataTypes.STRING,
      field: "logo_url",
    },

    website: DataTypes.STRING,

    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_featured",
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

    metaTitle: {
      type: DataTypes.STRING,
      field: "meta_title",
    },

    metaDescription: {
      type: DataTypes.TEXT,
      field: "meta_description",
    },
  },

  {
    tableName: "brands",

    paranoid: true,

    hooks: {
      beforeValidate: (brand) => {
        if (brand.name) {
          brand.slug = generateSlug(brand.name);
        }
      },
    },

    indexes: [
      {
        unique: true,
        fields: ["slug"],
      },

      {
        fields: ["is_active"],
      },

      {
        fields: ["is_featured"],
      },
    ],
  }
);

export default Brand;
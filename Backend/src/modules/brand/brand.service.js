import Brand from "../../models/Brand.model.js";

export const getBrandsService = async () => {
  return await Brand.findAll({
    where: {
      isActive: true,
    },

    attributes: [
      "id",
      "name",
      "slug",
      "logoUrl",
    ],

    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
};

export const getFeaturedBrandsService = async () => {
  return await Brand.findAll({
    where: {
      isActive: true,
      isFeatured: true,
    },

    attributes: [
      "id",
      "name",
      "slug",
      "logoUrl",
    ],

    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
};

export const getBrandBySlugService = async (slug) => {
  return await Brand.findOne({
    where: {
      slug,
      isActive: true,
    },
  });
};
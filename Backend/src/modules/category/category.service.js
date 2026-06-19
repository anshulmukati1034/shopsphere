import Category from "./category.model.js";

export const getCategoriesService = async () => {
  return await Category.findAll({
    where: {
      parentId: null,
      isActive: true,
    },
    attributes: [
      "id",
      "name",
      "slug",
      "imageUrl",
      "parentId",
    ],
    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
};

export const getCategoryBySlugService = async (slug) => {
  return await Category.findOne({
    where: {
      slug,
      isActive: true,
    },
  });
};

export const getChildrenCategoriesService = async (slug) => {
  const parent = await Category.findOne({
    where: {
      slug,
      isActive: true,
    },
  });

  if (!parent) {
    throw new Error("Category not found");
  }

  return await Category.findAll({
    where: {
      parentId: parent.id,
      isActive: true,
    },

    attributes: [
      "id",
      "name",
      "slug",
      "imageUrl",
    ],

    order: [
      ["sortOrder", "ASC"],
      ["name", "ASC"],
    ],
  });
};
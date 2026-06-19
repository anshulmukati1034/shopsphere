import * as categoryService from "./category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const data = await categoryService.getCategoriesService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryBySlugService(
      req.params.slug
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getChildrenCategories = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await categoryService.getChildrenCategoriesService(
        req.params.slug
      );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
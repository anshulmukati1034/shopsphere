import {
  getBrandsService,
  getFeaturedBrandsService,
  getBrandBySlugService,
} from "./brand.service.js";

export const getBrands = async (
  req,
  res,
  next
) => {
  try {
    const data = await getBrandsService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedBrands = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await getFeaturedBrandsService();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandBySlug = async (
  req,
  res,
  next
) => {
  try {
    const brand =
      await getBrandBySlugService(
        req.params.slug
      );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};
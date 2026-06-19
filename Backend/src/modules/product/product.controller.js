import * as productService from "./product.service.js";


// GET ALL PRODUCTS
export const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const products = await productService.getProductsService(
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      ...products,
    });
  } catch (error) {
    next(error);
  }
};


// GET FEATURED PRODUCTS
export const getFeaturedProducts = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await productService.getFeaturedProductsService();

    return res.status(200).json({
      success: true,
      message:
        "Featured products fetched successfully.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};



// GET PRODUCT BY SLUG
export const getProductBySlug = async (
  req,
  res,
  next
) => {     
  try {
    const { slug } = req.params;

    const product =
      await productService.getProductBySlugService(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
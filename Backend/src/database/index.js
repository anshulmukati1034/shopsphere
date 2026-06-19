// models/associations.js

import Category from "../modules/category/category.model.js";
import Brand from "../modules/brand/brand.model.js";
import Product from "../modules/product/product.model.js";
import ProductImage from "../modules/product/productImage.model.js";
import ProductVariant from "../modules/product/productVariant.model.js";
import ProductAttribute from "../modules/product/productAttribute.model.js";
import Inventory from "../modules/product/inventory.model.js";


// ===========================
// Category Self Relation
// ===========================

Category.hasMany(Category, {
  foreignKey: "parentId",
  as: "children",
});

Category.belongsTo(Category, {
  foreignKey: "parentId",
  as: "parent",
});


// ===========================
// Category -> Product
// ===========================

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});


// ===========================
// Brand -> Product
// ===========================

Brand.hasMany(Product, {
  foreignKey: "brandId",
  as: "products",
});

Product.belongsTo(Brand, {
  foreignKey: "brandId",
  as: "brand",
});


// ===========================
// Product -> Variants
// ===========================

Product.hasMany(ProductVariant, {
  foreignKey: "productId",
  as: "variants",
});

ProductVariant.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ===========================
// Product -> Images
// ===========================

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
});

ProductImage.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ===========================
// Variant -> Images
// ===========================

ProductVariant.hasMany(ProductImage, {
  foreignKey: "variantId",
  as: "images",
});

ProductImage.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});


// ===========================
// Product -> Attributes
// ===========================

Product.hasMany(ProductAttribute, {
  foreignKey: "productId",
  as: "attributes",
});

ProductAttribute.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ===========================
// Product -> Inventory
// ===========================

Product.hasOne(Inventory, {
  foreignKey: "productId",
  as: "inventory",
});

Inventory.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ===========================
// Variant -> Inventory
// ===========================

ProductVariant.hasOne(Inventory, {
  foreignKey: "variantId",
  as: "inventory",
});

Inventory.belongsTo(ProductVariant, {
  foreignKey: "variantId",
  as: "variant",
});


// ===========================
// Export Models
// ===========================

export {
  Category,
  Brand,
  Product,
  ProductVariant,
  ProductImage,
  ProductAttribute,
  Inventory,
};
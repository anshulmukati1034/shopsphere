import sequelize from "../../config/db.js";

import {
  Cart,
  CartItem,
  Order,
  OrderItem,
  Address,
  Payment,
  Inventory,
  Product,
  ProductVariant,
} from "../../database/index.js";
import { generateOrderNumber } from "../../utils/orderNumber.js";
import { ORDER_MESSAGES } from "../../utils/constants/messages.js";
import { AppError } from "../../utils/AppError.js"; // existing error class, adjust path if different

// ==========================
// CREATE ORDER FROM CART
// ==========================
// Steps:
// 1. Load cart with items (product, variant, inventory)
// 2. Make sure cart is not empty
// 3. Make sure the address belongs to this user
// 4. Check stock for every item
// 5. Create Order + OrderItems (cart is NOT cleared here — only after payment success)

export const createOrderService = async ({ userId, addressId, notes }) => {
  const cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: "items",
        include: [
          { model: Product, as: "product" },
          { model: ProductVariant, as: "variant" },
        ],
      },
    ],
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError(ORDER_MESSAGES.CART_EMPTY, 400);
  }

  const address = await Address.findOne({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new AppError(ORDER_MESSAGES.ADDRESS_NOT_FOUND, 404);
  }

  // Validate stock for every cart item before creating anything
  for (const item of cart.items) {
    const inventory = await Inventory.findOne({
      where: {
        productId: item.productId,
        variantId: item.variantId || null,
      },
    });

    const availableStock = inventory
      ? inventory.quantity - inventory.reservedQuantity
      : 0;

    if (!inventory || availableStock < item.quantity) {
      throw new AppError(
        `${ORDER_MESSAGES.INSUFFICIENT_STOCK}: ${item.product.name}`,
        400,
      );
    }
  }

  // Calculate price for each item using current price (variant price wins if present)
  const orderItemsData = cart.items.map((item) => {
    const unitPrice = item.variant
      ? Number(item.variant.discountPrice || item.variant.price)
      : Number(item.product.discountPrice || item.product.basePrice);

    return {
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      sku: item.variant ? item.variant.sku : item.product.sku,
      quantity: item.quantity,
      price: unitPrice,
      total: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItemsData.reduce((sum, item) => sum + item.total, 0);

  // Keeping shipping/discount/tax simple for now — plug real calculation later
  const shippingCharge = 0;
  const discount = 0;
  const tax = 0;
  const totalAmount = subtotal + shippingCharge + tax - discount;

  const result = await sequelize.transaction(async (t) => {
    const order = await Order.create(
      {
        orderNumber: generateOrderNumber(),
        userId,
        addressId,
        subtotal,
        shippingCharge,
        discount,
        tax,
        totalAmount,
        notes,
      },
      { transaction: t },
    );

    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await OrderItem.bulkCreate(itemsWithOrderId, { transaction: t });

    // Reserve stock so other checkouts don't oversell while payment is pending
    for (const item of cart.items) {
      await Inventory.increment(
        { reservedQuantity: item.quantity },
        {
          where: {
            productId: item.productId,
            variantId: item.variantId || null,
          },
          transaction: t,
        },
      );
    }

    return order;
  });

  return { data: result };
};

// ==========================
// GET SINGLE ORDER
// ==========================

export const getOrderService = async ({ orderId, userId }) => {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: OrderItem, as: "items" }],
  });

  if (!order) {
    throw new AppError(ORDER_MESSAGES.ORDER_NOT_FOUND, 404);
  }

  return { data: order };
};

// ==========================
// GET ALL ORDERS FOR USER
// ==========================

export const getUserOrdersService = async (userId) => {
  const orders = await Order.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  return { data: orders };
};

export const AUTH_MESSAGES = {
  // User
  USER_EXISTS: "User already exists.",
  USER_NOT_FOUND: "User not found.",

  // Authentication
  INVALID_PASSWORD: "Invalid password.",
  VERIFY_ACCOUNT: "Verify your account first.",
  ACCOUNT_BLOCKED: "Account blocked.",

  // OTP
  OTP_SENT: "OTP sent successfully.",
  OTP_RESENT: "OTP resent successfully.",
  OTP_EXPIRED: "OTP expired.",
  INVALID_OTP: "Invalid OTP.",
  SIGNUP_EXPIRED: "Signup session expired.",

  // Account
  ACCOUNT_CREATED: "Account created successfully.",
  WELCOME: "Welcome.",

  // Password
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  OLD_PASSWORD_INCORRECT: "Old password is incorrect.",
  SAME_PASSWORD: "New password must be different from the old password.",
  PASSWORD_CHANGED: "Password changed successfully.",
  PASSWORD_RESET_LINK: "Password reset link sent successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successful.",
  INVALID_RESET_TOKEN: "Reset link expired or invalid.",

  // Profile
  PROFILE_FETCHED: "Profile fetched successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
};

export const CATEGORY_MESSAGES = {
  CATEGORIES_FETCHED: "Categories fetched successfully.",
  CATEGORY_FETCHED: "Category fetched successfully.",
  CHILD_CATEGORIES_FETCHED: "Child categories fetched successfully.",
  CATEGORY_BY_SLUG_FETCHED: "Category fetched successfully by slug.",
  CATEGORY_NOT_FOUND: "Category not found.",

  CATEGORY_FETCH_FAILED: "Failed to fetch category.",
};

export const PRODUCT_MESSAGES = {
  PRODUCTS_FETCHED: "Products fetched successfully",
  FEATURED_PRODUCTS_FETCHED: "Featured products fetched successfully",
  PRODUCT_FETCHED: "Product fetched successfully",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_FETCH_FAILED: "Failed to fetch product(s)",
};

export const BRAND_MESSAGES = {
  BRANDS_FETCHED: "Brands fetched successfully.",
  FEATURED_BRANDS_FETCHED: "Featured brands fetched successfully.",
  BRAND_FETCHED: "Brand fetched successfully.",

  BRAND_NOT_FOUND: "Brand not found.",

  BRAND_FETCH_FAILED: "Failed to fetch brand.",
};

export const CART_MESSAGES = {
  CART_CREATED: "Cart created successfully",

  CART_FETCHED: "Cart fetched successfully",
  CART_NOT_FOUND: "Cart not found",

  CART_ITEM_ADDED: "Item added to cart",
  CART_ITEM_REMOVED: "Item removed from cart",
  CART_ITEM_NOT_FOUND: "Cart item not found",

  CART_UPDATED: "Cart updated successfully",
  CART_CLEARED: "Cart cleared successfully",

  PRODUCT_NOT_FOUND: "Product not found",
  VARIANT_NOT_FOUND: "Product variant not found",

  CART_ADD_FAILED: "Failed to add item to cart",
  CART_FETCH_FAILED: "Failed to fetch cart",
  CART_UPDATE_FAILED: "Failed to update cart",
  CART_REMOVE_FAILED: "Failed to remove cart item",
  CART_CLEAR_FAILED: "Failed to clear cart",
};

export const WISHLIST_MESSAGES = {
  ADDED: "Product added to wishlist.",
  FETCHED: "Wishlist fetched successfully.",
  REMOVED: "Product removed from wishlist.",

  PRODUCT_NOT_FOUND: "Product not found.",
  ALREADY_IN_WISHLIST: "Product already in wishlist.",
  NOT_FOUND: "Wishlist item not found.",

  ADD_FAILED: "Failed to add product to wishlist.",
  FETCH_FAILED: "Failed to fetch wishlist.",
  REMOVE_FAILED: "Failed to remove wishlist item.",
};

export const ADDRESS_MESSAGES = {
  CREATED: "Address added successfully.",
  FETCHED: "Address fetched successfully.",
  UPDATED: "Address updated successfully.",
  DELETED: "Address deleted successfully.",
  DEFAULT_UPDATED: "Default address updated successfully.",

  NOT_FOUND: "Address not found.",

  CREATE_FAILED: "Failed to create address.",
  FETCH_FAILED: "Failed to fetch address.",
  UPDATE_FAILED: "Failed to update address.",
  DELETE_FAILED: "Failed to delete address.",
};

export const ORDER_MESSAGES = {
  ORDER_CREATED: "Order created successfully",
  ORDER_FETCHED: "Order fetched successfully",
  ORDER_LIST_FETCHED: "Orders fetched successfully",
  ORDER_CANCELLED: "Order cancelled successfully",

  CART_EMPTY: "Your cart is empty",
  ADDRESS_NOT_FOUND: "Address not found",
  ORDER_NOT_FOUND: "Order not found",
  ORDER_ALREADY_PAID: "Order is already paid",
  INSUFFICIENT_STOCK: "One or more items are out of stock",
};

export const PAYMENT_MESSAGES = {
  PAYMENT_INITIATED: "Payment initiated successfully",
  PAYMENT_VERIFIED: "Payment verified successfully",
  PAYMENT_FAILED: "Payment verification failed",

  ORDER_NOT_FOUND: "Order not found",
  PAYMENT_NOT_FOUND: "Payment record not found",
  ORDER_ALREADY_PAID: "Order is already paid",
  INVALID_SIGNATURE: "Invalid payment signature",
  WEBHOOK_INVALID_SIGNATURE: "Invalid webhook signature",
  WEBHOOK_PROCESSED: "Webhook processed",
};
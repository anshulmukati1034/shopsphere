// Generates a human-readable order number like "ORD-20260627-9F3K2"
// Format: ORD-YYYYMMDD-RANDOM5
export const generateOrderNumber = () => {
  const date = new Date();

  const datePart =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `ORD-${datePart}-${randomPart}`;
};
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_COST = 99;

export function calculateShipping(subtotal: number) {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_COST;
}

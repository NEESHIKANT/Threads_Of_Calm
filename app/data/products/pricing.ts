import type { Product } from "./types";

const amountInRupees = (price: string) => Number(price.replace(/[^\d]/g, ""));

export function getProductTotalPrice(product: Product, quantity: number): number {
  if (quantity <= 0) return 0;

  const options = product.bundleOptions ?? [{ quantity: 1, price: product.price, label: "Buy 1" }];
  const totals = Array<number>(quantity + 1).fill(Number.POSITIVE_INFINITY);
  totals[0] = 0;

  for (let count = 1; count <= quantity; count += 1) {
    for (const option of options) {
      if (option.quantity <= count) {
        totals[count] = Math.min(
          totals[count],
          totals[count - option.quantity] + amountInRupees(option.price),
        );
      }
    }
  }

  return totals[quantity];
}

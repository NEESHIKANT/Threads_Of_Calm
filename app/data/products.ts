import { bagCharmProducts } from "./products/bag-charms";
import { bookmarkProducts } from "./products/bookmarks";
import { carCharmProducts } from "./products/car-charms";
import { earringProducts } from "./products/earrings";
import { fridgeMagnetProducts } from "./products/fridge-magnets";
import { homeDecorProducts } from "./products/home-decor";
import { keyChainProducts } from "./products/key-chains";
import { petProductProducts } from "./products/pet-products";

export type { Product, ProductCategory } from "./products/types";

// Product order here controls the order shown in both the homepage and catalog.
export const products = [
  ...fridgeMagnetProducts,
  ...homeDecorProducts,
  ...bagCharmProducts,
  ...keyChainProducts,
  ...carCharmProducts,
  ...petProductProducts,
  ...earringProducts,
  ...bookmarkProducts,
];

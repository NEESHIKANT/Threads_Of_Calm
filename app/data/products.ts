import { bagCharmProducts } from "./products/bag-charms";
import { fridgeMagnetProducts } from "./products/fridge-magnets";
import { homeDecorProducts } from "./products/home-decor";
import { keyChainProducts } from "./products/key-chains";

export type { Product, ProductCategory } from "./products/types";

// Product order here controls the order shown in both the homepage and catalog.
export const products = [...fridgeMagnetProducts, ...homeDecorProducts, ...bagCharmProducts, ...keyChainProducts];

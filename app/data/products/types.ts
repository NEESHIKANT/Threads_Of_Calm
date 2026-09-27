export type ProductCategory = "Home Décor" | "Bag Charms" | "Fridge Magnets" | "Key Chains";

export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: ProductCategory;
  categoryAnchor?: string;
  description: string;
};

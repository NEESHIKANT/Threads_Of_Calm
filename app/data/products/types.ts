export type ProductCategory = "Home Décor" | "Bag Charms" | "Fridge Magnets" | "Key Chains" | "Car Charms" | "Pet Products" | "Earrings" | "Bookmarks";

export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: ProductCategory;
  categoryAnchor?: string;
  description: string;
};

export type ProductCategory = "Home Décor" | "Bag Charms" | "Fridge Magnets" | "Key Chains" | "Car Charms" | "Pet Products" | "Earrings" | "Bookmarks" | "Accessories";

export type ProductBundleOption = {
  label: string;
  quantity: number;
  price: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  images?: string[];
  category: ProductCategory;
  categoryAnchor?: string;
  description: string;
  bundleOptions?: ProductBundleOption[];
};

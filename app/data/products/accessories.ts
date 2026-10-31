import type { Product } from "./types";

export const accessoryProducts: Product[] = [
  {
    id: "lilac-pearl-hair-clips",
    name: "Lilac Pearl Hair Clips",
    price: "₹59",
    image: "/product_images/accessories/Lilac Pearl Hair Clips.png",
    category: "Accessories",
    categoryAnchor: "category-accessories",
    description: "A delicate pair of crochet flower hair clips in soft lilac, finished with tiny pearl centres. 💜",
  },
  {
    id: "pearl-petal-hair-accessory",
    name: "Pearl Petal Hair Accessory",
    price: "₹89",
    image: "/product_images/accessories/Pearl Petal Hair Accessory1.png",
    images: [
      "/product_images/accessories/Pearl Petal Hair Accessory1.png",
      "/product_images/accessories/Pearl Petal Hair Accessory.png",
    ],
    category: "Accessories",
    categoryAnchor: "category-accessories",
    description: "A fluffy ivory crochet flower, finished with a delicate pearl at its centre.Available as a hairband or a hair clip. 🤍",
  },
  {
    id: "vanilla-bow-scrunchie",
    name: "Vanilla Bow Scrunchie",
    price: "₹129",
    image: "/product_images/accessories/Vanilla Bow Scrunchie1.png",
    images: [
      "/product_images/accessories/Vanilla Bow Scrunchie1.png",
      "/product_images/accessories/Vanilla Bow Scrunchie.png",
    ],
    category: "Accessories",
    categoryAnchor: "category-accessories",
    description: "A soft ivory crochet bow that adds a sweet, timeless touch to your everyday hairstyle 🤍",
  },


];

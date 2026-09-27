# Product details by category

Product information is organized into one file per category:

- `home-decor.ts`
- `bag-charms.ts`
- `fridge-magnets.ts`

To add a product, append an entry to the matching array. Each entry needs a unique `id`, display `name`, `price` (for example `"₹299"`), `image` path, `category`, and a short `description`. Set `categoryAnchor` on the first item in a category so the homepage Categories menu can jump to it. Product order in `app/data/products.ts` controls the display order.

Put the image in the matching folder under `public/product_images/`, then reference it with a leading slash, for example `"/product_images/home-decor/Daisy Crochet Pot.png"`. The shared catalog feeds both the homepage and `/shop` page automatically.

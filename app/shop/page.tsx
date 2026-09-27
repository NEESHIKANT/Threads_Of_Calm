"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { products, type Product, type ProductCategory } from "../data/products";

type CartItem = Product & { quantity: number };

const categoryOptions: Array<"All" | ProductCategory> = [
  "All",
  "Home Décor",
  "Bag Charms",
  "Fridge Magnets",
  "Key Chains",
];

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const nextCategory = urlCategory && categoryOptions.includes(urlCategory as "All" | ProductCategory)
      ? (urlCategory as "All" | ProductCategory)
      : "All";
    setSelectedCategory(nextCategory);
  }, [searchParams]);

  const filteredProducts = selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + Number(item.price.replace(/[^\d]/g, "")) * item.quantity, 0);

  const updateCategory = (value: "All" | ProductCategory) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const nextUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    router.push(nextUrl);
  };

  const changeQuantity = (product: Product, change: number) => {
    setCart((items) => {
      const current = items.find((item) => item.name === product.name);
      if (!current && change > 0) return [...items, { ...product, quantity: 1 }];
      return items
        .map((item) => item.name === product.name ? { ...item, quantity: item.quantity + change } : item)
        .filter((item) => item.quantity > 0);
    });
  };
  const checkoutMessage = encodeURIComponent(`Hi! I’d like to order:\n${cart.map((item) => `${item.quantity} × ${item.name} (${item.price})`).join("\n")}\nTotal: ₹${cartTotal}`);

  return (
    <main>
      <nav className="nav">
        <Link className="brand" href="/" aria-label="Threads of Calm home">
          <img src="/logo.png" alt="Threads of Calm logo" />
        </Link>
        <div className="links">
          <Link href="/">Home</Link>
          <Link className="active" href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <div className="nav-dropdown">
            <Link className="category-trigger" href="/shop" aria-haspopup="true">Categories <span aria-hidden="true">⌄</span></Link>
            <div className="category-menu">
              <Link href="/shop?category=Home%20D%C3%A9cor">Home Décor <small>Wall hangings & crochet pots</small></Link>
              <Link href="/shop?category=Bag%20Charms">Bag Charms <small>Little handmade accessories</small></Link>
              <Link href="/shop?category=Fridge%20Magnets">Fridge Magnets <small>Cheerful handmade keepsakes</small></Link>
              <Link href="/shop?category=Key%20Chains">Key Chains <small>Bright daily carry accessories</small></Link>
            </div>
          </div>
          <Link href="/#contact">Contact</Link>
        </div>
        <div className="actions">
          <button className="cart" aria-label="Cart" aria-expanded={cartOpen} onClick={() => setCartOpen((open) => !open)}>🛒<b>{cartCount}</b></button>
          <Link className="whatsapp" href="https://wa.me/+919556029097">◉ &nbsp; Order on WhatsApp</Link>
        </div>
        {cartOpen && (
          <div className="cart-popover">
            <div className="cart-heading"><strong>Your basket</strong><button aria-label="Close basket" onClick={() => setCartOpen(false)}>×</button></div>
            {cart.length === 0 ? <p className="cart-empty">Your basket is empty. Add a handmade piece to get started.</p> : <>
              <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.name}>
                <img src={item.image} alt="" />
                <div className="cart-item-info"><strong>{item.name}</strong><span>{item.price} each</span>
                  <div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item, 1)}>+</button></div>
                </div>
                <b className="cart-line-total">₹{Number(item.price.replace(/[^\d]/g, "")) * item.quantity}</b>
              </div>)}</div>
              <div className="cart-total"><span>Subtotal</span><strong>₹{cartTotal}</strong></div>
              <a className="cart-checkout" href={`https://wa.me/9556029097?text=${checkoutMessage}`}>Checkout on WhatsApp →</a>
            </>}
          </div>
        )}
      </nav>

      <section className="all-products-page">
        <header className="all-products-heading">
          <p className="eyebrow">MADE WITH CALM, STITCHED WITH LOVE</p>
          <h1>All Handmade Pieces <span>〰</span></h1>
          <p>Browse the full collection of thoughtful crochet gifts, accessories, and home décor.</p>
        </header>

        <div className="all-products-filter">
          <label htmlFor="categoryFilter">Filter by category</label>
          <select id="categoryFilter" value={selectedCategory} onChange={(event) => updateCategory(event.target.value as "All" | ProductCategory)}>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category === "All" ? "All categories" : category}</option>
            ))}
          </select>
        </div>

        <div className="all-products-grid">
          {filteredProducts.length === 0 ? (
            <p className="empty-search">No handmade pieces are available in this category yet.</p>
          ) : (
            filteredProducts.map((product) => (
              <article className="product all-product" key={product.name}>
                <img src={product.image} alt={product.name} />
                <div className="all-product-info">
                  <span className="product-category">{product.category}</span>
                  <h2>{product.name}</h2>
                  <p className="all-product-description">{product.description}</p>
                  <strong>{product.price}</strong>
                  {(() => {
                    const item = cart.find((cartItem) => cartItem.name === product.name);
                    return item ? (
                      <div className="quantity-control product-quantity">
                        <button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product, 1)}>+</button>
                      </div>
                    ) : (
                      <button className="product-order" onClick={() => changeQuantity(product, 1)}>🛒 &nbsp; Add to Cart</button>
                    );
                  })()}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<main><div style={{ padding: "2rem", textAlign: "center" }}>Loading shop...</div></main>}>
      <ShopPageContent />
    </Suspense>
  );
}

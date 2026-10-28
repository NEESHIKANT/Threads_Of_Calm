"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products, type Product } from "../data/products";
import { getProductTotalPrice } from "../data/products/pricing";

type CartItem = Product & { quantity: number };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasHydratedCart, setHasHydratedCart] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("threads-of-calm-cart");
      setCart(savedCart
        ? (JSON.parse(savedCart) as CartItem[]).map((item) => {
          const currentProduct = products.find((product) => product.id === item.id);
          return currentProduct ? { ...item, ...currentProduct } : item;
        })
        : []);
    } catch {
      localStorage.removeItem("threads-of-calm-cart");
      setCart([]);
    } finally {
      setHasHydratedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedCart) return;
    localStorage.setItem("threads-of-calm-cart", JSON.stringify(cart));
  }, [cart, hasHydratedCart]);

  const changeQuantity = (product: Product, change: number) => {
    setCart((items) => items
      .map((item) => item.id === product.id
        ? { ...item, ...product, quantity: item.quantity + change }
        : item)
      .filter((item) => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => total + getProductTotalPrice(item, item.quantity), 0);
  const checkoutMessage = encodeURIComponent(`Hi! I’d like to order:\n${cart.map((item) => `${item.quantity} × ${item.name} — ₹${getProductTotalPrice(item, item.quantity)}`).join("\n")}`);

  return (
    <main>
      <nav className="nav cart-page-nav">
        <Link className="brand" href="/" aria-label="Threads of Calm home">
          <img src="/logo.png" alt="Threads of Calm logo" />
        </Link>
        <div className="links">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
        </div>
        <Link className="whatsapp" href="/shop">Continue shopping</Link>
      </nav>

      <section className="cart-page">
        <div className="cart-page-heading">
          <p className="eyebrow">YOUR HANDMADE FINDS</p>
          <h1>Your basket</h1>
          <p>Review your pieces before placing your order.</p>
        </div>

        {!hasHydratedCart ? (
          <p className="cart-page-loading" role="status">Loading your basket...</p>
        ) : cart.length === 0 ? (
          <div className="cart-page-empty">
            <p>Your basket is empty for now.</p>
            <Link className="cart-page-continue" href="/shop">Browse handmade pieces</Link>
          </div>
        ) : (
          <div className="cart-page-layout">
            <div className="cart-page-items">
              {cart.map((item) => (
                <article className="cart-page-item" key={item.id}>
                  <Link className="cart-page-image" href={`/product/${item.id}`} aria-label={`View ${item.name}`}>
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 600px) 25vw, 140px" />
                  </Link>
                  <div className="cart-page-item-info">
                    <p className="product-detail-category">{item.category}</p>
                    <h2><Link href={`/product/${item.id}`}>{item.name}</Link></h2>
                    <p className="cart-page-unit-price">{item.price} each</p>
                    <div className="cart-page-item-actions">
                      <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                        <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button type="button" aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item, 1)}>+</button>
                      </div>
                      <button className="cart-remove" type="button" onClick={() => changeQuantity(item, -item.quantity)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong className="cart-page-line-total">₹{getProductTotalPrice(item, item.quantity)}</strong>
                </article>
              ))}
            </div>

            <aside className="cart-page-summary">
              <h2>Order summary</h2>
              <div><span>Items</span><strong>{cart.reduce((count, item) => count + item.quantity, 0)}</strong></div>
              <div className="cart-page-subtotal"><span>Subtotal</span><strong>₹{cartTotal}</strong></div>
              <p>Shipping and any customisation details can be confirmed on WhatsApp.</p>
              <a className="cart-checkout" href={`https://wa.me/9040710818?text=${checkoutMessage}`}>
                Place order on WhatsApp →
              </a>
              <Link className="cart-page-continue" href="/shop">Continue shopping</Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { products, type Product } from "../../data/products";
import { getProductTotalPrice } from "../../data/products/pricing";

type CartItem = Product & { quantity: number };

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedQuantity, setAddedQuantity] = useState(0);
  const videoIndex = product && product.video ? (product.images?.length ? product.images.length : 1) : -1;
  const gallerySlides = product ? [
    ...(product.images?.length ? product.images : [product.image]),
    ...(product.video ? [product.video] : []),
  ].map((src, index) => ({
    id: `${product.id}-${index}`,
    src,
    isVideo: product.video ? index === videoIndex : false,
  })) : [];

  const gallerySlide = gallerySlides[imageIndex] ?? gallerySlides[0];

  const addToCart = (amount: number) => {
    if (!product) return;

    let cart: CartItem[] = [];
    try {
      cart = JSON.parse(localStorage.getItem("threads-of-calm-cart") ?? "[]") as CartItem[];
    } catch {
      cart = [];
    }

    const currentItem = cart.find((item) => item.id === product.id);
    const nextCart = currentItem
      ? cart.map((item) => item.id === product.id
        ? { ...item, ...product, quantity: item.quantity + amount }
        : item)
      : [...cart, { ...product, quantity: amount }];

    localStorage.setItem("threads-of-calm-cart", JSON.stringify(nextCart));
    setAddedQuantity(amount);
  };

  if (!product) {
    return (
      <main className="product-detail-page">
        <p>This handmade piece could not be found.</p>
        <Link className="product-back-link" href="/shop">Back to the shop</Link>
      </main>
    );
  }

  return (
    <main>
      <nav className="nav product-detail-nav">
        <Link className="brand" href="/" aria-label="Threads of Calm home">
          <img src="/logo.png" alt="Threads of Calm logo" />
        </Link>
        <div className="links">
          <Link href="/">Home</Link>
          <Link className="active" href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
        </div>
        <Link className="whatsapp" href="/cart">Basket &amp; checkout</Link>
      </nav>

      <section className="product-detail-page">
        <div className="product-detail-breadcrumbs">
          <Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>{product.category}</span>
        </div>
        <div className="product-detail-layout">
          <div className="product-detail-gallery">
            <div className="product-detail-main-image">
              {gallerySlide?.isVideo ? (
                <video
                  key={gallerySlide.src}
                  src={gallerySlide.src}
                  controls
                  playsInline
                  autoPlay
                  muted
                  className="product-detail-main-video"
                />
              ) : (
                <Image src={gallerySlide.src} alt={product.name} fill priority sizes="(max-width: 700px) 94vw, 55vw" />
              )}
            </div>
            {gallerySlides.length > 1 && (
              <>
                <button
                  type="button"
                  className="product-detail-gallery-arrow previous"
                  aria-label="Previous product media"
                  onClick={() => setImageIndex((index) => (index - 1 + gallerySlides.length) % gallerySlides.length)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="product-detail-gallery-arrow next"
                  aria-label="Next product media"
                  onClick={() => setImageIndex((index) => (index + 1) % gallerySlides.length)}
                >
                  ›
                </button>
              </>
            )}
            {gallerySlides.length > 1 && (
              <div className="product-detail-thumbnails" aria-label="Product gallery">
                {gallerySlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={index === imageIndex ? "selected" : slide.isVideo ? "video-thumb" : ""}
                    aria-label={slide.isVideo ? `View product video ${index + 1}` : `View product image ${index + 1}`}
                    aria-pressed={index === imageIndex}
                    onClick={() => setImageIndex(index)}
                  >
                    {slide.isVideo ? (
                      <span className="product-detail-video-label">Video</span>
                    ) : (
                      <Image src={slide.src} alt="" fill sizes="72px" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <p className="product-detail-category">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-price">{product.price}</p>
            <p className="product-detail-description">{product.description}</p>

            {product.bundleOptions && (
              <div className="product-detail-bundles">
                <h2>Bundle prices</h2>
                {product.bundleOptions.map((option) => (
                  <button key={option.label} type="button" onClick={() => addToCart(option.quantity)} aria-label={`Add ${option.label} bundle to basket for ${option.price}`}>
                    <span>Add {option.label} to basket</span><strong>{option.price}</strong>
                  </button>
                ))}
              </div>
            )}

            <div className="product-detail-quantity">
              <span>Quantity</span>
              <div className="quantity-control">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)}>+</button>
              </div>
              <strong>₹{getProductTotalPrice(product, quantity)} total</strong>
            </div>
            <button className="product-detail-add" type="button" onClick={() => addToCart(quantity)}>
              Add to basket
            </button>
            {addedQuantity > 0 && (
              <div className="product-detail-confirmation" role="status">
                <span>{addedQuantity} {addedQuantity === 1 ? "item" : "items"} added to your basket.</span>
                <Link href="/cart">View basket &amp; checkout</Link>
              </div>
            )}
            <p className="product-detail-note">Handmade with care. Contact us for custom colours or gifting requests.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
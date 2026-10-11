"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { products, type Product, type ProductCategory } from "../data/products";
import { getProductTotalPrice } from "../data/products/pricing";

type CartItem = Product & { quantity: number };

const categoryOptions: Array<"All" | ProductCategory> = [
  "All",
  "Home Décor",
  "Bag Charms",
  "Fridge Magnets",
  "Key Chains",
  "Car Charms",
  "Pet Products",
  "Earrings",
  "Bookmarks",
  "Accessories",
];

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasHydratedCart, setHasHydratedCart] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [bundleOpenProduct, setBundleOpenProduct] = useState<string | null>(null);
  const [productImageIndexes, setProductImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    if (!hasHydratedCart || typeof window === "undefined") return;
    localStorage.setItem("threads-of-calm-cart", JSON.stringify(cart));
  }, [cart, hasHydratedCart]);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const nextCategory = urlCategory && categoryOptions.includes(urlCategory as "All" | ProductCategory)
      ? (urlCategory as "All" | ProductCategory)
      : "All";
    setSelectedCategory(nextCategory);
  }, [searchParams]);

  const filteredProducts = selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + getProductTotalPrice(item, item.quantity), 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateCategory = (value: "All" | ProductCategory) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    const nextUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    setMobileMenuOpen(false);
    router.push(nextUrl);
  };

  const changeQuantity = (product: Product, change: number) => {
    setCart((items) => {
      const current = items.find((item) => item.id === product.id);
      if (!current && change > 0) return [...items, { ...product, quantity: change }];
      return items
        .map((item) => item.id === product.id ? { ...item, ...product, quantity: item.quantity + change } : item)
        .filter((item) => item.quantity > 0);
    });
  };
  const checkoutMessage = encodeURIComponent(`Hi! I’d like to order:\n${cart.map((item) => `${item.quantity} × ${item.name} — ₹${getProductTotalPrice(item, item.quantity)}`).join("\n")}`);

  return (
    <main>
      <nav className="nav">
        <Link className="brand" href="/" aria-label="Threads of Calm home" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Threads of Calm logo" />
        </Link>
        <button
          className="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link className="active" href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <div className="nav-dropdown">
            <Link className="category-trigger" href="/shop" aria-haspopup="true" onClick={() => setMobileMenuOpen(false)}>Categories <span aria-hidden="true">⌄</span></Link>
            <div className="category-menu">
              <Link href="/shop?category=Home%20D%C3%A9cor" onClick={() => setMobileMenuOpen(false)}>Home Décor <small>Wall hangings & crochet pots</small></Link>
              <Link href="/shop?category=Bag%20Charms" onClick={() => setMobileMenuOpen(false)}>Bag Charms <small>Little handmade accessories</small></Link>
              <Link href="/shop?category=Fridge%20Magnets" onClick={() => setMobileMenuOpen(false)}>Fridge Magnets <small>Cheerful handmade keepsakes</small></Link>
              <Link href="/shop?category=Key%20Chains" onClick={() => setMobileMenuOpen(false)}>Key Chains <small>Bright daily carry accessories</small></Link>
              <Link href="/shop?category=Car%20Charms" onClick={() => setMobileMenuOpen(false)}>Car Charms <small>Bright accessories for your ride</small></Link>
              <Link href="/shop?category=Pet%20Products" onClick={() => setMobileMenuOpen(false)}>Pet Products <small>Cozy handmade pieces for pets</small></Link>
              <Link href="/shop?category=Earrings" onClick={() => setMobileMenuOpen(false)}>Earrings <small>Lightweight crochet accessories</small></Link>
              <Link href="/shop?category=Bookmarks" onClick={() => setMobileMenuOpen(false)}>Bookmarks <small>Pretty little reading companions</small></Link>
              <Link href="/shop?category=Accessories" onClick={() => setMobileMenuOpen(false)}>Accessories <small>Handmade crochet extras</small></Link>
            </div>
          </div>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
        <div className="actions">
          <button className="cart" aria-label="Cart" aria-expanded={cartOpen} onClick={() => setCartOpen((open) => !open)}>🛒<b>{cartCount}</b></button>
          <Link className="whatsapp" href="https://wa.me/9040710818?text=Hi%20Sandhya%2C%20I%20want%20to%20know%20more%20about%20your%20products%20and%20pricing.%20Can%20you%20please%20help%20me%3F" onClick={() => setMobileMenuOpen(false)}>◉ &nbsp; Custom Orders</Link>
        </div>
        {cartOpen && (
          <div className="cart-popover">
            <div className="cart-heading"><strong>Your basket</strong><button aria-label="Close basket" onClick={() => setCartOpen(false)}>×</button></div>
            {cart.length === 0 ? <p className="cart-empty">Your basket is empty. Add a handmade piece to get started.</p> : <>
              <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.name}>
                <img src={item.image} alt="" />
                <div className="cart-item-info"><strong>{item.name}</strong><span>{item.quantity} item{item.quantity === 1 ? "" : "s"}</span>
                  <div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item, 1)}>+</button></div>
                </div>
                <b className="cart-line-total">₹{getProductTotalPrice(item, item.quantity)}</b>
              </div>)}</div>
              <div className="cart-total"><span>Subtotal</span><strong>₹{cartTotal}</strong></div>
              <a className="cart-checkout" href={`https://wa.me/9040710818?text=${checkoutMessage}`}>Checkout on WhatsApp →</a>
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
                {product.images && product.images.length > 1 ? (
                  <div className="product-image-carousel">
                    <img
                      src={product.images[productImageIndexes[product.id] ?? 0]}
                      alt={product.name}
                    />
                    <button
                      className="product-image-arrow previous"
                      type="button"
                      aria-label={`Previous ${product.name} image`}
                      onClick={() => setProductImageIndexes((indexes) => ({
                        ...indexes,
                        [product.id]: ((indexes[product.id] ?? 0) - 1 + product.images!.length) % product.images!.length,
                      }))}
                    >
                      ‹
                    </button>
                    <button
                      className="product-image-arrow next"
                      type="button"
                      aria-label={`Next ${product.name} image`}
                      onClick={() => setProductImageIndexes((indexes) => ({
                        ...indexes,
                        [product.id]: ((indexes[product.id] ?? 0) + 1) % product.images!.length,
                      }))}
                    >
                      ›
                    </button>
                  </div>
                ) : (
                  <img src={product.image} alt={product.name} />
                )}
                <div className="all-product-info">
                  <span className="product-category">{product.category}</span>
                  <h2>{product.name}</h2>
                  <p className="all-product-description">{product.description}</p>
                  <strong>{product.price}</strong>
                  {(() => {
                    const item = cart.find((cartItem) => cartItem.name === product.name);
                    if (product.bundleOptions && !item) {
                      const showBundleOptions = bundleOpenProduct === product.name;
                      return (
                        <>
                          <button
                            className="product-order"
                            type="button"
                            onClick={() => setBundleOpenProduct((current) => current === product.name ? null : product.name)}
                          >
                            🛒 &nbsp; Add to Cart
                          </button>
                          {showBundleOptions && (
                            <div className="product-bundle-options">
                              {product.bundleOptions.map((option) => (
                                <button
                                  key={`${product.name}-${option.label}`}
                                  className="product-bundle-option"
                                  onClick={() => {
                                    setBundleOpenProduct(null);
                                    changeQuantity(product, option.quantity);
                                  }}
                                  type="button"
                                >
                                  {option.label} · {option.price}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    }
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

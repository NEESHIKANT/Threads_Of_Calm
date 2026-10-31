"use client";

import Link from "next/link";
import Image from "next/image";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getProductSlides = (product: Product) => {
    const videoIndex = product.video ? (product.images?.length ? product.images.length : 1) : -1;
    return [
      ...(product.images?.length ? product.images : [product.image]),
      ...(product.video ? [product.video] : []),
    ].map((src, index) => ({
      id: `${product.id}-${index}`,
      src,
      isVideo: product.video ? index === videoIndex : false,
    }));
  };

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
          <Link className="cart" href="/cart" aria-label={`View cart, ${cartCount} items`}>🛒<b>{cartCount}</b></Link>
          <Link className="whatsapp" href="https://wa.me/9040710818?text=Hi%20Sandhya%2C%20I%20want%20to%20know%20more%20about%20your%20products%20and%20pricing.%20Can%20you%20please%20help%20me%3F" onClick={() => setMobileMenuOpen(false)}>◉ &nbsp; Custom Orders</Link>
        </div>
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
            filteredProducts.map((product) => {
              const productSlides = getProductSlides(product);
              const currentSlideIndex = productImageIndexes[product.id] ?? 0;
              const currentSlide = productSlides[currentSlideIndex] ?? productSlides[0];

              return (
                <article className="product all-product" key={product.name}>
                  {productSlides.length > 1 ? (
                    <div className="product-image-carousel">
                      {currentSlide.isVideo ? (
                        <video
                          src={currentSlide.src}
                          className="product-card-video"
                          controls
                          playsInline
                          muted
                        />
                      ) : (
                        <Image
                          src={currentSlide.src}
                          alt={product.name}
                          fill
                          sizes="(max-width: 600px) 94vw, (max-width: 900px) 46vw, 31vw"
                        />
                      )}
                      <button
                        className="product-image-arrow previous"
                        type="button"
                        aria-label={`Previous ${product.name} media`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setProductImageIndexes((indexes) => ({
                            ...indexes,
                            [product.id]: ((indexes[product.id] ?? 0) - 1 + productSlides.length) % productSlides.length,
                          }));
                        }}
                      >
                        ‹
                      </button>
                      <button
                        className="product-image-arrow next"
                        type="button"
                        aria-label={`Next ${product.name} media`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setProductImageIndexes((indexes) => ({
                            ...indexes,
                            [product.id]: ((indexes[product.id] ?? 0) + 1) % productSlides.length,
                          }));
                        }}
                      >
                        ›
                      </button>
                    </div>
                  ) : (
                    <Link className="product-card-image-link" href={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={800}
                        height={800}
                        sizes="(max-width: 600px) 94vw, (max-width: 900px) 46vw, 31vw"
                      />
                    </Link>
                  )}
                <div className="all-product-info">
                  <span className="product-category">{product.category}</span>
                  <h2><Link href={`/product/${product.id}`}>{product.name}</Link></h2>
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
              );
            })
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

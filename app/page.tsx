"use client";

import { useEffect, useState } from "react";
import { products, type Product } from "./data/products";

type CartItem = Product & { quantity: number };

export default function Home() {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [hasHydratedCart, setHasHydratedCart] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const savedCart = localStorage.getItem("threads-of-calm-cart");
			setCart(savedCart ? JSON.parse(savedCart) : []);
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
	const featuredProductIds = [
		"sunshine-fridge-magnet",
		"blossom-ring-wall-hanging",
		"daisy-bloom-crochet-pot",
		"sunshine-hug-curtain-tiebacks",
		"ivory-blossom-bag-charm",
		"berry-sweet-key-chain",
	];
	const visibleProducts = products
		.filter((product) => featuredProductIds.includes(product.id))
		.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
	const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
	const cartTotal = cart.reduce((total, item) => total + Number(item.price.replace(/[^\d]/g, "")) * item.quantity, 0);

	const changeQuantity = (product: (typeof products)[number], change: number) => {
		setCart((items) => {
			const current = items.find((item) => item.name === product.name);
			if (!current && change > 0) return [...items, { ...product, quantity: 1 }];
			return items
				.map((item) => item.name === product.name ? { ...item, quantity: item.quantity + change } : item)
				.filter((item) => item.quantity > 0);
		});
	};
	const checkoutMessage = encodeURIComponent(`Hi! I’d like to order:\n${cart.map((item) => `${item.quantity} × ${item.name} (${item.price})`).join("\n")}`);
	const inquiryMessage = encodeURIComponent("Hi Sandhya, I want to know more about your products and pricing. Can you please help me?");

	return (
		<main>
			<nav className="nav">
				<a className="brand" href="/"><img src="/logo.png" alt="Threads of Calm logo" /></a>
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
					<a className="active" href="/" onClick={() => setMobileMenuOpen(false)}>Home</a>
					<a href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</a>
					<a href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
					<div className="nav-dropdown">
						<a className="category-trigger" href="/shop" aria-haspopup="true" onClick={() => setMobileMenuOpen(false)}>Categories <span aria-hidden="true">⌄</span></a>
						<div className="category-menu">
							<a href="/shop?category=Home%20D%C3%A9cor" onClick={() => setMobileMenuOpen(false)}>Home Décor <small>Wall hangings & crochet pots</small></a>
							<a href="/shop?category=Bag%20Charms" onClick={() => setMobileMenuOpen(false)}>Bag Charms <small>Little handmade accessories</small></a>
							<a href="/shop?category=Fridge%20Magnets" onClick={() => setMobileMenuOpen(false)}>Fridge Magnets <small>Cheerful handmade keepsakes</small></a>
							<a href="/shop?category=Key%20Chains" onClick={() => setMobileMenuOpen(false)}>Key Chains <small>Bright daily carry accessories</small></a>
							<a href="/shop?category=Car%20Charms" onClick={() => setMobileMenuOpen(false)}>Car Charms <small>Bright accessories for your ride</small></a>
							<a href="/shop?category=Pet%20Products" onClick={() => setMobileMenuOpen(false)}>Pet Products <small>Cozy handmade pieces for pets</small></a>
							<a href="/shop?category=Earrings" onClick={() => setMobileMenuOpen(false)}>Earrings <small>Lightweight crochet accessories</small></a>
							<a href="/shop?category=Bookmarks" onClick={() => setMobileMenuOpen(false)}>Bookmarks <small>Pretty little reading companions</small></a>
							<a href="/shop?category=Accessories" onClick={() => setMobileMenuOpen(false)}>Accessories <small>Handmade crochet extras</small></a>
						</div>
					</div>
					<a href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
				</div>
				<div className="actions">{searchOpen && <form className="nav-search" onSubmit={(event) => { event.preventDefault(); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." aria-label="Search products"/><button type="button" aria-label="Close search" onClick={() => { setQuery(""); setSearchOpen(false); }}>×</button></form>}<button aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}>⌕</button><button className="cart" aria-label="Cart" aria-expanded={cartOpen} onClick={() => setCartOpen((open) => !open)}>🛒<b>{cartCount}</b></button><a className="whatsapp" href={`https://wa.me/9040710818?text=${inquiryMessage}`}>◉ &nbsp; Custom Orders</a></div>{cartOpen && <div className="cart-popover"><div className="cart-heading"><strong>Your basket</strong><button aria-label="Close basket" onClick={() => setCartOpen(false)}>×</button></div>{cart.length === 0 ? <p className="cart-empty">Your basket is empty. Add a handmade piece to get started.</p> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.name}><img src={item.image} alt=""/><div className="cart-item-info"><strong>{item.name}</strong><span>{item.price} each</span><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item, 1)}>+</button></div></div><b className="cart-line-total">₹{Number(item.price.replace(/[^\d]/g, "")) * item.quantity}</b></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>₹{cartTotal}</strong></div><a className="cart-checkout" href={`https://wa.me/9040710818?text=${checkoutMessage}`}>Checkout on WhatsApp →</a></>}</div>}</nav>

			<section className="hero" id="home"><div className="hero-copy"><p className="eyebrow">HANDCRAFTED CROCHET CREATIONS</p><h1>Small Handmade<br />Things for a<br /><em>Happier Everyday</em> <span>〰</span></h1><p className="intro">Crochet gifts, décor and accessories<br />made with love, one stitch at a time.</p><a className="shop-btn" href="#collection">Shop Our Collection &nbsp; →</a><div className="promises"><span>♡ <small>Handmade<br />with Love</small></span><span>🎁 <small>Perfect<br />for Gifting</small></span><span>♧ <small>Pan India<br />Shipping</small></span></div></div><div className="hero-photo leaves-photo"><img src="/product_images/banner.png" alt="Threads of Calm crochet banner" /></div></section>

			<section className="collection" id="collection"><div className="section-heading"><div><h2>Our Collection <span>〰</span></h2><p>Thoughtfully handcrafted crochet products, perfect for gifting and everyday joy.</p></div><a href="/shop">View All Products &nbsp; →</a></div><div className="product-grid">{visibleProducts.map((product) => { const item = cart.find((cartItem) => cartItem.name === product.name); return <article className="product" id={product.categoryAnchor} key={product.name}><img src={product.image} alt={product.name} /><h3>{product.name}</h3><strong>{product.price}</strong>{item ? <div className="quantity-control product-quantity"><button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product, -1)}>−</button><span>{item.quantity}</span><button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product, 1)}>+</button></div> : <button onClick={() => changeQuantity(product, 1)}>🛒 &nbsp; Add to Cart</button>}</article>; })}</div>{visibleProducts.length === 0 && <p className="empty-search">No handmade pieces match that search.</p>}</section>

			<section className="contact-section" id="contact">
				<p className="eyebrow">WE’D LOVE TO HEAR FROM YOU</p>
				<h2>Get in touch <span>〰</span></h2>
				<div className="contact-options">
					<a href="https://mail.google.com/mail/?view=cm&fs=1&to=threadsofcalm1%40gmail.com" target="_blank" rel="noreferrer"><span className="contact-icon email-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3.5 5.5h17v13h-17z"/><path d="m4 7 8 6 8-6"/></svg></span><small>Email</small><strong className="contact-email">threadsofcalm1@gmail.com</strong></a>
					<a href="tel:+919040710818"><span className="contact-icon phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.1 3.8 9.8 7l-1.9 2.1a15.2 15.2 0 0 0 7 7l2.1-1.9 3.2 2.7-.9 3.4c-.2.7-.9 1.2-1.7 1.1C9.3 20.3 3.7 14.7 2.6 6.4c-.1-.8.4-1.5 1.1-1.7z"/></svg></span><small>Phone / WhatsApp</small><strong>+91 90407 10818</strong></a>
					<a href="https://www.instagram.com/my_threads_of_calm?stkn=MTR3dHVqanI5bnNqdA==" target="_blank" rel="noreferrer"><span className="social-icon instagram-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><defs><linearGradient id="instagram-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#ffb900"/><stop offset="48%" stopColor="#ff0169"/><stop offset="100%" stopColor="#7638fa"/></linearGradient></defs><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2.4"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2.2"/><circle cx="17.6" cy="6.7" r="1.35" fill="#ff3864"/></svg></span><small>Instagram</small><strong>@my_threads_of_calm</strong></a>
					<a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><span className="social-icon facebook-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.5v3.2h2.8V21h3.2Z" fill="currentColor"/></svg></span><small>Facebook</small><strong>www.facebook.com</strong></a>
				</div>
			</section>
		</main>
	);
}
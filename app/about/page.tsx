import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link className="active" href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <div className="nav-dropdown">
            <Link className="category-trigger" href="/shop" aria-haspopup="true" onClick={() => setMobileMenuOpen(false)}>Categories <span aria-hidden="true">⌄</span></Link>
            <div className="category-menu">
              <Link href="/shop?category=Home%20D%C3%A9cor" onClick={() => setMobileMenuOpen(false)}>Home Décor <small>Wall hangings & crochet pots</small></Link>
              <Link href="/shop?category=Bag%20Charms" onClick={() => setMobileMenuOpen(false)}>Bag Charms <small>Little handmade accessories</small></Link>
              <Link href="/shop?category=Fridge%20Magnets" onClick={() => setMobileMenuOpen(false)}>Fridge Magnets <small>Cheerful handmade keepsakes</small></Link>
              <Link href="/shop?category=Key%20Chains" onClick={() => setMobileMenuOpen(false)}>Key Chains <small>Bright daily carry accessories</small></Link>
            </div>
          </div>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
        <div className="actions">
          <Link className="whatsapp" href="https://wa.me/+919040710818" onClick={() => setMobileMenuOpen(false)}>◉ &nbsp; Order on WhatsApp</Link>
        </div>
      </nav>

      <section className="about-page">
        <div className="about-copy">
          <p className="eyebrow">A LITTLE ABOUT US</p>
          <h1>Made Slowly <em>Made With </em>Love</h1>
          <div className="about-story">
            <p>Hi, I’m the maker behind my Threads of Calm. Crochet has always been a part of my story. Years ago, it was my favourite creative escape, but somewhere along the way, life happened. Responsibilities grew, priorities changed, and I slowly drifted away from something I truly loved.</p>
            <p>Then one ordinary day, something changed.</p>
            <p>There was no big plan, no months of preparation or deliberation. I walked into a craft store, filled my basket with yarns, hooks, and all the little supplies that caught my eye, came home, and started crocheting again.</p>
            <p>And just like that, I found my way back.</p>
            <p><em>My Threads of Calm</em> is my little corner of peace a place where every stitch is made with patience, love, and a whole lot of heart. It’s a reminder that it’s never too late to return to something that makes you feel like yourself.</p>
            <p>Thank you to everyone who has been a part of this journey, whether you’ve encouraged me, placed an order, or simply stopped by to support my work.</p>
            <p>If you’re reading this, welcome to my world of yarns and hooks. 🌼 Thank you for being here. I look forward to creating pieces that bring smiles, warmth, and happiness into your homes, and I’ll always do my best to customise every creation to make it feel uniquely yours.</p>
          </div>
          <p className="about-signature">Sandhya</p>
          <p className="about-signoff">Made with calm, stitched with love.</p>
          <Link className="shop-btn" href="/#collection">Explore our collection &nbsp; →</Link>
        </div>
        <figure className="about-photo">
          <img src="/product_images/ME.jpg" alt="Sandhya, the maker behind My Threads of Calm" />
          <figcaption>The maker behind My Threads of Calm</figcaption>
        </figure>
      </section>
    </main>
  );
}

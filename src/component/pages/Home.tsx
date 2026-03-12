import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Truck,
  RefreshCw,
  Shield,
  Phone,
} from "lucide-react";
import FurnitureHeroSection from "../ui/FurnitureHeroSection";
import CategoryCard from "../ui/CategoryCard";
import FeaturedProductsSection from "../ui/FeaturedProductsSection";
import Seo from "../ui/Seo";

import heroVideo from "../../assets/animate-bg.mp4";

// ── Static data ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Outdoor",
  "Sale",
];

const CATEGORIES = [
  {
    name: "Sofas & Armchairs",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop",
    imageAlt: "Modern grey sectional sofa in a bright Scandinavian living room",
    href: "/sofas",
    itemCount: 48,
  },
  {
    name: "Beds & Frames",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop",
    imageAlt: "Minimalist wooden bed frame with clean white linen bedding",
    href: "/beds",
    itemCount: 32,
  },
  {
    name: "Dining & Tables",
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&fit=crop",
    imageAlt: "Solid oak dining table with matching upholstered chairs",
    href: "/dining",
    itemCount: 24,
  },
  {
    name: "Storage & Shelving",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=right",
    imageAlt: "Open wooden shelving unit filled with plants and books",
    href: "/storage",
    itemCount: 56,
  },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Fjord Lounge Chair",
    price: 1290,
    category: "Armchairs",
    description:
      "Gently curved silhouette with solid walnut legs and premium boucle upholstery.",
    imageUrl:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop",
    imageAlt: "Fjord lounge chair with walnut legs and cream boucle fabric",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    slug: "fjord-lounge-chair",
  },
  {
    id: 2,
    name: "Holm Dining Table",
    price: 2450,
    category: "Dining",
    description: "Solid white oak top on tapered legs. Seats 6 comfortably.",
    imageUrl:
      "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&q=80&fit=crop",
    imageAlt: "Holm dining table in solid white oak with tapered legs",
    rating: 4.9,
    reviewCount: 87,
    isNew: false,
    slug: "holm-dining-table",
  },
  {
    id: 3,
    name: "Tove Pendant Light",
    price: 320,
    category: "Lighting",
    description: "Hand-blown opal glass globe on a matte black canopy.",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80&fit=crop",
    imageAlt: "Tove pendant light with hand-blown opal glass globe",
    rating: 4.7,
    reviewCount: 203,
    isNew: false,
    slug: "tove-pendant-light",
  },
  {
    id: 4,
    name: "Lund Bed Frame",
    price: 1890,
    category: "Beds",
    description:
      "Low-profile platform frame in smoked oak. Queen & King sizes.",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop&crop=center",
    imageAlt: "Lund low-profile platform bed frame in smoked oak",
    rating: 4.9,
    reviewCount: 56,
    isNew: true,
    slug: "lund-bed-frame",
  },
  {
    id: 5,
    name: "Saga Modular Sofa",
    price: 3200,
    category: "Sofas",
    description: "Reconfigurable 3-piece modular sofa in natural linen.",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=left",
    imageAlt: "Saga modular sofa in natural linen with chaise configuration",
    rating: 4.6,
    reviewCount: 142,
    isNew: false,
    slug: "saga-modular-sofa",
  },
  {
    id: 6,
    name: "Nord Bookshelf",
    price: 780,
    category: "Storage",
    description: "Open-back bookshelf in lacquered birch plywood. 5 shelves.",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop",
    imageAlt: "Nord open-back bookshelf in lacquered birch plywood",
    rating: 4.5,
    reviewCount: 98,
    isNew: false,
    slug: "nord-bookshelf",
  },
  {
    id: 7,
    name: "Eken Coffee Table",
    price: 590,
    category: "Tables",
    description: "Rounded travertine top on a powder-coated steel frame.",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=bottom",
    imageAlt: "Eken coffee table with travertine top and steel frame",
    rating: 4.8,
    reviewCount: 67,
    isNew: true,
    slug: "eken-coffee-table",
  },
  {
    id: 8,
    name: "Birk Desk Chair",
    price: 640,
    category: "Office",
    description: "Ergonomic shell chair in molded plywood with chrome base.",
    imageUrl:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop&crop=right",
    imageAlt: "Birk ergonomic desk chair in molded plywood with chrome legs",
    rating: 4.7,
    reviewCount: 211,
    isNew: false,
    slug: "birk-desk-chair",
  },
];

const TRUST_ITEMS = [
  { icon: Truck, label: "Free Delivery", desc: "On all orders over $500" },
  {
    icon: RefreshCw,
    label: "30-Day Returns",
    desc: "Hassle-free return policy",
  },
  { icon: Shield, label: "5-Year Warranty", desc: "On all solid wood pieces" },
  { icon: Phone, label: "Expert Advice", desc: "Mon – Sat, 9 am – 6 pm" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function FurnitureHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(2);

  return (
    <>
      <Seo
        title="Norr Furniture"
        description="Timeless Scandinavian furniture crafted from honest materials. Shop sofas, beds, dining tables, and more — free delivery on orders over $500."
        canonical="/"
        ogImage="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&fit=crop"
      />
      <div className="min-h-screen bg-stone-50 font-sans antialiased">
        {/* ── Navbar ─────────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
          <nav
            aria-label="Main navigation"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8"
          >
            {/* Brand */}
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight text-stone-900 shrink-0"
              aria-label="Norr — home"
            >
              Norr<span className="text-stone-400">.</span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replaceAll(" ", "-")}`}
                    className={`text-sm font-medium transition-colors duration-150 ${
                      link === "Sale"
                        ? "text-rose-600 hover:text-rose-700"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                aria-label="Open search"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Cart */}
              <a
                href="/cart"
                aria-label={`Shopping cart — ${cartCount} items`}
                className="relative flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-stone-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </span>
                )}
              </a>

              {/* Mobile hamburger */}
              <button
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors duration-200 cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile menu drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-6 pt-4">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replaceAll(" ", "-")}`}
                      className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                        link === "Sale"
                          ? "text-rose-600 hover:bg-rose-50"
                          : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <main>
          {/* ── Hero ───────────────────────────────────────────────────────── */}
          <FurnitureHeroSection
            headline="Crafted for the Way You Live"
            subheadline="Timeless Scandinavian furniture, made from honest materials. Designed to last a lifetime — and feel like home from day one."
            ctaText="Shop New Arrivals"
            ctaHref="/new-arrivals"
            mediaUrl={heroVideo}
            mediaType="video"
            imageAlt="Bright, minimal living room with a stone-coloured sofa, oak coffee table, and large floor-to-ceiling windows"
            badge="Spring Collection 2026"
            secondaryCtaText="Explore All Pieces"
            secondaryCtaHref="/collections"
          />

          {/* ── Trust bar ──────────────────────────────────────────────────── */}
          <section
            aria-label="Store guarantees"
            className="bg-stone-900 text-white"
          >
            <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/10">
                    <Icon
                      className="w-4 h-4 text-stone-200"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Shop by Category ───────────────────────────────────────────── */}
          <section
            aria-label="Shop by category"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"
          >
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                  Collections
                </p>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight text-stone-900">
                  Shop by Room
                </h2>
              </div>
              <a
                href="/collections"
                className="hidden sm:inline-block text-sm text-stone-500 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-700 transition-colors duration-200 whitespace-nowrap"
              >
                View all rooms →
              </a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {CATEGORIES.map((cat) => (
                <CategoryCard
                  key={cat.href}
                  name={cat.name}
                  imageUrl={cat.imageUrl}
                  imageAlt={cat.imageAlt}
                  href={cat.href}
                  itemCount={cat.itemCount}
                />
              ))}
            </div>
          </section>

          {/* ── Featured Products ──────────────────────────────────────────── */}
          <div className="bg-white">
            <FeaturedProductsSection
              title="New Arrivals"
              subtitle="Our latest pieces — each one considered, built to last, and ready to make a space feel like yours."
              products={FEATURED_PRODUCTS}
              viewAllHref="/new-arrivals"
            />
          </div>

          {/* ── Material Callout ───────────────────────────────────────────── */}
          <section
            aria-label="Our materials"
            className="relative overflow-hidden bg-stone-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
                  Our Promise
                </p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 leading-snug mb-6">
                  Material honesty,
                  <br />
                  built into every joint.
                </h2>
                <p className="text-stone-500 leading-relaxed mb-8 max-w-md">
                  We work only with sustainably sourced solid wood, recycled
                  steel, and natural textiles. No veneers. No shortcuts. Every
                  finish is food-safe and low-VOC.
                </p>
                <a
                  href="/our-materials"
                  className="inline-block px-7 py-3.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-colors duration-200"
                >
                  Learn about our materials
                </a>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-4/3">
                <img
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&fit=crop"
                  alt="Close-up of a craftsman's hands finishing a solid walnut tabletop in the workshop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* ── CTA / Newsletter ──────────────────────────────────────────── */}
          <section
            aria-label="Newsletter sign-up"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center"
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
              Stay in touch
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-stone-900 mb-3">
              New pieces, before anyone else.
            </h2>
            <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Join our list and get early access to new collections, studio
              events, and member-only offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              aria-label="Newsletter subscription form"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Your email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-stone-400 mt-4">
              No spam. Unsubscribe at any time.
            </p>
          </section>
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="bg-stone-900 text-stone-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-white text-xl font-semibold tracking-tight mb-3">
                Norr<span className="text-stone-500">.</span>
              </p>
              <p className="text-sm leading-relaxed max-w-xs">
                Scandinavian furniture for considered living. Oslo-designed,
                sustainably made.
              </p>
            </div>

            {/* Shop column */}
            <nav aria-label="Shop navigation">
              <p className="text-white text-xs uppercase tracking-widest mb-4">
                Shop
              </p>
              <ul className="flex flex-col gap-2.5 text-sm">
                {[
                  "New Arrivals",
                  "Living Room",
                  "Bedroom",
                  "Dining",
                  "Office",
                  "Outdoor",
                  "Sale",
                ].map((l) => (
                  <li key={l}>
                    <Link
                      to={`/${l.toLowerCase().replaceAll(" ", "-")}`}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company column */}
            <nav aria-label="Company navigation">
              <p className="text-white text-xs uppercase tracking-widest mb-4">
                Company
              </p>
              <ul className="flex flex-col gap-2.5 text-sm">
                {[
                  "Our Story",
                  "Materials",
                  "Sustainability",
                  "Careers",
                  "Press",
                  "Stockists",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href={`/${l.toLowerCase().replaceAll(" ", "-")}`}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Support column */}
            <nav aria-label="Support navigation">
              <p className="text-white text-xs uppercase tracking-widest mb-4">
                Support
              </p>
              <ul className="flex flex-col gap-2.5 text-sm">
                {[
                  "FAQ",
                  "Delivery & Returns",
                  "Assembly Guides",
                  "Care Instructions",
                  "Contact Us",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href={`/${l.toLowerCase().replaceAll(" ", "-")}`}
                      className="hover:text-white transition-colors duration-150"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
              {/* Social icons */}
              <div className="flex gap-3 mt-6">
                {[
                  {
                    label: "Instagram",
                    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
                  },
                  {
                    label: "Pinterest",
                    path: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z",
                  },
                  {
                    label: "Facebook",
                    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  },
                ].map(({ label, path }) => (
                  <a
                    key={label}
                    href={`https://www.${label.toLowerCase()}.com`}
                    aria-label={`Follow Norr on ${label}`}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-stone-300"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <p>&copy; 2026 Norr Furniture AS. All rights reserved.</p>
              <div className="flex gap-5">
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors duration-150"
                >
                  Privacy Policy
                </a>
                <a
                  href="/cookie-policy"
                  className="hover:text-white transition-colors duration-150"
                >
                  Cookies
                </a>
                <a
                  href="/terms"
                  className="hover:text-white transition-colors duration-150"
                >
                  Terms of Use
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

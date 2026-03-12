// src/component/pages/CategoryPage.tsx
import { useLocation, Link } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import Seo from "../ui/Seo";
import ProductCard from "../ui/ProductCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// ── Category metadata ────────────────────────────────────────────────────────

interface CategoryMeta {
  label: string;
  slug: string;
  headline: string;
  description: string;
  seoDescription: string;
  heroImage: string;
  heroAlt: string;
  ogImage: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  "living-room": {
    label: "Living Room",
    slug: "living-room",
    headline: "Living Room Furniture",
    description:
      "Create a space that invites you to slow down. Sofas, armchairs, coffee tables, and shelving — every piece chosen for how it lives alongside you.",
    seoDescription:
      "Shop minimalist Scandinavian living room furniture at Norr — sofas, armchairs, coffee tables, and shelving crafted from solid wood and natural textiles.",
    heroImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85&fit=crop",
    heroAlt:
      "Bright Scandinavian living room with grey modular sofa, oak coffee table, and large windows",
    ogImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&fit=crop",
  },
  bedroom: {
    label: "Bedroom",
    slug: "bedroom",
    headline: "Bedroom Furniture",
    description:
      "Your bedroom is where the day ends and begins. Low-profile beds, minimal wardrobes, and bedside tables designed to calm, not clutter.",
    seoDescription:
      "Discover Norr bedroom furniture — solid wood bed frames, bedside tables, and wardrobes in a light Scandinavian style. Free delivery on orders over $500.",
    heroImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=85&fit=crop",
    heroAlt:
      "Minimalist bedroom with low smoked oak bed frame, white linen, and natural light",
    ogImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&fit=crop",
  },
  dining: {
    label: "Dining",
    slug: "dining",
    headline: "Dining Furniture",
    description:
      "Tables and chairs made for long meals and longer conversations. Solid wood tops, considered proportions, built to seat everyone.",
    seoDescription:
      "Shop Norr dining tables and chairs — solid oak and walnut designs that bring people together. Seats 4 to 10. Free UK delivery over $500.",
    heroImage:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1400&q=85&fit=crop",
    heroAlt:
      "Scandinavian dining room with solid oak table, linen chairs, and soft pendant light",
    ogImage:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80&fit=crop",
  },
  office: {
    label: "Office",
    slug: "office",
    headline: "Home Office Furniture",
    description:
      "A workspace that helps you focus. Desks, chairs, and storage built to look good all day — because you deserve an office that does too.",
    seoDescription:
      "Norr home office furniture — minimalist desks, ergonomic chairs, and smart storage. Scandinavian design that fits your workflow and your home.",
    heroImage:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1400&q=85&fit=crop",
    heroAlt:
      "Clean Scandinavian home office with oak desk, ergonomic chair, and task lamp",
    ogImage:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80&fit=crop",
  },
  outdoor: {
    label: "Outdoor",
    slug: "outdoor",
    headline: "Outdoor Furniture",
    description:
      "Furniture for outside that feels as considered as inside. Weathered teak, powder-coated steel, and all-weather fabrics built for every season.",
    seoDescription:
      "Norr outdoor furniture — Scandinavian teak and steel pieces for garden, terrace, and balcony. Weather-resistant, sustainably sourced, and beautifully made.",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&fit=crop",
    heroAlt:
      "Sunny garden terrace with Scandinavian outdoor dining table and chairs",
    ogImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&fit=crop",
  },
  sale: {
    label: "Sale",
    slug: "sale",
    headline: "Sale — Up to 40% Off",
    description:
      "End-of-season pieces at reduced prices. The same quality, the same materials — just a chance to bring Norr into your home for less.",
    seoDescription:
      "Norr furniture sale — up to 40% off selected solid wood and Scandinavian pieces. Limited stock. Free delivery on all sale orders over $500.",
    heroImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=85&fit=crop",
    heroAlt: "Minimalist living room showing sale furniture pieces from Norr",
    ogImage:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&fit=crop",
  },
};

// ── Per-category product listings ────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  slug: string;
}

const CATEGORY_PRODUCTS: Record<string, Product[]> = {
  "living-room": [
    {
      id: 101,
      name: "Saga Modular Sofa",
      price: 3200,
      category: "Sofas",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop",
      imageAlt: "Saga modular sofa in natural linen",
      rating: 4.6,
      reviewCount: 142,
      isNew: false,
      slug: "saga-modular-sofa",
    },
    {
      id: 102,
      name: "Fjord Lounge Chair",
      price: 1290,
      category: "Armchairs",
      imageUrl:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop",
      imageAlt: "Fjord lounge chair with walnut legs",
      rating: 4.8,
      reviewCount: 124,
      isNew: true,
      slug: "fjord-lounge-chair",
    },
    {
      id: 103,
      name: "Eken Coffee Table",
      price: 590,
      category: "Tables",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=bottom",
      imageAlt: "Eken coffee table with travertine top",
      rating: 4.8,
      reviewCount: 67,
      isNew: true,
      slug: "eken-coffee-table",
    },
    {
      id: 104,
      name: "Nord Bookshelf",
      price: 780,
      category: "Storage",
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop",
      imageAlt: "Nord open-back bookshelf in birch plywood",
      rating: 4.5,
      reviewCount: 98,
      isNew: false,
      slug: "nord-bookshelf",
    },
    {
      id: 105,
      name: "Tove Pendant Light",
      price: 320,
      category: "Lighting",
      imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80&fit=crop",
      imageAlt: "Tove pendant light with opal glass globe",
      rating: 4.7,
      reviewCount: 203,
      isNew: false,
      slug: "tove-pendant-light",
    },
    {
      id: 106,
      name: "Alva Side Table",
      price: 280,
      category: "Tables",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=right",
      imageAlt: "Alva side table in solid ash wood",
      rating: 4.4,
      reviewCount: 55,
      isNew: false,
      slug: "alva-side-table",
    },
  ],
  bedroom: [
    {
      id: 201,
      name: "Lund Bed Frame",
      price: 1890,
      category: "Beds",
      imageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop",
      imageAlt: "Lund low-profile platform bed in smoked oak",
      rating: 4.9,
      reviewCount: 56,
      isNew: true,
      slug: "lund-bed-frame",
    },
    {
      id: 202,
      name: "Hagen Bedside Table",
      price: 310,
      category: "Bedside Tables",
      imageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop&crop=right",
      imageAlt: "Hagen bedside table in natural oak",
      rating: 4.6,
      reviewCount: 89,
      isNew: false,
      slug: "hagen-bedside-table",
    },
    {
      id: 203,
      name: "Nora Wardrobe",
      price: 2100,
      category: "Storage",
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop",
      imageAlt: "Nora two-door wardrobe in white lacquer",
      rating: 4.7,
      reviewCount: 41,
      isNew: false,
      slug: "nora-wardrobe",
    },
    {
      id: 204,
      name: "Berg Blanket Chest",
      price: 490,
      category: "Storage",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=bottom",
      imageAlt: "Berg blanket chest in natural linen finish",
      rating: 4.5,
      reviewCount: 32,
      isNew: true,
      slug: "berg-blanket-chest",
    },
  ],
  dining: [
    {
      id: 301,
      name: "Holm Dining Table",
      price: 2450,
      category: "Dining",
      imageUrl:
        "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&q=80&fit=crop",
      imageAlt: "Holm dining table in solid white oak",
      rating: 4.9,
      reviewCount: 87,
      isNew: false,
      slug: "holm-dining-table",
    },
    {
      id: 302,
      name: "Ris Dining Chair",
      price: 380,
      category: "Chairs",
      imageUrl:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop",
      imageAlt: "Ris dining chair in upholstered stone linen",
      rating: 4.7,
      reviewCount: 116,
      isNew: false,
      slug: "ris-dining-chair",
    },
    {
      id: 303,
      name: "Sel Bar Stool",
      price: 260,
      category: "Stools",
      imageUrl:
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&fit=crop&crop=right",
      imageAlt: "Sel bar stool in natural ash with footrest",
      rating: 4.5,
      reviewCount: 63,
      isNew: true,
      slug: "sel-bar-stool",
    },
    {
      id: 304,
      name: "Klar Sideboard",
      price: 1640,
      category: "Storage",
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop",
      imageAlt: "Klar low sideboard in oiled walnut",
      rating: 4.8,
      reviewCount: 49,
      isNew: false,
      slug: "klar-sideboard",
    },
  ],
  office: [
    {
      id: 401,
      name: "Birk Desk Chair",
      price: 640,
      category: "Chairs",
      imageUrl:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop&crop=right",
      imageAlt: "Birk ergonomic desk chair in molded plywood",
      rating: 4.7,
      reviewCount: 211,
      isNew: false,
      slug: "birk-desk-chair",
    },
    {
      id: 402,
      name: "Verk Standing Desk",
      price: 1850,
      category: "Desks",
      imageUrl:
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80&fit=crop",
      imageAlt: "Verk height-adjustable desk in solid ash",
      rating: 4.8,
      reviewCount: 77,
      isNew: true,
      slug: "verk-standing-desk",
    },
    {
      id: 403,
      name: "Pin Monitor Shelf",
      price: 180,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop",
      imageAlt: "Pin bamboo monitor shelf with cable slot",
      rating: 4.4,
      reviewCount: 139,
      isNew: false,
      slug: "pin-monitor-shelf",
    },
    {
      id: 404,
      name: "Ark Filing Cabinet",
      price: 560,
      category: "Storage",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=left",
      imageAlt: "Ark two-drawer filing cabinet in white lacquer",
      rating: 4.3,
      reviewCount: 44,
      isNew: false,
      slug: "ark-filing-cabinet",
    },
  ],
  outdoor: [
    {
      id: 501,
      name: "Sol Outdoor Sofa",
      price: 2800,
      category: "Sofas",
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&fit=crop",
      imageAlt: "Sol outdoor sofa in teak and all-weather canvas",
      rating: 4.8,
      reviewCount: 38,
      isNew: true,
      slug: "sol-outdoor-sofa",
    },
    {
      id: 502,
      name: "Teak Dining Set",
      price: 3400,
      category: "Dining",
      imageUrl:
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&fit=crop",
      imageAlt: "Outdoor teak dining table with four chairs",
      rating: 4.9,
      reviewCount: 22,
      isNew: false,
      slug: "teak-dining-set",
    },
    {
      id: 503,
      name: "Kust Lounger",
      price: 890,
      category: "Loungers",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=right",
      imageAlt: "Kust teak sun lounger with adjustable back",
      rating: 4.6,
      reviewCount: 57,
      isNew: false,
      slug: "kust-lounger",
    },
    {
      id: 504,
      name: "Lykt Outdoor Lantern",
      price: 140,
      category: "Lighting",
      imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80&fit=crop",
      imageAlt: "Lykt matte black outdoor lantern",
      rating: 4.5,
      reviewCount: 93,
      isNew: false,
      slug: "lykt-outdoor-lantern",
    },
  ],
  sale: [
    {
      id: 601,
      name: "Fjord Lounge Chair",
      price: 849,
      category: "Armchairs",
      imageUrl:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop",
      imageAlt: "Fjord lounge chair — sale price",
      rating: 4.8,
      reviewCount: 124,
      isNew: false,
      slug: "fjord-lounge-chair-sale",
    },
    {
      id: 602,
      name: "Nord Bookshelf",
      price: 490,
      category: "Storage",
      imageUrl:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop",
      imageAlt: "Nord bookshelf — sale price",
      rating: 4.5,
      reviewCount: 98,
      isNew: false,
      slug: "nord-bookshelf-sale",
    },
    {
      id: 603,
      name: "Ris Dining Chair",
      price: 220,
      category: "Chairs",
      imageUrl:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80&fit=crop&crop=right",
      imageAlt: "Ris dining chair — sale price",
      rating: 4.7,
      reviewCount: 116,
      isNew: false,
      slug: "ris-dining-chair-sale",
    },
    {
      id: 604,
      name: "Sel Bar Stool",
      price: 170,
      category: "Stools",
      imageUrl:
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&fit=crop",
      imageAlt: "Sel bar stool — sale price",
      rating: 4.5,
      reviewCount: 63,
      isNew: false,
      slug: "sel-bar-stool-sale",
    },
    {
      id: 605,
      name: "Tove Pendant Light",
      price: 199,
      category: "Lighting",
      imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80&fit=crop",
      imageAlt: "Tove pendant light — sale price",
      rating: 4.7,
      reviewCount: 203,
      isNew: false,
      slug: "tove-pendant-light-sale",
    },
    {
      id: 606,
      name: "Alva Side Table",
      price: 169,
      category: "Tables",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop&crop=bottom",
      imageAlt: "Alva side table — sale price",
      rating: 4.4,
      reviewCount: 55,
      isNew: false,
      slug: "alva-side-table-sale",
    },
  ],
};

const NAV_LINKS = [
  "Living Room",
  "Bedroom",
  "Dining",
  "Office",
  "Outdoor",
  "Sale",
];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

// ── Component ────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, "").split("/")[0] || "living-room";

  const meta = CATEGORY_META[slug] ?? CATEGORY_META["living-room"];
  const products = CATEGORY_PRODUCTS[slug] ?? [];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(2);

  // State Sort menggunakan data union type agar aman
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]["id"]>("featured");

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <>
      {/* ── SEO ──────────────────────────────────────────────────────────── */}
      <Seo
        title={`${meta.label} Furniture`}
        description={meta.seoDescription}
        canonical={`/${meta.slug}`}
        ogImage={meta.ogImage}
      />

      <div className="min-h-screen bg-stone-50 font-sans antialiased">
        {/* ── Navbar ───────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
          <nav
            aria-label="Main navigation"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8"
          >
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight text-stone-900 shrink-0"
              aria-label="Norr — home"
            >
              Norr<span className="text-stone-400">.</span>
            </Link>

            <ul className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const linkSlug = link.toLowerCase().replaceAll(" ", "-");
                const isActive = linkSlug === slug;
                const isSale = link === "Sale";
                let desktopLinkClass: string;
                if (isSale) {
                  desktopLinkClass = isActive
                    ? "text-rose-700 underline underline-offset-4"
                    : "text-rose-600 hover:text-rose-700";
                } else {
                  desktopLinkClass = isActive
                    ? "text-stone-900 underline underline-offset-4"
                    : "text-stone-500 hover:text-stone-900";
                }
                return (
                  <li key={link}>
                    <Link
                      to={`/${linkSlug}`}
                      className={`text-sm font-medium transition-colors duration-150 ${desktopLinkClass}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4">
              <button
                aria-label="Open search"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <Link
                to="/cart"
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
              </Link>

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

          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-6 pt-4">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const linkSlug = link.toLowerCase().replaceAll(" ", "-");
                  const isActive = linkSlug === slug;
                  const isSale = link === "Sale";
                  let mobileLinkClass: string;
                  if (isSale) {
                    mobileLinkClass = isActive
                      ? "text-rose-700 bg-rose-50"
                      : "text-rose-600 hover:bg-rose-50";
                  } else {
                    mobileLinkClass = isActive
                      ? "text-stone-900 bg-stone-100"
                      : "text-stone-700 hover:bg-stone-50 hover:text-stone-900";
                  }
                  return (
                    <li key={link}>
                      <Link
                        to={`/${linkSlug}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${mobileLinkClass}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </header>

        <main>
          {/* ── Category Hero ─────────────────────────────────────────── */}
          <section
            aria-label={`${meta.label} hero`}
            className="relative h-64 md:h-80 overflow-hidden"
          >
            <img
              src={meta.heroImage}
              alt={meta.heroAlt}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-stone-950/30 to-transparent"
              aria-hidden="true"
            />
            <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-3">
                <ol className="flex items-center gap-1.5 text-xs text-white/60">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="w-3 h-3" />
                  </li>
                  <li className="text-white font-medium" aria-current="page">
                    {meta.label}
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                {meta.headline}
              </h1>
              <p className="text-white/70 text-sm mt-2 max-w-xl font-light leading-relaxed">
                {meta.description}
              </p>
            </div>
          </section>

          {/* ── Toolbar: count + shadcn sort ────────────────────────────── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4 border-b border-stone-100">
            <p className="text-sm text-stone-500">
              <span className="font-medium text-stone-900">
                {products.length}
              </span>{" "}
              products
            </p>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger 
                className="w-auto h-auto px-3 py-2 bg-transparent border-none shadow-none rounded-lg hover:bg-stone-100 focus:ring-0 focus:ring-offset-0 text-sm font-medium text-stone-700 data-[state=open]:bg-stone-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                  <span className="font-normal text-stone-500">
                    Sort by:
                  </span>
                  <span className="text-stone-900">
                    <SelectValue />
                  </span>
                </div>
              </SelectTrigger>

              <SelectContent
                align="end"
                className="rounded-xl border-stone-200 shadow-sm"
              >
                <SelectGroup>
                  <SelectLabel className="px-2 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Sort By
                  </SelectLabel>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id}
                      className="cursor-pointer text-sm text-stone-600 focus:bg-stone-50 focus:text-stone-900 rounded-lg"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* ── Product Grid ──────────────────────────────────────────── */}
          <section
            aria-label={`${meta.label} products`}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            {sorted.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {sorted.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    imageUrl={product.imageUrl}
                    imageAlt={product.imageAlt}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    isNew={product.isNew}
                    slug={product.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="text-stone-400 text-sm">
                  No products found in this category.
                </p>
              </div>
            )}
          </section>

          {/* ── Back to all rooms CTA ─────────────────────────────────── */}
          <section
            aria-label="Explore other collections"
            className="bg-white border-t border-stone-100 py-16"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                Keep exploring
              </p>
              <h2 className="text-2xl font-light tracking-tight text-stone-900 mb-6">
                Other Collections
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {NAV_LINKS.filter(
                  (l) => l.toLowerCase().replaceAll(" ", "-") !== slug,
                ).map((l) => (
                  <Link
                    key={l}
                    to={`/${l.toLowerCase().replaceAll(" ", "-")}`}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors duration-200 ${
                      l === "Sale"
                        ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                        : "border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300"
                    }`}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="bg-stone-900 text-stone-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start justify-between gap-8">
            <div>
              <p className="text-white text-xl font-semibold tracking-tight mb-2">
                Norr<span className="text-stone-500">.</span>
              </p>
              <p className="text-sm max-w-xs leading-relaxed">
                Scandinavian furniture for considered living. Oslo-designed,
                sustainably made.
              </p>
            </div>
            <nav aria-label="Footer shop links">
              <p className="text-white text-xs uppercase tracking-widest mb-3">
                Shop
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l}>
                    <Link
                      to={`/${l.toLowerCase().replaceAll(" ", "-")}`}
                      className={`hover:text-white transition-colors duration-150 ${l === "Sale" ? "text-rose-400 hover:text-rose-300" : ""}`}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-center sm:text-left">
              &copy; 2026 Norr Furniture AS. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
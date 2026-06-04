import { useState, useEffect } from "react";

// Bento item data types
export interface BentoItem {
  id: string;
  type: "featured" | "secondary" | "lifestyle" | "promo" | "cta";
  imageUrl: string;
  imageAlt: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  badge?: string;
  price?: string;
  aspectRatio?: "4/5" | "3/4" | "1/1" | "16/9";
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

// Animation delay helper for staggered reveals
const getAnimationDelay = (index: number) => {
  const delays = [
    "delay-0",
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-400",
    "delay-500",
  ];
  return delays[index % delays.length];
};

// Individual Bento Card Component
function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(`bento-${item.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          setIsVisible(true);
        }
      }
    };

    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [item.id]);

  // Grid span classes based on type
  const gridClasses = {
    featured: "col-span-12 md:col-span-8 md:row-span-2",
    secondary: "col-span-12 md:col-span-4",
    lifestyle: "col-span-12 md:col-span-6",
    promo: "col-span-12 md:col-span-6 md:row-span-1",
    cta: "col-span-12 md:col-span-12",
  };

  // Aspect ratio classes
  const aspectClasses = {
    "4/5": "aspect-[4/5]",
    "3/4": "aspect-[3/4]",
    "1/1": "aspect-square",
    "16/9": "aspect-video",
  };

  const animationDelay = getAnimationDelay(index);

  return (
    <article
      id={`bento-${item.id}`}
      className={`relative overflow-hidden rounded-2xl ${gridClasses[item.type]} ${aspectClasses[item.aspectRatio || "4/5"]} ${
        isMounted && isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } transition-all duration-700 ease-out ${animationDelay}`}
    >
      <a
        href={item.ctaHref || "#"}
        className="group relative block w-full h-full"
        aria-label={item.title || "Bento grid item"}
      >
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              item.type !== "cta" ? "group-hover:scale-105" : ""
            }`}
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            item.type === "featured"
              ? "bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent"
              : item.type === "cta"
                ? "bg-stone-900"
                : "bg-gradient-to-t from-stone-950/70 via-stone-900/20 to-transparent"
          } group-hover:opacity-90`}
        />

        {/* Content Container */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 ${
            item.type === "cta" ? "justify-center items-center text-center" : ""
          }`}
        >
          {/* Badge */}
          {item.badge && (
            <div
              className={`absolute top-4 left-4 md:top-6 md:left-6 ${
                item.type === "cta" ? "static mb-4" : ""
              }`}
            >
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest ${
                  item.type === "cta"
                    ? "bg-white/20 text-white"
                    : item.type === "promo"
                      ? "bg-rose-600 text-white"
                      : "bg-white/15 backdrop-blur-sm border border-white/25 text-white"
                }`}
              >
                {item.badge === "Sale" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                )}
                {item.badge}
              </span>
            </div>
          )}

          {/* Content */}
          <div className={`${item.type === "cta" ? "max-w-md" : "max-w-lg"}`}>
            {item.subtitle && (
              <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                {item.subtitle}
              </p>
            )}

            {item.title && (
              <h3
                className={`text-white font-light tracking-tight mb-2 md:mb-3 ${
                  item.type === "featured"
                    ? "text-2xl md:text-3xl lg:text-4xl"
                    : item.type === "cta"
                      ? "text-3xl md:text-4xl lg:text-5xl"
                      : "text-xl md:text-2xl"
                } opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150`}
              >
                {item.title}
              </h3>
            )}

            {item.description && (
              <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mb-4 md:mb-6 max-w-md opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-200">
                {item.description}
              </p>
            )}

            {/* Price Tag */}
            {item.price && (
              <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-250">
                <span className="inline-block px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-white text-lg md:text-xl font-medium">
                  {item.price}
                </span>
              </div>
            )}

            {/* CTA Button */}
            {item.ctaText && (
              <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-300">
                <span
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.type === "cta"
                      ? "bg-white text-stone-900 hover:bg-stone-100"
                      : "bg-white text-stone-900 hover:bg-stone-100 hover:gap-3"
                  }`}
                >
                  {item.ctaText}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transition-transform duration-200 ${
                      item.type !== "cta" ? "group-hover:translate-x-1" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
        </div>
      </a>
    </article>
  );
}

// Main BentoGrid Component
export default function BentoGrid({
  items,
  className = "",
}: Readonly<BentoGridProps>) {
  return (
    <section
      aria-label="Featured collections"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 ${className}`}
    >
      {/* Section Header */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-stone-900 mb-3">
          Curated Collections
        </h2>
        <p className="text-stone-500 text-sm md:text-base max-w-xl font-light">
          Discover handpicked pieces that define Scandinavian elegance. Each
          piece tells a story of craftsmanship and timeless design.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {items.map((item, index) => (
          <BentoCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

// Default demo data for preview
const DEMO_BENTO_ITEMS: BentoItem[] = [
  {
    id: "featured-1",
    type: "featured",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    imageAlt: "Luxurious green sofa in modern living room",
    subtitle: "Featured",
    title: "The Statement Sofa",
    description:
      "Where comfort meets contemporary elegance. A centerpiece that transforms your living space.",
    ctaText: "Shop Now",
    ctaHref: "/collections/featured",
    price: "$2,499",
    badge: "Best Seller",
    aspectRatio: "4/5",
  },
  {
    id: "secondary-1",
    type: "secondary",
    imageUrl:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    imageAlt: "Minimalist bedroom with wooden bed frame",
    title: "Bedroom Essentials",
    ctaText: "Explore",
    ctaHref: "/collections/bedroom",
    aspectRatio: "3/4",
  },
  {
    id: "secondary-2",
    type: "secondary",
    imageUrl:
      "https://images.unsplash.com/photo-1551298370-9d3d53bc4468?w=800&q=80",
    imageAlt: "Modern dining table with chairs",
    title: "Dining Collection",
    ctaText: "Explore",
    ctaHref: "/collections/dining",
    aspectRatio: "3/4",
  },
  {
    id: "lifestyle-1",
    type: "lifestyle",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    imageAlt: "Scandinavian living room with natural light",
    subtitle: "New Arrivals",
    title: "Light & Airy",
    description:
      "Embrace the essence of Nordic design with our latest collection.",
    ctaText: "Discover",
    ctaHref: "/collections/new",
    aspectRatio: "16/9",
  },
  {
    id: "promo-1",
    type: "promo",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    imageAlt: "Designer chair on sale",
    badge: "Sale",
    title: "Up to 40% Off",
    description: "Limited time offers on select items.",
    ctaText: "Shop Sale",
    ctaHref: "/collections/sale",
    aspectRatio: "16/9",
  },
  {
    id: "cta-1",
    type: "cta",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80",
    imageAlt: "Full room interior design",
    title: "Design Your Dream Space",
    description:
      "Get personalized styling advice from our interior design experts. Free consultation awaits.",
    ctaText: "Book Consultation",
    ctaHref: "/contact",
    badge: "New",
    aspectRatio: "4/5",
  },
];

// Export demo data for easy preview
export { DEMO_BENTO_ITEMS };

// Premium CategoryCard with high-end agency aesthetics
import { useState, useEffect } from "react";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  itemCount?: number;
  index?: number;
}

export default function CategoryCard({
  name,
  imageUrl,
  imageAlt,
  href,
  itemCount,
  index = 0,
}: Readonly<CategoryCardProps>) {
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Staggered mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const categoryLabel =
    itemCount === undefined
      ? `Browse ${name}`
      : `Browse ${name} — ${itemCount} items`;

  return (
    <article
      className={`group relative transition-all duration-700 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={href}
        aria-label={categoryLabel}
        className="relative block overflow-hidden rounded-2xl bg-stone-100 aspect-[3/4] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
      >
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse" />
        )}

        {/* Background Image with Parallax-like Scale */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-110" : "scale-100"}`}
          />
        </div>

        {/* Multi-layer Gradient Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          aria-hidden="true"
        >
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
          {/* Highlight on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Ambient Light Effect on Hover */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
        </div>

        {/* Item Count Pill - Glassmorphism */}
        {itemCount !== undefined && (
          <div className="absolute top-5 left-5 transition-all duration-300 ease-out">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-full text-white text-[11px] uppercase tracking-wider transition-all duration-300 ${
                isHovered
                  ? "bg-white/20 border-white/30 shadow-lg"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full bg-white/80 transition-colors duration-300 ${
                  isHovered ? "bg-emerald-400" : "bg-white/60"
                }`}
              />
              {itemCount} items
            </span>
          </div>
        )}

        {/* Bottom Content Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Category Name */}
          <h3
            className={`text-white font-light tracking-tight text-xl md:text-2xl mb-4 transition-all duration-500 ease-out ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-90"
            }`}
          >
            {name}
          </h3>

          {/* Animated CTA Button */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              isHovered ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <span className="inline-flex items-center gap-3 px-6 py-3 bg-white text-stone-900 text-[11px] font-medium uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group-hover:gap-4">
              Shop {name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-200"
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
        </div>

        {/* Corner Accent - Subtle Detail */}
        <div
          className={`absolute top-6 right-6 w-8 h-8 border border-white/20 rounded-full transition-all duration-500 ${
            isHovered
              ? "scale-100 opacity-100 rotate-0"
              : "scale-75 opacity-0 rotate-45"
          }`}
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rounded-full" />
        </div>

        {/* Bottom Line Accent */}
        <div
          className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 ${
            isHovered ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transformOrigin: "center" }}
        />
      </a>
    </article>
  );
}

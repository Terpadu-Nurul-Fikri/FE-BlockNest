// Premium ProductCard with high-end agency aesthetics
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageAlt: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  slug?: string;
  onAddToCart?: () => void;
  index?: number; // For staggered animations
}

export default function ProductCard({
  name,
  price,
  category,
  imageUrl,
  imageAlt,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  slug,
  onAddToCart,
  index = 0,
}: Readonly<ProductCardProps>) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Staggered mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const ratingLabel =
    reviewCount > 0
      ? `Rated ${rating} out of 5, ${reviewCount} reviews`
      : `Rated ${rating} out of 5`;

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <Link
      to={slug ? `/products/${slug}` : "#"}
      className={`group relative transition-all duration-500 ease-out block ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <article>
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/5] mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300 ease-out">
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse" />
        )}

        {/* Main Image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Premium Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />

        {/* New Badge - Premium Pill */}
        {isNew && (
          <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-stone-900 text-white text-[10px] font-medium uppercase tracking-widest rounded-full shadow-lg">
            New
          </span>
        )}

        {/* Wishlist Button - Glassmorphism */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted((prev) => !prev);
          }}
          aria-label={
            isWishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/20 shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out hover:bg-white hover:scale-110 hover:shadow-lg cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[18px] h-[18px] transition-all duration-200 ${
              isWishlisted
                ? "fill-rose-500 stroke-rose-500 scale-110"
                : "fill-transparent stroke-stone-600"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.();
            }}
            aria-label={`Add ${name} to cart`}
            className="w-full py-3.5 bg-stone-900/95 backdrop-blur-sm text-white text-[11px] font-medium uppercase tracking-widest hover:bg-stone-800 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Category */}
        <p className="text-[11px] text-stone-400 uppercase tracking-[0.15em] font-medium">
          {category}
        </p>

        {/* Name & Price */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-normal text-stone-900 leading-snug flex-1 tracking-tight group-hover:text-stone-700 transition-colors duration-200">
            {name}
          </h3>
          <span className="text-[15px] font-medium text-stone-900 whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5" aria-label={ratingLabel}>
            {/* Stars */}
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    star <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                  }`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            {/* Review Count */}
            {reviewCount > 0 && (
              <span className="text-[11px] text-stone-400 font-normal">
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Focus States for Accessibility */}
      <style>{`
        article:focus-within {
          outline: none;
        }
        article:focus-within a:focus-visible,
        article:focus-within button:focus-visible {
          outline: 2px solid #1c1917;
          outline-offset: 2px;
        }
      `}</style>
      </article>
    </Link>
  );
}

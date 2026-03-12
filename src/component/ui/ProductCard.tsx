// src/component/ui/ProductCard.tsx
import { useState } from "react";

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
  onAddToCart,
}: Readonly<ProductCardProps>) {
  const [wishlisted, setWishlisted] = useState(false);
  const ratingLabel =
    reviewCount > 0
      ? `Rated ${rating} out of 5, ${reviewCount} reviews`
      : `Rated ${rating} out of 5`;

  return (
    <article className="group relative">
      {/* Image container */}
      <div className="relative overflow-hidden rounded-2xl aspect-4/5 bg-stone-100 mb-4">
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* "New" badge */}
        {isNew && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-stone-900 text-white text-[10px] uppercase tracking-widest rounded-full">
            New
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={() => setWishlisted((prev) => !prev)}
          aria-label={
            wishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-colors duration-200 ${
              wishlisted
                ? "fill-rose-500 stroke-rose-500"
                : "stroke-stone-500 fill-transparent"
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

        {/* Quick-add overlay — slides up from bottom */}
        <div className="absolute bottom-0 left-0 w-full px-4 pb-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={onAddToCart}
            aria-label={`Add ${name} to cart`}
            className="w-full py-3 bg-stone-900/90 backdrop-blur-sm text-white text-[11px] font-medium uppercase tracking-widest hover:bg-stone-900 transition-colors rounded-xl cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product info */}
      <div>
        <p className="text-[11px] text-stone-400 uppercase tracking-widest mb-1.5">
          {category}
        </p>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-stone-900 leading-snug flex-1">
            {name}
          </h3>
          <span className="text-sm font-semibold text-stone-900 whitespace-nowrap">
            ${price}
          </span>
        </div>

        {/* Star rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5" aria-label={ratingLabel}>
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3 h-3 ${
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
            {reviewCount > 0 && (
              <span className="text-[11px] text-stone-400">
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* --- WHAT CHANGED ---
  Added:      Wishlist toggle button (heart icon, aria-pressed, fill-rose-500 when active)
              Star rating row with aria-label for screen readers
              "New" badge pill (top-left, shown when isNew=true)
  Design:     Rounded image container (rounded-2xl), image scale on hover (was opacity fade)
              Quick-add slides from y+3 → 0 with ease-out (was translate-y-4)
  Props:      rating, reviewCount, isNew, slug added (all optional)
  SEO/a11y:   aria-pressed on wishlist, aria-label on all buttons, descriptive alt unchanged
*/

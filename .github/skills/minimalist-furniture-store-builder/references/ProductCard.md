# ProductCard Template

Reference template for the `ProductCard` component.

## File Location

`src/component/ui/ProductCard.tsx`

## Props Interface

```tsx
interface ProductCardProps {
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  slug?: string;
  onAddToCart?: () => void;
}
```

## Full Template

```tsx
// src/component/ui/ProductCard.tsx
import React from "react";

interface ProductCardProps {
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  slug?: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  name,
  price,
  category,
  description,
  imageUrl,
  imageAlt,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square bg-stone-100">
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
          {category}
        </p>
        <h3 className="text-base font-medium text-stone-900 mb-1 leading-snug">
          {name}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-stone-900">
            ${price.toFixed(2)}
          </span>
          <button
            onClick={onAddToCart}
            aria-label={`Add ${name} to cart`}
            className="text-sm px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-700 transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

/* Usage
<ProductCard
  name="Elm Dining Chair"
  price={349}
  category="Seating"
  description="Solid elm wood with a hand-oiled finish. Pairs beautifully with the Fjord dining table."
  imageUrl="/images/elm-dining-chair.jpg"
  imageAlt="Solid elm dining chair with natural wood finish and cushioned seat"
  onAddToCart={() => console.log("Added to cart")}
/>
*/
```

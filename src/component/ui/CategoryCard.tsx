// src/component/ui/CategoryCard.tsx

interface CategoryCardProps {
  name: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  itemCount?: number;
}

export default function CategoryCard({
  name,
  imageUrl,
  imageAlt,
  href,
  itemCount,
}: Readonly<CategoryCardProps>) {
  const categoryLabel =
    itemCount === undefined
      ? `Browse ${name}`
      : `Browse ${name} — ${itemCount} items`;
  return (
    <article>
      <a
        href={href}
        aria-label={categoryLabel}
        className="group relative block overflow-hidden rounded-2xl bg-stone-100 aspect-3/4"
      >
        {/* Background image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Permanent dark gradient */}
        <div
          className="absolute inset-0 bg-linear-to-t from-stone-950/75 via-stone-950/20 to-transparent"
          aria-hidden="true"
        />

        {/* Item count pill — top left */}
        {itemCount !== undefined && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-white text-[11px] uppercase tracking-wider">
            {itemCount} items
          </span>
        )}

        {/* Bottom: category name always visible + hover-revealed CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-medium text-lg mb-3 leading-snug">
            {name}
          </h3>

          {/* Slide-up CTA — hidden below fold, revealed on hover */}
          <div className="overflow-hidden">
            <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-900 text-[11px] font-medium uppercase tracking-widest rounded-xl">
                Shop {name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
        </div>
      </a>
    </article>
  );
}

/* --- WHAT CHANGED ---
  Layout:     Below-image text removed → text now overlays image with gradient
  Complexity: Hover-revealed "Shop {name}" CTA slides up from below (translate-y-full → 0)
              Item count as glass pill badge top-left
              Image scales to 110% on hover (was 105%)
  SEO:        Descriptive aria-label includes item count; h3 inside <article>
  Depth:      bg-linear-to-t dark gradient + backdrop-blur on pill
*/

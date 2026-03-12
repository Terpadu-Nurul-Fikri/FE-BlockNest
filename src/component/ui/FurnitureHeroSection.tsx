// src/component/ui/FurnitureHeroSection.tsx

interface FurnitureHeroSectionProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  mediaUrl: string; // <-- Diubah dari imageUrl
  mediaType?: "image" | "video"; // <-- Tambahan prop baru
  imageAlt?: string; // Menjadi opsional karena video tidak pakai alt
  badge?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function FurnitureHeroSection({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  mediaUrl,
  mediaType = "image", // Defaultnya image jika tidak diisi
  imageAlt = "Hero background",
  badge = "New Collection",
  secondaryCtaText = "Explore All",
  secondaryCtaHref = "/collections",
}: Readonly<FurnitureHeroSectionProps>) {
  return (
    <section
      aria-label="Hero banner"
      className="relative w-full min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* Background Media (Image atau Video) */}
      {mediaType === "video" ? (
        <video
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={mediaUrl}
          alt={imageAlt}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark gradient overlay — left-heavy for text legibility */}
      <div
        className="absolute inset-0 bg-linear-to-r from-stone-950/85 via-stone-900/50 to-stone-900/10"
        aria-hidden="true"
      />

      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-stone-950/50 to-transparent"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-2xl">
          {/* Badge pill */}
          {badge && (
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs uppercase tracking-widest">
              <span
                className="w-1.5 h-1.5 rounded-full bg-stone-300"
                aria-hidden="true"
              />
              {badge}
            </span>
          )}

          {/* H1 */}
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-light tracking-tight text-white leading-[1.06] mb-6">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-white/65 leading-relaxed mb-10 max-w-lg font-light">
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={ctaHref}
              className="inline-block px-8 py-4 rounded-xl bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors duration-200"
            >
              {ctaText}
            </a>
            <a
              href={secondaryCtaHref}
              className="inline-flex items-center gap-2 text-white/75 hover:text-white text-sm transition-colors duration-200 group"
            >
              {secondaryCtaText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
            </a>
          </div>
        </div>

        {/* Floating stat cards — desktop only */}
        <div className="absolute right-8 lg:right-16 bottom-20 lg:bottom-28 hidden lg:flex flex-col gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
            <p className="text-2xl font-semibold text-white">12,400+</p>
            <p className="text-[11px] text-white/55 uppercase tracking-widest mt-0.5">
              Pieces Sold
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
            <p className="text-2xl font-semibold text-white">4.9 ★</p>
            <p className="text-[11px] text-white/55 uppercase tracking-widest mt-0.5">
              Avg. Rating
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/35"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}

/* --- WHAT CHANGED ---
  Layout:     Split layout → full-bleed background image, 92vh min-height
  Depth:      Left-heavy dark gradient overlay + bottom vignette for text legibility
  Complexity: Floating glass stat cards (desktop), animated scroll indicator, badge pill with blur
  SEO:        fetchPriority="high" on LCP image, aria-label on section, aria-hidden on decorators
  Motion:     animate-bounce scroll hint, group-hover arrow translation on secondary CTA
  Badge:      Optional prop restored so Home.tsx badge="2026 Collection" is valid
*/

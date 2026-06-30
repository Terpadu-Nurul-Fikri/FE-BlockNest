// Premium FurnitureHeroSection with high-end agency aesthetics
import { useState, useEffect } from "react";

interface FurnitureHeroSectionProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  mediaUrl: string;
  mediaType?: "image" | "video";
  imageAlt?: string;
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
  mediaType = "image",
  imageAlt = "Hero background",
  badge = "New Collection",
  secondaryCtaText = "Explore All",
  secondaryCtaHref = "/collections",
}: Readonly<FurnitureHeroSectionProps>) {
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      aria-label="Hero banner"
      className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-stone-900"
    >
      {/* Background Media Layer */}
      <div className="absolute inset-0">
        {mediaType === "video" ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={() => setIsImageLoaded(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={mediaUrl}
            alt={imageAlt}
            fetchPriority="high"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-[2000ms] ease-out ${
              isMounted ? "scale-100" : "scale-105"
            } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {/* Skeleton while loading */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-stone-800 animate-pulse" />
        )}
      </div>

      {/* Multi-layer Gradient Overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Primary dark overlay - left heavy for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-stone-900/20" />

        {/* Subtle top-to-bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 via-transparent to-stone-950/50" />

        {/* Highlight for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      </div>

      {/* Ambient Particles/Grain - Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-2xl">
          {/* Badge Pill - Animated entrance */}
          {badge && (
            <div
              className={`mb-8 transition-all duration-700 ease-out ${
                isMounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs uppercase tracking-[0.2em] font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-200" />
                </span>
                {badge}
              </span>
            </div>
          )}

          {/* H1 Headline */}
          <h1
            className={`text-5xl md:text-6xl xl:text-7xl font-light tracking-tight text-white leading-[1.05] mb-6 transition-all duration-700 ease-out ${
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            {headline}
          </h1>

          {/* Subheadline */}
          <p
            className={`text-base md:text-lg text-white/65 leading-relaxed mb-10 max-w-lg font-light transition-all duration-700 ease-out ${
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {subheadline}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 ease-out ${
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {/* Primary CTA */}
            <a
              href={ctaHref}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 hover:scale-[1.02]"
            >
              {ctaText}
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

            {/* Secondary CTA */}
            <a
              href={secondaryCtaHref}
              className="group inline-flex items-center gap-2 text-white/75 hover:text-white text-sm transition-all duration-200"
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

        {/* Floating Stats Cards - Desktop Only */}
        <div
          className={`absolute right-8 lg:right-16 bottom-20 lg:bottom-28 hidden lg:flex flex-col gap-4 transition-all duration-1000 ease-out ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {/* Stat Card 1 */}
          <div className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-3xl font-light text-white tracking-tight">
              12,400+
            </p>
            <p className="text-[11px] text-white/50 uppercase tracking-[0.15em] mt-1 font-medium">
              Pieces Sold
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-light text-white tracking-tight">
                4.9
              </p>
              <div className="flex gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-3 h-3 ${
                      star <= 4
                        ? "fill-amber-400 text-amber-400"
                        : "fill-white/20 text-white/20"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-white/50 uppercase tracking-[0.15em] mt-1 font-medium">
              Avg. Rating
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30 transition-all duration-700 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "800ms" }}
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-[scroll_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div
        className={`absolute top-8 right-8 w-24 h-24 border border-white/10 rounded-full transition-all duration-1000 ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: "600ms" }}
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full" />
      </div>

      <div
        className={`absolute bottom-32 left-8 w-16 h-16 border border-white/10 rounded-full transition-all duration-1000 ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: "700ms" }}
        aria-hidden="true"
      />

      {/* Custom animation for scroll indicator */}
      <style>{`
        @keyframes scroll {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { bannerService, type Banner, type BannerType } from "../../lib/bannerService";

interface ActiveBannersProps {
  type: BannerType;
}

function getHref(linkUrl?: string | null) {
  if (!linkUrl) return null;
  return linkUrl.startsWith("/") ? linkUrl : null;
}

export default function ActiveBanners({ type }: ActiveBannersProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    bannerService
      .getActive()
      .then((res) => {
        if (active) setBanners(res.data);
      })
      .catch(() => {
        if (active) setBanners([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => banners.filter((banner) => banner.type === type && !dismissed[banner.id]),
    [banners, dismissed, type],
  );

  if (visible.length === 0) return null;

  // 1. TOP_BAR Design
  if (type === "TOP_BAR") {
    const banner = visible[0];
    const href = getHref(banner.linkUrl);
    const content = (
      <div className="group relative overflow-hidden bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-stone-800">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5">
          <Sparkles className="size-4 shrink-0 text-stone-400" />
          <span className="truncate">{banner.content || banner.title}</span>
          {href && (
            <ArrowRight className="size-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-1" />
          )}
        </div>
      </div>
    );

    return href ? (
      <Link to={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2">
        {content}
      </Link>
    ) : (
      content
    );
  }

  // 2. POPUP Design
  if (type === "POPUP") {
    const banner = visible[0];
    const href = getHref(banner.linkUrl);

    return (
      <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-stone-950/10 transition-all sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={() => setDismissed((prev) => ({ ...prev, [banner.id]: true }))}
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/70 text-stone-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
          aria-label="Tutup banner"
        >
          <X className="size-4" />
        </button>

        {banner.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-stone-100">
            <img
              src={banner.imageUrl}
              alt={banner.imageAlt || banner.title}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950/50 to-transparent" />
          </div>
        )}

        <div className="relative p-6">
          <h3 className="text-lg font-bold tracking-tight text-stone-900">{banner.title}</h3>
          {banner.content && <p className="mt-2 text-sm leading-relaxed text-stone-500">{banner.content}</p>}
          
          {href && (
            <Link
              to={href}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-stone-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
            >
              Lihat Promo
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // 3. HERO_SLIDER / Default Design
  return (
    <section className="bg-stone-50/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scrollbar-hide">
          {visible.map((banner) => {
            const href = getHref(banner.linkUrl);
            const body = (
              <div className="group relative flex h-[280px] w-[320px] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl bg-stone-200 shadow-sm transition-all hover:shadow-xl sm:w-[540px]">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.imageAlt || banner.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-stone-200 to-stone-300" />
                )}
                
                {/* Vibrant Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative p-6 sm:p-8">
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{banner.title}</h3>
                  {banner.content && (
                    <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-stone-200 sm:text-base">
                      {banner.content}
                    </p>
                  )}
                  {href && (
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white">
                      <span>Jelajahi Sekarang</span>
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </div>
              </div>
            );

            return href ? (
              <Link 
                key={banner.id} 
                to={href} 
                className="shrink-0 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
              >
                {body}
              </Link>
            ) : (
              <div key={banner.id} className="shrink-0">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

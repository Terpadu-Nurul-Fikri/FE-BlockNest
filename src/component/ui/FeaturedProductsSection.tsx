import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  slug?: string;
}

interface FeaturedProductsSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  className?: string;
}

export default function FeaturedProductsSection({
  title,
  subtitle,
  products,
  viewAllHref = "/products",
  className = "",
}: Readonly<FeaturedProductsSectionProps>) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const mountTimer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("featured-products");
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          setIsVisible(true);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="featured-products"
      aria-label={title}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 ${className}`}
    >
      {/* Section Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 md:mb-16 transition-all duration-700 ease-out ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-stone-500 text-base font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <a
          href={viewAllHref}
          className="group inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors duration-200 self-start sm:self-auto whitespace-nowrap"
        >
          <span className="border-b border-stone-300 pb-0.5 group-hover:border-stone-700 transition-colors duration-200">
            View all collection
          </span>
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
        {products.map((product, index) => (
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
            index={index}
          />
        ))}
      </div>

      {/* Decorative Line */}
      <div
        className={`mt-16 md:mt-24 flex justify-center transition-all duration-1000 delay-500 ease-out ${
          isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
        style={{ transformOrigin: "center" }}
      >
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
      </div>
    </section>
  );
}

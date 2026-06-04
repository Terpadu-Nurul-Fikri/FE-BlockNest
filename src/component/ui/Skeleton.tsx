// Premium Skeleton Loader Components for high-end UX
import { useEffect, useState } from "react";

// Shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  .skeleton-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 2s infinite;
  }
`;

// Base Skeleton Props
interface BaseSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

// Base Skeleton Component
function BaseSkeleton({
  className = "",
  variant = "rounded",
  width,
  height,
}: Readonly<BaseSkeletonProps>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const defaultHeights = {
    text: "1em",
    circular: "40px",
    rectangular: "100px",
    rounded: "20px",
  };

  return (
    <div
      className={`relative overflow-hidden bg-stone-200 skeleton-shimmer ${variantClasses[variant]} ${className}`}
      style={{
        width: width || "100%",
        height: height || defaultHeights[variant],
        opacity: isMounted ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <article className="animate-pulse">
      {/* Image skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-stone-200 aspect-[4/5] mb-4">
        <BaseSkeleton className="absolute inset-0" variant="rounded" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <BaseSkeleton width="30%" height={12} variant="text" />
        <div className="flex justify-between gap-2">
          <BaseSkeleton width="60%" height={18} variant="text" />
          <BaseSkeleton width="20%" height={18} variant="text" />
        </div>
        <BaseSkeleton width="40%" height={14} variant="text" />
      </div>
    </article>
  );
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <article className="animate-pulse">
      <div className="relative overflow-hidden rounded-2xl bg-stone-200 aspect-[3/4]">
        <BaseSkeleton className="absolute inset-0" variant="rounded" />

        {/* Overlay skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <BaseSkeleton
            width="50%"
            height={24}
            variant="text"
            className="mb-3"
          />
          <BaseSkeleton width="35%" height={36} variant="rounded" />
        </div>
      </div>
    </article>
  );
}

// Bento Grid Skeleton
export function BentoGridSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      {/* Header skeleton */}
      <div className="mb-12 md:mb-16 space-y-3">
        <BaseSkeleton width="40%" height={40} variant="text" />
        <BaseSkeleton width="60%" height={20} variant="text" />
      </div>

      {/* Bento grid skeleton */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Featured item */}
        <div className="col-span-12 md:col-span-8 md:row-span-2 aspect-[4/5]">
          <BaseSkeleton className="w-full h-full" variant="rounded" />
        </div>

        {/* Secondary items */}
        <div className="col-span-12 md:col-span-4 aspect-[3/4]">
          <BaseSkeleton className="w-full h-full" variant="rounded" />
        </div>
        <div className="col-span-12 md:col-span-4 aspect-[3/4]">
          <BaseSkeleton className="w-full h-full" variant="rounded" />
        </div>

        {/* Lifestyle items */}
        <div className="col-span-12 md:col-span-6 aspect-video">
          <BaseSkeleton className="w-full h-full" variant="rounded" />
        </div>
        <div className="col-span-12 md:col-span-6 aspect-video">
          <BaseSkeleton className="w-full h-full" variant="rounded" />
        </div>
      </div>
    </section>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-[92vh] bg-stone-900">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-stone-800">
        <BaseSkeleton className="w-full h-full" variant="rectangular" />
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-2xl space-y-6">
          {/* Badge skeleton */}
          <BaseSkeleton
            width={120}
            height={28}
            variant="rounded"
            className="rounded-full"
          />

          {/* Headline skeleton */}
          <div className="space-y-3">
            <BaseSkeleton width="90%" height={56} variant="text" />
            <BaseSkeleton width="70%" height={56} variant="text" />
          </div>

          {/* Subheadline skeleton */}
          <BaseSkeleton width="60%" height={24} variant="text" />

          {/* CTA skeletons */}
          <div className="flex gap-4 pt-4">
            <BaseSkeleton width={140} height={52} variant="rounded" />
            <BaseSkeleton width={120} height={52} variant="rounded" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="absolute right-8 lg:right-16 bottom-20 lg:bottom-28 hidden lg:flex gap-4">
          <BaseSkeleton width={120} height={80} variant="rounded" />
          <BaseSkeleton width={120} height={80} variant="rounded" />
        </div>
      </div>
    </section>
  );
}

// Text Skeleton with realistic paragraph lines
export function TextSkeleton({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <BaseSkeleton
          key={index}
          width={index === lines - 1 ? "60%" : "100%"}
          height={16}
          variant="text"
        />
      ))}
    </div>
  );
}

// Circular Avatar Skeleton
export function AvatarSkeleton({ size = 48 }: { size?: number }) {
  return <BaseSkeleton variant="circular" width={size} height={size} />;
}

// Button Skeleton
export function ButtonSkeleton({
  width = 120,
  height = 44,
}: {
  width?: number | string;
  height?: number;
}) {
  return (
    <BaseSkeleton
      width={width}
      height={height}
      variant="rounded"
      className="rounded-xl"
    />
  );
}

// Image Skeleton with aspect ratio
export function ImageSkeleton({
  aspectRatio = "4/5",
  className = "",
}: {
  aspectRatio?: string;
  className?: string;
}) {
  const aspectRatios: Record<string, string> = {
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "4/5": "aspect-[4/5]",
    "16/9": "aspect-video",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-stone-200 ${aspectRatios[aspectRatio]} ${className}`}
    >
      <BaseSkeleton className="absolute inset-0" variant="rounded" />
    </div>
  );
}

// Grid Skeleton for product listings
export function ProductGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number;
  columns?: number;
}) {
  const gridCols: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-2 lg:grid-cols-6",
  };

  return (
    <div
      className={`grid ${gridCols[columns] || "grid-cols-2 lg:grid-cols-4"} gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Category Grid Skeleton
export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Section Skeleton wrapper
export function SectionSkeleton({
  title = true,
  subtitle = true,
  children,
}: {
  title?: boolean;
  subtitle?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      {/* Header skeleton */}
      {(title || subtitle) && (
        <div className="mb-12 md:mb-16">
          {title && (
            <BaseSkeleton
              width="30%"
              height={40}
              variant="text"
              className="mb-4"
            />
          )}
          {subtitle && <BaseSkeleton width="50%" height={20} variant="text" />}
        </div>
      )}

      {/* Content skeleton */}
      {children}
    </section>
  );
}

// Main export with injected styles
export default function Skeleton({
  className,
  variant,
  width,
  height,
}: BaseSkeletonProps) {
  return (
    <>
      <style>{shimmerStyles}</style>
      <BaseSkeleton
        className={className}
        variant={variant}
        width={width}
        height={height}
      />
    </>
  );
}

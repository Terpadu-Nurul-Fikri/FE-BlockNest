// Premium Section Wrapper Component with entrance animations
import { useState, useEffect, type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
  background?: "white" | "stone" | "gradient";
  padding?: "none" | "small" | "medium" | "large";
  animation?: boolean;
  animationDelay?: number;
}

const paddingClasses = {
  none: "",
  small: "py-8 md:py-12",
  medium: "py-16 md:py-20",
  large: "py-20 md:py-28",
};

const backgroundClasses = {
  white: "bg-white",
  stone: "bg-stone-50",
  gradient: "bg-gradient-to-b from-white to-stone-50",
};

export default function Section({
  children,
  className = "",
  id,
  ariaLabel,
  background = "white",
  padding = "medium",
  animation = true,
  animationDelay = 0,
}: Readonly<SectionProps>) {
  const [isVisible, setIsVisible] = useState(!animation);
  const [isMounted, setIsMounted] = useState(!animation);

  useEffect(() => {
    // Trigger mount animation
    const mountTimer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (!animation) return;

    const handleScroll = () => {
      const element = document.getElementById(id || "section-wrapper");
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
  }, [animation, id]);

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`relative w-full ${backgroundClasses[background]} ${paddingClasses[padding]} ${
        animation && isMounted
          ? isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
          : ""
      } transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: animation ? `${animationDelay}ms` : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// Section Header Component for consistent typography
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center";
  className?: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeader({
  title,
  subtitle,
  alignment = "left",
  className = "",
  linkText,
  linkHref,
}: Readonly<SectionHeaderProps>) {
  const isCentered = alignment === "center";

  return (
    <div
      className={`flex flex-col ${isCentered ? "text-center items-center" : "text-left"} ${
        isCentered ? "mb-12 md:mb-16" : "mb-10 md:mb-14"
      } ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-light tracking-tight text-stone-900 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-stone-500 text-base font-light leading-relaxed max-w-2xl ${isCentered ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
      {linkText && linkHref && (
        <a
          href={linkHref}
          className="group inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors duration-200 mt-4"
        >
          <span className="border-b border-stone-300 pb-0.5 group-hover:border-stone-700 transition-colors duration-200">
            {linkText}
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
      )}
    </div>
  );
}

// Decorative Section Divider
interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({
  className = "",
}: Readonly<SectionDividerProps>) {
  return (
    <div className={`flex justify-center py-8 ${className}`}>
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
    </div>
  );
}

// Full-width Section (breaks out of container)
interface SectionFullWidthProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "stone" | "dark";
}

const fullWidthBackgrounds = {
  white: "bg-white",
  stone: "bg-stone-50",
  dark: "bg-stone-900",
};

export function SectionFullWidth({
  children,
  className = "",
  background = "white",
}: Readonly<SectionFullWidthProps>) {
  return (
    <section
      className={`w-full ${fullWidthBackgrounds[background]} ${className}`}
    >
      {children}
    </section>
  );
}

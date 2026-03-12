---
name: minimalist-furniture-store-builder 
description: "Generate clean, modern, SEO-friendly React + TailwindCSS UI components for a minimalist Scandinavian furniture e-commerce store. Use when: building furniture store UI, creating product cards, product grids, hero sections, category cards, navigation, cart sidebar, CTA sections, footer, or any e-commerce component with minimalist/Scandinavian design. Produces accessible, mobile-first, SEO-optimized React functional components with neutral colors, soft shadows, and elegant typography."
argument-hint: "Component to generate (e.g. ProductCard, ProductGrid, FurnitureHeroSection, EcommerceNavbar)"
---

# Minimalist Furniture Store Builder

## Purpose

Generate clean, modern, SEO-friendly UI components for a minimalist Scandinavian furniture e-commerce application using React functional components and TailwindCSS utility classes.

## When to Use

- Building any page or component for a furniture e-commerce app
- Generating product cards, grids, hero sections, navigation, or footer
- Requesting a component that follows Scandinavian / minimalist design
- Needing mobile-first, accessible, SEO-optimized React components
- Starting from or extending an existing furniture storefront

## Tech Stack

- **React** — functional components with props
- **TailwindCSS** — utility classes only (no custom CSS)
- **Mobile-first** — responsive via `sm:`, `md:`, `lg:` breakpoints
- **No external UI libraries** — Tailwind only

---

## Design System

### Color Palette (Tailwind classes)

| Role           | Classes                                   |
| -------------- | ----------------------------------------- |
| Background     | `bg-white`, `bg-stone-50`, `bg-stone-100` |
| Surface / Card | `bg-white`, `bg-beige-50`                 |
| Text primary   | `text-stone-900`, `text-neutral-900`      |
| Text secondary | `text-stone-500`, `text-neutral-500`      |
| Accent         | `text-stone-700`, `border-stone-300`      |
| Shadows        | `shadow-sm`, `shadow-md`                  |

### Spacing & Layout

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: `py-16 md:py-24`
- Component gap: `gap-6` / `gap-8`
- Rounded corners: `rounded-xl` / `rounded-2xl`

### Typography

- Page title (h1): `text-4xl md:text-5xl font-light tracking-tight text-stone-900`
- Section heading (h2): `text-2xl md:text-3xl font-light text-stone-800`
- Subheading (h3): `text-lg font-medium text-stone-700`
- Body: `text-base text-stone-600 leading-relaxed`
- Price: `text-xl font-semibold text-stone-900`
- Caption / label: `text-sm text-stone-500 uppercase tracking-widest`

### Transitions & Hover

- Card hover lift: `transition-transform duration-300 hover:-translate-y-1`
- Image zoom: `transition-transform duration-500 group-hover:scale-105`
- Button hover: `transition-colors duration-200`
- Shadow on hover: `hover:shadow-lg`

---

## Procedure

When the user requests a component:

### 1. Identify the Component

Match the request to one of the [Common Components](#common-components) below. If the request describes something new, derive the design rules from the Design System section above.

### 2. Apply the Component Checklist

Before generating code, verify the component will include:

- [ ] Semantic HTML element wrapping the component (`<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`)
- [ ] Proper heading hierarchy where applicable (h1 → h2 → h3, never skipping levels)
- [ ] Meaningful `alt` text on all `<img>` tags (descriptive, not "image" or blank)
- [ ] `aria-label` on icon-only buttons and interactive controls
- [ ] Mobile-first responsive classes
- [ ] Hover transition on interactive elements
- [ ] Props interface for all dynamic data

### 3. Generate the Component

Follow the [Code Output Rules](#code-output-rules) section.

### 4. Provide Example Usage

After the main component, always show a short usage snippet demonstrating the component with sample props.

---

## Common Components

### ProductCard

**Semantic element:** `<article>`  
**Required props:** `name`, `price`, `category`, `description`, `imageUrl`, `imageAlt`  
**Optional props:** `onAddToCart`, `slug`  
**Features:** Product image with zoom-on-hover, category label, product name (h3), short description, price, Add to Cart button, card shadow, rounded corners.  
See template: [./references/ProductCard.md](./references/ProductCard.md)

### ProductGrid

**Semantic element:** `<section>`  
**Required props:** `products[]`, `title`  
**Features:** Section heading (h2), responsive grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, renders `ProductCard` instances, gap-6/gap-8.

### FurnitureHeroSection

**Semantic element:** `<section>` inside `<header>` or standalone  
**Required props:** `headline`, `subheadline`, `ctaText`, `ctaHref`, `imageUrl`  
**Features:** Full-width hero, large h1, subtext, primary CTA button, full-bleed background image or split layout.

### CategoryCard

**Semantic element:** `<article>` wrapped in `<a>` or `<Link>`  
**Required props:** `name`, `imageUrl`, `imageAlt`, `href`  
**Features:** Square image, category name overlay or below, hover lift effect.

### ProductDetailLayout

**Semantic element:** `<main>` → `<section>`  
**Required props:** `product` object: `{ name, price, category, description, images[], features[] }`  
**Features:** Image gallery column, product info column, breadcrumb nav, h1 name, price, description, feature list, add-to-cart action.

### EcommerceNavbar

**Semantic element:** `<header>` → `<nav>`  
**Required props:** `brand`, `links[]`, `cartCount`  
**Features:** Logo/brand left, nav links center, cart icon right, mobile hamburger, sticky top, `aria-label="Main navigation"`.

### CartSidebar

**Semantic element:** `<aside>` with `role="dialog"` and `aria-label="Shopping cart"`  
**Required props:** `isOpen`, `onClose`, `items[]`, `total`  
**Features:** Slide-in panel, item list with image/name/qty/price, subtotal, checkout button, close button with `aria-label`.

### CallToActionSection

**Semantic element:** `<section>`  
**Required props:** `headline`, `body`, `ctaText`, `ctaHref`  
**Features:** Centered layout, large heading, descriptive paragraph, prominent button, stone/neutral background.

### Footer

**Semantic element:** `<footer>`  
**Required props:** `brand`, `links[]`, `socialLinks[]`  
**Features:** Multi-column layout on desktop, single column on mobile, brand name, nav link groups, social icons with `aria-label`, copyright.

### FeaturedProductsSection

**Semantic element:** `<section>`  
**Required props:** `title`, `products[]`  
**Features:** Section heading h2, horizontal scroll on mobile or 3-col grid, product cards, "View All" link.

---

## SEO Rules (apply to every component)

1. **Semantic HTML** — every component uses the correct landmark element as its root.
2. **Heading hierarchy** — h1 only once per page; components use h2/h3 internally.
3. **Image alt text** — always descriptive (`"Solid oak dining table with hairpin legs"`, not `"product"` or `""`).
4. **Accessible buttons** — every button has visible text or `aria-label`; no `onClick` on `<div>`.
5. **Link text** — never "click here"; always descriptive (`"View Elm Dining Chair details"`).
6. **Structured content** — use `<ul>/<li>` for feature lists, `<nav>` for navigation, `<address>` for contact info.
7. **Responsive images** — use `w-full h-full object-cover` with a fixed-height parent; include `loading="lazy"` on below-fold images.

---

## Code Output Rules

1. **Complete component** — always output a fully working React component that can be pasted and run immediately.
2. **TailwindCSS only** — no inline styles, no CSS modules, no styled-components.
3. **Props-first** — all text, images, and URLs come from props; no hardcoded content inside the component body (except fallbacks).
4. **Named export** — always `export default ComponentName` and also a named export when the component will be used in a grid or composed context.
5. **No unnecessary imports** — only import React if needed; don't import unused icons or libraries.
6. **Example usage block** — after the component, show a `/* Usage */` comment with a realistic JSX example using representative furniture product data.
7. **File path hint** — suggest where to place the file, e.g. `// src/component/ui/ProductCard.tsx`.

---

## Example Trigger Phrases

- "Create a ProductCard component for the furniture store"
- "Build a responsive product grid with Tailwind"
- "Generate a Scandinavian hero section"
- "Make a minimalist e-commerce navbar"
- "Add a cart sidebar with slide-in animation"
- "Build a furniture category section"
- "Create a footer for the furniture shop"

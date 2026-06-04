# UI/UX Skill Guide — E-commerce Frontend (Norr Furniture)

## Overview

This document defines the UI/UX standards, design thinking, and frontend execution principles for building a premium furniture e-commerce experience.

The goal is to achieve a **high-end, Scandinavian-inspired interface** with strong focus on:

* Conversion Rate Optimization (CRO)
* Visual hierarchy
* Product discovery
* Performance & responsiveness

---

## Design Philosophy

### 1. Minimal but Intentional

* Avoid visual clutter
* Every element must have purpose
* Use whitespace as a design tool

### 2. Content First

* Products are the hero
* UI supports—not competes—with content

### 3. Calm & Premium Feel

* Neutral color palette (stone, white, muted tones)
* Soft shadows and subtle depth
* No aggressive colors or animations

---

## Layout System

### Grid System

* Base: 12-column layout (desktop)
* Spacing: 8px scale system
* Container: max-w-7xl

### Spacing Rules

* Section padding: py-20 / py-28
* Card spacing: gap-4 / gap-6
* Internal padding: p-4 / p-6

### Visual Rhythm

* Maintain consistent vertical spacing
* Avoid uneven stacking

---

## Bento Grid System

### Purpose

Bento grid is used to:

* Highlight featured products
* Break monotony of product grids
* Add editorial storytelling

### Placement Rules

* After hero OR between product rows
* Never replace full product grid

### Layout Example

* Large card: col-span-2 row-span-2
* Medium card: col-span-2
* Small card: col-span-1

### Content Types

* Featured product (high priority)
* Collection highlight
* Lifestyle image
* Promotional banner (Sale / New)
* CTA card (Explore Collection)

### Interaction

* Hover: scale-105 + image zoom
* Transition: duration-300 ease-out
* Shadow: shadow-sm → hover:shadow-md

### Mobile Behavior

* Stack vertically OR horizontal scroll
* Maintain readability and spacing

---

## Product Card UX

### Must Have

* Product image (high quality)
* Name + category
* Price (clear hierarchy)
* Rating + review count

### Enhancements

* Hover image zoom
* Secondary image (optional)
* Quick Add / Quick View
* Badge (New / Sale)

### Visual Rules

* Rounded corners: rounded-xl / rounded-2xl
* Soft shadow
* Clean typography

---

## Navigation UX

### Desktop

* Sticky navbar
* Active state indicator
* Clear hierarchy

### Mobile

* Slide drawer menu
* Large tap targets
* Smooth open/close animation

---

## Filtering & Sorting UX

### Desktop

* Sidebar filters (sticky)
* Sort dropdown (top-right)

### Mobile

* Bottom sheet filter modal
* Sticky filter button

### Filter Types

* Price range
* Category
* Material
* Availability

---

## Hero Section Design

### Rules

* Strong visual image/video
* Gradient overlay for readability
* Clear CTA hierarchy

### Typography

* Headline: large, light weight
* Subheadline: muted, readable

---

## Motion & Animation

### Principles

* Subtle, not distracting
* Enhance—not dominate—UX

### Standard Animations

* Hover: scale (1.02–1.05)
* Fade-in: opacity + translateY
* Duration: 200–400ms

### Bento Animation

* Staggered reveal
* Image zoom on hover
* Smooth transform transitions

---

## Color System

### Base

* Background: stone-50 / white
* Text: stone-900 / stone-500

### Accent

* Minimal usage (e.g., Sale → rose-600)

### Contrast

* Ensure accessibility (WCAG compliant)

---

## Typography

### Hierarchy

* H1: text-3xl / text-4xl
* H2: text-2xl / text-3xl
* Body: text-sm / text-base

### Style

* Light font weight for premium feel
* Tight tracking for headlines

---

## Mobile Design Principles

### Layout

* 2-column product grid
* Generous spacing

### Interaction

* Large tap areas
* Sticky actions (filter, cart)

### Performance

* Lazy loading images
* Avoid heavy animations

---

## Performance Optimization

* Use lazy loading (loading="lazy")
* Optimize images (WebP / compressed)
* Avoid unnecessary re-renders
* Use skeleton loaders

---

## Accessibility

* Proper semantic HTML
* ARIA labels for navigation
* Keyboard navigation support
* Focus states visible

---

## Code Quality (Frontend)

### Structure

* Component-based architecture
* Reusable UI components

### Naming

* Clear, consistent naming

### Styling

* Tailwind utility-first
* Avoid inline styles

### Maintainability

* Keep components small and focused

---

## Conversion Optimization (CRO)

### Key Areas

* Clear CTAs
* Fast loading
* Easy navigation
* Trust signals (reviews, guarantees)

### Product Discovery

* Highlight best products
* Use bento for storytelling
* Reduce friction in browsing

---

## Final Principle

> Good UI attracts users. Great UX makes them stay and buy.

Always design with intention, clarity, and user flow in mind.

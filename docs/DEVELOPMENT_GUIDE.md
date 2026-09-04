# Development Guide: Cinematic Scroll Portfolio

This comprehensive guide details the technical architecture, tech stack, and step-by-step methodology behind building this cinematic, scroll-driven portfolio website. It explains how to achieve premium, dynamic animations similar to those used by top design agencies (like Apple's product pages).

---

## 🏗️ 1. Tech Stack Overview

This project leverages modern frontend technologies to ensure performance, SEO, and developer experience.

- **Next.js (App Router)**: The core framework. Provides server-side rendering, routing, and an optimized build process.
- **React (v19)**: Component-based UI library.
- **Tailwind CSS**: A utility-first CSS framework used for layout, typography, responsive design, and base gradients.
- **Framer Motion**: A production-ready motion library for React. This is the engine behind all the scroll-linked animations and smooth micro-interactions.
- **HTML Canvas**: Used for rendering high-performance image sequences synced to the scroll position.

---

## 🎬 2. The Core Animation Engine: ScrollyCanvas

The defining feature of this portfolio is the cinematic background that plays as you scroll. This is NOT a `<video>` element, but rather an **Image Sequence rendered on an HTML `<canvas>`**.

### Why Canvas instead of Video?
Videos are notoriously difficult to scrub through smoothly based on scroll position due to keyframe decoding issues in browsers. Canvas allows us to draw exact frames (images) instantaneously, resulting in a buttery-smooth, stutter-free scroll experience.

### How it works (`ScrollyCanvas.tsx`):
1. **Preloading Assets**: The component fetches all 240 compressed JPEG frames (`/frames/frame_001.jpg`, etc.) in the background when the site loads. This ensures there is no flickering when the user scrolls.
2. **Scroll Tracking**: We use Framer Motion's `useScroll` (passed down as `scrollYProgress`) to track how far the user has scrolled down the page. The value ranges from `0` (top) to `1` (bottom).
3. **Frame Mapping**: 
   ```javascript
   let frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
   ```
   We map the `0` to `1` progress to our frame index (`0` to `239`).
4. **Drawing to Canvas**: Whenever the scroll value changes (detected via `useMotionValueEvent`), we call `requestAnimationFrame` to draw the exact corresponding image onto the canvas, scaled to fill the screen (`ctx.drawImage(...)`).

---

## ✨ 3. Synchronized Typography: The Overlay Component

While the canvas plays in the background, text elements need to fade in and out at exact moments to match the visual story.

### How it works (`Overlay.tsx`):
1. **useTransform**: This is the magic hook from Framer Motion. It maps one range of values to another.
   ```javascript
   // Example: Fade out the hero text between 12% and 15% of the scroll distance
   const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.15], [1, 1, 0]);
   ```
2. **Fixed Positioning**: The text layers are inside a `fixed` container (`position: fixed; inset: 0`), meaning they stay on the screen while the page scrolls.
3. **Pointer Events**: We set `pointer-events-none` on the overlays so they don't block the user from interacting with the page (like clicking links or scrolling).
4. **Text Shadows & Glows**: To ensure text is legible against varying background frames (which might be bright or dark), the project uses heavily layered text shadows.
   ```javascript
   // Pattern: tight dark base → soft dark halo → wide colour bloom
   const SHADOW_BUILDING = '0 1px 4px rgba(0,0,0,0.98), 0 4px 18px rgba(0,0,0,0.80), 0 0 50px rgba(240,136,72,0.80)';
   ```

---

## 🎨 4. Micro-Interactions: Projects Component

The projects section uses "Glassmorphism" and interactive hover states to create a premium feel.

### Techniques Used (`Projects.tsx`):
1. **Glassmorphism**: Achieved using Tailwind's `backdrop-blur-xl` combined with semi-transparent background gradients and subtle borders (`border: '1px solid rgba(217,112,48,0.08)'`).
2. **Framer Motion `whileHover`**: Used to lift the card up slightly (`translateY: -8`) and scale it (`scale: 1.02`) with a spring physics animation (`type: 'spring', stiffness: 300`).
3. **Dynamic Glow**: A blur div (`blur-xl`) sits behind the card and changes opacity based on React State (`onMouseEnter` / `onMouseLeave`), creating a blooming light effect when hovered.
4. **Scroll Reveal**: Elements fade in and slide up when they enter the viewport using:
   ```javascript
   initial={{ opacity: 0, y: 20 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true }}
   ```

---

## 🚀 How to build your own (Step-by-Step)

If you want to recreate this style for another project, follow this blueprint:

1. **Extract your video into frames**:
   Use FFmpeg to convert a video into an image sequence. Compress them heavily (WebP or JPEG with 60% quality) to keep the total payload small.
   ```bash
   ffmpeg -i input.mp4 -vf fps=30 %03d.jpg
   ```
2. **Setup Next.js & Framer Motion**:
   ```bash
   npx create-next-app@latest my-portfolio
   npm install framer-motion clsx tailwind-merge
   ```
3. **Create the Scroll Context**:
   In your main `page.tsx`, use the `useScroll` hook to get the `scrollYProgress`.
   ```javascript
   const { scrollYProgress } = useScroll();
   ```
4. **Pass Progress to Children**:
   Pass this `scrollYProgress` variable down to your `ScrollyCanvas` and `Overlay` components so they stay perfectly in sync.
5. **Map Opacity to Keyframes**:
   Figure out exactly when (at what percentage of the scroll) you want elements to appear. Use `useTransform` to map those percentages to CSS opacity/transform values.
6. **Refine with Easing and Spring**:
   Don't just rely on linear transitions. Use Framer Motion's `spring` transitions for hover effects to make UI elements feel physical and responsive.

## 💡 Pro Tips for Premium Polish

- **Custom Fonts**: Use distinct fonts for different purposes. This project mixes a Display Serif for elegance, a Sans-Serif for body text, and a Mono font for technical accents.
- **Ambient Lighting**: Use subtle radial gradients in the background to simulate light sources.
- **Mix Blend Modes**: Use CSS `mix-blend-overlay` on large text over complex backgrounds to make the text feel embedded into the scene.
- **Performance**: Always use `requestAnimationFrame` when interacting with the HTML Canvas during scroll events to prevent jank.

---

## 🔠 5. Typography System

The project uses a carefully selected set of fonts (configured in `lib/fonts.ts` and `app/layout.tsx`) to establish a clear visual hierarchy and premium feel:

- **DM Serif Display**: Used for elegant, large display elements and primary taglines (e.g., "Learning"). Provides a classic, editorial contrast to the modern layout.
- **Satoshi**: A modern, clean geometric sans-serif used for body text, subtitles, and general UI elements.
- **Roboto Mono** & **JetBrains Mono**: Monospaced fonts used for technical accents, section labels (e.g., "01 PHILOSOPHY"), and tags. They reinforce the "Software Engineering" identity.

These fonts are loaded via Next.js optimizations and injected as CSS variables at the root `<html>` level, making them globally accessible.

---

## 📁 6. Project Architecture & Structure

The codebase follows a standard Next.js App Router structure, keeping concerns cleanly separated:

```text
Portfolio/
├── app/                  # Next.js App Router root
│   ├── layout.tsx        # Global HTML structure, font injection, and metadata
│   ├── page.tsx          # Main entry point (assembles Canvas, Overlay, Projects)
│   └── globals.css       # Tailwind entry point and global styles
├── components/           # Reusable UI components
│   ├── ScrollyCanvas.tsx # Handles the canvas rendering and image preloading
│   ├── Overlay.tsx       # Scroll-linked typography animations
│   └── Projects.tsx      # The glassmorphic projects grid
├── lib/                  # Utility functions and configurations
│   ├── fonts.ts          # Font loading and configuration
│   └── utils.ts          # Helper functions (e.g., Tailwind class merging)
└── public/               # Static assets
    ├── frames/           # The compressed JPEG image sequence for the canvas
    └── *                 # Favicons and other static assets
```

### Key Architectural Decisions:
- **`'use client'` Directives**: Because `Framer Motion` and Canvas interactions rely on browser APIs, components like `ScrollyCanvas`, `Overlay`, and `Projects` are strictly marked as Client Components.
- **Component Composition**: `page.tsx` acts as the orchestrator. It holds the `useScroll` hook and passes the `scrollYProgress` to the child components, ensuring they are perfectly synchronized without deeply nesting state.

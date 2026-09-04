# Architecture Document

## 1. System Overview
The Cinematic Scroll Portfolio is built on a modern React stack, specifically utilizing the **Next.js App Router**. It is a heavily client-side interactive application, leveraging Server-Side Rendering (SSR) for initial load performance and SEO, but relying on Client Components for its core scroll-driven animations.

## 2. Tech Stack
- **Core Framework:** Next.js 15+ (App Router)
- **Library:** React 19
- **Animation Engine:** Framer Motion
- **Styling:** Tailwind CSS v4, PostCSS
- **Type Checking:** TypeScript
- **Deployment:** Vercel

## 3. Project Structure
The codebase follows a clear separation of concerns:

```text
Portfolio/
├── app/                  # Next.js App Router root
│   ├── layout.tsx        # Global HTML structure, font injection, and metadata
│   ├── page.tsx          # Main entry point; orchestrates Scroll, Canvas, and UI
│   └── globals.css       # Tailwind configuration and global styles
├── components/           # Reusable UI components (Client Components)
│   ├── ScrollyCanvas.tsx # Handles HTML canvas rendering and image preloading
│   ├── Overlay.tsx       # Manages scroll-linked typography animations
│   └── Projects.tsx      # Project showcase with glassmorphism effects
├── lib/                  # Utilities and configuration
│   ├── fonts.ts          # Font loading/configuration setup
│   └── utils.ts          # Helper functions (e.g., Tailwind class merging via clsx/tailwind-merge)
└── public/               # Static Assets
    ├── frames/           # Pre-compressed JPEG image sequence (240 frames) for the canvas
    └── *                 # Icons, favicons, logos
```

## 4. Core Architecture Components

### 4.1 Orchestrator (`app/page.tsx`)
The main entry point acts as the scroll orchestrator. It uses Framer Motion's `useScroll` hook to calculate the `scrollYProgress` (ranging from `0` to `1`). This progress value is passed down to child components, ensuring perfect synchronization across different visual elements without deep state nesting.

### 4.2 The Animation Engine (`ScrollyCanvas.tsx`)
Because standard `<video>` tags struggle with smooth scrubbing based on scroll, the architecture uses an **Image Sequence on an HTML `<canvas>`**.
- **Preloading:** Fetches 240 compressed JPEG frames in the background.
- **Rendering:** Uses `requestAnimationFrame` and maps the `0` to `1` scroll progress to a frame index (`0` to `239`), drawing the exact image frame directly to the canvas context (`ctx.drawImage`).

### 4.3 Synchronized Typography (`Overlay.tsx`)
Uses Framer Motion's `useTransform` to map specific scroll progress ranges to CSS properties (like `opacity` or `transform`). The elements are absolutely/fixed positioned with `pointer-events-none` to prevent blocking interactions.

### 4.4 Data Flow & State Management
Given the nature of the application, there is no heavy global state management library (like Redux). State is heavily bound to the scroll position managed by Framer Motion, and local React state (`useState`, `useMotionValueEvent`) is used within individual Client Components.

## 5. Key Architectural Decisions
- **`'use client'` Directives:** Necessary for `ScrollyCanvas`, `Overlay`, and `Projects` due to their reliance on browser APIs (Canvas, Scroll Events) and Framer Motion.
- **Image Sequence over Video:** Chosen specifically for guaranteed stutter-free scrubbing performance.
- **Tailwind v4:** Utilized for utility-first styling to ensure rapid iteration and a minimal CSS footprint.

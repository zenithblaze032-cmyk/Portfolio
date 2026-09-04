# Design System & Aesthetics

## 1. Design Philosophy
The design philosophy behind the Cinematic Scroll Portfolio aims to mimic the high-end, premium feel of top design agencies and product pages (e.g., Apple). It relies on:
- High visual impact upon initial load.
- Seamless, cinematic storytelling through scroll.
- Subtle, organic micro-interactions.
- A strong sense of depth using shadows, glows, and blurs.

## 2. Typography System
A carefully curated, multi-font typography system establishes visual hierarchy:
- **DM Serif Display:** An elegant display serif used for primary taglines and large text elements to provide a classic, editorial contrast.
- **Satoshi:** A modern, geometric sans-serif used for body text, subtitles, and general UI.
- **Roboto Mono / JetBrains Mono:** Monospaced fonts used for technical accents, section labels (e.g., `01 PHILOSOPHY`), and tags, reinforcing the "Software Engineering" identity.

Fonts are configured via Next.js optimizations and injected as CSS variables at the root level.

## 3. Visual Styling & Effects

### 3.1 Glassmorphism
The `Projects` component and overlay panels utilize Glassmorphism:
- **Backdrop Blurs:** Uses `backdrop-blur-xl` to blur the cinematic canvas behind the UI.
- **Semi-transparent Backgrounds:** Elements use rgba background colors to allow light to pass through.
- **Subtle Borders:** E.g., `1px solid rgba(217,112,48,0.08)` to define edges without harsh lines.

### 3.2 Lighting & Glows (Ambient Lighting)
To simulate dynamic lighting against the varying background frames:
- **Text Shadows:** Uses heavily layered shadows to ensure text legibility (e.g., tight dark base → soft dark halo → wide color bloom).
- **Dynamic Blooming:** Background `blur-xl` divs change opacity on hover states, creating a glowing light effect behind interactive cards.

### 3.3 Mix Blend Modes
Uses CSS `mix-blend-overlay` on large typography over complex backgrounds so the text feels physically embedded into the scene.

## 4. Animation & Micro-Interactions

### 4.1 Scroll-Linked Animations
- **Fade Ins/Outs:** Elements appear and disappear precisely as the user reaches specific scroll milestones.
- **Scroll Reveal:** Elements slide up and fade in when they enter the viewport (`whileInView={{ opacity: 1, y: 0 }}`).

### 4.2 Hover Physics
Framer Motion is used to give UI elements physical weight:
- **Spring Physics:** Hover states utilize spring transitions (`type: 'spring', stiffness: 300`) to lift elements up slightly (`translateY: -8`) and scale them (`scale: 1.02`), making the interface feel responsive and alive.

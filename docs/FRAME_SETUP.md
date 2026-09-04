# Ayush Kumar Portfolio - Frame Setup Guide

## Overview

This portfolio uses a scrollytelling mechanic with 200 WebP frame images that sync to scroll position. The frames are preloaded on page load and rendered on a sticky canvas that scrubs through them as you scroll.

## Frame Files Setup

### Required Structure

Place your 200 frame images in the `/public/split_frames/` directory with the following naming convention:

```
/public/split_frames/
├── frame_000_delay-0.05s.webp
├── frame_001_delay-0.05s.webp
├── frame_002_delay-0.05s.webp
├── ...
└── frame_199_delay-0.05s.webp
```

### Frame Specifications

- **Format:** WebP (recommended for web optimization)
- **Count:** 200 frames (frame_000 to frame_199)
- **Naming:** Exactly as shown above (zero-padded to 3 digits)
- **Aspect Ratio:** Recommended 16:9 or 21:9 for cinematic feel
- **Resolution:** 1920x1080 or higher recommended
- **Size per frame:** ~50-100 KB for good performance (total ~10-20 MB)

### Creating Frame Images

You can generate these frames from:
- **Video source:** Export a video as individual frames using FFmpeg
- **3D animation:** Render from Blender, Three.js, or similar
- **Design software:** Export each frame from After Effects, Cinema 4D, etc.

### FFmpeg Command Example

Convert a video to numbered WebP frames:

```bash
ffmpeg -i your_video.mp4 \
  -vf "scale=1920:1080" \
  -q:w 80 \
  /public/split_frames/frame_%03d_delay-0.05s.webp
```

## Component Architecture

### ScrollyCanvas.tsx
- **Purpose:** Renders current frame on sticky canvas
- **Features:**
  - DPR-aware scaling for crisp rendering on high-DPI displays
  - `object-fit: cover` math for responsive aspect ratios
  - Preload progress HUD with percentage bar
  - Frame counter in bottom-right
  - Fallback text rendering if images don't load

### Overlay.tsx
- **Purpose:** Scroll-driven text animations with Framer Motion
- **Sections:**
  - 0-20%: Hero ("Ayush Kumar" title)
  - 25-55%: Philosophy (left-aligned)
  - 58-90%: Strategy (right-aligned)

### Projects.tsx
- **Purpose:** Featured projects grid below scroll track
- **Features:**
  - 3 glassmorphic cards with spring hover animations
  - Gradient light effect on hover
  - Accent line animation

## Scroll Configuration

- **Total scroll height:** 650vh (650% of viewport)
- **Frame mapping:** Scroll progress × 200 frames = current frame index
- **Smooth scrolling:** Enabled via `scroll-smooth` class on HTML

## Design System

### Colors
- **Background:** `#121212` (ultra-dark)
- **Primary accents:** Cyan (`#00d4ff`) & Purple (`#a100ff`)
- **Text:** Light gray shades for readability

### Scrollbar
- **Style:** Custom thin gradient scrollbar
- **Colors:** Cyan to purple gradient
- **Visibility:** Hover-responsive opacity

### Vignette Effect
- **Type:** Radial gradient overlay
- **Purpose:** Frames cinematic atmosphere
- **Applied:** Via CSS pseudo-element on body

## Performance Optimization

1. **Frame Preloading:** All 200 images load before scroll begins
2. **Canvas Context:** Uses `imageSmoothingQuality: 'high'` for crisp rendering
3. **Device Pixel Ratio:** Scales canvas by DPR for retina displays
4. **Passive Scroll Listener:** Non-blocking scroll event handler

## Debugging

### Frame Loading Issues

Check the browser console for frame load errors:
```
[v0] Failed to load frame XXX
```

**Solution:** Verify frames exist in `/public/split_frames/` with exact naming.

### Frame Counter Not Updating

- Scroll event listener may be blocked
- Check browser DevTools console for JavaScript errors
- Verify `useScrollProgress` hook is firing

### Canvas Rendering Black

- Frames may not be loading (see console)
- Device may have GPU acceleration disabled
- Try opening DevTools and reloading

## Customization

### Changing Total Scroll Height

Edit `app/page.tsx`:
```tsx
<div className="relative w-full" style={{ height: '650vh' }}>
```

Edit `components/Overlay.tsx`:
```tsx
<div ref={containerRef} style={{ height: '650vh' }}>
```

### Adjusting Text Animation Timings

Edit `components/Overlay.tsx` `useTransform` values:
```tsx
// Hero: visible 0-20%, fades out 20-25%
const heroOpacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
```

### Adding More Project Cards

Edit `components/Projects.tsx`:
```tsx
const projects = [
  // Add new project objects here
];
```

## Testing

1. **Frame Loading:** Check Network tab in DevTools for all 200 WebP requests
2. **Scroll Performance:** Use DevTools Performance profiler during scroll
3. **Animations:** Verify overlay text fades in/out at correct scroll points
4. **Hover Effects:** Test project card hover animations on desktop

## Deployment

When deploying to Vercel:
1. Ensure `/public/split_frames/` directory is included in build
2. All 200 WebP frames must be deployed (not gitignored)
3. Consider using Vercel's image optimization for further compression
4. Test production build: `pnpm build && pnpm start`

## Browser Support

- ✅ Chrome/Edge 90+ (WebP support)
- ✅ Firefox 93+ (WebP support)
- ✅ Safari 16+ (WebP support)
- ✅ Mobile browsers (iOS Safari 16+, Android Chrome)

For older browser support, provide fallback JPEG/PNG frames.

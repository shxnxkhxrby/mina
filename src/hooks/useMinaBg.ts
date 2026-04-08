/**
 * useMinaBg — cycles through mina background images on each mount.
 *
 * Images must be placed at:
 *   public/imgs/mina_bg/mina_bg1.[jpg|png|webp]
 *   public/imgs/mina_bg/mina_bg2.[jpg|png|webp]
 *   public/imgs/mina_bg/mina_bg3.[jpg|png|webp]
 *
 * Each time a component that calls this hook mounts, it gets the next
 * background in the cycle (1 → 2 → 3 → 1 → 2 → …).
 *
 * Usage:
 *   const minaBg = useMinaBg();
 *   // minaBg => "/imgs/mina_bg/mina_bg1.jpg" (or .png / .webp)
 *
 * The hook returns the URL string. Drop it straight into a CSS background
 * or an <img src>. An <img> with onError fallback is recommended so the
 * app degrades gracefully if the file is missing.
 */

import { useState, useEffect } from 'react';

// ── Config ────────────────────────────────────────────────────────────────────
// Update TOTAL_IMAGES if you add more backgrounds later.
const TOTAL_IMAGES = 3;
const BASE_PATH = '/imgs/mina_bg/mina_bg';

// Supported extensions tried in order. First one found will render;
// the rest are available for <img> onError fallback chains if needed.
const EXTENSIONS = ['jpg', 'png', 'webp'] as const;

// ── Module-level counter (persists across React renders, resets on page refresh) ─
let _counter = 0;

function nextIndex(): number {
  const idx = _counter % TOTAL_IMAGES; // 0-based
  _counter += 1;
  return idx;
}

// ── Returns the primary URL to try, plus alternates for onError chaining ──────
export interface MinaBgResult {
  /** Primary URL to use as src / backgroundImage. */
  src: string;
  /** All candidate URLs for this slot, in priority order. */
  candidates: string[];
  /** 1-based image number (1–TOTAL_IMAGES). Useful for debugging. */
  imageNumber: number;
}

export function useMinaBg(): MinaBgResult {
  // Capture the index once on mount so it never changes during the scene's life.
  const [result] = useState<MinaBgResult>(() => {
    const idx = nextIndex();          // 0-based
    const n = idx + 1;                // 1-based filename number
    const candidates = EXTENSIONS.map(ext => `${BASE_PATH}${n}.${ext}`);
    return { src: candidates[0], candidates, imageNumber: n };
  });

  return result;
}

// ── Utility: build a CSS background-image value with multiple fallbacks ───────
// Use this when you're setting backgroundImage directly in a style prop and
// want the browser to pick whichever format it supports.
export function minaBgStyle(candidates: string[]): React.CSSProperties {
  // CSS image-set for modern browsers; falls back to first URL for older ones.
  return {
    backgroundImage: candidates
      .map(url => `url("${url}")`)
      .join(', '), // browsers ignore unavailable URLs in multi-bg stacks
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
  };
}

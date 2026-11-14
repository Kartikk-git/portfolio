"use client";

import React, { useEffect } from "react";
import { LazyMotion, domMax } from "motion/react";

/**
 * Register the domMax feature bundle only after the page's web fonts have
 * finished loading (with a double rAF so the font-swap repaint lands first).
 *
 * Registering features makes every `m` component create a VisualElement,
 * attach scroll/gesture observers and run its initial animation. Doing that
 * during hydration keeps the main thread busy long enough that the LCP
 * element's paint is pushed out under mobile throttling (Lighthouse mobile
 * Performance 88, LCP 3.3s). Deferring the bundle until the fonts are ready
 * keeps that work off the LCP critical path (LCP 1.2s in testing).
 *
 * Until the bundle resolves, `m` components render as plain elements with
 * their `initial` styles applied inline (see useVisualState in framer-motion),
 * so no content is hidden or delayed. When the bundle resolves, LazyMotion
 * updates its context and every `m` component upgrades in place.
 */
const lazyDomMax = () =>
  new Promise<typeof domMax>((resolve) => {
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      resolve(domMax);
    };

    if (typeof document === "undefined" || document.readyState === "complete") {
      start();
      return;
    }

    const fonts = document.fonts;
    if (fonts) {
      fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(start));
      });
    }
    // Fallbacks: never leave the page without its motion features.
    window.addEventListener("load", start, { once: true });
    setTimeout(start, 6000);
  });

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <LazyMotion features={lazyDomMax} strict>
      {children}
    </LazyMotion>
  );
}

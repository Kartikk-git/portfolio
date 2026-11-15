"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { MOTION_TOKENS } from "./motion";

export interface UseCountUpOptions {
  end: number;
  decimals?: number;
  duration?: number; // duration in seconds, default 1.2s
  triggerKey?: number | string;
}

/**
 * Reusable hook to count up a number from 0 to its target value when entering the viewport.
 * - Server renders the final exact value so the page is fully functional without JS.
 * - Respects prefers-reduced-motion (skips animation).
 * - Uses the standard ease-out curve from lib/motion.ts over ~1.2s.
 * - Re-animates when triggerKey changes (e.g. user scrolls back to the top) or when re-entering viewport.
 */
export function useCountUp({
  end,
  decimals = 0,
  duration = 1.2,
  triggerKey = 0,
}: UseCountUpOptions) {
  // SSR initial state: exact final target value to avoid hydration mismatch
  const [displayValue, setDisplayValue] = useState(() => end.toFixed(decimals));
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { margin: "0px 0px -5% 0px" });
  const prefersReduced = useReducedMotion();
  const lastTriggerRef = useRef<number | string>(triggerKey);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // If reduced motion is active, preserve final value immediately
    if (prefersReduced) {
      setDisplayValue(end.toFixed(decimals));
      return;
    }

    const isNewTrigger = triggerKey !== lastTriggerRef.current;
    if (isNewTrigger) {
      lastTriggerRef.current = triggerKey;
      hasAnimatedRef.current = false;
    }

    if (!isInView) {
      // Reset animated flag when out of view so re-entering view counts up smoothly
      hasAnimatedRef.current = false;
      return;
    }

    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Start count-up from 0 on client once in view
    setDisplayValue((0).toFixed(decimals));

    const controls = animate(0, end, {
      duration,
      ease: MOTION_TOKENS.ease.standard,
      onUpdate: (latest) => {
        setDisplayValue(latest.toFixed(decimals));
      },
      onComplete: () => {
        setDisplayValue(end.toFixed(decimals));
      },
    });

    return () => controls.stop();
  }, [isInView, end, decimals, duration, prefersReduced, triggerKey]);

  return { displayValue, ref };
}


"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";

export interface UseTiltGlowOptions {
  /** Maximum tilt in degrees on each axis (default: 4) */
  maxTilt?: number;
  /** Perspective in px (default: 900) */
  perspective?: number;
  /** Duration in ms for returning to flat on pointer leave (default: 250) */
  returnDurationMs?: number;
  /** Force disable tilt & glow (e.g. for coarse pointer or modal open) */
  disabled?: boolean;
}

export function useTiltGlow<T extends HTMLElement = HTMLElement>({
  maxTilt = 4,
  perspective = 900,
  returnDurationMs = 250,
  disabled = false,
}: UseTiltGlowOptions = {}) {
  const ref = useRef<T>(null);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setFinePointer(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isEnabled = finePointer && !prefersReducedMotion && !disabled;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!isEnabled) return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);

        // 3D tilt: maxTilt degrees on each axis
        const nx = (x / rect.width - 0.5) * 2;
        const ny = (y / rect.height - 0.5) * 2;
        const rotX = (-ny * maxTilt).toFixed(2);
        const rotY = (nx * maxTilt).toFixed(2);

        el.style.transform = `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    },
    [isEnabled, maxTilt, perspective]
  );

  const handlePointerEnter = useCallback(() => {
    if (!isEnabled) return;
    const el = ref.current;
    if (!el) return;
    el.style.willChange = "transform";
    el.style.transition =
      "transform 60ms ease-out, border-color 200ms ease, opacity 200ms ease, background-color 200ms ease";
  }, [isEnabled]);

  const handlePointerLeave = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    const el = ref.current;
    if (!el) return;

    // Smooth return to flat on leave (~250ms cubic-bezier(0.22, 1, 0.36, 1) from lib/motion.ts)
    el.style.transition = `transform ${returnDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease, opacity 200ms ease, background-color 200ms ease`;
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`;

    setTimeout(() => {
      if (el) el.style.willChange = "auto";
    }, returnDurationMs);
  }, [perspective, returnDurationMs]);

  return {
    ref,
    onPointerMove: handlePointerMove,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    isEnabled,
  };
}


"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { m, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { mediaManifest } from "@/content/media";
import { MOTION_TOKENS, transitions } from "@/lib/motion";

/**
 * Floating project screenshot preview (brief section 3).
 *
 * - Follow mode (pointer-fine hover): tracks the pointer with spring
 *   smoothing and is revealed by a clip-path draw.
 * - Fixed mode (keyboard focus): sits beside the focused row at `anchor`.
 *
 * Only rendered when the project has a real screenshot in the media
 * manifest; otherwise the section never mounts it.
 */

const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 200; // 16:10
const MARGIN = 8;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

interface ProjectPreviewPanelProps {
  slotId: string | null;
  mode: "follow" | "fixed";
  /**
   * Follow mode: raw pointer coordinates (the panel offsets itself right and
   * centres vertically). Fixed mode: the final top-left corner of the panel.
   */
  anchor: { x: number; y: number } | null;
}

export function ProjectPreviewPanel({ slotId, mode, anchor }: ProjectPreviewPanelProps) {
  const reducedMotion = useReducedMotion();
  const visible = Boolean(slotId);

  // Keep the last real slot while hidden so the clip-path exit animation can
  // play out before the panel unmounts.
  const lastSlotRef = useRef<string | null>(null);
  if (slotId) lastSlotRef.current = slotId;

  const x = useMotionValue(-PANEL_WIDTH * 2);
  const y = useMotionValue(-PANEL_HEIGHT * 2);
  const springX = useSpring(x, MOTION_TOKENS.spring);
  const springY = useSpring(y, MOTION_TOKENS.spring);
  const placedRef = useRef(false);

  // Place the panel directly on first appearance so it never flies in from
  // the top-left corner, then hand over to the spring for subsequent moves.
  useEffect(() => {
    if (!visible || !anchor) return;
    const raw =
      mode === "follow"
        ? { left: anchor.x + 24, top: anchor.y - PANEL_HEIGHT / 2 }
        : { left: anchor.x, top: anchor.y };
    if (!placedRef.current) {
      x.set(clamp(raw.left, MARGIN, window.innerWidth - PANEL_WIDTH - MARGIN));
      y.set(clamp(raw.top, MARGIN, window.innerHeight - PANEL_HEIGHT - MARGIN));
      placedRef.current = true;
    }
  }, [visible, anchor, mode, x, y]);

  useEffect(() => {
    if (!visible) placedRef.current = false;
  }, [visible]);

  // Pointer following with spring smoothing.
  useEffect(() => {
    if (!visible || mode !== "follow") return;
    const onMove = (event: PointerEvent) => {
      x.set(clamp(event.clientX + 24, MARGIN, window.innerWidth - PANEL_WIDTH - MARGIN));
      y.set(
        clamp(
          event.clientY - PANEL_HEIGHT / 2,
          MARGIN,
          window.innerHeight - PANEL_HEIGHT - MARGIN
        )
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [visible, mode, x, y]);

  // Keyboard focus: fixed position beside the row.
  useEffect(() => {
    if (!visible || mode !== "fixed" || !anchor) return;
    x.set(clamp(anchor.x, MARGIN, window.innerWidth - PANEL_WIDTH - MARGIN));
    y.set(clamp(anchor.y, MARGIN, window.innerHeight - PANEL_HEIGHT - MARGIN));
  }, [visible, mode, anchor, x, y]);

  const activeSlotId = slotId ?? lastSlotRef.current;
  const slot = activeSlotId ? mediaManifest[activeSlotId] : undefined;
  if (!slot || !slot.src) return null;

  return createPortal(
    <m.div
      aria-hidden="true"
      data-project-preview="true"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      }}
      transition={reducedMotion ? { duration: 0.1 } : transitions.base}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        width: PANEL_WIDTH,
        maxWidth: "80vw",
        zIndex: 40,
        pointerEvents: "none",
      }}
      className="hidden md:block"
    >
      <div className="aspect-[16/10] overflow-hidden border border-[var(--rule)] bg-[var(--surface)]">
        <img
          src={slot.src}
          alt={slot.caption || slot.label}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    </m.div>,
    document.body
  );
}

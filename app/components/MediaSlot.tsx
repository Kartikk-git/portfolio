"use client";

import React from "react";
import { mediaManifest, MediaSlotDef } from "@/content/media";

interface MediaSlotProps {
  slotId: string;
  onClick?: () => void;
  className?: string;
  isClickable?: boolean;
}

/**
 * Renders a real media asset. Slots without an asset are omitted from the
 * rendered page entirely (the brief forbids visitor-visible placeholders).
 *
 * TODO(owner): the following slots are still empty in content/media.json and
 * are therefore hidden: p1-shot-3, p1-demo, p1-arch, p1-erd, p2-shot-1..3,
 * p3-shot-1..2, p4-shot-1, p5-shot-1..3, p5-demo, cred-codechef-2..5,
 * cred-gcloud-3. Drop the assets into /public with the manifest entry to show
 * them.
 */
export function MediaSlot({ slotId, onClick, className = "", isClickable = true }: MediaSlotProps) {
  const slot: MediaSlotDef | undefined = mediaManifest[slotId];

  // No manifest entry or no real asset yet: omit from the page.
  if (!slot || !slot.src) return null;

  const ratioStyle = slot.ratio ? { aspectRatio: slot.ratio } : undefined;

  if (slot.type === "video") {
    return (
      <div style={ratioStyle} className={`relative overflow-hidden border border-[var(--rule)] bg-[var(--ink)] ${className}`}>
        <video
          src={slot.src}
          controls
          preload="metadata"
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div
      style={ratioStyle}
      onClick={onClick}
      className={`relative overflow-hidden border border-[var(--rule)] bg-[var(--surface)] ${
        isClickable && onClick ? "cursor-pointer group" : ""
      } ${className}`}
    >
      <img
        src={slot.src}
        alt={slot.caption || slot.label}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
      />
    </div>
  );
}

"use client";

import React from "react";
import { mediaManifest, mediaCopy, MediaSlotDef } from "@/content/media";

interface MediaSlotProps {
  slotId: string;
  onClick?: () => void;
  className?: string;
  isClickable?: boolean;
}

export function MediaSlot({ slotId, onClick, className = "", isClickable = true }: MediaSlotProps) {
  const slot: MediaSlotDef | undefined = mediaManifest[slotId];

  if (!slot) {
    return (
      <div className={`p-4 border border-[var(--rule)] bg-[var(--surface)] text-xs font-mono text-[var(--ink-muted)] ${className}`}>
        [SLOT NOT FOUND: {slotId}]
      </div>
    );
  }

  const ratioStyle = slot.ratio ? { aspectRatio: slot.ratio } : undefined;

  // Real media rendered
  if (slot.src) {
    if (slot.type === "video") {
      return (
        <div style={ratioStyle} className={`relative overflow-hidden border border-[var(--rule)] bg-black ${className}`}>
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
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  // Placeholder rendered
  let typeLabel = "SCREENSHOT";
  let title = mediaCopy.phScreenshotTitle;
  let body = mediaCopy.phScreenshotBody.replace("{label}", slot.label);

  if (slot.type === "video") {
    typeLabel = "DEMO";
    title = mediaCopy.phVideoTitle;
    body = mediaCopy.phVideoBody.replace("{project}", slot.project || slot.label);
  } else if (slot.type === "diagram") {
    typeLabel = "DIAGRAM";
    title = mediaCopy.phDiagramTitle;
    body = mediaCopy.phDiagramBody.replace("{label}", slot.label);
  } else if (slot.type === "certificate") {
    typeLabel = "CERTIFICATE";
    title = mediaCopy.phCertificateTitle;
    body = mediaCopy.phCertificateBody.replace("{title}", slot.title || slot.label);
  }

  return (
    <div
      style={ratioStyle}
      onClick={isClickable && onClick ? onClick : undefined}
      role={isClickable && onClick ? "button" : undefined}
      tabIndex={isClickable && onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative w-full overflow-hidden border border-[var(--rule)] bg-[var(--surface)] flex flex-col justify-between p-4 sm:p-5 select-none transition-colors ${
        isClickable && onClick
          ? "cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--surface)]/90 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          : ""
      } ${className}`}
    >
      {/* Subtle hatch background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, var(--rule) 0, var(--rule) 1px, transparent 0, transparent 12px)`,
        }}
        aria-hidden="true"
      />

      {/* Monospace type label */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.06em] px-2 py-0.5 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-muted)]">
          [{typeLabel} · {slot.label}]
        </span>
        {slot.ratio && (
          <span className="font-mono text-[10px] text-[var(--ink-muted)] opacity-75">
            {slot.ratio}
          </span>
        )}
      </div>

      {/* Description text */}
      <div className="relative z-10 my-auto py-3">
        <p className="font-serif text-sm sm:text-base font-medium text-[var(--ink)] mb-1">
          {title}
        </p>
        <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed max-w-[48ch]">
          {body}
        </p>
      </div>

      {/* Slot identifier */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[var(--rule)]/60 text-[10px] font-mono text-[var(--ink-muted)]">
        <span>slot: {slotId}</span>
        {isClickable && onClick && (
          <span className="text-[var(--accent)] flex items-center gap-1">
            Preview in Lightbox &rarr;
          </span>
        )}
      </div>
    </div>
  );
}


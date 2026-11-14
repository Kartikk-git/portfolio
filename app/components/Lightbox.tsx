"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import { mediaManifest, MediaSlotDef } from "@/content/media";
import { siteContent } from "@/content/site";
import { useFocusTrap } from "@/lib/focus-trap";

interface LightboxProps {
  slots: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ slots, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  useFocusTrap(dialogRef, true);

  useEffect(() => {
    prevActiveRef.current = document.activeElement as HTMLElement | null;
    return () => {
      prevActiveRef.current?.focus();
    };
  }, []);

  const total = slots.length;
  const currentSlotId = slots[index];
  const slot: MediaSlotDef | undefined = mediaManifest[currentSlotId];

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);

  // Lock background scroll while open (both documentElement and body)
  useEffect(() => {
    const origHtml = document.documentElement.style.overflow;
    const origBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = origHtml;
      document.body.style.overflow = origBody;
    };
  }, []);

  const counterText = siteContent.ui.lightboxCounter
    .replace("{i}", String(index + 1))
    .replace("{n}", String(total));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      ref={dialogRef}
      onWheel={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 backdrop-blur-xs p-4 sm:p-6 transition-opacity duration-200 overscroll-contain"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between text-[var(--paper)] max-w-5xl w-full mx-auto pb-4 border-b border-[var(--paper)]/10">
        <span className="font-mono text-xs uppercase tracking-[0.06em] opacity-80">
          {counterText}
        </span>
        <button
          onClick={onClose}
          aria-label={siteContent.ui.lightboxClose}
          className="font-mono text-xs uppercase tracking-[0.06em] px-2.5 py-1.5 border border-[var(--paper)]/20 hover:border-[var(--paper)]/60 hover:bg-[var(--paper)]/10 transition-colors rounded-[4px] cursor-pointer text-[var(--paper)] inline-flex items-center gap-1.5"
        >
          <span>{siteContent.ui.modalClose} [Esc]</span>
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Main media view */}
      <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative max-w-5xl w-full mx-auto">
        {slot && slot.src ? (
          <div className="max-h-[75vh] max-w-full flex items-center justify-center">
            {slot.type === "video" ? (
              <video
                src={slot.src}
                controls
                preload="metadata"
                className="max-h-[75vh] max-w-full object-contain rounded-[4px] border border-[var(--paper)]/10"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={slot.src}
                alt={slot.caption || slot.label}
                className="max-h-[75vh] max-w-full object-contain rounded-[4px] border border-[var(--paper)]/10 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              />
            )}
          </div>
        ) : (
          <div className="text-[var(--paper)] font-mono text-sm">Media not available</div>
        )}
      </div>

      {/* Bottom controls & caption */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-[var(--paper)]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--paper)]">
        <p className="font-sans text-xs sm:text-sm text-[var(--paper)]/70 text-center sm:text-left max-w-xl">
          {slot?.caption || slot?.label}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label={siteContent.ui.lightboxPrev}
            className="font-mono text-xs px-3 py-1.5 border border-[var(--paper)]/20 hover:border-[var(--paper)]/60 hover:bg-[var(--paper)]/10 transition-colors rounded-[4px] cursor-pointer"
          >
            &larr; Prev
          </button>
          <button
            onClick={goNext}
            aria-label={siteContent.ui.lightboxNext}
            className="font-mono text-xs px-3 py-1.5 border border-[var(--paper)]/20 hover:border-[var(--paper)]/60 hover:bg-[var(--paper)]/10 transition-colors rounded-[4px] cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}


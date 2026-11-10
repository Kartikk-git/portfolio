"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { mediaManifest, mediaCopy, MediaSlotDef } from "@/content/media";
import { siteContent } from "@/content/site";

interface LightboxProps {
  slots: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ slots, initialIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

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

  // Lock body scroll while open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
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
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#111315]/90 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-200"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between text-[var(--paper)] max-w-5xl w-full mx-auto pb-4 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-[0.06em] opacity-80">
          {counterText}
        </span>
        <button
          onClick={onClose}
          aria-label={siteContent.ui.lightboxClose}
          className="font-mono text-xs uppercase tracking-[0.06em] px-3 py-1.5 border border-white/20 hover:border-white/60 hover:bg-white/10 transition-colors rounded-[4px] cursor-pointer text-white"
        >
          {siteContent.ui.modalClose} [Esc]
        </button>
      </div>

      {/* Main media view */}
      <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative max-w-5xl w-full mx-auto">
        {slot ? (
          <div className="max-h-[75vh] max-w-full flex items-center justify-center">
            {slot.src ? (
              slot.type === "video" ? (
                <video
                  src={slot.src}
                  controls
                  preload="metadata"
                  className="max-h-[75vh] max-w-full object-contain rounded-[4px] border border-white/10"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={slot.src}
                  alt={slot.caption || slot.label}
                  className="max-h-[75vh] max-w-full object-contain rounded-[4px] border border-white/10 shadow-2xl"
                />
              )
            ) : (
              <div
                style={slot.ratio ? { aspectRatio: slot.ratio } : { width: "560px", maxWidth: "90vw", height: "380px" }}
                className="border border-white/20 bg-[#181B1E] p-6 sm:p-8 flex flex-col justify-between rounded-[4px] shadow-2xl text-white relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #FFF 0, #FFF 1px, transparent 0, transparent 12px)`,
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex items-center justify-between font-mono text-xs opacity-75">
                  <span>[{slot.type.toUpperCase()} · {slot.label}]</span>
                  <span>{slot.ratio || "standard"}</span>
                </div>
                <div className="relative z-10 my-auto text-left py-4">
                  <h3 className="font-serif text-xl sm:text-2xl text-white mb-2">
                    {slot.type === "video"
                      ? mediaCopy.phVideoTitle
                      : slot.type === "diagram"
                      ? mediaCopy.phDiagramTitle
                      : slot.type === "certificate"
                      ? mediaCopy.phCertificateTitle
                      : mediaCopy.phScreenshotTitle}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-gray-300 max-w-md leading-relaxed">
                    {slot.caption || slot.label}
                  </p>
                </div>
                <div className="relative z-10 pt-3 border-t border-white/10 text-[11px] font-mono text-gray-400 flex justify-between">
                  <span>slot: {currentSlotId}</span>
                  <span className="text-emerald-400">Media slot ready for production asset</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-white font-mono text-sm">Slot {currentSlotId} not found</div>
        )}
      </div>

      {/* Bottom controls & caption */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <p className="font-sans text-xs sm:text-sm text-gray-300 text-center sm:text-left max-w-xl">
          {slot?.caption || slot?.label}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label={siteContent.ui.lightboxPrev}
            className="font-mono text-xs px-3 py-1.5 border border-white/20 hover:border-white/60 hover:bg-white/10 transition-colors rounded-[4px] cursor-pointer"
          >
            &larr; Prev
          </button>
          <button
            onClick={goNext}
            aria-label={siteContent.ui.lightboxNext}
            className="font-mono text-xs px-3 py-1.5 border border-white/20 hover:border-white/60 hover:bg-white/10 transition-colors rounded-[4px] cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}


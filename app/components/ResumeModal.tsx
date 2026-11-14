"use client";

import React, { useEffect, useState, useRef } from "react";
import { Download, ExternalLink, X, FileText } from "lucide-react";
import { useFocusTrap } from "@/lib/focus-trap";
import { mediaManifest } from "@/content/media";

export const RESUME_MODAL_EVENT = "kartik:resume-modal";

/**
 * Dispatch an open event for the Résumé Preview modal from anywhere in the app
 */
export function openResumeModal(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(RESUME_MODAL_EVENT, { detail: { open: true } }));
}

export function ResumeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  useFocusTrap(dialogRef, isOpen);

  // Listen for global resume modal open/close events
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      if (customEvent.detail?.open !== undefined) {
        setIsOpen(customEvent.detail.open);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener(RESUME_MODAL_EVENT, handleEvent);
    return () => window.removeEventListener(RESUME_MODAL_EVENT, handleEvent);
  }, []);

  // Restore focus on close
  useEffect(() => {
    if (isOpen) {
      prevActiveRef.current = document.activeElement as HTMLElement | null;
    } else {
      prevActiveRef.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const origHtml = document.documentElement.style.overflow;
    const origBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = origHtml;
      document.body.style.overflow = origBody;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const resumeSrc = mediaManifest["resume-pdf"]?.src || "/resume.pdf";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Résumé Document"
      ref={dialogRef}
      onWheel={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 transition-all duration-200 overscroll-contain animate-fade-in"
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[1000px] bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--rule)] bg-[var(--surface)] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <FileText size={15} strokeWidth={1.5} className="text-[var(--accent)]" />
              <h2 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">
                Kartik Koundal · Résumé
              </h2>
            </div>
            <span className="hidden md:inline-block font-mono text-[11px] text-[var(--ink-muted)] border-l border-[var(--rule)] pl-2">
              PDF Document (Verified)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Open in New Tab */}
            <a
              href={resumeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              title="Open raw PDF in new browser tab"
            >
              <ExternalLink size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            {/* Direct Download button */}
            <a
              href={resumeSrc}
              download="Kartik-Koundal-Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              title="Download Kartik-Koundal-Resume.pdf"
            >
              <Download size={13} strokeWidth={1.5} />
              <span>Download</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center p-1.5 rounded-[4px] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label="Close résumé modal"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 w-full bg-[var(--surface)] relative overflow-hidden flex flex-col">
          <iframe
            src={`${resumeSrc}#toolbar=0&navpanes=0`}
            title="Kartik Koundal Résumé Document"
            className="w-full h-full border-none"
          />

          {/* Accessible Fallback Bar for mobile or restrictive iframe viewports */}
          <div className="sm:hidden px-3 py-2 bg-[var(--paper)] border-t border-[var(--rule)] flex items-center justify-between font-mono text-[11px] text-[var(--ink-muted)]">
            <span>Can&apos;t view PDF above?</span>
            <a
              href={resumeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline font-medium"
            >
              Open in viewer →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

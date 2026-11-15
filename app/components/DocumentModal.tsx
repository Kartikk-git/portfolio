"use client";

import React, { useEffect, useRef } from "react";
import { Download, ExternalLink, X, FileText } from "lucide-react";
import { useFocusTrap } from "@/lib/focus-trap";

export interface DocumentPreviewItem {
  title: string;
  subtitle: string;
  src: string;
  type: "pdf" | "image";
  downloadName?: string;
}

interface DocumentModalProps {
  doc: DocumentPreviewItem | null;
  onClose: () => void;
}

export function DocumentModal({ doc, onClose }: DocumentModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

  useFocusTrap(dialogRef, Boolean(doc));

  // Focus restore
  useEffect(() => {
    if (doc) {
      prevActiveRef.current = document.activeElement as HTMLElement | null;
    } else {
      prevActiveRef.current?.focus();
    }
  }, [doc]);

  // Handle Escape key
  useEffect(() => {
    if (!doc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [doc, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!doc) return;
    const origHtml = document.documentElement.style.overflow;
    const origBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = origHtml;
      document.body.style.overflow = origBody;
    };
  }, [doc]);

  if (!doc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
      ref={dialogRef}
      onWheel={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-6 transition-all duration-200 overscroll-contain animate-fade-in"
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] max-h-[960px] bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--rule)] bg-[var(--surface)] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" aria-hidden="true" />
            <div className="truncate">
              <h3 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--ink)] truncate">
                {doc.title}
              </h3>
              <span className="font-mono text-[11px] text-[var(--ink-muted)] block">
                {doc.subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* New Tab */}
            <a
              href={doc.src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              title="Open raw document in new browser tab"
            >
              <ExternalLink size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            {/* Direct Download option */}
            <a
              href={doc.src}
              download={doc.downloadName || "document"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              title="Download original file"
            >
              <Download size={13} strokeWidth={1.5} />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Close [Esc] × */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-[var(--rule)] text-[var(--ink)] hover:bg-[var(--surface)] font-mono text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label="Close document modal"
            >
              <span>Close [Esc]</span>
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 w-full bg-[var(--surface-subtle)] relative overflow-auto flex items-center justify-center p-2 sm:p-4">
          {doc.type === "pdf" ? (
            <iframe
              src={`${doc.src}#toolbar=0`}
              title={doc.title}
              className="w-full h-full border-none rounded-[2px]"
            />
          ) : (
            <div className="max-h-full max-w-full flex items-center justify-center p-2">
              <img
                src={doc.src}
                alt={doc.title}
                className="max-h-[82vh] max-w-full object-contain rounded-[4px] shadow-sm border border-[var(--rule)]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

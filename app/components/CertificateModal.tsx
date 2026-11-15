"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { credentialsContent } from "@/content/credentials";
import { mediaManifest } from "@/content/media";
import { MediaSlot } from "./MediaSlot";
import { useFocusTrap } from "@/lib/focus-trap";

interface CertificateModalProps {
  certId: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/** Resolve the first media slot that actually has an asset for a credential. */
function certSlotId(certId: string): string | null {
  if (mediaManifest[certId]?.src) return certId;
  const cert = credentialsContent.certifications.find((c) => c.id === certId);
  const itemSlot = cert?.items?.map((it) => it.slot).find((s) => mediaManifest[s]?.src);
  return itemSlot ?? null;
}

export function CertificateModal({ certId, onClose, onPrev, onNext }: CertificateModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);
  const [selectedSlotOverride, setSelectedSlotOverride] = useState<string | null>(null);

  useFocusTrap(dialogRef, true);

  useEffect(() => {
    prevActiveRef.current = document.activeElement as HTMLElement | null;
    return () => {
      prevActiveRef.current?.focus();
    };
  }, []);

  const cert = credentialsContent.certifications.find((c) => c.id === certId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft" && onPrev) {
        e.preventDefault();
        onPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

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

  if (!cert) return null;

  const defaultSlot = certSlotId(cert.id);
  const activeSlot = selectedSlotOverride || defaultSlot;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
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
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 transition-all duration-200 overscroll-contain"
    >
      <div className="relative w-full max-w-4xl bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row max-h-[90vh] overscroll-contain">
        {/* Certificate Display Area */}
        <div className="flex-1 bg-[var(--surface)] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--rule)]">
          <div className="w-full max-w-lg">
            {activeSlot && <MediaSlot slotId={activeSlot} isClickable={false} />}
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between overflow-y-auto overscroll-contain">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--rule)] mb-4 gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold shrink-0">
                Credential Details
              </span>
              <button
                onClick={onClose}
                aria-label={credentialsContent.modal.close}
                className="font-mono text-xs px-2.5 py-1.5 bg-[var(--ink)] text-[var(--paper)] rounded-[4px] hover:opacity-90 cursor-pointer font-medium transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 shrink-0 shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Close [Esc]</span>
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            <h3 className="font-serif text-xl text-[var(--ink)] font-semibold mb-1">
              {cert.title}
            </h3>
            {cert.badge && (
              <span className="inline-block font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-[var(--rule)] text-[var(--accent)] rounded-[2px] mb-4">
                {cert.badge}
              </span>
            )}

            {/* Labels defined in cred.modal.labels */}
            <div className="space-y-3 font-mono text-xs mt-4 text-[var(--ink-muted)]">
              <div>
                <span className="block text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-0.5">Issuer</span>
                <span className="text-[var(--ink)] font-sans text-base">{cert.issuer}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-0.5">Issued</span>
                <span className="text-[var(--ink)] font-sans text-base">{cert.issued}</span>
              </div>
              {cert.score && (
                <div>
                  <span className="block text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-0.5">Score</span>
                  <span className="text-[var(--ink)] font-sans text-base font-semibold">{cert.score}</span>
                </div>
              )}
              {cert.verifyUrl ? (
                <div>
                  <span className="block text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-0.5">Verify</span>
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] underline hover:opacity-80 font-sans text-base inline-flex items-center gap-1"
                  >
                    {cert.verifyLabel} &rarr;
                  </a>
                </div>
              ) : null}
            </div>

            {/* Sub-items for CodeChef or GCloud with interactive selection */}
            {cert.items && (
              <div className="mt-4 pt-4 border-t border-[var(--rule)]">
                <span className="block font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-2">
                  Completed Tracks &amp; Badges
                </span>
                <div className="space-y-1 font-mono text-xs">
                  {cert.items.map((it, idx) => {
                    const hasAsset = Boolean(it.slot && mediaManifest[it.slot]?.src);
                    const isCurrent = activeSlot === it.slot;
                    return (
                      <div
                        key={idx}
                        onClick={() => hasAsset && it.slot && setSelectedSlotOverride(it.slot)}
                        className={`flex items-center justify-between p-1.5 rounded-[2px] transition-colors ${
                          hasAsset
                            ? "cursor-pointer hover:bg-[var(--surface)] text-[var(--ink)]"
                            : "text-[var(--ink-muted)] opacity-60"
                        } ${isCurrent ? "bg-[var(--accent-tint)] border border-[var(--accent-border)] font-semibold text-[var(--accent)]" : ""}`}
                      >
                        <span className="truncate">
                          {it.title} {it.score ? `(${it.score})` : ""}
                        </span>
                        {hasAsset && (
                          <span className="text-[10px] text-[var(--accent)] shrink-0 ml-1">
                            {isCurrent ? "Active" : "View"} &rarr;
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {cert.badges && (
              <div className="mt-4 pt-4 border-t border-[var(--rule)]">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] mb-2">
                  Featured Badges
                </span>
                <ul className="space-y-1 font-sans text-xs text-[var(--ink)] list-disc list-inside">
                  {cert.badges.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div className="pt-4 border-t border-[var(--rule)] flex items-center justify-between mt-6">
            <button
              onClick={onPrev}
              disabled={!onPrev}
              className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] rounded-[4px] hover:border-[var(--ink-muted)] disabled:opacity-30 cursor-pointer"
            >
              &larr; Prev
            </button>
            <button
              onClick={onNext}
              disabled={!onNext}
              className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] rounded-[4px] hover:border-[var(--ink-muted)] disabled:opacity-30 cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


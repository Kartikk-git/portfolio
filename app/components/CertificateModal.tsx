"use client";

import React, { useEffect, useRef } from "react";
import { credentialsContent } from "@/content/credentials";
import { MediaSlot } from "./MediaSlot";

interface CertificateModalProps {
  certId: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function CertificateModal({ certId, onClose, onPrev, onNext }: CertificateModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111315]/85 backdrop-blur-md p-4 sm:p-6 transition-all duration-200 overscroll-contain"
    >
      <div className="relative w-full max-w-4xl bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overscroll-contain">
        {/* Certificate Display Area */}
        <div className="flex-1 bg-[var(--surface)] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--rule)]">
          <div className="w-full max-w-lg">
            <MediaSlot slotId={cert.id} isClickable={false} className="shadow-md" />
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
                className="font-mono text-xs px-3 py-1.5 bg-[var(--ink)] text-[var(--paper)] rounded-[4px] hover:opacity-90 cursor-pointer font-medium transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 shrink-0 shadow-sm"
              >
                Close [Esc]
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
              ) : (
                <div>
                  <span className="block text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-0.5">Verify</span>
                  <span className="font-sans text-base italic opacity-75">Verification link pending confirmation</span>
                </div>
              )}
            </div>

            {/* Sub-items for CodeChef or GCloud */}
            {cert.items && (
              <div className="mt-4 pt-4 border-t border-[var(--rule)]">
                <span className="block font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-2">
                  Completed Tracks
                </span>
                <ul className="space-y-1 font-sans text-base text-[var(--ink)] list-disc list-inside">
                  {cert.items.map((it, idx) => (
                    <li key={idx}>
                      {it.title} {it.score ? `(${it.score})` : ""}
                    </li>
                  ))}
                </ul>
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


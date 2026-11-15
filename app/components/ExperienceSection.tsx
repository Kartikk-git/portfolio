"use client";

import React, { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Briefcase, Building2, Calendar, FileText, CheckCircle2, ExternalLink, X } from "lucide-react";
import { revealVariants } from "@/lib/motion";
import { useFocusTrap } from "@/lib/focus-trap";
import { Section } from "./Section";

export function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedProof, setSelectedProof] = useState<"cert" | "letter" | null>(null);
  const proofDialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 50%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Esc closes the proof viewer; focus returns to the page when it unmounts
  useEffect(() => {
    if (!selectedProof) return;
    const prev = document.activeElement as HTMLElement | null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedProof(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      prev?.focus();
    };
  }, [selectedProof]);

  useFocusTrap(proofDialogRef, Boolean(selectedProof));

  return (
    <Section
      id="experience"
      eyebrow="05 · Experience"
      heading="Work &amp; Internships"
      intro="Practical software development and engineering experience gained through industrial internships and team-based client builds."
      headerExtra="1 Industrial Internship"
    >
      <div className="relative pl-6 sm:pl-8 border-l border-[var(--rule)] space-y-12 max-w-[960px]" ref={timelineRef}>
        {/* Vertical accent line: scroll-linked draw, static full line under reduced motion */}
        <m.div
          style={
            prefersReducedMotion
              ? { transformOrigin: "top", scaleY: 1 }
              : { scaleY, transformOrigin: "top" }
          }
          className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[var(--accent)] z-10"
        />

        {/* Experience Entry: S O Infotech */}
        <m.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          custom={0}
          className="relative group border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] p-5 sm:p-6 space-y-5 hover:border-[var(--accent-soft)] transition-colors"
        >
          {/* Timeline Node */}
          <div
            className="absolute -left-[31px] sm:-left-[39px] top-6 w-[7px] h-[7px] bg-[var(--accent)] z-20"
            aria-hidden="true"
          />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--rule-subtle)] pb-4">
            <div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)]">
                  Industrial Trainee &middot; Java Android Kotlin
                </h3>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] px-2 py-0.5 border border-[var(--accent-border)] bg-[var(--accent-tint)] rounded-[2px] font-medium">
                  Completed &middot; 6 Weeks
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-[var(--ink-muted)]">
                <Building2 size={13} className="text-[var(--accent)] shrink-0" />
                <span className="font-medium text-[var(--ink)]">S O Infotech (P) Ltd. (Ducat)</span>
                <span>&middot;</span>
                <span>Ref: SO/PL26/D.V/0136</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--ink-muted)] shrink-0">
              <Calendar size={13} />
              <span>8 June 2026 &ndash; 20 July 2026</span>
            </div>
          </div>

          {/* Description */}
          <p className="font-sans text-sm sm:text-base leading-[1.65] text-[var(--ink-muted)]">
            Worked as an active team member developing the offline-first <strong className="text-[var(--ink)] font-semibold">Student Organizer</strong> Android application using Java, Kotlin, Jetpack Compose and Room SQLite under the technical direction of Technical Head Mr. Shyam Mishra. Implemented course management, assignment tracking, and on-device calendar attendance logging.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs text-[var(--ink-muted)]">
            <span className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--rule)] rounded-[2px]">Java</span>
            <span className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--rule)] rounded-[2px]">Kotlin</span>
            <span className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--rule)] rounded-[2px]">Android SDK</span>
            <span className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--rule)] rounded-[2px]">Jetpack Compose</span>
            <span className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--rule)] rounded-[2px]">Room SQLite</span>
          </div>

          {/* Proof Action Buttons */}
          <div className="pt-2 border-t border-[var(--rule-subtle)] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedProof("cert")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--surface)] hover:bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--accent)] font-mono text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <FileText size={14} className="text-[var(--accent)]" />
              <span>Completion Certificate</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedProof("letter")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--surface)] hover:bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--accent)] font-mono text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <FileText size={14} className="text-[var(--accent)]" />
              <span>Confirmation Letter</span>
            </button>

            <a
              href="/docs/kartik-project-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[var(--surface)] hover:bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--accent)] font-mono text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <ExternalLink size={14} className="text-[var(--accent)]" />
              <span>Project Report (46p PDF)</span>
            </a>
          </div>
        </m.div>
      </div>

      {/* Proof Modal Viewer */}
      {selectedProof && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fadeIn"
          onClick={() => setSelectedProof(null)}
        >
          <div
            ref={proofDialogRef}
            className="relative max-w-[860px] w-full h-[90vh] bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--rule)] bg-[var(--surface)]">
              <div className="font-mono text-xs font-semibold text-[var(--ink)]">
                {selectedProof === "cert"
                  ? "S O Infotech · Project Completion Certificate (SO/PL26/D.V/0136)"
                  : "S O Infotech · Industrial Training Confirmation (SO/CL26/D.V/0136)"}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={
                    selectedProof === "cert"
                      ? "/docs/kartik-so-internship-letter.pdf"
                      : "/docs/kartik-confirmation-letter.pdf"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)] hover:underline"
                >
                  <span>Open PDF</span>
                  <ExternalLink size={12} />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProof(null)}
                  className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] px-2.5 py-1 border border-[var(--rule)] rounded-[2px] cursor-pointer inline-flex items-center gap-1.5"
                  aria-label="Close document preview"
                >
                  <span>Close (Esc)</span>
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Modal Document Viewer: Embedded Native PDF Object & Fallback Iframe */}
            <div className="flex-1 w-full h-full bg-[var(--surface-subtle)] relative">
              <iframe
                src={
                  selectedProof === "cert"
                    ? "/docs/kartik-so-internship-letter.pdf#toolbar=0"
                    : "/docs/kartik-confirmation-letter.pdf#toolbar=0"
                }
                title={selectedProof === "cert" ? "Completion Certificate" : "Confirmation Letter"}
                className="w-full h-full border-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2 border-t border-[var(--rule)] bg-[var(--surface)] font-mono text-[11px] text-[var(--ink-muted)] flex justify-between items-center">
              <span>Verified Industrial Trainee Document &middot; S O Infotech (P) Ltd.</span>
              <span className="text-[var(--accent)] font-medium">Original Document</span>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}


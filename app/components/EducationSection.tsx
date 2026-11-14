"use client";

import React, { useRef, useState } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ExternalLink, Award, GraduationCap } from "lucide-react";
import { credentialsContent } from "@/content/credentials";
import { hasRealMedia } from "@/content/media";
import { revealVariants } from "@/lib/motion";
import { CertificateModal } from "./CertificateModal";
import { DocumentModal, DocumentPreviewItem } from "./DocumentModal";
import { Section } from "./Section";

interface EducationSectionProps {
  isReviewMode?: boolean;
}

// The canonical content keeps internal "⚠" verify flags; they never render.
const stripVerifyFlags = (s: string) => s.replace(/\s*⚠/g, "");

export function EducationSection({ isReviewMode = false }: EducationSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [modalCertId, setModalCertId] = useState<string | null>(null);
  const [docModalItem, setDocModalItem] = useState<DocumentPreviewItem | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Vertical timeline line draws as user scrolls through the section
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 50%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const certList = credentialsContent.certifications;
  const currentCertIdx = certList.findIndex((c) => c.id === modalCertId);

  // A credential can only be previewed when a real certificate asset exists
  const certPreviewSlot = (certId: string): string | null => {
    if (hasRealMedia(certId)) return certId;
    const cert = certList.find((c) => c.id === certId);
    const itemSlot = cert?.items?.map((it) => it.slot).find((s) => hasRealMedia(s));
    return itemSlot ?? null;
  };

  return (
    <Section
      id="education"
      eyebrow={credentialsContent.eyebrow}
      heading={credentialsContent.heading}
      intro={credentialsContent.intro}
      headerExtra="Formal &amp; Verified"
    >
      {/* Left-Ruled Architectural Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-[var(--rule)] space-y-14 max-w-[960px]" ref={timelineRef}>
        {/* Vertical accent line: scroll-linked draw, static full line under reduced motion */}
        <m.div
          style={
            prefersReducedMotion
              ? { transformOrigin: "top", scaleY: 1 }
              : { scaleY, transformOrigin: "top" }
          }
          className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[var(--accent)] z-10"
        />

        {/* Group 1: Formal Education (Elevated & Prominent) */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} strokeWidth={1.5} className="text-[var(--accent)]" />
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
              {credentialsContent.groupFormal}
            </h3>
          </div>

          <div className="space-y-6">
            {/* Primary Degree Card: B.Tech CSE */}
            <m.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              custom={0}
              className="relative group border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] p-5 sm:p-6 space-y-4 hover:border-[var(--accent-soft)] transition-colors"
            >
              {/* Timeline Node */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-6 w-[7px] h-[7px] rounded-none z-20 bg-[var(--accent)]"
                aria-hidden="true"
              />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--rule-subtle)] pb-3">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)]">
                    {credentialsContent.education[0].title}
                  </h4>
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-soft)] px-2 py-0.5 border border-[var(--accent-border)] bg-[var(--accent-tint)] rounded-[2px] font-medium">
                    2024 &ndash; 2028 &middot; In Progress
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded-[2px] bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-border)]">
                    CGPA: 7.55 / 10
                  </div>
                  {isReviewMode && credentialsContent.education[0].confirm && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                      confirm CGPA
                    </span>
                  )}
                </div>
              </div>

              <div className="font-mono text-xs text-[var(--ink-muted)]">
                Dronacharya College of Engineering, Gurugram
              </div>

              <p className="font-sans text-sm text-[var(--ink-muted)] leading-relaxed max-w-[72ch]">
                {credentialsContent.education[0].body}
              </p>

              {/* Core Coursework & Focus Areas */}
              <div className="pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-2 font-medium">
                  Core Academic Focus &amp; Coursework
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {(credentialsContent.education[0].coursework ?? []).map((course) => (
                    <span
                      key={course}
                      className="px-2.5 py-1 border border-[var(--rule-subtle)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] hover:bg-[var(--accent-tint)] transition-colors rounded-[2px]"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Semester Scorecards Verification Links */}
              <div className="pt-3 border-t border-[var(--rule-subtle)]/70">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-2 font-medium">
                  Semester Scorecards (Verified Marks)
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { sem: "Sem 1", file: "/docs/sem1.pdf", desc: "Semester 1 Result" },
                    { sem: "Sem 2", file: "/docs/sem2.pdf", desc: "Semester 2 Result" },
                    { sem: "Sem 3", file: "/docs/sem3.pdf", desc: "Semester 3 Result" },
                    { sem: "Sem 4", file: "/docs/sem4.pdf", desc: "Semester 4 Result" },
                  ].map((s) => (
                    <button
                      key={s.sem}
                      type="button"
                      onClick={() =>
                        setDocModalItem({
                          title: `B.Tech CSE · ${s.sem} Scorecard`,
                          subtitle: "Dronacharya College of Engineering, Gurugram",
                          src: s.file,
                          type: "pdf",
                          downloadName: `Kartik-Koundal-${s.sem}.pdf`,
                        })
                      }
                      className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--accent)] text-[var(--accent)] rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                      title={s.desc}
                    >
                      <span>{s.sem} &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            </m.div>

            {/* Schooling Cards (Class XII & Class X in 2-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Senior Secondary (Class XII) */}
              <m.div
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                custom={1}
                className="relative group border border-[var(--rule-subtle)] rounded-[4px] bg-[var(--surface-subtle)]/60 p-5 space-y-2.5 hover:border-[var(--accent-soft)]/50 transition-colors"
              >
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-6 w-[5px] h-[5px] rounded-none z-20 bg-[var(--rule)] group-hover:bg-[var(--accent)] transition-colors"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-2 border-b border-[var(--rule-subtle)] pb-2">
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-[var(--ink)]">
                    {credentialsContent.education[1].title}
                  </h4>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[2px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule-subtle)]">
                    77.4%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="font-mono text-xs text-[var(--accent-soft)] font-medium">
                    St. Martin&apos;s Diocesan School &middot; 2024
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDocModalItem({
                        title: "Senior Secondary (Class XII) · Marksheet",
                        subtitle: "St. Martin's Diocesan School · CBSE 2024 (77.4%)",
                        src: "/docs/12th.jpeg",
                        type: "image",
                        downloadName: "Kartik-Koundal-12th-Marksheet.jpeg",
                      })
                    }
                    className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    title="Class XII marksheet"
                  >
                    <span>View &rarr;</span>
                  </button>
                </div>
              </m.div>

              {/* Secondary (Class X) */}
              <m.div
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                custom={2}
                className="relative group border border-[var(--rule-subtle)] rounded-[4px] bg-[var(--surface-subtle)]/60 p-5 space-y-2.5 hover:border-[var(--accent-soft)]/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[var(--rule-subtle)] pb-2">
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-[var(--ink)]">
                    {credentialsContent.education[2].title}
                  </h4>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[2px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule-subtle)]">
                    77.2%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="font-mono text-xs text-[var(--accent-soft)] font-medium">
                    St. Martin&apos;s Diocesan School &middot; 2022
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDocModalItem({
                        title: "Secondary (Class X) · Marksheet",
                        subtitle: "St. Martin's Diocesan School · CBSE 2022 (77.2%)",
                        src: "/docs/10th.jpeg",
                        type: "image",
                        downloadName: "Kartik-Koundal-10th-Marksheet.jpeg",
                      })
                    }
                    className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    title="Class X marksheet"
                  >
                    <span>View &rarr;</span>
                  </button>
                </div>
              </m.div>
            </div>
          </div>
        </div>

        {/* Group 2: Verified Credentials & Certifications */}
        <div className="space-y-6 pt-6 border-t border-[var(--rule)]/40">
          <div className="flex items-center gap-2">
            <Award size={16} strokeWidth={1.5} className="text-[var(--accent-soft)]" />
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent-soft)] font-semibold">
              {credentialsContent.groupCert}
            </h3>
          </div>

          <div className="space-y-5">
            {certList.map((cert, index) => (
              <m.div
                key={cert.id}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                custom={index + 3}
                className="relative group border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] p-5 sm:p-6 space-y-3.5 hover:border-[var(--accent-soft)] transition-colors"
              >
                {/* Node: 5px square on the vertical rule line */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-6 w-[5px] h-[5px] rounded-none z-20 bg-[var(--accent-soft)]"
                  aria-hidden="true"
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--rule-subtle)] pb-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <h4 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)]">
                      {stripVerifyFlags(cert.title)}
                    </h4>
                    {cert.badge && (
                      <span className="font-mono text-xs uppercase tracking-wider text-[var(--accent-soft)] px-2 py-0.5 border border-[var(--accent-border)] bg-[var(--accent-tint)] rounded-[2px] font-medium">
                        {cert.badge}
                      </span>
                    )}
                    {isReviewMode && cert.confirm && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                        confirm
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cert.score && (
                      <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded-[2px] bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-border)]">
                        Score: {cert.score}
                      </div>
                    )}
                    <div className="font-mono text-xs text-[var(--ink-muted)] shrink-0">
                      {stripVerifyFlags(cert.meta)}
                    </div>
                  </div>
                </div>

                <p className="font-sans text-sm text-[var(--ink-muted)] leading-relaxed max-w-[72ch]">
                  {cert.body}
                </p>

                {/* Items/Badges tags if present */}
                {cert.badges && cert.badges.length > 0 && (
                  <div className="pt-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-1.5 font-medium">
                      Featured Badges
                    </span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {cert.badges.map((b) => (
                        <span
                          key={b}
                          className="px-2.5 py-1 border border-[var(--rule-subtle)] bg-[var(--paper)] text-[var(--ink-muted)] rounded-[2px]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions: View certificate + Verify link */}
                <div className="flex items-center gap-4 pt-2 border-t border-[var(--rule-subtle)]/60">
                  {certPreviewSlot(cert.id) && (
                    <button
                      onClick={() => setModalCertId(cert.id)}
                      className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                    >
                      View certificate &rarr;
                    </button>
                  )}

                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{cert.verifyLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    isReviewMode && (
                      <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                        Verify: link unconfirmed
                      </span>
                    )
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {modalCertId && (
        <CertificateModal
          certId={modalCertId}
          onClose={() => setModalCertId(null)}
          onPrev={
            currentCertIdx > 0
              ? () => setModalCertId(certList[currentCertIdx - 1].id)
              : undefined
          }
          onNext={
            currentCertIdx < certList.length - 1
              ? () => setModalCertId(certList[currentCertIdx + 1].id)
              : undefined
          }
        />
      )}

      {/* Document Preview Modal for Scorecards and Marksheets */}
      {docModalItem && (
        <DocumentModal
          doc={docModalItem}
          onClose={() => setDocModalItem(null)}
        />
      )}
    </Section>
  );
}

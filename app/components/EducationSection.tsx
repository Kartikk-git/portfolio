"use client";

import React, { useRef, useState } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { ExternalLink, Award, GraduationCap } from "lucide-react";
import { credentialsContent } from "@/content/credentials";
import { revealVariants } from "@/lib/motion";
import { CertificateModal } from "./CertificateModal";
import { Section } from "./Section";

interface EducationSectionProps {
  isReviewMode?: boolean;
}

export function EducationSection({ isReviewMode = false }: EducationSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [modalCertId, setModalCertId] = useState<string | null>(null);

  // Vertical timeline line draws as user scrolls through the section
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 50%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const certList = credentialsContent.certifications;
  const currentCertIdx = certList.findIndex((c) => c.id === modalCertId);

  return (
    <Section
      id="education"
      eyebrow={credentialsContent.eyebrow}
      heading={credentialsContent.heading}
      intro={credentialsContent.intro}
      headerExtra="Formal &amp; Verified"
    >
      {/* Left-Ruled Architectural Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-[var(--rule)] space-y-12 max-w-[960px]" ref={timelineRef}>
        {/* Scroll-linked vertical accent line */}
        <m.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[var(--accent)] z-10"
        />

        {/* Group 1: Certifications & Verified Credentials */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Award size={16} strokeWidth={1.5} className="text-[var(--accent)]" />
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
              {credentialsContent.groupCert}
            </h3>
          </div>

          <div className="space-y-8">
            {certList.map((cert, index) => (
              <m.div
                key={cert.id}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                custom={index}
                className="relative group space-y-2"
              >
                {/* Node: 5px square on the vertical rule line */}
                <div
                  className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-[5px] h-[5px] rounded-none z-20 bg-[var(--accent)]"
                  aria-hidden="true"
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="font-serif text-lg font-semibold text-[var(--ink)]">
                      {cert.title}
                    </h4>
                    {cert.badge && (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] px-2 py-0.5 border border-[var(--accent)]/40 rounded-[2px] font-medium bg-[var(--surface)]">
                        {cert.badge}
                      </span>
                    )}
                    {isReviewMode && cert.confirm && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                        confirm
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-xs text-[var(--ink-muted)] shrink-0">
                    {cert.meta}
                  </div>
                </div>

                <p className="font-sans text-sm text-[var(--ink-muted)] leading-relaxed max-w-[72ch]">
                  {cert.body}
                </p>

                {/* Actions: Preview certificate + Verify link */}
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => setModalCertId(cert.id)}
                    className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    Preview certificate &rarr;
                  </button>

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

        {/* Group 2: Formal Education */}
        <div className="space-y-8 pt-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} strokeWidth={1.5} className="text-[var(--accent)]" />
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
              {credentialsContent.groupFormal}
            </h3>
          </div>

          <div className="space-y-8">
            {credentialsContent.education.map((edu, index) => (
              <m.div
                key={edu.id}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                custom={index + certList.length}
                className="relative group space-y-1.5"
              >
                {/* Node */}
                <div
                  className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-[5px] h-[5px] rounded-none z-20 bg-[var(--rule)] group-hover:bg-[var(--ink)] transition-colors"
                  aria-hidden="true"
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-serif text-lg font-semibold text-[var(--ink)]">
                      {edu.title}
                    </h4>
                    {isReviewMode && edu.confirm && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                        confirm CGPA
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-[var(--ink-muted)] shrink-0">
                    {edu.meta}
                  </span>
                </div>

                {edu.body && (
                  <p className="font-sans text-sm text-[var(--ink-muted)] leading-relaxed max-w-[72ch]">
                    {edu.body}
                  </p>
                )}
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
    </Section>
  );
}

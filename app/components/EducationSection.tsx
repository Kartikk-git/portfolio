"use client";

import { useRef } from "react";
import { m, useInView, useScroll, useTransform } from "motion/react";
import { ExternalLink, Award, GraduationCap } from "lucide-react";
import { education } from "@/content/education";
import { certifications } from "@/content/certifications";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

export function EducationSection() {
  const containerRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  // Vertical timeline line draws as user scrolls through the section
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 50%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="education"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              04 / Academic &amp; Credentials
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              Verified Proof
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Education &amp; Certifications
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch]">
            Formal academic background and verified technical certifications from NPTEL IIT Kharagpur, CodeChef, and Google Cloud.
          </p>

          {/* Section Divider Line */}
          <div className="pt-6">
            <m.div
              variants={ruleDrawVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-[1px] w-full bg-[var(--rule)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative" ref={timelineRef}>
          {/* 1. Certifications & Credentials Column (NPTEL Java Elite Lead) */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
              <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink)] font-semibold">
                Certifications &amp; Credentials
              </h3>
            </div>

            <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
              {certifications.map((cert, index) => (
                <m.div
                  key={cert.title}
                  variants={revealVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={index}
                  className="py-6 space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-serif text-lg font-semibold text-[var(--ink)]">
                      {cert.title}
                    </h4>
                    <span className="font-mono text-xs text-[var(--ink-muted)] shrink-0">
                      {cert.periodOrDate}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-[var(--ink-muted)]">
                    {cert.issuer}
                  </div>

                  {cert.highlight && (
                    <div className="pt-1 font-mono text-xs font-semibold text-[var(--accent)]">
                      {cert.highlight}
                    </div>
                  )}

                  {cert.note && (
                    <p className="pt-1 font-sans text-xs text-[var(--ink-muted)] leading-[1.6]">
                      {cert.note}
                    </p>
                  )}

                  {cert.link && (
                    <div className="pt-2">
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                      >
                        <span>View credential on Credly</span>
                        <ExternalLink size={12} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </m.div>
              ))}
            </div>
          </div>

          {/* 2. Education Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
              <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink)] font-semibold">
                Formal Education
              </h3>
            </div>

            <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
              {education.map((edu, index) => (
                <m.div
                  key={edu.degree}
                  variants={revealVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  custom={index + 3}
                  className="py-6 space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-serif text-lg font-semibold text-[var(--ink)]">
                      {edu.degree}
                    </h4>
                    <span className="font-mono text-xs text-[var(--ink-muted)] shrink-0">
                      {edu.period}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-[var(--ink-muted)]">
                    {edu.institution}
                  </div>

                  <div className="pt-1 font-mono text-xs font-medium text-[var(--ink)]">
                    Score: <span className="text-[var(--accent)] font-semibold">{edu.grade}</span>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


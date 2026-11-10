"use client";

import React, { useRef } from "react";
import { m, useInView } from "motion/react";
import { aboutContent } from "@/content/about";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

interface AboutSectionProps {
  isReviewMode?: boolean;
}

export function AboutSection({ isReviewMode = false }: AboutSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const facts = [
    { label: "Studying", value: "B.Tech Computer Science and Engineering, 2024 to 2028" },
    { label: "College", value: "Dronacharya College of Engineering, Gurugram" },
    { label: "Based in", value: "New Delhi, India" },
    { label: "Main focus", value: "Native Android with Kotlin and Jetpack Compose" },
    { label: "Also build", value: "Web apps with Python, Flask and JavaScript" },
    { label: "Looking for", value: "Software and Android internships" },
  ];

  const strengths = [
    { label: "Problem solving", desc: "breaking a problem into data and steps before writing code" },
    { label: "Fundamentals", desc: "data structures and algorithms, OOP, databases and SQL" },
    { label: "Quick learner", desc: "picked up Kotlin, Compose and Room while building Student Organizer" },
    { label: "Adaptable", desc: "comfortable across Android, Python backends and the web" },
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-mono text-xs uppercase tracking-[0.06em]">
              <span className="text-[var(--accent)] font-semibold">{aboutContent.eyebrow}</span>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              Dronacharya College of Engineering · 2028
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink)]">
            {aboutContent.heading}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {aboutContent.subline}
          </p>

          {/* Section Divider Line with Classic Editorial Accent Rule */}
          <div className="pt-6 relative">
            <m.div
              variants={ruleDrawVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-[1px] w-full bg-[var(--rule)]"
            />
            <div className="absolute left-0 bottom-0 h-[2px] w-12 bg-[var(--accent)] z-10" />
          </div>
        </div>

        {/* Lead Statement (Restrained serif) */}
        <m.div
          variants={revealVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="mb-8"
        >
          <p className="font-serif text-xl sm:text-2xl text-[var(--ink)] font-normal leading-[1.4] max-w-[58ch]">
            {aboutContent.lead}
          </p>
        </m.div>

        {/* Body Paragraphs (Quiet, consistent 17px body) */}
        <div className="max-w-[62ch] space-y-5 font-sans text-base leading-[1.65] text-[var(--ink-muted)] mb-14">
          <m.p
            variants={revealVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={1}
            className={isReviewMode ? "p-2 border border-amber-500/30 rounded" : ""}
          >
            {aboutContent.body1}
            {isReviewMode && <span className="ml-2 font-mono text-[10px] text-amber-500">⚠ confirm</span>}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={2}
            className={isReviewMode ? "p-2 border border-amber-500/30 rounded" : ""}
          >
            {aboutContent.body2}
            {isReviewMode && <span className="ml-2 font-mono text-[10px] text-amber-500">⚠ confirm</span>}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={3}
          >
            {aboutContent.body3}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={4}
          >
            {aboutContent.body4}
          </m.p>
        </div>

        {/* Two-Column Facts and Strengths */}
        <m.div
          variants={revealVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={5}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[var(--rule)]"
        >
          {/* Facts (At a glance) */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
              {aboutContent.factsLabel}
            </h3>
            <div className="space-y-2.5 font-sans text-sm">
              {facts.map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1 border-b border-[var(--rule)]/30">
                  <span className="font-mono text-xs text-[var(--ink-muted)] w-28 shrink-0">
                    {f.label}:
                  </span>
                  <span className="text-[var(--ink)]">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths (How I work) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {aboutContent.strengthsLabel}
              </h3>
              {isReviewMode && <span className="font-mono text-[10px] text-amber-500">⚠ confirm</span>}
            </div>
            <div className="space-y-2.5 font-sans text-sm">
              {strengths.map((s, i) => (
                <div key={i} className="py-1 border-b border-[var(--rule)]/30">
                  <span className="font-mono text-xs text-[var(--ink)] font-medium">
                    {s.label}:{" "}
                  </span>
                  <span className="text-[var(--ink-muted)]">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

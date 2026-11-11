"use client";

import React from "react";
import { m } from "motion/react";
import { aboutContent } from "@/content/about";
import { revealVariants } from "@/lib/motion";
import { Section } from "./Section";

interface AboutSectionProps {
  isReviewMode?: boolean;
}

export function AboutSection({ isReviewMode = false }: AboutSectionProps) {
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
    <Section
      id="about"
      eyebrow={aboutContent.eyebrow}
      heading={aboutContent.heading}
      intro={aboutContent.subline}
      headerExtra="Dronacharya College of Engineering · 2028"
    >
      {/* 2-Column Balanced Editorial Grid - Spanning constant 1120px width matching Projects and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Narrative Bio (7 cols) */}
        <div className="lg:col-span-7 space-y-5 font-sans text-base leading-[1.65]">
          <m.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={0}
            className="text-[var(--ink)] font-normal"
          >
            {aboutContent.lead}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={1}
            className={`text-[var(--ink-muted)] ${isReviewMode ? "p-2 border border-amber-500/30 rounded" : ""}`}
          >
            {aboutContent.body1}
            {isReviewMode && <span className="ml-2 font-mono text-[10px] text-amber-500">⚠ confirm</span>}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={2}
            className={`text-[var(--ink-muted)] ${isReviewMode ? "p-2 border border-amber-500/30 rounded" : ""}`}
          >
            {aboutContent.body2}
            {isReviewMode && <span className="ml-2 font-mono text-[10px] text-amber-500">⚠ confirm</span>}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={3}
            className="text-[var(--ink-muted)]"
          >
            {aboutContent.body3}
          </m.p>

          <m.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={4}
            className="text-[var(--ink-muted)]"
          >
            {aboutContent.body4}
          </m.p>
        </div>

        {/* Right Column: Structured Overview Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Facts (At a glance) */}
          <m.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={5}
            className="p-5 sm:p-6 border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] space-y-3.5"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent-soft)] font-semibold border-b border-[var(--rule-subtle)] pb-2">
              {aboutContent.factsLabel}
            </h3>
            <div className="space-y-2 font-sans text-sm leading-normal">
              {facts.map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1 border-b border-[var(--rule-subtle)]/60 last:border-0">
                  <span className="font-mono text-xs text-[var(--ink-muted)] w-24 shrink-0">
                    {f.label}:
                  </span>
                  <span className="text-[var(--ink)] text-sm">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </m.div>

          {/* Strengths (How I work) */}
          <m.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={6}
            className="p-5 sm:p-6 border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-[var(--rule-subtle)] pb-2">
              <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent-soft)] font-semibold">
                {aboutContent.strengthsLabel}
              </h3>
              {isReviewMode && <span className="font-mono text-[10px] text-amber-500">⚠ confirm</span>}
            </div>
            <div className="space-y-2 font-sans text-sm leading-relaxed">
              {strengths.map((s, i) => (
                <div key={i} className="py-1 border-b border-[var(--rule-subtle)]/60 last:border-0">
                  <span className="font-mono text-xs text-[var(--accent-soft)] font-medium">
                    {s.label}:{" "}
                  </span>
                  <span className="text-[var(--ink-muted)] text-sm">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </Section>
  );
}

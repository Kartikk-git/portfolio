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
      {/* 2-Column Balanced Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Personalized Narrative Story (7 cols) */}
        <div className="lg:col-span-7 space-y-6 font-sans">
          {/* Lead statement */}
          <m.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={0}
            className="space-y-3.5 border-b border-[var(--rule-subtle)] pb-5"
          >
            <p className="font-serif text-base sm:text-lg text-[var(--ink)] leading-relaxed font-normal">
              {aboutContent.lead}
            </p>
            <p className="text-[14.5px] sm:text-[15.5px] text-[var(--ink-muted)] leading-[1.65]">
              {aboutContent.intro2}
            </p>
          </m.div>

          {/* Structured Story Chapters */}
          <div className="space-y-6 pt-1">
            {aboutContent.story.map((chapter, idx) => (
              <m.div
                key={chapter.step}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
                custom={idx + 1}
                className="space-y-2 border-l-2 border-[var(--rule-subtle)] hover:border-[var(--accent)] pl-4 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent)] font-semibold">
                    {chapter.step} &middot; {chapter.title}
                  </span>
                </div>
                <p className="text-[15px] sm:text-base text-[var(--ink-muted)] leading-[1.7]">
                  {chapter.text}
                </p>
              </m.div>
            ))}
          </div>

          {/* Closing Reflection */}
          {aboutContent.closing && (
            <m.div
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              custom={6}
              className="pt-4 border-t border-[var(--rule-subtle)] font-serif italic text-[15px] sm:text-base text-[var(--ink)] leading-relaxed"
            >
              <p>&ldquo;{aboutContent.closing}&rdquo;</p>
            </m.div>
          )}
        </div>

        {/* Right Column: Structured Overview Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Portrait Photo Card */}
          <m.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={4.5}
            className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] p-4 overflow-hidden flex flex-col items-center gap-3"
          >
            <div className="w-full aspect-[4/5] rounded-[2px] overflow-hidden border border-[var(--rule)] bg-[var(--surface)]">
              <img
                src="/kartik-about.webp"
                alt="Kartik Koundal"
                width={720}
                height={960}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="w-full flex items-center justify-between font-mono text-[11px] text-[var(--ink-muted)] pt-1 px-1">
              <span>Kartik Koundal</span>
              <span>New Delhi, India</span>
            </div>
          </m.div>

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
            <div className="space-y-2 font-sans text-xs sm:text-[13px] leading-relaxed">
              {facts.map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1.5 border-b border-[var(--rule-subtle)]/60 last:border-0">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] w-24 shrink-0">
                    {f.label}:
                  </span>
                  <span className="text-[var(--ink)] text-xs sm:text-[13px] leading-snug">
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
            <div className="space-y-2 font-sans text-xs sm:text-[13px] leading-relaxed">
              {strengths.map((s, i) => (
                <div key={i} className="py-1.5 border-b border-[var(--rule-subtle)]/60 last:border-0">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-soft)] font-medium">
                    {s.label}:{" "}
                  </span>
                  <span className="text-[var(--ink-muted)] text-xs sm:text-[13px] leading-snug">
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

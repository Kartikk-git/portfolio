"use client";

import React, { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, Download, Mail, GraduationCap } from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { siteContent } from "@/content/site";
import { contactContent } from "@/content/contact";
import { mediaManifest } from "@/content/media";
import { openResumeModal } from "./ResumeModal";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll tracking: As #projects reaches 50% of the viewport, hero gracefully fades out.
  // Because #projects is already 100% opaque by 75% scroll, this ensures zero blank gap.
  const { scrollYProgress: heroExitProgress } = useScroll({
    target: heroRef,
    offset: ["end 70%", "end 50%"],
  });
  const heroOpacity = useTransform(heroExitProgress, [0, 1], [1, 0]);
  const heroY = useTransform(heroExitProgress, [0, 1], [0, -24]);

  const resumeSlot = mediaManifest["resume-pdf"];
  const isResumeAvailable = Boolean(resumeSlot?.src);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 md:py-16 border-b border-[var(--rule)] overflow-hidden"
    >
      <m.div
        style={prefersReducedMotion ? undefined : { opacity: heroOpacity, y: heroY }}
        className="max-w-[1120px] mx-auto px-4 sm:px-8 w-full"
      >
        {/* Balanced 12-Column Grid: Left Narrative (7 cols) + Right Photo & Candidate Snapshot (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-8 lg:mb-10">
          {/* Left Column: Eyebrow, Name, Headline, Bio Narrative, & Action CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow: Status Line */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold px-2.5 py-1 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 animate-pulse"
                  aria-hidden="true"
                />
                <span>{siteContent.hero.eyebrow}</span>
              </div>
            </div>

            {/* Primary Identity Header: Big Kartik Koundal & Headline */}
            <div className="mb-4">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--ink)] leading-[1.12]">
                <span className="block">{siteContent.hero.name}</span>
                <span className="block font-normal text-lg sm:text-xl md:text-2xl text-[var(--ink-muted)] mt-2 leading-snug">
                  {siteContent.hero.headline}
                </span>
              </h1>
            </div>

            {/* 1px Accent Rule Draw */}
            <div className="py-1">
              <div className="h-[1px] w-16 bg-[var(--accent)]" />
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-4 font-sans text-[15px] sm:text-base text-[var(--ink)] leading-[1.65] my-5 sm:my-6 max-w-[58ch]">
              {siteContent.hero.intro.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* 3-Tier CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary CTA: View selected work */}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                <span>{siteContent.hero.ctaPrimary}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>

              {/* Secondary CTA: Download résumé */}
              {isResumeAvailable ? (
                <button
                  type="button"
                  onClick={openResumeModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--accent)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                  title="View and download résumé"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{siteContent.hero.ctaSecondary}</span>
                </button>
              ) : (
                <div className="relative group">
                  <button
                    type="button"
                    aria-disabled="true"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border border-[var(--rule)] bg-[var(--surface)]/50 text-[var(--ink-muted)] text-xs font-mono font-medium opacity-60 cursor-not-allowed"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{siteContent.hero.ctaSecondary}</span>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[var(--ink)] text-[var(--paper)] px-2.5 py-1 rounded-[4px] font-mono text-[10px] whitespace-nowrap shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--paper)]/10 z-20">
                    {contactContent.resumePending}
                  </div>
                </div>
              )}

              {/* Tertiary CTA: Get in touch */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] text-[var(--ink-muted)] hover:text-[var(--ink)] text-xs font-mono font-medium hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                <span>{siteContent.hero.ctaTertiary}</span>
                &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Prominent Circular Photo (No borders) & Technical Snapshot Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-stretch gap-6 pt-2 lg:pt-0">
            {/* Prominent Circular Portrait: strictly NO borders + subtle green wave/flame aura behind */}
            <div className="relative flex flex-col items-center justify-center p-2">
              {/* Subtle Organic Green Wave / Flame Aura behind the picture */}
              <div
                className="absolute inset-0 pointer-events-none select-none z-0 flex items-center justify-center"
                aria-hidden="true"
              >
                {/* Layer 1: Soft breathing ambient aura glow */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 rounded-full bg-[var(--accent)]/25 dark:bg-[var(--accent)]/35 green-aura-pulse" />

                {/* Layer 2: Organic morphing fluid wave 1 */}
                <div className="absolute w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 bg-gradient-to-tr from-[var(--accent)]/30 via-emerald-400/20 to-[var(--accent-hover)]/30 blur-md green-aura-wave-1 opacity-75 dark:opacity-90" />

                {/* Layer 3: Organic counter-rotating fluid flame wave 2 */}
                <div className="absolute w-38 h-38 sm:w-46 sm:h-46 lg:w-50 lg:h-50 bg-gradient-to-bl from-[var(--accent-hover)]/25 via-teal-400/15 to-[var(--accent)]/20 blur-sm green-aura-wave-2 opacity-65 dark:opacity-85" />
              </div>

              {/* The Circular Portrait */}
              <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden border-0 ring-0 shadow-2xl bg-[var(--surface)] select-none">
                <img
                  src="/kartik-portrait-hero.webp"
                  alt="Kartik Koundal"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover object-center rounded-full"
                  priority-load="true"
                />
              </div>
            </div>

            {/* Editorial Quick Specs / Recruiter Candidate Snapshot Card */}
            <div className="w-full border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] p-4 sm:p-5 space-y-3.5 hover:border-[var(--accent-soft)] transition-colors">
              <div className="flex items-center justify-between border-b border-[var(--rule-subtle)] pb-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--accent)] font-semibold">
                  Candidate Snapshot
                </span>
                <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider">
                  Verified Specs
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {/* Degree Row */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[var(--ink-muted)] shrink-0 flex items-center gap-1.5">
                    <GraduationCap size={13} strokeWidth={1.5} className="text-[var(--accent)]" />
                    Degree:
                  </span>
                  <span className="text-[var(--ink)] text-right font-medium">
                    B.Tech CSE &middot; 2024&ndash;2028
                  </span>
                </div>

                {/* College Row */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[var(--ink-muted)] shrink-0">Institution:</span>
                  <span className="text-[var(--ink)] text-right">
                    Dronacharya College of Engg.
                  </span>
                </div>

                {/* Academic Score */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--ink-muted)] shrink-0">Academic Score:</span>
                  <span className="font-semibold px-2 py-0.5 rounded-[2px] bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-border)]">
                    CGPA: 7.55 / 10
                  </span>
                </div>

                {/* Focus Tech Stack */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--rule-subtle)]/70">
                  <span className="text-[var(--accent)] font-semibold uppercase tracking-[0.06em]">
                    {siteContent.hero.focusLabel}:
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--ink)]">
                    {siteContent.hero.focusItems.map((item, idx) => (
                      <React.Fragment key={item}>
                        <span>{item}</span>
                        {idx < siteContent.hero.focusItems.length - 1 && (
                          <span className="text-[var(--rule)] select-none" aria-hidden="true">
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Currently Building */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[var(--accent)] font-semibold uppercase tracking-[0.06em]">
                    {siteContent.hero.currentlyLabel}:
                  </span>
                  <a
                    href="#projects"
                    className="font-sans text-[13px] text-[var(--ink)] hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors group inline-flex items-baseline gap-1.5 leading-snug"
                  >
                    <span>{siteContent.hero.currentlyValue}</span>
                    <span
                      className="font-mono text-xs text-[var(--accent)] group-hover:translate-x-0.5 transition-transform select-none shrink-0"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </a>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--rule-subtle)]/70">
                  <span className="text-[var(--ink-muted)] shrink-0">Location:</span>
                  <span className="text-[var(--ink)] text-right">
                    New Delhi, India
                  </span>
                </div>
              </div>

              {/* Card Footer Link to Contact */}
              <div className="pt-2.5 border-t border-[var(--rule-subtle)] flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--ink-muted)]">Availability:</span>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("contact");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                      history.pushState(null, "", "#contact");
                    }
                  }}
                  className="text-[var(--accent)] font-medium hover:underline inline-flex items-center gap-1 group transition-colors cursor-pointer"
                  title="Jump to contact details for internship inquiries"
                >
                  <span>Open to Internships</span>
                  <span
                    className="group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Links Row Spanning Full Container Width */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-[var(--rule)] text-xs font-mono text-[var(--ink-muted)]">
          <a
            href="https://github.com/Kartikk-git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors"
          >
            <Github size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>GitHub</span>
          </a>

          <span className="text-[var(--rule)] select-none">/</span>

          <a
            href="https://www.linkedin.com/in/kartik-koundal-a41574323/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors"
          >
            <Linkedin size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>LinkedIn</span>
          </a>

          <span className="text-[var(--rule)] select-none">/</span>

          <a
            href={`mailto:${contactContent.primary.email}?subject=${encodeURIComponent(contactContent.mailtoSubject)}`}
            className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors"
          >
            <Mail size={13} strokeWidth={1.5} aria-hidden="true" />
            <span>{contactContent.primary.email}</span>
          </a>

          <span className="text-[var(--rule)] select-none">/</span>

          <span>New Delhi, India</span>
        </div>
      </m.div>
    </section>
  );
}

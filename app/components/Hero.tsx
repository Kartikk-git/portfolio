"use client";

import React, { useEffect, useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { ArrowDown, Download, Mail, ArrowUpRight } from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { siteContent } from "@/content/site";
import { contactContent } from "@/content/contact";
import { mediaManifest } from "@/content/media";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("hero-seen")) {
        sessionStorage.setItem("hero-seen", "true");
      }
      document.documentElement.setAttribute("data-hero-seen", "true");
    } catch {}
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  const resumeSlot = mediaManifest["resume-pdf"];
  const isResumeAvailable = Boolean(resumeSlot?.src);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex flex-col justify-center py-16 md:py-24 border-b border-[var(--rule)]"
    >
      <m.div style={{ y, opacity }} className="max-w-[1120px] mx-auto px-4 sm:px-8 w-full">
        {/* Main 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
          {/* Left Column: Heading, Bio Paragraphs, CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow: Status Line */}
            <div className="hero-fade-1">
              <div className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
                <span
                  className="inline-block w-2 h-[2px] bg-[var(--accent)] shrink-0"
                  aria-hidden="true"
                />
                <span>{siteContent.hero.eyebrow}</span>
              </div>
            </div>

            {/* Name and Headline in Source Serif 4 */}
            <div className="hero-mask">
              <h1 className="hero-line-1 font-serif text-[clamp(2.5rem,5vw,4rem)] font-normal tracking-tight text-[var(--ink)] leading-[1.08]">
                <span className="block font-medium">{siteContent.hero.name}</span>
                <span className="block font-normal text-xl sm:text-2xl md:text-3xl text-[var(--ink-muted)] mt-1.5">
                  {siteContent.hero.headline}
                </span>
              </h1>
            </div>

            {/* 1px Accent Rule */}
            <div className="py-1 max-w-md">
              <div className="hero-rule h-[1px] w-full bg-[var(--accent)]" />
            </div>

            {/* Bio Paragraphs */}
            <div className="hero-fade-2 space-y-4 font-sans text-base sm:text-lg text-[var(--ink)] leading-[1.65]">
              {siteContent.hero.intro.split("\n\n").map((para, i) => (
                <p key={i}>
                  {para}
                </p>
              ))}
            </div>

            {/* 3-Tier CTAs */}
            <div className="hero-fade-3 flex flex-wrap items-center gap-3 pt-2">
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
                <a
                  href={resumeSlot.src!}
                  download="Kartik-Koundal-Resume.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{siteContent.hero.ctaSecondary}</span>
                </a>
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
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#111315] text-white px-2.5 py-1 rounded-[4px] font-mono text-[10px] whitespace-nowrap shadow-lg border border-white/10 z-20">
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

          {/* Right Column: Showcase Card & Focus Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:pt-6">
            {/* Currently Building Card */}
            <div className="hero-fade-2 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/40 p-5 hover:border-[var(--accent)] transition-colors group">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold block mb-2">
                {siteContent.hero.currentlyLabel}
              </span>
              <a
                href="#project/student-organizer"
                className="font-serif text-lg font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors flex items-center justify-between mb-2"
              >
                <span>Student Organizer</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
                Offline-first Android application consolidating courses, assignments, attendance and notes with Jetpack Compose &amp; Room.
              </p>
            </div>

            {/* Technical Focus Card */}
            <div className="hero-fade-2 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/20 p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] font-semibold block mb-3">
                {siteContent.hero.focusLabel} Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {siteContent.hero.focusItems.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] rounded-[2px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Snapshot Card */}
            <div className="hero-fade-3 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/10 p-4 font-mono text-xs space-y-2 text-[var(--ink-muted)]">
              <div className="flex items-center justify-between">
                <span>Degree:</span>
                <span className="text-[var(--ink)] font-sans">B.Tech CSE (2024–2028)</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--rule)]/40 pt-2">
                <span>College:</span>
                <span className="text-[var(--ink)] font-sans">Dronacharya College of Engg.</span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--rule)]/40 pt-2">
                <span>Location:</span>
                <span className="text-[var(--ink)] font-sans">New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links row spanning bottom */}
        <div className="hero-fade-3 flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-[var(--rule)] text-xs font-mono text-[var(--ink-muted)]">
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

"use client";

import React, { useEffect, useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { ArrowDown, Download, Mail } from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { siteContent } from "@/content/site";
import { contactContent } from "@/content/contact";
import { mediaManifest } from "@/content/media";
import { AndroidMockupDemo } from "./AndroidMockupDemo";

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
        {/* 2-Column Responsive Layout: Text (Left) + Interactive Android Demo (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-10">
          {/* Left Column: Intro, Headline, Bio, Focus, and CTAs */}
          <div className="lg:col-span-7">
            {/* Eyebrow: Status Line */}
            <div className="hero-fade-1 mb-5">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold px-2.5 py-1 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 animate-pulse"
                  aria-hidden="true"
                />
                <span>{siteContent.hero.eyebrow}</span>
              </div>
            </div>

            {/* Name and Headline in Source Serif 4 */}
            <div className="hero-mask mb-4">
              <h1 className="hero-line-1 font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--ink)] leading-[1.15]">
                <span className="block">{siteContent.hero.name}</span>
                <span className="block font-normal text-lg sm:text-xl text-[var(--ink-muted)] mt-2 leading-snug">
                  {siteContent.hero.headline}
                </span>
              </h1>
            </div>

            {/* 1px Accent Rule */}
            <div className="py-2">
              <div className="hero-rule h-[1px] w-16 bg-[var(--accent)]" />
            </div>

            {/* Bio Paragraphs */}
            <div className="hero-fade-2 max-w-[62ch] space-y-4 font-sans text-[15px] sm:text-base text-[var(--ink)] leading-[1.65] my-6">
              {siteContent.hero.intro.split("\n\n").map((para, i) => (
                <p key={i}>
                  {para}
                </p>
              ))}
            </div>

            {/* Focus Row: Clean Typographic Line */}
            <div className="hero-fade-2 flex flex-wrap items-center gap-2 mb-3 font-mono text-xs text-[var(--ink-muted)]">
              <span className="text-[var(--accent-soft)] font-semibold uppercase tracking-wider">
                {siteContent.hero.focusLabel}:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {siteContent.hero.focusItems.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 border border-[var(--rule-subtle)] bg-[var(--surface-subtle)] text-[var(--ink)] hover:border-[var(--accent-border)] hover:bg-[var(--surface)] transition-colors rounded-[2px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Currently Building Row: Quiet Clickable Link */}
            <div className="hero-fade-2 mb-8 font-mono text-xs">
              <a
                href="#projects"
                className="inline-flex flex-wrap items-baseline gap-2 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors group"
              >
                <span className="text-[var(--accent-soft)] font-semibold uppercase tracking-wider">
                  {siteContent.hero.currentlyLabel}:
                </span>
                <span className="font-sans text-sm text-[var(--ink)] group-hover:text-[var(--accent)] group-hover:underline underline-offset-4 transition-colors">
                  {siteContent.hero.currentlyValue} &rarr;
                </span>
              </a>
            </div>

            {/* 3-Tier CTAs */}
            <div className="hero-fade-3 flex flex-wrap items-center gap-3">
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

          {/* Right Column: Interactive Android Mockup Demo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AndroidMockupDemo />
          </div>
        </div>

        {/* Links Row Spanning Bottom */}
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

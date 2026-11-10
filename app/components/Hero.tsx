"use client";

import { useEffect, useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { ArrowDown, Download, ExternalLink, Mail } from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { profile } from "@/content/profile";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Mark hero-seen in sessionStorage on mount for subsequent visits
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("hero-seen")) {
        sessionStorage.setItem("hero-seen", "true");
      }
      document.documentElement.setAttribute("data-hero-seen", "true");
    } catch {}
  }, []);

  // Scroll-linked fade & rise (max 24px) as hero scrolls out
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[calc(100svh-66px)] max-h-[920px] flex flex-col justify-center py-12 md:py-20 border-b border-[var(--rule)]"
    >
      <m.div style={{ y, opacity }} className="max-w-[1120px] mx-auto px-4 sm:px-8 w-full">
        {/* Status Line: Mono with small solid accent square (never pulsing dot) */}
        <div className="hero-fade-1 mb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
            <span
              className="inline-block w-2 h-2 bg-[var(--accent)] rounded-none shrink-0"
              aria-hidden="true"
            />
            <span>{profile.statusLine}</span>
          </div>
        </div>

        {/* Headline / Name in Source Serif 4 clamp: line masked */}
        <div className="hero-mask mb-4">
          <h1 className="hero-line-1 font-serif text-[clamp(2.75rem,6vw,4.5rem)] font-normal tracking-tight text-[var(--ink)] leading-[1.08]">
            {profile.name}
          </h1>
        </div>

        {/* 1px Accent Rule drawing left-to-right (scaleX 0 to 1, 600ms) */}
        <div className="py-4 max-w-xl">
          <div className="hero-rule h-[1px] w-full bg-[var(--accent)]" />
        </div>

        {/* Positioning Sentence */}
        <div className="hero-fade-2 max-w-[62ch] mb-8">
          <p className="font-sans text-base sm:text-lg text-[var(--ink-muted)] leading-[1.65]">
            {profile.positioning}
          </p>
        </div>

        {/* Action Buttons: Radius 4px, min 44px touch height */}
        <div className="hero-fade-3 flex flex-wrap items-center gap-4 mb-10">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-sm font-medium hover:opacity-90 cursor-pointer transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <span>View projects</span>
            <ArrowDown
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-150 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium hover:border-[var(--ink)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <Download size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Download resume (PDF)</span>
          </a>
        </div>

        {/* Quiet Row of Text Links (GitHub, LinkedIn, Email) with 200ms underline draw */}
        <div className="hero-fade-3 flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--rule)] text-xs font-mono text-[var(--ink-muted)]">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <Github size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>GitHub</span>
          </a>

          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <Linkedin size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>LinkedIn</span>
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>{profile.email}</span>
          </a>

          <span className="text-[var(--ink-muted)]/70">
            {profile.location}
          </span>
        </div>

        {/* TODO(owner): Add /public/images/portrait.jpg if a portrait is desired. Banned if absent. */}
      </m.div>
    </section>
  );
}

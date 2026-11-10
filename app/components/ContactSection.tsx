"use client";

import { useState, useRef } from "react";
import { m, useInView } from "motion/react";
import {
  Copy,
  Check,
  Mail,
  ExternalLink,
  Download,
  MapPin,
} from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { profile } from "@/content/profile";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              05 / Get in Touch
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              Direct Inquiries
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Contact
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch]">
            Open to software engineering and native Android internships. Reach out directly by email or connect via professional platforms.
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

        <m.div
          variants={revealVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Email Copy Card */}
          <div className="border border-[var(--rule)] p-6 sm:p-8 rounded-[4px] bg-[var(--surface)]/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-muted)]">
              <Mail size={16} strokeWidth={1.5} className="text-[var(--accent)]" />
              <span>PRIMARY CONTACT</span>
            </div>

            <div className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--ink)] break-all">
              {profile.email}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 cursor-pointer transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                aria-label="Copy email address to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2} aria-hidden="true" />
                    <span>Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
                    <span>Copy email address</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--ink)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                Open in mail client
              </a>
            </div>

            {/* Accessible Live Region for Screen Readers */}
            <div aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard." : ""}
            </div>
          </div>

          {/* Links & Location Card */}
          <div className="border border-[var(--rule)] p-6 sm:p-8 rounded-[4px] bg-[var(--surface)]/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-muted)]">
                <MapPin size={16} strokeWidth={1.5} className="text-[var(--accent)]" />
                <span>LOCATION &amp; PROFILES</span>
              </div>

              <div className="font-serif text-xl font-semibold text-[var(--ink)]">
                {profile.location}
              </div>

              <div className="divide-y divide-[var(--rule)] text-sm font-mono pt-2">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[var(--ink-muted)]">GitHub</span>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--ink)] hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span>Kartikk-git</span>
                    <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[var(--ink-muted)]">LinkedIn</span>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--ink)] hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span>Kartik Koundal</span>
                    <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[var(--ink-muted)]">Credly</span>
                  <a
                    href={profile.credlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--ink)] hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span>kartik-koundal</span>
                    <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>

                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-[var(--ink-muted)]">LeetCode</span>
                  <a
                    href={profile.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--ink)] hover:text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <span>kartikk-git</span>
                    <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[var(--accent)] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                <Download size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>Download resume (PDF) &rarr;</span>
              </a>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

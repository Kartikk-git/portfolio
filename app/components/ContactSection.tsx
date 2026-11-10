"use client";

import React, { useState, useRef } from "react";
import { m, useInView } from "motion/react";
import { Copy, Check, Mail, ExternalLink, Download, MapPin } from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { contactContent } from "@/content/contact";
import { siteContent } from "@/content/site";
import { mediaManifest } from "@/content/media";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

interface ContactSectionProps {
  isReviewMode?: boolean;
}

export function ContactSection({ isReviewMode = false }: ContactSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactContent.primary.email);
      setCopied(true);
      setToastMessage(siteContent.toast.emailCopied);
      setTimeout(() => {
        setCopied(false);
        setToastMessage(null);
      }, 1500);
    } catch {
      setToastMessage(siteContent.toast.copyFailed);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const resumeSlot = mediaManifest["resume-pdf"];
  const isResumeAvailable = Boolean(resumeSlot?.src);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-mono text-xs uppercase tracking-[0.06em]">
              <span className="text-[var(--accent)] font-semibold">{contactContent.eyebrow}</span>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              Direct Contact
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink)]">
            {contactContent.heading}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {contactContent.intro}
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

        <m.div
          variants={revealVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-2"
        >
          {/* Primary Email - Big Serif Display */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)] flex items-center gap-2">
                <Mail size={14} strokeWidth={1.5} className="text-[var(--accent)]" />
                <span>{contactContent.primary.label}</span>
              </div>

              <div>
                <a
                  href={`mailto:${contactContent.primary.email}?subject=${encodeURIComponent(contactContent.mailtoSubject)}`}
                  className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--ink)] hover:text-[var(--accent)] transition-colors break-all leading-tight focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  {contactContent.primary.email}
                </a>
              </div>

              <p className="text-sm text-[var(--ink-muted)] leading-relaxed max-w-[48ch]">
                {contactContent.primary.note}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Copy Email Button */}
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 cursor-pointer transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                {copied ? (
                  <>
                    <Check size={14} strokeWidth={2} className="text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={1.5} />
                    <span>{contactContent.cta.copy}</span>
                  </>
                )}
              </button>

              {/* Open in Mail Client */}
              <a
                href={`mailto:${contactContent.primary.email}?subject=${encodeURIComponent(contactContent.mailtoSubject)}`}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--ink)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                <Mail size={14} strokeWidth={1.5} />
                <span>{contactContent.cta.mail}</span>
              </a>

              {/* Résumé (PDF) Button with pending state handling */}
              {isResumeAvailable ? (
                <a
                  href={resumeSlot.src!}
                  download="Kartik-Koundal-Resume.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                >
                  <Download size={14} strokeWidth={1.5} />
                  <span>{contactContent.cta.resume}</span>
                </a>
              ) : (
                <div className="relative group">
                  <button
                    type="button"
                    aria-disabled="true"
                    className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--surface)]/50 text-[var(--ink-muted)] text-xs font-mono font-medium opacity-60 cursor-not-allowed"
                  >
                    <Download size={14} strokeWidth={1.5} />
                    <span>{contactContent.cta.resume}</span>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#111315] text-white px-2.5 py-1 rounded-[4px] font-mono text-[10px] whitespace-nowrap shadow-lg border border-white/10 z-20">
                    {contactContent.resumePending}
                  </div>
                </div>
              )}
            </div>

            {/* Toast announcement */}
            <div aria-live="polite" className="h-6">
              {toastMessage && (
                <span className="font-mono text-xs text-[var(--accent)] font-semibold inline-block transition-opacity">
                  {toastMessage}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Location & Profiles */}
          <div className="lg:col-span-5 pt-8 lg:pt-0 lg:border-l lg:border-[var(--rule)] lg:pl-10 space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)] block mb-4">
              {contactContent.profilesLabel}
            </span>

            <div className="space-y-4 font-sans text-sm">
              {contactContent.profiles.map((p, idx) => (
                <div key={idx} className="pb-3 border-b border-[var(--rule)]/40 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                      {p.label}
                    </span>
                    {isReviewMode && p.confirm && (
                      <span className="font-mono text-[10px] px-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                        confirm
                      </span>
                    )}
                  </div>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--ink)] hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <span>{p.value}</span>
                      <ExternalLink className="w-3 h-3 text-[var(--ink-muted)]" />
                    </a>
                  ) : (
                    <div className="font-medium text-[var(--ink)] mt-0.5">
                      {p.value}
                    </div>
                  )}
                  {p.note && (
                    <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                      {p.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

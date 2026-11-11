"use client";

import React, { useRef } from "react";
import { m, useInView } from "motion/react";
import { ruleDrawVariants } from "@/lib/motion";

interface SectionProps {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  counter?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  id,
  eyebrow,
  heading,
  intro,
  counter,
  headerExtra,
  children,
  className = "",
}: SectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      id={id}
      ref={containerRef}
      className={`py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16 ${className}`}
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-mono text-xs uppercase tracking-[0.06em]">
              <span className="text-[var(--accent)] font-semibold">{eyebrow}</span>
            </div>
            {counter ? (
              <span className="font-mono text-xs text-[var(--ink-muted)]">
                {counter}
              </span>
            ) : headerExtra ? (
              <div className="font-mono text-xs text-[var(--ink-muted)]">
                {headerExtra}
              </div>
            ) : null}
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink)]">
            {heading}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {intro}
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

        {/* Section Body */}
        {children}
      </div>
    </section>
  );
}


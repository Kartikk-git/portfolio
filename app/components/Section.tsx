"use client";

import React, { useRef } from "react";
import { m, useInView, useScroll, useTransform, useReducedMotion } from "motion/react";
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
  isLast?: boolean;
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
  isLast = false,
}: SectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-8% 0px -8% 0px" });
  const prefersReduced = useReducedMotion();

  // Entrance: section fades in from 0 to 1 as its top enters from bottom of viewport (100%) to 50% of viewport
  const { scrollYProgress: enterProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 50%"],
  });

  // Exit: section fades out from 1 to 0 as its bottom moves from 80% to 50% of viewport.
  // Because Section A's bottom touches Section B's top:
  // When the NEXT section reaches 50% of the viewport, the current section reaches exit = 1.0 (opacity = 0).
  const { scrollYProgress: exitProgress } = useScroll({
    target: containerRef,
    offset: ["end 80%", "end 50%"],
  });

  const opacity = useTransform([enterProgress, exitProgress], (values: number[]) => {
    const enter = values[0] ?? 0;
    const exit = values[1] ?? 0;
    if (isLast) return enter;
    return enter * Math.max(0, 1 - exit);
  });

  const y = useTransform([enterProgress, exitProgress], (values: number[]) => {
    const enter = values[0] ?? 0;
    const exit = values[1] ?? 0;
    if (isLast) return (1 - enter) * 24;
    return (1 - enter) * 24 - exit * 20;
  });

  const pointerEvents = useTransform(exitProgress, (exit: number) => {
    if (isLast) return "auto";
    return exit >= 1 ? "none" : "auto";
  });

  return (
    <section
      id={id}
      ref={containerRef}
      className={`min-h-[75vh] flex flex-col justify-center py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16 overflow-hidden ${className}`}
    >
      <m.div
        style={prefersReduced ? undefined : { opacity, y, pointerEvents }}
        className="max-w-[1120px] mx-auto px-4 sm:px-8 w-full"
      >
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

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--ink)] leading-tight">
            {heading}
          </h2>

          <p className="mt-2 text-sm sm:text-[15px] text-[var(--ink-muted)] max-w-[62ch] leading-relaxed">
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
      </m.div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { m, useInView } from "motion/react";
import { profile } from "@/content/profile";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              02 / Background
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {profile.location}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            About
          </h2>

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

        {/* About Body: Exactly 3 sentences from source content */}
        <m.div
          variants={revealVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-[62ch] space-y-4 text-base sm:text-lg text-[var(--ink)] leading-[1.7]"
        >
          {profile.about.map((sentence, idx) => (
            <p key={idx} className="text-[var(--ink)]">
              {sentence}
            </p>
          ))}
        </m.div>
      </div>
    </section>
  );
}


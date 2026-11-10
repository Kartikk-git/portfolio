"use client";

import React, { useRef, useState } from "react";
import { m, useInView } from "motion/react";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";
import { skillsContent } from "@/content/skills";

export function SkillsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [activeTooltip, setActiveTooltip] = useState<{
    skill: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const tooltipsMap: Record<string, string> = skillsContent.tooltips;

  return (
    <section
      id="skills"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-mono text-xs uppercase tracking-[0.06em]">
              <span className="text-[var(--accent)] font-semibold">{skillsContent.eyebrow}</span>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              Core Stack
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink)]">
            {skillsContent.heading}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {skillsContent.intro}
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

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsContent.categories.map((cat, index) => (
            <m.div
              key={cat.id}
              variants={revealVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={index}
              className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-2">
                  {cat.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--rule)]/40">
                {cat.skills.map((skill) => {
                  const tip = tooltipsMap[skill] || tooltipsMap[skill.replace("&", "and")] || "";
                  return (
                    <div
                      key={skill}
                      tabIndex={0}
                      role="button"
                      aria-label={`${skill}: ${tip}`}
                      onMouseEnter={(e) => {
                        if (!tip) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActiveTooltip({
                          skill,
                          text: tip,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onFocus={(e) => {
                        if (!tip) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setActiveTooltip({
                          skill,
                          text: tip,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                      }}
                      onBlur={() => setActiveTooltip(null)}
                      className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] rounded-[2px] cursor-help hover:border-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-colors duration-120"
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </m.div>
          ))}
        </div>

        {/* Next Up Line */}
        <m.div
          variants={revealVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={4}
          className="mt-8 pt-4 border-t border-[var(--rule)]/40 flex flex-col sm:flex-row sm:items-baseline gap-2 font-mono text-xs text-[var(--ink-muted)]"
        >
          <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
            {skillsContent.next.label}:
          </span>
          <span className="font-sans text-sm text-[var(--ink)]">
            {skillsContent.next.value}
          </span>
        </m.div>
      </div>

      {/* Chip Hover Tooltip */}
      {activeTooltip && (
        <div
          style={{
            position: "fixed",
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="pointer-events-none z-50 bg-[#111315] text-white px-3 py-1.5 rounded-[4px] font-sans text-xs shadow-xl max-w-xs border border-white/10"
        >
          <span className="font-mono text-[10px] uppercase text-emerald-400 block mb-0.5">
            {activeTooltip.skill}
          </span>
          {activeTooltip.text}
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { m } from "motion/react";
import { revealVariants } from "@/lib/motion";
import { skillsContent } from "@/content/skills";
import { Section } from "./Section";

export function SkillsSection() {
  const [activeTooltip, setActiveTooltip] = useState<{
    skill: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const tooltipsMap: Record<string, string> = skillsContent.tooltips;

  return (
    <Section
      id="skills"
      eyebrow={skillsContent.eyebrow}
      heading={skillsContent.heading}
      intro={skillsContent.intro}
      headerExtra="Core Stack"
    >
      {/* 4 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillsContent.categories.map((cat, index) => (
          <m.div
            key={cat.id}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            custom={index}
            className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-2">
                {cat.title}
              </h3>
              <p className="font-sans text-sm text-[var(--ink-muted)] leading-relaxed mb-5">
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
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        custom={4}
        className="mt-8 pt-4 border-t border-[var(--rule)]/40 flex flex-col sm:flex-row sm:items-baseline gap-2 font-mono text-xs text-[var(--ink-muted)]"
      >
        <span className="text-[var(--accent)] font-semibold uppercase tracking-wider">
          {skillsContent.next.label}:
        </span>
        <span className="font-sans text-base text-[var(--ink)]">
          {skillsContent.next.value}
        </span>
      </m.div>

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
    </Section>
  );
}

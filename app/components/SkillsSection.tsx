"use client";

import React, { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";
import { revealVariants } from "@/lib/motion";
import { skillsContent } from "@/content/skills";
import { projectsContent } from "@/content/projects";
import { SKILL_DIM_EVENT } from "@/lib/skill-dim";
import { Section } from "./Section";

/**
 * Stack explorer (brief section 4): every skill is a text button linked to
 * the projects that use it. The skill-to-project mapping is derived from the
 * project tag data (projectsContent.items[].tags) — never typed separately.
 *
 * Hover, focus or click a skill to highlight the projects that use it and dim
 * the others to 35% opacity over 200ms. Click pins the selection (aria-pressed);
 * clicking the pinned skill again clears it.
 */
export function SkillsSection() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const activeSkill = hovered ?? pinned;

  // Skill -> project slugs, derived from the project stack data only.
  const projectsBySkill = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const project of projectsContent.items) {
      for (const tag of project.tags) {
        const existing = map.get(tag);
        map.set(tag, existing ? [...existing, project.slug] : [project.slug]);
      }
    }
    return map;
  }, []);

  const activeCount = activeSkill ? (projectsBySkill.get(activeSkill)?.length ?? 0) : 0;

  // Tell ProjectsSection which project cards match the active skill so the
  // real project rows highlight/dim (brief section 4). No duplicated list.
  useEffect(() => {
    const slugs = activeSkill ? (projectsBySkill.get(activeSkill) ?? []) : null;
    window.dispatchEvent(
      new CustomEvent(SKILL_DIM_EVENT, { detail: { slugs: slugs && slugs.length > 0 ? slugs : null } })
    );
    return () => {
      window.dispatchEvent(new CustomEvent(SKILL_DIM_EVENT, { detail: { slugs: null } }));
    };
  }, [activeSkill, projectsBySkill]);

  const selectSkill = (skill: string) => {
    setHovered(skill);
  };

  const clearHover = () => {
    setHovered(null);
  };

  const togglePin = (skill: string) => {
    setPinned((current) => (current === skill ? null : skill));
  };

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
            className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)]/70 hover:border-[var(--accent-soft)]/50 p-6 transition-colors"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent-soft)] font-semibold mb-2">
              {cat.title}
            </h3>
            <p className="font-sans text-sm text-[var(--ink-muted)] leading-relaxed mb-5">
              {cat.description}
            </p>

            {/* Skills as text buttons (brief: skills are text buttons, not chips) */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-[var(--rule-subtle)]">
              {cat.skills.map((skill) => {
                const isActive = activeSkill === skill;
                const isPinned = pinned === skill;
                return (
                  <button
                    key={skill}
                    type="button"
                    aria-pressed={isPinned}
                    aria-label={`${skill}: ${tooltipsMap[skill] || ""}`}
                    onMouseEnter={() => selectSkill(skill)}
                    onMouseLeave={clearHover}
                    onFocus={() => selectSkill(skill)}
                    onBlur={clearHover}
                    onClick={() => togglePin(skill)}
                    className={`font-mono text-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 editorial-link transition-colors duration-150 ${
                      isActive
                        ? "text-[var(--accent)] font-semibold"
                        : "text-[var(--ink)]"
                    }`}
                  >
                    {skill}
                    {isPinned && <span aria-hidden="true"> ·</span>}
                  </button>
                );
              })}
            </div>
          </m.div>
        ))}
      </div>

      {/* Live status line: derived mapping + approved context note */}
      <div
        aria-live="polite"
        className="mt-6 min-h-[2.5rem] font-sans text-sm text-[var(--ink)] leading-relaxed"
      >
        {activeSkill ? (
          <p>
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
              {activeSkill}
            </span>
            <span className="text-[var(--ink-muted)]">
              {" "}
              {activeCount > 0
                ? `· Used in ${activeCount} project${activeCount === 1 ? "" : "s"}.`
                : "·"}{" "}
            </span>
            <span>{tooltipsMap[activeSkill] || ""}</span>
          </p>
        ) : (
          <p className="text-[var(--ink-muted)]">
            Hover, focus or click a skill to see where it is used. Click again to pin.
          </p>
        )}
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
    </Section>
  );
}

// Tooltip copy comes from approved content; referenced in the status line.
const tooltipsMap: Record<string, string> = skillsContent.tooltips;

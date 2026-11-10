"use client";

import { useRef, useMemo } from "react";
import { m, useInView } from "motion/react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

interface SkillsSectionProps {
  selectedSkill: string | null;
  onSelectSkill: (skill: string | null) => void;
}

export function SkillsSection({
  selectedSkill,
  onSelectSkill,
}: SkillsSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  // Dynamically derive mapping from project stack data only (never typed separately)
  const skillProjectMap = useMemo(() => {
    const map = new Map<string, number>();

    // Normalize and count project occurrences
    projects.forEach((proj) => {
      proj.stack.forEach((tech) => {
        const lower = tech.toLowerCase();
        map.set(lower, (map.get(lower) || 0) + 1);
      });
    });

    return map;
  }, []);

  const handleSkillClick = (tech: string) => {
    if (selectedSkill?.toLowerCase() === tech.toLowerCase()) {
      onSelectSkill(null);
    } else {
      onSelectSkill(tech);
    }
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              03 / Technical Stack
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              Interactive Stack Explorer
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Skills &amp; Technologies
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch]">
            Click any technology to highlight linked projects above. Text buttons only &mdash; zero proficiency bars or arbitrary percentages.
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

        {/* Selected Skill Banner */}
        {selectedSkill && (
          <div className="mb-8 p-3 border border-[var(--rule)] bg-[var(--surface)] rounded-[4px] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[var(--ink-muted)]">Active Filter:</span>
              <span className="font-bold text-[var(--accent)]">{selectedSkill}</span>
              <span className="text-[var(--ink-muted)]">
                (Used in {skillProjectMap.get(selectedSkill.toLowerCase()) || 0}{" "}
                {(skillProjectMap.get(selectedSkill.toLowerCase()) || 0) === 1
                  ? "project"
                  : "projects"}
                )
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectSkill(null)}
              className="text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Skills Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.skills.map((category, catIdx) => (
            <m.div
              key={category.category}
              variants={revealVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={catIdx}
              className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]/30"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold mb-4">
                {category.category}
              </h3>

              <div className="flex flex-wrap gap-x-2 gap-y-3 font-mono text-sm">
                {category.items.map((item, itemIdx) => {
                  const count = skillProjectMap.get(item.toLowerCase()) || 0;
                  const isSelected =
                    selectedSkill?.toLowerCase() === item.toLowerCase();

                  return (
                    <span key={item} className="inline-flex items-center">
                      <button
                        type="button"
                        onClick={() => handleSkillClick(item)}
                        onMouseEnter={() => {
                          if (!selectedSkill) onSelectSkill(item);
                        }}
                        onMouseLeave={() => {
                          if (!selectedSkill) onSelectSkill(null);
                        }}
                        aria-pressed={isSelected}
                        className={`text-left transition-colors cursor-pointer rounded-[2px] px-1 py-0.5 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
                          isSelected
                            ? "bg-[var(--accent)] text-[var(--paper)] font-semibold"
                            : "text-[var(--ink)] hover:text-[var(--accent)] hover:underline underline-offset-4"
                        }`}
                        title={
                          count > 0
                            ? `Used in ${count} project${count > 1 ? "s" : ""}`
                            : undefined
                        }
                      >
                        {item}
                        {count > 0 && (
                          <span
                            className={`ml-1 text-[11px] font-mono ${
                              isSelected
                                ? "text-[var(--paper)]/80"
                                : "text-[var(--ink-muted)]"
                            }`}
                          >
                            ({count})
                          </span>
                        )}
                      </button>

                      {itemIdx < category.items.length - 1 && (
                        <span className="text-[var(--rule)] ml-2 select-none" aria-hidden="true">
                          /
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { m, useReducedMotion } from "motion/react";
import { Check, Terminal, Play } from "lucide-react";
import { phoneContent } from "@/content/phone";

export function SkillsScreen() {
  const prefersReduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(prefersReduced ? phoneContent.buildTasks.length + 1 : 0);

  useEffect(() => {
    if (prefersReduced) {
      setVisibleCount(phoneContent.buildTasks.length + 1);
      return;
    }

    setVisibleCount(0);
    const intervals: NodeJS.Timeout[] = [];
    const totalLines = phoneContent.buildTasks.length + 1; // tasks + BUILD SUCCESSFUL

    for (let i = 1; i <= totalLines; i++) {
      const timeout = setTimeout(() => {
        setVisibleCount(i);
      }, i * 150);
      intervals.push(timeout);
    }

    return () => {
      intervals.forEach((t) => clearTimeout(t));
    };
  }, [prefersReduced]);

  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-mono">
      <div className="flex flex-col gap-2">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pt-0.5 pb-1.5 border-b border-[var(--rule-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--ink)]">
            <Terminal size={12} className="text-[var(--accent)]" />
            <span className="font-serif text-[12px] sm:text-[13px] font-semibold tracking-tight">
              {phoneContent.skillsTitle}
            </span>
          </div>
          <span className="font-mono text-[8px] text-[var(--accent)] font-semibold px-1 py-0.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
            Gradle 8.7
          </span>
        </div>

        {/* Build Terminal Console Output */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2.5 flex flex-col gap-1.5 shadow-2xs font-mono text-[9px] min-h-[195px]">
          {phoneContent.buildTasks.map((task, idx) => {
            const isVisible = visibleCount > idx;
            return (
              <m.div
                key={task}
                initial={prefersReduced ? false : { opacity: 0, x: -6 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: prefersReduced ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-start gap-1.5 leading-tight ${isVisible ? "flex" : "hidden"}`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-[1px]">
                  <Check size={8} strokeWidth={2.5} />
                </span>
                <span className="text-[var(--ink)] break-all font-medium">
                  {task}
                </span>
              </m.div>
            );
          })}

          {/* Final BUILD SUCCESSFUL status banner */}
          {visibleCount > phoneContent.buildTasks.length && (
            <m.div
              initial={prefersReduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="font-bold text-[10px] text-[var(--accent)] tracking-wide">
                  {phoneContent.buildSuccess}
                </span>
              </div>
              <span className="text-[8px] text-[var(--ink-muted)]">
                in 1.4s
              </span>
            </m.div>
          )}
        </div>
      </div>

      {/* Target SDK Metadata Footer */}
      <div className="pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between text-[8px] font-mono text-[var(--ink-muted)]">
        <span>Kotlin 2.0 &middot; Compose</span>
        <span className="text-[var(--accent)] font-semibold">JVM 21</span>
      </div>
    </div>
  );
}


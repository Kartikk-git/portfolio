"use client";

import React, { useMemo } from "react";
import { m, useReducedMotion } from "motion/react";
import { GitCommit } from "lucide-react";
import { phoneContent } from "@/content/phone";

export function CommitLogScreen() {
  const prefersReduced = useReducedMotion();

  // Deterministic 7 rows x 12 columns grid pattern with realistic contribution density
  const grid = useMemo(() => {
    // Intensity levels 0 to 4
    const levels = [
      [1, 0, 2, 3, 1, 0, 2, 1, 3, 2, 0, 1],
      [0, 2, 1, 0, 3, 2, 1, 0, 2, 3, 1, 2],
      [2, 3, 0, 1, 2, 1, 0, 3, 1, 2, 0, 3],
      [1, 0, 3, 2, 1, 0, 3, 2, 0, 1, 3, 1],
      [3, 1, 2, 0, 2, 3, 1, 0, 2, 3, 1, 0],
      [0, 2, 1, 3, 0, 1, 2, 3, 1, 0, 2, 3],
      [2, 0, 3, 1, 2, 0, 1, 2, 3, 1, 0, 2],
    ];
    return levels;
  }, []);

  const getCellBg = (level: number) => {
    switch (level) {
      case 1:
        return "bg-[var(--accent)]/20 border border-[var(--accent)]/30";
      case 2:
        return "bg-[var(--accent)]/45 border border-[var(--accent)]/50";
      case 3:
        return "bg-[var(--accent)]/80 border border-[var(--accent)]";
      default:
        return "bg-[var(--paper)] border border-[var(--rule-subtle)]/70";
    }
  };

  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-sans">
      <div className="flex flex-col gap-2.5">
        {/* App Bar */}
        <div className="flex items-center justify-between pt-0.5 pb-1 border-b border-[var(--rule-subtle)]">
          <div className="flex items-center gap-1.5">
            <GitCommit size={13} className="text-[var(--accent)]" />
            <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[var(--ink)] tracking-tight">
              {phoneContent.activityTitle}
            </span>
          </div>
          <span className="font-mono text-[8.5px] text-[var(--accent)] font-semibold px-1.5 py-0.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
            Public Log
          </span>
        </div>

        {/* Highlight Summary Card */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--ink-muted)]">
              Year Total
            </span>
            <span className="font-mono text-[13px] font-bold text-[var(--accent)] mt-0.5 tabular-nums">
              {phoneContent.activitySub}
            </span>
          </div>
          <span className="font-mono text-[8.5px] text-[var(--ink-muted)] border-l border-[var(--rule-subtle)] pl-2">
            100% On-Time
          </span>
        </div>

        {/* 7 rows x 12 columns Mini Contribution Grid */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2 shadow-2xs flex flex-col items-center">
          <div className="grid grid-cols-12 gap-1 w-full justify-items-center">
            {grid.map((row, rIdx) =>
              row.map((level, cIdx) => {
                const cellIndex = rIdx * 12 + cIdx;
                return (
                  <m.div
                    key={`${rIdx}-${cIdx}`}
                    initial={prefersReduced ? false : { opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: prefersReduced ? 0 : 0.18,
                      delay: prefersReduced ? 0 : (cellIndex % 12) * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-[11px] h-[11px] rounded-[1.5px] ${getCellBg(level)}`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Grid Legend & Streak Footer */}
      <div className="pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between text-[8px] font-mono text-[var(--ink-muted)]">
        <span>{phoneContent.activityLegendLess}</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-[1px] bg-[var(--paper)] border border-[var(--rule)]" />
          <span className="w-2 h-2 rounded-[1px] bg-[var(--accent)]/20" />
          <span className="w-2 h-2 rounded-[1px] bg-[var(--accent)]/50" />
          <span className="w-2 h-2 rounded-[1px] bg-[var(--accent)]" />
        </div>
        <span>{phoneContent.activityLegendMore}</span>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { Calendar, Building2 } from "lucide-react";
import { phoneContent } from "@/content/phone";

export function ExperienceScreen() {
  const prefersReduced = useReducedMotion();

  // June 2026 calendar month: June 1 is a Monday. Days 8 through 30 start internship
  const juneDays = [
    { day: 1, inRange: false },
    { day: 2, inRange: false },
    { day: 3, inRange: false },
    { day: 4, inRange: false },
    { day: 5, inRange: false },
    { day: 6, inRange: false },
    { day: 7, inRange: false },
    { day: 8, inRange: true, isStart: true },
    { day: 9, inRange: true },
    { day: 10, inRange: true },
    { day: 11, inRange: true },
    { day: 12, inRange: true },
    { day: 13, inRange: true },
    { day: 14, inRange: true },
    { day: 15, inRange: true },
    { day: 16, inRange: true },
    { day: 17, inRange: true },
    { day: 18, inRange: true },
    { day: 19, inRange: true },
    { day: 20, inRange: true, isEnd: true },
  ];

  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-sans">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between pt-0.5 pb-1.5 border-b border-[var(--rule-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--ink)]">
            <Calendar size={12} className="text-[var(--accent)]" />
            <span className="font-serif text-[12px] sm:text-[13px] font-semibold tracking-tight">
              {phoneContent.experienceTitle}
            </span>
          </div>
          <span className="font-mono text-[8px] text-[var(--accent)] font-semibold px-1 py-0.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
            6 Weeks
          </span>
        </div>

        {/* Calendar Month Card: June / July */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2 flex flex-col gap-1.5 shadow-2xs">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--rule-subtle)] font-mono text-[8.5px]">
            <span className="font-semibold text-[var(--ink)]">{phoneContent.experienceMonth}</span>
            <span className="text-[var(--accent)] font-medium">{phoneContent.experienceDates}</span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center font-mono text-[8px] text-[var(--ink-muted)]">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[8px]">
            {juneDays.map((d) => (
              <m.div
                key={d.day}
                initial={prefersReduced ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: prefersReduced ? 0 : 0.15,
                  delay: prefersReduced ? 0 : d.day * 0.015,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`py-0.5 rounded-[2px] transition-colors ${
                  d.inRange
                    ? "bg-[var(--accent-tint)] border border-[var(--accent-border)] text-[var(--accent)] font-bold shadow-2xs"
                    : "text-[var(--ink-muted)]"
                }`}
              >
                {d.day}
              </m.div>
            ))}
          </div>
        </div>

        {/* Company & Role Card */}
        <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2 flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Building2 size={12} className="text-[var(--accent)] shrink-0" />
            <span className="font-serif text-[11px] font-semibold text-[var(--ink)] line-clamp-1">
              {phoneContent.experienceCompany}
            </span>
          </div>
          <span className="font-mono text-[8.5px] text-[var(--accent)] font-medium">
            {phoneContent.experienceRole}
          </span>
          <span className="font-mono text-[8px] text-[var(--ink-muted)]">
            Ref: SO/PL26/D.V/0136 &middot; Completed
          </span>
        </div>
      </div>

      {/* Footer Status */}
      <div className="pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between text-[8px] font-mono text-[var(--ink-muted)]">
        <span>Verified Certificate</span>
        <span className="text-[var(--accent)] font-semibold">Trainee</span>
      </div>
    </div>
  );
}


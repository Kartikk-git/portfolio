"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { Award, FolderGit2, GitCommit, User } from "lucide-react";
import { phoneContent } from "@/content/phone";

export function AboutScreen() {
  const prefersReduced = useReducedMotion();

  const stats = [
    {
      label: phoneContent.aboutCgpaLabel,
      value: phoneContent.aboutCgpaValue,
      icon: Award,
    },
    {
      label: phoneContent.aboutProjectsLabel,
      value: phoneContent.aboutProjectsValue,
      icon: FolderGit2,
    },
    {
      label: phoneContent.aboutCommitsLabel,
      value: phoneContent.aboutCommitsValue,
      icon: GitCommit,
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-sans">
      <div className="flex-1 flex flex-col justify-center items-center gap-3.5 my-auto w-full">
        {/* Profile Avatar Circle & Identity */}
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12 rounded-full bg-[var(--paper)] border-2 border-[var(--accent)] flex items-center justify-center shadow-md">
            <span className="font-serif text-lg font-bold text-[var(--accent)]">
              K
            </span>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--surface)]" />
          </div>

          {/* Identity & Status */}
          <h3 className="font-serif text-[14px] font-semibold text-[var(--ink)] mt-2 tracking-tight">
            {phoneContent.aboutName}
          </h3>
          <span className="font-mono text-[9px] text-[var(--accent)] font-medium mt-0.5">
            {phoneContent.aboutDegree}
          </span>
          <span className="font-mono text-[8px] text-[var(--ink-muted)] mt-0.5 tracking-tight">
            New Delhi, India
          </span>
        </div>

        {/* 3 Stat Rows / Cards */}
        <div className="flex flex-col gap-1.5 w-full">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <m.div
                key={stat.label}
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReduced ? 0 : 0.25,
                  delay: prefersReduced ? 0 : idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[4px] bg-[var(--surface)] border border-[var(--rule)] flex items-center justify-center text-[var(--accent)]">
                    <Icon size={11} strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[9px] text-[var(--ink-muted)]">
                    {stat.label}
                  </span>
                </div>
                <span className="font-mono text-[9.5px] font-bold text-[var(--ink)] tabular-nums">
                  {stat.value}
                </span>
              </m.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Micro-Badge */}
      <div className="pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between text-[8px] font-mono text-[var(--ink-muted)] shrink-0">
        <span>CSE &middot; 2024–2028</span>
        <span className="text-[var(--accent)] font-semibold">Active Student</span>
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { m, animate, useReducedMotion } from "motion/react";
import { phoneContent } from "@/content/phone";

function AttendanceRing({ targetPercent = 85 }: { targetPercent?: number }) {
  const prefersReduced = useReducedMotion();
  const [percent, setPercent] = useState(prefersReduced ? targetPercent : 0);

  const radius = 17;
  const circumference = 2 * Math.PI * radius; // ~106.81
  const targetOffset = circumference * (1 - targetPercent / 100);

  useEffect(() => {
    if (prefersReduced) {
      setPercent(targetPercent);
      return;
    }

    const controls = animate(0, targetPercent, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setPercent(Math.round(latest)),
    });
    return () => controls.stop();
  }, [targetPercent, prefersReduced]);

  return (
    <div className="relative flex items-center justify-center shrink-0 w-11 h-11">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="3.5"
        />
        <m.circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: prefersReduced ? targetOffset : circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: prefersReduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute font-mono text-[10px] font-bold text-[var(--ink)] tabular-nums">
        {percent}%
      </span>
    </div>
  );
}

export function ProjectsScreen() {
  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-sans">
      <div className="flex flex-col gap-2">
        {/* App Bar */}
        <div className="flex items-center justify-between pt-0.5 pb-1.5 border-b border-[var(--rule-subtle)]">
          <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[var(--ink)] tracking-tight">
            {phoneContent.appTitle}
          </span>
          <div className="w-5 h-5 rounded-full bg-[var(--accent-tint)] border border-[var(--accent-border)] text-[var(--accent)] font-mono text-[9px] font-semibold flex items-center justify-center">
            K
          </div>
        </div>

        {/* Section Heading: Today */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-[var(--accent)] font-bold">
            {phoneContent.todayHeading}
          </span>
          <span className="font-mono text-[8.5px] text-[var(--ink-muted)]">
            3 classes
          </span>
        </div>

        {/* Course Cards */}
        <div className="flex flex-col gap-1.5">
          {phoneContent.courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-[var(--paper)] border border-[var(--rule)] rounded-[5px] p-2 flex flex-col gap-0.5 shadow-2xs"
            >
              <span className="font-sans text-[10px] sm:text-[10.5px] font-medium text-[var(--ink)] leading-snug line-clamp-1">
                {course.name}
              </span>
              <div className="flex items-center justify-between text-[8.5px] font-mono text-[var(--ink-muted)] pt-0.5">
                <span>{course.time}</span>
                <span className="text-[var(--accent)]">{course.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Metric Ring */}
      <div className="bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] p-2 flex items-center gap-2.5 shadow-2xs mt-2">
        <AttendanceRing targetPercent={85} />
        <div className="flex flex-col">
          <span className="font-sans text-[11px] font-semibold text-[var(--ink)] leading-tight">
            {phoneContent.attendanceLabel}
          </span>
          <span className="font-mono text-[8.5px] text-[var(--ink-muted)] mt-0.5">
            {phoneContent.attendanceSubtext}
          </span>
        </div>
      </div>
    </div>
  );
}


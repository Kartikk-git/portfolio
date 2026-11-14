"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { m, useReducedMotion } from "motion/react";
import {
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Box,
} from "lucide-react";
import { activityContent } from "@/content/activity";
import rawGithub from "@/content/github-contributions.json";
import { Section } from "./Section";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface TooltipData {
  text: string;
  count: number;
  dateStr: string;
  weekday: string;
  formattedDate: string;
  x: number;
  y: number;
}

const ghDays: ContributionDay[] = (rawGithub?.contributions as ContributionDay[]) ?? [];

export function CommitLogSection() {
  const [highlightedMonth, setHighlightedMonth] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Replay State: week-by-week left-to-right 3D wave
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayWeekIndex, setReplayWeekIndex] = useState<number | null>(null);
  const [replayFinished, setReplayFinished] = useState(false);

  const monthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (monthTimerRef.current) clearTimeout(monthTimerRef.current);
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    };
  }, []);

  // GitHub contributions
  const ghTotal = rawGithub?.total?.lastYear ?? 0;

  // Ordered list of unique calendar months
  const monthsOrder = useMemo(() => {
    const set = new Set<string>();
    ghDays.forEach((d) => set.add(d.date.slice(0, 7)));
    return Array.from(set);
  }, []);

  // Build calendar weeks and month labels
  const { ghWeeks, monthLabels, busiestGh } = useMemo(() => {
    if (!ghDays || ghDays.length === 0) {
      return { ghWeeks: [], monthLabels: [], busiestGh: null };
    }

    const ghWeeksArr: ContributionDay[][] = [];
    let currentGhWeek: ContributionDay[] = [];

    const months: { label: string; monthIndex: number; colIndex: number }[] = [];
    let lastMonth = -1;
    let bGh = { date: "", count: 0 };

    ghDays.forEach((day) => {
      const d = new Date(day.date + "T00:00:00Z");
      const month = d.getUTCMonth();

      if (day.count > bGh.count) {
        bGh = { date: day.date, count: day.count };
      }

      if (currentGhWeek.length === 0 && month !== lastMonth) {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        months.push({ label: monthNames[month], monthIndex: month, colIndex: ghWeeksArr.length });
        lastMonth = month;
      }

      currentGhWeek.push(day);

      if (currentGhWeek.length === 7) {
        ghWeeksArr.push(currentGhWeek);
        currentGhWeek = [];
      }
    });

    if (currentGhWeek.length > 0) {
      ghWeeksArr.push(currentGhWeek);
    }

    return {
      ghWeeks: ghWeeksArr,
      monthLabels: months,
      busiestGh: bGh,
    };
  }, []);

  // Total weeks for left-to-right replay wave
  const totalWeeks = ghWeeks.length;

  // Replay Controller: advances column by column across the 53 weeks
  const stopReplay = useCallback(() => {
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    setIsReplaying(false);
  }, []);

  const resetReplay = useCallback(() => {
    stopReplay();
    setReplayWeekIndex(null);
    setReplayFinished(false);
  }, [stopReplay]);

  const startReplay = useCallback(() => {
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    setIsReplaying(true);
    setReplayFinished(false);
    setReplayWeekIndex(0);

    let currentWeek = 0;

    replayIntervalRef.current = setInterval(() => {
      currentWeek += 1;
      if (currentWeek >= totalWeeks) {
        if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
        setIsReplaying(false);
        setReplayFinished(true);
        setReplayWeekIndex(totalWeeks - 1);
      } else {
        setReplayWeekIndex(currentWeek);
      }
    }, 65);
  }, [totalWeeks]);

  const toggleReplay = () => {
    if (isReplaying) {
      stopReplay();
    } else {
      startReplay();
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    if (monthTimerRef.current) clearTimeout(monthTimerRef.current);
    resetReplay();
    setHighlightedMonth(monthIndex);
    monthTimerRef.current = setTimeout(() => {
      setHighlightedMonth(null);
    }, 2000);
  };

  const formatTooltip = (day: ContributionDay) => {
    const d = new Date(day.date + "T00:00:00Z");
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    if (day.count === 0) {
      return activityContent.tooltip.githubZero
        .replace("{weekday}", weekday)
        .replace("{date}", formattedDate);
    }
    return activityContent.tooltip.github
      .replace("{n}", String(day.count))
      .replace("{weekday}", weekday)
      .replace("{date}", formattedDate);
  };

  const isCellHighlighted = (day: ContributionDay) => {
    if (highlightedMonth !== null) {
      const d = new Date(day.date + "T00:00:00Z");
      return d.getUTCMonth() === highlightedMonth;
    }
    return false;
  };

  // 3D Box classes for tactile depth on each tile
  const boxDepthClasses = [
    // Level 0: Recessed tile bed
    "bg-[var(--rule)]/20 dark:bg-[var(--surface-subtle)] border-t border-[var(--rule)]/40 shadow-[0_1px_0_rgba(0,0,0,0.15)]",
    // Level 1: 3D box with 2px extruded bottom shadow
    "bg-[var(--accent)]/35 border-t border-white/20 shadow-[0_2px_0_rgba(0,0,0,0.35),0_2px_2px_rgba(0,0,0,0.15)]",
    // Level 2: 3D box with 2.5px extruded bottom shadow
    "bg-[var(--accent)]/60 border-t border-white/30 shadow-[0_2.5px_0_rgba(0,0,0,0.4),0_3px_3px_rgba(0,0,0,0.2)]",
    // Level 3: 3D box with 3px extruded bottom shadow
    "bg-[var(--accent)]/85 border-t border-white/40 shadow-[0_3px_0_rgba(0,0,0,0.45),0_3.5px_4px_rgba(0,0,0,0.25)]",
    // Level 4: 3D box with 4px extruded bottom shadow
    "bg-[var(--accent)] border-t border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.5),0_4.5px_5px_rgba(0,0,0,0.3)]",
  ];

  // Active month label during replay
  const activeReplayMonthName = useMemo(() => {
    if (replayWeekIndex === null || !ghWeeks[replayWeekIndex] || ghWeeks[replayWeekIndex].length === 0) {
      return null;
    }
    const sampleDate = ghWeeks[replayWeekIndex][0].date;
    const d = new Date(sampleDate + "T00:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }, [replayWeekIndex, ghWeeks]);

  const renderHeatmap = () => (
    <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
      <div className="inline-block min-w-[720px]">
        {/* Month labels */}
        <div className="flex h-4 mb-2 pl-6 text-[10px] font-mono text-[var(--ink-muted)]">
          {monthLabels.map((mInfo, idx) => {
            const isMonthActive = highlightedMonth === mInfo.monthIndex;

            return (
              <button
                key={idx}
                onClick={() => handleMonthClick(mInfo.monthIndex)}
                className={`transition-colors cursor-pointer hover:text-[var(--accent)] ${
                  isMonthActive ? "text-[var(--accent)] font-bold underline" : ""
                }`}
                style={{
                  marginLeft: idx === 0 ? `${mInfo.colIndex * 14}px` : undefined,
                  marginRight:
                    idx < monthLabels.length - 1
                      ? `${(monthLabels[idx + 1].colIndex - mInfo.colIndex) * 14 - 22}px`
                      : undefined,
                }}
                title="Click to highlight month"
              >
                {mInfo.label}
              </button>
            );
          })}
        </div>

        {/* Straight, Non-Tilted Heatmap Grid */}
        <div className="flex gap-[3.5px] py-2">
          {/* Day labels (Mon, Wed, Fri) */}
          <div className="flex flex-col justify-between text-[9px] font-mono text-[var(--ink-muted)] pr-1.5 h-[98px] leading-[11px] select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 53 Weeks Columns: Wave moves Left to Right */}
          {ghWeeks.map((week, wIdx) => {
            // Replay wave logic:
            // wIdx < replayWeekIndex: already landed
            // wIdx === replayWeekIndex: currently dropping from the top box
            // wIdx > replayWeekIndex: not yet dispensed
            const isWeekDropping = isReplaying && replayWeekIndex !== null && wIdx === replayWeekIndex;
            const isWeekLanded = replayWeekIndex === null || wIdx <= replayWeekIndex;
            const isWeekPending = isReplaying && replayWeekIndex !== null && wIdx > replayWeekIndex;

            return (
              <div
                key={wIdx}
                className="flex flex-col gap-[3.5px] relative"
              >
                {week.map((day, dIdx) => {
                  const highlighted = isCellHighlighted(day);
                  const isHoverDimmed = hoveredLevel !== null && day.level !== hoveredLevel;

                  const dObj = new Date(day.date + "T00:00:00Z");
                  const weekday = dObj.toLocaleDateString("en-US", { weekday: "short" });
                  const formattedDate = dObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  // Display level during replay
                  const displayLevel = isWeekPending ? 0 : day.level;

                  return (
                    <div
                      key={dIdx}
                      role="img"
                      aria-label={formatTooltip(day)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          text: formatTooltip(day),
                          count: day.count,
                          dateStr: day.date,
                          weekday,
                          formattedDate,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        animationDelay: isWeekDropping ? `${dIdx * 25}ms` : undefined,
                      }}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-200 cursor-default select-none relative ${
                        boxDepthClasses[displayLevel] || boxDepthClasses[0]
                      } ${
                        isWeekDropping ? "animate-tile-drop z-20 ring-1 ring-[var(--accent)]" : ""
                      } ${
                        highlighted
                          ? "ring-1.5 ring-[var(--accent)] scale-110 z-10"
                          : ""
                      } ${
                        isHoverDimmed
                          ? "opacity-25"
                          : isWeekPending
                          ? "opacity-20"
                          : "opacity-100"
                      } hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.45)]`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend & Replay progress footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-[11px] font-mono text-[var(--ink-muted)]">
          <div>
            {isReplaying && replayWeekIndex !== null && (
              <span className="text-[var(--accent)] font-medium flex items-center gap-1.5 animate-fadeIn">
                <span>
                  Week {replayWeekIndex + 1}/{totalWeeks}
                  {activeReplayMonthName ? ` · ${activeReplayMonthName}` : ""}
                </span>
              </span>
            )}
            {replayFinished && (
              <span className="text-[var(--accent)] font-medium flex items-center gap-1 animate-fadeIn">
                <span>Replay complete · 315 commits placed</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span>Less</span>
            <div className="flex gap-[3.5px]">
              {[0, 1, 2, 3, 4].map((lvl) => (
                <div
                  key={lvl}
                  onMouseEnter={() => setHoveredLevel(lvl)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  className={`w-[11px] h-[11px] rounded-[2px] ${boxDepthClasses[lvl]} hover:ring-1 hover:ring-[var(--ink)] cursor-default`}
                  title={`Level ${lvl}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Section
      id="activity"
      eyebrow={activityContent.eyebrow}
      heading={activityContent.heading}
      intro={activityContent.intro}
      headerExtra="Public GitHub contributions"
    >
      {/* Screen Reader Accessible Summary */}
      <div className="sr-only">
        {activityContent.summarySrOnly
          .replace("{n}", String(ghTotal))
          .replace("{busiestDate}", busiestGh?.date || "")
          .replace("{busiestCount}", String(busiestGh?.count || 0))}
      </div>

      {/* Top 3D Source Box & Replay Action Bar */}
      {!prefersReducedMotion && (
        <div className="mb-6 p-4 sm:p-5 border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* 3D Dispenser Box at Top */}
          <div className="flex items-center gap-3">
            <div
              className={`relative w-10 h-10 rounded-[3px] bg-[var(--surface)] border border-[var(--rule)] flex items-center justify-center transition-all duration-300 ${
                isReplaying
                  ? "border-[var(--accent)] scale-110 shadow-[0_4px_0_var(--accent),0_6px_10px_rgba(0,0,0,0.25)]"
                  : "shadow-[0_3px_0_var(--rule),0_4px_6px_rgba(0,0,0,0.12)]"
              }`}
            >
              <Box
                size={18}
                className={`transition-colors ${
                  isReplaying
                    ? "text-[var(--accent)] animate-pulse"
                    : "text-[var(--ink-muted)]"
                }`}
              />
            </div>
            <div className="font-mono text-xs">
              <span className="font-semibold text-[var(--ink)] flex items-center gap-2">
                <span>Commit Dispenser Crate</span>
                {isReplaying && (
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                )}
              </span>
              <span className="text-[10px] text-[var(--ink-muted)] block mt-0.5">
                {isReplaying
                  ? `Dispensing 3D blocks left-to-right (Week ${replayWeekIndex ? replayWeekIndex + 1 : 1}/${totalWeeks})`
                  : replayFinished
                  ? "All 3D blocks successfully landed in calendar"
                  : "Click 'Replay my year' to drop 3D tiles from the top"}
              </span>
            </div>
          </div>

          {/* Replay Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleReplay}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--accent)] text-[var(--ink)] rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              title="Animate 3D boxes dropping from top into calendar"
            >
              {isReplaying ? (
                <>
                  <Pause size={13} className="text-amber-600 dark:text-amber-400" />
                  <span>Pause</span>
                </>
              ) : replayFinished ? (
                <>
                  <RotateCcw size={13} className="text-[var(--accent)]" />
                  <span>Replay again</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-[var(--accent)] fill-[var(--accent)]/20" />
                  <span>Replay my year</span>
                </>
              )}
            </button>

            {replayWeekIndex !== null && (
              <button
                type="button"
                onClick={resetReplay}
                className="text-xs font-mono text-[var(--ink-muted)] hover:text-[var(--ink)] px-2 py-1"
                title="Reset replay animation"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Heatmap Panel: Zooms slightly bigger when replaying */}
      <div>
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-5 sm:p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isReplaying ? "scale-[1.03] shadow-lg" : "scale-100"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[var(--rule)]">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">
                {activityContent.github.title.replace("{n}", String(ghTotal))}
              </h3>
              <p className="font-sans text-sm text-[var(--ink-muted)] leading-[1.65] mt-1">
                {activityContent.github.description}
              </p>
            </div>
            <a
              href="https://github.com/Kartikk-git"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              {activityContent.github.source}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {renderHeatmap()}

          <div className="mt-4 pt-3 border-t border-[var(--rule)]/40 font-mono text-[11px] text-[var(--ink-muted)]">
            {activityContent.github.footer}
          </div>
        </m.div>
      </div>

      {/* Rich Interactive Floating Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="pointer-events-none z-50 bg-[var(--ink)] text-[var(--paper)] px-3 py-2 rounded-[4px] font-mono shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--paper)]/10 flex flex-col gap-0.5 text-xs select-none"
        >
          <div className="text-[10px] text-[var(--paper)]/60">
            {tooltip.weekday}, {tooltip.formattedDate}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                tooltip.count > 0 ? "text-[var(--accent)] dark:text-[var(--accent)]" : "text-[var(--paper)]/60"
              }`}
            >
              {tooltip.count > 0 ? `${tooltip.count} contributions` : "No contributions"}
            </span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-[var(--paper)]/10 text-[var(--paper)]/80">
              GitHub
            </span>
          </div>
        </div>
      )}
    </Section>
  );
}

"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  GitCommit,
  Code2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";
import { revealVariants } from "@/lib/motion";
import { activityContent } from "@/content/activity";
import rawGithub from "@/content/github-contributions.json";
import rawLeetCode from "@/content/leetcode-contributions.json";
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
  platform: "github" | "leetcode";
  x: number;
  y: number;
}

const ghDays: ContributionDay[] = (rawGithub?.contributions as ContributionDay[]) ?? [];
const lcCalendar: Record<string, number> = (rawLeetCode?.submissionCalendar as Record<string, number>) ?? {};

export function CommitLogSection() {
  const [platformView, setPlatformView] = useState<"github" | "leetcode" | "all">("github");
  const [highlightedMonth, setHighlightedMonth] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Replay State
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayMonthIndex, setReplayMonthIndex] = useState<number | null>(null);
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

  // LeetCode contributions
  const lcTotalSubmissions = useMemo(() => {
    return Object.values(lcCalendar).reduce((acc, curr) => acc + curr, 0);
  }, []);
  const lcActiveDays = rawLeetCode?.totalActiveDays ?? 18;

  // Ordered list of unique calendar months (e.g. ["2025-11", "2025-12", ..., "2026-11"])
  const monthsOrder = useMemo(() => {
    const set = new Set<string>();
    ghDays.forEach((d) => set.add(d.date.slice(0, 7)));
    return Array.from(set);
  }, []);

  // Map dates to LeetCode count
  const lcDateMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const [timestamp, count] of Object.entries(lcCalendar)) {
      const d = new Date(parseInt(timestamp) * 1000);
      const dateStr = d.toISOString().split("T")[0];
      map.set(dateStr, count);
    }
    return map;
  }, []);

  // Monthly statistics for animated replay
  const monthlyStats = useMemo(() => {
    let runningGhTotal = 0;
    let runningLcTotal = 0;

    return monthsOrder.map((ym, idx) => {
      const days = ghDays.filter((c) => c.date.startsWith(ym));
      const ghMonthCount = days.reduce((acc, curr) => acc + curr.count, 0);
      const lcMonthCount = days.reduce((acc, curr) => acc + (lcDateMap.get(curr.date) || 0), 0);

      runningGhTotal += ghMonthCount;
      runningLcTotal += lcMonthCount;

      const d = new Date(ym + "-01T00:00:00Z");
      const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const monthShort = d.toLocaleDateString("en-US", { month: "short" });

      return {
        monthKey: ym,
        monthIndex: idx,
        label,
        monthShort,
        ghMonthCount,
        lcMonthCount,
        cumulativeGh: runningGhTotal,
        cumulativeLc: runningLcTotal,
      };
    });
  }, [monthsOrder, lcDateMap]);

  // Build calendar weeks and month labels
  const { ghWeeks, lcWeeks, monthLabels, busiestGh } = useMemo(() => {
    if (!ghDays || ghDays.length === 0) {
      return { ghWeeks: [], lcWeeks: [], monthLabels: [], busiestGh: null };
    }

    const getLcLevel = (count: number) => {
      if (!count || count <= 0) return 0;
      if (count <= 3) return 1;
      if (count <= 7) return 2;
      if (count <= 11) return 3;
      return 4;
    };

    const ghWeeksArr: ContributionDay[][] = [];
    const lcWeeksArr: ContributionDay[][] = [];
    let currentGhWeek: ContributionDay[] = [];
    let currentLcWeek: ContributionDay[] = [];

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

      const lcCount = lcDateMap.get(day.date) || 0;
      currentLcWeek.push({
        date: day.date,
        count: lcCount,
        level: getLcLevel(lcCount),
      });

      if (currentGhWeek.length === 7) {
        ghWeeksArr.push(currentGhWeek);
        lcWeeksArr.push(currentLcWeek);
        currentGhWeek = [];
        currentLcWeek = [];
      }
    });

    if (currentGhWeek.length > 0) {
      ghWeeksArr.push(currentGhWeek);
      lcWeeksArr.push(currentLcWeek);
    }

    return {
      ghWeeks: ghWeeksArr,
      lcWeeks: lcWeeksArr,
      monthLabels: months,
      busiestGh: bGh,
    };
  }, [lcDateMap]);

  // Replay Controller
  const stopReplay = useCallback(() => {
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    setIsReplaying(false);
  }, []);

  const resetReplay = useCallback(() => {
    stopReplay();
    setReplayMonthIndex(null);
    setReplayFinished(false);
  }, [stopReplay]);

  const startReplay = useCallback(() => {
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    setIsReplaying(true);
    setReplayFinished(false);
    setReplayMonthIndex(0);

    let currentStep = 0;
    const maxSteps = monthsOrder.length;

    replayIntervalRef.current = setInterval(() => {
      currentStep += 1;
      if (currentStep >= maxSteps) {
        if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
        setIsReplaying(false);
        setReplayFinished(true);
        setReplayMonthIndex(maxSteps - 1);
      } else {
        setReplayMonthIndex(currentStep);
      }
    }, 420);
  }, [monthsOrder.length]);

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

  const formatTooltip = (day: ContributionDay, platform: "github" | "leetcode") => {
    const d = new Date(day.date + "T00:00:00Z");
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    if (platform === "github") {
      if (day.count === 0) {
        return activityContent.tooltip.githubZero
          .replace("{weekday}", weekday)
          .replace("{date}", formattedDate);
      }
      return activityContent.tooltip.github
        .replace("{n}", String(day.count))
        .replace("{weekday}", weekday)
        .replace("{date}", formattedDate);
    } else {
      if (day.count === 0) {
        return activityContent.tooltip.leetcodeZero
          .replace("{weekday}", weekday)
          .replace("{date}", formattedDate);
      }
      return activityContent.tooltip.leetcode
        .replace("{n}", String(day.count))
        .replace("{weekday}", weekday)
        .replace("{date}", formattedDate);
    }
  };

  const getDayMonthIndex = (dateStr: string) => {
    const ym = dateStr.slice(0, 7);
    return monthsOrder.indexOf(ym);
  };

  const isCellHighlighted = (day: ContributionDay) => {
    if (highlightedMonth !== null) {
      const d = new Date(day.date + "T00:00:00Z");
      return d.getUTCMonth() === highlightedMonth;
    }
    if (replayMonthIndex !== null) {
      const dMonthIdx = getDayMonthIndex(day.date);
      return dMonthIdx === replayMonthIndex;
    }
    return false;
  };

  const isCellDimmed = (day: ContributionDay) => {
    if (highlightedMonth !== null) {
      const d = new Date(day.date + "T00:00:00Z");
      return d.getUTCMonth() !== highlightedMonth;
    }
    if (hoveredLevel !== null) {
      return day.level !== hoveredLevel;
    }
    if (replayMonthIndex !== null) {
      const dMonthIdx = getDayMonthIndex(day.date);
      return dMonthIdx > replayMonthIndex;
    }
    return false;
  };

  const intensityClasses = [
    "bg-[var(--rule)]/40 dark:bg-[var(--surface)]",
    "bg-[#1B6B4F]/30 dark:bg-[#5FB38F]/30",
    "bg-[#1B6B4F]/50 dark:bg-[#5FB38F]/50",
    "bg-[#1B6B4F]/75 dark:bg-[#5FB38F]/75",
    "bg-[#1B6B4F] dark:bg-[#5FB38F]",
  ];

  // Current Replay Stat
  const activeReplayStat = replayMonthIndex !== null ? monthlyStats[replayMonthIndex] : null;
  const targetTotal = platformView === "leetcode" ? lcTotalSubmissions : ghTotal;
  const currentReplayCount = activeReplayStat
    ? platformView === "leetcode"
      ? activeReplayStat.cumulativeLc
      : activeReplayStat.cumulativeGh
    : targetTotal;

  const renderHeatmap = (weeks: ContributionDay[][], platform: "github" | "leetcode") => (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="inline-block min-w-[720px]">
        {/* Month labels */}
        <div className="flex h-4 mb-2 pl-6 text-[10px] font-mono text-[var(--ink-muted)]">
          {monthLabels.map((mInfo, idx) => {
            const isMonthActive =
              highlightedMonth === mInfo.monthIndex ||
              (replayMonthIndex !== null && activeReplayStat?.monthShort === mInfo.label);

            return (
              <button
                key={idx}
                onClick={() => handleMonthClick(mInfo.monthIndex)}
                className={`transition-colors cursor-pointer hover:text-[var(--accent)] ${
                  isMonthActive ? "text-[var(--accent)] font-bold underline" : ""
                }`}
                style={{
                  marginLeft: idx === 0 ? `${mInfo.colIndex * 13}px` : undefined,
                  marginRight:
                    idx < monthLabels.length - 1
                      ? `${(monthLabels[idx + 1].colIndex - mInfo.colIndex) * 13 - 22}px`
                      : undefined,
                }}
                title="Click to highlight month"
              >
                {mInfo.label}
              </button>
            );
          })}
        </div>

        {/* Grid: 7 rows (Mon-Sun) */}
        <div className="flex gap-[3px]">
          {/* Day labels (Mon, Wed, Fri) */}
          <div className="flex flex-col justify-between text-[9px] font-mono text-[var(--ink-muted)] pr-1 h-[91px] leading-[10px] select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Weeks columns */}
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((day, dIdx) => {
                const highlighted = isCellHighlighted(day);
                const dimmed = isCellDimmed(day);

                // If replay has not reached this day's month yet, render as empty base level
                const dMonthIdx = getDayMonthIndex(day.date);
                const isFutureReplay = replayMonthIndex !== null && dMonthIdx > replayMonthIndex;
                const effectiveLevel = isFutureReplay ? 0 : day.level;

                const dObj = new Date(day.date + "T00:00:00Z");
                const weekday = dObj.toLocaleDateString("en-US", { weekday: "short" });
                const formattedDate = dObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={dIdx}
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: formatTooltip(day, platform),
                        count: day.count,
                        dateStr: day.date,
                        weekday,
                        formattedDate,
                        platform,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onFocus={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: formatTooltip(day, platform),
                        count: day.count,
                        dateStr: day.date,
                        weekday,
                        formattedDate,
                        platform,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onBlur={() => setTooltip(null)}
                    className={`w-[10px] h-[10px] rounded-[1px] transition-all duration-200 cursor-pointer ${
                      intensityClasses[effectiveLevel] || intensityClasses[0]
                    } ${
                      highlighted
                        ? "ring-2 ring-[var(--accent)] scale-125 z-10 shadow-xs"
                        : ""
                    } ${dimmed ? "opacity-25" : "opacity-100"} focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend & Replay progress footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-[11px] font-mono text-[var(--ink-muted)]">
          <div>
            {isReplaying && activeReplayStat && (
              <span className="text-[var(--accent)] font-medium flex items-center gap-1.5 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                <span>
                  Month {activeReplayStat.monthIndex + 1}/{monthsOrder.length}: {activeReplayStat.label}
                </span>
              </span>
            )}
            {replayFinished && (
              <span className="text-[var(--accent)] font-medium flex items-center gap-1 animate-fadeIn">
                <span>✓ Replay complete: {targetTotal} {platform === "github" ? "commits" : "submissions"}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span>Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onMouseEnter={() => setHoveredLevel(lvl)}
                  onMouseLeave={() => setHoveredLevel(null)}
                  className={`w-[10px] h-[10px] rounded-[1px] ${intensityClasses[lvl]} hover:ring-1 hover:ring-[var(--ink)] cursor-pointer`}
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
      headerExtra={`${ghTotal} Commits · ${lcTotalSubmissions} Submissions`}
    >
      {/* Screen Reader Accessible Summary */}
      <div className="sr-only">
        {activityContent.summarySrOnly
          .replace("{n}", String(ghTotal + lcTotalSubmissions))
          .replace("{busiestDate}", busiestGh?.date || "")
          .replace("{busiestCount}", String(busiestGh?.count || 0))}
      </div>

      {/* Control Bar: View Toggle & Replay My Year */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--rule)]">
        {/* Smooth Platform View Segmented Toggle */}
        <div className="inline-flex p-1 bg-[var(--surface)] border border-[var(--rule)] rounded-[6px] gap-1">
          <button
            type="button"
            onClick={() => {
              setPlatformView("github");
              resetReplay();
            }}
            className={`relative px-3 py-1.5 rounded-[4px] font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              platformView === "github"
                ? "text-[var(--ink)] font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {platformView === "github" && (
              <m.div
                layoutId="activePlatformPill"
                className="absolute inset-0 bg-[var(--paper)] border border-[var(--rule)] shadow-xs rounded-[4px]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <GitCommit className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">GitHub ({ghTotal})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPlatformView("leetcode");
              resetReplay();
            }}
            className={`relative px-3 py-1.5 rounded-[4px] font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              platformView === "leetcode"
                ? "text-[var(--ink)] font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {platformView === "leetcode" && (
              <m.div
                layoutId="activePlatformPill"
                className="absolute inset-0 bg-[var(--paper)] border border-[var(--rule)] shadow-xs rounded-[4px]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Code2 className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">LeetCode ({lcTotalSubmissions})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPlatformView("all");
              resetReplay();
            }}
            className={`relative px-3 py-1.5 rounded-[4px] font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              platformView === "all"
                ? "text-[var(--ink)] font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {platformView === "all" && (
              <m.div
                layoutId="activePlatformPill"
                className="absolute inset-0 bg-[var(--paper)] border border-[var(--rule)] shadow-xs rounded-[4px]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Layers className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Both</span>
          </button>
        </div>

        {/* Replay My Year Button & Live Counter */}
        <div className="flex items-center gap-2">
          {/* Animated Counter Pill */}
          <div className="px-3 py-1 bg-[var(--surface-subtle)] border border-[var(--rule)] rounded-[4px] font-mono text-xs text-[var(--ink)] flex items-center gap-2">
            <span className="text-[var(--ink-muted)] text-[11px]">
              {platformView === "leetcode" ? "Submissions:" : "Contributions:"}
            </span>
            <span className="font-semibold text-[var(--accent)] min-w-[2.5rem] text-right">
              {currentReplayCount}
            </span>
            <span className="text-[var(--ink-muted)] text-[11px]">
              / {targetTotal}
            </span>
          </div>

          {/* Replay Button */}
          <button
            type="button"
            onClick={toggleReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--rule)] bg-[var(--paper)] hover:border-[var(--accent)] text-[var(--ink)] rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            title="Animate squares filling in month by month with live counter"
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

          {replayMonthIndex !== null && (
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

      {/* Activity Panels with Smooth Transition */}
      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {/* GitHub Panel */}
          {(platformView === "github" || platformView === "all") && (
            <m.div
              key={platformView === "all" ? "github-all" : "github-single"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--rule)]">
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

              {renderHeatmap(ghWeeks, "github")}

              <div className="mt-4 pt-3 border-t border-[var(--rule)]/40 font-mono text-[11px] text-[var(--ink-muted)]">
                {activityContent.github.footer}
              </div>
            </m.div>
          )}

          {/* LeetCode Panel */}
          {(platformView === "leetcode" || platformView === "all") && (
            <m.div
              key={platformView === "all" ? "leetcode-all" : "leetcode-single"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--rule)]">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">
                    {activityContent.leetcode.title
                      .replace("{n}", String(lcTotalSubmissions))
                      .replace("{d}", String(lcActiveDays))}
                  </h3>
                  <p className="font-sans text-sm text-[var(--ink-muted)] leading-[1.65] mt-1">
                    {activityContent.leetcode.description}
                  </p>
                </div>
                <a
                  href="https://leetcode.com/u/kartikk-git/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  {activityContent.leetcode.source}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {renderHeatmap(lcWeeks, "leetcode")}

              <div className="mt-4 pt-3 border-t border-[var(--rule)]/40 font-mono text-[11px] text-[var(--ink-muted)]">
                {activityContent.leetcode.footer}
              </div>
            </m.div>
          )}
        </AnimatePresence>
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
          className="pointer-events-none z-50 bg-[#111315] text-white px-3 py-2 rounded-[4px] font-mono shadow-xl border border-white/10 flex flex-col gap-0.5 text-xs select-none"
        >
          <div className="text-[10px] text-gray-400">
            {tooltip.weekday}, {tooltip.formattedDate}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                tooltip.count > 0 ? "text-[#5FB38F]" : "text-gray-400"
              }`}
            >
              {tooltip.count > 0
                ? `${tooltip.count} ${tooltip.platform === "github" ? "contributions" : "submissions"}`
                : `No ${tooltip.platform === "github" ? "contributions" : "submissions"}`}
            </span>
            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-white/10 text-gray-300">
              {tooltip.platform === "github" ? "GitHub" : "LeetCode"}
            </span>
          </div>
        </div>
      )}
    </Section>
  );
}

"use client";

import React, { useState, useRef, useMemo } from "react";
import { m, useInView } from "motion/react";
import { ExternalLink, GitCommit, Code2 } from "lucide-react";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";
import { activityContent } from "@/content/activity";
import rawGithub from "@/content/github-contributions.json";
import rawLeetCode from "@/content/leetcode-contributions.json";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export function CommitLogSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [platformView, setPlatformView] = useState<"all" | "github" | "leetcode">("all");
  const [highlightedMonth, setHighlightedMonth] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // GitHub contributions
  const ghTotal = rawGithub?.total?.lastYear ?? 0;
  const ghDays: ContributionDay[] = (rawGithub?.contributions as ContributionDay[]) ?? [];

  // LeetCode contributions
  const lcCalendar = (rawLeetCode?.submissionCalendar as Record<string, number>) ?? {};
  const lcTotalSubmissions = useMemo(() => {
    return Object.values(lcCalendar).reduce((acc, curr) => acc + curr, 0);
  }, [lcCalendar]);
  const lcActiveDays = rawLeetCode?.totalActiveDays ?? 18;

  // Build calendar weeks and month labels
  const { ghWeeks, lcWeeks, monthLabels, busiestGh, busiestLc } = useMemo(() => {
    if (!ghDays || ghDays.length === 0) {
      return { ghWeeks: [], lcWeeks: [], monthLabels: [], busiestGh: null, busiestLc: null };
    }

    const lcDateMap = new Map<string, number>();
    for (const [timestamp, count] of Object.entries(lcCalendar)) {
      const d = new Date(parseInt(timestamp) * 1000);
      const dateStr = d.toISOString().split("T")[0];
      lcDateMap.set(dateStr, count);
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
    let bLc = { date: "", count: 0 };

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
      if (lcCount > bLc.count) {
        bLc = { date: day.date, count: lcCount };
      }

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
      busiestLc: bLc
    };
  }, [ghDays, lcCalendar]);

  const handleMonthClick = (monthIndex: number) => {
    setHighlightedMonth(monthIndex);
    setTimeout(() => {
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

  const getDayMonth = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00Z").getUTCMonth();
  };

  const isCellHighlighted = (day: ContributionDay) => {
    if (highlightedMonth !== null) {
      return getDayMonth(day.date) === highlightedMonth;
    }
    return false;
  };

  const isCellDimmed = (day: ContributionDay) => {
    if (highlightedMonth !== null) {
      return getDayMonth(day.date) !== highlightedMonth;
    }
    if (hoveredLevel !== null) {
      return day.level !== hoveredLevel;
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

  const renderHeatmap = (weeks: ContributionDay[][], platform: "github" | "leetcode") => (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="inline-block min-w-[720px]">
        {/* Month labels */}
        <div className="flex h-4 mb-2 pl-6 text-[10px] font-mono text-[var(--ink-muted)]">
          {monthLabels.map((mInfo, idx) => (
            <button
              key={idx}
              onClick={() => handleMonthClick(mInfo.monthIndex)}
              className={`transition-colors cursor-pointer hover:text-[var(--accent)] ${
                highlightedMonth === mInfo.monthIndex ? "text-[var(--accent)] font-bold underline" : ""
              }`}
              style={{
                marginLeft: idx === 0 ? `${mInfo.colIndex * 13}px` : undefined,
                marginRight: idx < monthLabels.length - 1 ? `${(monthLabels[idx + 1].colIndex - mInfo.colIndex) * 13 - 22}px` : undefined,
              }}
              title="Click to highlight month"
            >
              {mInfo.label}
            </button>
          ))}
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

                return (
                  <div
                    key={dIdx}
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: formatTooltip(day, platform),
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onFocus={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        text: formatTooltip(day, platform),
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onBlur={() => setTooltip(null)}
                    className={`w-[10px] h-[10px] rounded-[1px] transition-all duration-150 cursor-pointer ${
                      intensityClasses[day.level] || intensityClasses[0]
                    } ${
                      highlighted ? "ring-2 ring-[var(--accent)] scale-125 z-10" : ""
                    } ${dimmed ? "opacity-25" : "opacity-100"} focus-visible:outline-2 focus-visible:outline-[var(--accent)]`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-[11px] font-mono text-[var(--ink-muted)]">
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
  );

  return (
    <section
      id="activity"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-mono text-xs uppercase tracking-[0.06em]">
              <span className="text-[var(--accent)] font-semibold">{activityContent.eyebrow}</span>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {ghTotal} Commits · {lcTotalSubmissions} Submissions
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink)]">
            {activityContent.heading}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {activityContent.intro}
          </p>

          {/* Section Divider Line with Classic Editorial Accent Rule */}
          <div className="pt-6 relative">
            <m.div
              variants={ruleDrawVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-[1px] w-full bg-[var(--rule)]"
            />
            <div className="absolute left-0 bottom-0 h-[2px] w-12 bg-[var(--accent)] z-10" />
          </div>
        </div>

        {/* Screen Reader Accessible Summary */}
        <div className="sr-only">
          {activityContent.summarySrOnly
            .replace("{n}", String(ghTotal + lcTotalSubmissions))
            .replace("{busiestDate}", busiestGh?.date || "")
            .replace("{busiestCount}", String(busiestGh?.count || 0))}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 mb-8 border-b border-[var(--rule)] pb-4">
          <button
            onClick={() => setPlatformView("all")}
            className={`font-mono text-xs px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer ${
              platformView === "all"
                ? "bg-[var(--accent)] text-white font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            }`}
          >
            All activity
          </button>
          <button
            onClick={() => setPlatformView("github")}
            className={`font-mono text-xs px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5 ${
              platformView === "github"
                ? "bg-[var(--accent)] text-white font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            GitHub ({ghTotal})
          </button>
          <button
            onClick={() => setPlatformView("leetcode")}
            className={`font-mono text-xs px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5 ${
              platformView === "leetcode"
                ? "bg-[var(--accent)] text-white font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            LeetCode ({lcTotalSubmissions})
          </button>
        </div>

        {/* Activity Panels */}
        <div className="space-y-8">
          {/* GitHub Panel */}
          {(platformView === "all" || platformView === "github") && (
            <m.div
              variants={revealVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--rule)]">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)]">
                    {activityContent.github.title.replace("{n}", String(ghTotal))}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] mt-0.5">
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
          {(platformView === "all" || platformView === "leetcode") && (
            <m.div
              variants={revealVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--rule)]">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[var(--ink)]">
                    {activityContent.leetcode.title
                      .replace("{n}", String(lcTotalSubmissions))
                      .replace("{d}", String(lcActiveDays))}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] mt-0.5">
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
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="pointer-events-none z-50 bg-[#111315] text-white px-2.5 py-1 rounded-[4px] font-mono text-[11px] shadow-lg whitespace-nowrap border border-white/10"
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { m, useReducedMotion } from "motion/react";
import { ExternalLink, RotateCcw } from "lucide-react";
import { activityContent } from "@/content/activity";
import rawGithub from "@/content/github-contributions.json";
import { Section } from "./Section";
import { useCountUp } from "@/lib/count-up";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface TooltipData {
  text: string;
  x: number;
  y: number;
}

const ghDays: ContributionDay[] = (rawGithub?.contributions as ContributionDay[]) ?? [];

export function CommitLogSection() {
  const [highlightedMonth, setHighlightedMonth] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const prefersReducedMotion = useReducedMotion();
  const monthTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Map to hold references to individual tile elements for roving tabindex focus
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // GitHub contributions total
  const ghTotal = rawGithub?.total?.lastYear ?? 0;

  const { displayValue: ghDisplay, ref: ghCountRef } = useCountUp({
    end: ghTotal,
    decimals: 0,
    duration: 1.2,
    triggerKey: replayKey,
  });

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

  const totalWeeks = ghWeeks.length;

  // Single focused coordinate for roving tabindex (defaults to most recent day: bottom-right)
  const [focusedCoord, setFocusedCoord] = useState<{ col: number; row: number }>(() => {
    const lastCol = Math.max(0, totalWeeks - 1);
    const lastRow = ghWeeks[lastCol] ? Math.max(0, ghWeeks[lastCol].length - 1) : 0;
    return { col: lastCol, row: lastRow };
  });

  useEffect(() => {
    return () => {
      if (monthTimerRef.current) clearTimeout(monthTimerRef.current);
    };
  }, []);

  const handleMonthClick = (monthIndex: number) => {
    if (monthTimerRef.current) clearTimeout(monthTimerRef.current);
    setHighlightedMonth(monthIndex);
    monthTimerRef.current = setTimeout(() => {
      setHighlightedMonth(null);
    }, 2000);
  };

  const formatContributionTooltip = useCallback((count: number, dateStr: string): string => {
    const d = new Date(dateStr + "T00:00:00Z");
    const formattedDate = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (count === 0) {
      return activityContent.tooltipZero.replace("{date}", formattedDate);
    }
    if (count === 1) {
      return activityContent.tooltipSingular
        .replace("{count}", "1")
        .replace("{date}", formattedDate);
    }
    return activityContent.tooltipFormat
      .replace("{count}", String(count))
      .replace("{date}", formattedDate);
  }, []);

  const showTooltip = useCallback((day: ContributionDay, targetEl: HTMLElement) => {
    const rect = targetEl.getBoundingClientRect();
    const rawX = rect.left + rect.width / 2;
    const rawY = rect.top;
    const clampedX = Math.max(100, Math.min(window.innerWidth - 100, rawX));
    setTooltip({
      text: formatContributionTooltip(day.count, day.date),
      x: clampedX,
      y: rawY,
    });
  }, [formatContributionTooltip]);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleReplay = (e: React.MouseEvent) => {
    e.preventDefault();
    setReplayKey((k) => k + 1);
  };

  // Keyboard navigation for roving tabindex within the 2D grid
  const handleGridKeyDown = (e: React.KeyboardEvent, col: number, row: number) => {
    let nextCol = col;
    let nextRow = row;
    let handled = false;

    switch (e.key) {
      case "ArrowLeft":
        nextCol = Math.max(0, col - 1);
        handled = true;
        break;
      case "ArrowRight":
        nextCol = Math.min(totalWeeks - 1, col + 1);
        handled = true;
        break;
      case "ArrowUp":
        nextRow = Math.max(0, row - 1);
        handled = true;
        break;
      case "ArrowDown":
        const maxRowInCol = (ghWeeks[col]?.length ?? 7) - 1;
        nextRow = Math.min(maxRowInCol, row + 1);
        handled = true;
        break;
      case "Home":
        nextCol = 0;
        handled = true;
        break;
      case "End":
        nextCol = totalWeeks - 1;
        handled = true;
        break;
      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      const targetMaxRow = (ghWeeks[nextCol]?.length ?? 7) - 1;
      const clampedRow = Math.min(targetMaxRow, nextRow);

      setFocusedCoord({ col: nextCol, row: clampedRow });
      const cellEl = cellRefs.current.get(`${nextCol}-${clampedRow}`);
      if (cellEl) {
        cellEl.focus();
      }
    }
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

  const renderHeatmap = () => (
    <div className="overflow-x-auto pb-3 pt-1 scrollbar-none w-full min-w-0 max-w-full">
      <div className="inline-block min-w-[720px]">
        {/* Month labels */}
        <div className="flex h-4 mb-2 pl-6 text-[10px] font-mono text-[var(--ink-muted)]">
          {monthLabels.map((mInfo, idx) => {
            const isMonthActive = highlightedMonth === mInfo.monthIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleMonthClick(mInfo.monthIndex)}
                className={`transition-colors cursor-pointer hover:text-[var(--accent)] focus-visible:outline-none focus-visible:underline ${
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

        {/* Straight Heatmap Grid with Roving Tabindex */}
        <div
          key={replayKey}
          role="grid"
          aria-label="GitHub contribution calendar"
          className="flex gap-[3.5px] py-2"
        >
          {/* Day labels (Mon, Wed, Fri) */}
          <div
            aria-hidden="true"
            className="flex flex-col justify-between text-[9px] font-mono text-[var(--ink-muted)] pr-1.5 h-[98px] leading-[11px] select-none"
          >
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 53 Weeks Columns: Wave moves Left to Right */}
          {ghWeeks.map((week, wIdx) => {
            // Constant 1.5s total duration math:
            // Column wave spans 1.30s across totalWeeks - 1 columns
            // Row stagger inside each column spans 0.02s
            // Each square animation lasts 0.20s -> total time = 1.30 + 0.02 + 0.20 = 1.52s (~1.5s)
            const colDelaySec = (wIdx / Math.max(1, totalWeeks - 1)) * 1.3;

            return (
              <div
                key={wIdx}
                role="row"
                className="flex flex-col gap-[3.5px] relative"
              >
                {week.map((day, dIdx) => {
                  const isCellFocused = focusedCoord.col === wIdx && focusedCoord.row === dIdx;
                  const highlighted = isCellHighlighted(day);
                  const isHoverDimmed = hoveredLevel !== null && day.level !== hoveredLevel;
                  const rowDelaySec = (dIdx / 6) * 0.02;
                  const totalDelaySec = colDelaySec + rowDelaySec;

                  const tileKey = `${wIdx}-${dIdx}`;

                  return (
                    <div
                      key={dIdx}
                      ref={(el) => {
                        if (el) {
                          cellRefs.current.set(tileKey, el);
                        } else {
                          cellRefs.current.delete(tileKey);
                        }
                      }}
                      role="gridcell"
                      tabIndex={isCellFocused ? 0 : -1}
                      aria-selected={isCellFocused}
                      aria-label={formatContributionTooltip(day.count, day.date)}
                      onMouseEnter={(e) => showTooltip(day, e.currentTarget)}
                      onMouseLeave={hideTooltip}
                      onFocus={(e) => {
                        setFocusedCoord({ col: wIdx, row: dIdx });
                        showTooltip(day, e.currentTarget);
                      }}
                      onBlur={hideTooltip}
                      onKeyDown={(e) => handleGridKeyDown(e, wIdx, dIdx)}
                      style={{
                        animationDelay:
                          hasEnteredView && !prefersReducedMotion
                            ? `${totalDelaySec.toFixed(3)}s`
                            : undefined,
                      }}
                      className={`w-[11px] h-[11px] rounded-[2px] cursor-pointer select-none relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:z-30 ${
                        boxDepthClasses[day.level] || boxDepthClasses[0]
                      } ${
                        hasEnteredView && !prefersReducedMotion
                          ? "heatmap-tile-fill"
                          : prefersReducedMotion
                          ? "opacity-100 scale-100"
                          : "opacity-15 scale-[0.65]"
                      } ${
                        highlighted
                          ? "ring-1.5 ring-[var(--accent)] scale-110 z-10"
                          : ""
                      } ${
                        isHoverDimmed ? "opacity-25" : ""
                      } hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.45)]`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-[11px] font-mono text-[var(--ink-muted)]">
          <div className="text-[var(--ink-muted)] text-[10px]">
            <span>{ghTotal} contributions across {totalWeeks} weeks</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span>{activityContent.legend.split("·")[0]?.trim() || "Less"}</span>
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
            <span>{activityContent.legend.split("·")[1]?.trim() || "More"}</span>
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

      {/* Heatmap Panel */}
      <div className="w-full min-w-0 max-w-full">
        <m.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          onViewportEnter={() => setHasEnteredView(true)}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 p-5 sm:p-6 w-full min-w-0 max-w-full overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--rule)]">
            <div>
              <h3
                ref={ghCountRef as React.RefObject<HTMLHeadingElement>}
                aria-label={activityContent.github.title.replace("{n}", String(ghTotal))}
                className="font-serif text-xl font-semibold text-[var(--ink)]"
              >
                <span aria-hidden="true">
                  <span className="tabular-nums">{ghDisplay}</span>{" "}
                  {activityContent.github.title.replace("{n} ", "").replace("{n}", "")}
                </span>
              </h3>
              <p className="font-sans text-sm text-[var(--ink-muted)] leading-[1.65] mt-1">
                {activityContent.github.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Prominent Replay Button */}
              {!prefersReducedMotion && (
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[var(--accent)]/40 hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-xs font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                  title="Replay activity heatmap animation"
                >
                  <RotateCcw size={12} className="text-[var(--accent)]" />
                  <span>{replayKey > 0 ? activityContent.replayAgain : activityContent.replay}</span>
                </button>
              )}

              <a
                href="https://github.com/Kartikk-git"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1"
              >
                {activityContent.github.source}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {renderHeatmap()}

          <div className="mt-4 pt-3 border-t border-[var(--rule)]/40 font-mono text-[11px] text-[var(--ink-muted)]">
            {activityContent.github.footer}
          </div>
        </m.div>
      </div>

      {/* Shared Tooltip: never clipped by overflow container or viewport edges */}
      {tooltip && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%) translateY(-8px)",
            zIndex: 60,
          }}
          className="pointer-events-none font-mono text-xs px-2.5 py-1 rounded-[4px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] shadow-[0_2px_8px_rgba(0,0,0,0.12)] whitespace-nowrap select-none"
        >
          {tooltip.text}
        </div>
      )}
    </Section>
  );
}

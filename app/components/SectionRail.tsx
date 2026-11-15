"use client";

import React, { useEffect, useState } from "react";
import { m, useScroll, useSpring, useReducedMotion } from "motion/react";
import { railContent, type RailItem } from "@/content/rail";
import { useActiveSection } from "@/lib/active-section";
import { startViewTransition, viewTransitionsEnabled } from "@/lib/view-transition";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

export function SectionRail() {
  const { activeSection, setActiveSection } = useActiveSection();
  const prefersReduced = useReducedMotion();
  const [percent, setPercent] = useState(0);

  // Scroll progress for vertical track fill
  const { scrollYProgress } = useScroll();

  // Spring smoothing for the accent progress line, disabled under reduced motion
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    mass: 1,
    restDelta: 0.001,
  });

  const fillScaleY = prefersReduced ? scrollYProgress : springProgress;

  // Track live scroll percentage for the bottom "assembleDebug XX%" label
  useEffect(() => {
    setPercent(Math.min(100, Math.max(0, Math.round(scrollYProgress.get() * 100))));
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setPercent(Math.min(100, Math.max(0, Math.round(latest * 100))));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Active section detection using IntersectionObserver on section IDs
  useEffect(() => {
    const sectionIds = railContent.items.map((it) => it.id);
    const visibleHeights = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleHeights.set(entry.target.id, entry.intersectionRect.height);
          } else {
            visibleHeights.delete(entry.target.id);
          }
        });

        if (visibleHeights.size > 0) {
          let mostVisibleId = "";
          let highestVisible = -1;
          visibleHeights.forEach((height, id) => {
            if (height > highestVisible) {
              highestVisible = height;
              mostVisibleId = id;
            }
          });
          if (mostVisibleId) {
            setActiveSection(mostVisibleId);
          }
        }
      },
      {
        // Viewport detection window focused in the central reading zone
        rootMargin: "-15% 0px -40% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    const observeAll = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    observeAll();

    // Re-check after 1.5s in case below-the-fold dynamic elements mounted
    const timer = setTimeout(observeAll, 1500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [setActiveSection]);

  // Smooth scroll handler with View Transitions API integration
  const handleItemClick = (e: React.MouseEvent, item: RailItem) => {
    e.preventDefault();
    const element = document.getElementById(item.id);
    if (!element) return;

    setActiveSection(item.id);

    const isReduced = prefersReducedMotion();
    if (viewTransitionsEnabled(isReduced)) {
      startViewTransition(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        element.focus({ preventScroll: true });
        window.history.replaceState(null, "", `#${item.id}`);
      });
    } else {
      element.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "start" });
      element.focus({ preventScroll: true });
      window.history.replaceState(null, "", `#${item.id}`);
    }
  };

  return (
    <nav
      aria-label={railContent.ariaLabel}
      className="hidden xl:flex fixed top-1/2 -translate-y-1/2 z-rail flex-col items-start select-none pointer-events-auto left-[3px] min-[1360px]:left-[calc(50vw-560px-96px)] min-[1440px]:left-[calc(50vw-560px-110px)] 2xl:left-[calc(50vw-560px-120px)] w-[68px] min-[1360px]:w-[80px] 2xl:w-[90px]"
    >
      {/* 7-Dot Vertical Navigation Track: compact gap-7.5 (30px) at 1280-1535px, gap-9 (36px) at >=1536px */}
      <div className="relative flex flex-col gap-[30px] 2xl:gap-[36px] py-1.5 w-full">
        {/* Background Track Line: 2px wide, centered behind 12px dot bounds at left 5px */}
        <div
          className="absolute left-[5px] top-2.5 bottom-2.5 w-[2px] bg-[var(--rule)]"
          aria-hidden="true"
        />

        {/* Accent Fill Line: 2px wide linked to page scroll */}
        <m.div
          style={{ scaleY: fillScaleY, transformOrigin: "top" }}
          className="absolute left-[5px] top-2.5 bottom-2.5 w-[2px] bg-[var(--accent)] z-0"
          aria-hidden="true"
        />

        {/* Section Dots & Index Numbers */}
        {railContent.items.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={(e) => handleItemClick(e, item)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${item.index} ${item.name}`}
              className="group relative flex items-center gap-2 2xl:gap-2.5 text-left min-w-[40px] min-h-[28px] py-0.5 -my-0.5 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded-[2px] cursor-pointer"
            >
              {/* Centering bounds for dot (12px wide) so 8px inactive and 11px active dots share the same 2px line center */}
              <div className="relative z-10 w-[12px] h-[12px] flex items-center justify-center shrink-0">
                <div
                  className={`rounded-full transition-all duration-200 shrink-0 ${
                    isActive
                      ? prefersReduced
                        ? "w-[11px] h-[11px] bg-[var(--accent)] ring-2 ring-[var(--accent)]/40"
                        : "w-[11px] h-[11px] bg-[var(--accent)] ring-2 ring-[var(--accent)]/40 shadow-[0_0_8px_rgba(95,179,143,0.7)]"
                      : "w-[8px] h-[8px] border-[1.5px] border-[var(--ink-faint)] bg-[var(--paper)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-tint)]"
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* Mono Index Number: 12px at 1280-1535px, 13px at >=1536px; hidden at exactly 1280px (<1360px) to prevent column overlap */}
              <span
                className={`font-mono text-[12px] 2xl:text-[13px] font-medium tracking-tight transition-colors duration-200 select-none hidden min-[1360px]:inline ${
                  isActive
                    ? "text-[var(--ink)] font-bold"
                    : "text-[var(--ink-muted)] group-hover:text-[var(--ink)]"
                }`}
              >
                {item.index}
              </span>

              {/* Hover / Focus Section Label: 13px mono, solid --surface background, 1px --rule border */}
              <span
                role="tooltip"
                className="absolute left-full ml-3 px-2.5 py-1 rounded-[3px] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink)] font-mono text-[13px] font-medium leading-normal whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 pointer-events-none z-50"
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Build Telemetry: assembleDebug in full at 9-12px mono, percentage at 13-15px bold in --accent */}
      <div className="pt-2 mt-1 border-t border-[var(--rule-subtle)] font-mono flex flex-col items-start leading-tight select-none">
        <span className="text-[9px] min-[1360px]:text-[11px] 2xl:text-[12px] font-medium text-[var(--ink-muted)] whitespace-nowrap tracking-[-0.03em] min-[1360px]:tracking-tight">
          {railContent.buildStatus}
        </span>
        <span className="text-[12.5px] min-[1360px]:text-[14px] 2xl:text-[15px] font-bold text-[var(--accent)] tracking-tight mt-0.5 tabular-nums">
          {percent}%
        </span>
      </div>
    </nav>
  );
}

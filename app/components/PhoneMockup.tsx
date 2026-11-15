"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { phoneContent } from "@/content/phone";
import { useActiveSection } from "@/lib/active-section";
import { usePhoneState } from "@/lib/phone-state";
import { MOTION_TOKENS } from "@/lib/motion";

import { ProjectsScreen } from "./phone-screens/ProjectsScreen";
import { AboutScreen } from "./phone-screens/AboutScreen";
import { CommitLogScreen } from "./phone-screens/CommitLogScreen";
import { SkillsScreen } from "./phone-screens/SkillsScreen";
import { ExperienceScreen } from "./phone-screens/ExperienceScreen";
import { CredentialsScreen } from "./phone-screens/CredentialsScreen";
import { ContactScreen } from "./phone-screens/ContactScreen";

const SECTIONS = [
  "projects",
  "about",
  "activity",
  "skills",
  "experience",
  "education",
  "contact",
] as const;

/**
 * Screen switcher displaying the active section's phone view with crossfade & slide transition.
 * Includes a 7-dot page indicator above the gesture bar.
 */
function PhoneScreenSwitcher({ isDialog = false }: { isDialog?: boolean }) {
  const { activeSection } = useActiveSection();
  const prefersReduced = useReducedMotion();

  // If active section is not one of the 7 (e.g. at the very top before sections register), default to projects
  const currentSection = (SECTIONS as readonly string[]).includes(activeSection)
    ? activeSection
    : "projects";

  const renderScreen = (section: string) => {
    switch (section) {
      case "about":
        return <AboutScreen />;
      case "activity":
        return <CommitLogScreen />;
      case "skills":
        return <SkillsScreen />;
      case "experience":
        return <ExperienceScreen />;
      case "education":
        return <CredentialsScreen />;
      case "contact":
        return <ContactScreen isInteractive={isDialog} />;
      case "projects":
      default:
        return <ProjectsScreen />;
    }
  };

  return (
    <div className="relative flex flex-col h-full justify-between">
      {/* Screen Area with AnimatePresence */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={currentSection}
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: 16 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: -16 }
            }
            transition={{
              duration: prefersReduced ? 0.12 : 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-full w-full"
          >
            {renderScreen(currentSection)}
          </m.div>
        </AnimatePresence>
      </div>

      {/* 7-Dot Page Indicator above gesture bar */}
      <div className="py-1 flex items-center justify-center gap-1.5 shrink-0 z-10 select-none">
        {SECTIONS.map((sec) => {
          const isActive = currentSection === sec;
          return (
            <div
              key={sec}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-3 h-1.5 bg-[var(--accent)]"
                  : "w-1.5 h-1.5 bg-[var(--rule)]"
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Modern Android Phone Frame
 * - Aspect ratio 280:580
 * - Rounded corners (28px radius)
 * - Thin bezel in --rule
 * - Punch-hole camera at top center
 * - Status bar (time, signal, battery) in IBM Plex Mono
 * - Bottom gesture bar
 * - Subtle --accent outer glow
 */
export function PhoneFrame({
  children,
  className = "",
  style,
  isDialog = false,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isDialog?: boolean;
}) {
  return (
    <div
      aria-hidden={isDialog ? undefined : "true"}
      style={style}
      className={`relative aspect-[280/580] rounded-[28px] border-[1.5px] border-[var(--rule)] bg-[var(--paper)] p-2 shadow-[0_0_24px_rgba(95,179,143,0.12)] flex flex-col justify-between overflow-hidden select-none ${className}`}
    >
      {/* Outer subtle edge shine */}
      <div className="absolute inset-0 rounded-[26px] pointer-events-none border border-white/5" />

      {/* Inner Screen Area: rounded corners, --surface background */}
      <div className="relative flex-1 rounded-[20px] bg-[var(--surface)] overflow-hidden flex flex-col border border-[var(--rule-subtle)]/40">
        {/* Status Bar: Time, Punch-hole, Signal/Battery */}
        <div className="h-6 px-3 pt-1.5 flex items-center justify-between shrink-0 select-none z-10">
          {/* Time in Mono */}
          <span className="font-mono text-[9px] font-medium text-[var(--ink-muted)] tracking-tight">
            {phoneContent.statusTime}
          </span>

          {/* Punch-hole camera in top center */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#0c0d10] border border-[var(--rule-subtle)] shrink-0" />

          {/* Signal & Battery */}
          <div className="flex items-center gap-1.5 text-[var(--ink-muted)]">
            {/* 4 Signal bars */}
            <div className="flex items-end gap-[1px] h-2">
              <span className="w-[1.5px] h-[2.5px] bg-[var(--ink-muted)] rounded-[0.5px]" />
              <span className="w-[1.5px] h-[4px] bg-[var(--ink-muted)] rounded-[0.5px]" />
              <span className="w-[1.5px] h-[5.5px] bg-[var(--ink-muted)] rounded-[0.5px]" />
              <span className="w-[1.5px] h-[7px] bg-[var(--ink-muted)] rounded-[0.5px]" />
            </div>

            {/* Battery icon */}
            <div className="flex items-center">
              <div className="w-3.5 h-2 rounded-[2px] border border-[var(--ink-muted)] p-[1px] flex items-center">
                <div className="h-full w-[80%] bg-[var(--accent)] rounded-[1px]" />
              </div>
              <div className="w-[1px] h-1 bg-[var(--ink-muted)] rounded-r-[0.5px]" />
            </div>
          </div>
        </div>

        {/* Screen Content Area */}
        <div className="flex-1 overflow-hidden">
          {children || <PhoneScreenSwitcher isDialog={isDialog} />}
        </div>

        {/* Bottom Gesture Navigation Bar */}
        <div className="h-3 flex items-center justify-center shrink-0">
          <div className="w-14 h-1 rounded-full bg-[var(--rule)]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable <PhoneMockup /> component:
 * - Hidden by default. Opens ONLY via the Hero Android companion bot.
 * - At >=1600px: Fixed element in right gutter, vertically centered, with visible close button and Esc support.
 * - Below 1600px: Opens in a dialog popover with visible close button, Esc, and backdrop click.
 * - If open when scrolling down, it STAYS OPEN and continues to follow all 7 sections dynamically.
 */
export function PhoneMockup() {
  const { isOpen, closePhone } = usePhoneState();
  const prefersReduced = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus trap / restore for popover dialog mode (<1600px)
  useEffect(() => {
    if (isOpen) {
      // Only lock body scroll if in modal/dialog viewport (<1600px)
      if (typeof window !== "undefined" && window.innerWidth < 1600) {
        document.body.style.overflow = "hidden";
      }
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      // Return focus to the Hero bot if it was previously open
      if (prevOpenRef.current) {
        document.getElementById("hero-bot-trigger")?.focus();
      }
    }
    prevOpenRef.current = isOpen;
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Global dismiss on Escape key (works for both desktop gutter and popover mode)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePhone();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePhone]);

  return (
    <>
      {/* 1. Desktop Fixed Gutter Phone (>=1600px) */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            id="phone-mockup-frame"
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: 80, scale: 0.96 }
            }
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: 80, scale: 0.96 }
            }
            transition={{
              duration: prefersReduced ? MOTION_TOKENS.duration.fast : 0.4,
              ease: MOTION_TOKENS.ease.standard,
            }}
            style={{
              width: "clamp(200px, calc((100vw - 1120px) / 2 - 56px), 260px)",
              right: "max(24px, calc((50vw - 560px - clamp(200px, calc((100vw - 1120px) / 2 - 56px), 260px)) / 2))",
            }}
            className="hidden min-[1600px]:block fixed top-1/2 -translate-y-1/2 z-phone-gutter pointer-events-auto"
          >
            {/* Visible Close Button for Desktop Fixed Mode */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closePhone();
              }}
              aria-label={phoneContent.botCloseAria}
              className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center cursor-pointer transition-colors shadow-md z-40 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <PhoneFrame isDialog={false} />
          </m.div>
        )}
      </AnimatePresence>

      {/* 2. Popover Dialog for <1600px viewports (portaled to document.body) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={phoneContent.dialogTitle}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.target === e.currentTarget) closePhone();
                }}
                className="min-[1600px]:hidden fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
              >
                <m.div
                  id="phone-mockup-dialog-frame"
                  initial={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: 16 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: 16 }
                  }
                  transition={{
                    duration: prefersReduced ? MOTION_TOKENS.duration.fast : 0.35,
                    ease: MOTION_TOKENS.ease.standard,
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* Popover Close Button */}
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closePhone();
                    }}
                    aria-label={phoneContent.botCloseAria}
                    className="absolute -top-11 right-0 sm:-right-12 sm:top-0 w-9 h-9 rounded-full bg-[var(--surface)] text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--accent)] hover:text-[var(--accent)] flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>

                  {/* Modal Phone Frame at 260px width */}
                  <PhoneFrame className="w-[260px] shadow-2xl pointer-events-auto" isDialog={true} />
                </m.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

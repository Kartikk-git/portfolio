"use client";

import React, { useEffect, useState, useRef } from "react";
import { markFound } from "@/lib/secrets";

const HINTS = [
  "try the arrow keys",
  "the theme button is more fun than it looks",
  "click my name a few times",
];

export function FooterBugdroid() {
  const [inView, setInView] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isDancing, setIsDancing] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Observe footer with IntersectionObserver
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Rotate sign hints every 4.5 seconds when in view
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [inView]);

  const handleTrigger = (e: React.SyntheticEvent) => {
    // Ignore if typing in input
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox")
    ) {
      return;
    }

    // Trigger egg discovery
    markFound("bugdroid");

    if (!isDancing) {
      setIsDancing(true);
      setTimeout(() => {
        setIsDancing(false);
      }, 1200);
    }
  };

  return (
    <div
      className={`fixed bottom-0 right-4 sm:right-8 z-30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inView
          ? prefersReducedMotion
            ? "opacity-100"
            : "translate-y-0 opacity-100"
          : prefersReducedMotion
          ? "opacity-0 pointer-events-none"
          : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Friendly Bugdroid mascot. Press Enter or click to make it dance."
        onClick={handleTrigger}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTrigger(e);
          }
        }}
        className={`group relative flex flex-col items-center cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-4 rounded-[4px] ${
          isDancing && !prefersReducedMotion ? "animate-[bugdroid-dance_1.2s_ease-in-out]" : ""
        }`}
      >
        {/* Held Sign with Rotating Hint */}
        <div className="relative mb-1 max-w-[210px] bg-[var(--surface)] text-[var(--ink)] border border-[var(--accent)]/50 rounded-[4px] px-2.5 py-1 text-[11px] font-mono shadow-md text-center leading-snug">
          <span>{HINTS[hintIndex]}</span>
          {/* Sign pole */}
          <div className="absolute left-1/2 -bottom-1.5 w-0.5 h-1.5 bg-[var(--accent)] -translate-x-1/2" />
        </div>

        {/* Mascot Robot Inline SVG */}
        <div className="relative w-14 h-14 transition-transform duration-200 group-hover:scale-105">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            {/* Antennae */}
            <line
              x1="22"
              y1="16"
              x2="17"
              y2="9"
              stroke="#5FB38F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="16" cy="8" r="1.5" fill="#5FB38F" />

            <line
              x1="42"
              y1="16"
              x2="47"
              y2="9"
              stroke="#5FB38F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="48" cy="8" r="1.5" fill="#5FB38F" />

            {/* Dome Head */}
            <path
              d="M18 24C18 16.268 24.268 10 32 10C39.732 10 46 16.268 46 24H18Z"
              fill="#5FB38F"
            />

            {/* Eyes */}
            <circle cx="26" cy="18" r="2" fill="var(--paper)" />
            <circle cx="38" cy="18" r="2" fill="var(--paper)" />

            {/* Body */}
            <rect
              x="18"
              y="26"
              width="28"
              height="24"
              rx="4"
              fill="#5FB38F"
            />

            {/* Left Arm (Resting) */}
            <rect
              x="12"
              y="28"
              width="4"
              height="16"
              rx="2"
              fill="#5FB38F"
            />

            {/* Right Arm (Waving / Holding Sign) */}
            <g className={prefersReducedMotion ? "" : "origin-[48px_28px] animate-[bugdroid-wave_2.5s_ease-in-out_infinite]"}>
              <rect
                x="48"
                y="20"
                width="4"
                height="16"
                rx="2"
                transform="rotate(-25 48 20)"
                fill="#5FB38F"
              />
            </g>

            {/* Stubby Legs */}
            <rect x="23" y="50" width="4.5" height="9" rx="2" fill="#5FB38F" />
            <rect x="36.5" y="50" width="4.5" height="9" rx="2" fill="#5FB38F" />
          </svg>
        </div>
      </div>
    </div>
  );
}

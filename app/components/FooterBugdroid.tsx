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
          isDancing && !prefersReducedMotion ? "bugdroid-dancing" : ""
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
            {/* Head Group (Dome Head + Antennae + Eyes) with subtle friendly tilt */}
            <g transform="translate(32, 24)">
              <g className={prefersReducedMotion ? "" : "bugdroid-nodding-head"}>
                {/* Antennae */}
                <line
                  x1="-10"
                  y1="-8"
                  x2="-15"
                  y2="-15"
                  stroke="#5FB38F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="-16" cy="-16" r="1.5" fill="#5FB38F" />

                <line
                  x1="10"
                  y1="-8"
                  x2="15"
                  y2="-15"
                  stroke="#5FB38F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="16" cy="-16" r="1.5" fill="#5FB38F" />

                {/* Dome Head */}
                <path
                  d="M-14 0C-14 -7.732 -7.732 -14 0 -14C7.732 -14 14 -7.732 14 0H-14Z"
                  fill="#5FB38F"
                />

                {/* Eyes */}
                <circle cx="-6" cy="-6" r="2" fill="var(--paper)" />
                <circle cx="6" cy="-6" r="2" fill="var(--paper)" />
              </g>
            </g>

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

            {/* Right Arm: Natural waving animation at user */}
            <g transform="translate(48, 28)">
              <g className={prefersReducedMotion ? "" : "bugdroid-waving-arm"}>
                <rect
                  x="-2"
                  y="-14"
                  width="4"
                  height="15"
                  rx="2"
                  fill="#5FB38F"
                />
                <circle cx="0" cy="-14" r="2.2" fill="#5FB38F" />
              </g>
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


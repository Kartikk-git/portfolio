"use client";

import React from "react";

export interface BugdroidSvgProps {
  className?: string;
  isWaving?: boolean;
  isNodding?: boolean;
  prefersReduced?: boolean;
}

/**
 * Reusable Bugdroid mascot SVG artwork.
 * Matches the canonical Android bot visual identity.
 */
export function BugdroidSvg({
  className = "w-14 h-14",
  isWaving = true,
  isNodding = true,
  prefersReduced = false,
}: BugdroidSvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-sm select-none`}
      aria-hidden="true"
    >
      {/* Head Group (Dome Head + Antennae + Eyes) with friendly tilt */}
      <g transform="translate(32, 24)">
        <g className={!prefersReduced && isNodding ? "bugdroid-nodding-head" : ""}>
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
      <rect x="18" y="26" width="28" height="24" rx="4" fill="#5FB38F" />

      {/* Left Arm (Resting) */}
      <rect x="12" y="28" width="4" height="16" rx="2" fill="#5FB38F" />

      {/* Right Arm: Natural waving animation at user */}
      <g transform="translate(48, 28)">
        <g className={!prefersReduced && isWaving ? "bugdroid-waving-arm" : ""}>
          <rect x="-2" y="-14" width="4" height="15" rx="2" fill="#5FB38F" />
          <circle cx="0" cy="-14" r="2.2" fill="#5FB38F" />
        </g>
      </g>

      {/* Stubby Legs */}
      <rect x="23" y="50" width="4.5" height="9" rx="2" fill="#5FB38F" />
      <rect x="36.5" y="50" width="4.5" height="9" rx="2" fill="#5FB38F" />
    </svg>
  );
}


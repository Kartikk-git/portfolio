"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Terminal, RotateCcw, Smartphone, Sparkles, X } from "lucide-react";
import { markFound } from "@/lib/secrets";

interface EraTheme {
  id: "holo" | "lollipop" | "material-you";
  name: string;
  version: string;
  toastText: string;
  accentColor: string;
  variables: Record<string, string>;
}

const ANDROID_ERAS: EraTheme[] = [
  {
    id: "holo",
    name: "Android 4.0 Holo",
    version: "4.0 KitKat / ICS",
    toastText: "Flashing Android 4.0 Holo... done",
    accentColor: "#33B5E5",
    variables: {
      "--paper": "#090D12",
      "--surface": "#101620",
      "--surface-subtle": "#0C1118",
      "--rule": "#1B2A3D",
      "--rule-subtle": "#14202E",
      "--ink": "#F0F6FC",
      "--ink-muted": "#7E93A8",
      "--ink-faint": "#546678",
      "--accent": "#33B5E5",
      "--accent-hover": "#50C4EF",
      "--accent-soft": "#2894BC",
      "--accent-muted": "#1D6E8C",
      "--accent-tint": "rgba(51, 181, 229, 0.15)",
      "--accent-border": "rgba(51, 181, 229, 0.4)",
      "--shadow-subtle": "0 1px 3px rgba(0, 0, 0, 0.6)",
    },
  },
  {
    id: "lollipop",
    name: "Android 5.0 Lollipop",
    version: "5.0 Material 1.0",
    toastText: "Flashing Android 5.0 Lollipop... done",
    accentColor: "#00BFA5",
    variables: {
      "--paper": "#1D232A",
      "--surface": "#263238",
      "--surface-subtle": "#212B30",
      "--rule": "#37474F",
      "--rule-subtle": "#2E3C43",
      "--ink": "#ECEFF1",
      "--ink-muted": "#B0BEC5",
      "--ink-faint": "#78909C",
      "--accent": "#00BFA5",
      "--accent-hover": "#1DE9B6",
      "--accent-soft": "#009688",
      "--accent-muted": "#00796B",
      "--accent-tint": "rgba(0, 191, 165, 0.16)",
      "--accent-border": "rgba(0, 191, 165, 0.4)",
      "--shadow-subtle": "0 2px 4px rgba(0, 0, 0, 0.45)",
    },
  },
  {
    id: "material-you",
    name: "Android 12 Material You",
    version: "12+ Monet",
    toastText: "Flashing Android 12 Material You... done",
    accentColor: "#9DD6A4",
    variables: {
      "--paper": "#181C19",
      "--surface": "#212622",
      "--surface-subtle": "#1C211D",
      "--rule": "#2F3630",
      "--rule-subtle": "#272D28",
      "--ink": "#E1E4DF",
      "--ink-muted": "#A2A7A0",
      "--ink-faint": "#717670",
      "--accent": "#9DD6A4",
      "--accent-hover": "#B5E3BB",
      "--accent-soft": "#83BE8A",
      "--accent-muted": "#568F5E",
      "--accent-tint": "rgba(157, 214, 164, 0.16)",
      "--accent-border": "rgba(157, 214, 164, 0.4)",
      "--shadow-subtle": "0 1px 3px rgba(0, 0, 0, 0.35)",
    },
  },
];

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
];

export function AndroidEraEasterEgg() {
  const [activeEra, setActiveEra] = useState<EraTheme | null>(null);
  const nextEraIndexRef = useRef<number>(0);
  const sequenceProgressRef = useRef<number>(0);

  // Revert all swapped CSS variables on <html> back to normal
  const revertToNormal = useCallback(() => {
    // Remove custom properties from documentElement style
    const allKeys = Object.keys(ANDROID_ERAS[0].variables);
    allKeys.forEach((key) => {
      document.documentElement.style.removeProperty(key);
    });

    setActiveEra(null);
  }, []);

  // Activate an era (persists until user clicks revert)
  const flashAndroidEra = useCallback((era: EraTheme) => {
    // Swap CSS variables on documentElement
    Object.entries(era.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    setActiveEra(era);
  }, []);

  // Keyboard listener for Konami sequence: ↑ ↑ ↓ ↓ ← → ← →
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses if the user is typing in an input, textarea, or contentEditable
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

      const expectedKey = KONAMI_SEQUENCE[sequenceProgressRef.current];

      if (e.key === expectedKey) {
        const nextProgress = sequenceProgressRef.current + 1;
        if (nextProgress === KONAMI_SEQUENCE.length) {
          // Konami sequence complete!
          e.preventDefault();
          sequenceProgressRef.current = 0;
          markFound("konami");

          // Cycle to next Android era
          const era = ANDROID_ERAS[nextEraIndexRef.current];
          nextEraIndexRef.current = (nextEraIndexRef.current + 1) % ANDROID_ERAS.length;
          flashAndroidEra(era);
        } else {
          sequenceProgressRef.current = nextProgress;
        }
      } else {
        // If wrong key, check if it's the start of a new sequence (ArrowUp)
        sequenceProgressRef.current = e.key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flashAndroidEra]);


  if (!activeEra) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-[6px] font-mono text-xs shadow-2xl flex items-center gap-3 border transition-all duration-200 select-none bg-[var(--surface)] text-[var(--ink)] border-[var(--rule)]"
      style={{
        boxShadow: `0 10px 25px -5px ${activeEra.accentColor}30, 0 4px 10px rgba(0,0,0,0.5)`,
        borderColor: `${activeEra.accentColor}50`,
      }}
    >
      {/* Icon & Version badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Smartphone
          size={14}
          strokeWidth={2}
          style={{ color: activeEra.accentColor }}
          className="animate-pulse"
        />
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-[3px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${activeEra.accentColor}20`,
            color: activeEra.accentColor,
          }}
        >
          {activeEra.id}
        </span>
      </div>

      {/* Toast Message */}
      <span className="font-medium">
        {activeEra.toastText}
      </span>

      {/* Revert to Original Theme Button */}
      <button
        type="button"
        onClick={revertToNormal}
        className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] font-medium transition-colors cursor-pointer border bg-[var(--paper)] hover:bg-[var(--surface-subtle)] text-[var(--ink)] border-[var(--rule)] hover:border-[var(--accent)]"
        title="Revert to original theme"
      >
        <RotateCcw size={11} strokeWidth={2} />
        <span>Revert to original theme</span>
      </button>
    </div>
  );
}


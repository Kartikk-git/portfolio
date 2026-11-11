"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Sun, Moon, AlertTriangle, EyeOff, RotateCcw } from "lucide-react";
import { siteContent } from "@/content/site";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ultraType, setUltraType] = useState<"flashbang" | "amoled" | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Press-and-hold refs
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number>(0);
  const didTriggerHoldRef = useRef<boolean>(false);

  // Rapid tap fallback (5+ taps within 3s)
  const tapHistoryRef = useRef<number[]>([]);
  const easeBackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme from DOM or localStorage (default dark)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const currentAttr = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;

    if (saved === "light" || currentAttr === "light") {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (easeBackTimerRef.current) clearTimeout(easeBackTimerRef.current);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      document.documentElement.classList.remove(
        "ultra-flashbang",
        "ultra-amoled",
        "ease-back-transition"
      );
      document.body.classList.remove("shake-my-eyes");
    };
  }, []);

  // Graceful ease back to normal theme
  const easeBackToNormal = useCallback(() => {
    if (easeBackTimerRef.current) clearTimeout(easeBackTimerRef.current);

    // Add smooth transition class
    document.documentElement.classList.add("ease-back-transition");
    document.documentElement.classList.remove("ultra-flashbang", "ultra-amoled");
    document.body.classList.remove("shake-my-eyes");

    // Clean up inline styles
    document.documentElement.style.removeProperty("--amoled-glow-level");
    document.documentElement.style.removeProperty("filter");

    // Clear state
    setUltraType(null);
    setToastMessage(null);
    tapHistoryRef.current = [];

    // Remove transition helper after it completes
    setTimeout(() => {
      document.documentElement.classList.remove("ease-back-transition");
    }, 1200);
  }, []);

  // Deploy Ultra Flash mode (lasts 10 seconds)
  const deployUltraMode = useCallback(
    (forcedMode?: "flashbang" | "amoled") => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (easeBackTimerRef.current) clearTimeout(easeBackTimerRef.current);

      // In dark mode, flash blinding white; in light mode, drop to pure pitch black AMOLED
      const mode = forcedMode || (theme === "dark" ? "flashbang" : "amoled");

      if (mode === "flashbang") {
        setUltraType("flashbang");
        document.documentElement.classList.remove("ultra-amoled");
        document.documentElement.classList.add("ultra-flashbang");
        document.documentElement.style.filter = "brightness(1.5) contrast(1.2)";

        if (!prefersReducedMotion) {
          document.body.classList.remove("shake-my-eyes");
          void document.body.offsetWidth; // re-trigger reflow
          document.body.classList.add("shake-my-eyes");
          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => {
            document.body.classList.remove("shake-my-eyes");
          }, 480);
        }

        setToastMessage("Flashbang deployed. Your retinas have been notified.");
      } else {
        setUltraType("amoled");
        document.documentElement.classList.remove("ultra-flashbang");
        document.documentElement.classList.add("ultra-amoled");
        document.documentElement.style.removeProperty("filter");

        document.documentElement.style.setProperty(
          "--amoled-glow-level",
          "0 0 16px rgba(95, 179, 143, 1), 0 0 32px rgba(95, 179, 143, 0.7)"
        );

        setToastMessage("AMOLED Void active. Conserving photonic energy.");
      }

      // Lasts longer: 10 full seconds before smoothly easing back to normal
      easeBackTimerRef.current = setTimeout(() => {
        easeBackToNormal();
      }, 10000);
    },
    [theme, easeBackToNormal]
  );

  // Press-and-hold handler: 3 seconds to trigger
  const startHold = () => {
    didTriggerHoldRef.current = false;
    holdStartRef.current = Date.now();
    setIsHolding(true);
    setHoldProgress(0);

    const DURATION = 3000; // 3 seconds

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setHoldProgress(pct);
    }, 40);

    holdTimerRef.current = setTimeout(() => {
      didTriggerHoldRef.current = true;
      setIsHolding(false);
      setHoldProgress(0);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      deployUltraMode();
    }, DURATION);
  };

  const cancelHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // Normal click toggle handler
  const handleToggleClick = () => {
    // If hold triggered the flashbang, suppress the normal toggle
    if (didTriggerHoldRef.current) {
      didTriggerHoldRef.current = false;
      return;
    }

    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch { }

    // Rapid tap tracker fallback
    const now = Date.now();
    tapHistoryRef.current = [
      ...tapHistoryRef.current.filter((t) => now - t <= 3000),
      now,
    ];
    if (tapHistoryRef.current.length >= 5) {
      deployUltraMode(nextTheme === "light" ? "flashbang" : "amoled");
    }
  };

  if (!mounted) {
    return (
      <div
        className="w-11 h-11 flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--ink-muted)] opacity-50"
        aria-hidden="true"
      >
        <Moon size={18} strokeWidth={1.5} />
      </div>
    );
  }

  const label =
    theme === "light" ? siteContent.nav.themeToDark : siteContent.nav.themeToLight;

  return (
    <>
      {/* Theme Toggle Button with 3-Second Hold Indicator */}
      <button
        type="button"
        onClick={handleToggleClick}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onTouchCancel={cancelHold}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            if (!isHolding && !didTriggerHoldRef.current) startHold();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") cancelHold();
        }}
        className={`inline-flex items-center justify-center w-11 h-11 border rounded-[4px] bg-[var(--surface)] text-[var(--ink)] cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 relative select-none ${isHolding
            ? "border-[var(--accent)] scale-95 shadow-md shadow-[var(--accent)]/20"
            : "border-[var(--rule)] hover:border-[var(--accent)]"
          }`}
        aria-label={label}
        title={label}
      >
        {/* Subtle Radial Progress Ring while Holding */}
        {isHolding && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none -rotate-90 p-0.5"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeDasharray="119.38"
              strokeDashoffset={119.38 - (119.38 * holdProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
          </svg>
        )}

        {theme === "light" ? (
          <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>

      {/* Ultra Mode Toast Notification (Lasts 10s or Revert early) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-[6px] font-mono text-xs shadow-2xl flex items-center gap-3 border transition-all duration-300 ${ultraType === "flashbang"
              ? "bg-white text-black border-neutral-300 shadow-white/40 ring-2 ring-black"
              : "bg-[#0A0D0B] text-[#5FB38F] border-[#1B6B4F] shadow-emerald-900/50 ring-1 ring-[#5FB38F]/50"
            }`}
        >
          {ultraType === "flashbang" ? (
            <AlertTriangle size={15} strokeWidth={2} className="text-amber-500 shrink-0" />
          ) : (
            <EyeOff size={15} strokeWidth={2} className="text-[#5FB38F] shrink-0" />
          )}
          <span className="font-medium tracking-tight">{toastMessage}</span>

          {/* Quick Revert Button */}
          <button
            type="button"
            onClick={easeBackToNormal}
            className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10px] font-semibold uppercase tracking-wider cursor-pointer border transition-colors ${ultraType === "flashbang"
                ? "bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300"
                : "bg-black/60 hover:bg-black text-[#5FB38F] border-[#5FB38F]/40 hover:border-[#5FB38F]"
              }`}
            title="Revert back to normal theme"
          >
            <RotateCcw size={10} strokeWidth={2} />
            <span>Revert</span>
          </button>
        </div>
      )}
    </>
  );
}

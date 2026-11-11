"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Sun, Moon, AlertTriangle, EyeOff } from "lucide-react";
import { siteContent } from "@/content/site";
import { markSecretUnlocked } from "@/lib/secrets";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ultraType, setUltraType] = useState<"flashbang" | "amoled" | null>(null);

  // Rapid tap tracking (5+ taps within 3 seconds)
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

  const handleToggleClick = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const direction = nextTheme === "light" ? "to-light" : "to-dark";

    // Set normal theme
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}

    // Tap frequency tracking (within 3000ms window)
    const now = Date.now();
    tapHistoryRef.current = [
      ...tapHistoryRef.current.filter((t) => now - t <= 3000),
      now,
    ];
    const tapCount = tapHistoryRef.current.length;

    // Trigger Ultra Mode at 5+ taps
    if (tapCount >= 5) {
      markSecretUnlocked("ultraTheme");
      const extraTaps = tapCount - 5;
      const intensity = 1 + extraTaps;

      // Check prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reset any active ease-back timer
      if (easeBackTimerRef.current) clearTimeout(easeBackTimerRef.current);

      if (direction === "to-light") {
        // ULTRA FLASHBANG LIGHT MODE
        setUltraType("flashbang");
        document.documentElement.classList.remove("ultra-amoled");
        document.documentElement.classList.add("ultra-flashbang");

        // Scale brightness with each extra tap
        const brightnessScale = Math.min(1.25 + extraTaps * 0.15, 2.0);
        document.documentElement.style.filter = `brightness(${brightnessScale}) contrast(1.15)`;

        // Camera shake unless reduced motion
        if (!prefersReducedMotion) {
          document.body.classList.remove("shake-my-eyes");
          // Re-trigger shake
          void document.body.offsetWidth;
          document.body.classList.add("shake-my-eyes");
          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => {
            document.body.classList.remove("shake-my-eyes");
          }, 480);
        }

        // Requested toast verbatim
        setToastMessage("Flashbang deployed. Your retinas have been notified.");
      } else {
        // ULTRA AMOLED PURE BLACK MODE
        setUltraType("amoled");
        document.documentElement.classList.remove("ultra-flashbang");
        document.documentElement.classList.add("ultra-amoled");
        document.documentElement.style.removeProperty("filter");

        // Intensify neon green text glow with each extra tap
        const glowPx = 10 + extraTaps * 8;
        const blurPx = 25 + extraTaps * 12;
        document.documentElement.style.setProperty(
          "--amoled-glow-level",
          `0 0 ${glowPx}px rgba(95, 179, 143, 1), 0 0 ${blurPx}px rgba(95, 179, 143, 0.7)`
        );

        setToastMessage("AMOLED Void active. Conserving photonic energy.");
      }

      // Schedule smooth ease-back after a few seconds of inactivity
      easeBackTimerRef.current = setTimeout(() => {
        easeBackToNormal();
      }, 3500);
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
      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={handleToggleClick}
        className="inline-flex items-center justify-center w-11 h-11 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 relative select-none"
        aria-label={label}
        title="Tap me. Maybe a lot."
      >
        {theme === "light" ? (
          <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>

      {/* Ultra Mode Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-[6px] font-mono text-xs shadow-2xl flex items-center gap-2.5 border transition-all duration-300 pointer-events-none ${
            ultraType === "flashbang"
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
        </div>
      )}
    </>
  );
}

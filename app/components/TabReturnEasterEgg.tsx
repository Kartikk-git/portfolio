"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import { markFound } from "@/lib/secrets";

export function TabReturnEasterEgg() {
  const [toastVisible, setToastVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const hiddenTimeRef = useRef<number>(0);
  const awayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const originalTitleRef = useRef<string>("");
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check prefers-reduced-motion
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const mediaListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", mediaListener);

    originalTitleRef.current = document.title;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hiddenTimeRef.current = Date.now();
        originalTitleRef.current = document.title;

        // Schedule title change at exactly 45 seconds (45000ms)
        if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
        awayTimerRef.current = setTimeout(() => {
          if (document.visibilityState === "hidden") {
            document.title = "Come back 🥺 I have bugs to fix";
          }
        }, 45000);
      } else if (document.visibilityState === "visible") {
        if (awayTimerRef.current) {
          clearTimeout(awayTimerRef.current);
          awayTimerRef.current = null;
        }

        const awayDuration =
          hiddenTimeRef.current > 0 ? Date.now() - hiddenTimeRef.current : 0;
        hiddenTimeRef.current = 0;

        // Restore original document title
        if (document.title === "Come back 🥺 I have bugs to fix") {
          document.title = originalTitleRef.current || "Kartik Koundal";
        }

        // Only trigger if away for 45s or more
        if (awayDuration >= 45000) {
          // Check if user is typing in an input (rule: don't trigger while user is typing)
          const activeEl = document.activeElement as HTMLElement | null;
          if (
            activeEl &&
            (activeEl.tagName === "INPUT" ||
              activeEl.tagName === "TEXTAREA" ||
              activeEl.isContentEditable ||
              activeEl.getAttribute("role") === "textbox")
          ) {
            return;
          }

          setToastVisible(true);
          markFound("tabreturn");

          if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
          dismissTimeoutRef.current = setTimeout(() => {
            setToastVisible(false);
          }, 8000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      media.removeEventListener("change", mediaListener);
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
      if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    };
  }, []);

  if (!toastVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 ease-out ${
        prefersReducedMotion ? "opacity-100" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--surface)] text-[var(--ink)] border border-[var(--accent)]/50 rounded-[6px] shadow-2xl font-mono text-xs select-none">
        <Sparkles size={14} className="text-[var(--accent)] shrink-0 animate-pulse" />
        <span>Welcome back. Psst, try the arrow keys.</span>
        <button
          type="button"
          onClick={() => setToastVisible(false)}
          aria-label="Dismiss welcome toast"
          className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 -mr-1 rounded-[2px] transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

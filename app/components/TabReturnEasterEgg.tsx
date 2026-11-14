"use client";

import React, { useEffect, useRef } from "react";
import { markFound } from "@/lib/secrets";
import { showToast } from "./ToastManager";

export function TabReturnEasterEgg() {
  const hiddenTimeRef = useRef<number>(0);
  const awayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const originalTitleRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

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
          // Check if user is typing in an input
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

          showToast("Welcome back. Psst, try the arrow keys.", { type: "sparkle", duration: 6000 });
          markFound("tabreturn");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    };
  }, []);

  return null;
}


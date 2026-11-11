"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sparkles, X, RotateCcw, Check, HelpCircle, ChevronUp } from "lucide-react";
import { getSecretsState, resetSecretsState, SecretState } from "@/lib/secrets";

export function SecretsHintSystem() {
  const [secrets, setSecrets] = useState<SecretState>({
    logcat: false,
    ultraTheme: false,
    konami: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [idleHintVisible, setIdleHintVisible] = useState(false);
  const [idleHintDismissed, setIdleHintDismissed] = useState(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. DevTools Console Hint
  useEffect(() => {
    console.log(
      "%cNice, you're curious.%c Try the Konami code. Hint: ↑ ↑ ↓ ↓...",
      "color: #5FB38F; font-size: 13px; font-weight: bold; padding: 2px 4px;",
      "color: #9CA3AF; font-size: 12px;"
    );
    console.log(
      "%c[Secrets Tracker]%c There are 3 hidden easter eggs in this portfolio. Can you discover all of them?",
      "color: #33B5E5; font-size: 11px; font-weight: bold;",
      "color: #9CA3AF; font-size: 11px;"
    );
  }, []);

  // 2. Load secrets state and listen for unlock events
  useEffect(() => {
    setSecrets(getSecretsState());

    const handleUnlock = () => {
      setSecrets(getSecretsState());
    };

    window.addEventListener("portfolio:secret_unlocked", handleUnlock);
    return () => window.removeEventListener("portfolio:secret_unlocked", handleUnlock);
  }, []);

  // 3. Cursor Idle Detection (20 seconds)
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleHintVisible) {
        setIdleHintVisible(false);
      }
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (!idleHintDismissed) {
        idleTimerRef.current = setTimeout(() => {
          setIdleHintVisible(true);
        }, 20000);
      }
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));

    // Start initial timer
    idleTimerRef.current = setTimeout(() => {
      if (!idleHintDismissed) {
        setIdleHintVisible(true);
      }
    }, 20000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [idleHintVisible, idleHintDismissed]);

  const unlockedCount =
    (secrets.logcat ? 1 : 0) +
    (secrets.ultraTheme ? 1 : 0) +
    (secrets.konami ? 1 : 0);

  const handleResetSecrets = () => {
    const fresh = resetSecretsState();
    setSecrets(fresh);
  };

  return (
    <>
      {/* 20-Second Idle Bubble near footer */}
      {idleHintVisible && !idleHintDismissed && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-18 left-1/2 -translate-x-1/2 z-40 bg-[var(--surface)] text-[var(--ink)] border border-[var(--accent)] px-3.5 py-2 rounded-[6px] shadow-xl text-xs font-mono flex items-center gap-2.5 transition-all duration-300 animate-fadeIn"
        >
          <Sparkles size={13} className="text-[var(--accent)] shrink-0" />
          <span>Still here? Try the arrow keys.</span>
          <button
            type="button"
            onClick={() => {
              setIdleHintVisible(false);
              setIdleHintDismissed(true);
            }}
            className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-0.5 ml-1 cursor-pointer"
            title="Dismiss idle hint"
            aria-label="Dismiss idle hint"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Progress Tracker Corner Badge: "Secrets: X/3" */}
      <div className="fixed bottom-4 left-4 z-40 font-mono text-xs select-none">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border transition-colors cursor-pointer shadow-sm ${
            unlockedCount === 3
              ? "bg-[var(--accent-tint)] border-[var(--accent)] text-[var(--accent)] font-semibold"
              : "bg-[var(--surface)] border-[var(--rule)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--ink)]"
          }`}
          title="Click to view discovered secrets and hints"
          aria-label={`Secrets discovered: ${unlockedCount} of 3. Click for hints.`}
          aria-expanded={isOpen}
        >
          <Sparkles
            size={12}
            className={unlockedCount > 0 ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"}
          />
          <span>
            Secrets: {unlockedCount}/3
          </span>
          <ChevronUp
            size={11}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Revealed Hints Card Popover */}
        {isOpen && (
          <div
            role="region"
            aria-label="Secrets tracker and hint panel"
            className="absolute bottom-full left-0 mb-2 w-80 sm:w-88 bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] shadow-2xl p-4 text-xs font-mono text-[var(--ink)] space-y-3 z-50 animate-fadeIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--rule)]">
              <div className="flex items-center gap-1.5 font-semibold">
                <Sparkles size={13} className="text-[var(--accent)]" />
                <span>Portfolio Secrets ({unlockedCount}/3)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-0.5 cursor-pointer"
                title="Close secrets panel"
                aria-label="Close secrets panel"
              >
                <X size={13} />
              </button>
            </div>

            {/* List of Secrets & Progressive Hints */}
            <div className="space-y-2.5">
              {/* Secret 1: Logcat Terminal */}
              <div
                className={`p-2.5 rounded-[4px] border ${
                  secrets.logcat
                    ? "bg-[var(--accent-tint)]/40 border-[var(--accent)]/60 text-[var(--ink)]"
                    : "bg-[var(--surface-subtle)] border-[var(--rule)]/60 text-[var(--ink-muted)]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  {secrets.logcat ? (
                    <Check size={12} className="text-[var(--accent)] shrink-0" />
                  ) : (
                    <HelpCircle size={12} className="text-[var(--ink-muted)] shrink-0" />
                  )}
                  <span className={secrets.logcat ? "text-[var(--accent)]" : ""}>
                    {secrets.logcat ? "Secret 1: Logcat Coffee Barista" : "Secret 1: Hidden Terminal"}
                  </span>
                </div>
                <p className="text-[11px] mt-1 text-[var(--ink-muted)] leading-relaxed">
                  {secrets.logcat
                    ? "Unlocked! Discovered root terminal barista in Logcat."
                    : "Hint: Press Ctrl+K to open Logcat. Try typing 'sudo make-coffee' or 'easter-egg'."}
                </p>
              </div>

              {/* Secret 2: Ultra Theme Mode */}
              <div
                className={`p-2.5 rounded-[4px] border ${
                  secrets.ultraTheme
                    ? "bg-[var(--accent-tint)]/40 border-[var(--accent)]/60 text-[var(--ink)]"
                    : "bg-[var(--surface-subtle)] border-[var(--rule)]/60 text-[var(--ink-muted)]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  {secrets.ultraTheme ? (
                    <Check size={12} className="text-[var(--accent)] shrink-0" />
                  ) : (
                    <HelpCircle size={12} className="text-[var(--ink-muted)] shrink-0" />
                  )}
                  <span className={secrets.ultraTheme ? "text-[var(--accent)]" : ""}>
                    {secrets.ultraTheme ? "Secret 2: Ultra Theme Escalation" : "Secret 2: Theme Overload"}
                  </span>
                </div>
                <p className="text-[11px] mt-1 text-[var(--ink-muted)] leading-relaxed">
                  {secrets.ultraTheme
                    ? "Unlocked! Deployed Flashbang and AMOLED Void."
                    : "Hint: The sun/moon toggle button in the header likes being held down for 3 seconds..."}
                </p>
              </div>

              {/* Secret 3: Konami Code */}
              <div
                className={`p-2.5 rounded-[4px] border ${
                  secrets.konami
                    ? "bg-[var(--accent-tint)]/40 border-[var(--accent)]/60 text-[var(--ink)]"
                    : "bg-[var(--surface-subtle)] border-[var(--rule)]/60 text-[var(--ink-muted)]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  {secrets.konami ? (
                    <Check size={12} className="text-[var(--accent)] shrink-0" />
                  ) : (
                    <HelpCircle size={12} className="text-[var(--ink-muted)] shrink-0" />
                  )}
                  <span className={secrets.konami ? "text-[var(--accent)]" : ""}>
                    {secrets.konami ? "Secret 3: Android Eras Flashed" : "Secret 3: Retro Sequence"}
                  </span>
                </div>
                <p className="text-[11px] mt-1 text-[var(--ink-muted)] leading-relaxed">
                  {secrets.konami
                    ? "Unlocked! Cycled through Holo, Lollipop, and Material You."
                    : "Hint: Old-school gamers know the arrow sequence: ↑ ↑ ↓ ↓ ← → ← →"}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--rule)] text-[10.5px]">
              <span className="text-[var(--ink-muted)]">Saved in localStorage</span>
              {unlockedCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetSecrets}
                  className="inline-flex items-center gap-1 text-[var(--ink-muted)] hover:text-rose-500 cursor-pointer"
                  title="Reset secret discovery progress"
                >
                  <RotateCcw size={10} />
                  <span>Reset secrets</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


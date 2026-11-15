"use client";

import React, { useEffect, useState, useRef } from "react";
import { AlertCircle, CheckCircle2, RotateCw, X } from "lucide-react";
import { markFound } from "@/lib/secrets";

interface CrashDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrashDialog({ isOpen, onClose }: CrashDialogProps) {
  const [stage, setStage] = useState<"prompt" | "waiting" | "resolved">("prompt");
  const waitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStage("prompt");
      // Mark as found when the dialog opens
      markFound("crash");

      // Auto-focus on primary action
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
      };
    }
  }, [isOpen, onClose]);

  const handleWait = () => {
    setStage("waiting");
    waitTimeoutRef.current = setTimeout(() => {
      setStage("resolved");
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crash-dialog-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]"
    >
      <div className="relative w-full max-w-sm bg-[var(--surface)] border border-[var(--rule)] rounded-[8px] p-6 shadow-2xl space-y-4">
        {/* Top-right close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-[4px] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Header with Android crash title */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <h2
              id="crash-dialog-title"
              className="text-base font-semibold text-[var(--ink)] font-sans"
            >
              Kartik Koundal has stopped.
            </h2>
            <p className="text-xs text-[var(--ink-muted)] font-mono leading-relaxed">
              Process com.kartikkoundal.portfolio (pid 1337)
            </p>
          </div>
        </div>

        {/* Content based on stage */}
        {stage === "prompt" && (
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
            The application isn&apos;t responding. Do you want to close it or wait for the process to resume?
          </p>
        )}

        {stage === "waiting" && (
          <div className="space-y-3 py-1">
            <div className="flex items-center gap-2 text-xs text-[var(--accent)] font-mono">
              <RotateCw size={14} className="animate-spin" />
              <span>Analyzing stack trace and main thread locks...</span>
            </div>
            {/* Fake Material Linear Progress Bar */}
            <div className="w-full h-1 bg-[var(--rule)] overflow-hidden rounded-[2px] relative">
              <div className="absolute top-0 bottom-0 bg-[var(--accent)] animate-indeterminate-bar rounded-[2px]" />
            </div>
          </div>
        )}

        {stage === "resolved" && (
          <div className="p-3 bg-[var(--accent-tint)] border border-[var(--accent)]/40 rounded-[4px] space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
              <CheckCircle2 size={14} />
              <span>Thread Unlocked: Diagnostic Hint</span>
            </div>
            <p className="text-[11.5px] text-[var(--ink)] font-mono leading-relaxed">
              &quot;Old-school gamers know the arrow sequence: &uarr; &uarr; &darr; &darr; &larr; &rarr; &larr; &rarr;&quot;
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--rule)]/60 font-mono text-xs">
          {stage === "prompt" && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)] rounded-[4px] transition-colors cursor-pointer"
              >
                Close app
              </button>
              <button
                type="button"
                ref={closeButtonRef}
                onClick={handleWait}
                className="px-3.5 py-1.5 bg-[var(--accent)] text-white font-medium rounded-[4px] hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                Wait
              </button>
            </>
          )}

          {stage === "waiting" && (
            <button
              type="button"
              disabled
              className="px-3.5 py-1.5 text-[var(--ink-muted)] opacity-60 cursor-not-allowed"
            >
              Please wait...
            </button>
          )}

          {stage === "resolved" && (
            <button
              type="button"
              ref={closeButtonRef}
              onClick={onClose}
              className="px-3.5 py-1.5 bg-[var(--accent)] text-white font-medium rounded-[4px] hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

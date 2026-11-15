"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "info" | "sparkle" | "warning";

export interface ToastOptions {
  id?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

// Global CustomEvent name for decoupled, library-free toast dispatch
const TOAST_EVENT = "kartik:toast";

/**
 * Global helper to trigger a toast from anywhere in the application.
 * Queues toasts so only one shows at a time with clean transitions.
 */
export function showToast(message: string, options?: Omit<ToastOptions, "message">): void {
  if (typeof window === "undefined") return;

  // Suppress toasts if Do Not Disturb mode or Battery Saver is active
  if (document.documentElement.getAttribute("data-dnd") === "true") {
    return;
  }

  const detail: ToastOptions = {
    id: options?.id || `toast_${Date.now()}_${Math.random()}`,
    message,
    type: options?.type || "success",
    duration: options?.duration || 3200,
  };

  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}

/**
 * ToastManager component: Singleton queue that renders at fixed bottom-right.
 * Guarantees zero toast collisions or stacking bugs across all easter eggs.
 */
export function ToastManager() {
  const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null);
  const [queue, setQueue] = useState<ToastOptions[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dismissCurrent = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
    setTimeout(() => {
      setCurrentToast(null);
    }, 200);
  }, []);

  // Listen for dispatched toast events
  useEffect(() => {
    const handleNewToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastOptions>;
      if (!customEvent.detail) return;

      const toast = customEvent.detail;
      setQueue((prev) => [...prev, toast]);
    };

    window.addEventListener(TOAST_EVENT, handleNewToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleNewToast);
    };
  }, []);

  // Process the queue item by item
  useEffect(() => {
    if (currentToast || queue.length === 0) return;

    const [nextToast, ...remaining] = queue;
    setQueue(remaining);
    setCurrentToast(nextToast);
    setIsVisible(true);

    timerRef.current = setTimeout(() => {
      dismissCurrent();
    }, nextToast.duration || 3200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentToast, queue, dismissCurrent]);

  if (!currentToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-toast flex items-center gap-2.5 pl-3.5 pr-2 py-2 bg-[var(--surface)] text-[var(--ink)] border border-[var(--accent)] rounded-[4px] shadow-2xl font-mono text-xs select-none transition-all duration-200 pointer-events-auto ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      {currentToast.type === "sparkle" ? (
        <Sparkles size={15} className="text-[var(--accent)] shrink-0" />
      ) : currentToast.type === "warning" ? (
        <AlertCircle size={15} className="text-amber-500 shrink-0" />
      ) : currentToast.type === "info" ? (
        <Info size={15} className="text-[var(--accent)] shrink-0" />
      ) : (
        <CheckCircle2 size={15} className="text-[var(--accent)] shrink-0" />
      )}
      <span className="pr-1">{currentToast.message}</span>
      <button
        type="button"
        onClick={dismissCurrent}
        className="p-1 rounded-[3px] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

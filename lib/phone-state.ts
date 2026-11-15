"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared phone open/closed state store.
 * Subscribable by the Android Hero Bot, Phone Mockup, Section Rail, etc.
 * Always starts closed on every page load.
 */
let isPhoneOpen: boolean = false;
const listeners = new Set<() => void>();

export function setPhoneOpen(open: boolean) {
  if (isPhoneOpen !== open) {
    isPhoneOpen = open;
    listeners.forEach((listener) => listener());
  }
}

export function openPhone() {
  setPhoneOpen(true);
}

export function closePhone() {
  setPhoneOpen(false);
}

export function togglePhone() {
  setPhoneOpen(!isPhoneOpen);
}

export function getPhoneOpen(): boolean {
  return isPhoneOpen;
}

export function subscribeToPhoneOpen(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePhoneState() {
  const isOpen = useSyncExternalStore(
    subscribeToPhoneOpen,
    getPhoneOpen,
    () => false
  );

  return {
    isOpen,
    openPhone,
    closePhone,
    togglePhone,
    setPhoneOpen,
  };
}


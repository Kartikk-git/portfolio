"use client";

import React, { useSyncExternalStore, createContext, useContext } from "react";

/**
 * Shared active section store.
 * Subscribable by the Section Rail, Android Mockup, Bugdroid, Header, etc.
 */
let currentActiveSection: string = "projects";
const listeners = new Set<() => void>();

export function setActiveSection(id: string) {
  if (currentActiveSection !== id) {
    currentActiveSection = id;
    listeners.forEach((listener) => listener());
  }
}

export function getActiveSection(): string {
  return currentActiveSection;
}

export function subscribeToActiveSection(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export interface ActiveSectionStore {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const ActiveSectionContext = createContext<ActiveSectionStore>({
  activeSection: "projects",
  setActiveSection,
});

export function ActiveSectionProvider({
  children,
  initialSection = "projects",
}: {
  children: React.ReactNode;
  initialSection?: string;
}) {
  const activeSection = useSyncExternalStore(
    subscribeToActiveSection,
    getActiveSection,
    () => initialSection
  );

  return React.createElement(
    ActiveSectionContext.Provider,
    { value: { activeSection, setActiveSection } },
    children
  );
}

/**
 * Hook to access and update the active section ID.
 * Works reactively across any component via useSyncExternalStore.
 */
export function useActiveSection(): ActiveSectionStore {
  const activeSection = useSyncExternalStore(
    subscribeToActiveSection,
    getActiveSection,
    () => "projects"
  );

  return {
    activeSection,
    setActiveSection,
  };
}

"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query.
 *
 * Always returns false during SSR and on the first client render, so it must
 * only gate optional enhancements (pointer previews, accordions), never
 * content. Effects that depend on it run after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when the browser asks for reduced data (Save-Data / low power). */
export function useSaveData(): boolean {
  const reducedData = useMediaQuery("(prefers-reduced-data: reduce)");
  const [navigatorSaveData, setNavigatorSaveData] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { saveData?: boolean };
    setNavigatorSaveData(nav.saveData === true);
  }, []);

  return reducedData || navigatorSaveData;
}

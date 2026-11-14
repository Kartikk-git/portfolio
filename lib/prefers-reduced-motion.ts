/**
 * Synchronous check of the user's reduced-motion preference.
 * Safe inside event handlers (unlike the useReducedMotion hook,
 * which requires a component render context).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

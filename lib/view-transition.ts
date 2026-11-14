// Typed access to the View Transitions API with a safe no-op fallback.
// Keeps `(document as any)` out of component code (strict TS, no `any` rule).

export interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => ViewTransition;
};

/**
 * Runs `updateCallback` inside a view transition when the API is available,
 * otherwise runs it directly. Returns the transition handle, or null when the
 * API is missing (callers then render the state change without a transition).
 */
export function startViewTransition(updateCallback: () => void): ViewTransition | null {
  if (typeof document === "undefined") return null;
  const doc = document as ViewTransitionDocument;
  if (typeof doc.startViewTransition !== "function") return null;
  try {
    return doc.startViewTransition(updateCallback);
  } catch {
    updateCallback();
    return null;
  }
}

/** True when the View Transitions API exists and the user allows motion. */
export function viewTransitionsEnabled(prefersReducedMotion: boolean): boolean {
  if (typeof document === "undefined") return false;
  const doc = document as ViewTransitionDocument;
  return typeof doc.startViewTransition === "function" && !prefersReducedMotion;
}

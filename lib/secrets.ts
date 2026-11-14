/**
 * Portfolio Easter Eggs & Secrets Module
 * Connects all 5 hidden secrets with a unified tracker, localStorage persistence,
 * styled console messages, and window.secrets DevTools interface.
 */

import { contactContent } from "@/content/contact";

export type EggId = "bugdroid" | "crash" | "tabreturn" | "konami" | "theme";

export interface EggDefinition {
  id: EggId;
  name: string;
  hint: string;
}

export const ALL_EGGS: EggDefinition[] = [
  {
    id: "bugdroid",
    name: "Footer Bugdroid",
    hint: "A friendly mascot watches from the footer edge.",
  },
  {
    id: "crash",
    name: "Fake Crash Dialog",
    hint: "Header names don't like being tapped repeatedly.",
  },
  {
    id: "tabreturn",
    name: "Tab Return",
    hint: "Step away from this tab for 45 seconds, then return.",
  },
  {
    id: "konami",
    name: "Android Eras (Konami)",
    hint: "Old-school gamers know the arrow sequence: ↑ ↑ ↓ ↓ ← → ← →",
  },
  {
    id: "theme",
    name: "Ultra Theme Escalation",
    hint: "Hold or rapidly tap the sun/moon button in the header.",
  },
];

const STORAGE_KEY = "kartik_portfolio_secrets_v2";

// In-memory fallback if localStorage is blocked or restricted
const inMemoryFallback: Partial<Record<EggId, boolean>> = {};

export function getStoredSecrets(): Record<EggId, boolean> {
  const initial = ALL_EGGS.reduce((acc, egg) => {
    acc[egg.id] = false;
    return acc;
  }, {} as Record<EggId, boolean>);

  if (typeof window === "undefined") return initial;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      ALL_EGGS.forEach((egg) => {
        if (parsed && typeof parsed[egg.id] === "boolean") {
          initial[egg.id] = parsed[egg.id];
        }
      });
      return initial;
    }
  } catch {
    // LocalStorage blocked, fall through to inMemoryFallback
  }

  // Merge in-memory state
  ALL_EGGS.forEach((egg) => {
    if (typeof inMemoryFallback[egg.id] === "boolean") {
      initial[egg.id] = inMemoryFallback[egg.id]!;
    }
  });

  return initial;
}

function saveStoredSecrets(state: Record<EggId, boolean>): void {
  // Always update inMemoryFallback
  Object.assign(inMemoryFallback, state);

  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Fail silently if localStorage is disabled or restricted
  }
}

export function printDevToolsSummary(): void {
  if (typeof window === "undefined") return;

  console.log(
    "%cNice, you're curious.%c Try the Konami code. Hint: ↑ ↑ ↓ ↓...",
    "color: #5FB38F; font-size: 13px; font-weight: bold; padding: 2px 4px;",
    "color: #9CA3AF; font-size: 12px;"
  );
}

export function printSecretsStatusTable(): void {
  if (typeof window === "undefined") return;

  const state = getStoredSecrets();
  const tableData = ALL_EGGS.map((egg) => {
    const isFound = Boolean(state[egg.id]);
    return {
      Status: isFound ? "Discovered" : "Hidden",
      Secret: isFound ? egg.name : "???",
      Hint: isFound ? "Unlocked!" : egg.hint,
    };
  });

  console.table(tableData);
}

export function markFound(id: EggId): void {
  if (typeof window === "undefined") return;

  const state = getStoredSecrets();
  if (state[id]) {
    return; // Already recorded
  }

  state[id] = true;
  saveStoredSecrets(state);

  const egg = ALL_EGGS.find((e) => e.id === id);
  const foundCount = ALL_EGGS.filter((e) => state[e.id]).length;
  const eggName = egg ? egg.name : id;

  console.log(
    `%c🎉 Secret unlocked: ${eggName} (${foundCount}/${ALL_EGGS.length})`,
    "color: #5FB38F; font-size: 13px; font-weight: bold; font-family: monospace;"
  );

  if (foundCount === ALL_EGGS.length) {
    console.log(
      `%cAll ${ALL_EGGS.length} found. You've earned a hire. ${contactContent.primary.email}`,
      "color: #5FB38F; font-size: 14px; font-weight: bold; font-family: monospace; padding: 4px 0;"
    );
  }
}

// Global window.secrets interface
declare global {
  interface Window {
    secrets?: {
      hint: () => string;
      reset: () => string;
      status: () => void;
    };
  }
}

let isInitialized = false;

export function initSecretsTracker(): void {
  if (typeof window === "undefined" || isInitialized) return;
  isInitialized = true;

  const secretsAPI = {
    hint() {
      const current = getStoredSecrets();
      const undiscovered = ALL_EGGS.filter((e) => !current[e.id]);
      if (undiscovered.length === 0) {
        console.log(
          "%cAll secrets already discovered! You've found them all.",
          "color: #5FB38F; font-family: monospace; font-weight: bold;"
        );
        return `All ${ALL_EGGS.length} secrets unlocked.`;
      }
      const randomEgg = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      console.log(
        `%c[Hint]: ${randomEgg.hint}`,
        "color: #5FB38F; font-weight: bold; font-family: monospace;"
      );
      return `Hint for a hidden secret: "${randomEgg.hint}"`;
    },
    reset() {
      // Clear in-memory fallback
      ALL_EGGS.forEach((egg) => {
        inMemoryFallback[egg.id] = false;
      });
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      console.log(
        "%cSecrets progress has been reset.",
        "color: #E9E8E3; font-family: monospace;"
      );
      printSecretsStatusTable();
      return `Progress reset to 0/${ALL_EGGS.length}.`;
    },
    status() {
      printSecretsStatusTable();
    },
  };

  // Define window.secrets as a getter so typing `secrets` in the console prints the status table
  try {
    Object.defineProperty(window, "secrets", {
      get() {
        printSecretsStatusTable();
        return secretsAPI;
      },
      configurable: true,
    });
  } catch {
    window.secrets = secretsAPI;
  }

  // Print initial banner and table on page load
  printDevToolsSummary();
}

// Auto-initialize in browser environment immediately so DevTools is always populated
if (typeof window !== "undefined") {
  initSecretsTracker();
}

export type SecretId = "logcat" | "ultraTheme" | "konami";

export interface SecretState {
  logcat: boolean;
  ultraTheme: boolean;
  konami: boolean;
}

const STORAGE_KEY = "kartik_portfolio_secrets";

export function getSecretsState(): SecretState {
  if (typeof window === "undefined") {
    return { logcat: false, ultraTheme: false, konami: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        logcat: Boolean(parsed.logcat),
        ultraTheme: Boolean(parsed.ultraTheme),
        konami: Boolean(parsed.konami),
      };
    }
  } catch {}
  return { logcat: false, ultraTheme: false, konami: false };
}

export function markSecretUnlocked(id: SecretId) {
  if (typeof window === "undefined") return;
  try {
    const current = getSecretsState();
    if (!current[id]) {
      current[id] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(
        new CustomEvent("portfolio:secret_unlocked", {
          detail: { id, all: current },
        })
      );
    }
  } catch {}
}

export function resetSecretsState(): SecretState {
  if (typeof window === "undefined") {
    return { logcat: false, ultraTheme: false, konami: false };
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = { logcat: false, ultraTheme: false, konami: false };
    window.dispatchEvent(
      new CustomEvent("portfolio:secret_unlocked", {
        detail: { id: null, all: fresh },
      })
    );
    return fresh;
  } catch {}
  return { logcat: false, ultraTheme: false, konami: false };
}

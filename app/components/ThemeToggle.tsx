"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { siteContent } from "@/content/site";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark"
      | null;
    if (current) {
      setTheme(current);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  };

  if (!mounted) {
    return (
      <div
        className="w-11 h-11 flex items-center justify-center border border-[var(--rule)] rounded-[4px] text-[var(--ink-muted)] opacity-50"
        aria-hidden="true"
      >
        <Sun size={18} strokeWidth={1.5} />
      </div>
    );
  }

  const label = theme === "light" ? siteContent.nav.themeToDark : siteContent.nav.themeToLight;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-11 h-11 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      aria-label={label}
      title={label}
    >
      {theme === "light" ? (
        <Moon size={18} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Sun size={18} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}

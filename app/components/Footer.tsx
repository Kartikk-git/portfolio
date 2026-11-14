"use client";

import React, { useState, useEffect } from "react";
import { siteContent } from "@/content/site";

const FOOTER_HINTS = [
  "// psst: some old-school gamers know a cheat code...",
  "// tip: the theme toggle can take quite a few rapid taps...",
  "// debug: the Android Studio terminal takes superuser coffee requests...",
  "// logcat: press Ctrl+K to inspect the live process runtime...",
  "// secret: directional arrows unlock bygone Android eras...",
  "// hint: click my name in the header a few times...",
];

export function Footer() {
  const [hint, setHint] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const picked = FOOTER_HINTS[Math.floor(Math.random() * FOOTER_HINTS.length)];
    setHint(picked);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const main = document.querySelector("main") || document.body;
    main?.focus({ preventScroll: true });
  };

  return (
    <footer className="py-12 border-t border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-muted)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span>{siteContent.footer.line}</span>
          </div>

          <div>
            <button
              onClick={scrollToTop}
              className="hover:text-[var(--accent)] hover:underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              &uarr; {siteContent.footer.top}
            </button>
          </div>
        </div>

        {hint && !dismissed && (
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors pt-3 border-t border-[var(--rule)]/40 select-none">
            <span>{hint}</span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer px-1"
              title="Dismiss hint"
              aria-label="Dismiss hint"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}

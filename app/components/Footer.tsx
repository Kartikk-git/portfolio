"use client";

import React from "react";
import { siteContent } from "@/content/site";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const main = document.querySelector("main") || document.body;
    main.focus({ preventScroll: true });
  };

  return (
    <footer className="py-12 border-t border-[var(--rule)] bg-[var(--paper)] text-xs font-mono text-[var(--ink-muted)]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
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
    </footer>
  );
}

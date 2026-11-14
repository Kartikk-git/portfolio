"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectsSection } from "./components/ProjectsSection";
import { AboutSection } from "./components/AboutSection";
import { SkillsSection } from "./components/SkillsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { siteContent } from "@/content/site";

// Lazy-load below-the-fold heavy heatmap activity component
const CommitLogSection = dynamic(
  () => import("./components/CommitLogSection").then((mod) => mod.CommitLogSection),
  {
    loading: () => (
      <div className="py-24 border-t border-[var(--rule)] flex justify-center items-center">
        <span className="font-mono text-xs text-[var(--ink-muted)]">Loading activity metrics...</span>
      </div>
    ),
  }
);

/**
 * Mounts children after the browser goes idle, so the commit-log bundle
 * (download + hydrate) never competes with the hero render and initial
 * hydration on slow devices.
 */
function IdleMount({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 3000 });
    } else {
      timeoutId = setTimeout(start, 1200);
    }

    return () => {
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <>{children}</> : <>{fallback}</>;
}

export default function HomePage() {
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsReviewMode(params.get("review") === "1");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--paper)] focus:rounded-[4px] focus:outline-2 focus:outline-[var(--accent)] text-xs font-mono"
      >
        {siteContent.ui.skip}
      </a>

      {/* Review Mode Banner if active */}
      {isReviewMode && (
        <div className="bg-amber-500 text-black px-4 py-1.5 font-mono text-xs flex items-center justify-between z-50">
          <span>Review Mode Active (?review=1) — Outlining items requiring owner verification</span>
          <Link href="/" className="underline font-bold">
            Exit review mode
          </Link>
        </div>
      )}

      {/* Sticky Minimal Header */}
      <Header />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1 w-full">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Projects */}
        <ProjectsSection isReviewMode={isReviewMode} />

        {/* 3. About */}
        <AboutSection isReviewMode={isReviewMode} />

        {/* 4. Activity & Contributions (Commit Log, mounted when the browser is idle) */}
        <IdleMount
          fallback={
            <div className="py-24 border-t border-[var(--rule)] flex justify-center items-center">
              <span className="font-mono text-xs text-[var(--ink-muted)]">Loading activity metrics...</span>
            </div>
          }
        >
          <CommitLogSection />
        </IdleMount>

        {/* 5. Technical Stack */}
        <SkillsSection />

        {/* 6. Experience & Internships */}
        <ExperienceSection />

        {/* 7. Education & Credentials */}
        <EducationSection isReviewMode={isReviewMode} />

        {/* 8. Contact */}
        <ContactSection isReviewMode={isReviewMode} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

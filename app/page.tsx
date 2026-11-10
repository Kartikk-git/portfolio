"use client";

import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectsSection } from "./components/ProjectsSection";
import { AboutSection } from "./components/AboutSection";
import { CommitLogSection } from "./components/CommitLogSection";
import { SkillsSection } from "./components/SkillsSection";
import { EducationSection } from "./components/EducationSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { siteContent } from "@/content/site";

export default function HomePage() {
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsReviewMode(params.get("review") === "1");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col selection:bg-[var(--rule)] selection:text-[var(--ink)]">
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
          <a href="/" className="underline font-bold">
            Exit review mode
          </a>
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

        {/* 4. Activity & Contributions (Commit Log) */}
        <CommitLogSection />

        {/* 5. Technical Stack */}
        <SkillsSection />

        {/* 6. Education & Credentials */}
        <EducationSection isReviewMode={isReviewMode} />

        {/* 7. Contact */}
        <ContactSection isReviewMode={isReviewMode} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

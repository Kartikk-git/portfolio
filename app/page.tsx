"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProjectsSection } from "./components/ProjectsSection";
import { AboutSection } from "./components/AboutSection";
import { SkillsSection } from "./components/SkillsSection";
import { EducationSection } from "./components/EducationSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export default function HomePage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col selection:bg-[var(--rule)] selection:text-[var(--ink)]">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--ink)] focus:text-[var(--paper)] focus:rounded-[4px] focus:outline-2 focus:outline-[var(--accent)] text-xs font-mono"
      >
        Skip to main content
      </a>

      {/* Sticky Minimal Header */}
      <Header />

      {/* Main Content Sections in Exact Brief Order */}
      <main id="main-content" className="flex-1 w-full">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Projects */}
        <ProjectsSection activeSkill={selectedSkill} />

        {/* 3. About (max 3 sentences) */}
        <AboutSection />

        {/* 4. Skills (with Stack Explorer) */}
        <SkillsSection
          selectedSkill={selectedSkill}
          onSelectSkill={setSelectedSkill}
        />

        {/* 5. Education & Certifications */}
        <EducationSection />

        {/* 6. Contact */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

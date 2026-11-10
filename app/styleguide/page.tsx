"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ArrowUpRight, Download, Check } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { lightContrastData, darkContrastData } from "./contrast";
import { projects } from "@/content/projects";

export default function StyleguidePage() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const tejovik = projects[0];

  useEffect(() => {
    const updateThemeState = () => {
      const params = new URLSearchParams(window.location.search);
      const qTheme = params.get("theme");
      const attr = document.documentElement.getAttribute("data-theme");
      if (qTheme === "dark" || qTheme === "light") {
        setThemeMode(qTheme);
        document.documentElement.setAttribute("data-theme", qTheme);
      } else if (attr === "dark" || attr === "light") {
        setThemeMode(attr);
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setThemeMode("dark");
      } else {
        setThemeMode("light");
      }
    };

    updateThemeState();

    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") {
        setThemeMode(attr);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqListener = () => {
      if (!document.documentElement.getAttribute("data-theme")) {
        updateThemeState();
      }
    };
    mq.addEventListener("change", mqListener);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", mqListener);
    };
  }, []);

  const setManualTheme = (mode: "light" | "dark") => {
    setThemeMode(mode);
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem("theme", mode);
    } catch {}
  };

  return (
    <main className="min-h-screen py-16 px-4 sm:px-8 max-w-[1120px] mx-auto text-[var(--ink)] bg-[var(--paper)]">
      {/* Header & Controls */}
      <header className="border-b border-[var(--rule)] pb-8 mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] mb-2 font-medium">
            Internal Verification Route &middot; Noindex
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-[var(--ink-muted)]">Sub-routes:</span>
            <a
              href="/styleguide/motion"
              className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)] hover:underline font-semibold"
            >
              <span>Motion Tokens &amp; Variants (Prompt 2b) &rarr;</span>
            </a>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
            Design System &amp; Styleguide
          </h1>
          <p className="mt-2 text-[var(--ink-muted)] text-base max-w-[58ch]">
            Specification verification for the editorial portfolio of Kartik Koundal.
            All tokens, typography scales, contrast ratios, and component states.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex border border-[var(--rule)] rounded-[4px] p-0.5 bg-[var(--surface)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setManualTheme("light")}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                themeMode === "light"
                  ? "bg-[var(--paper)] text-[var(--ink)] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Light (Paper)
            </button>
            <button
              type="button"
              onClick={() => setManualTheme("dark")}
              className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                themeMode === "dark"
                  ? "bg-[var(--paper)] text-[var(--ink)] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              Dark (Hand-Tuned)
            </button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* 1. Color Palette & Verification */}
      <section className="mb-20">
        <div className="border-b border-[var(--rule)] pb-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)]">
            01 / Color Palette
          </span>
          <h2 className="font-serif text-2xl font-semibold mt-1">Palette Tokens</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Restrained paper/ink palette. Strictly zero blue, indigo, violet, purple, or pink. Currently showing:{" "}
            <span className="font-mono font-semibold text-[var(--accent)] uppercase">{themeMode} Theme</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          <div className="border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]">
            <div
              className="w-full h-12 rounded-[2px] border border-[var(--rule)] mb-3"
              style={{ backgroundColor: themeMode === "light" ? "#FAFAF7" : "#111315" }}
            />
            <div className="font-mono text-xs font-semibold">paper</div>
            <div className="font-mono text-[11px] text-[var(--ink-muted)]">
              {themeMode === "light" ? "#FAFAF7 (Active)" : "#111315 (Active)"}
            </div>
          </div>

          <div className="border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]">
            <div
              className="w-full h-12 rounded-[2px] border border-[var(--rule)] mb-3"
              style={{ backgroundColor: themeMode === "light" ? "#F3F2EC" : "#181B1E" }}
            />
            <div className="font-mono text-xs font-semibold">surface</div>
            <div className="font-mono text-[11px] text-[var(--ink-muted)]">
              {themeMode === "light" ? "#F3F2EC (Active)" : "#181B1E (Active)"}
            </div>
          </div>

          <div className="border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]">
            <div
              className="w-full h-12 rounded-[2px] border border-[var(--rule)] mb-3"
              style={{ backgroundColor: themeMode === "light" ? "#DAD8CF" : "#2A2E32" }}
            />
            <div className="font-mono text-xs font-semibold">rule</div>
            <div className="font-mono text-[11px] text-[var(--ink-muted)]">
              {themeMode === "light" ? "#DAD8CF (Active)" : "#2A2E32 (Active)"}
            </div>
          </div>

          <div className="border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]">
            <div
              className="w-full h-12 rounded-[2px] border border-[var(--rule)] mb-3"
              style={{ backgroundColor: themeMode === "light" ? "#16181D" : "#E9E8E3" }}
            />
            <div className="font-mono text-xs font-semibold">ink</div>
            <div className="font-mono text-[11px] text-[var(--ink-muted)]">
              {themeMode === "light" ? "#16181D (Active)" : "#E9E8E3 (Active)"}
            </div>
          </div>

          <div className="border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]">
            <div
              className="w-full h-12 rounded-[2px] border border-[var(--rule)] mb-3"
              style={{ backgroundColor: themeMode === "light" ? "#5A5F69" : "#A2A7AE" }}
            />
            <div className="font-mono text-xs font-semibold">ink-muted</div>
            <div className="font-mono text-[11px] text-[var(--ink-muted)]">
              {themeMode === "light" ? "#5A5F69 (Active)" : "#A2A7AE (Active)"}
            </div>
          </div>

          <div className="border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]">
            <div
              className="w-full h-12 rounded-[2px] border border-[var(--rule)] mb-3"
              style={{ backgroundColor: themeMode === "light" ? "#1B6B4F" : "#5FB38F" }}
            />
            <div className="font-mono text-xs font-semibold">accent</div>
            <div className="font-mono text-[11px] text-[var(--ink-muted)]">
              {themeMode === "light" ? "#1B6B4F (Active)" : "#5FB38F (Active)"}
            </div>
          </div>
        </div>

        {/* Contrast Table */}
        <div className="border border-[var(--rule)] rounded-[4px] overflow-hidden">
          <div className="bg-[var(--surface)] px-4 py-3 border-b border-[var(--rule)] flex justify-between items-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
              Programmatically Computed WCAG Contrast Ratios ({themeMode === "light" ? "Light Theme" : "Dark Theme"})
            </span>
            <span className="font-mono text-[11px] text-[var(--accent)] font-medium">
              Verified Against Brief Criteria
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--rule)] bg-[var(--surface)]/50 font-mono text-xs text-[var(--ink-muted)]">
                  <th className="py-2.5 px-4 font-medium">Element</th>
                  <th className="py-2.5 px-4 font-medium">Foreground</th>
                  <th className="py-2.5 px-4 font-medium">Background</th>
                  <th className="py-2.5 px-4 font-medium">Computed Ratio</th>
                  <th className="py-2.5 px-4 font-medium">Requirement</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule)]">
                {(themeMode === "light" ? lightContrastData : darkContrastData).map((row, i) => (
                  <tr key={i} className="hover:bg-[var(--surface)]/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--ink)]">{row.element}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-[var(--rule)]"
                        style={{ backgroundColor: row.foreground.hex }}
                      />
                      {row.foreground.name} ({row.foreground.hex})
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-[var(--rule)]"
                        style={{ backgroundColor: row.background.hex }}
                      />
                      {row.background.name} ({row.background.hex})
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--ink)]">
                      {row.ratio}:1
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--ink-muted)]">
                      {row.targetRequirement}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)] font-semibold">
                        <Check size={14} strokeWidth={2.5} /> PASS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Typography Scale */}
      <section className="mb-20">
        <div className="border-b border-[var(--rule)] pb-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)]">
            02 / Typography Hierarchy
          </span>
          <h2 className="font-serif text-2xl font-semibold mt-1">Font Families &amp; Scale</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Source Serif 4 for headings, IBM Plex Sans for body/UI, IBM Plex Mono for code &amp; metadata.
          </p>
        </div>

        <div className="space-y-8">
          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              clamp(2.75rem, 6vw, 4.5rem) / Source Serif 4 / Hero Name
            </div>
            <div className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight">
              Kartik Koundal
            </div>
          </div>

          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              2.5rem (40px) / Source Serif 4 / Case Study Title
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-normal leading-[1.15]">
              TEJOVIK: Student Performance &amp; Wellness Platform
            </div>
          </div>

          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              1.75rem (28px) / Source Serif 4 / Section Heading (H2)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-[1.2]">
              Selected Engineering Projects
            </h2>
          </div>

          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              1.25rem (20px) / Source Serif 4 / Subsection (H3) or Project Row Title
            </div>
            <h3 className="font-serif text-xl font-medium leading-[1.3]">
              Student Organizer &mdash; Native Android Academic Management
            </h3>
          </div>

          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              1.0625rem (17px) / IBM Plex Sans / Body (max measure: 62ch, line-height: 1.65)
            </div>
            <p className="text-base text-[var(--ink)] max-w-[62ch] leading-[1.65]">
              Computer Science undergraduate at Dronacharya College of Engineering, building web applications in Python and JavaScript and Android apps in Kotlin. The site is designed with restraint and intention, prioritizing clean engineering, accessible code, and measurable performance.
            </p>
          </div>

          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              0.9375rem (15px) / IBM Plex Sans / Secondary UI &amp; Navigation
            </div>
            <p className="text-sm text-[var(--ink-muted)]">
              Navigation items, descriptive captions, and secondary explanatory notes.
            </p>
          </div>

          <div className="border-b border-[var(--rule)] pb-6">
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              0.8125rem (13px) / IBM Plex Mono / Dates &amp; Timestamps
            </div>
            <p className="font-mono text-[13px] text-[var(--ink-muted)]">
              2024 &mdash; 2028 &middot; B.Tech CSE &middot; CGPA 7.55 / 10
            </p>
          </div>

          <div>
            <div className="font-mono text-xs text-[var(--ink-muted)] mb-1">
              0.75rem (12px) / IBM Plex Mono / Uppercase Tracked Tags (tracking: 0.06em)
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              STATUS: OPEN TO SOFTWARE AND ANDROID INTERNSHIPS
            </p>
          </div>
        </div>
      </section>

      {/* 3. Buttons, Links & Focus States */}
      <section className="mb-20">
        <div className="border-b border-[var(--rule)] pb-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)]">
            03 / Components &amp; Interactivity
          </span>
          <h2 className="font-serif text-2xl font-semibold mt-1">Buttons, Links &amp; Focus Ring</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Border radius 4px for buttons, touch targets &ge; 44px, visible 2px accent focus ring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Buttons */}
          <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-4">
              Button Elements (Radius 4px, min 44px touch)
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-sm font-medium hover:opacity-90 cursor-pointer transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                <Download size={18} strokeWidth={1.5} aria-hidden="true" />
                Download Resume (PDF)
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium hover:border-[var(--ink)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                Contact Me
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-4">
              Inline &amp; Semantic Links
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <a
                  href="#test"
                  className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline underline-offset-4 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                >
                  <span>Read TEJOVIK case study</span>
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
              <div>
                <a
                  href="https://github.com/Kartikk-git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--ink)] hover:text-[var(--accent)] hover:underline underline-offset-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                >
                  <span>github.com/Kartikk-git</span>
                  <ExternalLink size={16} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Ring & Input */}
        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)] mb-8">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2">
            Focus Ring Specification (2px Accent with 2px Offset)
          </h3>
          <p className="text-xs text-[var(--ink-muted)] mb-4 max-w-[62ch]">
            Tab to the input field and button below to inspect the keyboard focus ring indicator.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md">
            <input
              type="text"
              placeholder="Test keyboard focus ring..."
              aria-label="Test keyboard focus ring"
              className="px-3.5 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-sm focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 w-full"
            />
            <button
              type="button"
              className="px-4 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-sm font-medium hover:border-[var(--ink)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 shrink-0"
            >
              Test Focus
            </button>
          </div>
        </div>
      </section>

      {/* 4. Tag Style (No Rounded Pills!) */}
      <section className="mb-20">
        <div className="border-b border-[var(--rule)] pb-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)]">
            04 / Tag Style
          </span>
          <h2 className="font-serif text-2xl font-semibold mt-1">Plain Mono Text Separated by Slashes</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Tags are plain monospace text separated by slashes, strictly avoiding rounded badge pills.
          </p>
        </div>

        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
          <div className="font-mono text-xs text-[var(--ink-muted)] mb-2">Technical Stack Specification:</div>
          <div className="font-mono text-sm text-[var(--ink)]">
            Python <span className="text-[var(--rule)]">/</span> Flask <span className="text-[var(--rule)]">/</span> JavaScript <span className="text-[var(--rule)]">/</span> Chart.js <span className="text-[var(--rule)]">/</span> HTML <span className="text-[var(--rule)]">/</span> CSS
          </div>
          <div className="font-mono text-sm text-[var(--ink)] mt-3">
            Kotlin <span className="text-[var(--rule)]">/</span> Jetpack Compose <span className="text-[var(--rule)]">/</span> Material 3 <span className="text-[var(--rule)]">/</span> Room <span className="text-[var(--rule)]">/</span> Coroutines
          </div>
        </div>
      </section>

      {/* 5. Project Row Pattern */}
      <section className="mb-20">
        <div className="border-b border-[var(--rule)] pb-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)]">
            05 / Project Row Pattern
          </span>
          <h2 className="font-serif text-2xl font-semibold mt-1">Index, Title, Description, Stack, Links</h2>
          <p className="text-sm text-[var(--ink-muted)] mt-1">
            Horizontal row layout with 150ms 4px hover shift and arrow reveal &mdash; NOT a boxed card grid.
          </p>
        </div>

        <div className="border-t border-b border-[var(--rule)] divide-y divide-[var(--rule)]">
          <article className="group py-6 transition-transform duration-150 ease-out hover:translate-x-1 cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8">
              <div className="flex items-baseline gap-4 min-w-[240px]">
                <span className="font-mono text-xs text-[var(--ink-muted)]">01</span>
                <h3 className="font-serif text-xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  {tejovik.title}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] px-1.5 py-0.5 border border-[var(--accent)]/30 rounded-[2px]">
                  Flagship
                </span>
              </div>

              <p className="text-sm text-[var(--ink-muted)] flex-1 max-w-[55ch]">
                {tejovik.description}
              </p>

              <div className="flex items-center gap-4 pt-2 md:pt-0">
                <a
                  href={tejovik.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                  aria-label={`${tejovik.title} GitHub repository`}
                >
                  <span>Code</span>
                  <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)] font-medium">
                  <span>Case Study</span>
                  <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </div>
            </div>

            <div className="mt-3 pl-8 md:pl-8 font-mono text-xs text-[var(--ink-muted)]">
              {tejovik.stack.join(" / ")}
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--rule)] pt-8 mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--ink-muted)] font-mono">
        <div>Kartik Koundal &middot; Styleguide &amp; System Verification</div>
        <div className="mt-2 sm:mt-0">Stage 1: Architecture &amp; Tokens</div>
      </footer>
    </main>
  );
}

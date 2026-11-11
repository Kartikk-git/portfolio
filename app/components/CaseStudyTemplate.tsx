"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Layers, CheckCircle2, Download } from "lucide-react";
import { Github } from "./Icons";
import { Project } from "@/content/projects";
import { Header } from "./Header";

interface CaseStudyTemplateProps {
  project: any;
  prevProject?: { title: string; href: string };
  nextProject?: { title: string; href: string };
  roomEntities?: readonly string[];
}

// Anti-duplication copy definitions derived strictly from AGENTS.md and approved in docs/polish-audit.md
const caseStudyCopy: Record<
  string,
  {
    inBrief: string;
    narrativeBuilt: string;
    stackRationale: { name: string; rationale: string }[];
    detailedFeatures: { title: string; detail: string }[];
  }
> = {
  tejovik: {
    inBrief:
      "TEJOVIK correlates academic performance trends with daily student wellness habits through multi-period time-series charts. The custom CHETVIK calculation estimates cognitive readiness and burnout risk directly from reported study hours, sleep duration, and self-assessed stress levels.",
    narrativeBuilt:
      "Students frequently struggle to identify how study routines, sleep deficits, and exam pressures compound into burnout. TEJOVIK was built as a unified web platform to track these dynamics side-by-side, pairing modular Flask view routing with interactive client-side visual telemetry to help students self-regulate their academic schedule.",
    stackRationale: [
      {
        name: "Python & Flask",
        rationale: "Powers modular application routes, view template rendering, and scoring logic endpoints.",
      },
      {
        name: "Chart.js & JavaScript",
        rationale: "Renders client-side time-series graphs for weekly, monthly, and all-time performance analysis.",
      },
      {
        name: "HTML5 & CSS3",
        rationale: "Delivers structured semantic layouts responsive across mobile and desktop displays.",
      },
    ],
    detailedFeatures: [
      {
        title: "Modular dashboard views",
        detail:
          "Dedicated navigation sections for Home, Performance, CHETVIK, and Mind Boost organize academic statistics and wellness guidance into distinct functional views.",
      },
      {
        title: "Time-range charting",
        detail:
          "Chart.js renders weekly, monthly, and cumulative academic trends with interactive client-side range filtering.",
      },
      {
        title: "CHETVIK cognitive scoring",
        detail:
          "Computes an indexed readiness score and visual burnout gauge by evaluating study hours, sleep duration, and stress levels against rule-based thresholds.",
      },
      {
        title: "Assistance interface",
        detail:
          "Built-in chat feature serves backend responses with automated client-side fallback replies during connection interrupts.",
      },
      {
        title: "Daily focus & responsive layouts",
        detail:
          "Features daily curated thought displays and fluid layout grids tested for desktop and mobile viewports.",
      },
    ],
  },
  "student-organizer": {
    inBrief:
      "Student Organizer provides a zero-latency, local-only academic planner that consolidates course schedules, assignments, exams, and attendance records. An interactive Jetpack Compose calendar allows direct daily status logging with immediate attendance percentage computation and threshold alerts.",
    narrativeBuilt:
      "Academic tracking apps often demand cloud accounts and steady network access for basic utility. Student Organizer solves this through an offline-first architecture, organizing courses, assignments, and attendance metrics strictly within a local Room database without remote server dependencies.",
    stackRationale: [
      {
        name: "Kotlin & Coroutines",
        rationale:
          "Handles asynchronous Room database queries, background state management, and thread-safe data streams.",
      },
      {
        name: "Jetpack Compose (Material 3)",
        rationale:
          "Implements modern declarative components, including the interactive monthly attendance calendar.",
      },
      {
        name: "Room Database",
        rationale:
          "Enforces full on-device SQLite persistence so 100% of student records stay private on hardware.",
      },
      {
        name: "ViewBinding & ViewPager2",
        rationale:
          "Coordinates classic view navigation and swipeable viewports alongside Compose screens.",
      },
      {
        name: "Gradle KTS",
        rationale:
          "Provides type-safe Kotlin DSL dependency management and modular build pipelines.",
      },
    ],
    detailedFeatures: [
      {
        title: "Centralized dashboard",
        detail:
          "Aggregates urgent assignments, live attendance averages, upcoming exams, and active course entries into a unified glanceable view.",
      },
      {
        title: "Course management",
        detail:
          "Catalogs courses with course codes, assigned instructors, lecture hours, and classroom locations.",
      },
      {
        title: "Assignment tracking",
        detail:
          "Manages task deliverables with completion toggle states and priority ratings.",
      },
      {
        title: "Searchable local notes",
        detail:
          "Organizes subject notes into searchable, categorized local records stored in Room.",
      },
      {
        title: "Interactive attendance calendar",
        detail:
          "Jetpack Compose calendar detects date taps to record Present or Absent marks, dynamically calculating attendance ratios and triggering low-attendance warnings when rates drop below required thresholds.",
      },
      {
        title: "Exam & milestone scheduling",
        detail:
          "Records exam dates, quiz sessions, and project submission deadlines with calendar association.",
      },
      {
        title: "Local authentication & onboarding",
        detail:
          "Welcomes students with an introductory walkthrough and password-protected local authentication.",
      },
    ],
  },
};

export function CaseStudyTemplate({
  project,
  prevProject,
  nextProject,
  roomEntities,
}: CaseStudyTemplateProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const enriched = caseStudyCopy[project.slug];

  const sections = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "built", label: "What I Built" },
      { id: "stack", label: "Stack & Architecture" },
      ...(roomEntities ? [{ id: "entities", label: "Room Entities" }] : []),
      ...(project.whatILearned ? [{ id: "learned", label: "What I Learned" }] : []),
      { id: "links", label: "Repository & Links" },
    ],
    [roomEntities, project.whatILearned]
  );

  useEffect(() => {
    const handleScroll = () => {
      // Check if near bottom of page -> activate last section
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isAtBottom && sections.length > 0) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      // Check which section is nearest / under the sticky header (offset 112px)
      let current = sections[0]?.id || "overview";
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 112) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const handleAsideClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      el.focus({ preventScroll: true });
      if (typeof window !== "undefined" && window.history) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-8 py-12 md:py-20 w-full">
        {/* Back navigation - strictly to / with clean address bar */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Case Study Header */}
        <header className="border-b border-[var(--rule)] pb-10 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
              Case Study
            </span>
            {project.isFlagship && (
              <>
                <span className="text-[var(--rule)]">&middot;</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] px-1.5 py-0.5 border border-[var(--accent)]/40 rounded-[2px] font-medium">
                  Flagship Platform
                </span>
              </>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--ink)] leading-[1.2] mb-3">
            {project.title}
          </h1>

          <p className="font-sans text-sm sm:text-base text-[var(--ink-muted)] max-w-[62ch] leading-relaxed">
            {project.subtitle}
          </p>

          <div className="pt-6 font-mono text-xs text-[var(--ink-muted)]">
            Stack: {(project.stack || project.tags || []).join(" / ")}
          </div>
        </header>

        {/* Main Content with Sticky Section Index */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Sticky Section Index (Scroll-Spy) in Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-20">
            <nav
              className="space-y-1 font-mono text-xs border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]/40 backdrop-blur-xs"
              aria-label="Case Study Contents"
            >
              <div className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-muted)] font-semibold mb-3">
                Contents
              </div>
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => handleAsideClick(e, sec.id)}
                  className={`block py-1.5 px-2 rounded-[2px] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                    activeSection === sec.id
                      ? "text-[var(--accent)] font-semibold bg-[var(--surface)]"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content Body */}
          <div className="md:col-span-8 lg:col-span-9 space-y-16">
            {/* Section 1: Overview - Replaced with In Brief synthesis per §10 */}
            <section id="overview" className="scroll-mt-24 space-y-4">
              <div className="flex items-baseline justify-between border-b border-[var(--rule)] pb-2">
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)]">
                  Overview
                </h2>
                <span className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                  In brief
                </span>
              </div>
              <p className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed max-w-[62ch]">
                {enriched?.inBrief || project.description}
              </p>
            </section>

            {/* Section 2: What I Built - Orientation prose per §10 */}
            <section id="built" className="scroll-mt-24 space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                What I Built
              </h2>

              <p className="font-sans text-sm sm:text-[15px] text-[var(--ink-muted)] leading-relaxed max-w-[62ch]">
                {enriched?.narrativeBuilt || project.whatIBuild}
              </p>

              {/* Core Features with Continuation Lines */}
              <div className="border border-[var(--rule)] rounded-[4px] p-6 bg-[var(--surface)]/30 space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
                  Core Functionality &amp; Architectural Flow
                </h3>
                <ul className="space-y-4 font-sans text-base leading-[1.65] text-[var(--ink)]">
                  {enriched?.detailedFeatures ? (
                    enriched.detailedFeatures.map((item, idx) => (
                      <li key={idx} className="space-y-1">
                        <div className="font-semibold text-[var(--ink)] flex items-start gap-2">
                          <span className="font-mono text-xs text-[var(--accent)] mt-0.5 select-none font-bold">
                            &mdash;
                          </span>
                          <span>{item.title}</span>
                        </div>
                        <p className="font-sans text-base text-[var(--ink-muted)] pl-4 leading-[1.65] max-w-[60ch]">
                          {item.detail}
                        </p>
                      </li>
                    ))
                  ) : (
                    project.features?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs text-[var(--accent)] mt-0.5 select-none font-bold">
                          &mdash;
                        </span>
                        <span className="leading-[1.65]">{feature}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </section>

            {/* Section 3: Stack & Architecture with Rationale */}
            <section id="stack" className="scroll-mt-24 space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                Stack &amp; Architecture
              </h2>

              <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]/30 space-y-6">
                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">
                    Technologies &amp; Engineering Rationale
                  </div>
                  <div className="divide-y divide-[var(--rule)] font-sans text-base leading-[1.65]">
                    {enriched?.stackRationale ? (
                      enriched.stackRationale.map((tech, idx) => (
                        <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                          <span className="font-mono text-xs font-semibold text-[var(--ink)] min-w-[180px]">
                            {tech.name}
                          </span>
                          <span className="text-base text-[var(--ink-muted)] leading-[1.65]">
                            {tech.rationale}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="font-mono text-xs text-[var(--ink)]">
                        {(project.stack || project.tags || []).join(" / ")}
                      </div>
                    )}
                  </div>
                </div>

                {project.architecture && (
                  <div className="pt-4 border-t border-[var(--rule)] space-y-2">
                    <div className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">
                      Architectural Decisions
                    </div>
                    <ul className="space-y-2 font-sans text-base leading-[1.65] text-[var(--ink)]">
                      {project.architecture.map((arch: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono text-xs text-[var(--accent)] select-none">
                            &bull;
                          </span>
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Section 4: Room Entities (for Student Organizer) */}
            {roomEntities && (
              <section id="entities" className="scroll-mt-24 space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                  Room Persistence Entities
                </h2>
                <p className="text-base text-[var(--ink-muted)] leading-[1.65]">
                  The application enforces an offline-first architecture where 100% of student data stays locally on the physical Android device. Structured schema entities:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {roomEntities.map((entity) => (
                    <div
                      key={entity}
                      className="p-3 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] font-mono text-xs flex items-center gap-2"
                    >
                      <Layers size={14} className="text-[var(--accent)] shrink-0" />
                      <span className="font-semibold text-[var(--ink)]">{entity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Screenshots Frame Notice: Omitted until real images provided by owner */}
            {/* 
              TODO(owner): Add real application screenshots in /public/projects/${project.slug}/ 
              to enable the scrollytelling visual frame in ruled borders.
            */}

            {/* Section: What I Learned */}
            {project.whatILearned && (
              <section id="learned" className="scroll-mt-24 space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                  What I Learned
                </h2>
                <ul className="space-y-3 font-sans text-base leading-[1.65] text-[var(--ink)] max-w-[62ch]">
                  {project.whatILearned.map((lesson: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-[var(--accent)] mt-0.5 select-none font-bold">
                        &mdash;
                      </span>
                      <span className="leading-[1.65]">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Section 5: Repository & Links */}
            <section id="links" className="scroll-mt-24 space-y-4 pt-4 border-t border-[var(--rule)]">
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">
                Repository &amp; Proof
              </h2>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {(project.repoUrl || project.links?.source) && (
                  <a
                    href={project.repoUrl || project.links?.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 cursor-pointer transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <Github size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span>View GitHub Repository</span>
                  </a>
                )}

                {(project.liveUrl || project.links?.live) && (
                  <a
                    href={project.liveUrl || project.links?.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--ink)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
                    <span>Visit Live Demo</span>
                  </a>
                )}

                {(project.apkReleaseUrl || project.links?.apk) && (
                  <a
                    href={project.apkReleaseUrl || project.links?.apk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-medium hover:bg-[var(--accent)] hover:text-[var(--paper)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <Download size={14} strokeWidth={1.5} aria-hidden="true" />
                    <span>Download Android APK</span>
                  </a>
                )}
              </div>
            </section>

            {/* Previous / Next Project Navigation */}
            <nav
              className="pt-12 border-t border-[var(--rule)] flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs"
              aria-label="Project Navigation"
            >
              {prevProject ? (
                <Link
                  href={prevProject.href}
                  className="inline-flex items-center gap-1.5 text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  <ArrowLeft size={14} strokeWidth={1.5} />
                  <span>Previous: {prevProject.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {nextProject && (
                <Link
                  href={nextProject.href}
                  className="inline-flex items-center gap-1.5 text-[var(--accent)] font-semibold hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  <span>Next: {nextProject.title}</span>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              )}
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

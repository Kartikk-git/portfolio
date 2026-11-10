"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Layers } from "lucide-react";
import { Github } from "./Icons";
import { Project } from "@/content/projects";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface CaseStudyTemplateProps {
  project: Project;
  prevProject?: { title: string; href: string };
  nextProject?: { title: string; href: string };
  roomEntities?: readonly string[];
}

export function CaseStudyTemplate({
  project,
  prevProject,
  nextProject,
  roomEntities,
}: CaseStudyTemplateProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "built", label: "What I Built" },
    { id: "stack", label: "Stack & Architecture" },
    ...(roomEntities ? [{ id: "entities", label: "Room Entities" }] : []),
    ...(project.whatILearned ? [{ id: "learned", label: "What I Learned" }] : []),
    { id: "links", label: "Repository & Links" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1120px] mx-auto px-4 sm:px-8 py-12 md:py-20 w-full">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/#projects"
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

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] leading-[1.15] mb-4">
            {project.title}
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {project.subtitle}
          </p>

          <div className="pt-6 font-mono text-xs text-[var(--ink-muted)]">
            Stack: {project.stack.join(" / ")}
          </div>
        </header>

        {/* Main Content with Sticky Section Index */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky Section Index (Scroll-Spy) */}
          <aside className="lg:col-span-3">
            <nav
              className="lg:sticky lg:top-24 space-y-1 font-mono text-xs border border-[var(--rule)] p-4 rounded-[4px] bg-[var(--surface)]/30"
              aria-label="Case Study Contents"
            >
              <div className="text-[11px] uppercase tracking-[0.06em] text-[var(--ink-muted)] font-semibold mb-3">
                Contents
              </div>
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
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
          <div className="lg:col-span-9 space-y-16">
            {/* Section 1: Overview */}
            <section id="overview" className="scroll-mt-24 space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                Overview
              </h2>
              <p className="text-base sm:text-lg text-[var(--ink)] leading-[1.65] max-w-[62ch]">
                {project.description}
              </p>
            </section>

            {/* Section 2: What I Built */}
            <section id="built" className="scroll-mt-24 space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                What I Built
              </h2>

              {project.whatIBuild && (
                <p className="text-sm sm:text-base text-[var(--ink-muted)] leading-[1.65]">
                  {project.whatIBuild}
                </p>
              )}

              {project.features && (
                <div className="border border-[var(--rule)] rounded-[4px] p-6 bg-[var(--surface)]/30 space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
                    Core Functionality &amp; Features
                  </h3>
                  <ul className="space-y-3 font-sans text-sm text-[var(--ink)]">
                    {project.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs text-[var(--accent)] mt-0.5 select-none font-bold">
                          &mdash;
                        </span>
                        <span className="leading-[1.6]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Section 3: Stack & Architecture */}
            <section id="stack" className="scroll-mt-24 space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                Stack &amp; Architecture
              </h2>

              <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]/30 space-y-4">
                <div className="font-mono text-xs uppercase text-[var(--ink-muted)] font-semibold">
                  Technologies Employed
                </div>
                <div className="font-mono text-sm text-[var(--ink)]">
                  {project.stack.join(" / ")}
                </div>

                {project.architecture && (
                  <div className="pt-4 border-t border-[var(--rule)] space-y-2">
                    <div className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">
                      Architectural Decisions
                    </div>
                    <ul className="space-y-2 font-sans text-sm text-[var(--ink)]">
                      {project.architecture.map((arch, idx) => (
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
                <p className="text-sm text-[var(--ink-muted)]">
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

            {/* What I learned is supplied per project via content/projects.ts (whatILearned). */}

            {/* Section: What I Learned */}
            {project.whatILearned && (
              <section id="learned" className="scroll-mt-24 space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-[var(--ink)] border-b border-[var(--rule)] pb-2">
                  What I Learned
                </h2>
                <ul className="space-y-3 font-sans text-sm text-[var(--ink)] max-w-[62ch]">
                  {project.whatILearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-[var(--accent)] mt-0.5 select-none font-bold">
                        &mdash;
                      </span>
                      <span className="leading-[1.6]">{lesson}</span>
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
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono font-medium hover:opacity-90 cursor-pointer transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <Github size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span>View GitHub Repository</span>
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--ink)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
                    <span>Visit Live Demo</span>
                  </a>
                )}
                {/* 
                  TODO(owner): Add APK GitHub Release URL once release is published. 
                  Upload.app links are strictly prohibited by AGENTS.md. 
                */}
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

      <Footer />
    </div>
  );
}

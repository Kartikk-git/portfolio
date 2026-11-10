"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { m, useInView } from "motion/react";
import { ArrowUpRight, ExternalLink, ChevronDown } from "lucide-react";
import { projects, Project } from "@/content/projects";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";

interface ProjectsSectionProps {
  activeSkill?: string | null;
}

export function ProjectsSection({ activeSkill }: ProjectsSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const toggleAccordion = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)]"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              01 / Engineering Works
            </span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              4 Projects &middot; 2 Case Studies
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Selected Projects
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch]">
            Web backends, real-time analytics dashboards, and offline-first native Android applications.
          </p>

          {/* Section 1px Rule drawing left-to-right (scaleX 0 to 1, 600ms) */}
          <div className="pt-6">
            <m.div
              variants={ruleDrawVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-[1px] w-full bg-[var(--rule)]"
            />
          </div>
        </div>

        {/* Project Rows List (Not a card grid!) */}
        <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
          {projects.map((project, index) => {
            const isMatch =
              !activeSkill ||
              project.stack.some(
                (s) => s.toLowerCase() === activeSkill.toLowerCase()
              );

            const isExpanded = expandedSlug === project.slug;

            return (
              <m.article
                key={project.slug}
                variants={revealVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={index}
                style={{
                  opacity: isMatch ? 1 : 0.35,
                  transition: "opacity 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className="group relative py-8 md:py-10 transition-colors"
              >
                {/* Desktop & Mobile Main Row Content */}
                <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4 lg:gap-8">
                  {/* Index + Title */}
                  <div className="flex items-baseline gap-4 min-w-[280px]">
                    <span className="font-mono text-xs text-[var(--ink-muted)] tabular-nums">
                      0{index + 1}
                    </span>

                    <div className="flex items-baseline gap-3">
                      {project.hasCaseStudy ? (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] group-hover:translate-x-1.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                        >
                          {project.title}
                        </Link>
                      ) : (
                        <span className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] group-hover:translate-x-1.5 transition-all duration-150">
                          {project.title}
                        </span>
                      )}

                      {project.isFlagship && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] px-1.5 py-0.5 border border-[var(--accent)]/40 rounded-[2px] font-medium">
                          Flagship
                        </span>
                      )}
                    </div>
                  </div>

                  {/* One-Line Description */}
                  <div className="flex-1 max-w-[62ch]">
                    <p className="text-sm text-[var(--ink-muted)] leading-[1.6]">
                      {project.description}
                    </p>
                  </div>

                  {/* Links & Actions */}
                  <div className="flex items-center gap-4 shrink-0 pt-2 lg:pt-0">
                    {/* Repo Link */}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                        aria-label={`${project.title} GitHub repository`}
                      >
                        <span>Code</span>
                        <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    )}

                    {/* Live Demo Link (only if verified) */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                        aria-label={`${project.title} live website`}
                      >
                        <span>Live</span>
                        <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                      </a>
                    )}

                    {/* Case Study Link */}
                    {project.hasCaseStudy && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent)] font-medium hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
                      >
                        <span>Case study</span>
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.5}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    )}

                    {/* Mobile Touch Accordion Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(project.slug)}
                      className="lg:hidden p-1.5 border border-[var(--rule)] rounded-[4px] text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                      aria-label={`Toggle details for ${project.title}`}
                      aria-expanded={isExpanded}
                    >
                      <ChevronDown
                        size={14}
                        strokeWidth={1.5}
                        className={`transition-transform duration-150 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Stack in mono separated by slashes */}
                <div className="mt-4 pl-8 lg:pl-10 font-mono text-xs text-[var(--ink-muted)]">
                  {project.stack.map((item, i) => (
                    <span key={item}>
                      <span
                        className={
                          activeSkill &&
                          item.toLowerCase() === activeSkill.toLowerCase()
                            ? "text-[var(--accent)] font-bold"
                            : ""
                        }
                      >
                        {item}
                      </span>
                      {i < project.stack.length - 1 && (
                        <span className="text-[var(--rule)] mx-1.5" aria-hidden="true">
                          /
                        </span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Touch Accordion Details (Expanded on Mobile) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--rule)]/60 pl-8 lg:hidden space-y-3 font-sans text-xs text-[var(--ink-muted)]">
                    <div className="font-mono uppercase text-[11px] text-[var(--accent)]">
                      {project.subtitle}
                    </div>
                    {project.features && (
                      <ul className="list-disc list-inside space-y-1">
                        {project.features.slice(0, 3).map((f, fi) => (
                          <li key={fi}>{f}</li>
                        ))}
                      </ul>
                    )}
                    {project.hasCaseStudy && (
                      <div className="pt-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--accent)]"
                        >
                          <span>Open full case study &rarr;</span>
                        </Link>
                      </div>
                    )}
                    {/* TODO(owner): Add real project screenshots in /public/projects/<slug>/ */}
                  </div>
                )}
              </m.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


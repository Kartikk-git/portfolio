"use client";

import React, { useState, useEffect, useRef } from "react";
import { m, useInView } from "motion/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projectsContent, ProjectItem } from "@/content/projects";
import { ruleDrawVariants, revealVariants } from "@/lib/motion";
import { ProjectDetail } from "./ProjectDetail";

interface ProjectsSectionProps {
  isReviewMode?: boolean;
}

export function ProjectsSection({ isReviewMode = false }: ProjectsSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Check URL hash on load and popstate
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#project/")) {
        const slug = hash.replace("#project/", "");
        const matched = projectsContent.items.find((p) => p.slug === slug);
        if (matched) {
          setSelectedProject(matched);
        }
      } else {
        setSelectedProject(null);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const openProject = (project: ProjectItem) => {
    setSelectedProject(project);
    window.location.hash = `#project/${project.slug}`;
  };

  const closeProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith("#project/")) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-20 md:py-28 border-b border-[var(--rule)] scroll-mt-16"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <div className="font-mono text-xs uppercase tracking-[0.06em]">
              <span className="text-[var(--accent)] font-semibold">{projectsContent.eyebrow}</span>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {projectsContent.counter}
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--ink)]">
            {projectsContent.heading}
          </h2>

          <p className="mt-2 text-sm text-[var(--ink-muted)] max-w-[62ch] leading-[1.6]">
            {projectsContent.intro}
          </p>

          {/* Section Divider Line with Classic Editorial Accent Rule */}
          <div className="pt-6 relative">
            <m.div
              variants={ruleDrawVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="h-[1px] w-full bg-[var(--rule)]"
            />
            <div className="absolute left-0 bottom-0 h-[2px] w-12 bg-[var(--accent)] z-10" />
          </div>
        </div>

        {/* Project Cards List */}
        <div className="space-y-4">
          {projectsContent.items.map((project, index) => {
            return (
              <m.article
                key={project.id}
                variants={revealVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={index}
                onClick={() => openProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProject(project);
                  }
                }}
                className="group relative border border-[var(--rule)] rounded-[4px] bg-[var(--surface)]/30 hover:border-[var(--accent)]/60 hover:bg-[var(--surface)]/60 p-5 sm:p-6 transition-all duration-160 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                {/* Top Row: Index + Title + Badges (Left) vs Detail CTA (Right) */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-[var(--rule)]/50">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-xs text-[var(--accent)] font-semibold tabular-nums">
                      0{index + 1}
                    </span>

                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-160">
                      {project.title}
                    </h3>

                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] px-2 py-0.5 border border-[var(--rule)] rounded-[2px] font-medium bg-[var(--surface)]">
                      {project.badge}
                    </span>

                    {isReviewMode && project.confirmFlags?.contribution && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                        confirm
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[var(--ink-muted)] group-hover:text-[var(--accent)] transition-colors text-xs font-mono">
                    <span>{projectsContent.card.cta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 font-sans text-base leading-[1.65] text-[var(--ink-muted)] max-w-[72ch]">
                  {project.cardText}
                </p>

                {/* Tags and Direct Links Bottom Row */}
                <div className="mt-5 pt-4 border-t border-[var(--rule)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Tag chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] px-2 py-0.5 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink-muted)] rounded-[2px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* External links: Source, Live, Original */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--ink-muted)]"
                  >
                    {project.links.source && (
                      <a
                        href={project.links.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] hover:underline underline-offset-4 inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[2px] p-0.5"
                      >
                        <span>{projectsContent.card.source}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] hover:underline underline-offset-4 inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[2px] p-0.5"
                      >
                        <span>{projectsContent.card.live}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.links.original && (
                      <a
                        href={project.links.original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] hover:underline underline-offset-4 inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)] rounded-[2px] p-0.5"
                      >
                        <span>Original</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </m.article>
            );
          })}
        </div>
      </div>

      {/* Slide-over Project Detail Panel */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={closeProject}
          onSelectProject={(p) => openProject(p)}
          isReviewMode={isReviewMode}
        />
      )}
    </section>
  );
}

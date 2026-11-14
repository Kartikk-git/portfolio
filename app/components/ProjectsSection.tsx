"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { flushSync } from "react-dom";
import { m, AnimatePresence, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projectsContent, ProjectItem } from "@/content/projects";
import { firstRealSlot, mediaManifest } from "@/content/media";
import { revealVariants, transitions } from "@/lib/motion";
import { useMediaQuery, useSaveData } from "@/lib/use-media-query";
import { SKILL_DIM_EVENT, type SkillDimDetail } from "@/lib/skill-dim";
import { startViewTransition, viewTransitionsEnabled, type ViewTransition } from "@/lib/view-transition";
import { Section } from "./Section";

// The modal detail view is a large component that only renders after a
// deliberate user action, so it is code-split out of the initial bundle.
const ProjectDetail = dynamic(
  () => import("./ProjectDetail").then((mod) => mod.ProjectDetail),
  { ssr: false }
);

interface ProjectsSectionProps {
  isReviewMode?: boolean;
}

// Project display sequence: Student Organizer -> MPLAD -> TEJOVIK -> Portfolio -> Hospital Management
const ORDERED_SLUGS = [
  "student-organizer",
  "mplad",
  "tejovik",
  "portfolio-v1",
  "hospital-management",
];

export function ProjectsSection({ isReviewMode = false }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [skillSlugs, setSkillSlugs] = useState<string[] | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeProjectTransitionRef = useRef<ViewTransition | null>(null);
  const lastTriggerCardRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Preview panel gating: hover previews on pointer-fine devices only,
  // inline accordion on touch, never with Save-Data (brief section 7).
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const coarsePointer = useMediaQuery("(hover: none) and (pointer: coarse)");
  const saveData = useSaveData();

  // Vertical timeline line draws as user scrolls through the section
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 50%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Reorder projects according to requested sequence
  const orderedProjects = useMemo(() => {
    return ORDERED_SLUGS.map((slug) =>
      projectsContent.items.find((p) => p.slug === slug)
    ).filter(Boolean) as ProjectItem[];
  }, []);

  // Stack explorer (brief section 4): SkillsSection tells us which projects
  // use the active skill; non-matching cards dim to 35% opacity. Visual only.
  useEffect(() => {
    const onSkillDim = (event: Event) => {
      const detail = (event as CustomEvent<SkillDimDetail>).detail;
      setSkillSlugs(detail?.slugs ?? null);
    };
    window.addEventListener(SKILL_DIM_EVENT, onSkillDim);
    return () => window.removeEventListener(SKILL_DIM_EVENT, onSkillDim);
  }, []);

  // Clean address bar: ensure no hash is pushed
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.startsWith("#project/")) {
      const slug = window.location.hash.replace("#project/", "");
      const matched = projectsContent.items.find((p) => p.slug === slug);
      if (matched) setSelectedProject(matched);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const openProject = (project: ProjectItem, clickedEl?: HTMLElement | null) => {
    // Cancel previous transition mid-transition cleanly
    if (activeProjectTransitionRef.current) {
      try {
        activeProjectTransitionRef.current.skipTransition();
      } catch { }
      activeProjectTransitionRef.current = null;
    }

    // Locate the card element
    const cardEl =
      clickedEl?.closest("article") ||
      (typeof document !== "undefined"
        ? (document.querySelector(`[data-project-card="${project.slug}"]`) as HTMLElement | null)
        : null);

    if (cardEl) {
      lastTriggerCardRef.current = cardEl;
    }

    const prefersReduced = prefersReducedMotion === true;

    // Graceful fallback for unsupported browsers or prefers-reduced-motion
    if (!viewTransitionsEnabled(prefersReduced)) {
      setSelectedProject(project);
      return;
    }

    // Assign shared view-transition-name on card, title, and tags
    if (cardEl) {
      cardEl.style.viewTransitionName = "project-card";
      const title = cardEl.querySelector("h3");
      const tags = cardEl.querySelector("[data-tags-container]");
      if (title) (title as HTMLElement).style.viewTransitionName = "project-title";
      if (tags) (tags as HTMLElement).style.viewTransitionName = "project-tags";
    }

    try {
      const transition = startViewTransition(() => {
        flushSync(() => {
          setSelectedProject(project);
        });
      });
      if (!transition) {
        setSelectedProject(project);
        return;
      }
      activeProjectTransitionRef.current = transition;

      transition.finished
        .catch(() => { })
        .finally(() => {
          if (cardEl) {
            cardEl.style.viewTransitionName = "";
            const title = cardEl.querySelector("h3");
            const tags = cardEl.querySelector("[data-tags-container]");
            if (title) (title as HTMLElement).style.viewTransitionName = "";
            if (tags) (tags as HTMLElement).style.viewTransitionName = "";
          }
          if (activeProjectTransitionRef.current === transition) {
            activeProjectTransitionRef.current = null;
          }
        });
    } catch {
      if (cardEl) {
        cardEl.style.viewTransitionName = "";
        const title = cardEl.querySelector("h3");
        const tags = cardEl.querySelector("[data-tags-container]");
        if (title) (title as HTMLElement).style.viewTransitionName = "";
        if (tags) (tags as HTMLElement).style.viewTransitionName = "";
      }
      setSelectedProject(project);
    }
  };

  const closeProject = () => {
    // Cancel previous transition mid-transition cleanly
    if (activeProjectTransitionRef.current) {
      try {
        activeProjectTransitionRef.current.skipTransition();
      } catch { }
      activeProjectTransitionRef.current = null;
    }

    const cardEl = lastTriggerCardRef.current;
    const prefersReduced = prefersReducedMotion === true;

    // Graceful fallback for unsupported browsers or prefers-reduced-motion
    if (!viewTransitionsEnabled(prefersReduced)) {
      setSelectedProject(null);
      cardEl?.focus();
      return;
    }

    // On close, target card receives the shared view-transition-names
    if (cardEl) {
      cardEl.style.viewTransitionName = "project-card";
      const title = cardEl.querySelector("h3");
      const tags = cardEl.querySelector("[data-tags-container]");
      if (title) (title as HTMLElement).style.viewTransitionName = "project-title";
      if (tags) (tags as HTMLElement).style.viewTransitionName = "project-tags";
    }

    try {
      const transition = startViewTransition(() => {
        flushSync(() => {
          setSelectedProject(null);
        });
      });
      if (!transition) {
        setSelectedProject(null);
        cardEl?.focus();
        return;
      }
      activeProjectTransitionRef.current = transition;

      transition.finished
        .catch(() => { })
        .finally(() => {
          if (cardEl) {
            cardEl.style.viewTransitionName = "";
            const title = cardEl.querySelector("h3");
            const tags = cardEl.querySelector("[data-tags-container]");
            if (title) (title as HTMLElement).style.viewTransitionName = "";
            if (tags) (tags as HTMLElement).style.viewTransitionName = "";
            // Ensure focus returns to the card on close
            cardEl.focus();
          }
          if (activeProjectTransitionRef.current === transition) {
            activeProjectTransitionRef.current = null;
          }
        });
    } catch {
      if (cardEl) {
        cardEl.style.viewTransitionName = "";
        const title = cardEl.querySelector("h3");
        const tags = cardEl.querySelector("[data-tags-container]");
        if (title) (title as HTMLElement).style.viewTransitionName = "";
        if (tags) (tags as HTMLElement).style.viewTransitionName = "";
        cardEl.focus();
      }
      setSelectedProject(null);
    }
  };

  // Touch accordion: first tap expands the inline preview, second tap opens
  // the case study (brief section 3).
  const handleCardClick = (project: ProjectItem, element: HTMLElement) => {
    const slotId = firstRealSlot(project.gallerySlots);
    if (coarsePointer && slotId && expandedSlug !== project.slug) {
      setExpandedSlug(project.slug);
      return;
    }
    openProject(project, element);
  };

  return (
    <Section
      id="projects"
      eyebrow={projectsContent.eyebrow}
      heading={projectsContent.heading}
      intro={projectsContent.intro}
      counter={projectsContent.counter}
      headerExtra="5 Projects"
    >
      {/* Architectural Left-Ruled Timeline matching EducationSection */}
      <div
        ref={timelineRef}
        className="relative pl-6 sm:pl-8 border-l border-[var(--rule)] space-y-10 sm:space-y-12 max-w-[960px]"
      >
        {/* Vertical timeline accent line: scroll-linked draw, static full line under reduced motion */}
        <m.div
          style={
            prefersReducedMotion
              ? { transformOrigin: "top", scaleY: 1 }
              : { scaleY, transformOrigin: "top" }
          }
          className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[var(--accent)] z-10"
        />

        {/* Milestone Cards in Ordered Sequence */}
        {orderedProjects.map((project, index) => {
          const isFlagship = project.slug === "student-organizer";
          const previewSlot = firstRealSlot(project.gallerySlots);
          const skillDimmed = skillSlugs !== null && !skillSlugs.includes(project.slug);

          return (
            <m.div
              key={project.id}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              custom={index}
              className="relative group"
            >
              {/* Timeline Node on Rail */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-6 z-20 transition-colors ${
                  isFlagship
                    ? "w-[9px] h-[9px] rounded-none bg-[var(--accent)]"
                    : "w-[7px] h-[7px] rounded-none bg-[var(--rule)] group-hover:bg-[var(--accent)]"
                }`}
                aria-hidden="true"
              />

              {/* Project Card */}
              <article
                role="button"
                data-project-card={project.slug}
                tabIndex={0}
                onClick={(e) => handleCardClick(project, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProject(project, e.currentTarget);
                  }
                }}
                className={`project-card p-6 sm:p-7 border rounded-[4px] transition-[opacity,border-color,background-color] duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] space-y-4 ${
                  isFlagship
                    ? "bg-[var(--surface-subtle)] border-[var(--accent)]/50 hover:border-[var(--accent)]"
                    : "bg-[var(--surface-subtle)]/70 border-[var(--rule)] hover:border-[var(--accent)] hover:bg-[var(--surface-subtle)]"
                } ${skillDimmed ? "opacity-35" : "opacity-100"}`}
              >
                {/* Meta Header: real index + badge from content, no invented metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--rule-subtle)] pb-3">
                  <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="font-mono text-xs text-[var(--ink-muted)]">
                    {project.badge}
                  </span>
                </div>

                {/* Title & One-line Description */}
                <div>
                  <h3 className="project-card-title font-serif text-xl sm:text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-2 inline-flex items-baseline gap-2">
                    <span>{project.title}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="project-card-arrow w-4 h-4 text-[var(--accent)]"
                    />
                  </h3>
                  <p className="font-sans text-sm sm:text-[15px] text-[var(--ink-muted)] leading-relaxed max-w-[72ch]">
                    {project.cardText}
                  </p>
                </div>

                {/* Tech Tags */}
                <div data-tags-container className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-2.5 py-1 border border-[var(--rule-subtle)] bg-[var(--paper)] text-[var(--ink-muted)] group-hover:border-[var(--accent-border)] group-hover:text-[var(--ink)] transition-colors rounded-[2px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Touch accordion: inline preview, only where a real
                    screenshot exists (brief section 3) */}
                <AnimatePresence>
                  {coarsePointer &&
                    previewSlot &&
                    expandedSlug === project.slug && (
                      <m.div
                        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                        animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                        exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                        transition={prefersReducedMotion ? { duration: 0.1 } : transitions.base}
                      >
                        <div className="aspect-[16/10] max-h-[320px] overflow-hidden border border-[var(--rule)] bg-[var(--surface)]">
                          <img
                            src={mediaManifest[previewSlot].src ?? ""}
                            alt={mediaManifest[previewSlot].caption || mediaManifest[previewSlot].label}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </m.div>
                    )}
                </AnimatePresence>

                {/* Footer Action Links */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-[var(--rule-subtle)] font-mono text-xs text-[var(--ink-muted)]"
                >
                  <div className="flex items-center gap-4">
                    {project.links.source && (
                      <a
                        href={project.links.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{projectsContent.card.source}</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{projectsContent.card.live}</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {project.links.apk && (
                      <a
                        href={project.links.apk}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline font-semibold inline-flex items-center gap-1.5"
                      >
                        <span>Download APK</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="inline-flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline cursor-pointer ml-auto"
                  >
                    <span>{projectsContent.card.cta}</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </article>
            </m.div>
          );
        })}
      </div>

      {/* Floating hover/keyboard preview panel (brief section 3) */}
      {/* Modal Detail View (with View Transitions API) */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={closeProject}
          onSelectProject={(p) => openProject(p)}
          isReviewMode={isReviewMode}
        />
      )}
    </Section>
  );
}

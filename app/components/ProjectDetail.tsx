"use client";

import React, { useEffect, useRef, useState } from "react";
import { projectsContent, ProjectItem } from "@/content/projects";
import { siteContent } from "@/content/site";
import { MediaSlot } from "./MediaSlot";
import { Lightbox } from "./Lightbox";

interface ProjectDetailProps {
  project: ProjectItem;
  onClose: () => void;
  onSelectProject: (p: ProjectItem) => void;
  isReviewMode?: boolean;
}

function renderInlineFormatted(text: string): React.ReactNode {
  // Parse inline markdown bold (**bold**) and code (`code`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-[var(--ink)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="font-mono text-xs px-1.5 py-0.5 bg-[var(--surface)] text-[var(--accent)] border border-[var(--rule)] rounded-[2px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function ProjectDetail({
  project,
  onClose,
  onSelectProject,
  isReviewMode = false,
}: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevActiveRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [lightboxSlotIndex, setLightboxSlotIndex] = useState<number | null>(null);

  const allProjects = projectsContent.items;
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  useEffect(() => {
    prevActiveRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      prevActiveRef.current?.focus();
    };
  }, []);

  // Keyboard navigation & Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxSlotIndex === null) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, lightboxSlotIndex]);

  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Update hash
  useEffect(() => {
    if (window.location.hash !== `#project/${project.slug}`) {
      window.history.pushState(null, "", `#project/${project.slug}`);
    }
    const handleHashChange = () => {
      if (!window.location.hash.startsWith("#project/")) {
        onClose();
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (window.location.hash.startsWith("#project/")) {
        window.history.pushState(null, "", window.location.pathname);
      }
    };
  }, [project.slug, onClose]);

  // Sections available for this project
  const sections = [
    { id: "overview", label: projectsContent.detailLabels.overview, exists: !!project.overview },
    { id: "problem", label: projectsContent.detailLabels.problem, exists: !!project.problem },
    { id: "contribution", label: projectsContent.detailLabels.contribution, exists: !!project.contribution },
    { id: "functionality", label: projectsContent.detailLabels.functionality, exists: !!project.functionality },
    { id: "implementation", label: projectsContent.detailLabels.implementation, exists: !!project.implementation },
    { id: "decisions", label: projectsContent.detailLabels.decisions, exists: !!project.decisions },
    { id: "next", label: projectsContent.detailLabels.next, exists: !!project.next },
    { id: "gallery", label: projectsContent.detailLabels.gallery, exists: project.gallerySlots && project.gallerySlots.length > 0 },
  ].filter((s) => s.exists);

  return (
    <>
      {/* Heavy Blurred Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-[#111315]/85 backdrop-blur-md transition-all duration-300"
      />

      {/* Centered Primary Detailed View Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          tabIndex={-1}
          ref={panelRef}
          className="pointer-events-auto w-full max-w-4xl max-h-[90vh] bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-2xl flex flex-col focus:outline-none overflow-hidden transition-all duration-200"
        >
          {/* Header Bar */}
          <div className="shrink-0 flex items-center justify-between p-4 sm:p-5 bg-[var(--paper)] border-b border-[var(--rule)]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {project.badge}
              </span>
              {isReviewMode && project.confirmFlags?.contribution && (
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-[2px]">
                  confirm
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectProject(prevProject)}
                aria-label={projectsContent.detailLabels.prev}
                className="font-mono text-xs px-2.5 py-1.5 border border-[var(--rule)] rounded-[4px] hover:border-[var(--ink)] cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              >
                &larr; Prev
              </button>
              <button
                onClick={() => onSelectProject(nextProject)}
                aria-label={projectsContent.detailLabels.nextProject}
                className="font-mono text-xs px-2.5 py-1.5 border border-[var(--rule)] rounded-[4px] hover:border-[var(--ink)] cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              >
                Next &rarr;
              </button>
              <button
                onClick={onClose}
                aria-label={projectsContent.detailLabels.close}
                className="font-mono text-xs px-3 py-1.5 bg-[var(--ink)] text-[var(--paper)] rounded-[4px] hover:opacity-90 cursor-pointer ml-2 font-medium transition-opacity"
              >
                {siteContent.ui.modalClose} [Esc]
              </button>
            </div>
          </div>

          {/* Mini-Nav Sub-Bar */}
          <nav
            aria-label="Project detail navigation"
            className="shrink-0 flex items-center gap-4 px-4 sm:px-6 py-2.5 bg-[var(--surface)] border-b border-[var(--rule)] overflow-x-auto text-xs font-mono scrollbar-none"
          >
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`detail-${sec.id}`)?.scrollIntoView({ behavior: "smooth" });
                  setActiveSection(sec.id);
                }}
                className={`whitespace-nowrap py-1 transition-colors ${
                  activeSection === sec.id
                    ? "text-[var(--accent)] font-semibold border-b-2 border-[var(--accent)]"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {sec.label}
              </a>
            ))}
          </nav>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10">
            {/* Header Section */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--ink)] tracking-tight mb-2.5">
                {project.title}
              </h1>
              <p className="font-sans text-sm sm:text-[15px] text-[var(--ink-muted)] leading-relaxed mb-5">
                {project.cardText}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] rounded-[2px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links Row */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--rule)]">
                {(project.slug === "student-organizer" || project.slug === "tejovik") && (
                  <a
                    href={`/projects/${project.slug}`}
                    className="font-mono text-xs px-3.5 py-1.5 bg-[var(--ink)] text-[var(--paper)] hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 rounded-[4px] font-medium"
                  >
                    Full Case Study &rarr;
                  </a>
                )}
                {project.links.source && (
                  <a
                    href={project.links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs px-3 py-1.5 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors inline-flex items-center gap-1 rounded-[4px]"
                  >
                    Source &rarr;
                    <span className="sr-only">({siteContent.ui.linkExternal})</span>
                  </a>
                )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3 py-1.5 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors inline-flex items-center gap-1 rounded-[4px]"
                >
                  Live site &rarr;
                  <span className="sr-only">({siteContent.ui.linkExternal})</span>
                </a>
              )}
              {project.links.original && (
                <a
                  href={project.links.original}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3 py-1.5 border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors inline-flex items-center gap-1 rounded-[4px]"
                >
                  Original project &rarr;
                  <span className="sr-only">({siteContent.ui.linkExternal})</span>
                </a>
              )}
              {project.links.apk && (
                <a
                  href={project.links.apk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3.5 py-1.5 border border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--paper)] transition-colors inline-flex items-center gap-1.5 rounded-[4px] font-medium"
                >
                  Download APK &rarr;
                  <span className="sr-only">({siteContent.ui.linkExternal})</span>
                </a>
              )}
            </div>
          </div>

          {/* Section: Overview */}
          {project.overview && (
            <div id="detail-overview" className="space-y-3 pt-6 border-t border-[var(--rule)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {projectsContent.detailLabels.overview}
              </h2>
              <div className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed space-y-3">
                {project.overview.split("\n\n").map((para, i) => (
                  <p key={i}>{renderInlineFormatted(para)}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section: The Problem */}
          {project.problem && (
            <div id="detail-problem" className="space-y-3 pt-6 border-t border-[var(--rule)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {projectsContent.detailLabels.problem}
              </h2>
              <p className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed">
                {renderInlineFormatted(project.problem)}
              </p>
            </div>
          )}

          {/* Section: Contribution */}
          {project.contribution && (
            <div
              id="detail-contribution"
              className={`space-y-3 pt-6 border-t border-[var(--rule)] ${
                isReviewMode && project.confirmFlags?.contribution ? "p-3 border border-amber-500/40 rounded-[4px]" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                  {projectsContent.detailLabels.contribution}
                </h2>
                {isReviewMode && project.confirmFlags?.contribution && (
                  <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">⚠ confirm</span>
                )}
              </div>
              <p className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed">
                {renderInlineFormatted(project.contribution)}
              </p>
            </div>
          )}

          {/* Section: What it does (Functionality) */}
          {project.functionality && (
            <div id="detail-functionality" className="space-y-4 pt-6 border-t border-[var(--rule)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {projectsContent.detailLabels.functionality}
              </h2>
              <div className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed space-y-3.5">
                {project.functionality.split("\n\n").map((para, i) => (
                  <p key={i}>{renderInlineFormatted(para)}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section: How it's built (Implementation) */}
          {project.implementation && (
            <div id="detail-implementation" className="space-y-4 pt-6 border-t border-[var(--rule)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {projectsContent.detailLabels.implementation}
              </h2>
              <div className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed space-y-2">
                {project.implementation.split("\n").map((line, i) => {
                  const clean = line.replace(/^-\s*/, "");
                  return clean ? (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent)] font-mono text-sm">&bull;</span>
                      <span>{renderInlineFormatted(clean)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Section: Design Decisions */}
          {project.decisions && (
            <div id="detail-decisions" className="space-y-4 pt-6 border-t border-[var(--rule)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {projectsContent.detailLabels.decisions}
              </h2>
              <div className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed space-y-3.5">
                {project.decisions.split("\n\n").map((para, i) => (
                  <p key={i}>{renderInlineFormatted(para)}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section: What's next */}
          {project.next && (
            <div id="detail-next" className="space-y-4 pt-6 border-t border-[var(--rule)]">
              <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                {projectsContent.detailLabels.next}
              </h2>
              <div className="font-sans text-sm sm:text-[15px] text-[var(--ink)] leading-relaxed space-y-2">
                {project.next.split("\n\n").map((para, i) => (
                  <p key={i}>{renderInlineFormatted(para)}</p>
                ))}
              </div>
            </div>
          )}

          {/* Section: Gallery */}
          {project.gallerySlots && project.gallerySlots.length > 0 && (
            <div id="detail-gallery" className="space-y-4 pt-6 border-t border-[var(--rule)]">
              <div className="flex items-baseline justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-semibold">
                  {projectsContent.detailLabels.gallery}
                </h2>
                <span className="font-mono text-xs text-[var(--ink-muted)]">
                  {project.gallerySlots.length} assets
                </span>
              </div>

              {/* Portrait vs landscape grid */}
              {project.id === "p1" ? (
                // Student organizer: horizontal snap strip for 6 portrait screenshots + grid for demo/arch/erd
                <div className="space-y-6">
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] mb-3">
                      Interface Screens (Scroll horizontally)
                    </span>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                      {project.gallerySlots.slice(0, 6).map((slotId, idx) => (
                        <div key={slotId} className="w-56 shrink-0 snap-start">
                          <MediaSlot
                            slotId={slotId}
                            onClick={() => setLightboxSlotIndex(idx)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] mb-3">
                      Walkthrough & System Architecture
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.gallerySlots.slice(6).map((slotId, idx) => (
                        <MediaSlot
                          key={slotId}
                          slotId={slotId}
                          onClick={() => setLightboxSlotIndex(6 + idx)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallerySlots.map((slotId, idx) => (
                    <MediaSlot
                      key={slotId}
                      slotId={slotId}
                      onClick={() => setLightboxSlotIndex(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Lightbox when slot clicked */}
      {lightboxSlotIndex !== null && (
        <Lightbox
          slots={project.gallerySlots}
          initialIndex={lightboxSlotIndex}
          onClose={() => setLightboxSlotIndex(null)}
        />
      )}
    </>
  );
}


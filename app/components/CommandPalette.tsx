"use client";

import React, { useEffect, useState, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Search,
  FolderGit2,
  FileText,
  Mail,
  Sun,
  Moon,
  ExternalLink,
  Code,
  X,
  Compass,
  Download,
} from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { siteContent } from "@/content/site";
import { projectsContent } from "@/content/projects";
import { skillsContent } from "@/content/skills";
import { contactContent } from "@/content/contact";
import { mediaManifest } from "@/content/media";

interface CommandItem {
  id: string;
  category: "Sections" | "Projects" | "Skills" | "Actions" | "External";
  label: string;
  detail?: string;
  shortcut?: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  onSelect: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
    onClose();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(contactContent.primary.email);
    onClose();
  };

  const resumeSlot = mediaManifest["resume-pdf"];

  const commands: CommandItem[] = [
    // Sections
    {
      id: "sec-hero",
      category: "Sections",
      label: "Hero / Introduction",
      detail: siteContent.hero.eyebrow,
      icon: Compass,
      onSelect: () => {
        window.location.hash = "hero";
        onClose();
      },
    },
    {
      id: "sec-projects",
      category: "Sections",
      label: "Projects",
      detail: `${projectsContent.counter} — Selected Works`,
      icon: FolderGit2,
      onSelect: () => {
        window.location.hash = "projects";
        onClose();
      },
    },
    {
      id: "sec-about",
      category: "Sections",
      label: "About",
      detail: "Background, story & strengths",
      icon: FileText,
      onSelect: () => {
        window.location.hash = "about";
        onClose();
      },
    },
    {
      id: "sec-activity",
      category: "Sections",
      label: "Activity & Contributions",
      detail: "GitHub & LeetCode commit telemetry",
      icon: Code,
      onSelect: () => {
        window.location.hash = "activity";
        onClose();
      },
    },
    {
      id: "sec-skills",
      category: "Sections",
      label: "Technical Stack",
      detail: "Languages, Android, Web & Core fundamentals",
      icon: Code,
      onSelect: () => {
        window.location.hash = "skills";
        onClose();
      },
    },
    {
      id: "sec-education",
      category: "Sections",
      label: "Education & Credentials",
      detail: "Degree and verified certifications",
      icon: FileText,
      onSelect: () => {
        window.location.hash = "education";
        onClose();
      },
    },
    {
      id: "sec-contact",
      category: "Sections",
      label: "Contact",
      detail: contactContent.primary.email,
      icon: Mail,
      onSelect: () => {
        window.location.hash = "contact";
        onClose();
      },
    },

    // Projects
    ...projectsContent.items.map((p) => ({
      id: `proj-${p.slug}`,
      category: "Projects" as const,
      label: p.title,
      detail: `${p.badge} — ${p.tags.slice(0, 3).join(", ")}`,
      icon: FolderGit2,
      onSelect: () => {
        window.location.hash = `#project/${p.slug}`;
        onClose();
      },
    })),

    // Skills
    ...Object.keys(skillsContent.tooltips).map((skill) => ({
      id: `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      category: "Skills" as const,
      label: skill,
      detail: (skillsContent.tooltips as Record<string, string>)[skill],
      icon: Code,
      onSelect: () => {
        window.location.hash = "skills";
        onClose();
      },
    })),

    // Actions
    {
      id: "act-copy-email",
      category: "Actions",
      label: "Copy Email Address",
      detail: contactContent.primary.email,
      icon: Mail,
      onSelect: copyEmail,
    },
    {
      id: "act-download-resume",
      category: "Actions",
      label: "Download Résumé (PDF)",
      detail: resumeSlot?.src ? "Kartik-Koundal-Resume.pdf" : contactContent.resumePending,
      icon: Download,
      onSelect: () => {
        if (resumeSlot?.src) {
          const a = document.createElement("a");
          a.href = resumeSlot.src;
          a.download = "Kartik-Koundal-Resume.pdf";
          a.click();
        } else {
          alert(contactContent.resumePending);
        }
        onClose();
      },
    },
    {
      id: "act-toggle-theme",
      category: "Actions",
      label: "Toggle Color Theme",
      detail: "Switch between paper and dark themes",
      icon: Moon,
      onSelect: toggleTheme,
    },

    // External Profiles
    {
      id: "ext-github",
      category: "External",
      label: "GitHub Profile",
      detail: "github.com/Kartikk-git",
      icon: Github,
      onSelect: () => {
        window.open("https://github.com/Kartikk-git", "_blank");
        onClose();
      },
    },
    {
      id: "ext-linkedin",
      category: "External",
      label: "LinkedIn Profile",
      detail: "linkedin.com/in/kartik-koundal-a41574323",
      icon: Linkedin,
      onSelect: () => {
        window.open("https://www.linkedin.com/in/kartik-koundal-a41574323/", "_blank");
        onClose();
      },
    },
    {
      id: "ext-leetcode",
      category: "External",
      label: "LeetCode Profile",
      detail: "leetcode.com/u/kartikk-git",
      icon: Code,
      onSelect: () => {
        window.open("https://leetcode.com/u/kartikk-git/", "_blank");
        onClose();
      },
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.detail && c.detail.toLowerCase().includes(query.toLowerCase())) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].onSelect();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#111315]/80 backdrop-blur-sm">
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-[var(--rule)] bg-[var(--surface)]/30">
              <Search className="w-4 h-4 text-[var(--ink-muted)] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDownInput}
                placeholder={siteContent.nav.searchPlaceholder}
                className="w-full bg-transparent font-sans text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none"
              />
              <button
                onClick={onClose}
                className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] px-2 py-0.5"
                title="Close palette"
              >
                [Esc]
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--rule)]/30">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-sm font-sans text-[var(--ink-muted)]">
                  {siteContent.nav.searchEmpty}
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={item.onSelect}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      role="option"
                      aria-selected={isSelected}
                      className={`flex items-center justify-between p-2.5 rounded-[2px] cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[var(--surface)] text-[var(--ink)] border-l-2 border-[var(--accent)]"
                          : "text-[var(--ink-muted)] hover:bg-[var(--surface)]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"}`} />
                        <div className="min-w-0 truncate">
                          <span className={`block font-medium text-sm truncate ${isSelected ? "text-[var(--ink)]" : ""}`}>
                            {item.label}
                          </span>
                          {item.detail && (
                            <span className="block text-xs text-[var(--ink-muted)] truncate">
                              {item.detail}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)] shrink-0 ml-3">
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 bg-[var(--surface)]/50 border-t border-[var(--rule)]/40 flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)]">
              <span>Navigate &uarr;&darr; · Select &crarr;</span>
              <span>ESC to close</span>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

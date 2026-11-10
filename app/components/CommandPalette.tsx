"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

interface CommandItem {
  id: string;
  category: "Navigation" | "Projects" | "Actions" | "External";
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
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Lock body scroll when palette is open
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

  // Keyboard navigation & Esc key
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
    navigator.clipboard.writeText(profile.email);
    onClose();
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-hero",
      category: "Navigation",
      label: "Go to Top / Hero",
      detail: "Introduction and positioning",
      icon: Compass,
      onSelect: () => {
        router.push("/#hero");
        onClose();
      },
    },
    {
      id: "nav-projects",
      category: "Navigation",
      label: "Jump to Projects",
      detail: "Selected engineering works",
      icon: FolderGit2,
      onSelect: () => {
        router.push("/#projects");
        onClose();
      },
    },
    {
      id: "nav-about",
      category: "Navigation",
      label: "Jump to About",
      detail: "Background and engineering focus",
      icon: FileText,
      onSelect: () => {
        router.push("/#about");
        onClose();
      },
    },
    {
      id: "nav-skills",
      category: "Navigation",
      label: "Jump to Skills",
      detail: "Technical stack and interactive explorer",
      icon: Code,
      onSelect: () => {
        router.push("/#skills");
        onClose();
      },
    },
    {
      id: "nav-education",
      category: "Navigation",
      label: "Jump to Education & Credentials",
      detail: "Degree and verified certifications",
      icon: FileText,
      onSelect: () => {
        router.push("/#education");
        onClose();
      },
    },
    {
      id: "nav-contact",
      category: "Navigation",
      label: "Jump to Contact",
      detail: "Direct email and professional links",
      icon: Mail,
      onSelect: () => {
        router.push("/#contact");
        onClose();
      },
    },

    // Case Studies
    {
      id: "case-tejovik",
      category: "Projects",
      label: "TEJOVIK Case Study",
      detail: "Student Performance & Wellness Platform (Flask, Chart.js)",
      icon: FolderGit2,
      onSelect: () => {
        router.push("/projects/tejovik");
        onClose();
      },
    },
    {
      id: "case-student-organizer",
      category: "Projects",
      label: "Student Organizer Case Study",
      detail: "Native Android app (Compose, Room, Coroutines)",
      icon: FolderGit2,
      onSelect: () => {
        router.push("/projects/student-organizer");
        onClose();
      },
    },

    // Actions
    {
      id: "act-copy-email",
      category: "Actions",
      label: "Copy Email Address",
      detail: profile.email,
      icon: Mail,
      onSelect: copyEmail,
    },
    {
      id: "act-resume",
      category: "Actions",
      label: "Download Resume (PDF)",
      detail: "PDF format",
      icon: FileText,
      onSelect: () => {
        window.open("/resume.pdf", "_blank");
        onClose();
      },
    },
    {
      id: "act-toggle-theme",
      category: "Actions",
      label: "Toggle Color Theme",
      detail: "Switch between paper (light) and dark themes",
      icon: Sun,
      onSelect: toggleTheme,
    },

    // External Links
    {
      id: "ext-github",
      category: "External",
      label: "GitHub Profile",
      detail: profile.githubUrl,
      icon: Github,
      onSelect: () => {
        window.open(profile.githubUrl, "_blank", "noopener,noreferrer");
        onClose();
      },
    },
    {
      id: "ext-linkedin",
      category: "External",
      label: "LinkedIn Profile",
      detail: profile.linkedinUrl,
      icon: Linkedin,
      onSelect: () => {
        window.open(profile.linkedinUrl, "_blank", "noopener,noreferrer");
        onClose();
      },
    },
    {
      id: "ext-credly",
      category: "External",
      label: "Credly Certifications",
      detail: profile.credlyUrl,
      icon: ExternalLink,
      onSelect: () => {
        window.open(profile.credlyUrl, "_blank", "noopener,noreferrer");
        onClose();
      },
    },
    {
      id: "ext-leetcode",
      category: "External",
      label: "LeetCode Profile",
      detail: profile.leetcodeUrl,
      icon: ExternalLink,
      onSelect: () => {
        window.open(profile.leetcodeUrl, "_blank", "noopener,noreferrer");
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      (cmd.detail && cmd.detail.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].onSelect();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Backdrop with 200ms opacity transition */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#16181D]/60 dark:bg-black/80"
          />

          {/* Modal Container */}
          <m.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-[var(--paper)] text-[var(--ink)] border border-[var(--rule)] rounded-[4px] shadow-lg overflow-hidden z-10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--rule)] bg-[var(--surface)]">
              <Search size={18} strokeWidth={1.5} className="text-[var(--ink-muted)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] outline-none font-sans"
              />
              <button
                type="button"
                onClick={onClose}
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 rounded-[2px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                aria-label="Close command palette"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* List Results */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[var(--rule)]/50 py-1">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[var(--ink-muted)]">
                  No matching commands found.
                </div>
              ) : (
                filteredCommands.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.onSelect}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-4 py-2.5 text-xs font-mono cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[var(--surface)] text-[var(--accent)] font-semibold"
                          : "text-[var(--ink)] hover:bg-[var(--surface)]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon size={16} strokeWidth={1.5} className="shrink-0 text-[var(--ink-muted)]" />
                        <div className="truncate">
                          <span className="font-sans text-sm">{item.label}</span>
                          {item.detail && (
                            <span className="block text-[11px] text-[var(--ink-muted)] font-mono truncate">
                              {item.detail}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with keyboard guidance */}
            <div className="px-4 py-2 border-t border-[var(--rule)] bg-[var(--surface)]/50 flex justify-between items-center text-[11px] font-mono text-[var(--ink-muted)]">
              <div className="flex items-center gap-2">
                <span>&uarr;&darr; Navigate</span>
                <span>&middot;</span>
                <span>&crarr; Select</span>
                <span>&middot;</span>
                <span>Esc Close</span>
              </div>
              <div className="text-[10px] text-[var(--accent)]">
                Ctrl / Cmd + K
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

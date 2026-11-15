"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Terminal,
  ArrowRight,
  ExternalLink,
  FileText,
  Check,
  Sun,
  Moon,
  Smartphone,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { siteContent } from "@/content/site";
import { railContent } from "@/content/rail";
import { contactContent } from "@/content/contact";
import { projectsContent } from "@/content/projects";
import { openResumeModal } from "./ResumeModal";
import { triggerAndroidEraEasterEgg } from "./AndroidEraEasterEgg";
import { showToast } from "./ToastManager";
import { usePhoneState } from "@/lib/phone-state";
import { useActiveSection } from "@/lib/active-section";
import { markFound, ALL_EGGS } from "@/lib/secrets";
import { useFocusTrap } from "@/lib/focus-trap";
import { MOTION_TOKENS } from "@/lib/motion";
import { Z_INDEX } from "@/lib/z-index";
import { createPortal } from "react-dom";

interface CommandItem {
  id: string;
  groupId: string;
  groupTitle: string;
  label: string;
  sublabel?: string;
  keywords: string[];
  badge?: string;
  icon: LucideIcon;
  run: () => void;
}

interface FuzzyResult {
  matches: boolean;
  score: number;
  highlightIndices: number[];
}

function fuzzyMatch(text: string, query: string, keywords: string[] = []): FuzzyResult {
  if (!query) {
    return { matches: true, score: 0, highlightIndices: [] };
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // 1. Exact match
  if (lowerText === lowerQuery) {
    return {
      matches: true,
      score: 1000,
      highlightIndices: Array.from({ length: text.length }, (_, i) => i),
    };
  }

  // 2. Prefix match on label
  if (lowerText.startsWith(lowerQuery)) {
    return {
      matches: true,
      score: 900 - text.length,
      highlightIndices: Array.from({ length: query.length }, (_, i) => i),
    };
  }

  // 3. Word-start match on label
  const words = lowerText.split(/\s+/);
  let wordStartIdx = -1;
  let runningLen = 0;
  for (const w of words) {
    if (w.startsWith(lowerQuery)) {
      wordStartIdx = runningLen;
      break;
    }
    runningLen += w.length + 1;
  }
  if (wordStartIdx !== -1) {
    return {
      matches: true,
      score: 800 - wordStartIdx,
      highlightIndices: Array.from({ length: query.length }, (_, i) => wordStartIdx + i),
    };
  }

  // 4. Substring match in label
  const subIdx = lowerText.indexOf(lowerQuery);
  if (subIdx !== -1) {
    return {
      matches: true,
      score: 700 - subIdx,
      highlightIndices: Array.from({ length: query.length }, (_, i) => subIdx + i),
    };
  }

  // 5. Keyword exact / prefix / substring match
  for (const kw of keywords) {
    const lkw = kw.toLowerCase();
    if (lkw === lowerQuery) {
      return { matches: true, score: 650, highlightIndices: [] };
    }
    if (lkw.startsWith(lowerQuery)) {
      return { matches: true, score: 600, highlightIndices: [] };
    }
    if (lkw.includes(lowerQuery)) {
      return { matches: true, score: 550, highlightIndices: [] };
    }
  }

  // 6. Subsequence match on label (fuzzy characters in sequence)
  let qIdx = 0;
  const indices: number[] = [];
  for (let i = 0; i < text.length && qIdx < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[qIdx]) {
      indices.push(i);
      qIdx++;
    }
  }
  if (qIdx === lowerQuery.length) {
    const span = indices[indices.length - 1] - indices[0];
    return {
      matches: true,
      score: 400 - span,
      highlightIndices: indices,
    };
  }

  return { matches: false, score: 0, highlightIndices: [] };
}

function HighlightedText({ text, indices }: { text: string; indices: number[] }) {
  if (!indices || indices.length === 0) return <span>{text}</span>;
  const indexSet = new Set(indices);
  const elements: ReactNode[] = [];
  let currentRun = "";
  let isHighlighted = false;

  for (let i = 0; i < text.length; i++) {
    const charHighlight = indexSet.has(i);
    if (i === 0) {
      isHighlighted = charHighlight;
      currentRun = text[i];
    } else if (charHighlight === isHighlighted) {
      currentRun += text[i];
    } else {
      if (isHighlighted) {
        elements.push(
          <mark
            key={i}
            className="text-[var(--accent)] bg-transparent font-bold underline decoration-[var(--accent)]/50"
          >
            {currentRun}
          </mark>
        );
      } else {
        elements.push(<span key={i}>{currentRun}</span>);
      }
      isHighlighted = charHighlight;
      currentRun = text[i];
    }
  }
  if (currentRun) {
    if (isHighlighted) {
      elements.push(
        <mark
          key="last"
          className="text-[var(--accent)] bg-transparent font-bold underline decoration-[var(--accent)]/50"
        >
          {currentRun}
        </mark>
      );
    } else {
      elements.push(<span key="last">{currentRun}</span>);
    }
  }

  return <span>{elements}</span>;
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
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const prefersReduced = useReducedMotion();
  const { activeSection } = useActiveSection();
  const { isOpen: isPhoneOpen, openPhone, closePhone } = usePhoneState();

  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Save the trigger element before moving focus into the input
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = (document.activeElement as HTMLElement) || null;
    }
  }, [isOpen]);

  // Restore focus to trigger on close
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      const el = triggerRef.current;
      triggerRef.current = null;
      setTimeout(() => {
        el.focus();
      }, 20);
    }
  }, [isOpen]);

  // Read current theme from DOM
  useEffect(() => {
    if (typeof window === "undefined") return;
    const themeAttr = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
    if (themeAttr === "light") {
      setCurrentTheme("light");
    } else {
      setCurrentTheme("dark");
    }
  }, [isOpen]);

  // Lock background scroll and set inert & aria-hidden on other body elements while open
  useEffect(() => {
    if (!isOpen || !mounted) return;

    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const inertedElements: HTMLElement[] = [];
    const portalEl = portalRef.current;

    Array.from(document.body.children).forEach((child) => {
      if (
        child instanceof HTMLElement &&
        child !== portalEl &&
        !child.contains(portalEl) &&
        child.tagName !== "SCRIPT" &&
        child.tagName !== "STYLE"
      ) {
        if (!child.hasAttribute("inert")) {
          child.setAttribute("inert", "");
          child.setAttribute("aria-hidden", "true");
          inertedElements.push(child);
        }
      }
    });

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
      inertedElements.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
    };
  }, [isOpen, mounted]);

  // Focus input and reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setCopiedNotification(null);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Theme toggle helper
  const handleToggleTheme = useCallback(() => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
    setCurrentTheme(nextTheme);
    window.dispatchEvent(new Event("storage"));
  }, [currentTheme]);

  // Build the complete command catalogue
  const allCommands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    // Group 1: Navigate (all 7 sections)
    railContent.items.forEach((item) => {
      list.push({
        id: `nav-${item.id}`,
        groupId: "navigate",
        groupTitle: siteContent.command.groupNavigate,
        label: item.name,
        sublabel: item.href,
        keywords: [item.name, item.href, "section", "scroll", item.id],
        badge: "Section",
        icon: Terminal,
        run: () => {
          onClose();
          setTimeout(() => {
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
          }, 80);
        },
      });
    });

    // Group 2: Projects (case studies)
    projectsContent.items.forEach((proj) => {
      const routePath = `/projects/${proj.slug}`;
      list.push({
        id: `proj-${proj.slug}`,
        groupId: "projects",
        groupTitle: siteContent.command.groupProjects,
        label: proj.title,
        sublabel: routePath,
        keywords: [
          proj.title,
          proj.slug,
          ...(proj.tags || []),
          "project",
          "case study",
        ],
        badge: "Case Study",
        icon: ArrowRight,
        run: () => {
          onClose();
          setTimeout(() => {
            window.location.href = routePath;
          }, 100);
        },
      });
    });

    // Group 3: Actions
    list.push({
      id: "act-resume",
      groupId: "actions",
      groupTitle: siteContent.command.groupActions,
      label: siteContent.command.actionResume,
      sublabel: "PDF",
      keywords: ["resume", "cv", "pdf", "download", "credentials"],
      badge: "PDF",
      icon: FileText,
      run: () => {
        onClose();
        setTimeout(() => {
          openResumeModal();
        }, 120);
      },
    });

    list.push({
      id: "act-email",
      groupId: "actions",
      groupTitle: siteContent.command.groupActions,
      label: siteContent.command.actionEmail,
      sublabel: contactContent.primary.email,
      keywords: [
        "email",
        "contact",
        "copy",
        contactContent.primary.email,
        "hire",
      ],
      badge: "Clipboard",
      icon: Check,
      run: () => {
        try {
          navigator.clipboard.writeText(contactContent.primary.email);
          setCopiedNotification(siteContent.toast.emailCopied);
          setTimeout(() => {
            setCopiedNotification(null);
            onClose();
          }, 800);
        } catch {
          onClose();
        }
      },
    });

    const profiles = contactContent.profiles.filter((p) => p.url);
    profiles.forEach((profile) => {
      let cmdLabel = profile.label;
      let badge = "Profile";
      if (profile.label === "GitHub") {
        cmdLabel = siteContent.command.actionGithub;
        badge = "Source";
      } else if (profile.label === "LinkedIn") {
        cmdLabel = siteContent.command.actionLinkedin;
      } else if (profile.label === "LeetCode") {
        cmdLabel = siteContent.command.actionLeetcode;
      } else if (profile.label === "Credly") {
        cmdLabel = siteContent.command.actionCredly;
        badge = "Badges";
      }

      list.push({
        id: `act-${profile.label.toLowerCase()}`,
        groupId: "actions",
        groupTitle: siteContent.command.groupActions,
        label: cmdLabel,
        sublabel: profile.value,
        keywords: [profile.label, profile.value, "link", "external"],
        badge,
        icon: ExternalLink,
        run: () => {
          onClose();
          if (profile.url) {
            window.open(profile.url, "_blank", "noopener,noreferrer");
          }
        },
      });
    });

    // Group 4: Theme
    if (currentTheme === "dark") {
      list.push({
        id: "theme-toggle",
        groupId: "theme",
        groupTitle: siteContent.command.groupTheme,
        label: siteContent.nav.themeToLight,
        sublabel: "Day Mode",
        keywords: ["light", "day", "paper", "theme", "mode", "color"],
        badge: "Theme",
        icon: Sun,
        run: handleToggleTheme,
      });
    } else {
      list.push({
        id: "theme-toggle",
        groupId: "theme",
        groupTitle: siteContent.command.groupTheme,
        label: siteContent.nav.themeToDark,
        sublabel: "Night Mode",
        keywords: ["dark", "night", "dark mode", "theme", "color"],
        badge: "Theme",
        icon: Moon,
        run: handleToggleTheme,
      });
    }

    // Group 5: App Preview (Phone)
    if (!isPhoneOpen) {
      list.push({
        id: "preview-open",
        groupId: "preview",
        groupTitle: siteContent.command.groupPreview,
        label: siteContent.command.actionPhoneOpen,
        sublabel: "Student Organizer",
        keywords: ["phone", "preview", "mobile", "mockup", "android", "bot", "demo"],
        badge: "Mobile",
        icon: Smartphone,
        run: () => {
          onClose();
          openPhone();
        },
      });
    }
    if (isPhoneOpen) {
      list.push({
        id: "preview-close",
        groupId: "preview",
        groupTitle: siteContent.command.groupPreview,
        label: siteContent.command.actionPhoneClose,
        sublabel: "Dismiss preview",
        keywords: ["phone", "close", "mockup", "dismiss", "hide"],
        badge: "Mobile",
        icon: X,
        run: () => {
          onClose();
          closePhone();
        },
      });
    }

    // Group 6: Easter Eggs & Secrets
    list.push({
      id: "secret-trigger",
      groupId: "secrets",
      groupTitle: siteContent.command.groupSecrets,
      label: siteContent.command.actionEasterEgg,
      sublabel: "Android Developer Mode",
      keywords: [
        "easter",
        "egg",
        "secret",
        "bugdroid",
        "coffee",
        "sudo make-coffee",
        "konami",
        "matrix",
      ],
      badge: "Secret",
      icon: Sparkles,
      run: () => {
        markFound("bugdroid");
        try {
          console.log(
            "%c🎉 Android Developer Mode triggered from command palette!",
            "color: #5FB38F; font-size: 14px; font-weight: bold; font-family: monospace;"
          );
        } catch {}
        onClose();
        triggerAndroidEraEasterEgg();
        showToast(siteContent.toast.devModeUnlocked, {
          type: "sparkle",
          duration: 3200,
        });
      },
    });

    return list;
  }, [
    currentTheme,
    isPhoneOpen,
    onClose,
    handleToggleTheme,
    openPhone,
    closePhone,
  ]);

  // Filter & score with in-house fuzzy search
  const filteredResults = useMemo(() => {
    const cleanQ = query.trim();
    if (!cleanQ) {
      return allCommands.map((item) => ({
        item,
        score: 0,
        highlightIndices: [],
      }));
    }

    const scored = allCommands
      .map((item) => {
        const res = fuzzyMatch(item.label, cleanQ, item.keywords);
        return {
          item,
          score: res.score,
          highlightIndices: res.highlightIndices,
        };
      })
      .filter((r) => r.score > 0);

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [allCommands, query]);

  // Grouped results preserving group structure
  const groupedResults = useMemo(() => {
    const groupOrder = [
      "navigate",
      "projects",
      "actions",
      "theme",
      "preview",
      "secrets",
    ];
    const groupMap = new Map<
      string,
      {
        groupId: string;
        groupTitle: string;
        items: { item: CommandItem; highlightIndices: number[] }[];
      }
    >();

    filteredResults.forEach(({ item, highlightIndices }) => {
      if (!groupMap.has(item.groupId)) {
        groupMap.set(item.groupId, {
          groupId: item.groupId,
          groupTitle: item.groupTitle,
          items: [],
        });
      }
      groupMap.get(item.groupId)!.items.push({ item, highlightIndices });
    });

    const ordered: {
      groupId: string;
      groupTitle: string;
      items: { item: CommandItem; highlightIndices: number[] }[];
    }[] = [];

    groupOrder.forEach((gId) => {
      const g = groupMap.get(gId);
      if (g && g.items.length > 0) {
        ordered.push(g);
      }
    });

    return ordered;
  }, [filteredResults]);

  // Flattened visible items for keyboard indexing
  const flattenedItems = useMemo(() => {
    const flat: { item: CommandItem; highlightIndices: number[] }[] = [];
    groupedResults.forEach((group) => {
      group.items.forEach((entry) => flat.push(entry));
    });
    return flat;
  }, [groupedResults]);

  // Reset selectedIndex on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  const updateSelectedIndex = useCallback((newIdx: number) => {
    setSelectedIndex(newIdx);
    const el = itemRefs.current.get(newIdx);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flattenedItems.length === 0) return;
      const next = selectedIndex < flattenedItems.length - 1 ? selectedIndex + 1 : 0;
      updateSelectedIndex(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flattenedItems.length === 0) return;
      const prev = selectedIndex > 0 ? selectedIndex - 1 : flattenedItems.length - 1;
      updateSelectedIndex(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (flattenedItems.length === 0) return;
      updateSelectedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (flattenedItems.length === 0) return;
      updateSelectedIndex(flattenedItems.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flattenedItems.length > 0 && flattenedItems[selectedIndex]) {
        flattenedItems[selectedIndex].item.run();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const selectedItem = flattenedItems[selectedIndex]?.item;
  const activeDescendantId = selectedItem ? `cmd-opt-${selectedItem.id}` : undefined;

  if (!mounted) return null;

  return createPortal(
    <div ref={portalRef} id="command-palette-portal">
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 flex items-start justify-center pt-4 sm:pt-16 px-3 sm:px-6 pointer-events-none"
            style={{ zIndex: "var(--z-palette, 901)" }}
          >
            {/* Dim Overlay with 2px backdrop blur covering the whole page */}
            <m.div
              key="palette-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReduced ? 0 : MOTION_TOKENS.duration.fast,
                ease: MOTION_TOKENS.ease.standard,
              }}
              onClick={onClose}
              aria-hidden="true"
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto cursor-pointer"
              style={{
                zIndex: "var(--z-palette-backdrop, 900)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            />

            {/* Opaque Palette Dialog Panel */}
            <m.div
              key="palette-panel"
              ref={dialogRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: prefersReduced ? 0 : MOTION_TOKENS.duration.fast,
                ease: MOTION_TOKENS.ease.standard,
              }}
              style={{
                zIndex: "var(--z-palette, 901)",
                backgroundColor: "var(--surface)",
              }}
              className="pointer-events-auto relative z-palette w-full max-w-2xl bg-[var(--surface)] border border-[var(--rule)] rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col font-mono text-xs"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
            >
              {/* Terminal Command Input Prompt */}
              <div
                className="flex items-center px-3.5 py-3 bg-[var(--surface)] border-b border-[var(--rule)]"
                style={{ backgroundColor: "var(--surface)" }}
              >
              <span className="text-[var(--accent)] font-bold mr-2 select-none text-sm">
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls="command-palette-listbox"
                aria-activedescendant={activeDescendantId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={siteContent.nav.searchPlaceholder}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none"
                aria-label="Command search"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="ml-1 px-1.5 py-0.5 rounded-[2px] text-[10px] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)] border border-[var(--rule)] cursor-pointer"
                title="Close palette (Esc)"
                aria-label="Close command palette"
              >
                esc
              </button>
            </div>

            {/* Notification Pill */}
            {copiedNotification && (
              <div
                className="px-3.5 py-1.5 bg-[var(--surface-subtle)] border-b border-[var(--rule)] flex items-center gap-1.5 text-[11px] text-[var(--accent)] font-medium"
                role="status"
              >
                <Check size={12} strokeWidth={2.5} />
                <span>{copiedNotification}</span>
              </div>
            )}

            {/* Polite screen-reader status */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {flattenedItems.length === 0
                ? siteContent.command.empty
                : `${flattenedItems.length} commands available.`}
            </div>

            {/* Command Listbox */}
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Commands"
              style={{ backgroundColor: "var(--surface)" }}
              className="max-h-[60vh] overflow-y-auto divide-y divide-[var(--rule)]/30 font-mono text-xs"
            >
              {flattenedItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--ink-muted)]">
                  <p className="font-semibold text-[var(--ink)] mb-1">
                    {siteContent.command.empty}
                  </p>
                  <p className="text-[11px] opacity-80">
                    Try searching for a section, project name, or action.
                  </p>
                </div>
              ) : (
                (() => {
                  let flatIndexTracker = 0;
                  return groupedResults.map((group) => (
                    <div
                      key={group.groupId}
                      role="group"
                      aria-label={group.groupTitle}
                    >
                      {/* Small mono heading */}
                      <div
                        role="presentation"
                        className="px-3.5 py-1.5 bg-[var(--surface-subtle)] text-[10px] uppercase tracking-wider font-mono text-[var(--ink-muted)] font-semibold select-none border-b border-[var(--rule)]/20"
                      >
                        {group.groupTitle}
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-[var(--rule)]/20">
                        {group.items.map(({ item, highlightIndices }) => {
                          const currentFlatIdx = flatIndexTracker++;
                          const isSelected = currentFlatIdx === selectedIndex;
                          const ItemIcon = item.icon;

                          return (
                            <div
                              key={item.id}
                              id={`cmd-opt-${item.id}`}
                              ref={(el) => {
                                if (el) itemRefs.current.set(currentFlatIdx, el);
                                else itemRefs.current.delete(currentFlatIdx);
                              }}
                              role="option"
                              aria-selected={isSelected}
                              onClick={item.run}
                              onMouseEnter={() => setSelectedIndex(currentFlatIdx)}
                              className={`px-3.5 py-2.5 sm:py-2 flex items-center justify-between gap-3 cursor-pointer min-h-[44px] transition-colors ${
                                isSelected
                                  ? "bg-[var(--accent)] text-white font-medium shadow-xs"
                                  : "hover:bg-[var(--surface-subtle)] text-[var(--ink)]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <ItemIcon
                                  size={14}
                                  strokeWidth={1.75}
                                  className={`shrink-0 ${
                                    isSelected ? "text-white" : "text-[var(--accent)]"
                                  }`}
                                />
                                <div className="flex items-baseline gap-2 truncate">
                                  <span className="font-mono text-xs truncate">
                                    <HighlightedText
                                      text={item.label}
                                      indices={highlightIndices}
                                    />
                                  </span>
                                  {item.sublabel && (
                                    <span
                                      className={`text-[10.5px] truncate hidden sm:inline ${
                                        isSelected
                                          ? "text-white/80"
                                          : "text-[var(--ink-muted)]"
                                      }`}
                                    >
                                      {item.sublabel}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {item.badge && (
                                  <span
                                    className={`text-[9.5px] px-1.5 py-0.5 rounded-[2px] font-mono ${
                                      isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-[var(--surface-subtle)] text-[var(--ink-muted)] border border-[var(--rule)]"
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] font-mono hidden sm:inline ${
                                    isSelected
                                      ? "text-white"
                                      : "text-[var(--ink-muted)] opacity-70"
                                  }`}
                                >
                                  {siteContent.command.hintRun}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>

            {/* Footer Shortcut Hints (Mono, hidden on mobile) */}
            <div className="hidden sm:flex items-center justify-between px-3.5 py-2 bg-[var(--surface-subtle)] border-t border-[var(--rule)] text-[10.5px] font-mono text-[var(--ink-muted)] select-none">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span>
                  {flattenedItems.length} command{flattenedItems.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>{siteContent.command.hintRun}</span>
                <span>·</span>
                <span>{siteContent.command.hintNavigate}</span>
                <span>·</span>
                <span>{siteContent.command.hintClose}</span>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  </div>,
  document.body
);
}

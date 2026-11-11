"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  Terminal,
  Trash2,
  Play,
  Pause,
  X,
  Coffee,
  Sparkles,
  Smartphone,
  Sun,
  Moon,
  FolderGit2,
  Code,
  Mail,
  FileText,
  Search,
  ExternalLink,
  Check,
} from "lucide-react";
import { contactContent } from "@/content/contact";
import { mediaManifest } from "@/content/media";
import { projectsContent } from "@/content/projects";

type LogLevel = "V" | "D" | "I" | "W" | "E" | "A";

interface LogEntry {
  id: string;
  time: string;
  pid: string;
  tid: string;
  level: LogLevel;
  tag: string;
  message: string;
}

interface CommandDef {
  cmd: string;
  alias?: string[];
  category: "Core" | "Android" | "Fun" | "Nav";
  description: string;
  badge?: string;
  action: () => LogEntry[] | Promise<LogEntry[]>;
}

const getLogTimestamp = () => {
  const d = new Date();
  const pad = (n: number, s = 2) => String(n).padStart(s, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

const makeLog = (level: LogLevel, tag: string, message: string): LogEntry => ({
  id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  time: getLogTimestamp(),
  pid: "2026",
  tid: "2048",
  level,
  tag,
  message,
});

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [levelFilter, setLevelFilter] = useState<LogLevel | "ALL">("ALL");
  const [isPaused, setIsPaused] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const logConsoleRef = useRef<HTMLDivElement>(null);

  const initialLogs: LogEntry[] = useMemo(
    () => [
      {
        id: "init-1",
        time: getLogTimestamp(),
        pid: "2026",
        tid: "2048",
        level: "V",
        tag: "AndroidRuntime",
        message: ">>>>>> START com.kartikkoundal.portfolio [API 34 arm64-v8a] <<<<<<",
      },
      {
        id: "init-2",
        time: getLogTimestamp(),
        pid: "2026",
        tid: "2048",
        level: "D",
        tag: "Portfolio",
        message: "Connected to Logcat runtime · Kartik Koundal portfolio environment ready.",
      },
      {
        id: "init-3",
        time: getLogTimestamp(),
        pid: "2026",
        tid: "2048",
        level: "I",
        tag: "Commands",
        message: "Quick commands: projects · skills · open student-organizer · theme · hire-me · sudo make-coffee",
      },
      {
        id: "init-4",
        time: getLogTimestamp(),
        pid: "2026",
        tid: "2048",
        level: "D",
        tag: "Logcat",
        message: "Type a command or press ↑ / ↓ to select, Enter to run, Tab to autocomplete.",
      },
    ],
    []
  );

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  // Background scroll lock
  useEffect(() => {
    if (isOpen) {
      const origHtmlOverflow = document.documentElement.style.overflow;
      const origBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.overflow = origBodyOverflow;
      };
    }
  }, [isOpen]);

  // Focus input and reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedSuggestionIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll log console unless paused
  useEffect(() => {
    if (!isPaused && logConsoleRef.current) {
      logConsoleRef.current.scrollTop = logConsoleRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  // Global Esc listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        setLogs([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Helpers
  const toggleThemeMode = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
    return nextTheme;
  };

  const resumeSlot = mediaManifest["resume-pdf"];

  // Command Definitions
  const commandList: CommandDef[] = useMemo(() => [
    {
      cmd: "projects",
      alias: ["repo", "work", "apps"],
      category: "Core",
      description: "List portfolio works & scroll to #projects",
      badge: "4 apps",
      action: () => {
        const output: LogEntry[] = [
          makeLog("D", "Portfolio", "Querying catalog of selected projects..."),
          makeLog("I", "Projects", "[1] TEJOVIK — Student Performance & Wellness Platform (Python/Flask/Chart.js)"),
          makeLog("I", "Projects", "[2] Student Organizer — Native Android MVVM offline-first (Kotlin/Compose/Room)"),
          makeLog("I", "Projects", "[3] Hospital Management — Responsive healthcare web portal (HTML/CSS)"),
          makeLog("I", "Projects", "[4] Personal Portfolio — Earlier deployed version (HTML/CSS/JS)"),
          makeLog("D", "Navigation", "Scrolling viewport to #projects..."),
        ];
        setTimeout(() => {
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return output;
      },
    },
    {
      cmd: "skills",
      alias: ["stack", "tech", "languages"],
      category: "Core",
      description: "Query system capability graph & scroll to #skills",
      badge: "verified",
      action: () => {
        const output: LogEntry[] = [
          makeLog("I", "Skills", "System capabilities query returned 4 core categories:"),
          makeLog("D", "Skills.Languages", "Java (95% NPTEL Elite score), Kotlin, Python, C++"),
          makeLog("D", "Skills.Android", "Jetpack Compose, Room SQLite, MVVM architecture, Kotlin Coroutines"),
          makeLog("D", "Skills.Web", "HTML, CSS, JavaScript, Flask, Chart.js"),
          makeLog("D", "Skills.Core", "Data Structures & Algorithms, OOP, DBMS, SQL, Git & GitHub"),
          makeLog("D", "Navigation", "Scrolling viewport to #skills..."),
        ];
        setTimeout(() => {
          document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return output;
      },
    },
    {
      cmd: "open student-organizer",
      alias: ["student-organizer", "organizer", "open organizer"],
      category: "Android",
      description: "Launch Student Organizer case study view",
      badge: "Kotlin/Compose",
      action: () => {
        const output: LogEntry[] = [
          makeLog(
            "D",
            "AndroidRuntime",
            "Starting Intent { act=android.intent.action.VIEW cmp=com.kartik.studentorganizer/.ui.MainActivity }"
          ),
          makeLog(
            "I",
            "ActivityManager",
            "Displayed com.kartik.studentorganizer/.ui.MainActivity: +118ms (total +142ms)"
          ),
          makeLog(
            "D",
            "RoomSQLite",
            "Local SQLite db 'student_organizer.db' verified (WAL mode enabled, zero cloud leakage)"
          ),
          makeLog(
            "I",
            "StudentOrganizer",
            "Launching native Android case study view in browser..."
          ),
        ];
        setTimeout(() => {
          window.location.href = "/projects/student-organizer";
        }, 300);
        return output;
      },
    },
    {
      cmd: "theme",
      alias: ["dark", "light", "toggle-theme", "mode"],
      category: "Core",
      description: "Toggle theme mode (Day / Night)",
      badge: "UI Mode",
      action: () => {
        const next = toggleThemeMode();
        return [
          makeLog("D", "UiModeManager", "Dispatching Configuration.UI_MODE_NIGHT change request..."),
          makeLog(
            "I",
            "Theme",
            `Theme successfully switched to ${next === "dark" ? "NIGHT (Dark)" : "DAY (Paper)"}.`
          ),
          makeLog(
            "D",
            "ViewRootImpl",
            `Surface repainted with paper=${next === "dark" ? "#111315" : "#F9F9F6"}, accent=${next === "dark" ? "#5FB38F" : "#1B6B4F"}.`
          ),
        ];
      },
    },
    {
      cmd: "hire-me",
      alias: ["contact", "hire", "email", "internship"],
      category: "Core",
      description: "Copy direct email to clipboard & jump to contact",
      badge: "open to hire",
      action: () => {
        try {
          navigator.clipboard.writeText(contactContent.primary.email);
          setCopiedNotification(contactContent.primary.email);
          setTimeout(() => setCopiedNotification(null), 3000);
        } catch {}

        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }, 150);

        return [
          makeLog("I", "RecruiterService", "Inbound candidate query received for: Kartik Koundal"),
          makeLog("D", "Candidate", "Status: Open to software and Android internships (New Delhi, India)"),
          makeLog("D", "Candidate", "Education: B.Tech CSE, Dronacharya College of Engg (2024 - 2028, CGPA 7.55)"),
          makeLog("I", "Contact", `Email copied to clipboard: ${contactContent.primary.email} 📋`),
          makeLog("D", "Navigation", "Scrolling viewport to #contact..."),
        ];
      },
    },
    {
      cmd: "sudo make-coffee",
      alias: ["coffee", "make-coffee", "brew"],
      category: "Fun",
      description: "Superuser barista routine with RFC 2324 protocol",
      badge: "root",
      action: () => {
        return [
          makeLog("D", "su", "Validating root superuser authentication for uid=0..."),
          makeLog("E", "Boredom", "not found in active process stack trace"),
          makeLog("W", "CoffeeMaker", "HTCPCP-TEA/1.0 418 I'm a teapot (RFC 2324 specification)"),
          makeLog("I", "Barista", "Bypassing teapot error with automated pour-over valve..."),
          makeLog("D", "Barista", "Heating boiler to 93.5°C at 9.0 bars pressure"),
          makeLog("D", "Barista", "Dosing 18.5g Ethiopian single-origin specialty roast..."),
          makeLog("D", "Barista", "Extracting 36.0g velvety crema espresso in 27s... [98% yield]"),
          makeLog("I", "CoffeeMaker", "Espresso shot extracted! ☕ Enjoy coding. Energy level restored to 100%."),
        ];
      },
    },
    {
      cmd: "easter-egg",
      alias: ["matrix", "dev-mode", "android-dessert", "adb reboot"],
      category: "Fun",
      description: "Trigger the hidden Android developer easter egg",
      badge: "Android 15",
      action: () => {
        return [
          makeLog("D", "AndroidRuntime", ">>>>>> ANDROID DEV EASTER EGG UNLOCKED <<<<<<"),
          makeLog("I", "Build.VERSION", "RELEASE=15 (VanillaIceCream) SDK_INT=35 CODENAME=VanillaIceCream"),
          makeLog("I", "SystemServer", "╔════════════════════════════════════════════════════════════╗"),
          makeLog("I", "SystemServer", "║   _  __           _   _ _      _  __                       ║"),
          makeLog("I", "SystemServer", "║  | |/ /__ _ _ __ | |_(_) | __ | |/ /___  _   _ _ __      ║"),
          makeLog("I", "SystemServer", "║  | ' // _' | '__|| __| | |/ / | ' // _ \\| | | | '_ \\     ║"),
          makeLog("I", "SystemServer", "║  | . \\ (_| | |   | |_| |   <  | . \\ (_) | |_| | | | |    ║"),
          makeLog("I", "SystemServer", "║  |_|\\_\\__,_|_|    \\__|_|_|\\_\\ |_|\\_\\___/ \\__,_|_| |_|    ║"),
          makeLog("I", "SystemServer", "║                                                            ║"),
          makeLog("I", "SystemServer", "║  \"I like building things that keep working when            ║"),
          makeLog("I", "SystemServer", "║   conditions aren't ideal.\"                                ║"),
          makeLog("I", "SystemServer", "╚════════════════════════════════════════════════════════════╝"),
          makeLog("D", "PackageManager", "Feature enabled: ANDROID_DEVELOPER_PRO_MAX"),
          makeLog("I", "Toast", 'Showing system toast: "Ready to build world-class Android apps! 🚀"'),
        ];
      },
    },
    {
      cmd: "resume",
      alias: ["cv", "download-resume"],
      category: "Nav",
      description: "Download Kartik's verified PDF résumé",
      badge: "PDF",
      action: () => {
        if (resumeSlot?.src) {
          const a = document.createElement("a");
          a.href = resumeSlot.src;
          a.download = "Kartik-Koundal-Resume.pdf";
          a.click();
          return [
            makeLog("I", "DownloadManager", "Dispatched download for Kartik-Koundal-Resume.pdf"),
            makeLog("D", "Storage", "File delivered successfully."),
          ];
        }
        return [
          makeLog("W", "DownloadManager", "Direct PDF file pending owner upload."),
          makeLog("D", "Contact", `Please request directly at ${contactContent.primary.email}`),
        ];
      },
    },
    {
      cmd: "help",
      alias: ["?", "man"],
      category: "Core",
      description: "List all executable Logcat commands and usage",
      badge: "docs",
      action: () => [
        makeLog("I", "Logcat", "Command reference:"),
        makeLog("D", "Commands", "• projects              : Inspect catalog & navigate to #projects"),
        makeLog("D", "Commands", "• skills                : Query tech stack & navigate to #skills"),
        makeLog("D", "Commands", "• open student-organizer: Launch native Android case study"),
        makeLog("D", "Commands", "• theme                 : Toggle between Day (Paper) and Night (Dark) mode"),
        makeLog("D", "Commands", "• hire-me               : Copy contact email & navigate to #contact"),
        makeLog("D", "Commands", "• sudo make-coffee      : Execute superuser barista routine"),
        makeLog("D", "Commands", "• easter-egg            : Unlock the hidden Android ASCII banner"),
        makeLog("D", "Commands", "• resume                : Download verified PDF résumé"),
        makeLog("D", "Commands", "• clear                 : Clear active Logcat output window"),
      ],
    },
    {
      cmd: "clear",
      alias: ["cls", "reset"],
      category: "Core",
      description: "Clear Logcat console stream (Ctrl+L)",
      action: () => {
        setLogs([]);
        return [];
      },
    },
  ], [resumeSlot]);

  // Filtering suggestions based on input
  const cleanQuery = query.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!cleanQuery) return commandList;
    return commandList.filter((item) => {
      if (item.cmd.toLowerCase().includes(cleanQuery)) return true;
      if (item.description.toLowerCase().includes(cleanQuery)) return true;
      if (item.alias?.some((a) => a.toLowerCase().includes(cleanQuery))) return true;
      return false;
    });
  }, [cleanQuery, commandList]);

  useEffect(() => {
    setSelectedSuggestionIndex(0);
  }, [query]);

  // Execute a command
  const executeCommand = async (commandName: string) => {
    const trimmed = commandName.trim().toLowerCase();
    if (!trimmed) return;

    // Echo input line
    const userLog = makeLog("D", "Input", `> ${commandName}`);
    setLogs((prev) => [...prev, userLog]);
    setQuery("");

    // Find matching command
    const matched = commandList.find(
      (c) =>
        c.cmd.toLowerCase() === trimmed ||
        c.alias?.some((a) => a.toLowerCase() === trimmed)
    );

    if (matched) {
      const result = await matched.action();
      if (result.length > 0) {
        setLogs((prev) => [...prev, ...result]);
      }
    } else {
      // Unknown command
      setLogs((prev) => [
        ...prev,
        makeLog("W", "Logcat", `Unknown command '${commandName}'.`),
        makeLog(
          "I",
          "Help",
          "Try: projects, skills, open student-organizer, theme, hire-me, sudo make-coffee, easter-egg, help"
        ),
      ]);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions[selectedSuggestionIndex]) {
        setQuery(suggestions[selectedSuggestionIndex].cmd);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && cleanQuery && suggestions[selectedSuggestionIndex]) {
        executeCommand(suggestions[selectedSuggestionIndex].cmd);
      } else if (query.trim()) {
        executeCommand(query);
      } else if (suggestions[selectedSuggestionIndex]) {
        executeCommand(suggestions[selectedSuggestionIndex].cmd);
      }
    }
  };

  // Filter logs by level
  const displayedLogs = useMemo(() => {
    if (levelFilter === "ALL") return logs;
    const hierarchy: Record<LogLevel, number> = {
      V: 1,
      D: 2,
      I: 3,
      W: 4,
      E: 5,
      A: 6,
    };
    const targetLevel = hierarchy[levelFilter];
    return logs.filter((log) => hierarchy[log.level] >= targetLevel);
  }, [logs, levelFilter]);

  // Color mapping matching Android Studio Logcat
  const getLevelStyle = (level: LogLevel) => {
    switch (level) {
      case "V":
        return "text-[var(--ink-muted)] opacity-80";
      case "D":
        return "text-emerald-700 dark:text-emerald-400 font-medium";
      case "I":
        return "text-[var(--accent)] font-semibold dark:text-[#5FB38F]";
      case "W":
        return "text-amber-600 dark:text-amber-400 font-semibold";
      case "E":
        return "text-rose-600 dark:text-rose-400 font-bold";
      case "A":
        return "text-red-700 dark:text-red-300 font-extrabold uppercase";
      default:
        return "text-[var(--ink)]";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-4 bg-[#111315]/80 backdrop-blur-sm">
          <m.div
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl bg-[var(--paper)] border border-[var(--rule)] rounded-[6px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-mono text-xs"
            role="dialog"
            aria-modal="true"
            aria-label="Android Studio Logcat Command Palette"
          >
            {/* Top Bar: Android Studio IDE Window Chrome */}
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--surface)] border-b border-[var(--rule)] select-none">
              {/* Left: IDE Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--paper)] border border-[var(--rule)] rounded-[4px] text-[11px] font-medium text-[var(--ink)] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  <Terminal size={12} strokeWidth={2} className="text-[var(--accent)]" />
                  <span>Logcat</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] text-[var(--ink-muted)] opacity-60">
                  <Smartphone size={11} strokeWidth={1.5} />
                  <span>pixel_8_pro (API 34)</span>
                </div>
                <div className="hidden md:flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[var(--surface-subtle)] text-[var(--ink-muted)] border border-[var(--rule)]/60">
                  <span>com.kartikkoundal.portfolio:2026</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                  className={`p-1.5 rounded-[3px] border border-transparent transition-colors cursor-pointer ${
                    isPaused
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)]"
                  }`}
                >
                  {isPaused ? <Play size={12} /> : <Pause size={12} />}
                </button>
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  title="Clear Logcat Buffer (Ctrl+L)"
                  className="p-1.5 rounded-[3px] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
                <div className="h-3 w-px bg-[var(--rule)] mx-1" />
                <button
                  type="button"
                  onClick={onClose}
                  className="px-2 py-1 rounded-[3px] text-[11px] font-mono text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-subtle)] border border-[var(--rule)] transition-colors cursor-pointer"
                  title="Close Logcat (Esc)"
                >
                  Close [Esc]
                </button>
              </div>
            </div>

            {/* Sub-bar: Log Level Filter & Filter Query */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[var(--surface-subtle)] border-b border-[var(--rule)]/60 text-[11px]">
              {/* Level Filter Chips */}
              <div className="flex items-center gap-1">
                <span className="text-[var(--ink-muted)] text-[10px] uppercase tracking-wider mr-1">
                  Level:
                </span>
                {(["ALL", "V", "D", "I", "W", "E"] as const).map((lvl) => {
                  const isActive = levelFilter === lvl;
                  const labels: Record<string, string> = {
                    ALL: "All",
                    V: "Verbose",
                    D: "Debug",
                    I: "Info",
                    W: "Warn",
                    E: "Error",
                  };
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-1.5 py-0.5 rounded-[2px] transition-colors cursor-pointer text-[10px] ${
                        isActive
                          ? "bg-[var(--accent)] text-white font-semibold"
                          : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      {labels[lvl]}
                    </button>
                  );
                })}
              </div>

              {/* Notification Pill */}
              {copiedNotification && (
                <div className="flex items-center gap-1 text-[10px] text-[var(--accent)] font-medium animate-fadeIn">
                  <Check size={11} strokeWidth={2.5} />
                  <span>Copied: {copiedNotification}</span>
                </div>
              )}
            </div>

            {/* Android Studio Filter / Command Input Prompt */}
            <div className="flex items-center px-3 py-2 bg-[var(--paper)] border-b border-[var(--rule)]">
              <span className="text-[var(--accent)] font-bold mr-2 select-none">&gt;</span>
              <span className="text-[var(--ink-muted)] text-[11px] mr-2 select-none hidden sm:inline opacity-70">
                package:mine
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Enter command: projects, skills, open student-organizer, theme, hire-me, sudo make-coffee..."
                className="w-full bg-transparent font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none"
                aria-label="Logcat command input"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[var(--ink-muted)] hover:text-[var(--ink)] px-1"
                  title="Clear input"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Quick Command Suggestions Row */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)]/40 border-b border-[var(--rule)]/60 overflow-x-auto whitespace-nowrap scrollbar-none">
              <span className="text-[10px] uppercase text-[var(--ink-muted)] tracking-wider mr-1 shrink-0">
                Cmds:
              </span>
              {suggestions.map((item, idx) => {
                const isSelected = idx === selectedSuggestionIndex;
                return (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => executeCommand(item.cmd)}
                    onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[11px] font-mono cursor-pointer transition-colors shrink-0 ${
                      isSelected
                        ? "bg-[var(--accent)] text-white font-medium"
                        : "bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] border border-[var(--rule)]"
                    }`}
                  >
                    <span>{item.cmd}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1 rounded-[2px] ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[var(--accent-tint)] text-[var(--accent)]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Logcat Console Output Area */}
            <div
              ref={logConsoleRef}
              className="flex-1 overflow-y-auto p-3 bg-[var(--paper)] max-h-[360px] min-h-[220px] divide-y divide-[var(--rule)]/20 leading-relaxed font-mono select-text"
              tabIndex={0}
            >
              {displayedLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--ink-muted)]">
                  Logcat console empty. Type a command above or press Enter to run.
                </div>
              ) : (
                displayedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-1 px-1 flex flex-wrap items-baseline gap-x-2 text-[11.5px] hover:bg-[var(--surface)]/40 transition-colors rounded-[2px]"
                  >
                    {/* Timestamp */}
                    <span className="text-[var(--ink-muted)] text-[10.5px] shrink-0 select-none opacity-70">
                      {log.time}
                    </span>

                    {/* PID-TID */}
                    <span className="text-[var(--ink-muted)] text-[10.5px] shrink-0 select-none opacity-50 hidden sm:inline">
                      {log.pid}-{log.tid}
                    </span>

                    {/* Level / Tag */}
                    <span className={`shrink-0 font-semibold ${getLevelStyle(log.level)}`}>
                      {log.level}/{log.tag}:
                    </span>

                    {/* Message Body */}
                    <span className="text-[var(--ink)] break-all whitespace-pre-wrap flex-1">
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Android Studio Status Bar */}
            <div className="px-3 py-1.5 bg-[var(--surface)] border-t border-[var(--rule)] flex flex-wrap items-center justify-between text-[10.5px] text-[var(--ink-muted)] select-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span>emulator-5554 online</span>
                </span>
                <span className="hidden sm:inline">
                  Lines: {displayedLogs.length} / {logs.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>↑↓ navigate</span>
                <span>·</span>
                <span>Tab complete</span>
                <span>·</span>
                <span>↵ execute</span>
                <span>·</span>
                <span>Esc close</span>
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

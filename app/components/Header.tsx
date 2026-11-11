"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { m, useScroll, useSpring } from "motion/react";
import { Menu, X, Search, FileText, Terminal } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CrashDialog } from "./CrashDialog";
import { siteContent } from "@/content/site";
import { contactContent } from "@/content/contact";
import { mediaManifest } from "@/content/media";

const CommandPalette = dynamic(
  () => import("./CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false }
);

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState<string>("projects");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [crashOpen, setCrashOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const nameClickHistoryRef = useRef<number[]>([]);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Resume status
  const resumeSlot = mediaManifest["resume-pdf"];
  const isResumeAvailable = Boolean(resumeSlot?.src);

  // Scroll Progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  // Global Ctrl/Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock scroll on mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = orig;
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [mobileMenuOpen]);

  // Scrollspy for active section
  useEffect(() => {
    if (!isHome) return;

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

    const sectionElements = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    sectionElements.forEach((el) => el && observer.observe(el));

    return () => {
      sectionElements.forEach((el) => el && observer.unobserve(el));
    };
  }, [isHome]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (isHome) {
      const targetId = href.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        el.focus({ preventScroll: true });
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else {
      window.location.href = "/" + href;
    }
  };

  const handleNameClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox")
    ) {
      return;
    }

    const now = Date.now();
    const recent = nameClickHistoryRef.current.filter((t) => now - t <= 3000);
    recent.push(now);
    nameClickHistoryRef.current = recent;

    if (recent.length >= 5) {
      e.preventDefault();
      nameClickHistoryRef.current = [];
      setIsGlitching(true);

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        setIsGlitching(false);
        setCrashOpen(true);
      } else {
        setTimeout(() => {
          setIsGlitching(false);
          setCrashOpen(true);
        }, 350);
      }
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-[var(--paper)]/95 backdrop-blur-xs border-b border-[var(--rule)] transition-colors duration-200"
      >
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Wordmark */}
          <Link
            href="/"
            onClick={handleNameClick}
            className={`font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 shrink-0 select-none ${
              isGlitching ? "animate-name-glitch text-rose-500" : ""
            }`}
          >
            {siteContent.hero.name}
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 font-mono text-xs relative"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = isHome && activeSection === id;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3 py-1.5 transition-colors cursor-pointer rounded-[2px] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
                    isActive
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <m.span
                      layoutId="activeNavIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 32,
                        mass: 1,
                      }}
                      className="absolute inset-0 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[4px] z-0"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Command palette, Theme Toggle, Resume */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Button: Android Studio Logcat */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--accent)] rounded-[4px] text-xs font-mono cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              aria-label="Open Android Logcat command palette (Ctrl+K)"
              title="Android Studio Logcat (Ctrl+K)"
            >
              <Terminal size={14} strokeWidth={1.75} className="text-[var(--accent)]" />
              <span className="hidden sm:inline">Logcat</span>
              <kbd className="hidden lg:inline text-[10px] text-[var(--ink-muted)] border border-[var(--rule)] px-1 rounded bg-[var(--paper)]">
                ⌘K
              </kbd>
            </button>

            {/* Resume Link */}
            {isResumeAvailable ? (
              <a
                href={resumeSlot.src!}
                download="Kartik-Koundal-Resume.pdf"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 min-h-[36px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)] rounded-[4px] text-xs font-mono font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              >
                <FileText size={14} strokeWidth={1.5} />
                <span>{siteContent.nav.resume}</span>
              </a>
            ) : (
              <div className="relative group hidden sm:inline-block">
                <button
                  type="button"
                  aria-disabled="true"
                  className="inline-flex items-center gap-1.5 px-3 min-h-[36px] border border-[var(--rule)] bg-[var(--surface)]/50 text-[var(--ink-muted)] opacity-60 rounded-[4px] text-xs font-mono font-medium cursor-not-allowed"
                >
                  <FileText size={14} strokeWidth={1.5} />
                  <span>{siteContent.nav.resume}</span>
                </button>
                <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-[#111315] text-white px-2.5 py-1 rounded-[4px] font-mono text-[10px] whitespace-nowrap shadow-lg border border-white/10 z-30">
                  {contactContent.resumePending}
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              aria-label={mobileMenuOpen ? siteContent.nav.menuClose : siteContent.nav.menuOpen}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={18} strokeWidth={1.5} />
              ) : (
                <Menu size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* 2px Scroll Progress Line */}
        <m.div
          style={{ scaleX, transformOrigin: "0%" }}
          className="h-[2px] w-full bg-[var(--accent)]"
        />

        {/* Mobile Full-Height Sheet Menu Panel */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-[var(--paper)] border-b border-[var(--rule)] px-6 py-8 flex flex-col justify-between overflow-y-auto"
          >
            <nav className="flex flex-col space-y-3 font-mono text-base" aria-label="Mobile Navigation List">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-3 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-[var(--rule)]">
              {isResumeAvailable ? (
                <a
                  href={resumeSlot.src!}
                  download="Kartik-Koundal-Resume.pdf"
                  className="w-full px-4 py-3 border border-[var(--rule)] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] font-mono text-sm font-medium flex items-center justify-between"
                >
                  <span>{siteContent.nav.resume} (PDF)</span>
                  <FileText size={16} strokeWidth={1.5} />
                </a>
              ) : (
                <div className="w-full px-4 py-3 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink-muted)] opacity-70 font-mono text-sm flex items-center justify-between cursor-not-allowed">
                  <span>{contactContent.resumePending}</span>
                  <FileText size={16} strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Command Palette Modal */}
      {paletteOpen && (
        <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
      )}

      {/* Fake Crash Dialog Easter Egg */}
      <CrashDialog isOpen={crashOpen} onClose={() => setCrashOpen(false)} />
    </>
  );
}

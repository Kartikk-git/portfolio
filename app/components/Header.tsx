"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useScroll, useSpring } from "motion/react";
import { Menu, X, Search, FileText, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";

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
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = "/" + href;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[var(--paper)] border-b border-[var(--rule)]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--ink)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 shrink-0"
          >
            Kartik Koundal
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
                  onClick={(e) => {
                    if (!isHome) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
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
                      className="absolute inset-0 bg-[var(--surface)] border border-[var(--rule)] rounded-[4px] z-0"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Command palette, Theme Toggle, Resume */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Button */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] rounded-[4px] text-xs font-mono cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              aria-label="Open command palette (Ctrl+K)"
              title="Search and Jump (Ctrl+K)"
            >
              <Search size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline text-[10px] text-[var(--ink-muted)] border border-[var(--rule)] px-1 rounded bg-[var(--paper)]">
                ⌘K
              </kbd>
            </button>

            {/* Resume Link */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 min-h-[36px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)] rounded-[4px] text-xs font-mono font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
            >
              <FileText size={14} strokeWidth={1.5} />
              <span>Resume</span>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
              aria-label="Toggle navigation menu"
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

        {/* Mobile Full-Width Menu Panel (200ms fade) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--rule)] bg-[var(--paper)] px-4 py-6 space-y-3 transition-opacity duration-200">
            <nav className="flex flex-col space-y-2 font-mono text-sm" aria-label="Mobile Navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="px-3 py-2 border border-[var(--rule)] rounded-[4px] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 border border-[var(--rule)] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] font-medium inline-flex items-center justify-between"
              >
                <span>Resume (PDF)</span>
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}


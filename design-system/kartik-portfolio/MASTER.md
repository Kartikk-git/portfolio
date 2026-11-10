# Design System Master File — Kartik Koundal Portfolio

> [!IMPORTANT]
> **PALETTE & TYPOGRAPHY OVERRIDE NOTE:**  
> The `ui-ux-pro-max` search script initially recommended an Indigo-based palette (`#4F46E5`, `#6366F1`, `#EEF2FF`, `#C7D2FE`) and Archivo/Space Grotesk typography.  
> As strictly mandated by the project brief in `AGENTS.md`, **all blue, violet, indigo, purple, and pink tones are strictly banned**, as are gradients and non-editorial typefaces.  
> The palette and typography below **fully override** the script's recommendations with the paper/ink/accent system (`#FAFAF7`, `#16181D`, `#1B6B4F`, Source Serif 4, IBM Plex Sans, IBM Plex Mono) specified in `AGENTS.md`.

---

**Project:** Kartik Koundal Personal Portfolio  
**Target Audience:** Recruiters, engineering hiring managers, technical interviewers  
**Aesthetic:** Editorial, restrained, typographically disciplined (like an engineering paper or a well-crafted CV; NOT a generic SaaS landing page)  
**Date Reconciled:** 2026-11-10  

---

## 1. Color System (Editorial Restraint)

Never use blue, indigo, violet, purple, pink, or magenta anywhere (including focus rings, text selection, and favicon).  
No gradients, no glow, no glassmorphism.

### Light Theme (Default / Paper)
| Token | Hex | CSS Variable | Purpose / Usage | Contrast vs Paper |
|---|---|---|---|---|
| Paper (Background) | `#FAFAF7` | `--paper` | Main document canvas | Base |
| Surface | `#F3F2EC` | `--surface` | Subtle cards/tables/inset blocks | - |
| Rule | `#DAD8CF` | `--rule` | 1px horizontal separators | 1.3:1 (structural boundary) |
| Ink | `#16181D` | `--ink` | Primary text, headings, dark icons | ~16.5:1 (WCAG AAA) |
| Ink Muted | `#5A5F69` | `--ink-muted` | Metadata, dates, subheadings | ~5.8:1 (WCAG AA text) |
| Accent | `#1B6B4F` | `--accent` | Links, focus ring, active nav marker | ~6.2:1 (WCAG AA/AAA) |

### Dark Theme (Hand-Tuned)
| Token | Hex | CSS Variable | Purpose / Usage | Contrast vs Background |
|---|---|---|---|---|
| Background | `#111315` | `--paper` | Main dark document canvas | Base |
| Surface | `#181B1E` | `--surface` | Inset blocks, code blocks | - |
| Rule | `#2A2E32` | `--rule` | 1px horizontal separators | 1.4:1 |
| Ink | `#E9E8E3` | `--ink` | Primary text, headings | ~15.2:1 (WCAG AAA) |
| Ink Muted | `#A2A7AE` | `--ink-muted` | Metadata, dates, secondary labels | ~6.4:1 (WCAG AA) |
| Accent | `#5FB38F` | `--accent` | Links, focus ring, active nav marker | ~7.1:1 (WCAG AAA) |

---

## 2. Typography Hierarchy

Self-hosted with `next/font/google`, subset to Latin, `font-display: swap`.

### Fonts
1. **Headings & Name:** `Source Serif 4` (`serif`) — weights 400, 600, 700. Line-height 1.1 to 1.2 (tight). No all-caps headings.
2. **Body & UI:** `IBM Plex Sans` (`sans-serif`) — weights 400, 500, 600. Body font size: 17px (`1.0625rem`), line-height: 1.65, max measure: `62ch`.
3. **Metadata, Dates, Code & Tech Stack:** `IBM Plex Mono` (`monospace`) — weights 400, 500. Metadata labels may be uppercase at `0.75rem` (`12px`) with `0.06em` tracking.

### Type Scale
- `0.75rem` (12px) — Micro-metadata, uppercase tracked tags
- `0.8125rem` (13px) — Small timestamps, secondary table info
- `0.9375rem` (15px) — Navigation items, project tags, captions
- `1.0625rem` (17px) — Body text (default)
- `1.25rem` (20px) — Subheadings (H3), project entry titles
- `1.75rem` (28px) — Section headings (H2)
- `2.5rem` (40px) — Case-study hero titles
- `clamp(2.75rem, 6vw, 4.5rem)` — Home Hero name (H1)

---

## 3. Layout, Grid & Spatial System

- **Base unit:** 4px
- **Max content container:** `1120px`
- **Grid:** 12-column grid with equal left and right edges at all viewports
- **Gutters:** 16px mobile (`375px`), 24px tablet (`768px`), 32px desktop (`1024px+`)
- **Vertical section padding:** 64px mobile, 96px desktop
- **Dividers:** 1px solid `var(--rule)` between all major sections (no alternating colored background blocks)
- **Border radius:**
  - `4px` for buttons, inputs, and small interactive targets
  - `0px` elsewhere (sharp, architectural rules and frames)
- **Project layout:** Clean horizontal rows (index, title, one-line description, mono stack separated by slashes, links) — **NEVER** generic boxed card grids.
- **Tags:** Plain mono text separated by slashes (`Python / Flask / Chart.js`), not rounded pill badges.

---

## 4. Shadows & Elevation

- **Rule:** Shadows heavier than `0 1px 2px rgba(0, 0, 0, 0.06)` are strictly prohibited.
- Default elevation is flat (ink on paper) separated by 1px rules.

---

## 5. Icons & Media

- **Icon library:** `lucide-react`, 1.5 stroke width, 18px size.
- **Icon placement:** Only where strictly carrying semantic utility (external link, download, email, GitHub, LinkedIn).
- **Prohibited:** No emoji icons anywhere, no decorative floating 3D shapes or abstract illustrations.
- **Screenshots:** Framed in simple 1px `var(--rule)` border.

---

## 6. Motion & Interaction Specifications

Minimal, purposeful, non-distracting motion:
- **Hero entrance:** Name, positioning, status line, buttons fade up 12px with 70ms stagger, 400ms duration, ease `cubic-bezier(0.22, 1, 0.36, 1)`. Total under 700ms.
- **Section reveals:** Opacity + 12px translateY, 350ms, once per element, triggered at 20% in view, max 5 staggered items at 60ms.
- **Hover/focus interactions:** 150ms color and underline offset changes; project rows translate +4px right on hover with subtle arrow appearance.
- **Route transitions:** 200ms opacity fade.
- **Theme switch:** 200ms transition on background and text colors.
- **Reduced motion:** Animate only transform and opacity. Respect `prefers-reduced-motion` strictly (opacity only at 0ms-100ms, transform disabled).
- **Library:** Framer Motion with `LazyMotion` and `domAnimation` bundle to keep home bundle tiny (< 100KB gzipped).

---

## 7. Banned Patterns Checklist (Enforced Quality Gate)

- ❌ No purple, blue, violet, indigo, pink, or magenta anywhere
- ❌ No gradient text or gradient backgrounds
- ❌ No glowing orbs, blurred ambient blobs, or neon effects
- ❌ No glassmorphism (`backdrop-filter: blur(...)`)
- ❌ No 3-card equal "features" rows with icons
- ❌ No progress bars, skill percentages, or star ratings
- ❌ No emoji (no waving hands, no rockets, no fire)
- ❌ No typing animations, marquees, counters, or canvas shaders
- ❌ No placeholder text (lorem ipsum, fake numbers, fake quotes)
- ❌ No dark-mode only (light paper default with hand-tuned dark mode toggle)

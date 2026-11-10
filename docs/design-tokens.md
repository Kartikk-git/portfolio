# Design Tokens — Kartik Koundal Portfolio

Derived from `app/globals.css` and established visual identity.

## 1. Color System

### Light Theme (Default Paper)
| Token | Value | Role | Contrast vs Paper |
|---|---|---|---|
| `--paper` | `#FAFAF7` | Base page background | Base |
| `--surface` | `#F3F2EC` | Card and component surfaces | ~1.1:1 |
| `--rule` | `#DAD8CF` | Hairline borders and dividers | ~1.3:1 |
| `--ink` | `#16181D` | Primary headings and body text | 15.6:1 (AAA) |
| `--ink-muted` | `#5A5F69` | Metadata, subtitles, secondary labels | 5.8:1 (AA) |
| `--accent` | `#1B6B4F` | Interactive states, status indicators, focus rings | 5.9:1 (AA) |
| `--shadow-subtle` | `0 1px 2px rgba(0, 0, 0, 0.06)` | Restrained elevation | — |

### Dark Theme (`data-theme="dark"`)
| Token | Value | Role | Contrast vs Background |
|---|---|---|---|
| `--paper` | `#111315` | Base page background | Base |
| `--surface` | `#181B1E` | Card and component surfaces | ~1.2:1 |
| `--rule` | `#2A2E32` | Hairline borders and dividers | ~1.5:1 |
| `--ink` | `#E9E8E3` | Primary headings and body text | 15.1:1 (AAA) |
| `--ink-muted` | `#A2A7AE` | Metadata, subtitles, secondary labels | 8.2:1 (AAA) |
| `--accent` | `#5FB38F` | Interactive states, status indicators, focus rings | 8.3:1 (AAA) |
| `--shadow-subtle` | `0 1px 2px rgba(0, 0, 0, 0.4)` | Restrained elevation | — |

*Note: No purple, blue, magenta, gradients, or glassmorphism are permitted anywhere.*

---

## 2. Typography Scale

| Token | Size | Line Height | Font Family | Role / Elements |
|---|---|---|---|---|
| `--text-hero` | `clamp(2.75rem, 6vw, 4.5rem)` | `1.05` | Source Serif 4 | Hero display name |
| `--text-2xl` | `2.5rem` (40px) | `1.15` | Source Serif 4 | Section primary title (`h2`) |
| `--text-xl` | `1.75rem` (28px) | `1.2` | Source Serif 4 | Card titles, modal titles |
| `--text-lg` | `1.25rem` (20px) | `1.4` | IBM Plex Sans | Sub-headings, lead statements |
| `--text-base` | `1.0625rem` (17px) | `1.65` | IBM Plex Sans | Body text, paragraph descriptions |
| `--text-md` | `0.9375rem` (15px) | `1.5` | IBM Plex Sans | Secondary body, detail text |
| `--text-sm` | `0.8125rem` (13px) | `1.6` | IBM Plex Sans / Mono | Section intros, card summaries, dates |
| `--text-xs` | `0.75rem` (12px) | `1.4` | IBM Plex Mono | Overlines (`01 · PROJECTS`), metadata, tags, counters |

---

## 3. Spacing & Grid System

- **Base Unit:** 4px
- **Max Content Width:** `1120px` (`max-w-[1120px]`)
- **Gutter:**
  - Mobile: `16px` (`px-4`)
  - Desktop: `32px` (`sm:px-8`)
- **Section Vertical Padding:**
  - Mobile: `64px` (`py-16`)
  - Desktop: `96px` (`md:py-24` / `lg:py-28`)
- **Card Padding:**
  - Standard cards: `p-6` (24px)
  - Detail panels: `p-6` to `p-8`
- **Component Gap:**
  - Section header to content: `mb-12` (48px)
  - Inter-card gap: `gap-6` (24px)

---

## 4. Radii, Borders & Shadows

- **Border Radius:**
  - Buttons, chips, inputs, modals: `4px` (`rounded-[4px]`)
  - Everything else: `0px` (`rounded-none`)
- **Border Style:**
  - `1px solid var(--rule)` (`border border-[var(--rule)]`)
  - Accent focus ring: `2px solid var(--accent)` with `2px offset`
- **Shadows:**
  - Single token: `var(--shadow-subtle)` (`0 1px 2px rgba(0, 0, 0, 0.06)` / `rgba(0, 0, 0, 0.4)`)
  - Never heavy drop shadows or blurred glows.

---

## 5. Motion Tokens (`lib/motion.ts`)

- **Durations:**
  - `hover` / `chips`: `120ms`
  - `cards` / `tabs` / `tooltips`: `160ms`
  - `panels` / `modals`: `240ms`
  - `reveals`: `400ms`
- **Easings:**
  - Entrance: `cubic-bezier(0.2, 0.7, 0.2, 1)`
  - Exit: `ease-in`
- **Properties Animated:** Only `opacity` and `transform`. Never width, height, margin, or layout properties.
- **Reduced Motion:** If `prefers-reduced-motion: reduce` is active, instant opacity transitions (<100ms) with zero transforms or smooth scrolls.


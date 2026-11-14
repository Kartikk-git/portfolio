# Kartik Koundal — Developer Portfolio

Personal engineering portfolio for **Kartik Koundal**, a B.Tech Computer Science & Engineering student at Dronacharya College of Engineering, built for software engineering and native Android internship applications.

Built with **Next.js 15 (App Router, static export)**, **TypeScript (strict)**, **Tailwind CSS v4**, and **Motion**.

---

## Visual Identity & Design Tokens

- **Editorial Restraint**: Designed like a high-grade engineering publication. No AI gradients, glowing blurred blobs, or generic card grids.
- **Color System** (defined in `app/globals.css` and documented in [`docs/design-tokens.md`](docs/design-tokens.md)):
  - **Light Theme (Paper)**: Base `#FAFAF7`, Surface `#F3F2EC`, Hairline Rule `#DAD8CF`, Ink `#16181D`, Muted Ink `#5A5F69`, Accent `#1B6B4F` (deep green, 5.9:1 contrast).
  - **Dark Theme**: Background `#111315`, Surface `#181B1E`, Hairline Rule `#2A2E32`, Ink `#E9E8E3`, Muted Ink `#A2A7AE`, Accent `#5FB38F` (8.3:1 contrast).
- **Typography**:
  - Headings: **Source Serif 4** (Display title `h2` at `text-3xl font-semibold tracking-tight`, name display clamp `2.5rem–4.25rem`).
  - Body & UI: **IBM Plex Sans** (Standard body at `text-base leading-[1.65]`).
  - Metadata, Overlines & Code: **IBM Plex Mono** (Labels at `text-xs uppercase tracking-[0.06em]`).

---

## Site Structure & Key Sections

1. **Hero**: Editorial introduction with current focus, quick positioning, resume download, and contact links.
2. **Selected Works (`ProjectsSection.tsx`)**:
   - Architectural timeline replacing generic card grids.
   - All 5 projects visible in sequence: **Student Organizer** (Android), **MPLAD** (Civic-Tech), **Hospital Management**, **Portfolio v1**, and **TEJOVIK** (Student Wellness).
   - Commit metadata, branch tags, and slide-over / inline case-study detail views.
3. **About (`AboutSection.tsx`)**:
   - Concise background, core technical focus, and engineering strengths.
4. **Activity & Commit Logs (`CommitLogSection.tsx`)**:
   - Interactive contribution heatmaps with real GitHub contributions (315 commits) and LeetCode submissions (144 submissions across 18 days).
   - "Replay Year" animation and platform filtering.
   - Dynamically code-split to maximize main-thread performance.
5. **Technical Stack (`SkillsSection.tsx`)**:
   - Grouped by Languages, Web, Core Fundamentals, Tools, and Frameworks.
   - Interactive stack explorer highlighting related projects on focus/hover.
6. **Work & Internships (`ExperienceSection.tsx`)**:
   - **Industrial Trainee · Java Android Kotlin** at **S O Infotech (P) Ltd. (Ducat)** (8 June – 20 July 2026).
   - Interactive modal viewers for the **Completion Certificate** and **Training Confirmation Letter**.
   - Direct link to the 46-page Student Organizer Project Report PDF.
7. **Education & Credentials (`EducationSection.tsx`)**:
   - Left-ruled vertical timeline with scroll-linked progress animation.
   - Formal education (B.Tech CSE, Class XII, Class X) and verified credentials (NPTEL Java Elite 95%, CodeChef Learning Tracks, Google Cloud Skill Badges).
   - Accessible modal certificate previewer with keyboard navigation.
8. **Contact & Footer (`ContactSection.tsx`, `Footer.tsx`)**:
   - Quick copy-email feedback with accessible live region, profile links, and minimal back-to-top navigation.

---

## Privacy & Document Redaction

All original documents in `docs/` are permanently redacted before being published to `public/docs-redacted/`:
- **Permanent Pixel-Level Redactions**: Third-party names (e.g. father's name) and university roll numbers are redacted using solid black boxes rendered directly into the pixels.
- **Zero Hidden Text / Overlays**: No CSS overlays or hidden text layers remain in public artifacts.
- **EXIF Stripped**: Image metadata is stripped to protect user privacy.

---

## Built-in Developer Secrets & Easter Eggs

The site includes 5 subtle, fully accessible developer secrets tracked via `lib/secrets.ts` and inspectable in DevTools:
1. **Footer Bugdroid**: A friendly Android mascot watching from the footer edge.
2. **Fake Crash Dialog**: Tapping the header name repeatedly triggers an authentic Android ANR/crash dialog.
3. **Tab Return**: Leaving the browser tab for 45+ seconds triggers a subtle "welcome back" notification.
4. **Android Eras (Konami Code)**: Typing `↑ ↑ ↓ ↓ ← → ← →` cycles through classic Android visual themes (Android 4.0 Holo, 5.0 Lollipop, Material You) with instant revert controls.
5. **Ultra Theme Escalation**: Holding or rapidly toggling the theme button unlocks high-contrast Flashbang and pure AMOLED modes.

Open DevTools (`F12`) to inspect progress via `secrets.status()`, get hints with `secrets.hint()`, or reset with `secrets.reset()`.

---

## Content System & Source of Truth

The website content layer strictly separates presentation from copy:

```
content/
├── website-content.md          # Canonical single source of truth
├── site.ts                     # Nav, hero, footer, and UI strings
├── projects.ts                 # 5 projects (Student Organizer, MPLAD, Hospital, Portfolio v1, TEJOVIK)
├── about.ts                    # Story, background, at-a-glance facts
├── activity.ts                 # Commit log & activity chart strings
├── skills.ts                   # 4 categories & technology definitions
├── credentials.ts              # Verified certificates, formal education, modal labels
├── contact.ts                  # Direct contact details and profile links
├── media.json                  # Media manifest for all asset slots
├── media.ts                    # Media slot definitions and fallback copy
├── github-contributions.json   # 315 public commits from real GitHub calendar
└── leetcode-contributions.json # 144 submissions across 18 days from real LeetCode data
```

### Content Validation
Run the automated validator to ensure all strings match the canonical copy verbatim:
```bash
npm run check:content
```
---

## Development & Building

```bash
# Verify content keys against website-content.md
npm run check:content

# Run strict TypeScript typecheck
npx tsc --noEmit

# Run ESLint
npm run lint

# Start Next.js local development server
npm run dev

# Build optimized production static export (outputs to /out)
npm run build

# Serve static output locally on port 3000
npm run serve
```

---

## Lighthouse & Performance Benchmarks

Audited on production static build:
- **Accessibility**: **100** / 100
- **Best Practices**: **100** / 100
- **SEO**: **100** / 100
- **Performance (Desktop)**: **94** / 100

---

## Static Deployment

The site exports pure HTML/CSS/JS to `/out` and is 100% compatible with GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static hosting provider.

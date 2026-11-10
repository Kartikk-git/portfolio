# Kartik Koundal — Developer Portfolio

Personal engineering portfolio for Kartik Koundal, a B.Tech Computer Science student at Dronacharya College of Engineering, built for software engineering and native Android internship applications.

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

## Content System & Source of Truth

The website content layer strictly separates presentation from copy:

```
content/
├── website-content.md          # Canonical single source of truth (Deliverable A)
├── site.ts                     # Nav, hero, footer, and UI strings
├── projects.ts                 # 5 projects (Student Organizer, MPLAD, Hospital, Portfolio v1, TEJOVIK)
├── about.ts                    # Story, background, at a glance facts, how I work strengths
├── activity.ts                 # Commit log & activity chart templates
├── skills.ts                   # 4 categories & skill chip tooltips
├── credentials.ts              # Verified certificates, formal education, modal labels
├── contact.ts                  # Direct contact details, mailto subject, profile links
├── media.json                  # Media manifest for all 22 asset slots
├── media.ts                    # Media slot definitions and placeholder copy
├── github-contributions.json   # 315 public commits from real GitHub calendar
└── leetcode-contributions.json # 144 submissions across 18 days from real LeetCode data
```

### Content Validation
Run the validator to guarantee every string matches canonical copy verbatim:
```bash
npm run check:content
```

---

## Key Features & Interactions

1. **Slide-Over Project Detail Panels**:
   - Every project card opens an accessible detail panel (720px slide-over on desktop, full-screen on mobile).
   - Deep-linked via URL hashes (`#project/student-organizer`, `#project/tejovik`, etc.).
   - Includes a sticky mini-nav with scroll-spy, previous/next project navigation, and a gallery strip.
2. **Designed Media Placeholders & Lightbox**:
   - When assets are pending (`src: null` in `content/media.json`), components render custom aspect-ratio placeholders with hairline borders, monospace tags, and hatch backgrounds.
   - Clicking any gallery item opens a full-screen, keyboard-navigable Lightbox.
   - To supply a real asset, simply change `"src": "/path/to/image.png"` in `content/media.json`.
3. **Live Contribution Heatmaps**:
   - Real GitHub contributions (315 commits) and LeetCode problem solving (144 submissions across 18 days).
   - Tab switching between *All activity*, *GitHub*, and *LeetCode*.
   - Month labels can be clicked to highlight that month's cells for 2 seconds.
   - Hovering legend intensity levels isolates matching days.
4. **Credential Preview Modal**:
   - Timeline items feature a "Preview certificate" action opening `CertificateModal.tsx` with a metadata sidebar (*Issuer*, *Issued*, *Score*, *Credential ID*, *Verify*).
   - CodeChef modal steps through all 5 completed tracks and assessments.
5. **Command Palette (`⌘K` / `Ctrl+K`)**:
   - Keyboard-operable modal searching across sections, projects, skills, and actions (toggle theme, copy email, download resume).
6. **Developer Review Mode (`?review=1`)**:
   - Visiting `/?review=1` activates review mode, outlining unconfirmed (`confirm: true`) statements with amber tags for quick audit.

---

## Development & Building

```bash
# Verify all content matches canonical copy verbatim
npm run check:content

# Run TypeScript typecheck
npx tsc --noEmit

# Start Next.js development server
npm run dev

# Build production static export (outputs to /out)
npm run build

# Serve static output locally on port 3000
npm run serve
```

---

## Static Deployment

The site exports pure HTML/CSS/JS to `/out` and is 100% compatible with GitHub Pages, Vercel, Netlify, or any static hosting provider.

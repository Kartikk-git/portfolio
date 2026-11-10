# Kartik Koundal — Personal Portfolio

Editorial, typography-first personal portfolio of Kartik Koundal, Computer Science student at Dronacharya College of Engineering, built for software engineering and native Android internship applications.

Built with Next.js 15 (App Router, static export), TypeScript (strict), Tailwind CSS v4, Motion (LazyMotion with `domMax`), and self-hosted Google Fonts (`next/font`).

---

## Architecture & Design System

- **Aesthetic Direction:** Editorial restraint, high typography discipline (Source Serif 4 for headings, IBM Plex Sans for body, IBM Plex Mono for code/metadata). No purple/pink AI gradients, no floating shapes, no glassmorphism, no fake stats.
- **Palette:**
  - Light (Paper `#FAFAF7`, Ink `#16181D`, Accent `#1B6B4F`, Surface `#F3F2EC`, Rule `#DAD8CF`)
  - Dark (Background `#111315`, Ink `#E9E8E3`, Accent `#5FB38F`, Surface `#181B1E`, Rule `#2A2E32`)
- **Tokens & Motion:** Single source of truth in [`lib/motion.ts`](file:///D:/apps/p1/lib/motion.ts) and [`design-system/kartik-portfolio/MASTER.md`](file:///D:/apps/p1/design-system/kartik-portfolio/MASTER.md).
- **Interactive Stack Explorer:** Clicking or focusing any technology in the Skills section highlights matching projects and dims non-matching projects to 35% opacity.
- **Command Palette:** Global keyboard palette on `Ctrl/Cmd+K` or header search button.

---

## Project Structure

```
.
├── app
│   ├── components
│   │   ├── Header.tsx              # Sticky minimal header, sliding active indicator, 2px progress bar
│   │   ├── Hero.tsx                # Keyframed pre-hydration intro, clamp typography, status badge
│   │   ├── ProjectsSection.tsx     # Ruled horizontal project rows (not a card grid), touch accordion
│   │   ├── AboutSection.tsx        # Plain 3-sentence profile from verified facts
│   │   ├── SkillsSection.tsx       # Grouped typographic text lists & interactive Stack Explorer
│   │   ├── EducationSection.tsx    # Ruled credentials table (NPTEL Java Elite lead) & education history
│   │   ├── ContactSection.tsx      # Email copy with live announcement, profiles & location
│   │   ├── Footer.tsx              # Name, year, three links
│   │   ├── CommandPalette.tsx      # Ctrl+K combobox dialog
│   │   ├── ThemeToggle.tsx         # Hand-tuned paper/dark switcher
│   │   ├── MotionProvider.tsx      # LazyMotion with domMax
│   │   ├── CaseStudyTemplate.tsx   # Shared template for deep-dive case studies
│   │   └── Icons.tsx               # Geometric SVG icons matching 1.5 stroke Lucide style
│   ├── fonts.ts                    # Self-hosted Source Serif 4, IBM Plex Sans, IBM Plex Mono
│   ├── globals.css                 # Tailwind v4 @theme, variables, hero keyframes
│   ├── layout.tsx                  # Root layout, theme bootstrapper script, JSON-LD Person schema
│   ├── page.tsx                    # Home page coordinating all sections & stack filter state
│   ├── robots.ts                   # Search engine crawling rules (noindex styleguide)
│   ├── sitemap.ts                  # Static sitemap export
│   ├── projects
│   │   ├── tejovik                 # Flagship web platform case study
│   │   └── student-organizer       # Native Android app case study with Room entities
│   └── styleguide
│       ├── page.tsx                # Internal token & contrast verification route
│       └── motion/page.tsx         # Live motion tokens & reduced-motion simulator
├── content
│   ├── profile.ts                  # Personal information, links, and grouped skills
│   ├── projects.ts                 # Project definitions, architectures, features, and repos
│   ├── education.ts                # Degree and school records
│   └── certifications.ts           # NPTEL, CodeChef tracks, Google Cloud Credly badges
└── design-system
    └── kartik-portfolio
        └── MASTER.md               # Reconciled design system master file
```

---

## How to Edit Content

All content is strictly separated from presentation logic:

1. **Profile, Bio & Social Links:** Edit [`content/profile.ts`](file:///D:/apps/p1/content/profile.ts).
2. **Projects & Case Studies:** Edit [`content/projects.ts`](file:///D:/apps/p1/content/projects.ts).
3. **Education Records:** Edit [`content/education.ts`](file:///D:/apps/p1/content/education.ts).
4. **Certifications & Badges:** Edit [`content/certifications.ts`](file:///D:/apps/p1/content/certifications.ts).

---

## Adding Assets & Owner Supply List

- **Resume PDF:** Place your final compiled resume at `public/resume.pdf`. The header and hero buttons will automatically serve it.
- **Project Screenshots:** Place 16:10 screenshots in `public/projects/tejovik/` and `public/projects/student-organizer/` to populate the case study frames.
- **Portrait (Optional):** If you wish to feature a portrait, place it at `public/images/portrait.jpg`.

---

## Development & Building

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run strict TypeScript type check
npx tsc --noEmit

# Build production static export (outputs to /out)
npm run build
```

---

## Deployment (Vercel or GitHub Pages)

### Vercel Deployment
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Framework Preset: **Next.js**.
4. Build Command: `npm run build`.
5. Output Directory: `out` (or default Next.js output).

### GitHub Pages Deployment
The app is configured for static export (`output: "export"` in `next.config.ts`). The static files in `out/` can be served directly from GitHub Pages or any static CDN.


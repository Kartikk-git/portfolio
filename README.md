<div align="center">

# Kartik Koundal

**I turn ideas into apps, and curiosity into code.**

A terminal-flavoured engineering portfolio with a live Android phone preview, built for software and native Android internship applications.

<p align="center">
  <a href="https://kartik-koundal.pages.dev/"><strong>Live site</strong></a> ·
  <a href="https://nextjs.org/">Next.js</a> ·
  <a href="https://www.typescriptlang.org/">TypeScript</a> ·
  <a href="https://tailwindcss.com/">Tailwind</a> ·
  <a href="#performance-and-quality">Lighthouse</a>
</p>

<p align="center">
  <a href="https://kartik-koundal.pages.dev/">Live site</a> ·
  <a href="https://github.com/Kartikk-git">GitHub</a> ·
  <a href="mailto:koundal.k29@gmail.com">Email</a>
</p>

</div>

<!-- Add a screenshot or short GIF here once the site is live:
<p align="center"><img src="docs/readme/hero.png" alt="Portfolio hero" width="820"></p>
-->

---

## About

I'm a third-year B.Tech Computer Science student at Dronacharya College of Engineering, Gurugram (2024–2028). My main focus is native Android with Kotlin and Jetpack Compose, plus Python and Flask on the backend and web side. This repository is the source of my portfolio.

**Currently open to software and Android internships.**

---

## Highlights

- **Live Android phone**: An Android mascot invites you to open a phone mockup that follows the section you are reading: Student Organizer, profile, commit grid, a Gradle build log, an internship calendar, credentials and a notification.
- **Command palette**: `Ctrl/Cmd + K` opens a terminal-style launcher with fuzzy search, grouped commands, theme switching and full keyboard support (ARIA combobox pattern).
- **Section rail**: A sticky left rail with a scroll-driven build progress readout (`assembleDebug 64%`) and one-click section jumping.
- **Activity heatmap**: Real GitHub and LeetCode contributions with a replayable fill animation, shared tooltip and a single-tab-stop roving grid.
- **Motion with restraint**: Typing tagline, count-up numbers, cursor-follow glow and tilt on cards and photos, all disabled on touch devices and with `prefers-reduced-motion`.
- **Hidden developer secrets**: Five easter eggs tracked in `lib/secrets.ts`. Open DevTools and run `secrets.hint()`.

---

## Projects featured on the site

| Project | Stack | Notes |
| :--- | :--- | :--- |
| **Student Organizer** *(flagship, in progress)* | Kotlin, Jetpack Compose, Material 3, Room, Coroutines, ViewPager2, Gradle KTS | Offline-first Android app for courses, assignments, notes, exams and attendance |
| **MPLAD: Empowered Indian** | TypeScript, HTML, CSS | Frontend of a civic-tech platform built for Smart India Hackathon |
| **TEJOVIK** | Python, Flask, JavaScript, Chart.js | Student performance and wellness analytics |
| **Hospital Management Website** | HTML, CSS, JavaScript | Early web project |
| **Personal Portfolio (v1)** | HTML, CSS, JavaScript | The first version of this site |

---

## Tech stack

| Area | Tools |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, static export), React, TypeScript (strict) |
| **Styling** | Tailwind CSS v4, CSS variables as design tokens |
| **Motion** | [Motion](https://motion.dev/) (`motion/react`) with shared tokens in `lib/motion.ts` |
| **Type** | Source Serif 4, IBM Plex Sans, IBM Plex Mono (self-hosted via `next/font`) |
| **Hosting** | Cloudflare Pages, automatic HTTPS, security headers via `public/_headers` |
| **Quality** | ESLint, `tsc --noEmit`, a content-parity checker, headless-browser verification scripts |

---

## Design principles

- **Terminal-editorial look**: Dark `#111315` base with an emerald `#5FB38F` accent, a light "paper" theme (`#FAFAF7` / `#1B6B4F`), and a serif + mono pairing.
- **Accessible by default**: Visible focus rings, WCAG AA or better contrast, semantic landmarks, keyboard access to every control, and polite live regions.
- **Motion that respects people**: Every animation is gated by reduced-motion and fine-pointer checks.
- **Content is separate from layout**: No copy is hardcoded in JSX.

---

## Project structure

```text
app/
├── components/          # Sections, rail, phone mockup, palette, modals
│   └── phone-screens/   # One component per phone screen
├── projects/            # Case-study routes (5)
├── styleguide/          # Token and motion reference
├── layout.tsx           # Fonts, metadata, JSON-LD
└── globals.css          # Tailwind v4 theme tokens, z-index tokens, keyframes
content/                 # Single source of truth for all copy and data
lib/                     # Motion tokens, hooks, active-section and phone stores
public/                  # Portraits, thumbnails, redacted documents, _headers
scripts/                 # Content checker, thumbnail generator, verification suites
```

<details>
<summary><b>Content system</b></summary>

All visible text lives in `content/*.ts` and is mirrored in `content/website-content.md`, which is the canonical reference. A checker verifies that the two match verbatim:

```bash
npm run check:content
```

Retired keys (for example removed placeholders and semester scorecards) stay documented but are excluded from the check.
</details>

<details>
<summary><b>Privacy and document handling</b></summary>

- Personal identifiers on published documents are redacted at the pixel level.
- Marksheet thumbnails on the page are blurred, and full documents open only in a modal.
- Image metadata (EXIF) is stripped.
</details>

---

## Getting started

**Requirements**: Node.js 20 or newer.

```bash
git clone https://github.com/Kartikk-git/<repo-name>.git
cd <repo-name>
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Start the development server |
| `npm run build` | Production static export to `out/` |
| `npm run serve` | Serve `out/` locally, applying `_headers` |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Strict type check |
| `npm run check:content` | Verify copy against `website-content.md` |
| `npm run check:fonts` | Verify font preloads |

---

## Deployment

The site is a pure static export, deployed on **Cloudflare Pages**.

| Setting | Value |
| :--- | :--- |
| **Build command** | `npm run build` |
| **Output directory** | `out` |
| **NODE_VERSION** | `20` |
| **NEXT_PUBLIC_SITE_URL** | The final site URL (used for canonical, Open Graph and sitemap) |

HTTPS is automatic. Security headers (CSP, nosniff, referrer policy, frame protection) come from `public/_headers`. It also works on Vercel, Netlify and GitHub Pages.

---

## Performance and quality

Measured with Lighthouse on the home page:

| Category | Mobile | Desktop |
| :--- | :---: | :---: |
| **Accessibility** | 100 | 100 |
| **Best Practices** | 100 | 100 |
| **SEO** | 100 | 100 |
| **Performance** | 94 | see note |

> **Note**: LCP is about 1.2 s and CLS is 0. The desktop performance figure varies with Lighthouse's simulated CPU throttling, so treat it as a rough indicator.

---

## Contact

I'm looking for a software or Android internship where I can contribute to a real codebase and learn from code review.

- **Email**: [koundal.k29@gmail.com](mailto:koundal.k29@gmail.com)
- **GitHub**: [@Kartikk-git](https://github.com/Kartikk-git)
- **Location**: New Delhi, India

<br />

<div align="center">
<sub>Built by Kartik Koundal · New Delhi, India</sub>
</div>

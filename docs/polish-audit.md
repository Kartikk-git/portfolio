# Portfolio Polish Audit — Baseline Analysis & Copy Revision Plan

**Date:** 2026-11-10  
**Target:** Personal portfolio of Kartik Koundal (`D:\apps\p1`)  
**Auditor:** Senior Front-End Designer & Engineer (Antigravity)  
**Reference Documents:** `AGENTS.md` (master brief), `ANTIGRAVITY_PROMPT.md` (including Owner Addendum §§10–11)

---

## 1. Executive Summary & Verification Metrics

| Metric | Result | Target | Status |
|---|---|---|---|
| `npx tsc --noEmit` | Clean (Exit Code 0, 0 errors) | 0 errors | **PASS** |
| `npm run build` | Clean static export to `/out` | 0 errors | **PASS** |
| `/` First Load JS | **173 kB** | **≤ 160 kB** | **ACTION REQUIRED (Code-split CommandPalette)** |
| 768px Viewport | Sideways horizontal scroll detected | No horizontal scroll | **ACTION REQUIRED (Fix layout bounds)** |
| 375px Viewport | Footer scroll edge boundary warning | Clean viewport bounds | **ACTION REQUIRED (Fix container bounds)** |
| Address-bar hashes | `#section` hashes written on click | URL stays clean `/` | **ACTION REQUIRED (replaceState hygiene)** |
| Internal routes in export | `/styleguide` exported in `out/` | Dev-only (404 in prod) | **ACTION REQUIRED (`notFound()` in prod)** |

### Baseline Audit Screenshots Captured
All audit screenshots generated into `shots/audit-*` via Chrome headless (`shoot.mjs`):
- `shots/audit-home-1440-light.png` (1440x4981)
- `shots/audit-home-1440-dark.png` (1440x4981)
- `shots/audit-home-1024-light.png` (1024x5200)
- `shots/audit-home-1024-dark.png` (1024x5200)
- `shots/audit-home-768-light.png` (768x5989) — *Horizontal overflow flag*
- `shots/audit-home-768-dark.png` (768x5989) — *Horizontal overflow flag*
- `shots/audit-home-375-light.png` (375x6698)
- `shots/audit-home-375-dark.png` (375x6698)

---

## 2. Paragraph-by-Paragraph Audit of Current Implementation

### Section 2: Typography & Contrast Scale
- **Clamp display sizes**: Hero name uses `clamp(2.75rem, 6vw, 4.5rem)`. Contact email must be elevated to `clamp(1.75rem, 4vw, 2.5rem)` serif.
- **Section overlines**: Currently `01 / Engineering Works`. Converting to mandated `02 — Projects` editorial overline (uppercase, `0.75rem`, `0.06em` tracking, accent number, `ink-muted` label).
- **Body copy**: Verified `1.0625rem` (17px) / 1.65 / 62ch max. Strictly left-aligned.
- **Tabular figures / oldstyle nums**: Add `font-variant-numeric: oldstyle-nums tabular-nums` to Education years and scores.
- **Font features**: Explicitly declare `font-feature-settings: "kern" 1, "liga" 1` in `globals.css`.
- **IBM Plex Mono on metadata**: Audit all timestamps, link counts, and badges to ensure no plain sans leaks into metadata roles.

### Section 3: Composition & Vertical Rhythm
- **Hero**: Kicker with 8px wide × 2px thick accent rule stub → two-line serif display name with surname indent → positioning sentence → mono slash contact row. Left-aligned on the same optical edge.
- **Projects**: Numbered rows `01–04` with 1.5–1.75rem serif titles. Pointer-fine 6px title shift + arrow slide, spring-smoothed cursor-following preview panel with clip-path reveal.
- **About**: Re-set the 3 sentences at 1.25rem serif with the **first sentence in `ink`** and the **subsequent two in `ink-muted`**.
- **Skills**: Rebuild as 2-column definition list (44% label / 56% items) with plain text items, preserving the interactive stack explorer filter.
- **Education**: Rebuild as single left-ruled architectural timeline with 1px vertical line, 5px square nodes, NPTEL lead accent marker, and right-aligned grades.
- **Contact**: Bold `clamp(1.75rem, 4vw, 2.5rem)` email heading with underline draw on hover, followed by mono profile rows.

### Section 4: Rules & Texture
- **Double-rule texture**: Add a second, static 48px `ink` rule (full opacity) layered directly over the 1px full-width `rule` line under each section heading.
- **Scroll entry rule drawing**: Maintain `ruleDrawVariants` (scaleX 0→1, 600ms) on divider lines.
- **Header progress & active indicator**: Keep 2px accent progress line and sliding `activeNavIndicator`; verify keyboard accessibility.

### Section 5: Detail Work
- **::selection colors**: Paper theme gets accent at 20% opacity (`rgba(27, 107, 79, 0.2)`); Dark theme gets ink at 15% opacity (`rgba(233, 232, 227, 0.15)`). Never blue.
- **Focus rings**: Programmatically enforce 2px accent outline with 2px offset on all interactive targets.
- **Favicon**: Create a typographic SVG mark (letter `K` in ink on paper with an accent rule stub) with zero blue.
- **Text links**: Gated `@media (hover: hover) and (pointer: fine)` left-to-right 200ms underline draw.
- **Contrast**: Both themes verified ≥ 4.5:1 text, ≥ 7:1 body.

### Section 6: Motion Discipline
- Retain CSS keyframe hero intro (<900ms, `sessionStorage` skip), `LazyMotion` `domMax`, 60ms staggered project rows, 1.5s copy-email check morph, 200ms palette fade.

### Section 7: Performance & Size Gates
- Dynamically import `CommandPalette` in `Header.tsx` via `next/dynamic` to drop `/` First Load JS from **173 kB** to **≤ 160 kB**.
- Clamp container widths to eliminate 768px horizontal scroll warning.

---

## 3. Section 10: Content Anti-Duplication & Narrative Depth Plan

To eliminate verbatim repetition across surfaces while strictly adhering to verified facts:

### A. Case-Study Overview ("In brief", max 2 sentences)
- **TEJOVIK**:
  > *"TEJOVIK correlates academic performance trends with daily student wellness habits through multi-period time-series charts. The custom CHETVIK calculation estimates cognitive readiness and burnout risk directly from reported study hours, sleep duration, and self-assessed stress levels."*
- **Student Organizer**:
  > *"Student Organizer provides a zero-latency, local-only academic planner that consolidates course schedules, assignments, exams, and attendance records. An interactive Jetpack Compose calendar allows direct daily status logging with immediate attendance percentage computation and threshold alerts."*

### B. "What I Built" Orientation Narrative
- **TEJOVIK**:
  > *"Students frequently struggle to identify how study routines, sleep deficits, and exam pressures compound into burnout. TEJOVIK was built as a unified web platform to track these dynamics side-by-side, pairing modular Flask view routing with interactive client-side visual telemetry to help students self-regulate their academic schedule."*
- **Student Organizer**:
  > *"Academic tracking apps often demand cloud accounts and steady network access for basic utility. Student Organizer solves this through an offline-first architecture, organizing courses, assignments, and attendance metrics strictly within a local Room database without remote server dependencies."*

### C. Case-Study Stack with Rationale
- **TEJOVIK**:
  - **Python & Flask**: Powers modular application routes, template delivery, and scoring logic endpoints.
  - **Chart.js & JavaScript**: Generates client-side time-series graphs for weekly, monthly, and all-time performance analysis.
  - **HTML5 & CSS3**: Delivers structured semantic layouts responsive across mobile and desktop displays.
- **Student Organizer**:
  - **Kotlin & Coroutines**: Handles asynchronous Room database queries, state management, and thread-safe data streams.
  - **Jetpack Compose (Material 3)**: Implements modern declarative components, including the interactive monthly attendance calendar.
  - **Room Database**: Enforces full on-device SQLite persistence so 100% of student records stay private on hardware.
  - **ViewBinding & ViewPager2**: Coordinates classic view navigation and swipeable viewports alongside Compose screens.
  - **Gradle KTS**: Provides type-safe Kotlin DSL dependency management and modular build pipelines.

### D. Case-Study Feature Bullets with "How It Works" Continuations
- **TEJOVIK**:
  1. **Modular dashboard views**: Dedicated sections for Home, Performance, CHETVIK, and Mind Boost organize academic statistics and wellness guidance into distinct functional views.
  2. **Time-range charting**: Chart.js renders weekly, monthly, and cumulative academic trends with client-side range filtering.
  3. **CHETVIK cognitive scoring**: Computes an indexed readiness score and visual burnout gauge by evaluating study hours, sleep duration, and stress levels against rule-based thresholds.
  4. **Assistance interface**: Built-in chat interface serves backend responses with automated client-side fallback replies during connection interrupts.
  5. **Daily focus & responsive layouts**: Features daily curated thought displays and fluid layout grids tested for desktop and mobile viewports.
- **Student Organizer**:
  1. **Centralized dashboard**: Aggregates urgent assignments, live attendance averages, upcoming exams, and active course entries into a unified glanceable view.
  2. **Course management**: Catalogs courses with course codes, assigned professors, lecture hours, and classroom locations.
  3. **Assignment tracking**: Manages task deliverables with completion toggle states and priority ratings.
  4. **Searchable local notes**: Organizes subject notes into searchable, categorized local records stored in Room.
  5. **Interactive attendance calendar**: Jetpack Compose calendar detects date taps to record Present or Absent marks, dynamically calculating attendance ratios and triggering low-attendance warnings when rates drop below required thresholds.
  6. **Exam & milestone scheduling**: Records exam dates, quiz sessions, and project submission deadlines with calendar association.
  7. **Local authentication & onboarding**: Welcomes students with an introductory walkthrough and password-protected local authentication.

### E. About Copy Adjustment (Removes Redundant Mentions)
- Sentence 1: *"I am a Computer Science undergraduate at Dronacharya College of Engineering, focused on software engineering and native Android development."*
- Sentence 2: *"My work spans web backends and data visualizations with Python, alongside native Android applications built with Kotlin and Jetpack Compose."*
- Sentence 3: *"I aim to write maintainable code, grounded in strong computer science fundamentals and disciplined software architecture."*

---

## 4. Section 11: Address-Bar Hygiene Plan

1. **Hash Stripping on Scroll**:
   - Update `Header.tsx`, `Hero.tsx`, `Footer.tsx`, and `CaseStudyTemplate.tsx`:
   - When a user clicks a section anchor (e.g. `Projects`), the page smoothly scrolls to `#projects`, shifts focus for accessibility, and immediately calls:
     ```ts
     window.history.replaceState(null, "", window.location.pathname);
     ```
   - The address bar stays cleanly at `/` (or `/projects/...`), never accumulating `#section` fragments.
2. **Production Elimination of Internal Routes**:
   - In `app/styleguide/page.tsx` and `app/styleguide/motion/page.tsx`:
     ```ts
     if (process.env.NODE_ENV === "production") {
       notFound();
     }
     ```
   - Guarantees internal token demonstration pages do not get generated in `/out` during production build.
3. **Sitemap & Canonical Cleanliness**:
   - `sitemap.ts` strictly outputs:
     - `https://kartikk-git.github.io/`
     - `https://kartikk-git.github.io/projects/tejovik`
     - `https://kartikk-git.github.io/projects/student-organizer`
   - Zero internal routes, zero fragments.
4. **Public Assets**:
   - `/resume.pdf`, `/projects/tejovik`, and `/projects/student-organizer` remain accessible and indexable for recruiters.

---

## 5. Execution Roadmap

1. **Step 1: Performance & Address-Bar Hygiene**
   - Code-split `CommandPalette` in `Header.tsx` via `next/dynamic`.
   - Implement hash-stripping `history.replaceState` in navigation handlers.
   - Guard `/styleguide` with `notFound()` in production.
   - Verify `npm run build` First Load JS ≤ 160 kB.
2. **Step 2: Typography, Double-Rules & Details**
   - Implement `02 — Projects` editorial overlines across all section headers.
   - Add the 48px dark ink double-rule under section headings.
   - Update `globals.css` with font-feature-settings, tabular figures, and selection tokens.
   - Add typographic favicon mark (`K` with accent rule).
3. **Step 3: Section Re-architecting & Copy Integration**
   - **Hero**: 8px accent rule stub, two-line display name with surname indent, mono slash contact row.
   - **About**: 1.25rem serif leading sentence in ink, remaining two in ink-muted.
   - **Skills**: Rebuild as 2-column definition list (44% label / 56% items) with stack explorer filter.
   - **Education**: Rebuild as single left-ruled architectural timeline with 5px square nodes and right-aligned grades.
   - **Contact**: Bold `clamp(1.75rem, 4vw, 2.5rem)` email heading and mono profile rows.
   - **Projects**: Numbered rows with 6px hover shift, arrow slide, and pointer-fine preview panel.
   - **Case Studies**: Integrate rewritten orientation prose, "how it works" feature lines, and stack rationale.
4. **Step 4: Final Verification, Screenshots & Report**
   - Re-shoot all 8 viewports into `shots/polish-*`.
   - Generate `docs/polish-report.md`.

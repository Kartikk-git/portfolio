# Deliverable B Implementation Plan

## 1. What Exists
- Single source of truth: `content/website-content.md` with 207 canonical keys.
- Design tokens document: `docs/design-tokens.md` extracted from `app/globals.css`.
- Content verification script: `npm run check:content` verifying all 207 keys verbatim.
- Media manifest: `content/media.json` and `content/media.ts` defining all required slots (screenshots, diagrams, videos, certificates, resume).
- Typed content modules in `content/`: `site.ts`, `projects.ts`, `about.ts`, `activity.ts`, `skills.ts`, `credentials.ts`, `contact.ts`.
- Heatmap contribution files: `content/github-contributions.json` (315 commits) and `content/leetcode-contributions.json` (144 submissions, 18 active days).
- Static server running on port 3000.

## 2. What We Will Refine & Change
- Standardize typography across the entire site to match Deliverable B constraints:
  - Display titles: Source Serif 4 (`text-3xl tracking-tight`)
  - Subtitles / overlines: IBM Plex Mono (`text-xs uppercase tracking-[0.06em]`)
  - Body text: IBM Plex Sans (`text-base leading-[1.65]`)
- Refine `Header.tsx`:
  - ⌘K search command palette
  - Active section scroll-spy indicator
  - Résumé button with disabled state and tooltip when `resume-pdf.src` is null
  - Theme toggle with accessible names from `siteContent.nav.themeToLight` / `themeToDark`
  - Mobile full-height sheet with focus trap and Esc handling
- Refine `Hero.tsx`:
  - Exact `hero.*` strings
  - "Currently building" line linking to Student Organizer detail
  - 3-tier CTAs: Primary (scroll to Projects), Secondary (Resume behaviour), Tertiary (scroll to Contact)
  - Fade-up reveal (under 900ms, respects `prefers-reduced-motion`)
- Refine `ProjectsSection.tsx`:
  - Numbered project cards with whole card as primary hit target
  - Source, live, and original links separately clickable
  - Open `ProjectDetail.tsx` slide-over panel on desktop (720px right panel) and full-screen on mobile
  - Hash-based routing (`#project/<slug>`) with browser back button support and focus trap/restore
  - Gallery strip with `MediaSlot.tsx` and full `Lightbox.tsx`
  - Unconfirmed APK link hidden in normal mode, visible with badge in `?review=1` mode
- Refine `AboutSection.tsx`:
  - `about.lead` in serif, followed by body paragraphs in regular body sans (fixing the "too big" font reported by user)
  - At a glance facts and How I work strengths in two columns
- Refine `CommitLogSection.tsx` (ActivityPanel):
  - All activity, GitHub, and LeetCode tabs with bound total counts
  - Monday to Sunday rows with Mon/Wed/Fri labels, month labels
  - Clicking month label highlights that month's cells for 2 seconds
  - Legend hover dimming other levels
  - Accessible screen-reader summary (`activity.summary.srOnly`)
  - Empty and error states
- Refine `SkillsSection.tsx`:
  - Four category cards with focusable chips
  - Tooltip on chip hover/focus from `skillsContent.tooltips`
  - "Next up" line beneath the grid
- Refine `EducationSection.tsx`:
  - Timeline with verified credentials and formal education
  - "Preview certificate" opening `CertificateModal.tsx` with metadata sidebar and slide navigation
- Refine `ContactSection.tsx`:
  - Two-column layout with copy email button (1.5s check state and toast), mailto subject, and profile links
  - Resume button with pending state
- Refine `Footer.tsx`:
  - `footer.line` and back-to-top control
- Review mode (`?review=1`):
  - Outlines `confirm: true` items with subtle tags for developer review.

## 3. What We Will Add
- `app/components/MediaSlot.tsx`: Renders real media if `src` is present; otherwise renders designed placeholder with monospace slot label, aspect ratio, hatch background, `ph.*` title and description.
- `app/components/Lightbox.tsx`: Fullscreen accessible modal with caption, counter, previous/next buttons, Esc close, touch swipe.
- `app/components/ProjectDetail.tsx`: Slide-over panel with sticky mini-nav, section anchors, prev/next project navigation, and gallery strip.
- `app/components/CertificateModal.tsx`: Certificate preview modal with metadata sidebar (Issuer, Issued, Score, Credential ID, Verify).


# Antigravity Prompt — Portfolio Polish Pass

Paste this file into Antigravity as the task brief. Read `AGENTS.md` in the repo root first; it is the master brief and stays binding. This file takes precedence only on visual/UX craft decisions. **You (Antigravity) may not add, remove, or reword content facts** — they come exclusively from `/content/*.ts` and `AGENTS.md`.

---

## 0. Role and goal

You are a senior front-end designer-engineer. The current site (Next.js 15, App Router, static export, Tailwind v4, TypeScript strict, Motion) is **correct but visually flat**: uniform type sizes, monotone rhythm, every section section looks like the last one, no compositional tension. Your job is one pass: **make it look commissioned, not specified** — a personal portfolio that would look at home next to a well-set print CV or an engineering studio's site.

Do this without violating any banned-list item in `AGENTS.md` (no gradients, no glow, no glassmorphism, no blue/purple/pink, no shadows beyond `0 1px 2px` at 6% opacity, no emoji, no stock imagery, no skill bars, no fake stats).

## 1. First act: audit

Before writing any code, produce an audit artifact saved to `docs/polish-audit.md`:

1. Read every file in `app/components/`, `app/globals.css`, `app/fonts.ts`, `lib/motion.ts`, `design-system/kartik-portfolio/MASTER.md`.
2. List, for each of the paragraphs 2–6 below, what the current code does and does not implement. Do not fix while auditing.
3. Run and report: `npx tsc --noEmit`, `npm run build`, the First Load JS of `/` from the build output, and the current screenshots at 375 / 768 / 1024 / 1440 (light and dark) into `shots/audit-*`.

Then present the audit and stop for approval before implementing.

## 2. Typography: raise the contrast of the scale

The most common cause of "bland": every element sits in the middle of the type scale. Fix:

- The two `clamp()` display sizes must actually be used — the hero name at the top of the scale, and nothing else above 2.5rem.
- Section headings: mix a mono overline **before** each serif heading: `02 — Projects` style (uppercase, 0.75rem, 0.06em tracking, accent color on the number, `ink-muted` on the label). This is allowed per `AGENTS.md` ("mono labels may be uppercase at 0.75rem") and is the single highest-leverage rhythm device.
- Body copy stays 17px / 1.65 / 62ch. Do not shrink it. Do not center it.
- Use Source Serif 4's tabular figures or `font-variant-numeric: oldstyle-nums` for the year/grade columns in Education so dates don't shout.
- Enable `font-feature-settings` kerning and ligatures as set — verify nothing turned them off in `globals.css`.
- Every date, label, tag and link-count line is IBM Plex Mono. If any plain sans sneaks into a "metadata" role, convert it. Metadata rendered as mono is how this site earns its editorial feel.

## 3. Composition: vary the vertical rhythm section by section

Sections currently all read as "heading + paragraph + rule". Give each one a distinct but related layout:

- **Hero:** stack is: mono kicker ("Open to software and Android internships" with a small accent rule stub, 8px wide, 2px thick) → serif display name on two lines (first name, then surname indent) → positioning sentence → contact row as mono text with slashes. Align the status line and the largest text on the same left edge; keep the whole block optically left-aligned, not centered.
- **Projects:** numbered rows. Left of each row: mono index `01 / 02 / 03 / 04`. Row title in serif 1.5–1.75rem. The hover preview panel mandated in `AGENTS.md` §3 must actually be implemented (spring-following, clip-path reveal, lazy-loaded). Title shift 6px + arrow slide on hover, pointer-fine only.
- **About:** set the three sentences at 1.25rem serif with the first sentence in `ink` and the rest in `ink-muted`. Max 62ch.
- **Skills:** two-column layout, category label in mono left column (44% width), items as plain text right column — a definition list, not chips. This is where the stack explorer (project highlighting on hover/click with `aria-pressed`) lives.
- **Education & Certifications:** a left-ruled timeline: 1px vertical rule, small nodes as 5px squares (4px margin), rows on that rule. NPTEL row leads with a small accent marker. Grades right-aligned mono on the same baseline as the degree.
- **Contact:** the one section allowed to be big: email set at clamp(1.75rem, 4vw, 2.5rem) serif with the underline-draw hover, plus mono rows for GitHub / LinkedIn / LeetCode / Credly underneath. Keep the copy-email morph-to-check interaction.

All sections still keep: 96px (desktop) / 64px (mobile) vertical padding, 1px `rule` separators, equal 1120px edges, 4px spacing rhythm.

## 4. The rules do more work

- Every section rule draws scaleX 0→1 on scroll entry (600ms, standard easing, once). Verify it exists in code, not just the brief.
- Under each section heading, a **second, shorter rule** (48px, `ink` at full opacity) over the full-width `rule` line — a classic editorial double-rule. Static, no motion. This is texture without color.
- The 2px accent progress line under the header and the sliding active-section indicator must both be verified working with keyboard navigation.

## 5. Detail work (the difference between plain and finished)

- `::selection` colors defined for both themes (accent bg at 20% on paper; ink bg at 15% on dark). Never blue.
- Focus rings: 2px accent outline with 2px offset, on **every** interactive element — audit programmatically, not by eye.
- Favicon: simple typographic mark (letter K, ink on paper, accent rule under) — no blue, no emoji-style icon.
- Links inside body text: underline draws left→right 200ms; verify `@media (hover: hover) and (pointer: fine)` gating exists.
- All images that currently render (none yet until owner screenshots arrive) must use `width`/`height`, AVIF/WebP, 1px ruled frame.
- Check every page with a contrast script (there is one in `app/styleguide/contrast.ts`) — both themes, all text pairs ≥ 4.5:1, body ≥ 7:1.

## 6. Motion discipline

Keep everything in `AGENTS.md` §Motion. Do not add any motion outside that list. Specifically verify: hero keyframe intro (CSS, <900ms, sessionStorage skip), LazyMotion `domMax` with the `m` components, staggered project rows (60ms), education line-draw + 5-row stagger, copy-email check morph, command palette 200ms fade + 0.98 scale, theme circular reveal via View Transitions (≤450ms). Reduced motion replaces transforms with 100ms fades; Save-Data disables the cursor-follow preview. Animations pause when the tab is hidden.

## 7. Performance and size gates (hard requirements)

- Home First Load JS ≤ 160 kB gzipped. It is currently ~173 kB. Reduce by code-splitting `CommandPalette` (dynamic import, loaded on first Ctrl/Cmd+K or Search click) every other route-level `m` usage stays. Re-measure and print the number.
- LCP < 2.0s, CLS 0, images sized, fonts subset Latin with `display: swap`.
- `npx tsc --noEmit` clean; `npm run build` clean; ESLint/Prettier clean.

## 8. Definition of done

1. `docs/polish-audit.md` — findings before work.
2. Implementation commit(s) — small, named by purpose.
3. `shots/` — new screenshots at 375 / 768 / 1024 / 1440 for home (light + dark) and both case studies (light).
4. `docs/polish-report.md` — what changed, measured JS/Lighthouse numbers, each check pass/fail against this file and `AGENTS.md`, plus anything deliberately skipped and why.
5. No content edits in `/content/*.ts`, no new invented facts, no visible placeholders. If something needs owner supply (screenshots, portrait), keep the existing `TODO(owner)` comments.

## 9. Working style

- Small edits, many verifications. After each visual change, screenshot and compare at 375 and 1440.
- Never "fix" contrast or layout by hard-coding hex — tokens in `globals.css` `@theme` only.
- Do not introduce any new dependency (no GSAP, no animation lib beyond `motion`).
- Content discipline amended for this pass only: you may **rephrase and expand presentation copy** (components and case-study sections) using only facts already in `/content/*.ts` and `AGENTS.md`. You may **not** add new facts, links, numbers, dates, features, or metrics. Never remove a fact.
- The styleguide route (`/styleguide`, `/styleguide/motion`) stays as the token reference — update it when tokens change.

---

# ADDENDUM (owner requests after first review)

## 10. Content depth and anti-duplication

The current copy repeats itself across surfaces. Enforce a **one-fact-one-place** rule: a given fact appears in one place in full, and elsewhere only as a different-angle phrasing. Specific known duplications to fix:

1. `project.description` is shown verbatim in both the home project row and the case-study "Overview" section. Rewrite the case-study overview as a short "In brief" paragraph (2 sentences max, own phrasing of the same facts) and let the home row keep the one-liner.
2. The stack appears three times on a case-study page (header meta, sticky tag row, and the Stack & Architecture box). Show it once in the header as the mono line, once grouped in the Stack section with the one-line "why it is used" per technology derived from the architecture notes — not four copied strings.
3. `whatIBuild` currently paraphrases the feature list directly below it. Write it instead as the narrative "what problem the app solves and how the build is organized" — orientation prose, not a feature list in prose clothing.
4. Home section headings ("Projects", "Skills", "Education & Certifications", "Contact") and case-study copy re-use identical sentence stems ("A web platform that…"). Vary the openings.
5. About sentences mention Flask/Compose/Room; Skills lists them again; project rows list them again. About keeps the two most load-bearing technologies; Skills lists the full picture; project stack lines stay with projects.

No invented material: every sentence must still be traceable to an existing content fact or a faithful rephrasing of it. Draft all rewritten copy in the audit doc first for owner approval, then integrate.

Depth requirement: case-study feature bullets must each get one short "how it works" continuation line where the architecture notes in `content/projects.ts` supply it (example allowed: Compose calendar taps → Room-backed attendance percentage → low-attendance warning). Zero new claims otherwise.

## 11. Address-bar hygiene

1. Section navigation must **never** write a hash to the URL. Header/hero/footer links scroll with the existing smooth + header-offset behavior and then call `history.replaceState(null, "", path)` so the address bar stays `/`. Keep the anchors in the DOM (accessibility, keyboard focus), just don't persist them. Same for the case-study sticky index links on deep-dive pages.
2. Internal-only routes must not exist in production: `/styleguide` and `/styleguide/motion` must return `notFound()` when built for production so they are excluded from the static export in `out/` (dev only). This covers "users must not access internal pages by editing the URL".
3. Canonical and `sitemap.xml` list only user-facing pages: `/`, `/projects/tejovik`, `/projects/student-organizer`. No internal routes, no fragment URLs.
4. `/resume.pdf` and both case-study pages stay public and shareable — they are part of the recruiter flow. Do not try to hide them; just ensure no internal pages leak.
5. The home page must be reachable at exactly `/` (plus trailing-slash handling) with no required query or hash.

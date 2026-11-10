# Antigravity Prompt — Portfolio Polish (compact)

Master rule: read `AGENTS.md` first; it stays binding. Take from `/content/*.ts` only. No new facts, links, numbers, dates, or features ever. No visible placeholders — keep `TODO(owner)`.

## Flags you must fix
| Flag | Fix |
|---|---|
| Flat/bland look | raise type-scale contrast; unused `clamp()` display sizes must be used; body stays 17px/1.65/62ch |
| Duplicate copy | `project.description` verbatim in row + case-study Overview → rewrite Overview as 2-sentence "In brief" (own phrasing, same facts). Stack pasted 3x per case study → once mono in header, once grouped with 1-line "why". `whatIBuild` paraphrases the feature list → make it orientation prose (problem + build organization). Vary repeated sentence stems ("A web platform that…"). About drops tech already in Skills/rows. |
| `/#about` etc. in URL | nav links scroll smooth (header offset) then `history.replaceState(null,"",path)` → address bar stays `/`. Anchors stay in DOM. Same for case-study sticky index. |
| Internal pages reachable by URL | `/styleguide` + `/styleguide/motion` return `notFound()` in production build → excluded from `out/`. |
| URL hygiene | canonical + sitemap keep only `/`, `/projects/tejovik`, `/projects/student-organizer` (already correct — verify). Case studies + `/resume.pdf` stay public. |

## Craft rules
- Sections in order: Hero / Projects / About / Skills / Education & Certs / Contact. Content column 1120px, 12-col, 96px (64px mobile) section padding, 1px `rule` separators, 4px spacing rhythm. Radius 4px buttons/inputs only.
- Typography: Source Serif 4 headings/name, IBM Plex Sans body, IBM Plex Mono for every metadata role (dates, index numbers, tags, labels). Mono overline before each section heading (`02 — Projects`, accent number, uppercase 0.75rem/0.06em). Grades/years in education use oldstyle/tabular figures.
- Composition per section: Hero = mono kicker (status) + serif display name (2 lines) + positioning + mono contact row, left-aligned. Projects = numbered rows (`01`), 6px title shift + arrow slide + clip-path preview panel on pointer-fine hover, inline accordion preview on touch. About = serif 1.25rem, first sentence `ink`, rest `ink-muted`, max 62ch. Skills = definition list, mono category left (44%), text right; hover/focus/click a tech → matching projects stay lit, others 35% opacity over 200ms, `aria-pressed` pinning. Education = left-ruled 1px timeline, 5px square nodes, NPTEL row leads with accent marker, grades right-aligned mono. Contact = serif email clamp(1.75–2.5rem) with underline-draw hover + mono profile rows + copy-email icon→check morph with aria-live.
- Detail: every section heading gets a second short 48px full-ink rule over the full-width rule (static). `::selection` accent 20% (light) / ink 15% (dark), never blue. 2px accent focus ring + 2px offset on everything — verify by script. Favicon: typographic K, ink on paper + accent underline, no blue.
- Motion: only per AGENTS.md list — hero CSS keyframe intro <900ms with sessionStorage skip, scaleX rule draws + rows stagger 60ms, layoutId active-nav indicator, copy-email check 1.5s, palette 200ms/0.98 scale, theme circle ≤450ms. Reduced motion = 100ms fades, no magnetic/scroll-linked/hero reveal. @media (hover:hover) and (pointer:fine) gates hover. Tab-hidden pauses. No new libs.

## Never
Gradients, glow, glassmorphism, shadows > `0 1px 2px` 6%, blue/indigo/violet/purple/pink/magenta, emoji, all-caps serif headings, Inter, stock/artificial imagery, skill bars/percentages, fake stats, carousels, modals for basic content, preloader, typing animation, tech-logo marquee, counters, scroll-jacking, hard-coded hex outside theme, content edits to `/content/*.ts`, new deps. Expanded copy may only rephrase existing facts and must be approved by owner first.

## Gates
1. First write `docs/polish-audit.md` (current-state findings incl. flags table + drafted copy rewrites) — stop for owner approval.
2. `npx tsc --noEmit` clean, `npm run build` clean, home First Load JS ≤ 160 kB gzipped (currently ~173 kB — code-split `CommandPalette` dynamic import on first need).
3. New `shots/` at 375/768/1024/1440 (home light+dark, case studies light).
4. `docs/polish-report.md`: what changed, measured numbers, flag-by-flag pass/fail, deliberate skips.
5. Update `/styleguide` token pages if tokens change. Contrast: body ≥7:1, all ≥4.5:1 both themes, verified by script.

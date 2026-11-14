# Improvement Pass Plan — 2026-11-13

Approved scope (owner answers on 2026-11-13):
1. Quality & correctness fixes
2. Mobile performance to 90+
3. Missing brief interactions (hover preview, stack explorer)

Explicitly out of scope per owner: easter-egg stack stays as-is (including blue Konami
theme and emoji); upload.app APK link stays; AndroidMockupDemo stays; CommandPalette
stays Logcat-style; project modal stays.

## Stage A — Quality & correctness

| # | Fix | Files |
|---|-----|-------|
| A1 | Remove invented commit metadata (fake hashes `a1b04f` etc., tags, dates, "BUILD SUCCESSFUL in 1.4s") | `app/components/ProjectsSection.tsx` |
| A2 | Stop rendering visible placeholders; skip media slots with `src === null`; strip "⚠" markers from rendered strings | `app/components/MediaSlot.tsx`, `app/components/EducationSection.tsx` |
| A3 | Shared focus trap + focus restore + Esc for every dialog (CommandPalette, ProjectDetail, Lightbox, CertificateModal, Experience modal, Header mobile menu) | new `lib/focusTrap.ts` + the five components |
| A4 | Per-page canonical URLs for `/projects/tejovik` and `/projects/student-organizer` | `app/projects/*/page.tsx` |
| A5 | Define used-but-missing utilities `animate-fadeIn`, `scrollbar-none` | `app/globals.css` |
| A6 | Reduced-motion gating: scroll-linked hero fade, timeline scaleY draws, `animate-pulse` | `app/components/Hero.tsx`, `ProjectsSection.tsx`, `EducationSection.tsx`, `globals.css` |
| A7 | Dead code: unused imports (`Search`, `Sparkles`, `CertificateModal`), unused content exports, dead CSS keyframes | various |
| A8 | `::selection` conflict in page.tsx; `duration-120` → real token; replace `any` with real types | `app/page.tsx`, `SkillsSection.tsx`, `CaseStudyTemplate.tsx`, styleguide pages |
| A9 | Route overlay/tooltip hard-coded hex through tokens (excluding easter-egg files, which stay as-is) | `CommandPalette`, `ProjectDetail`, `Lightbox`, `CertificateModal`, `SkillsSection`, `Hero`, `ContactSection`, `Header` |

## Stage B — Mobile performance (target 90+)

| # | Fix |
|---|-----|
| B1 | Contribution JSON (≈28 KB): ensure it lives in the dynamically-imported CommitLog chunk, not first load; round/compress data |
| B2 | `width`/`height` on all `<img>` (MediaSlot, Lightbox) from `media.json` ratios; lazy + decoding async |
| B3 | Hero intro race: set `data-hero-seen` in an inline pre-hydration script (sessionStorage), not on mount |
| B4 | Font preloading check (`next/font` preload attributes) |
| B5 | `scripts/serve.mjs`: HTTP caching headers; keep HTTP/1.1 (local tool) but document deploy target |
| B6 | Convert heavy PNG screenshots in `public/` to WebP where supply allows; set explicit dimensions |
| B7 | Idle-defer CommitLog hydration (IntersectionObserver) |
| B8 | Re-run Lighthouse mobile; record scores in final report |

## Stage C — Missing brief interactions

| # | Fix | Brief § |
|---|-----|---------|
| C1 | Pointer-following preview panel on project rows: real 16:10 screenshot, spring smoothing, clip-path reveal, keyboard-focus fixed variant, touch accordion, lazy-loaded, `hover:hover and pointer:fine` gate, disabled under Save-Data | §3 |
| C2 | Stack explorer: hover/focus/click a technology highlights projects using it, dims others to 35% over 200ms, "Used in N projects", click pins (`aria-pressed`), mapping derived from `projectsContent` stack data only | §4 |

## Verification gates after each stage
`tsc --noEmit`, `npm run lint`, `npm run check:content`, `npm run build`, browser check
at 375/768/1024/1440, final Lighthouse mobile + desktop, final report listing every
`TODO(owner)` and any deviation from this brief.

## Interpretation notes
- "3 rework on replay animation" = drop the LeetCode submission counts/toggle per
  option 3, but keep the Replay concept reworked: no live count-up pill, no
  `animate-ping`, reduced-motion safe. The LeetCode profile link itself stays.

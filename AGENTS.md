ROLE
You are a senior front-end engineer and designer building the personal portfolio of Kartik Koundal, a B.Tech CSE student applying for software and Android internships. The site must look like it was designed by a person with taste, not generated. It must read as professional to every kind of employer: startups, large IT services firms, product companies, and non-technical recruiters.

AUDIENCE AND SUCCESS TEST
A recruiter spends about 60 seconds. In that time they must learn: who he is, what he builds, the proof (projects, certificate), and how to contact him or download the resume. Every design decision serves that skim. A second reader is an engineer who opens the code and the GitHub links, so the code quality is part of the portfolio.

SOURCE OF TRUTH FOR CONTENT (use exactly; do not invent anything)
Name: Kartik Koundal
Location: New Delhi, India
Email: koundal.k29@gmail.com
GitHub: https://github.com/Kartikk-git
LinkedIn: https://www.linkedin.com/in/kartik-koundal-a41574323/
Status line: Open to software and Android internships
Credly: https://www.credly.com/users/kartik-koundal
LeetCode: https://leetcode.com/u/kartikk-git/ (link only; no solved-count or rank on the site)
Short positioning (editable): Computer Science student building web applications in Python and JavaScript and Android apps in Kotlin.

Education
- B.Tech, Computer Science & Engineering, Dronacharya College of Engineering, 2024 to 2028. CGPA 7.55/10.
- Senior Secondary (XII), St. Martin's Diocesan School, 2024. 77.4%.
- Secondary (X), St. Martin's Diocesan School, 2022. 77.2%.

Skills (group as written; no proficiency bars, no percentages, no star ratings)
- Languages: Java, Kotlin, Python, C++
- Web: HTML, CSS, JavaScript
- Core: Data Structures & Algorithms, OOP, DBMS, SQL
- Tools: Git, GitHub
- Frameworks and libraries (from project READMEs): Flask, Chart.js, Jetpack Compose, Room

Projects
1. TEJOVIK, Student Performance & Wellness Analysis Platform (flagship; own case-study page)
   Stack: Python, Flask, JavaScript, Chart.js, HTML, CSS.
   Facts: sections for Home, Performance, CHETVIK and Mind Boost; weekly, monthly and all-time performance charts; CHETVIK takes study hours, sleep hours and stress level and returns a cognitive score and a burnout gauge; a chat feature with backend responses and fallback replies; a daily thought; responsive on mobile.
   Links: repo https://github.com/Kartikk-git/TEJOVIK. Live URL: none yet. Screenshots: [SCREENSHOTS] (see MISSING INFORMATION).
2. Student Organizer, Android app (second case-study page)
   Stack: Kotlin, Jetpack Compose (Material 3), ViewBinding and ViewPager2, Room, Kotlin Coroutines, Gradle KTS. MVVM-inspired structure. Data stays on the device.
   Facts: dashboard (pending assignments, attendance, upcoming exams, active courses); courses with codes, instructors, schedules and rooms; assignments with status and priority; categorized, searchable notes; a Compose calendar where taps mark attendance Present or Absent, with attendance percentage and low-attendance warning; events for exams, quizzes and projects; onboarding and local login.
   Links: repo https://github.com/Kartikk-git/Student_Organizer. APK: link only to a GitHub Release once it exists; never to upload.app. Screenshots: [SCREENSHOTS].
   Do not mention the README roadmap (admin portal, ID cards, Firebase, cloud backup): not built.
3. Hospital Management Website. HTML and CSS. Responsive healthcare-themed site with pages for services, appointments, doctors and patient information. Focus on responsive layout and navigation. Repo: https://github.com/Kartikk-git/Hospital-management
4. Personal Portfolio Website (earlier version). HTML, CSS, JavaScript, deployed on GitHub Pages. Live: https://kartikk-git.github.io/my-portfolio/ Repo: https://github.com/Kartikk-git/my-portfolio

Certifications and credentials
- Programming in Java, NPTEL (IIT Kharagpur). Elite Certificate, score 95%, Jan to Apr 2026. (Lead item.)
- CodeChef: Git/GitHub; Learn HTML/CSS; CSS Intermediate; Projects using HTML/CSS. Group as "CodeChef learning tracks" with the note "600+ exercises, quizzes and practice tasks completed". CodeChef Python Skill Assessment: 90%.
- Google Cloud skill badges: 15 badges, issued Oct to Nov 2024, verified on Credly. Show as one grouped line with the Credly link, naming at most three (Prompt Design in Vertex AI; Develop GenAI Apps with Gemini and Streamlit; Deploy and Manage Applications on Google App Engine). Do not list all 15 and do not show the badge images in a grid.

Do NOT include: phone number on the public site (resume PDF only), the resume "Declaration" paragraph, GitHub achievement badges, LeetCode solved counts or rank, any private repo, any repo README roadmap item, any link to the upload.app APK page.

MISSING INFORMATION RULE
If a fact, link, image, metric or quote is not in the block above, do not invent it. Do not write lorem ipsum, fake users, fake numbers, fake testimonials or stock photos. Leave a short "TODO(owner): ..." code comment, omit the element from the rendered page, and list every TODO in the final report. Placeholders that would be visible to a visitor are forbidden.

SITE STRUCTURE
Single home page with these sections in order: Hero, Projects, About (max 3 sentences), Skills, Education & Certifications, Contact. Plus two case-study routes: /projects/tejovik and /projects/student-organizer (each: summary, what I built, features, stack, screenshots, what I learned, links). Plus /resume.pdf. Sticky minimal header with section links, a theme toggle and a "Resume" link. Footer: name, year, three links.

COPY STYLE
Plain, specific, first person, short sentences. No "passionate", "enthusiastic", "cutting-edge", "seamless", "leverage", "crafting", no emoji, no exclamation marks, no "Welcome to my portfolio", no "Hi, I'm ... 👋". Do not describe skills as adjectives; show the work. Avoid em dashes. Every sentence must be something he can defend in an interview.

DESIGN SYSTEM
Direction: editorial and restrained, in the spirit of a well-made engineering blog or a good CV, not a SaaS landing page.
Color tokens (define in Tailwind v4 @theme as CSS variables; verify contrast with a script):
- paper #FAFAF7, surface #F3F2EC, rule #DAD8CF, ink #16181D, ink-muted #5A5F69
- accent #1B6B4F (deep green; about 6:1 on paper; use for links, focus ring, active nav marker and one small mark only)
- Dark theme: background #111315, surface #181B1E, rule #2A2E32, ink #E9E8E3, ink-muted #A2A7AE, accent #5FB38F. Hand-tune; do not auto-invert.
Never use blue, indigo, violet, purple, pink or magenta anywhere, including focus rings, selection color and favicon. No gradients, no glow, no glassmorphism, no shadows heavier than 0 1px 2px at 6% opacity.
Type: Source Serif 4 (name, h1, h2), IBM Plex Sans (body, UI), IBM Plex Mono (dates, labels, small metadata). Self-host with next/font, subset to Latin, font-display swap. Scale (rem): 0.8125, 0.9375, 1.0625, 1.25, 1.75, 2.5, clamp(2.75, 6vw, 4.5). Body 17px, line-height 1.65, measure 62ch max. Headings tight (1.1 to 1.2), no all-caps headings; mono labels may be uppercase at 0.75rem with 0.06em tracking.
Layout: 4px spacing base. Content column max 1120px, 12-column grid, equal left and right edges at every width, 16px gutter on mobile, 32px on desktop. Section vertical padding 96px desktop, 64px mobile. Separate sections with 1px rules, not background color blocks. Project entries are rows (index, title, one-line description, stack in mono, links), not a grid of identical boxed cards. Border radius 4px for buttons and inputs, 0 elsewhere. Tags are plain mono text separated by slashes, not pills.
Icons: lucide-react, 1.5 stroke, 18px, only where they carry meaning (external link, download, mail, GitHub, LinkedIn). Never emoji.
Imagery: only real images supplied by the owner (project screenshots in a simple 1px-ruled frame, a portrait only if supplied). No stock photos, no 3D blobs, no abstract illustrations.

MOTION AND INTERACTION (rich, but disciplined)
Principle: motion explains structure and rewards attention; it never delays content or hides it from first paint. At most one signature moment per section. Everything listed below is allowed; anything not listed is not.

Tokens (single source: lib/motion.ts; no magic numbers elsewhere)
- Durations: fast 150ms, base 300ms, slow 500ms. No single animation longer than 900ms.
- Easing: standard cubic-bezier(0.22, 1, 0.36, 1); exit cubic-bezier(0.4, 0, 1, 1); spring stiffness 260, damping 32, mass 1 (no visible overshoot).
- Animate only transform, opacity and clip-path. Never width, height, top, left, margin or box-shadow. Layout animations only through Motion layoutId on small elements.

1. Hero intro (first visit per session; skipped on return via sessionStorage and with reduced motion)
Implemented in CSS keyframes so it runs before hydration. Headline lines reveal through a clipped mask (translateY 100% to 0), 80ms line stagger; then a 1px accent rule draws left to right (scaleX 0 to 1, 600ms); then the positioning line, status line and buttons fade up 12px with 70ms stagger. Total at most 900ms. Text is in the HTML and readable immediately; LCP must stay under 2.0s.

2. Scroll
- A 2px accent progress line under the header (scaleX linked to page scroll).
- The header's active-section indicator is one shared element that slides between links (Motion layoutId, spring).
- Section headings reveal line by line; every section rule draws in (scaleX 0 to 1, 600ms) as it enters view; reveals run once.
- Hero content fades and rises at most 24px as it scrolls out (scroll-linked via useScroll and useTransform).
- Education and certifications: a vertical 1px line draws as you scroll through the section; rows reveal in sequence, max 5 staggered at 60ms.

3. Projects
- Rows reveal with a 60ms stagger.
- Hover and keyboard focus (pointer-fine devices): the title shifts 6px, an arrow slides in, and a preview panel with a real screenshot (16:10) appears, following the pointer with spring smoothing and revealed by clip-path. Keyboard focus shows the same preview in a fixed position beside the row.
- Touch: tapping a row expands an inline accordion with the preview; a second tap opens the case study.
- Previews are lazy-loaded and only exist when real screenshots were supplied.

4. Stack explorer (skills linked to projects)
Skills are text buttons, not chips. Hovering, focusing or clicking a technology (for example Python, Kotlin, Flask, Room) highlights the projects that use it and dims the others to 35% opacity over 200ms, and shows "Used in N projects". Click pins the selection, click again clears it; use aria-pressed. The technology-to-project mapping is derived from the project stack data only, never typed separately.

5. Case studies
- Shared-element transition from the project row to the case-study header (title and rule), using the View Transitions API with a 300ms crossfade plus 8px rise as the fallback.
- A sticky section index with scroll-spy highlighting.
- Scrollytelling: a sticky frame shows the real screenshot that matches the feature text currently in view, swapping with a 300ms crossfade. Only when real screenshots exist; otherwise static.
- Images settle in with a 4% scale and opacity transition, 500ms, once.
- A muted looping screen recording only if the owner supplies one: visible pause control, poster fallback, not autoplayed under reduced motion or Save-Data.

6. Global interactions
- Command palette on Ctrl/Cmd+K, plus a Search button with a shortcut hint in the header. Actions: jump to sections, projects and case studies; open GitHub, LinkedIn, LeetCode; copy email; download resume; toggle theme. Combobox pattern, focus trapped, Esc closes, fully keyboard operable, 200ms fade with scale 0.98 to 1.
- Theme toggle: a circular reveal expanding from the toggle button via the View Transitions API (at most 450ms), falling back to a 200ms crossfade.
- Primary button: a magnetic pull of at most 6px on pointer-fine devices (spring) and an arrow that slides 4px on hover.
- Text links: underline draws left to right in 200ms.
- Copy-email button: the icon morphs to a check for 1.5s, announced through an aria-live region.
- Route changes: 300ms; outgoing fades out, incoming fades in with an 8px rise.
- Native scroll only. Anchor jumps use scroll-behavior smooth with a header offset.

7. Rules
- Hover effects only under @media (hover: hover) and (pointer: fine); touch gets tap equivalents.
- prefers-reduced-motion: replace transforms with 100ms opacity fades; disable the magnetic pull, scroll-linked effects, rule drawing and scrollytelling (show stacked images instead); the command palette and theme toggle stay, with instant switching.
- Save-Data or low-power signals: disable the cursor-following preview and any video.
- Animations pause when the tab is hidden. No infinite loops, except the optional owner-supplied recording.
- Everything works with keyboard only and with JavaScript disabled (content visible, no motion).
- Use Motion with LazyMotion and domMax; CSS for simple states and the hero intro; no second animation library.

BANNED (treat as test failures)
Purple/blue/violet gradients; gradient text; glowing orbs or blurred blobs; glassmorphism; neon; floating shapes; three-equal-cards "features" row with icon, title, paragraph; skill progress bars or percentages; emoji icons; "scroll down" bouncing arrow; typing animation; tech-logo marquee; fake stats; generic stock imagery; centered-everything layout; dark mode only; Inter as the main font; placeholder text; carousel for projects; modals for basic content; preloader or splash screen; custom cursor that replaces the system cursor; scroll-jacking or smooth-scroll libraries that take over native scroll; video with sound or autoplay without a pause control; number counters; parallax beyond the single hero scroll-out; any animation not listed in MOTION AND INTERACTION.

ACCESSIBILITY AND QUALITY GATES
- Semantic HTML (header, nav, main, section with headings, footer), one h1, skip link, visible 2px accent focus ring with 2px offset, all interactive elements keyboard reachable, cursor pointer on clickables, target size at least 44px on touch.
- Contrast: body text 7:1 or better, all text 4.5:1 minimum in both themes; verify with a script, not by eye.
- Responsive at 375, 768, 1024, 1440 with no horizontal scroll; long text and tags wrap, never clip.
- Performance on a production build: Lighthouse mobile 90+ for Performance and 95+ for Accessibility, Best Practices and SEO; LCP under 2.0s; CLS 0; INP under 200ms; home page JavaScript under 160KB gzipped; no long task over 50ms during a scripted scroll; images in AVIF or WebP with width and height set.
- SEO: unique title and meta description, canonical, Open Graph and Twitter card with a simple typographic OG image (name and role only, paper background), JSON-LD Person, sitemap.xml, robots.txt, lang="en".
- Code: strict TypeScript, no any, content in /content/*.ts, components small and named by purpose, design tokens only (no hard-coded hex outside the theme file), ESLint and Prettier clean, README explaining how to edit content and deploy.

WORKFLOW RULES
1. Before writing code, produce a short plan artifact (sections, file tree, token list, motion list) and wait for approval.
2. After each stage, run the app and verify in a real browser at 375, 768, 1024 and 1440 widths; attach screenshots.
3. Use the installed ui-ux-pro-max skill to generate and persist the design system to design-system/kartik-portfolio/MASTER.md, then reconcile it with the tokens above. Where they conflict, this brief wins.
4. Use the installed taste-skill checks as a review pass, with these overrides: classify the site as a personal portfolio; no shaders, scene effects or photo dealing; the one-section-per-screen rule is optional.
5. Final report lists: what was built, every TODO(owner), measured Lighthouse scores, axe results, and anything that deviates from this brief.

import fs from 'fs';

const markdown = fs.readFileSync('content/website-content.md', 'utf8');
const lines = markdown.split('\n');
const keyMap = new Map();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^`([a-zA-Z0-9_.]+)`(\s*⚠)?(?:\s+(.*))?$/);
  if (m) {
    const key = m[1];
    let val = m[3] ? m[3].trim() : '';
    if (!val) {
      const blockLines = [];
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j].match(/^`[a-zA-Z0-9_.]+`/) || lines[j].startsWith('---') || lines[j].match(/^#{1,3}\s/)) {
          break;
        }
        blockLines.push(lines[j]);
        j++;
      }
      val = blockLines.join('\n').trim();
    }
    keyMap.set(key, val);
  }
}

const get = (key) => {
  const val = keyMap.get(key);
  if (val === undefined) throw new Error(`Missing key: ${key}`);
  return val;
};

// 1. media.json
const mediaManifest = {
  "p1-shot-1": { type: "screenshot", src: null, ratio: "9/19.5", label: "Onboarding", caption: "Onboarding: the first-run carousel that introduces the app", project: "Student Organizer" },
  "p1-shot-2": { type: "screenshot", src: null, ratio: "9/19.5", label: "Dashboard", caption: "Dashboard: pending assignments, attendance, upcoming exams and active courses", project: "Student Organizer" },
  "p1-shot-3": { type: "screenshot", src: null, ratio: "9/19.5", label: "Courses", caption: "Courses: course list with live assignment progress", project: "Student Organizer" },
  "p1-shot-4": { type: "screenshot", src: null, ratio: "9/19.5", label: "Assignments", caption: "Assignments: tasks with status and priority", project: "Student Organizer" },
  "p1-shot-5": { type: "screenshot", src: null, ratio: "9/19.5", label: "Calendar and attendance", caption: "Calendar and attendance: the Compose calendar with tap-to-mark attendance", project: "Student Organizer" },
  "p1-shot-6": { type: "screenshot", src: null, ratio: "9/19.5", label: "Notes", caption: "Notes: study notes filtered by course", project: "Student Organizer" },
  "p1-demo": { type: "video", src: null, ratio: "16/9", label: "Student Organizer walkthrough", caption: "Demo: a short walkthrough of adding a course, logging attendance and filtering notes", project: "Student Organizer" },
  "p1-arch": { type: "diagram", src: null, ratio: "16/9", label: "Architecture", caption: "Architecture: how activities, fragments, Compose UI and Room fit together", project: "Student Organizer" },
  "p1-erd": { type: "diagram", src: null, ratio: "16/9", label: "Database", caption: "Database: the five Room entities and their relationships", project: "Student Organizer" },

  "p2-shot-1": { type: "screenshot", src: null, ratio: "16/10", label: "MPLAD Overview", caption: "MPLAD frontend governance dashboard view", project: "MPLAD" },
  "p2-shot-2": { type: "screenshot", src: null, ratio: "16/10", label: "Fund Analytics", caption: "Constituency fund allocation and utilization table", project: "MPLAD" },
  "p2-shot-3": { type: "screenshot", src: null, ratio: "16/10", label: "Project Tracker", caption: "Local development project progress view", project: "MPLAD" },

  "p3-shot-1": { type: "screenshot", src: null, ratio: "16/10", label: "Hospital Home", caption: "Healthcare services landing page layout", project: "Hospital Management" },
  "p3-shot-2": { type: "screenshot", src: null, ratio: "16/10", label: "Appointments", caption: "Doctor appointment request schedule interface", project: "Hospital Management" },

  "p4-shot-1": { type: "screenshot", src: null, ratio: "16/10", label: "Portfolio v1", caption: "Earlier single-page portfolio layout on GitHub Pages", project: "Portfolio v1" },

  "p5-shot-1": { type: "screenshot", src: null, ratio: "16/10", label: "Performance", caption: "Weekly, monthly and all-time Chart.js visual telemetry", project: "TEJOVIK" },
  "p5-shot-2": { type: "screenshot", src: null, ratio: "16/10", label: "CHETVIK Analysis", caption: "Cognitive readiness score and burnout gauge calculator", project: "TEJOVIK" },
  "p5-shot-3": { type: "screenshot", src: null, ratio: "16/10", label: "CHETVIK Chat", caption: "Automated wellness check-in assistant interface", project: "TEJOVIK" },
  "p5-demo": { type: "video", src: null, ratio: "16/9", label: "TEJOVIK walkthrough", caption: "TEJOVIK interactive wellness platform walkthrough", project: "TEJOVIK" },

  "cred-java": { type: "certificate", src: null, ratio: "4/3", label: "NPTEL Programming in Java", caption: "NPTEL IIT Kharagpur Elite Certificate (95%)", title: "Programming in Java" },
  "cred-codechef-1": { type: "certificate", src: null, ratio: "4/3", label: "Python Skill Assessment", caption: "CodeChef Python Assessment (90%)", title: "Python Skill Assessment" },
  "cred-codechef-2": { type: "certificate", src: null, ratio: "4/3", label: "Git/GitHub Track", caption: "CodeChef Git and GitHub Learning Track", title: "Git/GitHub" },
  "cred-codechef-3": { type: "certificate", src: null, ratio: "4/3", label: "Learn HTML/CSS", caption: "CodeChef HTML/CSS Foundation", title: "Learn HTML/CSS" },
  "cred-codechef-4": { type: "certificate", src: null, ratio: "4/3", label: "CSS Intermediate", caption: "CodeChef CSS Intermediate Track", title: "CSS Intermediate" },
  "cred-codechef-5": { type: "certificate", src: null, ratio: "4/3", label: "Projects using HTML/CSS", caption: "CodeChef HTML/CSS Projects Track", title: "Projects using HTML/CSS" },
  "cred-gcloud-1": { type: "certificate", src: null, ratio: "4/3", label: "Prompt Design in Vertex AI", caption: "Google Cloud Skill Badge", title: "Prompt Design in Vertex AI" },
  "cred-gcloud-2": { type: "certificate", src: null, ratio: "4/3", label: "Develop GenAI Apps with Gemini and Streamlit", caption: "Google Cloud Skill Badge", title: "Develop GenAI Apps with Gemini and Streamlit" },
  "cred-gcloud-3": { type: "certificate", src: null, ratio: "4/3", label: "Deploy and Manage Applications on Google App Engine", caption: "Google Cloud Skill Badge", title: "Deploy and Manage Applications on Google App Engine" },

  "resume-pdf": { type: "file", src: "/resume.pdf", label: "Résumé", title: "Kartik-Koundal-Resume.pdf" }
};

fs.writeFileSync('content/media.json', JSON.stringify(mediaManifest, null, 2) + '\n');
console.log('Wrote content/media.json');

// 2. content/media.ts
const mediaTs = `// Generated media definitions
import mediaData from './media.json';

export interface MediaSlotDef {
  type: 'screenshot' | 'video' | 'diagram' | 'certificate' | 'file';
  src: string | null;
  ratio?: string;
  label: string;
  caption?: string;
  title?: string;
  project?: string;
}

export const mediaManifest: Record<string, MediaSlotDef> = mediaData as Record<string, MediaSlotDef>;

export const mediaCopy = {
  phScreenshotTitle: ${JSON.stringify(get('ph.screenshot.title'))},
  phScreenshotBody: ${JSON.stringify(get('ph.screenshot.body'))},
  phVideoTitle: ${JSON.stringify(get('ph.video.title'))},
  phVideoBody: ${JSON.stringify(get('ph.video.body'))},
  phDiagramTitle: ${JSON.stringify(get('ph.diagram.title'))},
  phDiagramBody: ${JSON.stringify(get('ph.diagram.body'))},
  phCertificateTitle: ${JSON.stringify(get('ph.certificate.title'))},
  phCertificateBody: ${JSON.stringify(get('ph.certificate.body'))},
  phResumeTitle: ${JSON.stringify(get('ph.resume.title'))},
  phAlt: ${JSON.stringify(get('ph.alt'))},
};
`;
fs.writeFileSync('content/media.ts', mediaTs);
console.log('Wrote content/media.ts');

// 3. content/site.ts
const siteTs = `// Verbatim site content from content/website-content.md
export const siteContent = {
  title: ${JSON.stringify(get('site.title'))},
  description: ${JSON.stringify(get('site.description'))},
  nav: {
    itemsRaw: ${JSON.stringify(get('nav.items'))},
    items: ${JSON.stringify(get('nav.items').split('·').map(s => s.trim()))},
    searchLabel: ${JSON.stringify(get('nav.search.label'))},
    searchPlaceholder: ${JSON.stringify(get('nav.search.placeholder'))},
    searchEmpty: ${JSON.stringify(get('nav.search.empty'))},
    searchGroups: ${JSON.stringify(get('nav.search.groups'))},
    resume: ${JSON.stringify(get('nav.resume'))},
    themeToLight: ${JSON.stringify(get('nav.theme.toLight'))},
    themeToDark: ${JSON.stringify(get('nav.theme.toDark'))},
    menuOpen: ${JSON.stringify(get('nav.menu.open'))},
    menuClose: ${JSON.stringify(get('nav.menu.close'))},
  },
  hero: {
    eyebrow: ${JSON.stringify(get('hero.eyebrow'))},
    name: ${JSON.stringify(get('hero.name'))},
    headline: ${JSON.stringify(get('hero.headline'))},
    intro: ${JSON.stringify(get('hero.intro'))},
    focusLabel: ${JSON.stringify(get('hero.focus.label'))},
    focusItemsRaw: ${JSON.stringify(get('hero.focus.items'))},
    focusItems: ${JSON.stringify(get('hero.focus.items').split('·').map(s => s.trim()))},
    currentlyLabel: ${JSON.stringify(get('hero.currently.label'))},
    currentlyValue: ${JSON.stringify(get('hero.currently.value'))},
    ctaPrimary: ${JSON.stringify(get('hero.cta.primary'))},
    ctaSecondary: ${JSON.stringify(get('hero.cta.secondary'))},
    ctaTertiary: ${JSON.stringify(get('hero.cta.tertiary'))},
    linksRaw: ${JSON.stringify(get('hero.links'))},
    links: ${JSON.stringify(get('hero.links').split('·').map(s => s.trim()))},
    scrollCue: ${JSON.stringify(get('hero.scrollCue'))},
  },
  footer: {
    line: ${JSON.stringify(get('footer.line'))},
    top: ${JSON.stringify(get('footer.top'))},
  },
  toast: {
    emailCopied: ${JSON.stringify(get('toast.emailCopied'))},
    copyFailed: ${JSON.stringify(get('toast.copyFailed'))},
  },
  ui: {
    lightboxClose: ${JSON.stringify(get('ui.lightbox.close'))},
    lightboxPrev: ${JSON.stringify(get('ui.lightbox.prev'))},
    lightboxNext: ${JSON.stringify(get('ui.lightbox.next'))},
    lightboxCounter: ${JSON.stringify(get('ui.lightbox.counter'))},
    modalClose: ${JSON.stringify(get('ui.modal.close'))},
    linkExternal: ${JSON.stringify(get('ui.link.external'))},
    skip: ${JSON.stringify(get('ui.skip'))},
    reducedMotionNote: ${JSON.stringify(get('ui.reducedMotion.note'))},
  }
};
`;
fs.writeFileSync('content/site.ts', siteTs);
console.log('Wrote content/site.ts');

// 4. content/about.ts
const aboutTs = `// Verbatim about content from content/website-content.md
export const aboutContent = {
  eyebrow: ${JSON.stringify(get('about.eyebrow'))},
  heading: ${JSON.stringify(get('about.heading'))},
  subline: ${JSON.stringify(get('about.subline'))},
  lead: ${JSON.stringify(get('about.lead'))},
  body1: ${JSON.stringify(get('about.body.1'))},
  body2: ${JSON.stringify(get('about.body.2'))},
  body3: ${JSON.stringify(get('about.body.3'))},
  body4: ${JSON.stringify(get('about.body.4'))},
  factsLabel: ${JSON.stringify(get('about.facts.label'))},
  factsRaw: ${JSON.stringify(get('about.facts'))},
  strengthsLabel: ${JSON.stringify(get('about.strengths.label'))},
  strengthsRaw: ${JSON.stringify(get('about.strengths'))},
  confirmFlags: {
    body1: true,
    body2: true,
    strengths: true,
  }
};
`;
fs.writeFileSync('content/about.ts', aboutTs);
console.log('Wrote content/about.ts');

// 5. content/activity.ts
const activityTs = `// Verbatim activity content from content/website-content.md
export const activityContent = {
  eyebrow: ${JSON.stringify(get('activity.eyebrow'))},
  heading: ${JSON.stringify(get('activity.heading'))},
  intro: ${JSON.stringify(get('activity.intro'))},
  tabs: ${JSON.stringify(get('activity.tabs'))},
  github: {
    title: ${JSON.stringify(get('activity.github.title'))},
    description: ${JSON.stringify(get('activity.github.description'))},
    source: ${JSON.stringify(get('activity.github.source'))},
    footer: ${JSON.stringify(get('activity.github.footer'))},
  },
  leetcode: {
    title: ${JSON.stringify(get('activity.leetcode.title'))},
    description: ${JSON.stringify(get('activity.leetcode.description'))},
    source: ${JSON.stringify(get('activity.leetcode.source'))},
    footer: ${JSON.stringify(get('activity.leetcode.footer'))},
  },
  legend: ${JSON.stringify(get('activity.legend'))},
  monthsRaw: ${JSON.stringify(get('activity.months'))},
  months: ${JSON.stringify(get('activity.months').split('·').map(s => s.trim()))},
  daysRaw: ${JSON.stringify(get('activity.days'))},
  days: ${JSON.stringify(get('activity.days').split('·').map(s => s.trim()))},
  tooltip: {
    github: ${JSON.stringify(get('activity.tooltip.github'))},
    githubZero: ${JSON.stringify(get('activity.tooltip.github.zero'))},
    leetcode: ${JSON.stringify(get('activity.tooltip.leetcode'))},
    leetcodeZero: ${JSON.stringify(get('activity.tooltip.leetcode.zero'))},
  },
  summarySrOnly: ${JSON.stringify(get('activity.summary.srOnly'))},
  loading: ${JSON.stringify(get('activity.loading'))},
  error: ${JSON.stringify(get('activity.error'))},
  filterHint: ${JSON.stringify(get('activity.filterHint'))},
};
`;
fs.writeFileSync('content/activity.ts', activityTs);
console.log('Wrote content/activity.ts');

// 6. content/skills.ts
const skillsTs = `// Verbatim skills content from content/website-content.md
export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export const skillsContent = {
  eyebrow: ${JSON.stringify(get('skills.eyebrow'))},
  heading: ${JSON.stringify(get('skills.heading'))},
  intro: ${JSON.stringify(get('skills.intro'))},
  categories: [
    {
      id: 'languages',
      title: ${JSON.stringify(get('skills.cat.languages.title'))},
      description: ${JSON.stringify(get('skills.cat.languages.description'))},
      skills: ['Java', 'Kotlin', 'Python', 'C++']
    },
    {
      id: 'android',
      title: ${JSON.stringify(get('skills.cat.android.title'))},
      description: ${JSON.stringify(get('skills.cat.android.description'))},
      skills: ['Jetpack Compose', 'Material 3', 'ViewBinding', 'ViewPager2', 'Room', 'Coroutines', 'Gradle KTS']
    },
    {
      id: 'web',
      title: ${JSON.stringify(get('skills.cat.web.title'))},
      description: ${JSON.stringify(get('skills.cat.web.description'))},
      skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Flask', 'Chart.js']
    },
    {
      id: 'core',
      title: ${JSON.stringify(get('skills.cat.core.title'))},
      description: ${JSON.stringify(get('skills.cat.core.description'))},
      skills: ['DSA', 'OOP', 'DBMS', 'SQL', 'Git', 'GitHub']
    }
  ],
  tooltipsRaw: ${JSON.stringify(get('skills.tooltips'))},
  tooltips: {
    "Java": "Coursework. NPTEL Programming in Java, Elite certificate, 95%.",
    "Kotlin": "Student Organizer.",
    "Python": "TEJOVIK. CodeChef Python Skill Assessment, 90%.",
    "C++": "Programming fundamentals and data structures and algorithms.",
    "Jetpack Compose": "Student Organizer. Calendar, bottom sheets and dialogs.",
    "Material 3": "Student Organizer. Compose Material 3 components and theming.",
    "ViewBinding": "Student Organizer. Fragment layouts.",
    "ViewPager2": "Student Organizer. Swipeable tab navigation and onboarding.",
    "Room": "Student Organizer. Five entities on SQLite, with KSP.",
    "Coroutines": "Student Organizer. Lifecycle-aware async work.",
    "Gradle KTS": "Student Organizer. Version catalog and Kotlin DSL builds.",
    "HTML": "Hospital Management Website, Portfolio, TEJOVIK. Also CodeChef Learn HTML/CSS.",
    "CSS": "Same projects. Also CodeChef CSS Intermediate.",
    "JavaScript": "Portfolio and TEJOVIK. Section switching, charts and chat.",
    "TypeScript": "MPLAD frontend.",
    "Flask": "TEJOVIK. Chat endpoint and app server.",
    "Chart.js": "TEJOVIK. Performance charts.",
    "DSA": "LeetCode and CodeChef practice.",
    "OOP": "Coursework, and Java and Kotlin projects.",
    "DBMS": "Coursework.",
    "SQL": "Coursework. Room in Student Organizer runs on SQLite.",
    "Git": "Version control on every project, with GitHub Pages deployment for the static sites.",
    "GitHub": "Source for every project on this site."
  },
  next: {
    label: ${JSON.stringify(get('skills.next.label'))},
    value: ${JSON.stringify(get('skills.next.value'))},
  }
};
`;
fs.writeFileSync('content/skills.ts', skillsTs);
console.log('Wrote content/skills.ts');

// 7. content/credentials.ts
const credTs = `// Verbatim education & credentials content from content/website-content.md
export const credentialsContent = {
  eyebrow: ${JSON.stringify(get('edu.eyebrow'))},
  heading: ${JSON.stringify(get('edu.heading'))},
  intro: ${JSON.stringify(get('edu.intro'))},
  groupCert: ${JSON.stringify(get('cred.group.cert'))},
  groupFormal: ${JSON.stringify(get('edu.group.formal'))},
  modal: {
    labelsRaw: ${JSON.stringify(get('cred.modal.labels'))},
    labels: ${JSON.stringify(get('cred.modal.labels').split('·').map(s => s.trim()))},
    placeholder: ${JSON.stringify(get('cred.modal.placeholder'))},
    close: ${JSON.stringify(get('cred.modal.close'))},
    prev: ${JSON.stringify(get('cred.modal.prev'))},
    next: ${JSON.stringify(get('cred.modal.next'))},
  },
  certifications: [
    {
      id: 'cred-java',
      title: ${JSON.stringify(get('cred.java.title'))},
      badge: ${JSON.stringify(get('cred.java.badge'))},
      issuer: ${JSON.stringify(get('cred.java.issuer'))},
      meta: ${JSON.stringify(get('cred.java.meta'))},
      body: ${JSON.stringify(get('cred.java.body'))},
      verifyRaw: ${JSON.stringify(get('cred.java.verify'))},
      verifyLabel: "Verify certificate",
      verifyUrl: null, // ⚠ link pending
      confirm: true,
      score: "95%",
      issued: "Jan to Apr 2026",
    },
    {
      id: 'cred-codechef',
      title: ${JSON.stringify(get('cred.codechef.title'))},
      badge: null,
      issuer: "CodeChef",
      meta: ${JSON.stringify(get('cred.codechef.meta'))},
      body: ${JSON.stringify(get('cred.codechef.body'))},
      itemsRaw: ${JSON.stringify(get('cred.codechef.items'))},
      items: [
        { title: "Python Skill Assessment", score: "90%", slot: "cred-codechef-1" },
        { title: "Git/GitHub", slot: "cred-codechef-2" },
        { title: "Learn HTML/CSS", slot: "cred-codechef-3" },
        { title: "CSS Intermediate", slot: "cred-codechef-4" },
        { title: "Projects using HTML/CSS", slot: "cred-codechef-5" },
      ],
      verifyRaw: ${JSON.stringify(get('cred.codechef.verify'))},
      verifyLabel: "View on CodeChef",
      verifyUrl: null, // ⚠ link pending
      confirm: true,
      issued: "Completed",
    },
    {
      id: 'cred-gcloud',
      title: ${JSON.stringify(get('cred.gcloud.title'))},
      badge: null,
      issuer: "Google Cloud, verified on Credly",
      meta: ${JSON.stringify(get('cred.gcloud.meta'))},
      body: ${JSON.stringify(get('cred.gcloud.body'))},
      verifyRaw: ${JSON.stringify(get('cred.gcloud.verify'))},
      verifyLabel: "View on Credly",
      verifyUrl: "https://www.credly.com/users/kartik-koundal",
      confirm: true,
      issued: "Oct to Nov 2024",
      badges: [
        "Prompt Design in Vertex AI",
        "Develop GenAI Apps with Gemini and Streamlit",
        "Deploy and Manage Applications on Google App Engine"
      ]
    }
  ],
  education: [
    {
      id: 'edu-btech',
      title: ${JSON.stringify(get('edu.btech.title'))},
      meta: ${JSON.stringify(get('edu.btech.meta'))},
      body: ${JSON.stringify(get('edu.btech.body'))},
      confirm: true, // ⚠ latest semester CGPA
    },
    {
      id: 'edu-xii',
      title: ${JSON.stringify(get('edu.xii.title'))},
      meta: ${JSON.stringify(get('edu.xii.meta'))},
      body: "",
      confirm: false,
    },
    {
      id: 'edu-x',
      title: ${JSON.stringify(get('edu.x.title'))},
      meta: ${JSON.stringify(get('edu.x.meta'))},
      body: "",
      confirm: false,
    }
  ]
};
`;
fs.writeFileSync('content/credentials.ts', credTs);
console.log('Wrote content/credentials.ts');

// 8. content/contact.ts
const contactTs = `// Verbatim contact content from content/website-content.md
export const contactContent = {
  eyebrow: ${JSON.stringify(get('contact.eyebrow'))},
  heading: ${JSON.stringify(get('contact.heading'))},
  intro: ${JSON.stringify(get('contact.intro'))},
  primary: {
    label: ${JSON.stringify(get('contact.primary.label'))},
    email: ${JSON.stringify(get('contact.primary.email'))},
    note: ${JSON.stringify(get('contact.primary.note'))},
  },
  cta: {
    copy: ${JSON.stringify(get('contact.cta.copy'))},
    mail: ${JSON.stringify(get('contact.cta.mail'))},
    resume: ${JSON.stringify(get('contact.cta.resume'))},
  },
  mailtoSubject: ${JSON.stringify(get('contact.mailto.subject'))},
  resumePending: ${JSON.stringify(get('contact.resume.pending'))},
  profilesLabel: ${JSON.stringify(get('contact.profiles.label'))},
  profilesRaw: ${JSON.stringify(get('contact.profiles'))},
  profiles: [
    { label: "Location", value: "New Delhi, India", url: null, note: null, confirm: false },
    { label: "GitHub", value: "Kartikk-git", url: "https://github.com/Kartikk-git", note: "Source code for every project on this site.", confirm: false },
    { label: "LinkedIn", value: "kartik-koundal", url: "https://www.linkedin.com/in/kartik-koundal-a41574323/", note: "Professional background.", confirm: false },
    { label: "Credly", value: "kartik-koundal", url: "https://www.credly.com/users/kartik-koundal", note: "Verified Google Cloud badges.", confirm: true },
    { label: "LeetCode", value: "kartikk-git", url: "https://leetcode.com/u/kartikk-git/", note: "Algorithm practice.", confirm: false }
  ]
};
`;
fs.writeFileSync('content/contact.ts', contactTs);
console.log('Wrote content/contact.ts');

// 9. content/projects.ts
let projectsTs = `// Verbatim projects content from content/website-content.md
export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  badge: string;
  cardText: string;
  tagsRaw: string;
  tags: string[];
  stack?: string[];
  description?: string;
  repoUrl?: string;
  liveUrl?: string;
  apkReleaseUrl?: string;
  linksRaw: string;
  links: {
    source: string;
    live?: string;
    original?: string;
    apk?: string;
    apkConfirm?: boolean;
  };
  overview: string;
  problem: string;
  contribution: string;
  functionality?: string;
  implementation: string;
  decisions?: string;
  next?: string;
  gallerySlotsRaw?: string;
  gallerySlots: string[];
  captionsRaw?: string;
  confirmFlags?: Record<string, boolean | undefined>;
}

export type Project = ProjectItem;

export const projectsContent = {
  eyebrow: ${JSON.stringify(get('projects.eyebrow'))},
  heading: ${JSON.stringify(get('projects.heading'))},
  intro: ${JSON.stringify(get('projects.intro'))},
  counter: ${JSON.stringify(get('projects.counter'))},
  card: {
    cta: ${JSON.stringify(get('projects.card.cta'))},
    source: ${JSON.stringify(get('projects.card.source'))},
    live: ${JSON.stringify(get('projects.card.live'))},
  },
  detailLabelsRaw: ${JSON.stringify(get('projects.detail.labels'))},
  detailLabels: {
    overview: "Overview",
    problem: "The problem",
    contribution: "My contribution",
    functionality: "What it does",
    implementation: "How it's built",
    decisions: "Design decisions",
    next: "What's next",
    gallery: "Gallery",
    stack: "Built with",
    close: "Close project details",
    prev: "Previous project",
    nextProject: "Next project",
  },
  items: [
    {
      id: "p1",
      slug: "student-organizer",
      title: ${JSON.stringify(get('p1.title'))},
      badge: ${JSON.stringify(get('p1.badge'))},
      cardText: ${JSON.stringify(get('p1.cardText'))},
      tagsRaw: ${JSON.stringify(get('p1.tags'))},
      tags: ${JSON.stringify(get('p1.tags').split('·').map(s => s.trim()))},
      linksRaw: ${JSON.stringify(get('p1.links'))},
      links: {
        source: "https://github.com/Kartikk-git/Student_Organizer",
        apk: "https://upload.app/download/student-organizer/com.example.studentorganizer/9c78038148ef6478bde73929e1cb09d46c9789deca56f92f160bac7d3d730c63",
        apkConfirm: true,
      },
      overview: ${JSON.stringify(get('p1.overview'))},
      problem: ${JSON.stringify(get('p1.problem'))},
      contribution: ${JSON.stringify(get('p1.contribution'))},
      functionality: ${JSON.stringify(get('p1.functionality'))},
      implementation: ${JSON.stringify(get('p1.implementation'))},
      decisions: ${JSON.stringify(get('p1.decisions'))},
      next: ${JSON.stringify(get('p1.next'))},
      gallerySlotsRaw: ${JSON.stringify(get('p1.gallery.slots'))},
      gallerySlots: ["p1-shot-1", "p1-shot-2", "p1-shot-3", "p1-shot-4", "p1-shot-5", "p1-shot-6", "p1-demo", "p1-arch", "p1-erd"],
      captionsRaw: ${JSON.stringify(get('p1.gallery.captions'))},
      confirmFlags: {
        apk: true,
        contribution: true,
      }
    },
    {
      id: "p2",
      slug: "mplad",
      title: ${JSON.stringify(get('p2.title'))},
      badge: ${JSON.stringify(get('p2.badge'))},
      cardText: ${JSON.stringify(get('p2.cardText'))},
      tagsRaw: ${JSON.stringify(get('p2.tags'))},
      tags: ${JSON.stringify(get('p2.tags').split('·').map(s => s.trim()))},
      linksRaw: ${JSON.stringify(get('p2.links'))},
      links: {
        source: "https://github.com/Kartikk-git/mplad-test",
        original: "https://empoweredindian.in",
      },
      overview: ${JSON.stringify(get('p2.overview'))},
      problem: ${JSON.stringify(get('p2.problem'))},
      contribution: ${JSON.stringify(get('p2.contribution'))},
      functionality: ${JSON.stringify(get('p2.functionality'))},
      implementation: ${JSON.stringify(get('p2.implementation'))},
      decisions: ${JSON.stringify(get('p2.decisions'))},
      next: ${JSON.stringify(get('p2.next'))},
      gallerySlots: ["p2-shot-1", "p2-shot-2", "p2-shot-3"],
      confirmFlags: {
        overview: true,
        contribution: true,
        functionality: true,
        implementation: true,
      }
    },
    {
      id: "p3",
      slug: "hospital-management",
      title: ${JSON.stringify(get('p3.title'))},
      badge: ${JSON.stringify(get('p3.badge'))},
      cardText: ${JSON.stringify(get('p3.cardText'))},
      tagsRaw: ${JSON.stringify(get('p3.tags'))},
      tags: ${JSON.stringify(get('p3.tags').split('·').map(s => s.trim()))},
      linksRaw: ${JSON.stringify(get('p3.links'))},
      links: {
        source: "https://github.com/Kartikk-git/Hospital-management",
        live: "https://kartikk-git.github.io/Hospital-management",
      },
      overview: ${JSON.stringify(get('p3.overview'))},
      problem: ${JSON.stringify(get('p3.problem'))},
      contribution: ${JSON.stringify(get('p3.contribution'))},
      implementation: ${JSON.stringify(get('p3.implementation'))},
      next: ${JSON.stringify(get('p3.next'))},
      gallerySlots: ["p3-shot-1", "p3-shot-2"],
      confirmFlags: {
        badge: true,
        contribution: true,
      }
    },
    {
      id: "p4",
      slug: "portfolio-v1",
      title: ${JSON.stringify(get('p4.title'))},
      badge: ${JSON.stringify(get('p4.badge'))},
      cardText: ${JSON.stringify(get('p4.cardText'))},
      tagsRaw: ${JSON.stringify(get('p4.tags'))},
      tags: ${JSON.stringify(get('p4.tags').split('·').map(s => s.trim()))},
      linksRaw: ${JSON.stringify(get('p4.links'))},
      links: {
        source: "https://github.com/Kartikk-git/my-portfolio",
        live: "https://kartikk-git.github.io/my-portfolio",
      },
      overview: ${JSON.stringify(get('p4.overview'))},
      problem: ${JSON.stringify(get('p4.problem'))},
      contribution: ${JSON.stringify(get('p4.contribution'))},
      implementation: ${JSON.stringify(get('p4.implementation'))},
      next: ${JSON.stringify(get('p4.next'))},
      gallerySlots: ["p4-shot-1"],
      confirmFlags: {}
    },
    {
      id: "p5",
      slug: "tejovik",
      title: ${JSON.stringify(get('p5.title'))},
      badge: ${JSON.stringify(get('p5.badge'))},
      cardText: ${JSON.stringify(get('p5.cardText'))},
      tagsRaw: ${JSON.stringify(get('p5.tags'))},
      tags: ${JSON.stringify(get('p5.tags').split('·').map(s => s.trim()))},
      linksRaw: ${JSON.stringify(get('p5.links'))},
      links: {
        source: "https://github.com/Kartikk-git/TEJOVIK",
      },
      overview: ${JSON.stringify(get('p5.overview'))},
      problem: ${JSON.stringify(get('p5.problem'))},
      contribution: ${JSON.stringify(get('p5.contribution'))},
      functionality: ${JSON.stringify(get('p5.functionality'))},
      implementation: ${JSON.stringify(get('p5.implementation'))},
      decisions: ${JSON.stringify(get('p5.decisions'))},
      next: ${JSON.stringify(get('p5.next'))},
      gallerySlots: ["p5-shot-1", "p5-shot-2", "p5-shot-3", "p5-demo"],
      confirmFlags: {
        badge: true,
        contribution: true,
      }
    }
  ]
};
`;
projectsTs += "\nexport const projects = projectsContent.items;\n";
fs.writeFileSync('content/projects.ts', projectsTs);
console.log('Wrote content/projects.ts');

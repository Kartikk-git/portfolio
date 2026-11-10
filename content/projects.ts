export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  stack: readonly string[];
  isFlagship?: boolean;
  hasCaseStudy: boolean;
  repoUrl: string;
  liveUrl?: string;
  apkReleaseUrl?: string;
  features?: readonly string[];
  architecture?: readonly string[];
  whatIBuild?: string;
  whatILearned?: readonly string[];
  // Screenshots omitted until provided by owner
  // TODO(owner): Add real application screenshots for case-study pages
}

export const projects: readonly Project[] = [
  {
    slug: "tejovik",
    title: "TEJOVIK",
    subtitle: "Student Performance & Wellness Analysis Platform",
    description:
      "Web platform analyzing academic performance metrics alongside student wellness indicators, featuring interactive Chart.js analytics and the CHETVIK burnout gauge.",
    stack: ["Python", "Flask", "JavaScript", "Chart.js", "HTML", "CSS"],
    isFlagship: true,
    hasCaseStudy: true,
    repoUrl: "https://github.com/Kartikk-git/TEJOVIK",
    // Live URL: none yet
    whatIBuild:
      "Engineered a Flask application with dynamic Chart.js dashboards, CHETVIK cognitive scoring, fallback chat assistance, and responsive mobile layouts.",
    features: [
      "Structured navigation sections for Home, Performance, CHETVIK, and Mind Boost",
      "Interactive weekly, monthly, and all-time performance charts rendered with Chart.js",
      "CHETVIK algorithm calculating a cognitive score and burnout gauge from study hours, sleep hours, and stress level",
      "Chat feature with backend-driven responses and automated fallback replies",
      "Curated daily thought display and responsive layouts for mobile screens",
    ],
    architecture: [
      "Flask routing and template rendering",
      "Client-side Chart.js visualizations with custom time-range filtering",
      "Rule-based scoring calculation and chat fallback logic",
    ],
    whatILearned: [
      "Structuring modular Flask application routes and view handlers",
      "Managing responsive charting viewports across mobile and desktop breakpoints",
      "Implementing resilient fallback mechanisms for interactive web features",
    ],
  },
  {
    slug: "student-organizer",
    title: "Student Organizer",
    subtitle: "Native Android Academic Management Application",
    description:
      "Offline-first Android application with Jetpack Compose Material 3 UI, ViewPager2, and Room database for local course, attendance, assignment, and exam tracking.",
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Material 3",
      "ViewBinding",
      "ViewPager2",
      "Room",
      "Coroutines",
      "Gradle KTS",
    ],
    hasCaseStudy: true,
    repoUrl: "https://github.com/Kartikk-git/Student_Organizer",
    // APK: link only to a GitHub Release once it exists; never to upload.app
    // TODO(owner): Add GitHub Release APK URL once release is published
    whatIBuild:
      "Architected an offline-first Android app using MVVM-inspired structure where all student data remains securely on the physical device.",
    features: [
      "Centralized dashboard tracking pending assignments, live attendance, upcoming exams, and active courses",
      "Course management with codes, instructors, schedules, and classroom assignments",
      "Assignment tracking with completion status and priority indicators",
      "Categorized and searchable local notes",
      "Jetpack Compose calendar where interactive taps mark Present or Absent, showing real-time attendance percentage and low-attendance warnings",
      "Academic schedule events covering exams, quizzes, and project milestones",
      "Onboarding sequence and local device authentication",
    ],
    architecture: [
      "MVVM-inspired architecture with Kotlin Coroutines for asynchronous operations",
      "Room persistence database keeping 100% of student data local on device",
      "Hybrid UI implementation utilizing Jetpack Compose Material 3 alongside ViewBinding and ViewPager2",
      "Modular Gradle KTS build configuration",
    ],
    whatILearned: [
      "Bridging classic Android ViewBinding/ViewPager2 components with Jetpack Compose Material 3",
      "Designing relational Room schemas with reactive Coroutines data streams",
      "Enforcing offline-first principles and on-device privacy boundaries",
    ],
  },
  {
    slug: "hospital-management",
    title: "Hospital Management Website",
    subtitle: "Responsive Healthcare Services Web Interface",
    description:
      "Healthcare-themed multi-page website focused on accessible semantic structure, structured medical navigation, and responsive layouts across devices.",
    stack: ["HTML", "CSS"],
    hasCaseStudy: false,
    repoUrl: "https://github.com/Kartikk-git/Hospital-management",
    features: [
      "Dedicated multi-page architecture for hospital services, appointment booking, physician listings, and patient information",
      "Fully responsive grid and flexbox layouts tailored for mobile, tablet, and desktop viewports",
      "Semantic HTML5 navigation and accessible form structures",
    ],
  },
  {
    slug: "my-portfolio-v1",
    title: "Personal Portfolio (Earlier Version)",
    subtitle: "Initial Static Portfolio Site",
    description:
      "Static personal portfolio built with foundational web standards and deployed to GitHub Pages.",
    stack: ["HTML", "CSS", "JavaScript"],
    hasCaseStudy: false,
    repoUrl: "https://github.com/Kartikk-git/my-portfolio",
    liveUrl: "https://kartikk-git.github.io/my-portfolio/",
    features: [
      "Responsive layout for presenting personal projects and background",
      "Pure JavaScript client-side interactivity",
      "Automated deployment on GitHub Pages",
    ],
  },
] as const;


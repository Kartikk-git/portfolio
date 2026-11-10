// Verbatim projects content from content/website-content.md
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
  eyebrow: "01 · Projects",
  heading: "Selected Works",
  intro: "Five projects across native Android, a hackathon team build and data-driven web apps. Student Organizer is the one I'm putting the most into right now, so it gets the fullest write-up. Each card opens a detailed view.",
  counter: "5 projects",
  card: {
    cta: "View details",
    source: "Source",
    live: "Live site",
  },
  detailLabelsRaw: "- overview: Overview\n- problem: The problem\n- contribution: My contribution\n- functionality: What it does\n- implementation: How it's built\n- decisions: Design decisions\n- next: What's next\n- gallery: Gallery\n- stack: Built with\n- close: Close project details\n- prev: Previous project\n- next: Next project",
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
      title: "Student Organizer",
      badge: "Flagship · In progress",
      cardText: "An offline-first Android app that brings courses, assignments, notes, exams and attendance into one place. Data stays on the device in Room, and the interface combines Jetpack Compose Material 3 with ViewPager2 tab navigation.",
      tagsRaw: "Kotlin · Jetpack Compose · Material 3 · ViewBinding · ViewPager2 · Room · Coroutines · Gradle KTS",
      tags: ["Kotlin","Jetpack Compose","Material 3","ViewBinding","ViewPager2","Room","Coroutines","Gradle KTS"],
      linksRaw: "- Source: github.com/Kartikk-git/Student_Organizer\n- APK: ⚠ show only once a release build exists\n- Detailed view: opens the project panel",
      links: {
        source: "https://github.com/Kartikk-git/Student_Organizer",
        apk: "https://upload.app/download/student-organizer/com.example.studentorganizer/9c78038148ef6478bde73929e1cb09d46c9789deca56f92f160bac7d3d730c63",
        apkConfirm: true,
      },
      overview: "Student Organizer is an Android app for the academic side of college life: courses, assignments, study notes, exams and attendance, all in one place. Everything is stored on the device, so it behaves the same with or without a connection and doesn't need an account on any server.\n\nThe app is written in Kotlin and deliberately mixes two UI approaches. Tabbed navigation uses ViewBinding and ViewPager2. Dialogs, bottom sheets and the attendance calendar are written in Jetpack Compose with Material 3. The project is still in development, and the roadmap further down says where it is heading.",
      problem: "College students often keep deadlines, notes and attendance in separate tools: a calendar, a task app, a notes app, a counter, and photos of lecture slides. That scatter causes missed deadlines, and generic calendars don't calculate attendance at all, so it's easy to slip below the minimum a college requires, commonly 75%, without noticing. Notes and assignments also tend to live apart from the course they belong to, which makes revision slower than it needs to be. Many planner apps also depend on a server connection, which is a problem in a library or classroom with poor signal.",
      contribution: "Student Organizer is my own project. I wrote the problem statement, designed the local database schema, and built the screens, navigation and the attendance calendar. It is where I'm practising structuring a larger Android codebase: separate packages for activities, fragments, Compose UI, database and adapters, with a Gradle version catalog keeping dependencies in one place.",
      functionality: "**Dashboard.** A summary of pending assignments, overall attendance percentage, upcoming exams and active courses. When a section has no data yet, it shows a prompt to add a course, assignment or note instead of an empty screen.\n\n**Courses.** A directory of courses with code, title, instructor, schedule and room. Courses are created, edited and deleted from Compose bottom sheets. Each course links to its assignments and notes.\n\n**Assignments.** Tasks are tracked by subject, due date, status (Pending, In Progress, Completed) and priority (High, Medium, Low). Each course shows a live progress bar of completed versus total assignments.\n\n**Notes and study materials.** Notes are tied to a course. They can be searched by title or course name, opened in a detail view, edited and deleted. From a course you can jump straight to the notes tagged with its code.\n\n**Calendar and attendance.** A monthly calendar built in Jetpack Compose. Multi-tap gestures on a date toggle it between present and absent, and the overall attendance percentage updates immediately, with a warning when it drops below a threshold such as 75%. The same calendar holds events: exams, quizzes, projects and reminders, with a daily schedule view.\n\n**Onboarding and profile.** A short onboarding carousel for first-time users, local registration and login stored in Room and SharedPreferences, and a profile showing student ID, major, semester, email and academic stats.",
      implementation: "- **Language and UI:** Kotlin 2.1.0. Jetpack Compose with Material 3 for dialogs, bottom sheets and the calendar. ViewBinding and ViewPager2 for fragment-based tabs. Material Components for the view layer.\n- **Architecture:** MVVM-inspired, with lifecycle-aware coroutines (`lifecycleScope`) for asynchronous work.\n- **Persistence:** Room 2.8.5 over SQLite, with KSP for code generation. Five entities: User, Course, Assignment, Notes and AttendanceRecord. The database is named `student_organizer_database`.\n- **Build:** Gradle Kotlin DSL with a version catalog (`libs.versions.toml`). Minimum API level 24, target API level 35.\n- **Structure:** `activities` (Splash, Onboarding, Login, Register, Main), `fragments` (Home, Course, Notes, Calendar, Assignment, Profile), `compose`, `database`, `adapter`, `model` and `ui/theme`.",
      decisions: "**Local-first storage.** Room is the only data store. Notes, attendance and schedule stay on the phone, there is no forced login to a server, and the app is fast without a network. The cost is that there is no sync between devices yet, which is why cloud backup is on the roadmap.\n\n**A hybrid UI on purpose.** I kept ViewPager2 for swipeable tabs and used Compose Material 3 where it fits best: bottom sheets, dialogs and the calendar. This let me use Compose in a project whose navigation was already view-based, without rewriting everything at once.\n\n**Attendance by gesture, not by counter.** Rather than plus and minus buttons, attendance is marked directly on the calendar date it belongs to. The percentage is derived from those records, so it can't drift away from what the calendar shows.\n\n**Courses as the hub.** A course links to its assignments and notes, shows completion progress, and opens its own filtered notes. That keeps study material organised by subject instead of in one long list.\n\n**Status and priority kept separate.** An assignment has both a status and a priority, so \"how urgent\" and \"how far along\" are two different things on screen.",
      next: "Planned next, in roughly this order:\n\n1. **Notifications and backup.** Firebase Cloud Messaging for deadline and attendance warnings, and cloud sync so data can be restored across devices.\n2. **Institution features.** Role-based access for faculty and students, so faculty can publish schedules, coursework and class-wide attendance, with student records imported through CSV, Excel or REST APIs.\n3. **Digital documents.** A student ID card with a QR code, a campus transit pass, and fee statements and receipts.",
      gallerySlotsRaw: "See the media register in Deliverable B (slots `p1-shot-1` to `p1-shot-6`, `p1-demo`, `p1-arch`, `p1-erd`).",
      gallerySlots: ["p1-shot-1", "p1-shot-2", "p1-shot-3", "p1-shot-4", "p1-shot-5", "p1-shot-6", "p1-demo", "p1-arch", "p1-erd"],
      captionsRaw: "- Onboarding: the first-run carousel that introduces the app\n- Dashboard: pending assignments, attendance, upcoming exams and active courses\n- Courses: course list with live assignment progress\n- Assignments: tasks with status and priority\n- Calendar and attendance: the Compose calendar with tap-to-mark attendance\n- Notes: study notes filtered by course\n- Demo: a short walkthrough of adding a course, logging attendance and filtering notes\n- Architecture: how activities, fragments, Compose UI and Room fit together\n- Database: the five Room entities and their relationships",
      confirmFlags: {
        apk: true,
        contribution: true,
      }
    },
    {
      id: "p2",
      slug: "mplad",
      title: "MPLAD: Empowered Indian",
      badge: "Team project · Smart India Hackathon",
      cardText: "The frontend of a civic-tech platform our team built for Smart India Hackathon, aimed at making governance data more transparent and easier for citizens to explore. I was responsible for the frontend, written in TypeScript, HTML and CSS.",
      tagsRaw: "TypeScript · HTML · CSS",
      tags: ["TypeScript","HTML","CSS"],
      linksRaw: "- Source: github.com/Kartikk-git/mplad-test\n- Original project: empoweredindian.in\n- Detailed view: opens the project panel",
      links: {
        source: "https://github.com/Kartikk-git/mplad-test",
        original: "https://empoweredindian.in",
      },
      overview: "MPLAD is a civic-tech project built by a team for Smart India Hackathon. It builds on the open-source Empowered Indian initiative, whose goal is to bring transparency, accountability and public participation into governance in India. The platform works with public data on local-area development funds, so that citizens can look up how that money is allocated and used. ⚠\n\nThe repository is organised as separate frontend and backend applications, with a MongoDB database and Docker Compose for local setup.",
      problem: "Empowered Indian's aim is to bring transparency, accountability and public participation into governance in India, and it is gathering public data on local-area development funds to do it. That only works if people can actually find and understand the data, which makes the frontend the part that decides whether the platform is useful to a citizen.",
      contribution: "This was a team project, and my part was the frontend. I built the user-facing interface in TypeScript, HTML and CSS. The repository is a shared codebase with separate frontend and backend sides, so I worked within existing structure and conventions instead of starting from a blank folder.",
      functionality: "The frontend is the part of the platform that citizens see and use. For the specific pages, components and features I built, see the contribution note above.",
      implementation: "- **Frontend:** TypeScript, HTML and CSS. ⚠ framework and libraries\n- **Repository:** A monorepo with `frontend` and `backend` folders. The backend runs on Node.js 18 or later, with MongoDB provided through Docker Compose for local development.\n- **Workflow:** The upstream project asks contributors to open an issue before a pull request, and ships contribution guides for both frontend and backend.",
      decisions: "The platform's direction came from the wider Empowered Indian initiative, so the decisions I can speak to are the ones in the frontend. Working inside an existing codebase, with its folder structure and contribution rules, was the main lesson: it's closer to how a team codebase behaves than any of my solo projects.",
      next: "The upstream project plans to move toward a monorepo of shared packages for features, data access, UI and utilities, and to build development around its dataset of local-area development funds as that data comes together.",
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
      title: "Hospital Management Website",
      badge: "Solo project",
      cardText: "A responsive multi-page website for a hospital, covering services, appointments, doctors and patient information, built with semantic HTML and CSS and focused on clear navigation across devices.",
      tagsRaw: "HTML · CSS",
      tags: ["HTML","CSS"],
      linksRaw: "- Source: github.com/Kartikk-git/Hospital-management\n- Live: kartikk-git.github.io/Hospital-management",
      links: {
        source: "https://github.com/Kartikk-git/Hospital-management",
        live: "https://kartikk-git.github.io/Hospital-management",
      },
      overview: "This is a front-end website for a hospital, built to practise page structure and responsive layout. It has five pages: a home page, an appointment page, a list of approved doctors, an ideas page, and a recent-success page, all styled with CSS to look consistent.",
      problem: "A hospital website has a few practical jobs: show what services exist, show which doctors are approved, and let a patient find the appointment page quickly. I used the project to practise laying that information out so it's easy to scan on a phone as well as a desktop.",
      contribution: "I built the whole site myself: page structure, content layout and styling.",
      implementation: "- **Stack:** HTML and CSS only, with no JavaScript and no backend.\n- **Pages:** `index`, `appointment`, `approved-doctors`, `ideas` and `recent-success`.\n- **Focus:** Responsive layout and straightforward navigation between pages.\n- **Deployment:** GitHub Pages.",
      next: "Because there's no backend, the appointment page is a layout rather than a working booking system. The natural next step would be form validation in JavaScript and a small backend to store requests.",
      gallerySlots: ["p3-shot-1", "p3-shot-2"],
      confirmFlags: {
        badge: true,
        contribution: true,
      }
    },
    {
      id: "p4",
      slug: "portfolio-v1",
      title: "Personal Portfolio (Earlier Version)",
      badge: "Archived",
      cardText: "My first portfolio: a static, responsive page with projects, certificates and contact details, built with HTML, CSS and JavaScript and deployed on GitHub Pages. This site is its successor.",
      tagsRaw: "HTML · CSS · JavaScript",
      tags: ["HTML","CSS","JavaScript"],
      linksRaw: "- Source: github.com/Kartikk-git/my-portfolio\n- Live: kartikk-git.github.io/my-portfolio",
      links: {
        source: "https://github.com/Kartikk-git/my-portfolio",
        live: "https://kartikk-git.github.io/my-portfolio",
      },
      overview: "This was my first deployed website. It presents my projects, certificates, skills and contact details on a single responsive page, with smooth scrolling and a hover interaction on the hero text. It is hosted on GitHub Pages.",
      problem: "I needed one place to point people to for my work, and I wanted to learn the full path from a local folder to a live URL.",
      contribution: "I designed and built it myself.",
      implementation: "- **Stack:** HTML, CSS and JavaScript.\n- **Content:** Projects section, certificates (shown as images), about and contact sections.\n- **Deployment:** GitHub Pages, from the repository's main branch.",
      next: "This version is kept for reference. The portfolio you're looking at now replaces it, with proper case studies, detailed project views and real activity data.",
      gallerySlots: ["p4-shot-1"],
      confirmFlags: {}
    },
    {
      id: "p5",
      slug: "tejovik",
      title: "TEJOVIK",
      badge: "Solo project",
      cardText: "A Flask web platform that analyses student performance and wellness. Students enter study hours, sleep and stress, and get a cognitive score, a burnout gauge, performance charts and a chatbot check-in.",
      tagsRaw: "Python · Flask · JavaScript · Chart.js · HTML · CSS",
      tags: ["Python","Flask","JavaScript","Chart.js","HTML","CSS"],
      linksRaw: "- Source: github.com/Kartikk-git/TEJOVIK\n- Detailed view: opens the project panel",
      links: {
        source: "https://github.com/Kartikk-git/TEJOVIK",
      },
      overview: "TEJOVIK is a web platform for tracking how study habits relate to performance and burnout. It has five sections: Home, Performance, CHETVIK, Mind Boost and Contact. The core of the app is CHETVIK, which takes a student's daily inputs and returns a cognitive score, a burnout gauge and written recommendations, followed by a chat panel for follow-up questions.",
      problem: "Students rarely see how sleep, study load and stress affect their results until they are already exhausted. TEJOVIK puts those inputs next to a performance view, so patterns are visible earlier.",
      contribution: "I developed the application: the Flask backend and chat endpoint, the interface, the Chart.js performance charts, and the CHETVIK input and analysis flow. The repository includes a testing guide that documents how to run the app and check each feature.",
      functionality: "**Performance view.** A line chart of performance data with Weekly, Monthly and All tabs.\n\n**CHETVIK analysis.** The student enters study hours (0 to 24), sleep hours (0 to 24) and a stress level (1 to 10). On confirming, the app shows a cognitive score, a burnout gauge and personalised analysis text.\n\n**CHETVIK chat.** After submitting inputs, the student can chat with the assistant. Replies come from the Flask backend when it is available, and from built-in fallback responses when it isn't, so the chat never just goes silent.\n\n**Home.** A daily thought that fades out and refreshes on request.\n\n**Responsive layout.** The interface adapts to mobile screens.",
      implementation: "- **Backend:** Python with Flask. A `/chat` endpoint receives chat messages by POST, with CORS enabled so the front end can call it from another origin.\n- **Front end:** HTML, CSS and JavaScript. Sections switch client-side without a page reload.\n- **Charts:** Chart.js for the performance view.\n- **Run locally:** Install the requirements, run `app.py`, and open `localhost:5000`.",
      decisions: "**Fallback responses for the chat.** The front end handles a missing or failing backend, so the CHETVIK chat still responds during development and testing.\n\n**Bounded inputs.** Study and sleep hours are limited to 0 to 24 and stress to a 1 to 10 scale, so the analysis only ever receives values that make sense.",
      next: "The sign-out control in the navigation bar is currently a placeholder with no logout logic, so wiring up real accounts and sessions is the obvious next step.",
      gallerySlots: ["p5-shot-1", "p5-shot-2", "p5-shot-3", "p5-demo"],
      confirmFlags: {
        badge: true,
        contribution: true,
      }
    }
  ]
};

export const projects = projectsContent.items;

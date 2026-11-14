# DELIVERABLE A: Final website content

Canonical copy for kartik-koundal's portfolio. Every block has a stable key in backticks so the coding agent can map text to components. Text under a key is final and must be used verbatim.

**Conventions**

- `⚠` after a key means the text depends on something I could not verify. It is written so the site reads correctly now, but the fact is listed in the **Confirmation register** at the end. Do not remove the flag until Kartik confirms.
- `{curly}` tokens are data-bound values (real GitHub and LeetCode data). Never hardcode them.
- Spelling: British-neutral, "résumé" in UI labels, "Resume" in file names.

---

## 0. Global

`site.title` Kartik Koundal | Android and Web Developer

`site.description` Computer Science student at Dronacharya College of Engineering building native Android apps in Kotlin and web applications in Python and JavaScript. Open to software and Android internships.

`nav.items` Projects · About · Skills · Education · Contact

`nav.search.label` Search

`nav.search.placeholder` Search sections, projects and skills

`nav.search.empty` Nothing matches that. Try a project name or a technology.

`nav.search.groups` Sections · Projects · Skills

`nav.resume` Résumé

`nav.theme.toLight` Switch to light theme

`nav.theme.toDark` Switch to dark theme

`nav.menu.open` Open menu

`nav.menu.close` Close menu

`footer.line` © 2026 Kartik Koundal · New Delhi, India

`footer.top` Back to top

`toast.emailCopied` Email address copied

`toast.copyFailed` Couldn't copy. The address is koundal.k29@gmail.com

---

## 1. Hero

`hero.eyebrow` Open to software and Android internships

`hero.name` Kartik Koundal

`hero.headline` I turn ideas into apps, and curiosity into code.

`hero.intro`

I'm Kartik, a third-year Computer Science undergraduate at Dronacharya College of Engineering, Gurugram. I enjoy building things, experimenting with technologies and solving problems through code.

My primary focus is native Android development with Kotlin and Java. I also work with Python, Flask and JavaScript, and enjoy exploring how different parts of software come together to create useful applications.

I'm currently focused on building better projects, sharpening my problem-solving skills and becoming industry-ready. I'm looking for software development and Android internship opportunities where I can learn from experienced developers, contribute to real products and grow as an engineer.

`hero.focus.label` Focus

`hero.focus.items` Kotlin · Jetpack Compose · Python · Flask · TypeScript

`hero.currently.label` Currently building

`hero.currently.value` Student Organizer, an offline-first Android app for courses, assignments and attendance

`hero.cta.primary` View selected work

`hero.cta.secondary` Download résumé

`hero.cta.tertiary` Get in touch

`hero.links` GitHub · LinkedIn · koundal.k29@gmail.com · New Delhi, India

`hero.scrollCue` Scroll to explore

---

## 2. Projects

`projects.eyebrow` 01 · Projects

`projects.heading` Projects

`projects.intro` Five projects across native Android, a hackathon team build and data-driven web apps. Student Organizer is the one I'm putting the most into right now, so it gets the fullest write-up. Each card opens a detailed view.

`projects.counter` 5 projects

`projects.card.cta` View details

`projects.card.source` Source

`projects.card.live` Live site

`projects.detail.labels`

- overview: Overview
- problem: The problem
- contribution: My contribution
- functionality: What it does
- implementation: How it's built
- decisions: Design decisions
- next: What's next
- gallery: Gallery
- stack: Built with
- close: Close project details
- prev: Previous project
- next: Next project

---

### 2.1 Student Organizer

`p1.title` Student Organizer

`p1.badge` Flagship · In progress

`p1.cardText` An offline-first Android app that brings courses, assignments, notes, exams and attendance into one place. Data stays on the device in Room, and the interface combines Jetpack Compose Material 3 with ViewPager2 tab navigation.

`p1.tags` Kotlin · Jetpack Compose · Material 3 · ViewBinding · ViewPager2 · Room · Coroutines · Gradle KTS

`p1.links`

- Source: github.com/Kartikk-git/Student_Organizer
- APK: ⚠ show only once a release build exists
- Detailed view: opens the project panel

`p1.overview`

Student Organizer is an Android app for the academic side of college life: courses, assignments, study notes, exams and attendance, all in one place. Everything is stored on the device, so it behaves the same with or without a connection and doesn't need an account on any server.

The app is written in Kotlin and deliberately mixes two UI approaches. Tabbed navigation uses ViewBinding and ViewPager2. Dialogs, bottom sheets and the attendance calendar are written in Jetpack Compose with Material 3. The project is still in development, and the roadmap further down says where it is heading.

`p1.problem`

College students often keep deadlines, notes and attendance in separate tools: a calendar, a task app, a notes app, a counter, and photos of lecture slides. That scatter causes missed deadlines, and generic calendars don't calculate attendance at all, so it's easy to slip below the minimum a college requires, commonly 75%, without noticing. Notes and assignments also tend to live apart from the course they belong to, which makes revision slower than it needs to be. Many planner apps also depend on a server connection, which is a problem in a library or classroom with poor signal.

`p1.contribution` ⚠

Student Organizer is my own project. I wrote the problem statement, designed the local database schema, and built the screens, navigation and the attendance calendar. It is where I'm practising structuring a larger Android codebase: separate packages for activities, fragments, Compose UI, database and adapters, with a Gradle version catalog keeping dependencies in one place.

`p1.functionality`

**Dashboard.** A summary of pending assignments, overall attendance percentage, upcoming exams and active courses. When a section has no data yet, it shows a prompt to add a course, assignment or note instead of an empty screen.

**Courses.** A directory of courses with code, title, instructor, schedule and room. Courses are created, edited and deleted from Compose bottom sheets. Each course links to its assignments and notes.

**Assignments.** Tasks are tracked by subject, due date, status (Pending, In Progress, Completed) and priority (High, Medium, Low). Each course shows a live progress bar of completed versus total assignments.

**Notes and study materials.** Notes are tied to a course. They can be searched by title or course name, opened in a detail view, edited and deleted. From a course you can jump straight to the notes tagged with its code.

**Calendar and attendance.** A monthly calendar built in Jetpack Compose. Multi-tap gestures on a date toggle it between present and absent, and the overall attendance percentage updates immediately, with a warning when it drops below a threshold such as 75%. The same calendar holds events: exams, quizzes, projects and reminders, with a daily schedule view.

**Onboarding and profile.** A short onboarding carousel for first-time users, local registration and login stored in Room and SharedPreferences, and a profile showing student ID, major, semester, email and academic stats.

`p1.implementation`

- **Language and UI:** Kotlin 2.1.0. Jetpack Compose with Material 3 for dialogs, bottom sheets and the calendar. ViewBinding and ViewPager2 for fragment-based tabs. Material Components for the view layer.
- **Architecture:** MVVM-inspired, with lifecycle-aware coroutines (`lifecycleScope`) for asynchronous work.
- **Persistence:** Room 2.8.5 over SQLite, with KSP for code generation. Five entities: User, Course, Assignment, Notes and AttendanceRecord. The database is named `student_organizer_database`.
- **Build:** Gradle Kotlin DSL with a version catalog (`libs.versions.toml`). Minimum API level 24, target API level 35.
- **Structure:** `activities` (Splash, Onboarding, Login, Register, Main), `fragments` (Home, Course, Notes, Calendar, Assignment, Profile), `compose`, `database`, `adapter`, `model` and `ui/theme`.

`p1.decisions`

**Local-first storage.** Room is the only data store. Notes, attendance and schedule stay on the phone, there is no forced login to a server, and the app is fast without a network. The cost is that there is no sync between devices yet, which is why cloud backup is on the roadmap.

**A hybrid UI on purpose.** I kept ViewPager2 for swipeable tabs and used Compose Material 3 where it fits best: bottom sheets, dialogs and the calendar. This let me use Compose in a project whose navigation was already view-based, without rewriting everything at once.

**Attendance by gesture, not by counter.** Rather than plus and minus buttons, attendance is marked directly on the calendar date it belongs to. The percentage is derived from those records, so it can't drift away from what the calendar shows.

**Courses as the hub.** A course links to its assignments and notes, shows completion progress, and opens its own filtered notes. That keeps study material organised by subject instead of in one long list.

**Status and priority kept separate.** An assignment has both a status and a priority, so "how urgent" and "how far along" are two different things on screen.

`p1.next`

Planned next, in roughly this order:

1. **Notifications and backup.** Firebase Cloud Messaging for deadline and attendance warnings, and cloud sync so data can be restored across devices.
2. **Institution features.** Role-based access for faculty and students, so faculty can publish schedules, coursework and class-wide attendance, with student records imported through CSV, Excel or REST APIs.
3. **Digital documents.** A student ID card with a QR code, a campus transit pass, and fee statements and receipts.

`p1.gallery.slots` See the media register in Deliverable B (slots `p1-shot-1` to `p1-shot-6`, `p1-demo`, `p1-arch`, `p1-erd`).

`p1.gallery.captions`

- Onboarding: the first-run carousel that introduces the app
- Dashboard: pending assignments, attendance, upcoming exams and active courses
- Courses: course list with live assignment progress
- Assignments: tasks with status and priority
- Calendar and attendance: the Compose calendar with tap-to-mark attendance
- Notes: study notes filtered by course
- Demo: a short walkthrough of adding a course, logging attendance and filtering notes
- Architecture: how activities, fragments, Compose UI and Room fit together
- Database: the five Room entities and their relationships

---

### 2.2 MPLAD: Empowered Indian

`p2.title` MPLAD: Empowered Indian

`p2.badge` Team project · Smart India Hackathon

`p2.cardText` The frontend of a civic-tech platform our team built for Smart India Hackathon, aimed at making governance data more transparent and easier for citizens to explore. I was responsible for the frontend, written in TypeScript, HTML and CSS.

`p2.tags` TypeScript · HTML · CSS

`p2.links`

- Source: github.com/Kartikk-git/mplad-test
- Original project: empoweredindian.in
- Detailed view: opens the project panel

`p2.overview`

MPLAD is a civic-tech project built by a team for Smart India Hackathon. It builds on the open-source Empowered Indian initiative, whose goal is to bring transparency, accountability and public participation into governance in India. The platform works with public data on local-area development funds, so that citizens can look up how that money is allocated and used. ⚠

The repository is organised as separate frontend and backend applications, with a MongoDB database and Docker Compose for local setup.

`p2.problem`

Empowered Indian's aim is to bring transparency, accountability and public participation into governance in India, and it is gathering public data on local-area development funds to do it. That only works if people can actually find and understand the data, which makes the frontend the part that decides whether the platform is useful to a citizen.

`p2.contribution` ⚠

This was a team project, and my part was the frontend. I built the user-facing interface in TypeScript, HTML and CSS. The repository is a shared codebase with separate frontend and backend sides, so I worked within existing structure and conventions instead of starting from a blank folder.

`p2.functionality` ⚠

The frontend is the part of the platform that citizens see and use. For the specific pages, components and features I built, see the contribution note above.

`p2.implementation`

- **Frontend:** TypeScript, HTML and CSS. ⚠ framework and libraries
- **Repository:** A monorepo with `frontend` and `backend` folders. The backend runs on Node.js 18 or later, with MongoDB provided through Docker Compose for local development.
- **Workflow:** The upstream project asks contributors to open an issue before a pull request, and ships contribution guides for both frontend and backend.

`p2.decisions`

The platform's direction came from the wider Empowered Indian initiative, so the decisions I can speak to are the ones in the frontend. Working inside an existing codebase, with its folder structure and contribution rules, was the main lesson: it's closer to how a team codebase behaves than any of my solo projects.

`p2.next`

The upstream project plans to move toward a monorepo of shared packages for features, data access, UI and utilities, and to build development around its dataset of local-area development funds as that data comes together.

---

### 2.3 Hospital Management Website

`p3.title` Hospital Management Website

`p3.badge` Solo project

`p3.cardText` A responsive multi-page website for a hospital, covering services, appointments, doctors and patient information, built with semantic HTML and CSS and focused on clear navigation across devices.

`p3.tags` HTML · CSS

`p3.links`

- Source: github.com/Kartikk-git/Hospital-management
- Live: kartikk-git.github.io/Hospital-management

`p3.overview`

This is a front-end website for a hospital, built to practise page structure and responsive layout. It has five pages: a home page, an appointment page, a list of approved doctors, an ideas page, and a recent-success page, all styled with CSS to look consistent.

`p3.problem`

A hospital website has a few practical jobs: show what services exist, show which doctors are approved, and let a patient find the appointment page quickly. I used the project to practise laying that information out so it's easy to scan on a phone as well as a desktop.

`p3.contribution`

I built the whole site myself: page structure, content layout and styling.

`p3.implementation`

- **Stack:** HTML and CSS only, with no JavaScript and no backend.
- **Pages:** `index`, `appointment`, `approved-doctors`, `ideas` and `recent-success`.
- **Focus:** Responsive layout and straightforward navigation between pages.
- **Deployment:** GitHub Pages.

`p3.next`

Because there's no backend, the appointment page is a layout rather than a working booking system. The natural next step would be form validation in JavaScript and a small backend to store requests.

---

### 2.4 Personal Portfolio (Earlier Version)

`p4.title` Personal Portfolio (Earlier Version)

`p4.badge` Archived

`p4.cardText` My first portfolio: a static, responsive page with projects, certificates and contact details, built with HTML, CSS and JavaScript and deployed on GitHub Pages. This site is its successor.

`p4.tags` HTML · CSS · JavaScript

`p4.links`

- Source: github.com/Kartikk-git/my-portfolio
- Live: kartikk-git.github.io/my-portfolio

`p4.overview`

This was my first deployed website. It presents my projects, certificates, skills and contact details on a single responsive page, with smooth scrolling and a hover interaction on the hero text. It is hosted on GitHub Pages.

`p4.problem`

I needed one place to point people to for my work, and I wanted to learn the full path from a local folder to a live URL.

`p4.contribution`

I designed and built it myself.

`p4.implementation`

- **Stack:** HTML, CSS and JavaScript.
- **Content:** Projects section, certificates (shown as images), about and contact sections.
- **Deployment:** GitHub Pages, from the repository's main branch.

`p4.next`

This version is kept for reference. The portfolio you're looking at now replaces it, with proper case studies, detailed project views and real activity data.

---

### 2.5 TEJOVIK

`p5.title` TEJOVIK

`p5.badge` Solo project

`p5.cardText` A Flask web platform that analyses student performance and wellness. Students enter study hours, sleep and stress, and get a cognitive score, a burnout gauge, performance charts and a chatbot check-in.

`p5.tags` Python · Flask · JavaScript · Chart.js · HTML · CSS

`p5.links`

- Source: github.com/Kartikk-git/TEJOVIK
- Detailed view: opens the project panel

`p5.overview`

TEJOVIK is a web platform for tracking how study habits relate to performance and burnout. It has five sections: Home, Performance, CHETVIK, Mind Boost and Contact. The core of the app is CHETVIK, which takes a student's daily inputs and returns a cognitive score, a burnout gauge and written recommendations, followed by a chat panel for follow-up questions.

`p5.problem`

Students rarely see how sleep, study load and stress affect their results until they are already exhausted. TEJOVIK puts those inputs next to a performance view, so patterns are visible earlier.

`p5.contribution`

I developed the application: the Flask backend and chat endpoint, the interface, the Chart.js performance charts, and the CHETVIK input and analysis flow. The repository includes a testing guide that documents how to run the app and check each feature.

`p5.functionality`

**Performance view.** A line chart of performance data with Weekly, Monthly and All tabs.

**CHETVIK analysis.** The student enters study hours (0 to 24), sleep hours (0 to 24) and a stress level (1 to 10). On confirming, the app shows a cognitive score, a burnout gauge and personalised analysis text.

**CHETVIK chat.** After submitting inputs, the student can chat with the assistant. Replies come from the Flask backend when it is available, and from built-in fallback responses when it isn't, so the chat never just goes silent.

**Home.** A daily thought that fades out and refreshes on request.

**Responsive layout.** The interface adapts to mobile screens.

`p5.implementation`

- **Backend:** Python with Flask. A `/chat` endpoint receives chat messages by POST, with CORS enabled so the front end can call it from another origin.
- **Front end:** HTML, CSS and JavaScript. Sections switch client-side without a page reload.
- **Charts:** Chart.js for the performance view.
- **Run locally:** Install the requirements, run `app.py`, and open `localhost:5000`.

`p5.decisions`

**Fallback responses for the chat.** The front end handles a missing or failing backend, so the CHETVIK chat still responds during development and testing.

**Bounded inputs.** Study and sleep hours are limited to 0 to 24 and stress to a 1 to 10 scale, so the analysis only ever receives values that make sense.

`p5.next`

The sign-out control in the navigation bar is currently a placeholder with no logout logic, so wiring up real accounts and sessions is the obvious next step.

---

## 3. About

`about.eyebrow` 02 · About

`about.heading` About Me

`about.subline` Computer Science undergraduate at Dronacharya College of Engineering, Gurugram.

`about.lead`

I'm Kartik, a third-year B.Tech Computer Science student at Dronacharya College of Engineering, Gurugram, graduating in 2028. I'm someone who enjoys figuring out how things work, breaking them, fixing them, and occasionally spending way too much time making them work better.

`about.intro.2`

My journey into development started with HTML, CSS and Python, building small websites and applications. Over time, my curiosity took me towards Android development, where I found myself enjoying the combination of logic, design and problem-solving.

`about.body.1`

I started with the basics of web development, building a hospital website, a personal portfolio and a Flask application. Eventually, I moved towards Android development and started exploring Kotlin, Android Studio and modern app architecture. That's where things got interesting.

`about.body.2`

My main project, Student Organizer, is where I put most of my learning into practice. It's an Android application built with Kotlin, Jetpack Compose and Room, designed to make student life a little more organized. More than just adding features, I've enjoyed learning how to structure an application, manage data and build things that actually work together.

`about.body.3`

I'm not someone who likes sticking to just one technology. Alongside Android development, I'm exploring backend concepts, improving my understanding of software architecture and strengthening my programming fundamentals. I enjoy understanding not just how something works, but why it's built that way.

`about.body.4`

I regularly practice Data Structures and Algorithms on LeetCode and CodeChef, because writing code is one thing, but learning to write better and more efficient code is another. I've also completed NPTEL's Programming in Java course with an Elite certificate and a score of 95%.

`about.body.5`

I'm currently focused on becoming a stronger Android developer, building meaningful projects and preparing myself for real-world software development. I'm also interested in exploring AI/ML and backend technologies as I continue expanding my skill set.

`about.closing`

I believe there's always something new to learn, something better to build and probably another bug hiding somewhere. That's what makes development interesting to me.

`about.facts.label` At a glance

`about.facts`

- Studying: B.Tech Computer Science and Engineering, 2024 to 2028
- College: Dronacharya College of Engineering, Gurugram
- Based in: New Delhi, India
- Main focus: Native Android with Kotlin and Jetpack Compose
- Also build: Web apps with Python, Flask and JavaScript
- Looking for: Software and Android internships

`about.strengths.label` How I work

`about.strengths`

- Problem solving: breaking a problem into data and steps before writing code
- Fundamentals: data structures and algorithms, OOP, databases and SQL
- Quick learner: picked up Kotlin, Compose and Room while building Student Organizer
- Adaptable: comfortable across Android, Python backends and the web

---

## 4. Activity and contributions

`activity.eyebrow` 03 · Commit log

`activity.heading` Activity & Contributions

`activity.intro` A public record of the code I push and the problems I solve. Both charts are generated from my GitHub and LeetCode profiles and cover the past year. They show volume, not quality, so for the work itself, see the projects above.

`activity.tabs` All activity · GitHub ({githubTotal}) · LeetCode ({leetcodeTotal})

`activity.github.title` {n} contributions in the last year

`activity.github.description` Commits, pull requests and issues on public repositories. Only public activity is shown.

`activity.github.source` Kartikk-git on GitHub

`activity.github.footer` Public GitHub contributions · past year

`activity.leetcode.title` {n} submissions across {d} active days

`activity.leetcode.description` Daily LeetCode submissions. I use it to keep data structures and algorithms practice steady alongside project work.

`activity.leetcode.source` kartikk-git on LeetCode

`activity.leetcode.footer` Public LeetCode problem solving · past year

`activity.legend` Less · More

`activity.months` Jan · Feb · Mar · Apr · May · Jun · Jul · Aug · Sep · Oct · Nov · Dec

`activity.days` Mon · Wed · Fri

`activity.tooltip.github` {n} contributions on {weekday}, {date}

`activity.tooltip.github.zero` No contributions on {weekday}, {date}

`activity.tooltip.leetcode` {n} submissions on {weekday}, {date}

`activity.tooltip.leetcode.zero` No submissions on {weekday}, {date}

`activity.summary.srOnly` Activity chart. {n} entries over the last year. The busiest day was {busiestDate} with {busiestCount}.

`activity.loading` Loading activity…

`activity.error` Activity data couldn't be loaded right now. You can view it directly on {source}.

`activity.filterHint` Select a tab to focus on one source.

---

## 5. Technical stack

`skills.eyebrow` 04 · Skills

`skills.heading` Technical Stack

`skills.intro` Languages, frameworks and fundamentals I use across Android, backend and web work. Hover or focus a skill to see where I've used it.

`skills.cat.languages.title` Languages

`skills.cat.languages.description` Kotlin for Android, Python for backend and data-driven web work, and Java and C++ for object-oriented programming and algorithm practice.

`skills.cat.android.title` Android

`skills.cat.android.description` Native Android with Kotlin and Jetpack Compose Material 3, with ViewBinding and ViewPager2 for fragment-based screens, Room for local storage and coroutines for asynchronous work. Built with Gradle Kotlin DSL and version catalogs.

`skills.cat.web.title` Web

`skills.cat.web.description` Responsive front ends in HTML, CSS and JavaScript, TypeScript from the MPLAD frontend, Flask for backend routes, and Chart.js for data visualisation.

`skills.cat.core.title` Core & tools

`skills.cat.core.description` Data structures and algorithms, OOP, databases and SQL, plus Git and GitHub for version control and GitHub Pages deployment.

`skills.tooltips`

- Java: Coursework. NPTEL Programming in Java, Elite certificate, 95%.
- Kotlin: Student Organizer.
- Python: TEJOVIK. CodeChef Python Skill Assessment, 90%.
- C++: Programming fundamentals and data structures and algorithms.
- Jetpack Compose: Student Organizer. Calendar, bottom sheets and dialogs.
- Material 3: Student Organizer. Compose Material 3 components and theming.
- ViewBinding: Student Organizer. Fragment layouts.
- ViewPager2: Student Organizer. Swipeable tab navigation and onboarding.
- Room: Student Organizer. Five entities on SQLite, with KSP.
- Coroutines: Student Organizer. Lifecycle-aware async work.
- Gradle KTS: Student Organizer. Version catalog and Kotlin DSL builds.
- HTML: Hospital Management Website, Portfolio, TEJOVIK. Also CodeChef Learn HTML/CSS.
- CSS: Same projects. Also CodeChef CSS Intermediate.
- JavaScript: Portfolio and TEJOVIK. Section switching, charts and chat.
- TypeScript: MPLAD frontend.
- Flask: TEJOVIK. Chat endpoint and app server.
- Chart.js: TEJOVIK. Performance charts.
- DSA: LeetCode and CodeChef practice.
- OOP: Coursework, and Java and Kotlin projects.
- DBMS: Coursework.
- SQL: Coursework. Room in Student Organizer runs on SQLite.
- Git: Version control on every project, with GitHub Pages deployment for the static sites.
- GitHub: Source for every project on this site.

`skills.next.label` Next up

`skills.next.value` Firebase Cloud Messaging, planned for push notifications in Student Organizer.

---

## 6. Education and certifications

`edu.eyebrow` 05 · Credentials

`edu.heading` Education & Certifications

`edu.intro` Formal education, plus certificates and badges I've earned through NPTEL, CodeChef and Google Cloud. Select a certificate to preview it.

### Certifications

`cred.group.cert` Verified credentials & certifications

`cred.java.title` Programming in Java

`cred.java.badge` Elite

`cred.java.issuer` NPTEL, IIT Kharagpur

`cred.java.meta` Jan to Apr 2026 · Elite certificate · Score 95%

`cred.java.body` An online course on Java programming offered by NPTEL through IIT Kharagpur. I completed it in January to April 2026 and earned an Elite certificate with a final score of 95%.

`cred.java.verify` Verify certificate ⚠ link

`cred.codechef.title` CodeChef Learning Tracks & Assessment

`cred.codechef.meta` CodeChef · Completed

`cred.codechef.body` I completed more than 600 learning exercises, quizzes and practice tasks across CodeChef's programming and web development tracks. Certificates include Git/GitHub, Learn HTML/CSS, CSS Intermediate and Projects using HTML/CSS, and I scored 90% on the CodeChef Python Skill Assessment.

`cred.codechef.items`

- Python Skill Assessment: 90%
- Git/GitHub
- Learn HTML/CSS
- CSS Intermediate
- Projects using HTML/CSS

`cred.codechef.verify` View on CodeChef ⚠ links

`cred.gcloud.title` Google Cloud Skill Badges ⚠

`cred.gcloud.meta` Google Cloud, verified on Credly · Oct to Nov 2024 ⚠

`cred.gcloud.body` ⚠ Hands-on skill badges earned through Google Cloud's lab-based courses. They cover prompt design in Vertex AI, building Gemini applications with Streamlit, and deploying and managing applications on Google App Engine. The full list is on my Credly profile.

`cred.gcloud.verify` View on Credly ⚠ link

`cred.modal.labels` Issuer · Issued · Score · Credential ID · Verify

`cred.modal.placeholder` Certificate image will appear here once uploaded.

`cred.modal.close` Close certificate preview

`cred.modal.prev` Previous certificate

`cred.modal.next` Next certificate

### Education

`edu.group.formal` Formal education

`edu.btech.title` B.Tech, Computer Science & Engineering

`edu.btech.meta` Dronacharya College of Engineering, Gurugram · 2024 to 2028 · CGPA 7.55/10 ⚠ latest semester

`edu.btech.body` A four-year undergraduate degree in Computer Science and Engineering. My coursework and self-study concentrate on data structures and algorithms, object-oriented programming, databases and SQL, alongside the Android and web projects on this site.

`edu.xii.title` Senior Secondary (Class XII)

`edu.xii.meta` St. Martin's Diocesan School · 2024 · 77.4%

`edu.x.title` Secondary (Class X)

`edu.x.meta` St. Martin's Diocesan School · 2022 · 77.2%

---

## 7. Contact

`contact.eyebrow` 06 · Contact

`contact.heading` Get in Touch

`contact.intro` I'm looking for a software or Android internship where I can contribute to a real codebase and learn from code review. If you're hiring, have feedback on one of my projects, or want to talk about Android or Flask, email is the quickest way to reach me.

`contact.primary.label` Primary contact

`contact.primary.email` koundal.k29@gmail.com

`contact.primary.note` Based in New Delhi, India. I usually reply to internship enquiries within a day or two.

`contact.cta.copy` Copy email address

`contact.cta.mail` Open in mail client

`contact.cta.resume` Résumé (PDF)

`contact.mailto.subject` Hello Kartik

`contact.resume.pending` Résumé PDF coming soon

`contact.profiles.label` Location & profiles

`contact.profiles`

- Location: New Delhi, India
- GitHub: Kartikk-git. Source code for every project on this site.
- LinkedIn: kartik-koundal. Professional background.
- Credly: kartik-koundal. Verified Google Cloud badges. ⚠
- LeetCode: kartikk-git. Algorithm practice.

---

## 8. Media placeholder copy

Shown until real assets are supplied. Every placeholder shows its label and a one-line description of what will go there.

`ph.screenshot.title` Screenshot coming soon

`ph.screenshot.body` {label}. Added once the screenshot is ready.

`ph.video.title` Demo recording coming soon

`ph.video.body` A short walkthrough of {project} will appear here.

`ph.diagram.title` Diagram coming soon

`ph.diagram.body` {label} will appear here.

`ph.certificate.title` Certificate image coming soon

`ph.certificate.body` The certificate for {title} will appear here.

`ph.resume.title` Résumé PDF coming soon

`ph.alt` Placeholder for {label}

---

## 9. UI strings

`ui.lightbox.close` Close image viewer

`ui.lightbox.prev` Previous image

`ui.lightbox.next` Next image

`ui.lightbox.counter` Image {i} of {n}

`ui.modal.close` Close

`ui.link.external` Opens in a new tab

`ui.skip` Skip to main content

`ui.reducedMotion.note` Animations reduced to respect your device setting.

---

## Confirmation register

Resolve these before launch. Until then the site reads correctly but must not publish claims the user hasn't confirmed.

| Key | What to confirm |
|---|---|
| `p1.links` (APK) | Whether a signed APK or release exists. Hide the APK link until it does. |
| `p1.contribution` | That Student Organizer is entirely your own work. |
| `p2.overview` | That MPLAD data refers to Members of Parliament Local Area Development Scheme funds. This was inferred from the repo name and the upstream README. |
| `p2.contribution` / `p2.functionality` / `p2.implementation` | The specific pages, components and features you built, and which frontend framework the team used. Add one or two concrete sentences. |
| `cred.java.verify` | The NPTEL certificate verification URL. |
| `cred.codechef.verify` | The CodeChef certificate URLs for each of the four tracks and the Python assessment. |
| `cred.gcloud.*` | The Credly badge count (earlier draft said 15), exact badge titles, issue dates (Oct to Nov 2024) and the public Credly URL. LinkedIn and Credly blocked my access, so none of this has been verified. |
| `edu.btech.meta` | Whether CGPA 7.55/10 is still your current CGPA. |
| `about.body.1` / `about.body.2` / `about.strengths` | The story of how you started (web first, then Python, then Android) and that Kotlin, Compose and Room were learned through Student Organizer. I inferred this from your repo history and CodeChef tracks. Edit it if your path was different. |
| `p3.badge` / `p3.contribution` / `p5.badge` | That Hospital Management and TEJOVIK were solo projects. Your résumé says "developed" and the repos are under your account, but no teammates are mentioned anywhere. |
| `p5.contribution` | Wording follows your résumé ("developed"). If AI tools wrote a large part of the code, decide whether you want a line saying so, and be ready to explain the code in an interview. |
| `activity.*` numbers | Never hardcode. They must come from real GitHub and LeetCode data. |

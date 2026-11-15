import { siteContent } from "./site";
import { credentialsContent } from "./credentials";
import githubContributions from "./github-contributions.json";
import { projectsContent } from "./projects";
import { contactContent } from "./contact";

export interface PhoneCourse {
  name: string;
  time: string;
  room: string;
}

// Extract dynamic metrics so they never drift from the canonical source
const cgpaMatch = credentialsContent.education[0]?.meta?.match(/CGPA\s*([0-9.]+)/);
const dynamicCgpa = cgpaMatch ? `${cgpaMatch[1]} / 10` : "7.55 / 10";
const dynamicProjectsCount = `${projectsContent.items.length} completed`;
const dynamicContributions = `${githubContributions.total.lastYear} GitHub`;
const dynamicEmail = contactContent.primary.email;
const dynamicName = siteContent.hero.name;

export const phoneContent = {
  // Common / Shell
  statusTime: "09:41",
  launcherAria: "Open mobile app preview",
  closeAria: "Close mobile app preview",
  dialogTitle: "Student Organizer Mobile Preview",
  frameAria: "Android device mockup",

  // 1. Projects Screen (#projects)
  appTitle: "Student Organizer",
  todayHeading: "Today",
  courses: [
    {
      name: "Data Structures & Algorithms",
      time: "09:00 - 10:30 AM",
      room: "Lab 3, CS Block",
    },
    {
      name: "Operating Systems",
      time: "11:00 AM - 12:30 PM",
      room: "Hall B, Room 204",
    },
    {
      name: "Database Management Systems",
      time: "02:00 - 03:30 PM",
      room: "Room 108",
    },
  ] as PhoneCourse[],
  attendanceLabel: "Attendance",
  attendanceValue: "85%",
  attendanceSubtext: "Semester Target: 75%",

  // 2. About Screen (#about)
  aboutName: dynamicName,
  aboutDegree: "B.Tech CSE, 3rd year",
  aboutCgpaLabel: "CGPA",
  aboutCgpaValue: dynamicCgpa,
  aboutProjectsLabel: "Projects",
  aboutProjectsValue: dynamicProjectsCount,
  aboutCommitsLabel: "Contributions",
  aboutCommitsValue: dynamicContributions,

  // 3. Commit Log Screen (#activity)
  activityTitle: "Commit Activity",
  activityCount: `${githubContributions.total.lastYear} contributions`,
  activitySub: "315 contributions",
  activityLegendLess: "Less",
  activityLegendMore: "More",

  // 4. Skills Screen (#skills)
  skillsTitle: "Gradle Build",
  buildTasks: [
    "> Task :app:preBuild UP-TO-DATE",
    "> Task :app:compileKotlin",
    "> Task :app:mergeDebugResources",
    "> Task :app:kspDebugKotlin",
    "> Task :app:assembleDebug",
  ],
  buildSuccess: "BUILD SUCCESSFUL",

  // 5. Experience Screen (#experience)
  experienceTitle: "Internship Timeline",
  experienceMonth: "June - July 2026",
  experienceCompany: "S O Infotech (P) Ltd.",
  experienceRole: "Industrial Trainee · Android",
  experienceDates: "8 June to 20 July",

  // 6. Credentials Screen (#education)
  credentialsTitle: "Certifications",
  cert1Title: "Programming in Java",
  cert1Meta: "NPTEL, IIT Kharagpur · 95%",
  cert2Title: "Python Assessment",
  cert2Meta: "CodeChef Tracks · 90%",
  cert3Title: "Google Cloud Badges",
  cert3Meta: "Credly · 15 Badges",

  // 7. Contact Screen (#contact)
  contactNotificationTitle: "Internship Opportunity",
  contactNotificationText: "New message: internship opportunity",
  contactActionText: "Tap to reply via email",
  contactEmail: dynamicEmail,

  // 8. Bot Companion & Launcher
  botInviteBubble: "Click me!",
  botOpenAria: "Open app preview",
  botCloseAria: "Close app preview",
};

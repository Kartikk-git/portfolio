// Verbatim skills content from content/website-content.md
export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export const skillsContent = {
  eyebrow: "04 · Skills",
  heading: "Technical Stack",
  intro: "Languages, frameworks and fundamentals I use across Android, backend and web work. Hover or focus a skill to see where I've used it.",
  categories: [
    {
      id: 'languages',
      title: "Languages",
      description: "Kotlin for Android, Python for backend and data-driven web work, and Java and C++ for object-oriented programming and algorithm practice.",
      skills: ['Java', 'Kotlin', 'Python', 'C++']
    },
    {
      id: 'android',
      title: "Android",
      description: "Native Android with Kotlin and Jetpack Compose Material 3, with ViewBinding and ViewPager2 for fragment-based screens, Room for local storage and coroutines for asynchronous work. Built with Gradle Kotlin DSL and version catalogs.",
      skills: ['Jetpack Compose', 'Material 3', 'ViewBinding', 'ViewPager2', 'Room', 'Coroutines', 'Gradle KTS']
    },
    {
      id: 'web',
      title: "Web",
      description: "Responsive front ends in HTML, CSS and JavaScript, TypeScript from the MPLAD frontend, Flask for backend routes, and Chart.js for data visualisation.",
      skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Flask', 'Chart.js']
    },
    {
      id: 'core',
      title: "Core & tools",
      description: "Data structures and algorithms, OOP, databases and SQL, plus Git and GitHub for version control and GitHub Pages deployment.",
      skills: ['DSA', 'OOP', 'DBMS', 'SQL', 'Git', 'GitHub']
    }
  ],
  tooltipsRaw: "- Java: Coursework. NPTEL Programming in Java, Elite certificate, 95%.\n- Kotlin: Student Organizer.\n- Python: TEJOVIK. CodeChef Python Skill Assessment, 90%.\n- C++: Programming fundamentals and data structures and algorithms.\n- Jetpack Compose: Student Organizer. Calendar, bottom sheets and dialogs.\n- Material 3: Student Organizer. Compose Material 3 components and theming.\n- ViewBinding: Student Organizer. Fragment layouts.\n- ViewPager2: Student Organizer. Swipeable tab navigation and onboarding.\n- Room: Student Organizer. Five entities on SQLite, with KSP.\n- Coroutines: Student Organizer. Lifecycle-aware async work.\n- Gradle KTS: Student Organizer. Version catalog and Kotlin DSL builds.\n- HTML: Hospital Management Website, Portfolio, TEJOVIK. Also CodeChef Learn HTML/CSS.\n- CSS: Same projects. Also CodeChef CSS Intermediate.\n- JavaScript: Portfolio and TEJOVIK. Section switching, charts and chat.\n- TypeScript: MPLAD frontend.\n- Flask: TEJOVIK. Chat endpoint and app server.\n- Chart.js: TEJOVIK. Performance charts.\n- DSA: LeetCode and CodeChef practice.\n- OOP: Coursework, and Java and Kotlin projects.\n- DBMS: Coursework.\n- SQL: Coursework. Room in Student Organizer runs on SQLite.\n- Git: Version control on every project, with GitHub Pages deployment for the static sites.\n- GitHub: Source for every project on this site.",
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
    label: "Next up",
    value: "Firebase Cloud Messaging, planned for push notifications in Student Organizer.",
  }
};

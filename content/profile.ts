export interface SocialLink {
  label: string;
  url: string;
}

export interface SkillCategory {
  category: string;
  items: readonly string[];
}

export interface Profile {
  name: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  statusLine: string;
  credlyUrl: string;
  leetcodeUrl: string;
  positioning: string;
  about: readonly string[];
  skills: readonly SkillCategory[];
}

export const profile: Profile = {
  name: "Kartik Koundal",
  location: "New Delhi, India",
  email: "koundal.k29@gmail.com",
  githubUrl: "https://github.com/Kartikk-git",
  linkedinUrl: "https://www.linkedin.com/in/kartik-koundal-a41574323/",
  statusLine: "Open to software and Android internships",
  credlyUrl: "https://www.credly.com/users/kartik-koundal",
  leetcodeUrl: "https://leetcode.com/u/kartikk-git/",
  positioning:
    "Computer Science student building web applications in Python and JavaScript and Android apps in Kotlin.",
  about: [
    "I am a Computer Science undergraduate at Dronacharya College of Engineering, focused on software engineering and native Android development.",
    "My work spans web backends and data visualizations with Python and Flask, alongside modern Android applications built with Kotlin, Jetpack Compose, and Room.",
    "I aim to write maintainable code, grounded in strong computer science fundamentals and disciplined software architecture.",
  ],
  skills: [
    {
      category: "Languages",
      items: ["Java", "Kotlin", "Python", "C++"],
    },
    {
      category: "Web",
      items: ["HTML", "CSS", "JavaScript"],
    },
    {
      category: "Core",
      items: ["Data Structures & Algorithms", "OOP", "DBMS", "SQL"],
    },
    {
      category: "Tools",
      items: ["Git", "GitHub"],
    },
    {
      category: "Frameworks & Libraries",
      items: ["Flask", "Chart.js", "Jetpack Compose", "Room"],
    },
  ],
} as const;


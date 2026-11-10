export interface CertificationEntry {
  title: string;
  issuer: string;
  periodOrDate: string;
  highlight?: string;
  note?: string;
  link?: string;
  isLead?: boolean;
}

export const certifications: readonly CertificationEntry[] = [
  {
    title: "Programming in Java",
    issuer: "NPTEL (IIT Kharagpur)",
    periodOrDate: "Jan – Apr 2026",
    highlight: "Elite Certificate, score 95%",
    isLead: true,
  },
  {
    title: "CodeChef Learning Tracks & Assessment",
    issuer: "CodeChef",
    periodOrDate: "Completed",
    highlight: "Python Skill Assessment: 90%",
    note: "Git/GitHub, Learn HTML/CSS, CSS Intermediate, Projects using HTML/CSS. 600+ exercises, quizzes and practice tasks completed.",
  },
  {
    title: "Google Cloud Skill Badges",
    issuer: "Google Cloud (verified on Credly)",
    periodOrDate: "Oct – Nov 2024",
    highlight: "15 badges verified on Credly",
    note: "Including Prompt Design in Vertex AI, Develop GenAI Apps with Gemini and Streamlit, and Deploy and Manage Applications on Google App Engine.",
    link: "https://www.credly.com/users/kartik-koundal",
  },
] as const;


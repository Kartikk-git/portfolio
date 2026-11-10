export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  grade: string;
}

export const education: readonly EducationEntry[] = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    institution: "Dronacharya College of Engineering",
    period: "2024 – 2028",
    grade: "CGPA 7.55/10",
  },
  {
    degree: "Senior Secondary (XII)",
    institution: "St. Martin's Diocesan School",
    period: "2024",
    grade: "77.4%",
  },
  {
    degree: "Secondary (X)",
    institution: "St. Martin's Diocesan School",
    period: "2022",
    grade: "77.2%",
  },
] as const;


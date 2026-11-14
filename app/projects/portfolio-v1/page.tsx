import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudyTemplate } from "@/app/components/CaseStudyTemplate";

export const metadata: Metadata = {
  title: "Personal Portfolio (Earlier Version) Case Study — Kartik Koundal",
  description:
    "First static personal portfolio built with semantic HTML, modular CSS, and vanilla JavaScript deployed on GitHub Pages.",
  alternates: {
    canonical: "/projects/portfolio-v1",
  },
};

export default function PortfolioV1Page() {
  const project = projects.find((p: any) => p.slug === "portfolio-v1");
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      prevProject={{
        title: "Hospital Management",
        href: "/projects/hospital-management",
      }}
      nextProject={{
        title: "Student Organizer",
        href: "/projects/student-organizer",
      }}
    />
  );
}

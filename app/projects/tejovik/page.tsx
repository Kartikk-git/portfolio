import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudyTemplate } from "@/app/components/CaseStudyTemplate";

export const metadata: Metadata = {
  title: "TEJOVIK Case Study — Kartik Koundal",
  description:
    "Student Performance & Wellness Analysis Platform built with Python, Flask, JavaScript, and Chart.js.",
};

export default function TejovikPage() {
  const project = projects.find((p) => p.slug === "tejovik");
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      nextProject={{
        title: "Student Organizer",
        href: "/projects/student-organizer",
      }}
    />
  );
}


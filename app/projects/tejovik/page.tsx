import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudyTemplate } from "@/app/components/CaseStudyTemplate";

export const metadata: Metadata = {
  title: "TEJOVIK Case Study — Kartik Koundal",
  description:
    "Student Performance & Wellness Analysis Platform built with Python, Flask, JavaScript, and Chart.js.",
  alternates: {
    canonical: "/projects/tejovik",
  },
};

export default function TejovikPage() {
  const project = projects.find((p: any) => p.slug === "tejovik");
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      prevProject={{
        title: "MPLAD: Empowered Indian",
        href: "/projects/mplad",
      }}
      nextProject={{
        title: "Hospital Management",
        href: "/projects/hospital-management",
      }}
    />
  );
}


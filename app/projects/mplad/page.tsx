import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudyTemplate } from "@/app/components/CaseStudyTemplate";

export const metadata: Metadata = {
  title: "MPLAD Case Study — Kartik Koundal",
  description:
    "Civic-Tech Public Expenditure Monitoring & Decision-Support Platform built for Smart India Hackathon.",
  alternates: {
    canonical: "/projects/mplad",
  },
};

export default function MpladPage() {
  const project = projects.find((p: any) => p.slug === "mplad");
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      prevProject={{
        title: "Student Organizer",
        href: "/projects/student-organizer",
      }}
      nextProject={{
        title: "TEJOVIK",
        href: "/projects/tejovik",
      }}
    />
  );
}

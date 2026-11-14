import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudyTemplate } from "@/app/components/CaseStudyTemplate";

export const metadata: Metadata = {
  title: "Hospital Management Case Study — Kartik Koundal",
  description:
    "Accessible multi-page healthcare website with appointment scheduling and doctor directories built with semantic HTML5 and CSS3.",
  alternates: {
    canonical: "/projects/hospital-management",
  },
};

export default function HospitalManagementPage() {
  const project = projects.find((p: any) => p.slug === "hospital-management");
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      prevProject={{
        title: "TEJOVIK",
        href: "/projects/tejovik",
      }}
      nextProject={{
        title: "Personal Portfolio (Earlier Version)",
        href: "/projects/portfolio-v1",
      }}
    />
  );
}

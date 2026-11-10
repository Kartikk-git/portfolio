import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { CaseStudyTemplate } from "@/app/components/CaseStudyTemplate";

export const metadata: Metadata = {
  title: "Student Organizer Case Study — Kartik Koundal",
  description:
    "Native Android Academic Management Application built with Kotlin, Jetpack Compose Material 3, ViewPager2, and Room database.",
};

const ROOM_ENTITIES = [
  "User",
  "Course",
  "Assignment",
  "Notes",
  "AttendanceRecord",
] as const;

export default function StudentOrganizerPage() {
  const project = projects.find((p: any) => p.slug === "student-organizer");
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      nextProject={{
        title: "TEJOVIK",
        href: "/projects/tejovik",
      }}
      roomEntities={ROOM_ENTITIES}
    />
  );
}


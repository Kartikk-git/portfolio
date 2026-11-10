import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styleguide — Kartik Koundal Portfolio",
  description: "Internal design system and styleguide verification route.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion System — Kartik Koundal Styleguide",
  description: "Internal verification and demonstration of motion tokens and variants.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


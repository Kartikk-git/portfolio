import type { Metadata } from "next";
import { sourceSerif4, ibmPlexSans, ibmPlexMono } from "./fonts";
import { MotionProvider } from "./components/MotionProvider";
import { siteContent } from "@/content/site";
import { contactContent } from "@/content/contact";
import "./globals.css";

export const metadata: Metadata = {
  title: siteContent.title,
  description: siteContent.description,
  metadataBase: new URL("https://kartikk-git.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteContent.title,
    description: siteContent.description,
    url: "https://kartikk-git.github.io",
    siteName: siteContent.title,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteContent.title,
    description: siteContent.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteContent.hero.name,
  url: "https://kartikk-git.github.io",
  email: contactContent.primary.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Dronacharya College of Engineering",
  },
  sameAs: [
    "https://github.com/Kartikk-git",
    "https://www.linkedin.com/in/kartik-koundal-a41574323/",
    "https://www.credly.com/users/kartik-koundal",
    "https://leetcode.com/u/kartikk-git/",
  ],
  jobTitle: "Android and Web Developer",
  description: siteContent.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSerif4.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="font-sans antialiased bg-[var(--paper)] text-[var(--ink)] min-h-screen">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { sourceSerif4, ibmPlexSans, ibmPlexMono } from "./fonts";
import { MotionProvider } from "./components/MotionProvider";
import { AndroidEraEasterEgg } from "./components/AndroidEraEasterEgg";
import { EasterEggsManager } from "./components/EasterEggsManager";
import { ToastManager } from "./components/ToastManager";
import { ResumeModal } from "./components/ResumeModal";
import { siteContent } from "@/content/site";
import { contactContent } from "@/content/contact";
import { fontPreloads } from "./fonts";
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
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteContent.hero.name} · Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.title,
    description: siteContent.description,
    images: ["/og-image.png"],
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
      data-theme="dark"
      suppressHydrationWarning
      className={`${sourceSerif4.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/*
          next/font preload links are dropped under output: "export"; these
          restore them (see fontPreloads in app/fonts.ts and
          scripts/check-fonts.mjs, which verifies this list after each build).
        */}
        {fontPreloads.map((href) => (
          <link
            key={href}
            rel="preload"
            as="font"
            type="font/woff2"
            href={href}
            crossOrigin="anonymous"
          />
        ))}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}else{document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        {/* Hero intro plays only on a true first visit; returning visits skip it before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('hero-seen')){document.documentElement.setAttribute('data-hero-seen','true');}else{sessionStorage.setItem('hero-seen','true');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="font-sans antialiased bg-[var(--paper)] text-[var(--ink)] min-h-screen">
        <MotionProvider>
          {children}
          <AndroidEraEasterEgg />
          <EasterEggsManager />
          <ToastManager />
          <ResumeModal />
        </MotionProvider>
      </body>
    </html>
  );
}

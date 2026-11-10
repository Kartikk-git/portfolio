import type { Metadata } from "next";
import { sourceSerif4, ibmPlexSans, ibmPlexMono } from "./fonts";
import { MotionProvider } from "./components/MotionProvider";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} — Computer Science Student & Developer`,
  description: profile.positioning,
  metadataBase: new URL("https://kartikk-git.github.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${profile.name} — Computer Science Student & Developer`,
    description: profile.positioning,
    url: "https://kartikk-git.github.io",
    siteName: `${profile.name} Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${profile.name} — Computer Science Student & Developer`,
    description: profile.positioning,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: "https://kartikk-git.github.io",
  email: profile.email,
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
    profile.githubUrl,
    profile.linkedinUrl,
    profile.credlyUrl,
    profile.leetcodeUrl,
  ],
  jobTitle: "Computer Science Student & Software Engineer",
  description: profile.positioning,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif4.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (sessionStorage.getItem('hero-seen')) {
                    document.documentElement.setAttribute('data-hero-seen', 'true');
                  }
                  var params = new URLSearchParams(window.location.search);
                  var qTheme = params.get('theme');
                  var sTheme = localStorage.getItem('theme');
                  if (qTheme === 'dark' || qTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', qTheme);
                  } else if (sTheme === 'dark' || sTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', sTheme);
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

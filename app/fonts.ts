import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Manual preloads for the latin-slice woff2 files.
 *
 * next/font marks these files for preload (the "-s.p.woff2" suffix in their
 * content hashes) but the preload <link> tags are not emitted when
 * output: "export" is enabled, so the browser only discovers the fonts after
 * parsing the font stylesheet. On a throttled mobile connection that late
 * discovery costs an extra round trip per font and pushed the hero LCP past
 * 3s. These links restore the intended preload behaviour.
 *
 * The hashes are content-addressed and change only if the font sources
 * change. scripts/check-fonts.mjs runs after every build and fails loudly if
 * a preloaded path no longer exists or a new "-s.p.woff2" file appears, so
 * this list can never drift silently. To regenerate: run a build, find the
 * "*.woff2" URLs marked "-s.p." in out/_next/static/css/*.css, replace the
 * entries below, rebuild.
 */
export const fontPreloads = [
  "/_next/static/media/597b6a5d799c44de-s.p.woff2", // Source Serif 4, latin
  "/_next/static/media/26d4368bf94c0ec4-s.p.woff2", // IBM Plex Sans, latin
  "/_next/static/media/cdec7fa3927eb560-s.p.woff2", // IBM Plex Mono 400, latin
  "/_next/static/media/af5dd2b5d3f396f3-s.p.woff2", // IBM Plex Mono 500, latin
] as const;


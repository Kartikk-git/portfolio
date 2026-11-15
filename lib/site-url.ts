/**
 * Canonical production site URL.
 * Reads from NEXT_PUBLIC_SITE_URL environment variable with fallback to Cloudflare Pages domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartik-koundal.pages.dev";


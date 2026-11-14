#!/usr/bin/env node
/**
 * Post-build guard for the manual font preloads.
 *
 * next/font marks the latin woff2 slices for preload ("*.woff2" paths ending
 * in "-s.p.woff2" in the generated CSS) but does not emit the preload <link>
 * tags when output: "export" is enabled. app/fonts.ts therefore lists the
 * four hashed font files in `fontPreloads`, and app/layout.tsx renders them.
 *
 * This script runs after `next build` and fails the build if:
 *   1. a preloaded path no longer exists in out/ (font hashes drifted), or
 *   2. a "-s.p.woff2" file referenced by the font CSS is missing from the
 *      list (a new or changed latin slice needs to be added).
 *
 * Run it with: node scripts/check-fonts.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const indexHtmlPath = join(outDir, "index.html");

if (!existsSync(indexHtmlPath)) {
  console.error("check-fonts: out/index.html not found. Run `npm run build` first.");
  process.exit(1);
}

// 1. Collect the preload links actually rendered into the exported HTML.
const indexHtml = readFileSync(indexHtmlPath, "utf8");
const preloaded = new Set();
const preloadPattern =
  /<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g;
for (const tag of indexHtml.match(preloadPattern) ?? []) {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (href) preloaded.add(href);
}

// 2. Collect every "-s.p.woff2" file the font CSS marks as a preload candidate.
const cssDir = join(outDir, "_next", "static", "css");
const cssFiles = existsSync(cssDir) ? readdirSync(cssDir).filter((f) => f.endsWith(".css")) : [];
const marked = new Set();
for (const file of cssFiles) {
  const css = readFileSync(join(cssDir, file), "utf8");
  for (const match of css.matchAll(/([\w/.-]*-s\.p\.woff2)/g)) {
    let href = match[1];
    if (!href.startsWith("/")) href = `/${href}`;
    marked.add(href);
  }
}

let failed = false;

// 3. Every preloaded path must exist in the export.
for (const href of preloaded) {
  if (!existsSync(join(outDir, href.replace(/^\//, "")))) {
    console.error(
      `check-fonts: preloaded font "${href}" does not exist in out/. ` +
        "The next/font content hashes changed. Update `fontPreloads` in app/fonts.ts and rebuild.",
    );
    failed = true;
  }
}

// 4. Every next/font-marked preload candidate must be preloaded.
for (const href of marked) {
  if (!preloaded.has(href)) {
    console.error(
      `check-fonts: font "${href}" is marked for preload by next/font but is missing ` +
        "from `fontPreloads` in app/fonts.ts. Add it there and rebuild.",
    );
    failed = true;
  }
}

// 5. Warn about preloads next/font no longer marks (stale entries).
for (const href of preloaded) {
  if (!marked.has(href)) {
    console.warn(`check-fonts: warning: preloaded font "${href}" is no longer marked as a preload candidate.`);
  }
}

if (failed) {
  console.error(
    "check-fonts: font preload list is out of date. See the comment above `fontPreloads` in app/fonts.ts.",
  );
  process.exit(1);
}

console.log(`check-fonts: ${preloaded.size} font preload(s) verified against ${cssFiles.length} CSS file(s).`);

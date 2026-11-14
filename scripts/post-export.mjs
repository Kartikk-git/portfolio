import fs from "fs";
import path from "path";

// Ensure static routes have both route.html and route/index.html so all static servers and hosts resolve cleanly
const routes = [
  "projects/student-organizer",
  "projects/mplad",
  "projects/tejovik",
  "projects/hospital-management",
  "projects/portfolio-v1",
  "styleguide",
  "styleguide/motion",
];

for (const r of routes) {
  const htmlFile = path.join("out", `${r}.html`);
  const dir = path.join("out", r);
  const indexFile = path.join(dir, "index.html");

  if (fs.existsSync(htmlFile)) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(htmlFile, indexFile);
    console.log(`[post-export] Synced ${htmlFile} -> ${indexFile}`);
  }
}

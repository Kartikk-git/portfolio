import fs from 'fs';

console.log('Running content verification against content/website-content.md...\n');

const markdown = fs.readFileSync('content/website-content.md', 'utf8');
const lines = markdown.split('\n');

const markdownEntries = new Map();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^`([a-zA-Z0-9_.]+)`(\s*⚠)?(?:\s+(.*))?$/);
  if (m) {
    const key = m[1];
    let val = m[3] ? m[3].trim() : '';
    if (!val) {
      const blockLines = [];
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j].match(/^`[a-zA-Z0-9_.]+`/) || lines[j].startsWith('---') || lines[j].match(/^#{1,3}\s/)) {
          break;
        }
        blockLines.push(lines[j]);
        j++;
      }
      val = blockLines.join('\n').trim();
    }
    markdownEntries.set(key, val);
  }
}

console.log(`Parsed ${markdownEntries.size} canonical keys from content/website-content.md.`);

const contentFiles = [
  'content/site.ts',
  'content/about.ts',
  'content/activity.ts',
  'content/skills.ts',
  'content/credentials.ts',
  'content/contact.ts',
  'content/projects.ts',
  'content/media.ts',
  'content/media.json'
];

let allContentCombined = '';
for (const file of contentFiles) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR: Required content file missing: ${file}`);
    process.exit(1);
  }
  allContentCombined += '\n' + fs.readFileSync(file, 'utf8');
}

let errors = 0;
let checked = 0;

// Keys retired from the rendered site by owner decision (2026-11-13):
// visitor-visible placeholders are forbidden by the brief, so media slots
// without an asset are omitted from the page instead of showing "coming soon"
// copy. Their canonical strings stay in website-content.md for reference.
const RETIRED_KEY_PREFIXES = ["ph."];

for (const [key, expectedVal] of markdownEntries) {
  if (RETIRED_KEY_PREFIXES.some((p) => key.startsWith(p))) continue;
  if (!expectedVal) continue;
  checked++;
  
  // Normalize whitespace for comparison
  const linesToCheck = expectedVal.split('\n').map(l => l.trim()).filter(l => l.length > 3);
  let missingLine = null;
  for (const l of linesToCheck) {
    const target = l.replace(/^[-*]\s*/, '').trim();
    const jsonTarget = JSON.stringify(target).slice(1, -1);
    if (!allContentCombined.includes(target) && !allContentCombined.includes(jsonTarget)) {
      missingLine = target;
      break;
    }
  }

  if (missingLine) {
    console.error(`[FAIL] Key "${key}" text not found in content layer! Missing snippet:\n  "${missingLine.slice(0, 80)}..."`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nFAILED: ${errors} content verification errors found out of ${checked} keys checked.`);
  process.exit(1);
} else {
  console.log(`\nPASSED: All ${checked} content keys verified verbatim in content layer.`);
}

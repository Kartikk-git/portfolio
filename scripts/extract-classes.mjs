import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== 'node_modules' && f.name !== '.next' && f.name !== 'out' && f.name !== '.git' && f.name !== 'shots') {
        files = files.concat(getFiles(p));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(f.name)) {
      files.push(p);
    }
  }
  return files;
}

const allFiles = getFiles('app').concat(getFiles('content')).concat(getFiles('lib'));
const classes = new Set();

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // 1. Match className="..." or className='...'
  const classMatches = content.matchAll(/className\s*=\s*["']([^"']+)["']/g);
  for (const m of classMatches) {
    for (const c of m[1].split(/\s+/)) {
      if (c && !c.includes('${') && !c.includes('`')) classes.add(c);
    }
  }

  // 2. Match className={`...`} backtick template literals
  const templateMatches = content.matchAll(/className\s*=\s*\{`([^`]+)`\}/g);
  for (const m of templateMatches) {
    for (const c of m[1].split(/\s+/)) {
      if (c && !c.includes('${') && !c.includes('`')) classes.add(c);
    }
  }

  // 3. Match conditional string literals like 'text-[var(--accent)] font-semibold'
  const stringLiterals = content.matchAll(/'([^'\n]+)'|"([^"\n]+)"/g);
  for (const m of stringLiterals) {
    const str = m[1] || m[2];
    if (str && (str.includes(' ') || str.startsWith('bg-') || str.startsWith('text-') || str.startsWith('border-') || str.startsWith('px-') || str.startsWith('py-') || str.startsWith('flex') || str.startsWith('grid') || str.startsWith('max-w-'))) {
      for (const c of str.split(/\s+/)) {
        if (/^[a-z0-9\-:\[\]\/#.%]+$/i.test(c)) {
          classes.add(c);
        }
      }
    }
  }
}

// Clean up classes
const validClasses = Array.from(classes)
  .map(c => c.trim())
  .filter(c => c.length > 0 && !c.includes('(') && !c.includes(')') && !c.includes('"') && !c.includes("'"));

console.log(`Extracted ${validClasses.length} distinct Tailwind utility classes.`);

const inlineStr = validClasses.join(' ');

let globalsCss = fs.readFileSync('app/globals.css', 'utf8');

// Replace the @source line
const sourceRegex = /@source inline\([^)]*\);/;
if (sourceRegex.test(globalsCss)) {
  globalsCss = globalsCss.replace(sourceRegex, `@source inline("${inlineStr}");`);
} else {
  globalsCss = globalsCss.replace('@import "tailwindcss";', `@import "tailwindcss";\n@source inline("${inlineStr}");`);
}

fs.writeFileSync('app/globals.css', globalsCss);
console.log('Successfully injected inline safelist into app/globals.css!');


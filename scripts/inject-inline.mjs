import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== 'node_modules' && f.name !== '.next' && f.name !== 'out' && f.name !== '.git') {
        files = files.concat(getFiles(p));
      }
    } else if (/\.(tsx|ts|js|jsx)$/.test(f.name)) {
      files.push(p);
    }
  }
  return files;
}

const files = getFiles('app').concat(getFiles('content')).concat(getFiles('lib'));
const words = new Set();
// Extract class-like tokens
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  // Match className strings and standalone tokens
  const matches = text.match(/[a-zA-Z0-9_\-\:\[\]\#\.\%]+/g) || [];
  for (const m of matches) {
    if (m.length > 1 && !m.startsWith('//') && !m.startsWith('/*')) {
      words.add(m);
    }
  }
}

const candidateList = Array.from(words);
console.log(`Found ${candidateList.length} candidate tokens across project.`);

// Write an inline safelist CSS that globals.css can import, or append to globals.css
const candidateChunk = candidateList.join(' ');

let globalsCss = fs.readFileSync('app/globals.css', 'utf8');

// Replace any existing @source inline or insert after @import "tailwindcss";
const regex = /@import\s+"tailwindcss"(?:\s+source\([^)]+\))?;(?:\s*@source[^;]+;)*\s*/;
const replacement = `@import "tailwindcss";\n@source inline("${candidateChunk.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}");\n\n`;

globalsCss = globalsCss.replace(regex, replacement);
fs.writeFileSync('app/globals.css', globalsCss);
console.log('Updated app/globals.css with inline source candidates!');


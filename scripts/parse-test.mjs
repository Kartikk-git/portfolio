import fs from 'fs';

const content = fs.readFileSync('content/website-content.md', 'utf8');
const lines = content.split('\n');
const entries = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(/^`([a-zA-Z0-9_.]+)`(\s*⚠)?(?:\s+(.*))?$/);
  if (m) {
    const key = m[1];
    const warn = !!m[2];
    let val = m[3] ? m[3].trim() : '';
    if (!val) {
      // It's multi-line content! Collect subsequent lines until the next `key` or separator --- or ###
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
    entries.push({ key, warn, val });
  }
}

console.log('Total entries:', entries.length);
fs.writeFileSync('scripts/extracted-keys.json', JSON.stringify(entries, null, 2));
console.log('First 5:', entries.slice(0, 5));
console.log('Last 5:', entries.slice(-5));


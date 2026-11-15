import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const targets = ['app', 'content', 'public', 'lib'];
let allFiles = [];
targets.forEach((t) => (allFiles = allFiles.concat(walk(t))));

// Add root files
const rootFiles = fs.readdirSync('.').filter((f) => fs.statSync(f).isFile());
allFiles = allFiles.concat(rootFiles);

const httpRegex = /http:\/\/[^\s"'<>`)]+/g;
const findings = [];

allFiles.forEach((file) => {
  if (
    file.endsWith('.png') ||
    file.endsWith('.webp') ||
    file.endsWith('.jpg') ||
    file.endsWith('.ico') ||
    file.endsWith('.pdf') ||
    file.endsWith('.json') ||
    file.includes('node_modules') ||
    file.includes('.next') ||
    file.includes('out')
  ) {
    return;
  }
  const text = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = httpRegex.exec(text)) !== null) {
    findings.push({ file, url: match[0] });
  }
});

console.log(JSON.stringify(findings, null, 2));


import fs from 'fs';

const d = JSON.parse(fs.readFileSync('scripts/lighthouse-desktop.json', 'utf8'));
console.log('aria-prohibited-attr details:');
console.log(JSON.stringify(d.audits['aria-prohibited-attr'].details?.items, null, 2));

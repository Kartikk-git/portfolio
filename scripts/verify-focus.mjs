import { execSync } from 'child_process';
import http from 'http';

// Script to programmatically verify focus outline styles on interactive elements
// using a headless Chrome instance through our shoot/puppeteer harness.

const testScript = `
import puppeteer from './.agents/skills/design-taste-frontend/node_modules/puppeteer/cjs/puppeteer/puppeteer.js';
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

const focusAudit = await page.evaluate(() => {
  const interactives = document.querySelectorAll('a, button, input');
  const results = [];
  interactives.forEach(el => {
    el.focus();
    const style = window.getComputedStyle(el);
    const outline = style.outline || style.outlineWidth + ' ' + style.outlineStyle + ' ' + style.outlineColor;
    const offset = style.outlineOffset;
    results.push({
      tag: el.tagName,
      text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
      outline,
      offset,
      hasAccentRing: outline.includes('rgb(27, 107, 79)') || outline.includes('var(--accent)') || style.outlineStyle !== 'none'
    });
  });
  return results;
});

console.log('Audited', focusAudit.length, 'interactive elements:');
const nonConforming = focusAudit.filter(f => !f.hasAccentRing);
if (nonConforming.length > 0) {
  console.log('Non-conforming items:', JSON.stringify(nonConforming, null, 2));
} else {
  console.log('All interactive elements have active focus ring styles!');
}

await browser.close();
`;

console.log('Focus ring script prepared.');


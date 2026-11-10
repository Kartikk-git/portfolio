import { lightContrastData, darkContrastData } from '../app/styleguide/contrast.ts';

console.log('--- Light Theme Contrast ---');
for (const d of lightContrastData) {
  console.log(`${d.element}: ${d.ratio}:1 (Target: ${d.targetRequirement}) => ${d.wcagAA ? 'PASS' : 'FAIL'}`);
}

console.log('\n--- Dark Theme Contrast ---');
for (const d of darkContrastData) {
  console.log(`${d.element}: ${d.ratio}:1 (Target: ${d.targetRequirement}) => ${d.wcagAA ? 'PASS' : 'FAIL'}`);
}


import { spawn } from 'child_process';
import fs from 'fs';

process.env.CHROME_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function audit(formFactor) {
  console.log(`Running Lighthouse for ${formFactor}...`);
  return new Promise((resolve, reject) => {
    const args = [
      'lighthouse',
      'http://localhost:3000',
      '--chrome-flags=--headless=new',
      '--output=json',
      `--output-path=scripts/lighthouse-${formFactor}.json`,
      '--quiet',
      `--form-factor=${formFactor}`,
      '--only-categories=performance,accessibility,best-practices,seo'
    ];
    if (formFactor === 'desktop') {
      args.push('--screenEmulation.mobile=false');
    }
    const proc = spawn('npx', args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
  });
}

async function main() {
  await audit('desktop');
  await audit('mobile');

  const desktop = JSON.parse(fs.readFileSync('scripts/lighthouse-desktop.json', 'utf8'));
  const mobile = JSON.parse(fs.readFileSync('scripts/lighthouse-mobile.json', 'utf8'));

  const report = {
    desktop: {
      performance: Math.round(desktop.categories.performance.score * 100),
      accessibility: Math.round(desktop.categories.accessibility.score * 100),
      bestPractices: Math.round(desktop.categories['best-practices'].score * 100),
      seo: Math.round(desktop.categories.seo.score * 100),
      lcp: desktop.audits['largest-contentful-paint'].displayValue,
      cls: desktop.audits['cumulative-layout-shift'].displayValue,
      inp: desktop.audits['interaction-to-next-paint']?.displayValue || 'N/A'
    },
    mobile: {
      performance: Math.round(mobile.categories.performance.score * 100),
      accessibility: Math.round(mobile.categories.accessibility.score * 100),
      bestPractices: Math.round(mobile.categories['best-practices'].score * 100),
      seo: Math.round(mobile.categories.seo.score * 100),
      lcp: mobile.audits['largest-contentful-paint'].displayValue,
      cls: mobile.audits['cumulative-layout-shift'].displayValue,
      inp: mobile.audits['interaction-to-next-paint']?.displayValue || 'N/A'
    }
  };

  console.log('\n=== LIGHTHOUSE SCORES SUMMARY ===\n');
  console.log(JSON.stringify(report, null, 2));
}

main().catch(console.error);

import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  console.log('=== Final Pass Quality, A11y & Route Verification ===\n');
  const port = 9396;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1100',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
    if (!page) throw new Error('No page found');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const curId = id++;
      const listener = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', listener);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    const consoleLogs = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
      }
    });

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    // 1. Check Console Logs across all routes
    console.log('1. Checking routes for errors, warnings & hydration mismatches...');
    const routes = [
      '/',
      '/projects/student-organizer',
      '/projects/mplad',
      '/projects/tejovik',
      '/projects/hospital-management',
      '/projects/portfolio-v1',
      '/styleguide'
    ];

    const routeResults = {};
    for (const r of routes) {
      consoleLogs.length = 0;
      await send('Page.navigate', { url: `http://localhost:3000${r}` });
      await new Promise(res => setTimeout(res, 800));

      const errors = consoleLogs.filter(l => l.type === 'error' || l.text.toLowerCase().includes('hydration'));
      const warnings = consoleLogs.filter(l => l.type === 'warning');
      routeResults[r] = {
        errors: errors.length,
        warnings: warnings.length,
        details: errors.map(e => e.text)
      };
    }
    console.log('Route Console Audit:', JSON.stringify(routeResults, null, 2));

    // Return to home page
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await new Promise(res => setTimeout(res, 1000));

    // 2. Responsive check at 375, 768, 1024, 1280, 1440, 1600, 1920, 2560
    console.log('\n2. Checking horizontal overflow across breakpoints...');
    const testWidths = [375, 768, 1024, 1280, 1366, 1440, 1600, 1920, 2560];
    const overflowReport = {};
    for (const w of testWidths) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: w < 768 ? 2 : 1,
        mobile: w < 768
      });
      await new Promise(res => setTimeout(res, 200));

      const overflow = await evalExpr(`
        (() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
          const clientW = doc.clientWidth;
          return {
            scrollWidth: scrollW,
            clientWidth: clientW,
            hasOverflow: scrollW > clientW + 1
          };
        })()
      `);
      overflowReport[w] = overflow;
    }
    console.log('Horizontal Overflow Report:', JSON.stringify(overflowReport, null, 2));

    // 3. Check Phone About Screen gap reduction
    console.log('\n3. Verifying Phone About Screen gap tightening...');
    // Open phone mockup
    await send('Runtime.evaluate', { expression: `
      (() => {
        const btn = document.querySelector('#hero-bot-trigger');
        btn?.click();
      })()
    ` });
    await new Promise(res => setTimeout(res, 400));

    // Scroll to #about to trigger about screen
    await evalExpr(`document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });`);
    await new Promise(res => setTimeout(res, 400));

    const aboutScreenCheck = await evalExpr(`
      (() => {
        const profile = document.querySelector('#phone-mockup-frame h3');
        const firstStat = document.querySelector('#phone-mockup-frame .shadow-2xs');
        if (!profile || !firstStat) return null;
        const profileR = profile.getBoundingClientRect();
        const statR = firstStat.getBoundingClientRect();
        return {
          profileBottom: Math.round(profileR.bottom),
          statTop: Math.round(statR.top),
          gapBetweenProfileAndStats: Math.round(statR.top - profileR.bottom)
        };
      })()
    `);
    console.log('Phone About Screen layout check:', aboutScreenCheck);

    // Capture screenshot of Phone About Screen
    const phoneShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'final-phone-about-screen.png'), Buffer.from(phoneShot.data, 'base64'));
    console.log('Saved artifact: final-phone-about-screen.png');

    // 4. Check Class X and XII marksheet thumbnail object-top crop
    console.log('\n4. Verifying Education marksheet thumbnail object-top crop...');
    await evalExpr(`document.getElementById('education')?.scrollIntoView({ behavior: 'instant' });`);
    await new Promise(res => setTimeout(res, 400));

    const marksheetCheck = await evalExpr(`
      (() => {
        const imgs = Array.from(document.querySelectorAll('#education button img'));
        return imgs.map(img => ({
          alt: img.alt,
          objectFit: window.getComputedStyle(img).objectFit,
          objectPosition: window.getComputedStyle(img).objectPosition,
          filter: window.getComputedStyle(img).filter
        }));
      })()
    `);
    console.log('Marksheet Thumbnails check:', marksheetCheck);

    const eduShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'final-education-marksheets.png'), Buffer.from(eduShot.data, 'base64'));
    console.log('Saved artifact: final-education-marksheets.png');

    // 5. Check Reduced Motion Emulation
    console.log('\n5. Emulating prefers-reduced-motion: reduce...');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    // Scroll back to top
    await evalExpr(`window.scrollTo(0, 0);`);
    await new Promise(res => setTimeout(res, 500));

    const reducedMotionCheck = await evalExpr(`
      (() => {
        const headline = document.querySelector('#hero h1')?.nextElementSibling;
        const score = document.querySelector('#hero span.tabular-nums');
        const bot = document.querySelector('#hero-bot-trigger');
        return {
          taglineFull: headline?.textContent?.includes('curiosity into code.'),
          scoreFinal: score?.textContent,
          botVisible: Boolean(bot)
        };
      })()
    `);
    console.log('Reduced motion check:', reducedMotionCheck);

    // 6. Keyboard accessibility & Tab order
    console.log('\n6. Checking keyboard accessibility and focus stops on home page...');
    const a11yCheck = await evalExpr(`
      (() => {
        const focusable = Array.from(document.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
          .filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.getClientRects().length > 0;
          });

        // Heatmap focus check: only ONE roving tabindex={0} item inside #activity
        const activityFocusable = focusable.filter(el => el.closest('#activity'));

        return {
          totalFocusable: focusable.length,
          activityFocusableStops: activityFocusable.length,
          firstStop: focusable[0]?.tagName + ' - ' + (focusable[0]?.textContent || '').trim().slice(0, 30),
          lastStop: focusable[focusable.length - 1]?.tagName + ' - ' + (focusable[focusable.length - 1]?.textContent || '').trim().slice(0, 30)
        };
      })()
    `);
    console.log('Keyboard focus audit:', a11yCheck);

    console.log('\n=== All Verification Steps Completed Successfully! ===\n');
  } catch (err) {
    console.error('Final check failed:', err);
  } finally {
    edge.kill();
  }
}

run();


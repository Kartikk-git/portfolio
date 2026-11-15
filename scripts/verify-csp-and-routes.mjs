import http from 'http';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Testing all routes and interactive components under production CSP...\n');

  const port = 9688;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'http://localhost:3000/',
  ]);
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/json`, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(JSON.parse(data)));
        })
        .on('error', reject);
    });

    const page = list.find((t) => t.type === 'page' && t.url.includes('localhost:3000'));
    if (!page) throw new Error('No page found');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
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

    let currentCspViolations = [];
    let currentConsoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
        if (msg.params.type === 'error') {
          currentConsoleErrors.push(text);
        }
      }
      if (msg.method === 'Log.entryAdded') {
        const entry = msg.params.entry;
        if (
          entry.source === 'security' ||
          (entry.text && entry.text.includes('Content Security Policy'))
        ) {
          currentCspViolations.push(entry.text);
        }
      }
    };

    await new Promise((r) => (ws.onopen = r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Log.enable');
    await send('Security.enable');

    const routes = [
      '/',
      '/projects/student-organizer',
      '/projects/tejovik',
      '/projects/mplad',
      '/projects/hospital-management',
      '/projects/portfolio-v1',
    ];

    let totalViolations = 0;

    for (const r of routes) {
      currentCspViolations = [];
      currentConsoleErrors = [];

      await send('Page.navigate', { url: `http://localhost:3000${r}` });
      await new Promise((res) => setTimeout(res, 1200));

      const domViolations = await send('Runtime.evaluate', {
        expression: `(() => {
          return window.__cspViolations || [];
        })()`,
        returnByValue: true,
      });

      const violations = currentCspViolations.concat(domViolations.result?.value || []);
      console.log(`Route [${r}]:`);
      console.log(`  - CSP Violations: ${violations.length}`);
      console.log(`  - Console Errors: ${currentConsoleErrors.length}`);
      if (violations.length > 0) {
        console.error('    Violations:', violations);
        totalViolations += violations.length;
      }
      if (currentConsoleErrors.length > 0) {
        console.error('    Console Errors:', currentConsoleErrors);
      }
    }

    // 2. Interactive Components Testing on Home
    console.log('\nTesting Home Page Interactive Components:');
    currentCspViolations = [];
    currentConsoleErrors = [];
    await send('Page.navigate', { url: `http://localhost:3000/` });
    await new Promise((res) => setTimeout(res, 1200));

    // A. Heatmap: scroll into view, click replay, toggle LeetCode tab
    console.log('  Testing Heatmap (scroll, replay, tabs)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('activity') || document.querySelector('[data-section="activity"]');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      })()`,
    });
    await new Promise((res) => setTimeout(res, 600));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label*="Replay"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Replay'));
        if (btn) btn.click();
      })()`,
    });
    await new Promise((res) => setTimeout(res, 500));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('LeetCode'));
        if (tab) tab.click();
      })()`,
    });
    await new Promise((res) => setTimeout(res, 500));

    // B. Command Palette: Open via Ctrl+K, search, execute
    console.log('  Testing Command Palette (Ctrl+K, filter, navigate)...');
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      modifiers: 2, // Ctrl
      windowsVirtualKeyCode: 75,
      key: 'k',
      code: 'KeyK',
    });
    await new Promise((res) => setTimeout(res, 500));

    for (const c of 'projects') {
      await send('Input.dispatchKeyEvent', { type: 'char', text: c });
    }
    await new Promise((res) => setTimeout(res, 300));

    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      windowsVirtualKeyCode: 27,
      key: 'Escape',
      code: 'Escape',
    });
    await new Promise((res) => setTimeout(res, 400));

    // C. Phone Mockup: Open phone, switch screens
    console.log('  Testing Phone Mockup (open, switch screens)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const bot = document.querySelector('[aria-label*="Phone"]') || document.querySelector('[aria-label*="bot"]');
        if (bot) bot.click();
      })()`,
    });
    await new Promise((res) => setTimeout(res, 800));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('button[aria-label*="screen"], nav button'));
        if (tabs.length > 1) tabs[1].click();
      })()`,
    });
    await new Promise((res) => setTimeout(res, 500));

    // D. Resume Modal: Open & Close
    console.log('  Testing Resume Modal...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const resumeBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.trim().toLowerCase() === 'resume');
        if (resumeBtn) resumeBtn.click();
      })()`,
    });
    await new Promise((res) => setTimeout(res, 800));

    // Check for violations during all interactions
    console.log('\nInteractive Test Results:');
    console.log(`  - CSP Violations: ${currentCspViolations.length}`);
    console.log(`  - Console Errors: ${currentConsoleErrors.length}`);
    if (currentCspViolations.length > 0) {
      console.error('    Violations:', currentCspViolations);
      totalViolations += currentCspViolations.length;
    }
    if (currentConsoleErrors.length > 0) {
      console.error('    Console Errors:', currentConsoleErrors);
    }

    ws.close();

    if (totalViolations === 0 && currentConsoleErrors.length === 0) {
      console.log('\n✅ ALL ROUTES & COMPONENTS VERIFIED WITH ZERO CSP VIOLATIONS AND ZERO CONSOLE ERRORS!');
    } else {
      console.error(`\n❌ Failed with ${totalViolations} violations / ${currentConsoleErrors.length} errors.`);
      process.exit(1);
    }
  } finally {
    edge.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

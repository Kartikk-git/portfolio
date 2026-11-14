import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTest() {
  console.log('Testing Super Modes (Super Dark in Dark, Super Light in Light)...');
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--window-size=1440,960',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9235/json', (res) => {
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
    await new Promise(r => setTimeout(r, 1200));

    // 1. Ensure current theme is dark
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      })()`
    });

    // Hold theme button for 3.1s in dark mode -> Should trigger AMOLED (super dark)
    console.log('Triggering press-and-hold in dark mode...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[title*="theme"], header button[aria-label*="theme"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)');
        if (btn) {
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        }
      })()`
    });

    // Wait 3.2s for hold trigger
    await new Promise(r => setTimeout(r, 3200));

    // Release mouse and trigger subsequent click to consume hold click
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[title*="theme"], header button[aria-label*="theme"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)');
        if (btn) {
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          btn.click();
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const amoledActive = await send('Runtime.evaluate', {
      expression: `document.documentElement.classList.contains('ultra-amoled')`,
      returnByValue: true
    });
    console.log('Dark mode triggered super dark (ultra-amoled):', amoledActive.result.value);

    const shotAmoled = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/super-dark-amoled-verified.png', Buffer.from(shotAmoled.data, 'base64'));
    console.log('Saved shots/super-dark-amoled-verified.png');

    // Revert back to normal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const revertBtn = document.querySelector('div[role="status"] button');
        if (revertBtn) revertBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    // 2. Set theme to light mode by clicking the button once
    console.log('Switching to light mode via button click and triggering press-and-hold...');
    const themeBeforeClick = await send('Runtime.evaluate', {
      expression: `document.documentElement.getAttribute('data-theme')`,
      returnByValue: true
    });
    console.log('Theme before switch click:', themeBeforeClick.result.value);

    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[title*="theme"], header button[aria-label*="theme"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const themeAfterClick = await send('Runtime.evaluate', {
      expression: `document.documentElement.getAttribute('data-theme')`,
      returnByValue: true
    });
    console.log('Theme after switch click:', themeAfterClick.result.value);

    // Now hold in light mode
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[title*="theme"], header button[aria-label*="theme"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)');
        if (btn) {
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 3200));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[title*="theme"], header button[aria-label*="theme"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)');
        if (btn) {
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          btn.click();
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const flashbangActive = await send('Runtime.evaluate', {
      expression: `document.documentElement.classList.contains('ultra-flashbang')`,
      returnByValue: true
    });
    console.log('Light mode triggered super light (ultra-flashbang):', flashbangActive.result.value);

    const shotFlashbang = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/super-light-flashbang-verified.png', Buffer.from(shotFlashbang.data, 'base64'));
    console.log('Saved shots/super-light-flashbang-verified.png');

    console.log('ALL SUPER MODE TESTS COMPLETED.');
  } finally {
    edge.kill();
  }
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

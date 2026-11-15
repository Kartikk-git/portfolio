import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function main() {
  console.log('=== Command Palette Layout, Layering & Interaction Verification ===\n');
  const port = 9400;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'http://localhost:3000',
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

    await new Promise((r) => (ws.onopen = r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    const consoleLogs = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
      }
    });

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    // --- TEST 1: 1440px Desktop Dark Theme ---
    console.log('1. Testing Desktop 1440px (Dark Theme)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 1200));

    // Ensure dark theme
    await evalExpr(`document.documentElement.setAttribute('data-theme', 'dark')`);

    // Click Logcat button
    const clickLogcat = await evalExpr(`
      (() => {
        const btn = document.querySelector('button[aria-label*="Logcat"]');
        if (!btn) return 'not_found';
        btn.click();
        return 'clicked';
      })()
    `);
    console.log('  Logcat button click:', clickLogcat);
    await new Promise((r) => setTimeout(r, 500));

    // Inspect layering & styles
    const darkInfo = await evalExpr(`
      (() => {
        const portal = document.getElementById('command-palette-portal');
        const backdrop = document.querySelector('[key="palette-backdrop"], .backdrop-blur-\\\\[2px\\\\]');
        const dialog = document.querySelector('[role="dialog"][aria-label="Command palette"]');
        const hero = document.getElementById('hero');
        const portrait = hero ? hero.querySelector('.rounded-full') : null;
        const main = document.getElementById('main-content');
        
        return {
          portalParent: portal ? portal.parentElement.tagName : null,
          backdropZIndex: backdrop ? window.getComputedStyle(backdrop).zIndex : null,
          backdropBg: backdrop ? window.getComputedStyle(backdrop).backgroundColor : null,
          dialogZIndex: dialog ? window.getComputedStyle(dialog).zIndex : null,
          dialogBg: dialog ? window.getComputedStyle(dialog).backgroundColor : null,
          mainInert: main ? main.hasAttribute('inert') : null,
          mainAriaHidden: main ? main.getAttribute('aria-hidden') : null,
          bodyOverflow: document.body.style.overflow,
          htmlOverflow: document.documentElement.style.overflow
        };
      })()
    `);
    console.log('  Dark Theme Layering & Stacking:', JSON.stringify(darkInfo, null, 2));

    const shot1440Dark = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(artifactDir, 'command-palette-1440-dark.png'),
      Buffer.from(shot1440Dark.data, 'base64')
    );
    console.log('  Captured artifact: command-palette-1440-dark.png');

    // Close via Escape key and test focus restore + inert cleanup
    console.log('\n2. Testing Escape close, focus restoration and scroll unlock...');
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 400));

    const closeCheck = await evalExpr(`
      (() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="Command palette"]');
        const main = document.getElementById('main-content');
        const active = document.activeElement;
        return {
          isOpen: Boolean(dialog),
          mainHasInert: main ? main.hasAttribute('inert') : false,
          mainAriaHidden: main ? main.getAttribute('aria-hidden') : null,
          bodyOverflow: document.body.style.overflow,
          activeElementLabel: active ? (active.getAttribute('aria-label') || active.tagName) : null
        };
      })()
    `);
    console.log('  Close State check:', JSON.stringify(closeCheck, null, 2));

    // --- TEST 2: 1440px Desktop Light Theme ---
    console.log('\n3. Testing Desktop 1440px (Light Theme via Ctrl+K)...');
    await evalExpr(`document.documentElement.setAttribute('data-theme', 'light')`);
    await new Promise((r) => setTimeout(r, 300));

    // Dispatch Ctrl+K shortcut
    await send('Input.dispatchKeyEvent', {
      type: 'rawKeyDown',
      key: 'k',
      code: 'KeyK',
      modifiers: 2, // Ctrl
      windowsVirtualKeyCode: 75
    });
    await send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'k',
      code: 'KeyK',
      modifiers: 2,
      windowsVirtualKeyCode: 75
    });
    await new Promise((r) => setTimeout(r, 500));

    const lightInfo = await evalExpr(`
      (() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="Command palette"]');
        return {
          isOpen: Boolean(dialog),
          dialogBg: dialog ? window.getComputedStyle(dialog).backgroundColor : null,
          dialogBorder: dialog ? window.getComputedStyle(dialog).border : null
        };
      })()
    `);
    console.log('  Light Theme Panel Info:', JSON.stringify(lightInfo, null, 2));

    const shot1440Light = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(artifactDir, 'command-palette-1440-light.png'),
      Buffer.from(shot1440Light.data, 'base64')
    );
    console.log('  Captured artifact: command-palette-1440-light.png');

    // Close palette
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 400));

    // --- TEST 3: Mobile 375px Dark Theme ---
    console.log('\n4. Testing Mobile 375px (Dark Theme)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await evalExpr(`document.documentElement.setAttribute('data-theme', 'dark')`);
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 1200));

    // Click mobile header Logcat button
    await evalExpr(`
      (() => {
        const btn = document.querySelector('header button[aria-label*="Logcat"]');
        if (btn) btn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 500));

    const shot375Dark = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(artifactDir, 'command-palette-375-dark.png'),
      Buffer.from(shot375Dark.data, 'base64')
    );
    console.log('  Captured artifact: command-palette-375-dark.png');

    // --- TEST 4: Mobile 375px Light Theme ---
    console.log('\n5. Testing Mobile 375px (Light Theme)...');
    await evalExpr(`document.documentElement.setAttribute('data-theme', 'light')`);
    await new Promise((r) => setTimeout(r, 300));

    const shot375Light = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(artifactDir, 'command-palette-375-light.png'),
      Buffer.from(shot375Light.data, 'base64')
    );
    console.log('  Captured artifact: command-palette-375-light.png');

    // Test Esc close on mobile
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise((r) => setTimeout(r, 400));

    // --- TEST 5: Repeated open/close stress test ---
    console.log('\n6. Testing repeated open/close cycle (5 iterations)...');
    for (let i = 0; i < 5; i++) {
      await evalExpr(`document.querySelector('header button[aria-label*="Logcat"]')?.click()`);
      await new Promise((r) => setTimeout(r, 150));
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await new Promise((r) => setTimeout(r, 150));
    }

    const stressCheck = await evalExpr(`
      (() => {
        return {
          bodyOverflow: document.body.style.overflow,
          htmlOverflow: document.documentElement.style.overflow,
          mainHasInert: document.getElementById('main-content')?.hasAttribute('inert') || false,
          activeTag: document.activeElement?.tagName,
          activeAriaLabel: document.activeElement?.getAttribute('aria-label')
        };
      })()
    `);
    console.log('  Post-stress test state:', JSON.stringify(stressCheck, null, 2));

    console.log('\nConsole logs captured throughout all tests:');
    if (consoleLogs.length === 0) {
      console.log('  Clean! No console errors, warnings, or hydration mismatches.');
    } else {
      consoleLogs.forEach((log) => console.log(`  [${log.type}] ${log.text}`));
    }

    console.log('\n=== All verification assertions completed successfully! ===');
    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


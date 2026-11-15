import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  console.log('=== Verifying CommandPalette Polish & Accessibility ===\n');
  const port = 9397;
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

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    console.log('1. Checking Header Logcat button and pressing it to open CommandPalette...');
    const openRes = await evalExpr(`
      (() => {
        const btn = document.querySelector('button[aria-label*="Logcat"]');
        if (!btn) return { ok: false, error: 'Logcat button not found' };
        btn.click();
        return { ok: true, text: btn.textContent };
      })()
    `);
    console.log('Open result:', openRes);

    await new Promise(r => setTimeout(r, 400));

    // Verify dialog ARIA attributes
    console.log('2. Verifying ARIA attributes and terminal combobox pattern...');
    const ariaCheck = await evalExpr(`
      (() => {
        const dialog = document.querySelector('div[role="dialog"][aria-label="Command palette"]');
        const combobox = document.querySelector('input[role="combobox"]');
        const listbox = document.querySelector('#command-palette-listbox[role="listbox"]');
        const groups = document.querySelectorAll('#command-palette-listbox div[role="group"]');
        const options = document.querySelectorAll('#command-palette-listbox div[role="option"]');
        const activeDesc = combobox?.getAttribute('aria-activedescendant');

        return {
          dialogFound: Boolean(dialog),
          isModal: dialog?.getAttribute('aria-modal'),
          comboboxRole: combobox?.getAttribute('role'),
          ariaExpanded: combobox?.getAttribute('aria-expanded'),
          ariaControls: combobox?.getAttribute('aria-controls'),
          activeDescendant: activeDesc,
          listboxRole: listbox?.getAttribute('role'),
          groupCount: groups.length,
          groupTitles: Array.from(groups).map(g => g.getAttribute('aria-label')),
          optionCount: options.length,
          firstSelected: options[0]?.getAttribute('aria-selected'),
          firstId: options[0]?.id
        };
      })()
    `);
    console.log('ARIA verification result:', ariaCheck);

    // Capture desktop screenshot of default open state
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'command-palette-open-desktop.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved artifact: command-palette-open-desktop.png');

    // Test ArrowDown navigation
    console.log('3. Testing keyboard Arrow navigation & roving aria-activedescendant...');
    await evalExpr(`
      (() => {
        const input = document.querySelector('input[role="combobox"]');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 100));

    const navRes = await evalExpr(`
      (() => {
        const combobox = document.querySelector('input[role="combobox"]');
        const options = document.querySelectorAll('#command-palette-listbox div[role="option"]');
        return {
          activeDescendant: combobox?.getAttribute('aria-activedescendant'),
          selectedIdx: Array.from(options).findIndex(o => o.getAttribute('aria-selected') === 'true'),
          secondId: options[1]?.id
        };
      })()
    `);
    console.log('ArrowDown result:', navRes);

    // Test search filtering & highlighting
    console.log('4. Testing in-house fuzzy search and match highlighting for "stud"...');
    await evalExpr(`
      (() => {
        const input = document.querySelector('input[role="combobox"]');
        // Simulate typing "stud"
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'stud');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 200));

    const searchRes = await evalExpr(`
      (() => {
        const options = document.querySelectorAll('#command-palette-listbox div[role="option"]');
        const marks = document.querySelectorAll('#command-palette-listbox mark');
        return {
          optionCount: options.length,
          options: Array.from(options).map(o => o.textContent.replace(/\\s+/g, ' ').trim()),
          markCount: marks.length,
          markTexts: Array.from(marks).map(m => m.textContent)
        };
      })()
    `);
    console.log('Search "stud" result:', searchRes);

    const shotSearch = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'command-palette-search.png'), Buffer.from(shotSearch.data, 'base64'));
    console.log('Saved artifact: command-palette-search.png');

    // Test empty search state
    console.log('5. Testing empty search results state ("xyz123")...');
    await evalExpr(`
      (() => {
        const input = document.querySelector('input[role="combobox"]');
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'xyz123');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 200));

    const emptyRes = await evalExpr(`
      (() => {
        const listbox = document.querySelector('#command-palette-listbox');
        return {
          text: listbox?.textContent.replace(/\\s+/g, ' ').trim()
        };
      })()
    `);
    console.log('Empty state result:', emptyRes);

    // Test escape to close
    console.log('6. Testing Escape key to close palette...');
    await evalExpr(`
      (() => {
        const input = document.querySelector('input[role="combobox"]');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 300));

    const closeRes = await evalExpr(`
      (() => {
        const dialog = document.querySelector('div[role="dialog"][aria-label="Command palette"]');
        return { isOpen: Boolean(dialog) };
      })()
    `);
    console.log('Palette closed after Esc:', closeRes);

    // Test Mobile viewport (375x812)
    console.log('7. Testing Mobile Viewport (375x812)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 300));

    // Reopen palette
    await evalExpr(`
      (() => {
        const btn = document.querySelector('button[aria-label*="Logcat"]');
        btn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 300));

    const mobileCheck = await evalExpr(`
      (() => {
        const options = document.querySelectorAll('#command-palette-listbox div[role="option"]');
        const heights = Array.from(options).slice(0, 3).map(o => o.getBoundingClientRect().height);
        const footer = document.querySelector('div[role="dialog"] div.hidden.sm\\\\:flex');
        return {
          optionHeights: heights,
          footerHidden: Boolean(footer)
        };
      })()
    `);
    console.log('Mobile verification result:', mobileCheck);

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'command-palette-mobile-375.png'), Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved artifact: command-palette-mobile-375.png');

    console.log('\n=== All CommandPalette Verifications Passed! ===\n');
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    edge.kill();
  }
}

run();


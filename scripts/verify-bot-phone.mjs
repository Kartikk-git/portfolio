import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function launchBrowser(width, height = 900) {
  const port = 9520 + (width % 100);
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    'http://localhost:3000',
  ]);
  await new Promise((r) => setTimeout(r, 2000));

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

  const evalExpr = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true });
    return res.result?.value;
  };

  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 2500));

  return { edge, ws, send, evalExpr };
}

async function runTests() {
  console.log('=== STARTING HERO BOT & PHONE VERIFICATION ===\n');

  // TEST 1: 1440px Dialog Mode
  {
    console.log('--- TEST 1: 1440px (Dialog Mode) ---');
    const { edge, ws, send, evalExpr } = await launchBrowser(1440, 900);
    try {
      // 1. Check bot exists and state
      const initialBot = await evalExpr(`(() => {
        const b = document.getElementById('hero-bot-trigger');
        return b ? { exists: true, rect: b.getBoundingClientRect() } : null;
      })()`);
      console.log('1440px Initial Bot:', initialBot);

      // Helper to click bot
      const clickBot = async () => {
        await evalExpr(`(() => {
          const b = document.getElementById('hero-bot-trigger');
          if (b) b.click();
        })()`);
        await new Promise((r) => setTimeout(r, 600));
      };

      // Helper to check phone & backdrop
      const checkState = async () => {
        return await evalExpr(`(() => {
          const dialog = document.querySelector('[role="dialog"][aria-label*="Phone"], [role="dialog"][aria-label*="phone"], .z-modal');
          const dialogFrame = document.getElementById('phone-mockup-dialog-frame');
          const bot = document.getElementById('hero-bot-trigger');
          return {
            dialogMounted: Boolean(dialog),
            dialogDisplay: dialog ? window.getComputedStyle(dialog).display : null,
            dialogFrameMounted: Boolean(dialogFrame),
            dialogFrameVisible: dialogFrame ? window.getComputedStyle(dialogFrame).opacity : null,
            botVisible: bot ? window.getComputedStyle(bot.parentElement.parentElement).display : 'none',
            activeElement: document.activeElement ? (document.activeElement.tagName + '#' + document.activeElement.id) : null
          };
        })()`);
      };

      // 1.1 Open dialog
      console.log('Clicking bot to open dialog...');
      await clickBot();
      let state = await checkState();
      console.log('State after open:', state);
      if (!state.dialogMounted) throw new Error('Dialog did not mount!');

      // Capture screenshot of open dialog at 1440px
      const shot1440 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, 'phone-open-1440px.png'), Buffer.from(shot1440.data, 'base64'));
      console.log('Saved phone-open-1440px.png');

      // 1.2 Close via Esc
      console.log('Pressing Escape key...');
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await new Promise((r) => setTimeout(r, 600));
      state = await checkState();
      console.log('State after Esc:', state);
      if (state.dialogMounted) throw new Error('Backdrop was not removed after Esc!');

      // 1.3 Open and close via close button
      console.log('Reopening bot...');
      await clickBot();
      state = await checkState();
      console.log('State after reopen:', state);
      if (!state.dialogMounted) throw new Error('Dialog did not reopen!');

      console.log('Clicking close button...');
      await evalExpr(`(() => {
        const btn = document.querySelector('#phone-mockup-dialog-frame button[aria-label*="Close"], #phone-mockup-dialog-frame button[aria-label*="close"]');
        if (btn) btn.click();
      })()`);
      await new Promise((r) => setTimeout(r, 600));
      state = await checkState();
      console.log('State after close button:', state);
      if (state.dialogMounted) throw new Error('Backdrop was not removed after close button!');

      // 1.4 Open and close via outside click
      console.log('Reopening bot...');
      await clickBot();
      state = await checkState();
      console.log('Clicking backdrop outside frame...');
      await evalExpr(`(() => {
        const dialog = document.querySelector('[role="dialog"][aria-label*="Phone"], [role="dialog"][aria-label*="phone"], .z-modal');
        if (dialog) dialog.click();
      })()`);
      await new Promise((r) => setTimeout(r, 600));
      state = await checkState();
      console.log('State after outside click:', state);
      if (state.dialogMounted) throw new Error('Backdrop was not removed after outside click!');

      // 1.5 Test 5 full open/close cycles
      console.log('Testing 5 open/close cycles in a row...');
      for (let i = 1; i <= 5; i++) {
        await clickBot();
        let sOpen = await checkState();
        if (!sOpen.dialogMounted) throw new Error(`Cycle ${i} failed to open!`);
        await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await new Promise((r) => setTimeout(r, 500));
        let sClose = await checkState();
        if (sClose.dialogMounted) throw new Error(`Cycle ${i} failed to close!`);
        console.log(`  Cycle ${i}/5 passed.`);
      }
      console.log('1440px tests PASSED!\n');
    } finally {
      ws.close();
      edge.kill();
    }
  }

  // TEST 2: 1920px Gutter Mode
  {
    console.log('--- TEST 2: 1920px (Gutter Mode) ---');
    const { edge, ws, send, evalExpr } = await launchBrowser(1920, 900);
    try {
      const clickBot = async () => {
        await evalExpr(`(() => {
          const b = document.getElementById('hero-bot-trigger');
          if (b) b.click();
        })()`);
        await new Promise((r) => setTimeout(r, 600));
      };

      const checkState = async () => {
        return await evalExpr(`(() => {
          const gutter = document.getElementById('phone-mockup-frame');
          const bot = document.getElementById('hero-bot-trigger');
          return {
            gutterMounted: Boolean(gutter),
            gutterDisplay: gutter ? window.getComputedStyle(gutter).display : null,
            gutterOpacity: gutter ? window.getComputedStyle(gutter).opacity : null,
            gutterRect: gutter ? gutter.getBoundingClientRect() : null,
            botContainerDisplay: bot ? window.getComputedStyle(bot.parentElement.parentElement).display : 'none',
            botRect: bot ? bot.getBoundingClientRect() : null
          };
        })()`);
      };

      console.log('Opening phone in gutter mode...');
      await clickBot();
      let state = await checkState();
      console.log('State after gutter open:', state);
      if (!state.gutterMounted || state.gutterDisplay === 'none') {
        throw new Error('Gutter phone did not open at 1920px!');
      }

      // Capture screenshot of gutter phone at 1920px
      const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, 'phone-open-1920px.png'), Buffer.from(shot1920.data, 'base64'));
      console.log('Saved phone-open-1920px.png');

      // Close gutter phone via close button
      console.log('Clicking gutter close button...');
      await evalExpr(`(() => {
        const btn = document.querySelector('#phone-mockup-frame button');
        if (btn) btn.click();
      })()`);
      await new Promise((r) => setTimeout(r, 600));
      state = await checkState();
      console.log('State after gutter close:', state);
      if (state.gutterMounted) throw new Error('Gutter phone was not unmounted/closed!');

      // Test 5 open/close cycles at 1920px
      console.log('Testing 5 cycles at 1920px...');
      for (let i = 1; i <= 5; i++) {
        await clickBot();
        let sOpen = await checkState();
        if (!sOpen.gutterMounted || sOpen.gutterDisplay === 'none') throw new Error(`1920px Cycle ${i} open failed!`);
        await evalExpr(`(() => {
          const btn = document.querySelector('#phone-mockup-frame button');
          if (btn) btn.click();
        })()`);
        await new Promise((r) => setTimeout(r, 500));
        let sClose = await checkState();
        if (sClose.gutterMounted) throw new Error(`1920px Cycle ${i} close failed!`);
        console.log(`  Cycle ${i}/5 passed.`);
      }
      console.log('1920px tests PASSED!\n');
    } finally {
      ws.close();
      edge.kill();
    }
  }

  // TEST 3: Keyboard Navigation (Tab + Enter)
  {
    console.log('--- TEST 3: Keyboard Navigation ---');
    const { edge, ws, send, evalExpr } = await launchBrowser(1440, 900);
    try {
      console.log('Focusing bot trigger...');
      await evalExpr(`document.getElementById('hero-bot-trigger').focus()`);
      console.log('Sending Enter key...');
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await new Promise((r) => setTimeout(r, 600));

      const isDialog = await evalExpr(`Boolean(document.getElementById('phone-mockup-dialog-frame'))`);
      console.log('Dialog open via Enter key:', isDialog);
      if (!isDialog) throw new Error('Enter key failed to open phone dialog!');
      console.log('Keyboard test PASSED!\n');
    } finally {
      ws.close();
      edge.kill();
    }
  }

  // TEST 4: Mobile at 375px
  {
    console.log('--- TEST 4: Mobile Touch at 375px ---');
    const { edge, ws, send, evalExpr } = await launchBrowser(375, 812);
    try {
      console.log('Tapping bot on mobile...');
      await evalExpr(`document.getElementById('hero-bot-trigger').click()`);
      await new Promise((r) => setTimeout(r, 600));

      const isDialog = await evalExpr(`Boolean(document.getElementById('phone-mockup-dialog-frame'))`);
      console.log('Dialog open on 375px:', isDialog);
      if (!isDialog) throw new Error('Mobile tap failed to open phone dialog!');

      const shot375 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, 'phone-open-375px.png'), Buffer.from(shot375.data, 'base64'));
      console.log('Saved phone-open-375px.png');
      console.log('375px mobile test PASSED!\n');
    } finally {
      ws.close();
      edge.kill();
    }
  }

  // TEST 5: Command Palette "Open app preview" Command
  {
    console.log('--- TEST 5: Command Palette Integration ---');
    const { edge, ws, send, evalExpr } = await launchBrowser(1440, 900);
    try {
      console.log('Opening command palette...');
      await evalExpr(`document.getElementById('command-palette-trigger')?.click() || window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))`);
      await new Promise((r) => setTimeout(r, 400));

      console.log('Clicking "Open app preview" in command palette...');
      const clicked = await evalExpr(`(() => {
        const items = Array.from(document.querySelectorAll('[role="option"], button'));
        const previewItem = items.find(el => el.textContent && el.textContent.toLowerCase().includes('open app preview'));
        if (previewItem) {
          previewItem.click();
          return true;
        }
        return false;
      })()`);
      console.log('Found & clicked preview item:', clicked);
      await new Promise((r) => setTimeout(r, 600));

      const isDialog = await evalExpr(`Boolean(document.getElementById('phone-mockup-dialog-frame'))`);
      console.log('Dialog open via Command Palette:', isDialog);
      if (!isDialog) throw new Error('Command palette command failed to open phone preview!');
      console.log('Command palette test PASSED!\n');
    } finally {
      ws.close();
      edge.kill();
    }
  }

  console.log('=== ALL 5 VERIFICATION SUITES PASSED! ===');
}

runTests().catch((err) => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});

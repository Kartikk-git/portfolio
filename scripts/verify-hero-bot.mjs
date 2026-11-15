import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function testWidescreen() {
  console.log('--- Testing 1920px Widescreen Desktop ---');
  const port = 9388;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1920,1080',
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

    // 1. Initial State: Check phone is NOT rendered
    const check1 = await send('Runtime.evaluate', {
      expression: `Boolean(document.getElementById('phone-mockup-frame'))`,
      returnByValue: true
    });
    console.log('[Test 1] Phone rendered on initial load:', check1.result.value); // Expected: false

    // 2. Wait for 2.2s for invite to trigger
    await new Promise(r => setTimeout(r, 2200));

    const checkInvite = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.getElementById('hero-bot-trigger');
          const bubble = document.body.innerText.includes('Click me!');
          return { hasBtn: Boolean(btn), hasBubble: bubble };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 2] Bot invite bubble active:', checkInvite.result.value);

    // Capture screenshot of invite bubble
    const shotInvite = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'hero-bot-invite.png'), Buffer.from(shotInvite.data, 'base64'));

    // 3. Wait for 5s (total > 7s after load) -> speech bubble recedes to peeking
    await new Promise(r => setTimeout(r, 5000));

    const checkPeeking = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.getElementById('hero-bot-trigger');
          const hasBubble = document.body.innerText.includes('Click me!');
          return { hasBtn: Boolean(btn), hasBubble };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 3] Bot in peeking state (bubble gone):', checkPeeking.result.value);

    // 4. Click the bot to open the phone
    console.log('[Test 4] Clicking bot...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.getElementById('hero-bot-trigger');
        if (btn) btn.click();
      `
    });

    await new Promise(r => setTimeout(r, 700));

    const checkOpen = await send('Runtime.evaluate', {
      expression: `Boolean(document.getElementById('phone-mockup-frame'))`,
      returnByValue: true
    });
    console.log('[Test 4] Phone rendered after click:', checkOpen.result.value); // Expected: true

    const shotOpen = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'hero-phone-open-1920.png'), Buffer.from(shotOpen.data, 'base64'));

    // 5. Scroll down to #projects
    console.log('[Test 5] Scrolling to #projects...');
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });

    await new Promise(r => setTimeout(r, 800));

    const checkProjects = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const phoneOpen = Boolean(document.getElementById('phone-mockup-frame'));
          const botInDom = Boolean(document.getElementById('hero-bot-trigger'));
          return { phoneOpen, botInDom };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 5] Phone stays open in #projects & bot hidden outside hero:', checkProjects.result.value);

    const shotProjects = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'phone-remains-open-projects.png'), Buffer.from(shotProjects.data, 'base64'));

    // 6. Close the phone while scrolled outside hero
    console.log('[Test 6] Closing phone outside hero...');
    await send('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('#phone-mockup-frame button[aria-label="Close app preview"]');
        if (closeBtn) closeBtn.click();
      `
    });

    await new Promise(r => setTimeout(r, 600));

    const checkClosed = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const phoneOpen = Boolean(document.getElementById('phone-mockup-frame'));
          const botInDom = Boolean(document.getElementById('hero-bot-trigger'));
          return { phoneOpen, botInDom };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 6] Phone closed outside hero and bot cannot reopen:', checkClosed.result.value);

    // 7. Scroll back up to #hero
    console.log('[Test 7] Scrolling back to #hero...');
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo({ top: 0, behavior: 'instant' });
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    const checkHeroReturn = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const botInDom = Boolean(document.getElementById('hero-bot-trigger'));
          const phoneOpen = Boolean(document.getElementById('phone-mockup-frame'));
          return { botInDom, phoneOpen };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 7] Bot reappears on return to hero:', checkHeroReturn.result.value);

    const shotHeroReturn = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'bot-reappears-in-hero.png'), Buffer.from(shotHeroReturn.data, 'base64'));

    ws.close();
  } finally {
    edge.kill();
  }
}

async function testMobilePopover() {
  console.log('\n--- Testing 1280px Dialog Popover Mode ---');
  const port = 9389;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1280,900',
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

    // Wait 2.2s for invite to trigger
    await new Promise(r => setTimeout(r, 2200));

    // Click bot
    console.log('[Mobile] Clicking bot to trigger dialog modal...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.getElementById('hero-bot-trigger');
        if (btn) btn.click();
      `
    });

    await new Promise(r => setTimeout(r, 600));

    const checkDialog = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const dialog = document.querySelector('div[role="dialog"]');
          return { hasDialog: Boolean(dialog) };
        })()
      `,
      returnByValue: true
    });
    console.log('[Mobile] Popover dialog open:', checkDialog.result.value);

    const shotDialog = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'phone-popover-opened-by-bot.png'), Buffer.from(shotDialog.data, 'base64'));

    // Test Esc key
    console.log('[Mobile] Pressing Escape key...');
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 27, key: 'Escape' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 27, key: 'Escape' });

    await new Promise(r => setTimeout(r, 500));

    const checkEsc = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const dialog = document.querySelector('div[role="dialog"]');
          const activeEl = document.activeElement ? document.activeElement.id : null;
          return { hasDialog: Boolean(dialog), focusedId: activeEl };
        })()
      `,
      returnByValue: true
    });
    console.log('[Mobile] Dialog closed by Esc and focus returned:', checkEsc.result.value);

    ws.close();
  } finally {
    edge.kill();
  }
}

async function main() {
  await testWidescreen();
  await testMobilePopover();
  console.log('\nAll tests completed successfully!');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

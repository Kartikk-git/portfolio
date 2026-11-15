import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function testClick(width) {
  console.log(`\n========================================`);
  console.log(`TESTING REAL MOUSE CLICK AT ${width}px`);
  console.log(`========================================`);

  const port = 9410 + (width % 100);
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},900`,
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

    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    
    // Wait 2.5s for initial bot animation to finish invite / peeking
    await new Promise((r) => setTimeout(r, 2500));

    // Get the exact bounding box of the bot on screen
    const botBox = await evalExpr(`
      (() => {
        const bot = document.getElementById('hero-bot-trigger');
        if (!bot) return null;
        const r = bot.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      })()
    `);
    console.log('Bot bounding box:', botBox);

    // Find the visible clickable point on screen (within viewport: x < width)
    const targetX = Math.min(width - 15, botBox.x + botBox.w / 2);
    const targetY = botBox.y + botBox.h / 2;
    console.log(`Target click coordinates: (${targetX}, ${targetY})`);

    const elementAtPoint = await evalExpr(`
      (() => {
        const el = document.elementFromPoint(${targetX}, ${targetY});
        return el ? { tagName: el.tagName, id: el.id, className: el.className } : null;
      })()
    `);
    console.log('Element at click point:', elementAtPoint);

    // Instrument click listener
    await evalExpr(`
      window.__clicks = [];
      window.addEventListener('click', (e) => {
        window.__clicks.push({
          targetTag: e.target.tagName,
          targetId: e.target.id,
          targetClass: e.target.className,
          isTrusted: e.isTrusted
        });
      }, true);
    `);

    // Dispatch real mouse move and click
    console.log('Dispatching mouse move...');
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: targetX,
      y: targetY,
    });
    await new Promise((r) => setTimeout(r, 100));

    console.log('Dispatching mouse down & up (click)...');
    await send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: targetX,
      y: targetY,
      button: 'left',
      clickCount: 1,
    });
    await send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: targetX,
      y: targetY,
      button: 'left',
      clickCount: 1,
    });

    await new Promise((r) => setTimeout(r, 600));

    // Check what happened after click
    const afterState = await evalExpr(`
      (() => {
        const bot = document.getElementById('hero-bot-trigger');
        const dialogBackdrop = document.querySelector('[role="dialog"][aria-label*="Phone"], [role="dialog"][aria-label*="phone"], .z-modal');
        const dialogFrame = document.getElementById('phone-mockup-dialog-frame');
        const gutterFrame = document.getElementById('phone-mockup-frame');
        
        return {
          clicksIntercepted: window.__clicks,
          botVisible: bot ? window.getComputedStyle(bot.parentElement.parentElement).display : 'no_bot',
          dialogBackdropExists: Boolean(dialogBackdrop),
          dialogBackdropDisplay: dialogBackdrop ? window.getComputedStyle(dialogBackdrop).display : null,
          dialogFrameExists: Boolean(dialogFrame),
          dialogFrameDisplay: dialogFrame ? window.getComputedStyle(dialogFrame).display : null,
          gutterFrameExists: Boolean(gutterFrame),
          gutterFrameDisplay: gutterFrame ? window.getComputedStyle(gutterFrame).display : null,
          activeElement: document.activeElement ? document.activeElement.tagName + '#' + document.activeElement.id : null
        };
      })()
    `);
    console.log('After Real Mouse Click State:', JSON.stringify(afterState, null, 2));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, `real-click-${width}px.png`), Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: real-click-${width}px.png`);

    console.log('Console logs:');
    consoleLogs.forEach((l) => console.log(`  [${l.type}] ${l.text}`));

    ws.close();
  } finally {
    edge.kill();
  }
}

async function run() {
  await testClick(1440);
  await testClick(1920);
}

run().catch(console.error);


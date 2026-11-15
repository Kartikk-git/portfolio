import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function testResponsive(width, height) {
  const port = 9620 + (width % 100);
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    'http://localhost:3000/#about',
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

    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await send('Page.navigate', { url: 'http://localhost:3000/#about' });
    await new Promise((r) => setTimeout(r, 1500));
    await send('Runtime.evaluate', { expression: `document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });` });
    await new Promise((r) => setTimeout(r, 800));

    // Apply the proposed styling
    const rect = await send('Runtime.evaluate', {
      expression: `(() => {
        const img = document.querySelector('img[src*="kartik-about"]');
        const innerFrame = img.parentElement;
        const outerCard = innerFrame.parentElement;
        
        // Responsive outer card
        outerCard.className = 'border border-[var(--rule)] rounded-[4px] bg-[var(--surface-subtle)] p-4 overflow-hidden flex flex-col items-center gap-3 w-full max-w-[360px] sm:max-w-[380px] lg:max-w-none mx-auto lg:mx-0';
        
        // Compact inner frame
        innerFrame.style.aspectRatio = '4 / 4.4';
        innerFrame.style.maxHeight = '360px';
        
        const r = innerFrame.getBoundingClientRect();
        return { width: r.width, height: r.height };
      })()`,
      returnByValue: true,
    });
    console.log(`${width}px image rect:`, rect.result?.value);

    await new Promise((r) => setTimeout(r, 300));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, `about-photo-responsive-${width}px.png`), Buffer.from(shot.data, 'base64'));
    console.log(`Saved about-photo-responsive-${width}px.png`);

    ws.close();
  } finally {
    edge.kill();
  }
}

async function run() {
  await testResponsive(1440, 900);
  await testResponsive(768, 1024);
  await testResponsive(375, 812);
}

run().catch(console.error);

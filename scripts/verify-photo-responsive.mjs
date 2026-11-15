import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function verifyPhotoCard(width, height) {
  const port = 9650 + (width % 50);
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
    await new Promise((r) => setTimeout(r, 1200));

    await send('Runtime.evaluate', {
      expression: `document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });`,
    });
    await new Promise((r) => setTimeout(r, 600));

    const metrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const img = document.querySelector('img[src*="kartik-about"]');
        if (!img) return null;
        const frame = img.parentElement;
        const card = frame.parentElement;
        const rImg = img.getBoundingClientRect();
        const rFrame = frame.getBoundingClientRect();
        const rCard = card.getBoundingClientRect();
        return {
          img: { w: Math.round(rImg.width), h: Math.round(rImg.height) },
          frame: { w: Math.round(rFrame.width), h: Math.round(rFrame.height) },
          card: { w: Math.round(rCard.width), h: Math.round(rCard.height) }
        };
      })()`,
      returnByValue: true,
    });

    console.log(`[${width}px] Photo Card Metrics:`, metrics.result?.value);

    // Capture card specific crop
    const cardRect = await send('Runtime.evaluate', {
      expression: `(() => {
        const img = document.querySelector('img[src*="kartik-about"]');
        const card = img?.parentElement?.parentElement;
        if (!card) return null;
        const r = card.getBoundingClientRect();
        return { x: r.x - 10, y: r.y - 10, width: r.width + 20, height: r.height + 20 };
      })()`,
      returnByValue: true,
    });

    const clip = cardRect.result?.value;
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clip ? { x: Math.max(0, clip.x), y: Math.max(0, clip.y), width: clip.width, height: clip.height, scale: 1 } : undefined,
    });
    fs.writeFileSync(path.join(artifactDir, `about-photo-${width}px.png`), Buffer.from(shot.data, 'base64'));

    ws.close();
  } finally {
    edge.kill();
  }
}

async function run() {
  await verifyPhotoCard(1440, 900);
  await verifyPhotoCard(1024, 768);
  await verifyPhotoCard(768, 1024);
  await verifyPhotoCard(375, 667);
}

run().catch(console.error);


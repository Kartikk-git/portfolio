import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function captureAboutSectionCrop(variantName, cardMaxW, frameMaxH) {
  const port = 9645;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
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
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: 'http://localhost:3000/#about' });
    await new Promise((r) => setTimeout(r, 1200));

    await send('Runtime.evaluate', {
      expression: `document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });`,
    });
    await new Promise((r) => setTimeout(r, 600));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const img = document.querySelector('img[src*="kartik-about"]');
        if (!img) return;
        const frame = img.parentElement;
        const card = frame.parentElement;
        if ('${cardMaxW}' === 'none') {
          card.style.maxWidth = '';
        } else {
          card.style.maxWidth = '${cardMaxW}';
        }
        frame.style.maxHeight = '${frameMaxH}';
      })()`,
    });
    await new Promise((r) => setTimeout(r, 400));

    // Get about section bounds
    const sectionBox = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('about');
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 900) };
      })()`,
      returnByValue: true,
    });
    const clip = sectionBox.result?.value;

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: clip ? { x: Math.max(0, clip.x), y: Math.max(0, clip.y), width: clip.width, height: clip.height, scale: 1 } : undefined,
    });
    fs.writeFileSync(path.join(artifactDir, `about-crop-${variantName}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`Saved about-crop-${variantName}.png`);

    ws.close();
  } finally {
    edge.kill();
  }
}

async function run() {
  await captureAboutSectionCrop('card340-frame320', '340px', '320px');
  await captureAboutSectionCrop('card330-frame310', '330px', '310px');
  await captureAboutSectionCrop('fullcol-frame310', 'none', '310px');
}

run().catch(console.error);


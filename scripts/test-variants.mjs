import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function testVariants() {
  const port = 9640;
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

    const variants = [
      { name: 'current_380', cardMaxW: 'none', frameMaxH: '380px' },
      { name: 'tasteful_320', cardMaxW: '340px', frameMaxH: '320px' },
      { name: 'tasteful_300', cardMaxW: '320px', frameMaxH: '300px' },
      { name: 'subtle_330', cardMaxW: 'none', frameMaxH: '320px' },
    ];

    for (const v of variants) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const img = document.querySelector('img[src*="kartik-about"]');
          if (!img) return;
          const frame = img.parentElement;
          const card = frame.parentElement;
          
          if ('${v.cardMaxW}' === 'none') {
            card.style.maxWidth = '';
          } else {
            card.style.maxWidth = '${v.cardMaxW}';
          }
          frame.style.maxHeight = '${v.frameMaxH}';
        })()`,
      });
      await new Promise((r) => setTimeout(r, 400));

      const rect = await send('Runtime.evaluate', {
        expression: `(() => {
          const img = document.querySelector('img[src*="kartik-about"]');
          const r = img ? img.getBoundingClientRect() : null;
          return r ? { w: Math.round(r.width), h: Math.round(r.height) } : null;
        })()`,
        returnByValue: true,
      });
      console.log(`Variant ${v.name}:`, rect.result?.value);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, `about-variant-${v.name}.png`), Buffer.from(shot.data, 'base64'));
    }

    ws.close();
  } finally {
    edge.kill();
  }
}

testVariants().catch(console.error);


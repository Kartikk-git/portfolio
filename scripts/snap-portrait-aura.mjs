import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9394',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9394/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
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

    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 350);` });
    await new Promise(r => setTimeout(r, 800));

    const box = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const img = document.querySelector('#hero img[src*="portrait"]');
          const rect = img.getBoundingClientRect();
          return {
            x: Math.round(rect.left + window.scrollX - 40),
            y: Math.round(rect.top + window.scrollY - 40),
            width: Math.round(rect.width + 80),
            height: Math.round(rect.height + 80),
            scale: 1
          };
        })()
      `,
      returnByValue: true
    });

    if (box.result.value) {
      const clipShot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: box.result.value,
        captureBeyondViewport: true
      });
      fs.writeFileSync(path.join(artifactDir, 'hero-portrait-green-aura-closeup.png'), Buffer.from(clipShot.data, 'base64'));
      console.log('Saved hero-portrait-green-aura-closeup.png with box:', box.result.value);
    }

    ws.close();
  } finally {
    edge.kill();
  }
}
run();

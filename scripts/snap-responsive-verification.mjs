import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'laptop-1024', width: 1024, height: 800, mobile: false },
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
];

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9299',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9299/json', (res) => {
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

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await new Promise(r => setTimeout(r, 800));

      // Check horizontal overflow
      const overflowResult = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            return { docWidth, winWidth, hasOverflow: docWidth > winWidth };
          })()
        `,
        returnByValue: true
      });

      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}):`, overflowResult.result.value);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `responsive-${vp.name}.png`;
      fs.writeFileSync(path.join(artifactDir, filename), Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${filename}`);
    }

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

run();

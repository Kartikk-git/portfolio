import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9311',
    '--window-size=1280,950',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9311/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page');
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

    await new Promise(r => setTimeout(r, 1500));

    // Scroll to activity section
    await send('Runtime.evaluate', {
      expression: 'document.querySelector("#activity")?.scrollIntoView({ behavior: "instant" });'
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click 3D View toggle button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('3D View') || b.textContent?.includes('3D Active'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture 3D Heatmap static view
    let res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/heatmap-3d-view.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved heatmap-3d-view.png');

    // Click "Replay my year" to watch 3D animation
    await send('Runtime.evaluate', {
      expression: `(() => {
        const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Replay my year') || b.textContent?.includes('Replay again'));
        if (playBtn) playBtn.click();
      })()`
    });

    // Wait 1.8 seconds so animation reaches middle months in 3D
    await new Promise(r => setTimeout(r, 1800));

    // Capture 3D Replay in progress
    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/heatmap-3d-replay-active.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved heatmap-3d-replay-active.png');

    ws.close();
  } finally {
    edge.kill();
  }
}

run().catch(console.error);


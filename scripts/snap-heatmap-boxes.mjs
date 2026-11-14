import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9345',
    '--window-size=1280,1050',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9345/json', (res) => {
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

    await new Promise(r => setTimeout(r, 1000));

    // Scroll to #activity
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('activity');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });

    await new Promise(r => setTimeout(r, 800));

    // 1. Capture Idle Straight 3D Box Heatmap
    const shotIdle = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'heatmap-3d-boxes-straight.png'), Buffer.from(shotIdle.data, 'base64'));
    console.log('Saved heatmap-3d-boxes-straight.png');

    // 2. Click Replay my year
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Replay my year'));
        if (btn) btn.click();
      `
    });

    // Wait 1.6s so the wave has traveled about halfway across the board (Week ~25)
    await new Promise(r => setTimeout(r, 1600));

    const shotWave = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'heatmap-3d-wave-active.png'), Buffer.from(shotWave.data, 'base64'));
    console.log('Saved heatmap-3d-wave-active.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

run();
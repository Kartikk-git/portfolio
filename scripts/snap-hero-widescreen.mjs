import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9246',
    '--window-size=1440,920',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9246/json', (res) => {
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

    // 1. Capture 1440px Widescreen Hero
    await new Promise(r => setTimeout(r, 1200));
    const shot1440 = await send('Page.captureScreenshot', { format: 'png' });
    const hero1440Path = path.join(artifactDir, 'hero-desktop-1440-balanced.png');
    fs.writeFileSync(hero1440Path, Buffer.from(shot1440.data, 'base64'));
    console.log('Saved hero-desktop-1440-balanced.png');

    // 2. Change viewport to 1280x850
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 850,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 800));
    const shot1280 = await send('Page.captureScreenshot', { format: 'png' });
    const hero1280Path = path.join(artifactDir, 'hero-desktop-1280-balanced.png');
    fs.writeFileSync(hero1280Path, Buffer.from(shot1280.data, 'base64'));
    console.log('Saved hero-desktop-1280-balanced.png');

    // 3. Scroll to Education & Certifications
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('education');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));
    const shotEdu = await send('Page.captureScreenshot', { format: 'png' });
    const eduPath = path.join(artifactDir, 'education-certificates-balanced.png');
    fs.writeFileSync(eduPath, Buffer.from(shotEdu.data, 'base64'));
    console.log('Saved education-certificates-balanced.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

run();

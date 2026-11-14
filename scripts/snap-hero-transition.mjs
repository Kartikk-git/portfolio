import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9288',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9288/json', (res) => {
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

    // Wait for initial render
    await new Promise(r => setTimeout(r, 1200));

    // Capture initial open: Big Kartik Koundal with circular borderless photo
    let res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/hero-open-initial.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved hero-open-initial.png');

    // Now scroll down a bit (95px)
    await send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 95, behavior: "instant" });'
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture after scrolling a bit: transition to header and scaled hero photo
    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/hero-scrolled-transition.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved hero-scrolled-transition.png');

    // Scroll further down (280px)
    await send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 280, behavior: "instant" });'
    });

    await new Promise(r => setTimeout(r, 600));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/hero-scrolled-further.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved hero-scrolled-further.png');

    ws.close();
  } finally {
    edge.kill();
  }
}

run().catch(console.error);

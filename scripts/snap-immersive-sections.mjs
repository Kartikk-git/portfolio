import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9299',
    '--window-size=1280,900',
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

    await new Promise(r => setTimeout(r, 1200));

    // 1. Initial screen: Hero only
    let res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/immersive-1-hero-only.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved immersive-1-hero-only.png');

    // 2. Scroll to Projects
    await send('Runtime.evaluate', {
      expression: 'document.querySelector("#projects")?.scrollIntoView({ behavior: "instant" });'
    });
    await new Promise(r => setTimeout(r, 800));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/immersive-2-projects-only.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved immersive-2-projects-only.png');

    // 3. Scroll to About
    await send('Runtime.evaluate', {
      expression: 'document.querySelector("#about")?.scrollIntoView({ behavior: "instant" });'
    });
    await new Promise(r => setTimeout(r, 800));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/immersive-3-about-only.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved immersive-3-about-only.png');

    // 4. Scroll to Skills
    await send('Runtime.evaluate', {
      expression: 'document.querySelector("#skills")?.scrollIntoView({ behavior: "instant" });'
    });
    await new Promise(r => setTimeout(r, 800));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/immersive-4-skills-only.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved immersive-4-skills-only.png');

    ws.close();
  } finally {
    edge.kill();
  }
}

run().catch(console.error);


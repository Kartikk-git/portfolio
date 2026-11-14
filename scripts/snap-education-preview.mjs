import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9250',
    '--window-size=1280,1000',
    'http://localhost:3000/#education'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9250/json', (res) => {
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

    await new Promise(r => setTimeout(r, 1200));

    // Scroll to #education
    await send('Runtime.evaluate', {
      expression: `document.getElementById('education')?.scrollIntoView({ behavior: 'instant', block: 'start' })`
    });

    await new Promise(r => setTimeout(r, 800));

    // Take snapshot of education section showing links
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/education-links-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved shots/education-links-verified.png');

    // Click Sem 1 Preview button
    await send('Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Sem 1 Preview'));
        if (btn) btn.click();
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/education-preview-modal-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved shots/education-preview-modal-verified.png');

    const artifactPath = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9\\education-preview-modal-verified.png';
    fs.copyFileSync('shots/education-preview-modal-verified.png', artifactPath);

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    edge.kill();
  }
}

run();

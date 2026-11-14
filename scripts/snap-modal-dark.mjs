import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9255',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9255/json', (res) => {
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

    // Wait a brief moment for load
    await new Promise(r => setTimeout(r, 1000));

    // Ensure dark theme is active and click the first project card
    await send('Runtime.evaluate', {
      expression: `
        document.documentElement.setAttribute('data-theme', 'dark');
        const firstCard = document.querySelector('[data-project-card="student-organizer"]');
        if (firstCard) firstCard.click();
      `
    });

    // Wait for modal animation
    await new Promise(r => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/modal-dark-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved shots/modal-dark-verified.png successfully!');
    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

run();

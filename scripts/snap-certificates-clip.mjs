import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9259',
    '--window-size=1280,1000',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9259/json', (res) => {
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

    // Scroll into view so whileInView triggers!
    await send('Runtime.evaluate', {
      expression: `
        const el = Array.from(document.querySelectorAll('h4')).find(h => h.textContent?.includes('Programming in Java'));
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      `
    });

    // Wait for whileInView animation
    await new Promise(r => setTimeout(r, 1000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = Array.from(document.querySelectorAll('h4')).find(h => h.textContent?.includes('Programming in Java'));
          if (!el) return null;
          const card = el.closest('.border') || el.parentElement;
          const rect = card.getBoundingClientRect();
          return { x: rect.x, y: rect.y + window.pageYOffset, width: rect.width, height: rect.height };
        })()
      `,
      returnByValue: true
    });

    console.log('Target rect:', evalRes.result?.value);
    const rect = evalRes.result?.value;

    if (rect) {
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: Math.max(0, rect.x - 30),
          y: Math.max(0, rect.y - 40),
          width: 1200,
          height: 850,
          scale: 1
        },
        captureBeyondViewport: true
      });
      fs.writeFileSync('shots/certificates-cards-exact.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved clipped screenshot shots/certificates-cards-exact.png');
      fs.copyFileSync('shots/certificates-cards-exact.png', 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9\\certificates-cards-exact.png');
    }

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    edge.kill();
  }
}

run();

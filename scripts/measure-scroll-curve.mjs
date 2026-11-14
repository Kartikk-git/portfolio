import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9390',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9390/json', (res) => {
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
    await send('Runtime.enable');

    for (const y of [0, 50, 100, 200, 300, 400, 500, 600]) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
      await new Promise(r => setTimeout(r, 300));
      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const titleDiv = document.querySelector('#hero h1').closest('.cursor-pointer');
            const profileDiv = document.querySelector('#hero > div > div:nth-child(2)');
            return {
              y: window.scrollY,
              titleOpacity: titleDiv ? window.getComputedStyle(titleDiv).opacity : null,
              profileOpacity: profileDiv ? window.getComputedStyle(profileDiv).opacity : null,
            };
          })()
        `,
        returnByValue: true
      });
      console.log(`Scroll ${y}:`, res.result.value);
    }

    ws.close();
  } finally {
    edge.kill();
  }
}
run();


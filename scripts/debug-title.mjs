import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9389',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9389/json', (res) => {
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

    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 350);` });
    await new Promise(r => setTimeout(r, 800));

    const debug = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const hero = document.getElementById('hero');
          const rect = hero.getBoundingClientRect();
          return {
            windowScrollY: window.scrollY,
            heroOffsetTop: hero.offsetTop,
            heroHeight: hero.offsetHeight,
            rectTop: rect.top,
            rectBottom: rect.bottom,
            viewportHeight: window.innerHeight,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Geometry:', JSON.stringify(debug.result.value, null, 2));
    ws.close();
  } finally {
    edge.kill();
  }
}
run();

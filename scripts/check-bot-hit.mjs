import http from 'http';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9445;

async function main() {
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'http://localhost:3000',
  ]);
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve) => {
      http.get(`http://127.0.0.1:${port}/json`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      });
    });

    const page = list.find((t) => t.type === 'page' && t.url.includes('localhost:3000'));
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
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

    await new Promise((r) => (ws.onopen = r));
    await send('Page.enable');
    await send('Runtime.enable');

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    // Wait 3s so bot enters "inviting" or "peeking"
    await new Promise((r) => setTimeout(r, 3000));

    const result = await evalExpr(`
      (() => {
        const btn = document.getElementById('hero-bot-trigger');
        if (!btn) return { error: 'No button' };
        const r = btn.getBoundingClientRect();
        const centerX = r.x + r.width / 2;
        const centerY = r.y + r.height / 2;
        const elAtCenter = document.elementFromPoint(centerX, centerY);

        return {
          btnRect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          center: { x: Math.round(centerX), y: Math.round(centerY) },
          elAtCenter: elAtCenter ? {
            tag: elAtCenter.tagName,
            id: elAtCenter.id,
            class: elAtCenter.className
          } : null
        };
      })()
    `);

    console.log(JSON.stringify(result, null, 2));

    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);

import http from 'http';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9425;

async function main() {
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1920,900',
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

    // Check at t=0, t=1s, t=2s
    for (const t of [500, 1500, 2500]) {
      await new Promise((r) => setTimeout(r, 1000));
      const status = await evalExpr(`
        (() => {
          const hero = document.getElementById('hero');
          const bot = document.getElementById('hero-bot-trigger');
          return {
            t: ${t},
            heroFound: Boolean(hero),
            heroRect: hero ? hero.getBoundingClientRect() : null,
            botFound: Boolean(bot),
            botRect: bot ? bot.getBoundingClientRect() : null,
            scrollY: window.scrollY
          };
        })()
      `);
      console.log(`Status at t=${t}ms:`, JSON.stringify(status, null, 2));
    }

    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);


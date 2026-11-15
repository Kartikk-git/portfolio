import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function main() {
  const port = 9399;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'http://localhost:3000',
  ]);
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/json`, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(JSON.parse(data)));
        })
        .on('error', reject);
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

    const consoleLogs = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
      }
    });

    // Click Logcat button to open command palette
    const clickRes = await evalExpr(`
      (() => {
        const btn = document.querySelector('button[aria-label*="Logcat"]');
        if (btn) { btn.click(); return 'clicked'; }
        return 'not found';
      })()
    `);
    console.log('Logcat button click:', clickRes);
    await new Promise((r) => setTimeout(r, 600));

    // Check DOM structure and z-index of palette, overlay, hero, etc.
    const info = await evalExpr(`
      (() => {
        const overlay = document.querySelector('.z-palette');
        const dialog = document.querySelector('[role="dialog"][aria-label="Command palette"]');
        const hero = document.getElementById('hero');
        const header = document.querySelector('header');
        
        const getStyles = (el) => {
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          return {
            zIndex: cs.zIndex,
            position: cs.position,
            backgroundColor: cs.backgroundColor,
            opacity: cs.opacity,
            transform: cs.transform,
            backdropFilter: cs.backdropFilter
          };
        };
        
        return {
          header: getStyles(header),
          overlay: getStyles(overlay),
          dialog: getStyles(dialog),
          hero: getStyles(hero),
          overlayParent: overlay ? overlay.parentElement.tagName : null,
          overlayParentClass: overlay ? overlay.parentElement.className : null
        };
      })()
    `);
    console.log('Computed styles info:', JSON.stringify(info, null, 2));
    console.log('Console logs during open:', consoleLogs);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'debug-palette-open.png'), Buffer.from(shot.data, 'base64'));
    console.log('Screenshot written to debug-palette-open.png');

    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);


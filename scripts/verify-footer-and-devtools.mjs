import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9237',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9237/json', res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    const logs = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        logs.push({ type: msg.params.type, text });
      }
    };

    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const curId = id++;
      const listener = (event) => {
        const m = JSON.parse(event.data);
        if (m.id === curId) {
          ws.removeEventListener('message', listener);
          res(m.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000' });

    await new Promise(r => setTimeout(r, 1500));

    // Check footer hint text
    const footerText = await send('Runtime.evaluate', {
      expression: 'document.querySelector("footer").innerText',
      returnByValue: true
    });
    console.log('Footer text:\n', footerText.result.value);

    // Check spoiler tooltips
    const tooltips = await send('Runtime.evaluate', {
      expression: `({
        themeTitle: document.querySelector('header button[title*="psst"], header button[aria-label*="theme"]')?.getAttribute('title'),
        nameTitle: document.querySelector('header a[title*="psst"]')?.getAttribute('title'),
        logcatTitle: document.querySelector('header button[title*="psst"]')?.getAttribute('title'),
      })`,
      returnByValue: true
    });
    console.log('Tooltips:\n', tooltips.result.value);

    // Check console logs
    console.log('Captured DevTools Console logs:');
    logs.forEach(l => console.log(`[${l.type}]`, l.text.slice(0, 100)));

  } finally {
    edge.kill();
  }
}

run().catch(console.error);


import http from 'http';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function verifyEasterEgg() {
  const port = 9662;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'http://localhost:3000/',
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
    if (!page) throw new Error('No page found');

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

    // 1. Trigger palette via shortcut Ctrl+K
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      modifiers: 2, // Ctrl
      windowsVirtualKeyCode: 75,
      key: 'k',
      code: 'KeyK',
    });
    await new Promise((r) => setTimeout(r, 400));

    // 2. Type "easter"
    for (const char of 'easter') {
      await send('Input.dispatchKeyEvent', { type: 'char', text: char });
    }
    await new Promise((r) => setTimeout(r, 300));

    // 3. Press Enter to execute the top matching command
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      windowsVirtualKeyCode: 13,
      key: 'Enter',
      code: 'Enter',
    });
    await new Promise((r) => setTimeout(r, 600));

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const statuses = Array.from(document.querySelectorAll('[role="status"]')).map(el => el.textContent);
        const rootAccent = document.documentElement.style.getPropertyValue('--accent');
        const paletteOpen = !!document.querySelector('[role="combobox"]');
        return { statuses, rootAccent, paletteOpen };
      })()`,
      returnByValue: true,
    });

    console.log('Easter Egg Verification Result:', result.result?.value);
    ws.close();
  } finally {
    edge.kill();
  }
}

verifyEasterEgg().catch(console.error);

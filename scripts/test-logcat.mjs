import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9223/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
  if (!page) {
    console.error('Page target not found');
    edge.kill();
    return;
  }

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

  await new Promise((r) => ws.onopen = r);

  await send('Page.enable');
  await send('Runtime.enable');

  // Trigger Ctrl+K keypress or click Logcat button
  console.log('Clicking Logcat button...');
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logcat'));
      if (btn) btn.click();
    `
  });

  await new Promise(r => setTimeout(r, 600));

  // Type sudo make-coffee using CDP Input.insertText
  console.log('Typing and executing sudo make-coffee...');
  await send('Input.insertText', { text: 'sudo make-coffee' });
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });

  await new Promise(r => setTimeout(r, 900));

  // Type easter-egg using CDP Input.insertText
  console.log('Typing and executing easter-egg...');
  await send('Input.insertText', { text: 'easter-egg' });
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });

  await new Promise(r => setTimeout(r, 900));

  // Capture screenshot of Logcat in action
  const { data: b64 } = await send('Page.captureScreenshot', { format: 'png' });
  if (!fs.existsSync('shots')) fs.mkdirSync('shots');
  fs.writeFileSync('shots/logcat-interactive.png', Buffer.from(b64, 'base64'));
  console.log('Saved screenshot to shots/logcat-interactive.png!');

  // Check log text contents
  const res = await send('Runtime.evaluate', {
    expression: `document.querySelector('[role="dialog"]')?.innerText || 'Not found'`
  });
  console.log('Logcat Dialog text preview:\n', res.result?.value?.slice(0, 300));

  ws.close();
  edge.kill();
}

run().catch(console.error);

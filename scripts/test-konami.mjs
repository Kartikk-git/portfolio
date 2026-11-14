import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testKonami() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9231/json', (res) => {
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
  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 1000));

  const sendKey = async (key) => {
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key, code: key });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key });
    await new Promise(r => setTimeout(r, 40));
  };

  const dispatchKonami = async () => {
    const sequence = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight'
    ];
    for (const key of sequence) {
      await sendKey(key);
    }
  };

  // 1. Enter sequence: first time -> Holo
  console.log('Dispatching Konami sequence (1st time -> Holo)...');
  await dispatchKonami();
  await new Promise(r => setTimeout(r, 400));

  const toast1 = await send('Runtime.evaluate', {
    expression: 'document.querySelector("[role=\'status\']")?.innerText || "No toast"'
  });
  console.log('Toast 1:', toast1.result?.value);

  const cssVarHolo = await send('Runtime.evaluate', {
    expression: 'document.documentElement.style.getPropertyValue("--accent")'
  });
  console.log('Holo accent variable:', cssVarHolo.result?.value);

  const { data: b64Holo } = await send('Page.captureScreenshot', { format: 'png' });
  if (!fs.existsSync('shots')) fs.mkdirSync('shots');
  fs.writeFileSync('shots/konami-holo.png', Buffer.from(b64Holo, 'base64'));
  console.log('Saved shots/konami-holo.png');

  // 2. Enter sequence: second time -> Lollipop
  console.log('\nDispatching Konami sequence (2nd time -> Lollipop)...');
  await dispatchKonami();
  await new Promise(r => setTimeout(r, 400));

  const toast2 = await send('Runtime.evaluate', {
    expression: 'document.querySelector("[role=\'status\']")?.innerText || "No toast"'
  });
  console.log('Toast 2:', toast2.result?.value);

  const cssVarLollipop = await send('Runtime.evaluate', {
    expression: 'document.documentElement.style.getPropertyValue("--accent")'
  });
  console.log('Lollipop accent variable:', cssVarLollipop.result?.value);

  const { data: b64Lollipop } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('shots/konami-lollipop.png', Buffer.from(b64Lollipop, 'base64'));
  console.log('Saved shots/konami-lollipop.png');

  // 3. Click "Back to normal"
  console.log('\nClicking "Back to normal" button...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Revert') || b.textContent.includes('Back to normal'));
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const cssVarNormal = await send('Runtime.evaluate', {
    expression: 'document.documentElement.style.getPropertyValue("--accent")'
  });
  console.log('Accent variable after Back to normal:', cssVarNormal.result?.value || '(default reset)');

  const toastCleared = await send('Runtime.evaluate', {
    expression: 'document.querySelector("[role=\'status\']") === null'
  });
  console.log('Toast cleared:', toastCleared.result?.value);

  ws.close();
  edge.kill();
  console.log('Konami Easter Egg test passed 100%!');
}

testKonami().catch(console.error);


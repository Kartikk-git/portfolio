import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9230/json', (res) => {
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

  // Check default theme
  const initialTheme = await send('Runtime.evaluate', {
    expression: 'document.documentElement.getAttribute("data-theme")'
  });
  console.log('Initial default theme:', initialTheme.result?.value);

  // Rapid tap 5 times starting from dark (ends on light) -> triggers Flashbang
  console.log('Rapid clicking theme toggle 5 times (ends on light)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('header button')).find(b => {
          const l = b.getAttribute('aria-label') || '';
          return l.includes('theme') || l.includes('Switch');
        });
        if (btn) {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => btn.click(), i * 150);
          }
        }
      })()
    `
  });

  // Wait 1.1s for 5 taps to complete and ultra mode to trigger
  await new Promise(r => setTimeout(r, 1200));

  const ultraLightState = await send('Runtime.evaluate', {
    expression: `({
      isFlashbang: document.documentElement.classList.contains('ultra-flashbang'),
      hasShake: document.body.classList.contains('shake-my-eyes'),
      toast: document.querySelector('[role="status"]')?.innerText || 'No toast'
    })`,
    returnByValue: true
  });
  console.log('Ultra Light / Flashbang result:', ultraLightState.result?.value);

  const { data: b64Flashbang } = await send('Page.captureScreenshot', { format: 'png' });
  if (!fs.existsSync('shots')) fs.mkdirSync('shots');
  fs.writeFileSync('shots/ultra-flashbang.png', Buffer.from(b64Flashbang, 'base64'));
  console.log('Saved shots/ultra-flashbang.png');

  // Wait 4 seconds for ease back
  console.log('Waiting 4s for ease back to normal...');
  await new Promise(r => setTimeout(r, 4000));

  const easedState = await send('Runtime.evaluate', {
    expression: `({
      isFlashbang: document.documentElement.classList.contains('ultra-flashbang'),
      toast: document.querySelector('[role="status"]')?.innerText || null
    })`,
    returnByValue: true
  });
  console.log('Eased back state:', easedState.result?.value);

  // Now rapid tap 5 times starting from light (ends on dark) -> triggers AMOLED
  console.log('Rapid clicking 5 times (ends on dark)...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('header button')).find(b => {
          const l = b.getAttribute('aria-label') || '';
          return l.includes('theme') || l.includes('Switch');
        });
        if (btn) {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => btn.click(), i * 150);
          }
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const ultraDarkState = await send('Runtime.evaluate', {
    expression: `({
      isAmoled: document.documentElement.classList.contains('ultra-amoled'),
      toast: document.querySelector('[role="status"]')?.innerText || 'No toast'
    })`,
    returnByValue: true
  });
  console.log('Ultra Dark / AMOLED result:', ultraDarkState.result?.value);

  const { data: b64Amoled } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('shots/ultra-amoled.png', Buffer.from(b64Amoled, 'base64'));
  console.log('Saved shots/ultra-amoled.png');

  ws.close();
  edge.kill();
  console.log('Test completed successfully!');
}

run().catch(console.error);

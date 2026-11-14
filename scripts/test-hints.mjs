import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testHints() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9232/json', (res) => {
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

  const consoleLogs = [];
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const texts = msg.params.args.map(a => a.value).filter(Boolean);
      consoleLogs.push(texts.join(' '));
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 1000));

  console.log('--- DevTools Console Messages captured ---');
  consoleLogs.forEach(l => console.log('LOG:', l));

  // Verify theme toggle hover title
  const themeBtnTitle = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('header button')).find(b => {
          const l = b.getAttribute('aria-label') || '';
          return l.includes('theme') || l.includes('Switch');
        });
        return btn?.getAttribute('title') || 'None';
      })()
    `
  });
  console.log('Theme toggle title:', themeBtnTitle.result?.value);

  // Verify footer hint
  const footerHint = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const span = Array.from(document.querySelectorAll('footer span')).find(s => s.innerText.startsWith('//'));
        return span?.innerText || 'No footer hint';
      })()
    `
  });
  console.log('Footer rotating hint line:', footerHint.result?.value);

  // Verify Secrets progress tracker badge
  const badgeText = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Secrets:'));
        return btn?.innerText || 'No badge';
      })()
    `
  });
  console.log('Corner Badge text:', badgeText.result?.value);

  // Click corner badge to open progressive hint panel
  console.log('Clicking Secrets badge to open hints panel...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Secrets:'));
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 400));

  const panelText = await send('Runtime.evaluate', {
    expression: `document.querySelector('[aria-label="Secrets tracker and hint panel"]')?.innerText || 'Panel not found'`
  });
  console.log('Secrets Hint Panel preview:\n', panelText.result?.value?.slice(0, 300));

  const { data: b64Panel } = await send('Page.captureScreenshot', { format: 'png' });
  if (!fs.existsSync('shots')) fs.mkdirSync('shots');
  fs.writeFileSync('shots/secrets-hints-panel.png', Buffer.from(b64Panel, 'base64'));
  console.log('Saved shots/secrets-hints-panel.png');

  ws.close();
  edge.kill();
  console.log('Hints test completed successfully!');
}

testHints().catch(console.error);


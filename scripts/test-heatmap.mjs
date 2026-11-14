import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--window-size=1280,950',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9224/json', (res) => {
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

  // Scroll to #activity
  console.log('Scrolling to #activity...');
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('activity');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });

  await new Promise(r => setTimeout(r, 500));

  // Hover over an active day square
  console.log('Hovering over active contribution square...');
  await send('Runtime.evaluate', {
    expression: `
      const squares = document.querySelectorAll('#activity [tabindex="0"]');
      const activeSquare = Array.from(squares).find(s => !s.className.includes('bg-[var(--rule)]') && !s.className.includes('bg-[var(--surface)]'));
      if (activeSquare) {
        activeSquare.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      }
    `
  });

  await new Promise(r => setTimeout(r, 400));

  // Capture screenshot of tooltip
  const { data: b64Tooltip } = await send('Page.captureScreenshot', { format: 'png' });
  if (!fs.existsSync('shots')) fs.mkdirSync('shots');
  fs.writeFileSync('shots/heatmap-tooltip.png', Buffer.from(b64Tooltip, 'base64'));
  console.log('Saved shots/heatmap-tooltip.png');

  // Click Replay My Year
  console.log('Clicking Replay my year...');
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('#activity button')).find(b => b.textContent.includes('Replay my year'));
      if (btn) btn.click();
    `
  });

  // Wait 1.8 seconds (midway through replay)
  await new Promise(r => setTimeout(r, 1800));

  // Capture screenshot of replay mid-animation
  const { data: b64Replay } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('shots/heatmap-replay-mid.png', Buffer.from(b64Replay, 'base64'));
  console.log('Saved shots/heatmap-replay-mid.png');

  // Switch to LeetCode view
  console.log('Switching to LeetCode view...');
  await send('Runtime.evaluate', {
    expression: `
      const lcBtn = Array.from(document.querySelectorAll('#activity button')).find(b => b.textContent.includes('LeetCode'));
      if (lcBtn) lcBtn.click();
    `
  });

  await new Promise(r => setTimeout(r, 600));

  // Capture screenshot of LeetCode view
  const { data: b64Leetcode } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('shots/heatmap-leetcode-view.png', Buffer.from(b64Leetcode, 'base64'));
  console.log('Saved shots/heatmap-leetcode-view.png');

  ws.close();
  edge.kill();
  console.log('All tests completed successfully!');
}

run().catch(console.error);


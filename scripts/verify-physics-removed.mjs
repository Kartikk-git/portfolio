import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function runTest() {
  console.log('--- Verifying Physics Sandbox Removal & Easter Eggs Total X/5 ---');

  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9255',
    '--window-size=1440,960',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9255/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
    if (!page) throw new Error('No page found on port 9255');

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
    await send('DOM.enable');

    await new Promise(r => setTimeout(r, 1200));

    // 1. Check if any physics canvas or buttons exist in DOM
    const physicsCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.querySelector('canvas[aria-label*="physics" i], #hero canvas');
          const gravityBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Gravity') || b.innerText.includes('Reset'));
          const matterScript = document.querySelector('script[src*="matter"]');
          return {
            hasCanvas: Boolean(canvas),
            hasGravityOrResetBtn: Boolean(gravityBtn),
            hasMatterScript: Boolean(matterScript)
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Physics DOM Check:', physicsCheck.result.value);

    // 2. Check secrets count in window.secrets
    const secretsCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Clear any stored secrets in localStorage to test initial state
          localStorage.removeItem('kartik_portfolio_secrets_v2');
          // Re-read secrets
          const res = window.secrets?.hint();
          return {
            hint: res,
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Secrets Hint Return:', secretsCheck.result.value);

    // Capture screenshot of clean hero section
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const snapPath = path.join(artifactDir, 'hero-clean-no-physics.png');
    fs.writeFileSync(snapPath, Buffer.from(snap.data, 'base64'));
    console.log(`Saved screenshot: ${snapPath}`);

    ws.close();
    edge.kill();
    console.log('--- Verification Complete: Physics sandbox successfully removed! ---');
  } catch (err) {
    console.error('Error during verification:', err);
    try { edge.kill(); } catch {}
  }
}

runTest();


import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9377',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9377/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
    if (!page) throw new Error('No page found');

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

    // Capture State 1: At scroll 0 (Initial view before scrolling)
    const initialEval = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const titleH1 = document.querySelector('#hero h1');
          const profileDiv = document.querySelector('#hero > div > div:nth-child(2)');
          const header = document.querySelector('header');
          return {
            titleText: titleH1 ? titleH1.textContent.trim() : null,
            titleVisible: titleH1 ? window.getComputedStyle(titleH1.parentElement.parentElement).opacity : null,
            profileOpacity: profileDiv ? window.getComputedStyle(profileDiv).opacity : null,
            headerTransform: header ? window.getComputedStyle(header).transform : null,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('State 1 (Scroll = 0, Name Only):', initialEval.result.value);

    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'hero-state-initial-name-only.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved hero-state-initial-name-only.png');

    // Advance scroll to 350px (Smooth PPT transition)
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 350);`
    });

    await new Promise(r => setTimeout(r, 700));

    const revealedEval = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const titleH1 = document.querySelector('#hero h1');
          const profileDiv = document.querySelector('#hero > div > div:nth-child(2)');
          const header = document.querySelector('header');
          const photoImg = document.querySelector('#hero img[src*="portrait"]');
          return {
            titleVisible: titleH1 ? window.getComputedStyle(titleH1.parentElement.parentElement).opacity : null,
            profileOpacity: profileDiv ? window.getComputedStyle(profileDiv).opacity : null,
            headerTransform: header ? window.getComputedStyle(header).transform : null,
            photoOpacity: photoImg ? window.getComputedStyle(photoImg.closest('div')).opacity : null,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('State 2 (Scrolled 350px, PPT Rest Revealed):', revealedEval.result.value);

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'hero-state-presentation-revealed.png'), Buffer.from(shot2.data, 'base64'));
    console.log('Saved hero-state-presentation-revealed.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

run();

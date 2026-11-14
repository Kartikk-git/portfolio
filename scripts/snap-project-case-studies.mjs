import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9277',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9277/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page');
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

    // Wait for hydration
    await new Promise(r => setTimeout(r, 1500));

    // Open MPLAD modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[data-project-card="mplad"]');
        if (card) {
          card.click();
          return 'clicked mplad';
        }
        return 'card not found';
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));

    // Screenshot MPLAD modal at top
    let res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/modal-mplad-top.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved modal-mplad-top.png');

    // Scroll modal container down
    await send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const scrollContainer = dialog ? dialog.querySelector('.overflow-y-auto') : null;
        if (scrollContainer) {
          scrollContainer.scrollTop = 500;
          return 'scrolled ' + scrollContainer.scrollTop + ' of ' + scrollContainer.scrollHeight;
        }
        return 'container not found';
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Screenshot MPLAD modal scrolled
    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/modal-mplad-scrolled.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved modal-mplad-scrolled.png');

    // Now test Hospital Management modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const closeBtn = document.querySelector('button[aria-label*="Close"]');
        if (closeBtn) closeBtn.click();
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[data-project-card="hospital-management"]');
        if (card) {
          card.click();
          return 'clicked hospital';
        }
        return 'card not found';
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));

    // Screenshot Hospital Management modal
    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/modal-hospital-top.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved modal-hospital-top.png');

    // Scroll Hospital Management modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const scrollContainer = dialog ? dialog.querySelector('.overflow-y-auto') : null;
        if (scrollContainer) {
          scrollContainer.scrollTop = 450;
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/modal-hospital-scrolled.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved modal-hospital-scrolled.png');

    // Now navigate directly to standalone case study /projects/mplad
    await send('Page.navigate', { url: 'http://localhost:3000/projects/mplad' });
    await new Promise(r => setTimeout(r, 2000));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/casestudy-mplad.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved casestudy-mplad.png');

    // Navigate to standalone case study /projects/hospital-management
    await send('Page.navigate', { url: 'http://localhost:3000/projects/hospital-management' });
    await new Promise(r => setTimeout(r, 2000));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/casestudy-hospital.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved casestudy-hospital.png');

    // Navigate to standalone case study /projects/portfolio-v1
    await send('Page.navigate', { url: 'http://localhost:3000/projects/portfolio-v1' });
    await new Promise(r => setTimeout(r, 2000));

    res = await send('Page.captureScreenshot');
    fs.writeFileSync(`${artifactDir}/casestudy-portfolio-v1.png`, Buffer.from(res.data, 'base64'));
    console.log('Saved casestudy-portfolio-v1.png');

    ws.close();
  } finally {
    edge.kill();
  }
}

run().catch(console.error);

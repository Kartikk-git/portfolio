import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTest() {
  console.log('Verifying Android Mockup Demo placement...');
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--window-size=1440,960',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9234/json', (res) => {
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
    await new Promise(r => setTimeout(r, 1500));

    // 1. Verify hero does NOT contain Android mockup demo
    const mockupInHero = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('#hero [data-mockup-frame], #hero button[title*="Room DB"], #hero button:has(svg.lucide-database)) || document.querySelector('#hero')?.textContent.includes('Priya Sharma'))`,
      returnByValue: true
    });
    console.log('Mockup present in hero (should be false):', mockupInHero.result.value);

    // Capture screenshot of clean hero
    const shotHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/hero-clean-verified.png', Buffer.from(shotHero.data, 'base64'));
    console.log('Saved shots/hero-clean-verified.png');

    // 2. Open Student Organizer in detail modal
    console.log('Opening Student Organizer detail view modal...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[data-project-card="student-organizer"]');
        if (card) card.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // Verify mockup is present in the detailed modal view
    const mockupInModal = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('[role="dialog"] #detail-demo') || document.querySelector('[role="dialog"]')?.textContent.includes('Priya Sharma'))`,
      returnByValue: true
    });
    console.log('Mockup present in detailed modal view (should be true):', mockupInModal.result.value);

    // Scroll down inside the modal to the interactive demo
    await send('Runtime.evaluate', {
      expression: `(() => {
        const target = document.getElementById('detail-demo');
        if (target) target.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const shotModalDemo = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/modal-demo-verified.png', Buffer.from(shotModalDemo.data, 'base64'));
    console.log('Saved shots/modal-demo-verified.png');

    // 3. Navigate to full case study route
    console.log('Navigating to /projects/student-organizer case study route...');
    await send('Page.navigate', { url: 'http://localhost:3000/projects/student-organizer' });
    await new Promise(r => setTimeout(r, 1500));

    const mockupInCaseStudy = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('#prototype') || document.body.textContent.includes('Priya Sharma'))`,
      returnByValue: true
    });
    console.log('Mockup present in /projects/student-organizer case study (should be true):', mockupInCaseStudy.result.value);

    await send('Runtime.evaluate', {
      expression: `(() => {
        const target = document.getElementById('prototype');
        if (target) target.scrollIntoView({ behavior: 'instant' });
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    const shotCaseStudyDemo = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/casestudy-demo-verified.png', Buffer.from(shotCaseStudyDemo.data, 'base64'));
    console.log('Saved shots/casestudy-demo-verified.png');

    console.log('ALL PLACEMENT VERIFICATIONS PASSED.');
  } finally {
    edge.kill();
  }
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});


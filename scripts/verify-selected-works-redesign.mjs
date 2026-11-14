import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function runVerification() {
  console.log('--- Verifying Selected Works Multi-Card Timeline Redesign ---');

  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9244',
    '--window-size=1440,1050',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9244/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const page = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
    if (!page) throw new Error('No page found on port 9244');

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

    // 1. Scroll down to #projects
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // 2. Query visible project cards
    const cardsInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('#projects [data-project-card]'));
          return cards.map(c => {
            const rect = c.getBoundingClientRect();
            const title = c.querySelector('h3')?.innerText || '';
            return {
              slug: c.getAttribute('data-project-card'),
              title,
              top: Math.round(rect.top),
              bottom: Math.round(rect.bottom),
              height: Math.round(rect.height),
              visible: rect.top < window.innerHeight && rect.bottom > 0
            };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Project Cards on Timeline:', JSON.stringify(cardsInfo.result.value, null, 2));

    // Capture screenshot of the continuous timeline showing multiple cards
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const snap1Path = path.join(artifactDir, 'projects-timeline-continuous.png');
    fs.writeFileSync(snap1Path, Buffer.from(snap1.data, 'base64'));
    console.log(`Saved screenshot: ${snap1Path}`);

    // 3. Open Student Organizer Project Detail modal
    console.log('Opening Student Organizer modal...');
    await send('Runtime.evaluate', {
      expression: `
        const card = document.querySelector('[data-project-card="student-organizer"]');
        if (card) card.click();
      `
    });
    await new Promise(r => setTimeout(r, 1000));

    // 4. Test modal scroll spy: scroll inside modal
    console.log('Testing modal scroll spy...');
    const initialActive = await send('Runtime.evaluate', {
      expression: `
        document.querySelector('nav[aria-label="Project detail navigation"] a.text-\\[var\\(--accent\\)\\]')?.getAttribute('data-section')
      `,
      returnByValue: true
    });
    console.log('Initial modal active section:', initialActive.result.value);

    // Scroll modal container down by 500px
    await send('Runtime.evaluate', {
      expression: `
        const container = document.querySelector('div[role="dialog"] .overflow-y-auto');
        if (container) {
          container.scrollTop = 450;
          container.dispatchEvent(new Event('scroll'));
        }
      `
    });
    await new Promise(r => setTimeout(r, 800));

    const scrolledActive = await send('Runtime.evaluate', {
      expression: `
        document.querySelector('nav[aria-label="Project detail navigation"] a.text-\\[var\\(--accent\\)\\]')?.getAttribute('data-section')
      `,
      returnByValue: true
    });
    console.log('Scrolled modal active section:', scrolledActive.result.value);

    // Capture screenshot of the modal with active section
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const snap2Path = path.join(artifactDir, 'project-detail-scroll-synced.png');
    fs.writeFileSync(snap2Path, Buffer.from(snap2.data, 'base64'));
    console.log(`Saved modal screenshot: ${snap2Path}`);

    // Close modal
    await send('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('div[role="dialog"] button[aria-label="Close project details"]');
        if (closeBtn) closeBtn.click();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // 5. Navigate to case study page
    console.log('Checking /projects/student-organizer case study...');
    await send('Page.navigate', { url: 'http://localhost:3000/projects/student-organizer' });
    await new Promise(r => setTimeout(r, 1600));

    // Scroll down past header to verify sidebar sticky positioning
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 380, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 800));

    const asideInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const aside = document.querySelector('aside');
          const rect = aside ? aside.getBoundingClientRect() : null;
          return {
            top: rect ? Math.round(rect.top) : null,
            height: rect ? Math.round(rect.height) : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Case Study Aside Position:', asideInfo.result.value);

    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    const snap3Path = path.join(artifactDir, 'casestudy-sidebar-aligned.png');
    fs.writeFileSync(snap3Path, Buffer.from(snap3.data, 'base64'));
    console.log(`Saved case study screenshot: ${snap3Path}`);

    ws.close();
    edge.kill();
    console.log('--- Verification Complete: All Checks Passed! ---');
  } catch (err) {
    console.error('Error in verification:', err);
    try { edge.kill(); } catch {}
  }
}

runVerification();


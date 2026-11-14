import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTest() {
  console.log('Launching headless Edge for Projects GSAP timeline audit...');
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--window-size=1440,960',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9232/json', (res) => {
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

    // Evaluate GSAP presence
    const gsapCheck = await send('Runtime.evaluate', {
      expression: 'Boolean(window.gsap && window.ScrollTrigger)',
      returnByValue: true
    });
    console.log('GSAP & ScrollTrigger loaded in window:', gsapCheck.result.value);

    // Get section scroll offset
    const sectionInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('projects');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { top: window.scrollY + rect.top, height: rect.height };
      })()`,
      returnByValue: true
    });
    console.log('Projects section info:', sectionInfo.result.value);

    const projectsTop = sectionInfo.result.value.top;

    // Scroll to start of projects section
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${projectsTop}, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture screenshot at start
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/projects-journey-start.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved shots/projects-journey-start.png');

    // Scroll further down into the pinned timeline (milestone 3 / TEJOVIK)
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${projectsTop + 1400}, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 800));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/projects-journey-mid.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved shots/projects-journey-mid.png');

    // Scroll to milestone 5 (Student Organizer - should trigger BUILD SUCCESSFUL)
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${projectsTop + 3000}, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 1000));

    const buildStatus = await send('Runtime.evaluate', {
      expression: `(() => {
        const buildBadge = document.querySelector('[data-build-successful="true"]');
        return Boolean(buildBadge);
      })()`,
      returnByValue: true
    });
    console.log('BUILD SUCCESSFUL badge triggered:', buildStatus.result.value);

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/projects-journey-student-organizer.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved shots/projects-journey-student-organizer.png');

    // Test clicking on the active project card to verify modal opens
    await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[data-project-card="student-organizer"]');
        if (card) card.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const modalOpen = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('[role="dialog"][aria-label="Student Organizer"]'))`,
      returnByValue: true
    });
    console.log('Project detail modal opened via card click:', modalOpen.result.value);

    const shotModal = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/projects-journey-modal-open.png', Buffer.from(shotModal.data, 'base64'));
    console.log('Saved shots/projects-journey-modal-open.png');

    // Close modal via Escape
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    await new Promise(r => setTimeout(r, 400));

    // Test mobile viewport (width: 375, height: 812)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new Event('resize'));`
    });
    await new Promise(r => setTimeout(r, 800));

    // Scroll to projects on mobile
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/projects-journey-mobile.png', Buffer.from(shotMobile.data, 'base64'));
    console.log('Saved shots/projects-journey-mobile.png');

    console.log('ALL PROJECTS JOURNEY AUDITS COMPLETED SUCCESSFULLY.');
  } finally {
    edge.kill();
  }
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});


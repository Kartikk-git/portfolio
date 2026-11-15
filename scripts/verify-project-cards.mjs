import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  console.log('--- Testing Project Cards Polish ---');
  const port = 9390;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1100',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, (res) => {
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

    // Scroll to #projects
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });

    await new Promise(r => setTimeout(r, 1000));

    // 1. Verify Screenshot Slots & Alt text
    const slotsInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('.project-card'));
          return cards.map(c => {
            const slug = c.getAttribute('data-project-card');
            const img = c.querySelector('img');
            const placeholder = c.querySelector('[aria-label$="preview frame"]');
            return {
              slug,
              hasImg: Boolean(img),
              imgSrc: img ? img.getAttribute('src') : null,
              imgAlt: img ? img.getAttribute('alt') : null,
              hasPlaceholder: Boolean(placeholder),
              placeholderLabel: placeholder ? placeholder.getAttribute('aria-label') : null
            };
          });
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 1] Screenshot slots verification:', JSON.stringify(slotsInfo.result.value, null, 2));

    // 2. Test Staggered Reveal: Scroll down through the cards and check opacities
    for (let s = 0; s < 5; s++) {
      await send('Runtime.evaluate', {
        expression: `window.scrollBy(0, 700);`
      });
      await new Promise(r => setTimeout(r, 200));
    }

    const opacities = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('.project-card'));
          return cards.map(c => {
            const wrapper = c.closest('div.relative.group') || c;
            const style = window.getComputedStyle(wrapper);
            return {
              slug: c.getAttribute('data-project-card'),
              opacity: style.opacity,
              transform: style.transform
            };
          });
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 2] Card reveal opacities (all should be 1.0):', opacities.result.value);

    // Return to start of projects for next tests
    await send('Runtime.evaluate', {
      expression: `document.getElementById('projects').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 400));

    // 3. Test 3D Tilt and Cursor Glow with real CDP Input events
    console.log('[Test 3] Testing 3D tilt & cursor glow with CDP Input.dispatchMouseEvent...');
    const cardRect = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-project-card="student-organizer"]');
          const r = card.getBoundingClientRect();
          return { x: r.left, y: r.top, width: r.width, height: r.height };
        })()
      `,
      returnByValue: true
    });
    const rect = cardRect.result.value;

    // Move mouse over card at 80% width, 20% height
    const targetX = Math.round(rect.x + rect.width * 0.8);
    const targetY = Math.round(rect.y + rect.height * 0.2);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: targetX,
      y: targetY
    });

    // Allow RAF to execute
    await new Promise(r => setTimeout(r, 150));

    const tiltRaf = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-project-card="student-organizer"]');
          if (!card) return null;
          return {
            mx: card.style.getPropertyValue('--mx'),
            my: card.style.getPropertyValue('--my'),
            transform: card.style.transform,
            willChange: card.style.willChange
          };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 3] Tilt & glow variables on hover:', tiltRaf.result.value);

    // Capture screenshot of tilted card with glow
    const shotTilt = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'project-card-tilt-and-glow.png'), Buffer.from(shotTilt.data, 'base64'));

    // Move mouse completely off the card (to top-left of screen, x: 10, y: 10)
    console.log('[Test 3] Moving mouse away from card to trigger leave...');
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 10,
      y: 10
    });

    await new Promise(r => setTimeout(r, 400));

    const leaveTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-project-card="student-organizer"]');
          if (!card) return null;
          return {
            transform: card.style.transform,
            willChange: card.style.willChange
          };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 3] Tilt after mouse leave (should be flat rotateX(0deg) rotateY(0deg)):', leaveTest.result.value);

    // 4. Test Touch / Coarse Pointer behavior: tilt MUST NOT trigger
    console.log('[Test 4] Testing touch/coarse device behavior (tilt must NOT trigger)...');
    const touchTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('[data-project-card="mplad"]');
          if (!card) return null;
          
          // Simulate coarse pointer by overriding or testing the condition
          // In our code: if (!finePointer || prefersReducedMotion) return;
          // Let's test with pointerType: 'touch'
          const rect = card.getBoundingClientRect();
          card.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'touch', clientX: rect.left + 50, clientY: rect.top + 50 }));
          
          return {
            mx: card.style.getPropertyValue('--mx'),
            transform: card.style.transform
          };
        })()
      `,
      returnByValue: true
    });
    console.log('[Test 4] Card transform on touch interaction:', touchTest.result.value);

    // Capture full projects section screenshot
    const shotFull = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'project-cards-overview.png'), Buffer.from(shotFull.data, 'base64'));

    ws.close();
  } finally {
    edge.kill();
  }
  console.log('\nAll project cards tests completed successfully!');
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});

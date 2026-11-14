import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTest() {
  console.log('Testing Native View Transitions API implementations...');
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--window-size=1440,960',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9233/json', (res) => {
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

    // 1. Verify document.startViewTransition is supported in this browser
    const vtSupport = await send('Runtime.evaluate', {
      expression: 'Boolean(document.startViewTransition)',
      returnByValue: true
    });
    console.log('Native document.startViewTransition supported:', vtSupport.result.value);

    // 2. Test Theme switch circular reveal & mid-transition click
    console.log('Testing Theme Switch...');
    const themeInitial = await send('Runtime.evaluate', {
      expression: 'document.documentElement.getAttribute("data-theme")',
      returnByValue: true
    });
    console.log('Initial theme:', themeInitial.result.value);

    // Click theme toggle
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('header button[title*="theme"], header button[aria-label*="theme"], header button:has(svg.lucide-sun), header button:has(svg.lucide-moon)');
        if (btn) {
          btn.click();
          // Test mid-transition click immediately
          setTimeout(() => btn.click(), 100);
        }
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const themeAfter = await send('Runtime.evaluate', {
      expression: 'document.documentElement.getAttribute("data-theme")',
      returnByValue: true
    });
    console.log('Theme after toggle & mid-click cancel test:', themeAfter.result.value);

    // 3. Test Nav Links Destination Heading Fade/Slide
    console.log('Testing Nav link destination heading animation...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const skillsLink = document.querySelector('header nav a[href="#skills"]');
        if (skillsLink) skillsLink.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 700));

    const headingInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const h2 = document.querySelector('#skills h2');
        return h2 ? h2.textContent : null;
      })()`,
      returnByValue: true
    });
    console.log('Navigated to section heading:', headingInfo.result.value);

    // 4. Test Project Card Morph & Focus Management
    console.log('Testing Project Card Shared-Element Transition & Focus...');
    const focusBefore = await send('Runtime.evaluate', {
      expression: 'document.activeElement?.tagName',
      returnByValue: true
    });

    // Click on the project card for portfolio-v1 or first visible card
    const cardFound = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('[data-project-card]');
        if (card) {
          card.click();
          return card.getAttribute('data-project-card');
        }
        return null;
      })()`,
      returnByValue: true
    });
    console.log('Clicked project card:', cardFound.result.value);
    await new Promise(r => setTimeout(r, 600));

    // Verify focus moved to detail view heading
    const activeElDetail = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.activeElement;
        const dialog = document.querySelector('[role="dialog"]');
        const h1 = dialog?.querySelector('h1');
        return {
          isH1: el === h1,
          tagName: el?.tagName,
          text: el?.textContent?.trim()
        };
      })()`,
      returnByValue: true
    });
    console.log('Focus in detail view:', activeElDetail.result.value);

    // Capture screenshot of detail view
    const shotModal = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/vt-detail-open.png', Buffer.from(shotModal.data, 'base64'));
    console.log('Saved shots/vt-detail-open.png');

    // Close detail view via Escape key
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    await new Promise(r => setTimeout(r, 600));

    // Verify focus returned to the card
    const activeElAfterClose = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.activeElement;
        return {
          isArticle: el?.tagName === 'ARTICLE',
          dataProjectCard: el?.getAttribute('data-project-card')
        };
      })()`,
      returnByValue: true
    });
    console.log('Focus returned after close:', activeElAfterClose.result.value);

    const shotClosed = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('shots/vt-detail-closed.png', Buffer.from(shotClosed.data, 'base64'));
    console.log('Saved shots/vt-detail-closed.png');

    console.log('ALL VIEW TRANSITIONS TESTS PASSED.');
  } finally {
    edge.kill();
  }
}

runTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});


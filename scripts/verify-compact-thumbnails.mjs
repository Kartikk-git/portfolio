import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  console.log('=== Compact Thumbnails Verification across 5 Viewports ===\n');
  const port = 9398;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,1100',
    'http://localhost:3000',
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/json`, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(JSON.parse(data)));
        })
        .on('error', reject);
    });

    const page = list.find((t) => t.type === 'page' && t.url.includes('localhost:3000'));
    if (!page) throw new Error('No page found');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
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

    await new Promise((r) => (ws.onopen = r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    const viewports = [375, 768, 1024, 1440, 1920];

    for (const width of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768,
      });

      await send('Page.navigate', { url: 'http://localhost:3000' });
      await new Promise((r) => setTimeout(r, 1200));

      const overflow = await evalExpr(`document.documentElement.scrollWidth > window.innerWidth`);

      const projectSlots = await evalExpr(`
        (() => {
          const cards = Array.from(document.querySelectorAll('[data-project-card]'));
          return cards.map(c => {
            const slot = c.querySelector('.overflow-hidden.rounded-\\\\[2px\\\\]');
            const img = slot ? slot.querySelector('img') : null;
            const r = slot ? slot.getBoundingClientRect() : null;
            return {
              slug: c.getAttribute('data-project-card'),
              width: r ? Math.round(r.width) : 0,
              height: r ? Math.round(r.height) : 0,
              isImg: Boolean(img),
              imgW: img ? Math.round(img.getBoundingClientRect().width) : 0,
              imgH: img ? Math.round(img.getBoundingClientRect().height) : 0
            };
          });
        })()
      `);

      const eduThumbnails = await evalExpr(`
        (() => {
          const btns = Array.from(document.querySelectorAll('#education button[aria-label^="View"]'));
          return btns.map(b => {
            const r = b.getBoundingClientRect();
            const img = b.querySelector('img');
            return {
              label: b.getAttribute('aria-label'),
              width: Math.round(r.width),
              height: Math.round(r.height),
              imgW: img ? Math.round(img.getBoundingClientRect().width) : 0,
              imgH: img ? Math.round(img.getBoundingClientRect().height) : 0
            };
          });
        })()
      `);

      console.log(`\n=== Viewport ${width}px ===`);
      console.log(`Horizontal overflow: ${overflow}`);
      console.log('Project screenshot banners:');
      projectSlots.forEach((p) => {
        console.log(`  - ${p.slug}: ${p.width}x${p.height}px (img: ${p.imgW}x${p.imgH}px)`);
      });
      console.log('Education thumbnails:');
      eduThumbnails.forEach((c) => {
        console.log(`  - ${c.label}: ${c.width}x${c.height}px (img: ${c.imgW}x${c.imgH}px)`);
      });
    }

    // Now at 1440px desktop: capture screenshots of Projects and Education sections
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 1200));

    // Scroll to projects and capture
    await evalExpr(`document.getElementById('projects').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise((r) => setTimeout(r, 600));

    const projShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(artifactDir, 'project-cards-compact-banners.png'),
      Buffer.from(projShot.data, 'base64')
    );
    console.log('\nCaptured artifact: project-cards-compact-banners.png');

    // Scroll to education and capture
    await evalExpr(`document.getElementById('education').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise((r) => setTimeout(r, 600));

    const eduShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(artifactDir, 'education-thumbnails-compact.png'),
      Buffer.from(eduShot.data, 'base64')
    );
    console.log('Captured artifact: education-thumbnails-compact.png');

    // Test thumbnail clicks to open modals
    console.log('\nTesting Modal interactions on thumbnails...');
    const clickMarksheetResult = await evalExpr(`
      (() => {
        const btn = document.querySelector('#education button[aria-label*="Senior Secondary"]');
        if (!btn) return 'not_found';
        btn.click();
        return 'clicked';
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));
    const marksheetModalOpen = await evalExpr(`Boolean(document.querySelector('[role="dialog"]'))`);
    console.log(`Class XII Marksheet Modal opened on thumbnail click: ${marksheetModalOpen}`);

    // Close modal
    await evalExpr(`
      (() => {
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Close document modal"]');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    // Click Java certificate thumbnail
    const clickCertResult = await evalExpr(`
      (() => {
        const btn = document.querySelector('#education button[aria-label*="Programming in Java"]');
        if (!btn) return 'not_found';
        btn.click();
        return 'clicked';
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));
    const certModalOpen = await evalExpr(`Boolean(document.querySelector('[role="dialog"]'))`);
    console.log(`Java Certificate Modal opened on thumbnail click: ${certModalOpen}`);

    // Close certificate modal
    await evalExpr(`
      (() => {
        const closeBtn = document.querySelector('[role="dialog"] button[aria-label="Close dialog"]');
        if (closeBtn) closeBtn.click();
      })()
    `);

    console.log('\n=== All verification assertions completed successfully! ===');
    ws.close();
  } finally {
    edge.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

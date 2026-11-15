import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  console.log('=== Verifying Photos Hover & Education Thumbnails ===\n');
  const port = 9400;
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
    await send('DOM.enable');

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    console.log('--- 1. Testing Hero Portrait Glow & Tilt ---');
    const heroPortraitBounds = await evalExpr(`
      (() => {
        const el = document.querySelector('#hero img[alt="Kartik Koundal"]')?.parentElement;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x: rect.left + rect.width * 0.75, // off-center to trigger tilt
          y: rect.top + rect.height * 0.25
        };
      })()
    `);
    console.log('Hero portrait target:', heroPortraitBounds);

    // Dispatch mouse hover to top-right of portrait
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: heroPortraitBounds.x,
      y: heroPortraitBounds.y
    });
    await new Promise(r => setTimeout(r, 300));

    const heroHoverState = await evalExpr(`
      (() => {
        const el = document.querySelector('#hero img[alt="Kartik Koundal"]')?.parentElement;
        if (!el) return null;
        const glow = el.querySelector('[aria-hidden="true"]');
        const r = el.getBoundingClientRect();
        return {
          transform: el.style.transform,
          mx: el.style.getPropertyValue('--mx'),
          my: el.style.getPropertyValue('--my'),
          isCircular: parseFloat(window.getComputedStyle(el).borderRadius) >= r.width / 2 - 2,
          borderStyle: window.getComputedStyle(el).border,
          hasGlow: Boolean(glow)
        };
      })()
    `);
    console.log('Hero Portrait on Hover:', heroHoverState);

    // Capture Hero Portrait Screenshot
    const heroShot = await send('Page.captureScreenshot', { format: 'png' });
    const heroShotPath = path.join(artifactDir, 'hero-portrait-tilt-glow.png');
    fs.writeFileSync(heroShotPath, Buffer.from(heroShot.data, 'base64'));
    console.log('Saved hero screenshot:', heroShotPath);

    console.log('\n--- 2. Testing About Section Photo Glow & Tilt ---');
    await evalExpr(`
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await new Promise(r => setTimeout(r, 500));

    const aboutPhotoBounds = await evalExpr(`
      (() => {
        const img = document.querySelector('#about img[src*="kartik-about"]');
        const frame = img?.parentElement;
        if (!frame) return null;
        const rect = frame.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x: rect.left + rect.width * 0.8,
          y: rect.top + rect.height * 0.2
        };
      })()
    `);
    console.log('About photo target:', aboutPhotoBounds);

    // Dispatch mouse move over About photo
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: aboutPhotoBounds.x,
      y: aboutPhotoBounds.y
    });
    await new Promise(r => setTimeout(r, 300));

    const aboutHoverState = await evalExpr(`
      (() => {
        const img = document.querySelector('#about img[src*="kartik-about"]');
        const frame = img?.parentElement;
        const caption = frame?.parentElement?.querySelector('.font-mono');
        return {
          frameTransform: frame?.style.transform,
          frameMx: frame?.style.getPropertyValue('--mx'),
          frameMy: frame?.style.getPropertyValue('--my'),
          captionTransform: caption ? window.getComputedStyle(caption).transform : 'none',
          captionIsStill: !caption || window.getComputedStyle(caption).transform === 'none'
        };
      })()
    `);
    console.log('About Photo on Hover:', aboutHoverState);

    const aboutShot = await send('Page.captureScreenshot', { format: 'png' });
    const aboutShotPath = path.join(artifactDir, 'about-photo-tilt-glow.png');
    fs.writeFileSync(aboutShotPath, Buffer.from(aboutShot.data, 'base64'));
    console.log('Saved about screenshot:', aboutShotPath);

    console.log('\n--- 3. Testing EducationSection Thumbnails ---');
    await evalExpr(`
      const el = document.getElementById('education');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await new Promise(r => setTimeout(r, 600));

    const eduAudit = await evalExpr(`
      (() => {
        // 1. Check Semester Scorecards are removed
        const semButtons = Array.from(document.querySelectorAll('#education button')).filter(b => b.textContent.includes('Sem '));
        const scorecardLinks = Array.from(document.querySelectorAll('#education a')).filter(a => a.href.includes('sem'));

        // 2. Check B.Tech degree card has NO thumbnail
        const btechH4 = Array.from(document.querySelectorAll('#education h4')).find(h => h.textContent.includes('B.Tech'));
        const btechCard = btechH4?.closest('.relative.group');
        const btechThumb = btechCard?.querySelector('img');

        // 3. Check School cards thumbnails (Class XII and Class X)
        const xiiH4 = Array.from(document.querySelectorAll('#education h4')).find(h => h.textContent.includes('Class XII'));
        const xiiCard = xiiH4?.closest('.relative.group');
        const xiiBtn = xiiCard?.querySelector('button');
        const xiiImg = xiiCard?.querySelector('img');
        const xiiBlur = xiiImg ? window.getComputedStyle(xiiImg).filter : '';

        const xH4 = Array.from(document.querySelectorAll('#education h4')).find(h => h.textContent.includes('Secondary (Class X)'));
        const xCard = xH4?.closest('.relative.group');
        const xBtn = xCard?.querySelector('button');
        const xImg = xCard?.querySelector('img');
        const xBlur = xImg ? window.getComputedStyle(xImg).filter : '';

        // 4. Check Certificate cards thumbnails
        const certCards = Array.from(document.querySelectorAll('#education .space-y-5 > .relative.group'));
        const certDetails = certCards.map(c => {
          const title = c.querySelector('h4')?.textContent?.trim();
          const btn = c.querySelector('button[aria-label^="View certificate"]');
          const img = btn?.querySelector('img');
          return {
            title,
            hasThumbBtn: Boolean(btn),
            imgSrc: img?.getAttribute('src'),
            ariaLabel: btn?.getAttribute('aria-label')
          };
        });

        return {
          semButtonsCount: semButtons.length,
          scorecardLinksCount: scorecardLinks.length,
          btechHasThumb: Boolean(btechThumb),
          xii: {
            hasThumbBtn: Boolean(xiiBtn),
            imgSrc: xiiImg?.getAttribute('src'),
            ariaLabel: xiiBtn?.getAttribute('aria-label'),
            filter: xiiBlur
          },
          x: {
            hasThumbBtn: Boolean(xBtn),
            imgSrc: xImg?.getAttribute('src'),
            ariaLabel: xBtn?.getAttribute('aria-label'),
            filter: xBlur
          },
          certDetails
        };
      })()
    `);
    console.log('Education Section Audit:', JSON.stringify(eduAudit, null, 2));

    // Test clicking Class XII thumbnail opens DocumentModal
    console.log('\n--- 4. Testing Thumbnail Modal Interactions ---');
    const openDocModalResult = await evalExpr(`
      (() => {
        const xiiH4 = Array.from(document.querySelectorAll('#education h4')).find(h => h.textContent.includes('Class XII'));
        const xiiBtn = xiiH4?.closest('.relative.group')?.querySelector('button[aria-label*="marksheet"]');
        if (!xiiBtn) return false;
        xiiBtn.click();
        return true;
      })()
    `);
    console.log('Clicked Class XII thumbnail button:', openDocModalResult);
    await new Promise(r => setTimeout(r, 400));

    const docModalState = await evalExpr(`
      (() => {
        const modal = document.querySelector('[role="dialog"]');
        return {
          isOpen: Boolean(modal),
          title: modal?.querySelector('h3')?.textContent?.trim()
        };
      })()
    `);
    console.log('Document Modal opened:', docModalState);

    // Close document modal (Escape key)
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 400));

    // Test clicking Java certificate thumbnail opens CertificateModal
    const openCertModalResult = await evalExpr(`
      (() => {
        const javaH4 = Array.from(document.querySelectorAll('#education h4')).find(h => h.textContent.includes('Programming in Java'));
        const javaBtn = javaH4?.closest('.relative.group')?.querySelector('button[aria-label*="certificate"]');
        if (!javaBtn) return false;
        javaBtn.click();
        return true;
      })()
    `);
    console.log('Clicked Java certificate thumbnail button:', openCertModalResult);
    await new Promise(r => setTimeout(r, 400));

    const certModalState = await evalExpr(`
      (() => {
        const modal = document.querySelector('[role="dialog"]');
        return {
          isOpen: Boolean(modal),
          title: modal?.querySelector('h3')?.textContent?.trim()
        };
      })()
    `);
    console.log('Certificate Modal opened:', certModalState);

    // Close certificate modal (Escape key)
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 400));

    // Capture Education Section Screenshot
    const eduShot = await send('Page.captureScreenshot', { format: 'png' });
    const eduShotPath = path.join(artifactDir, 'education-thumbnails.png');
    fs.writeFileSync(eduShotPath, Buffer.from(eduShot.data, 'base64'));
    console.log('Saved education screenshot:', eduShotPath);

    // Responsive checks: 1440, 1024, 768, 375
    console.log('\n--- 5. Responsive Checks ---');
    for (const w of [1440, 1024, 768, 375]) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w < 768
      });
      await new Promise(r => setTimeout(r, 300));

      const overflow = await evalExpr(`
        (() => {
          return {
            viewportWidth: window.innerWidth,
            bodyScrollWidth: document.body.scrollWidth,
            hasBodyOverflow: document.body.scrollWidth > window.innerWidth
          };
        })()
      `);
      console.log(`Width ${w}px:`, overflow);
    }

    console.log('\n✅ All verification checks completed successfully!');
  } finally {
    edge.kill();
  }
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});

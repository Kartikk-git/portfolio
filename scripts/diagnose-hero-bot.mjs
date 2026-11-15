import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function diagnoseViewport(width) {
  console.log(`\n========================================`);
  console.log(`DIAGNOSING VIEWPORT: ${width}px`);
  console.log(`========================================`);

  const port = 9401 + (width % 100);
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},900`,
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

    const consoleLogs = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
        consoleLogs.push({ type: msg.params.type, text });
      }
    });

    const evalExpr = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    };

    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 2000));

    // Wait until bot appears
    console.log('Checking Bot presence before click...');
    const botCheck = await evalExpr(`
      (() => {
        const bot = document.getElementById('hero-bot-trigger');
        if (!bot) return { error: 'No bot trigger found' };
        const rect = bot.getBoundingClientRect();
        const centerEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return {
          botExists: true,
          rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
          centerElTag: centerEl ? centerEl.tagName : null,
          centerElId: centerEl ? centerEl.id : null,
          centerElClass: centerEl ? centerEl.className : null,
          isHeroInView: Boolean(document.getElementById('hero')),
        };
      })()
    `);
    console.log('Bot status before click:', JSON.stringify(botCheck, null, 2));

    // Attach instrumentation to detect state changes & clicks
    await evalExpr(`
      window.__botDiagnostics = {
        clickFired: 0,
        phoneStateChanges: [],
        popoverRendered: false,
        gutterRendered: false
      };
      const trigger = document.getElementById('hero-bot-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          window.__botDiagnostics.clickFired++;
          console.log('[DIAG] HeroBot click event intercepted! Event details:', {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            defaultPrevented: e.defaultPrevented
          });
        }, true);
      }
    `);

    // Click the bot
    console.log('Triggering bot click...');
    const clickResult = await evalExpr(`
      (() => {
        const trigger = document.getElementById('hero-bot-trigger');
        if (!trigger) return 'bot_not_found';
        trigger.click();
        return 'clicked';
      })()
    `);
    console.log('Bot trigger.click() result:', clickResult);

    await new Promise((r) => setTimeout(r, 600));

    // Inspect DOM state after click
    const afterClick = await evalExpr(`
      (() => {
        const bot = document.getElementById('hero-bot-trigger');
        const botRect = bot ? bot.getBoundingClientRect() : null;
        const botParent = bot ? bot.parentElement.parentElement : null;
        
        const dialogBackdrop = document.querySelector('[role="dialog"][aria-label*="Phone"], [role="dialog"][aria-label*="phone"], .z-modal');
        const dialogFrame = document.getElementById('phone-mockup-dialog-frame');
        const gutterFrame = document.getElementById('phone-mockup-frame');
        
        const commandPalette = document.getElementById('command-palette-portal');
        
        const getStyles = (el) => {
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            zIndex: cs.zIndex,
            opacity: cs.opacity,
            transform: cs.transform,
            display: cs.display,
            visibility: cs.visibility,
            backgroundColor: cs.backgroundColor,
            backdropFilter: cs.backdropFilter,
            pointerEvents: cs.pointerEvents
          };
        };

        return {
          diagnostics: window.__botDiagnostics,
          botRect: botRect ? { x: Math.round(botRect.x), y: Math.round(botRect.y), w: Math.round(botRect.width), h: Math.round(botRect.height) } : null,
          botParentClass: botParent ? botParent.className : null,
          botParentDisplay: botParent ? window.getComputedStyle(botParent).display : null,
          dialogBackdrop: getStyles(dialogBackdrop),
          dialogFrame: getStyles(dialogFrame),
          gutterFrame: getStyles(gutterFrame),
          commandPaletteOpen: Boolean(commandPalette && commandPalette.querySelector('[role="dialog"]')),
          bodyOverflow: document.body.style.overflow,
          activeElement: document.activeElement ? (document.activeElement.getAttribute('aria-label') || document.activeElement.id || document.activeElement.tagName) : null
        };
      })()
    `);

    console.log('Post-Click Inspection:', JSON.stringify(afterClick, null, 2));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `bot-diagnose-${width}px.png`;
    fs.writeFileSync(path.join(artifactDir, filename), Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);

    console.log('Console logs during diagnosis:');
    if (consoleLogs.length === 0) {
      console.log('  (no console logs)');
    } else {
      consoleLogs.forEach((l) => console.log(`  [${l.type}] ${l.text}`));
    }

    ws.close();
  } finally {
    edge.kill();
  }
}

async function run() {
  await diagnoseViewport(1440);
  await diagnoseViewport(1920);
}

run().catch(console.error);


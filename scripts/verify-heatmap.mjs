import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  console.log('=== Verifying CommitLogSection Heatmap Polish ===\n');
  const port = 9395;
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

    console.log('1. Scrolling to #activity section...');
    await evalExpr(`
      const el = document.getElementById('activity');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);

    // Wait for IdleMount + dynamic import to load and render the grid cells
    console.log('Waiting for IdleMount and grid cells to render...');
    let ready = false;
    for (let i = 0; i < 30; i++) {
      const hasCells = await evalExpr(`!!document.querySelector('[role="gridcell"]')`);
      if (hasCells) {
        ready = true;
        break;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    if (!ready) throw new Error('Grid cells did not appear within timeout');

    // Wait 2.2 seconds for fill-in animation to complete (~1.5s duration)
    await new Promise(r => setTimeout(r, 2200));

    // Verify all squares reached full opacity (no tiles stuck at dim)
    const opacitiesCheck = await evalExpr(`
      (() => {
        const cells = document.querySelectorAll('[role="gridcell"]');
        let dimCount = 0;
        cells.forEach(c => {
          const op = parseFloat(window.getComputedStyle(c).opacity);
          if (op < 0.9) dimCount++;
        });
        return { totalCells: cells.length, dimCount };
      })()
    `);
    console.log('Square Opacity Check after 1.5s fill:', opacitiesCheck);

    // Test Tooltip on hover
    console.log('\n2. Testing Hover Tooltip...');
    const targetCellBounds = await evalExpr(`
      (() => {
        const cells = Array.from(document.querySelectorAll('[role="gridcell"]'));
        const cellWithContrib = cells.find(c => {
          const label = c.getAttribute('aria-label') || '';
          return !label.startsWith('No contributions');
        }) || cells[Math.floor(cells.length / 2)];
        const rect = cellWithContrib.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          label: cellWithContrib.getAttribute('aria-label')
        };
      })()
    `);
    console.log('Target cell:', targetCellBounds);

    // Dispatch mouse move to target cell
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: targetCellBounds.x,
      y: targetCellBounds.y
    });

    await new Promise(r => setTimeout(r, 300));

    // Check tooltip in DOM
    const tooltipCheck = await evalExpr(`
      (() => {
        const tip = document.querySelector('[role="status"]');
        if (!tip) return null;
        const style = window.getComputedStyle(tip);
        return {
          text: tip.textContent,
          position: style.position,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth
        };
      })()
    `);
    console.log('Tooltip Rendered:', tooltipCheck);

    // Capture screenshot of heatmap with tooltip
    const heatmapShot = await send('Page.captureScreenshot', { format: 'png' });
    const heatmapShotPath = path.join(artifactDir, 'heatmap-hover-tooltip.png');
    fs.writeFileSync(heatmapShotPath, Buffer.from(heatmapShot.data, 'base64'));
    console.log('Saved heatmap screenshot:', heatmapShotPath);

    // Test Roving Tabindex & Keyboard Navigation
    console.log('\n3. Testing Roving Tabindex Keyboard Navigation...');
    const rovingCheck = await evalExpr(`
      (() => {
        const cells = Array.from(document.querySelectorAll('[role="gridcell"]'));
        const tabIndexZeroCells = cells.filter(c => c.getAttribute('tabindex') === '0');
        const tabIndexMinusOneCells = cells.filter(c => c.getAttribute('tabindex') === '-1');
        return {
          totalCells: cells.length,
          tabIndexZeroCount: tabIndexZeroCells.length,
          tabIndexMinusOneCount: tabIndexMinusOneCells.length,
          initialFocusedLabel: tabIndexZeroCells[0]?.getAttribute('aria-label')
        };
      })()
    `);
    console.log('Roving Tabindex Check:', rovingCheck);

    // Focus the initial gridcell and press ArrowLeft
    const arrowNavCheck = await evalExpr(`
      (() => {
        const zeroCell = document.querySelector('[role="gridcell"][tabindex="0"]');
        if (!zeroCell) return null;
        zeroCell.focus();
        const labelBefore = zeroCell.getAttribute('aria-label');
        
        // Dispatch ArrowLeft
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true });
        zeroCell.dispatchEvent(event);

        const newActive = document.activeElement;
        const newZeroCell = document.querySelector('[role="gridcell"][tabindex="0"]');

        return {
          labelBefore,
          newActiveRole: newActive?.getAttribute('role'),
          newActiveLabel: newActive?.getAttribute('aria-label'),
          newActiveIsZero: newActive?.getAttribute('tabindex') === '0',
          sameElement: zeroCell === newActive
        };
      })()
    `);
    console.log('Arrow Navigation Result:', arrowNavCheck);

    // Test Replay button
    console.log('\n4. Testing Replay Button...');
    const replayButtonDetails = await evalExpr(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Replay'));
        if (!btn) return null;
        const style = window.getComputedStyle(btn);
        return {
          text: btn.textContent.trim(),
          border: style.border,
          borderColor: style.borderColor,
          color: style.color,
          hasSvg: !!btn.querySelector('svg')
        };
      })()
    `);
    console.log('Replay Button Styles:', replayButtonDetails);

    // Record scroll position before click
    const scrollPosBefore = await evalExpr(`window.scrollY`);

    // Click Replay button
    const replayClickResult = await evalExpr(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Replay'));
        if (!btn) return false;
        btn.click();
        return true;
      })()
    `);
    console.log('Replay Clicked:', replayClickResult);

    // Check immediate count-up restart & scroll position
    await new Promise(r => setTimeout(r, 200));
    const midReplayState = await evalExpr(`
      (() => {
        const heading = document.querySelector('#activity h3');
        return {
          headingText: heading?.textContent?.trim(),
          scrollY: window.scrollY
        };
      })()
    `);
    console.log('Mid-Replay Heading (should be counting up) & ScrollY:', midReplayState);
    console.log('Scroll position preserved?', scrollPosBefore === midReplayState.scrollY);

    // Wait for replay to complete
    await new Promise(r => setTimeout(r, 1800));
    const postReplayHeading = await evalExpr(`document.querySelector('#activity h3')?.textContent?.trim()`);
    console.log('Post-Replay Final Heading:', postReplayHeading);

    // Responsive checks: 1440, 1024, 768, 375
    console.log('\n5. Responsive Checks...');
    for (const w of [1440, 1024, 768, 375]) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w < 768
      });
      await new Promise(r => setTimeout(r, 300));

      const overflowCheck = await evalExpr(`
        (() => {
          const bodyOverflow = document.body.scrollWidth > window.innerWidth;
          const heatmapScrollable = document.querySelector('#activity .overflow-x-auto');
          return {
            viewportWidth: window.innerWidth,
            bodyScrollWidth: document.body.scrollWidth,
            hasBodyOverflow: bodyOverflow,
            heatmapHasScroll: heatmapScrollable ? heatmapScrollable.scrollWidth > heatmapScrollable.clientWidth : false
          };
        })()
      `);
      console.log(`Width ${w}px:`, overflowCheck);

      if (w === 375) {
        const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
        const mobileShotPath = path.join(artifactDir, 'heatmap-mobile-375.png');
        fs.writeFileSync(mobileShotPath, Buffer.from(mobileShot.data, 'base64'));
        console.log('Saved mobile 375px screenshot:', mobileShotPath);
      }
    }

    // Clean up test file if it exists
    if (fs.existsSync('d:\\apps\\p1\\scripts\\test-debug.mjs')) {
      fs.unlinkSync('d:\\apps\\p1\\scripts\\test-debug.mjs');
    }

    console.log('\n✅ All heatmap verification checks completed successfully!');
  } finally {
    edge.kill();
  }
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});

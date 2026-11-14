import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function studyFigma() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--window-size=1200,900',
    'https://think-potato-65807729.figma.site/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9229/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(t => t.type === 'page');
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

  await new Promise(r => setTimeout(r, 4000));

  // Click on bottom navigation by finding the bottom bar
  const navTabs = ['Home', 'Courses', 'Assignments', 'Calendar', 'Profile'];

  for (const tab of navTabs) {
    console.log(`\n=== Clicking Bottom Nav: ${tab} ===`);
    const clickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const allElements = Array.from(document.querySelectorAll('*'));
          // Bottom nav container has all 5 tabs
          const containers = allElements.filter(el => {
            const t = el.innerText || '';
            return t.includes('Home') && t.includes('Courses') && t.includes('Assignments') && t.includes('Calendar') && t.includes('Profile');
          });
          // Pick the deepest container
          const deepest = containers[containers.length - 1];
          if (!deepest) return 'No container';
          const items = Array.from(deepest.querySelectorAll('*')).filter(el => el.innerText?.trim() === '${tab}');
          const item = items[items.length - 1];
          if (item) {
            item.click();
            item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return 'Clicked: ' + item.tagName;
          }
          return 'Item not found';
        })()
      `,
      returnByValue: true
    });
    console.log('Click result:', clickRes.result?.value);

    await new Promise(r => setTimeout(r, 1500));

    const pageText = await send('Runtime.evaluate', {
      expression: `document.body.innerText`,
      returnByValue: true
    });
    console.log(`Text snippet for ${tab}:\n`, pageText.result?.value?.slice(0, 500));

    const { data: b64 } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`shots/tab-${tab.toLowerCase()}.png`, Buffer.from(b64, 'base64'));
    console.log(`Saved shots/tab-${tab.toLowerCase()}.png`);
  }

  // Deep inspect elements to extract exact colors, typography, border radius, cards, and data
  const designTokens = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const cards = Array.from(document.querySelectorAll('div, section, article')).slice(0, 100);
        const styles = cards.map(c => {
          const cs = window.getComputedStyle(c);
          return {
            bg: cs.backgroundColor,
            color: cs.color,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            border: cs.border,
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight
          };
        });

        const buttons = Array.from(document.querySelectorAll('button, [role="button"]')).map(b => {
          const cs = window.getComputedStyle(b);
          return {
            text: b.innerText?.trim(),
            bg: cs.backgroundColor,
            color: cs.color,
            borderRadius: cs.borderRadius,
            border: cs.border,
            fontSize: cs.fontSize
          };
        });

        return {
          uniqueBgs: Array.from(new Set(styles.map(s => s.bg))).filter(b => b !== 'rgba(0, 0, 0, 0)'),
          uniqueColors: Array.from(new Set(styles.map(s => s.color))),
          uniqueRadii: Array.from(new Set(styles.map(s => s.borderRadius))).filter(r => r !== '0px'),
          uniqueFonts: Array.from(new Set(styles.map(s => s.fontFamily))),
          buttonsSample: buttons.slice(0, 15)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('\n=== Design Tokens Extraction ===');
  console.log(JSON.stringify(designTokens.result?.value, null, 2));

  ws.close();
  edge.kill();
}

studyFigma().catch(console.error);

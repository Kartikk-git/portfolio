import http from 'http';
import { spawn } from 'child_process';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9399',
  '--window-size=1280,1000',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9399/json', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej));
    const p = list.find(t => t.type === 'page');
    const ws = new WebSocket(p.webSocketDebuggerUrl);
    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const cur = id++;
      const l = e => {
        const m = JSON.parse(e.data);
        if (m.id === cur) { ws.removeEventListener('message', l); res(m.result); }
      };
      ws.addEventListener('message', l);
      ws.send(JSON.stringify({ id: cur, method, params }));
    });
    await new Promise(r => ws.onopen = r);
    await send('Runtime.enable');

    // Trigger phone open so we measure phoneMockup desktop fixed frame
    await send('Runtime.evaluate', { expression: `
      (() => {
        const btn = document.querySelector('#hero-bot-trigger');
        btn?.click();
      })()
    ` });
    await new Promise(r => setTimeout(r, 400));

    const widths = [1280, 1366, 1440, 1600, 1920, 2560];
    for (const w of widths) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: 1000, deviceScaleFactor: 1, mobile: false });
      await new Promise(r => setTimeout(r, 200));
      const res = await send('Runtime.evaluate', { expression: `
        (() => {
          const rail = document.querySelector('nav[aria-label="Section navigation"]');
          const col = document.querySelector('main section .max-w-\\\\[1120px\\\\]') || document.querySelector('main section > div');
          const desktopPhone = document.querySelector('.min-\\\\[1600px\\\\]\\\\:block');
          const bot = document.querySelector('#hero-bot-trigger');
          const assembleDebug = rail?.querySelector('span.tabular-nums')?.previousElementSibling;
          
          const getR = el => el && el.getBoundingClientRect().width > 0 ? {
            left: Math.round(el.getBoundingClientRect().left),
            right: Math.round(el.getBoundingClientRect().right),
            width: Math.round(el.getBoundingClientRect().width),
            height: Math.round(el.getBoundingClientRect().height)
          } : null;

          return {
            viewportWidth: ${w},
            rail: getR(rail),
            assembleDebug: getR(assembleDebug),
            column: getR(col),
            desktopPhone: getR(desktopPhone),
            bot: getR(bot)
          };
        })()
      `, returnByValue: true });
      console.log(JSON.stringify(res.result.value, null, 2));
    }
  } catch(e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}, 2000);

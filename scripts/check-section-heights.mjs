import { spawn } from 'child_process';
import http from 'http';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9357',
  '--window-size=1280,900',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9357/json', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej));
    const p = list.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
    const ws = new WebSocket(p.webSocketDebuggerUrl);
    let id = 1;
    const send = (m, params = {}) => new Promise(res => {
      const cid = id++;
      const l = e => { const msg = JSON.parse(e.data); if (msg.id === cid) { ws.removeEventListener('message', l); res(msg.result); } };
      ws.addEventListener('message', l);
      ws.send(JSON.stringify({ id: cid, method: m, params }));
    });
    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');
    await new Promise(r => setTimeout(r, 1000));

    const heights = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('section')).map(s => ({
          id: s.id,
          offsetHeight: s.offsetHeight,
          offsetTop: s.offsetTop
        }))
      `,
      returnByValue: true
    });

    console.log('Section heights:', heights.result.value);
    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}, 2000);
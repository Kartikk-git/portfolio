import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new',
  '--remote-debugging-port=9288',
  '--window-size=1280,950',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9288/json', r => {
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
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('education');
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, top + 380);
        }
      `
    });
    await new Promise(r => setTimeout(r, 800));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9\\certs-cards-view-verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved certs-cards-view-verified.png');
    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    edge.kill();
  }
}, 2000);

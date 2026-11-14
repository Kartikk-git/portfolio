import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Kartik\\.gemini\\antigravity\\brain\\05c25442-a8c6-479b-be93-f1c90d4df1f9';

async function run() {
  const edge = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9366',
    '--window-size=1280,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9366/json', (res) => {
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

    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Scroll so #projects is at 50% of the viewport (top of #projects = 450px)
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const projects = document.getElementById('projects');
          const targetY = projects.offsetTop - (window.innerHeight * 0.5);
          window.scrollTo(0, targetY);
        })()
      `
    });

    await new Promise(r => setTimeout(r, 600));

    // Measure opacity of #hero and #projects
    const opacitiesAtProjects50 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const heroInner = document.querySelector('#hero > div');
          const projectsInner = document.querySelector('#projects > div');
          return {
            heroOpacity: window.getComputedStyle(heroInner).opacity,
            projectsOpacity: window.getComputedStyle(projectsInner).opacity,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('When #projects is at 50% scroll:', opacitiesAtProjects50.result.value);

    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'staged-projects-at-50.png'), Buffer.from(shot1.data, 'base64'));
    console.log('Saved staged-projects-at-50.png');

    // Test 2: Scroll so #about is at 50% of the viewport
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const about = document.getElementById('about');
          const targetY = about.offsetTop - (window.innerHeight * 0.5);
          window.scrollTo(0, targetY);
        })()
      `
    });

    await new Promise(r => setTimeout(r, 600));

    const opacitiesAtAbout50 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const projectsInner = document.querySelector('#projects > div');
          const aboutInner = document.querySelector('#about > div');
          return {
            projectsOpacity: window.getComputedStyle(projectsInner).opacity,
            aboutOpacity: window.getComputedStyle(aboutInner).opacity,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('When #about is at 50% scroll:', opacitiesAtAbout50.result.value);

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'staged-about-at-50.png'), Buffer.from(shot2.data, 'base64'));
    console.log('Saved staged-about-at-50.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    edge.kill();
  }
}

run();
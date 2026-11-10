import { execSync } from 'child_process';

const configs = [
  { url: 'http://localhost:3000', w: 1440, dark: false, out: 'shots/polish-home-1440-light.png' },
  { url: 'http://localhost:3000', w: 1440, dark: true,  out: 'shots/polish-home-1440-dark.png' },
  { url: 'http://localhost:3000', w: 1024, dark: false, out: 'shots/polish-home-1024-light.png' },
  { url: 'http://localhost:3000', w: 1024, dark: true,  out: 'shots/polish-home-1024-dark.png' },
  { url: 'http://localhost:3000', w: 768,  dark: false, out: 'shots/polish-home-768-light.png' },
  { url: 'http://localhost:3000', w: 768,  dark: true,  out: 'shots/polish-home-768-dark.png' },
  { url: 'http://localhost:3000', w: 375,  dark: false, out: 'shots/polish-home-375-light.png' },
  { url: 'http://localhost:3000', w: 375,  dark: true,  out: 'shots/polish-home-375-dark.png' },
  { url: 'http://localhost:3000/projects/tejovik', w: 1440, dark: false, out: 'shots/polish-tejovik-1440-light.png' },
  { url: 'http://localhost:3000/projects/student-organizer', w: 1440, dark: false, out: 'shots/polish-student-organizer-1440-light.png' },
];

for (const cfg of configs) {
  const darkFlag = cfg.dark ? '--dark' : '';
  const cmd = `node .agents/skills/design-taste-frontend/scripts/shoot.mjs --url "${cfg.url}" --w ${cfg.w} --out "${cfg.out}" ${darkFlag} --no-tiles`;
  console.log(`Shooting ${cfg.out}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error shooting ${cfg.out}:`, err.message);
  }
}

console.log('All polish screenshots successfully captured!');


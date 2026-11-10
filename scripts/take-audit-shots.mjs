import { execSync } from 'child_process';

const configs = [
  { w: 1024, dark: false, out: 'shots/audit-home-1024-light.png' },
  { w: 1024, dark: true,  out: 'shots/audit-home-1024-dark.png' },
  { w: 768,  dark: false, out: 'shots/audit-home-768-light.png' },
  { w: 768,  dark: true,  out: 'shots/audit-home-768-dark.png' },
  { w: 375,  dark: false, out: 'shots/audit-home-375-light.png' },
  { w: 375,  dark: true,  out: 'shots/audit-home-375-dark.png' },
];

for (const cfg of configs) {
  const darkFlag = cfg.dark ? '--dark' : '';
  const cmd = `node .agents/skills/design-taste-frontend/scripts/shoot.mjs --url "http://localhost:3000" --w ${cfg.w} --out "${cfg.out}" ${darkFlag} --no-tiles`;
  console.log(`Shooting ${cfg.out}...`);
  execSync(cmd, { stdio: 'inherit' });
}

console.log('All audit screenshots completed!');


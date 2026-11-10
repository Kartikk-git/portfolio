import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const html = fs.readFileSync('out/index.html', 'utf8');
const scriptMatches = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m => m[1]);

console.log('Scripts loaded by out/index.html:');
let totalRaw = 0;
let totalGzip = 0;

for (const src of scriptMatches) {
  const filePath = path.join('out', src.startsWith('/') ? src.slice(1) : src);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    const rawSize = content.length;
    const gzipSize = zlib.gzipSync(content).length;
    totalRaw += rawSize;
    totalGzip += gzipSize;
    console.log(`  ${path.basename(filePath)}: raw ${(rawSize/1024).toFixed(1)} kB, gzip ${(gzipSize/1024).toFixed(1)} kB`);
  } else {
    console.log(`  MISSING: ${filePath}`);
  }
}

console.log('--------------------------------------------------');
console.log(`Total raw JS: ${(totalRaw/1024).toFixed(1)} kB`);
console.log(`Total gzipped JS: ${(totalGzip/1024).toFixed(1)} kB`);


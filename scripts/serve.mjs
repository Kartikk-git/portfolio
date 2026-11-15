import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const PORT = 3000;
const ROOT = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

// Parse Cloudflare Pages _headers file to accurately mirror production security headers
function loadCloudflareHeaders() {
  const headersFile = path.join(ROOT, '_headers');
  if (!fs.existsSync(headersFile)) return [];
  const lines = fs.readFileSync(headersFile, 'utf8').split('\n');
  const rules = [];
  let currentPattern = null;
  let currentHeaders = {};

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith(' ') || line.startsWith('\t')) {
      const idx = line.indexOf(':');
      if (idx > -1 && currentPattern) {
        const k = line.substring(0, idx).trim();
        const v = line.substring(idx + 1).trim();
        currentHeaders[k] = v;
      }
    } else {
      if (currentPattern) {
        rules.push({ pattern: currentPattern, headers: { ...currentHeaders } });
      }
      currentPattern = line.trim();
      currentHeaders = {};
    }
  }
  if (currentPattern) {
    rules.push({ pattern: currentPattern, headers: { ...currentHeaders } });
  }
  return rules;
}

const cfRules = loadCloudflareHeaders();

function getSecurityHeadersForPath(requestPath) {
  const matched = {};
  for (const rule of cfRules) {
    if (rule.pattern === '/*' || rule.pattern === '*') {
      Object.assign(matched, rule.headers);
    } else if (rule.pattern.endsWith('/*')) {
      const prefix = rule.pattern.slice(0, -2);
      if (requestPath.startsWith(prefix)) {
        Object.assign(matched, rule.headers);
      }
    } else if (rule.pattern === requestPath) {
      Object.assign(matched, rule.headers);
    }
  }
  return matched;
}

// Content types that benefit from gzip; binaries (images, fonts, PDFs) are
// already compressed and are streamed as-is.
const GZIP_TYPES = new Set([
  'text/html; charset=utf-8',
  'text/css; charset=utf-8',
  'application/javascript; charset=utf-8',
  'application/json; charset=utf-8',
  'text/plain; charset=utf-8',
  'application/xml; charset=utf-8',
  'image/svg+xml',
]);

// Fingerprinted build assets are immutable; HTML must revalidate.
function cacheControlFor(filePath) {
  if (filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`)) {
    return 'public, max-age=31536000, immutable';
  }
  if (filePath.endsWith('.html')) {
    return 'public, max-age=0, must-revalidate';
  }
  return 'public, max-age=3600';
}

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);
    const cleanPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

    // Normalize paths
    let filePath = path.join(ROOT, cleanPath);

    // If directory, try index.html, or fallback to cleanPath.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': cacheControlFor(filePath),
      ...getSecurityHeadersForPath(cleanPath),
    };

    const acceptsGzip = (req.headers['accept-encoding'] || '').includes('gzip');
    if (acceptsGzip && GZIP_TYPES.has(contentType)) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      res.writeHead(200, headers);
      streamGzipped(filePath, res);
    } else {
      headers['Content-Length'] = stat.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Error: ' + err.message);
  }
});

function streamGzipped(filePath, res) {
  const gzip = zlib.createGzip({ level: 9 });
  fs.createReadStream(filePath).pipe(gzip).pipe(res);
  gzip.on('error', () => {
    res.destroy();
  });
}

server.listen(PORT, () => {
  console.log(`\n🚀 Portfolio production server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static build from: ${ROOT}\n`);
});

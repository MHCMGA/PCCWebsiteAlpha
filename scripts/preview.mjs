// Production-like local static preview that mirrors Vercel's clean-URL
// behaviour: a request for `/about` serves `dist/about/index.html` when
// that prerendered file exists. `vite preview` doesn't do this, which
// breaks Lighthouse SEO checks (it sees the unprerendered SPA shell and
// then the page's Helmet adds tags on top, resulting in duplicate
// canonical / title elements that LH counts as conflicting).
//
// Usage: node scripts/preview.mjs   (PORT env var, default 4173)

import { readFile, stat } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    return s.isFile() ? p : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const pathname = decodeURIComponent(url.pathname);
    let filePath = null;

    if (extname(pathname)) {
      // explicit asset request
      filePath = await tryFile(join(DIST, pathname));
    } else {
      // clean URL -> dir/index.html (Vercel behaviour)
      const candidate = join(DIST, pathname, 'index.html');
      filePath = await tryFile(candidate);
    }

    // SPA fallback for unknown routes
    if (!filePath) {
      filePath = join(DIST, 'index.html');
    }

    const buf = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }
});

server.listen(PORT, () => {
  console.log(`[preview] http://localhost:${PORT}/`);
});

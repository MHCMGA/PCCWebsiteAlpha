// Pre-render SPA routes against the built dist/ folder using Puppeteer so
// the initial HTML response has fully-rendered content. Improves Speed
// Index / FCP because the browser paints visible content before the React
// bundle executes. createRoot() then mounts on top — visually identical so
// users don't see a flicker.
//
// This script spawns its own static file server so it can run unattended
// in CI (Vercel build) without needing `vite preview` to be running.
//
// Usage:
//   pnpm build && node scripts/prerender.mjs
//
// Environment:
//   PRERENDER_PORT  (default 4178)
//   PRERENDER_ROUTES  comma-separated, default "/,/about,/contact"

import puppeteer from 'puppeteer-core';
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { platform } from 'node:os';

// Resolve a chrome executable. On Vercel/Linux CI we use @sparticuz/chromium
// (lambda-friendly, no system libs needed). Locally we just pick whatever
// chrome the OS already has installed.
async function resolveChrome() {
  if (process.env.PRERENDER_CHROME_PATH) {
    return { executablePath: process.env.PRERENDER_CHROME_PATH, args: [], headless: true };
  }
  if (process.env.VERCEL || process.env.CI || platform() === 'linux') {
    const { default: chromium } = await import('@sparticuz/chromium');
    return {
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      headless: true,
    };
  }
  // macOS / dev — try common paths
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  for (const p of candidates) {
    try { await stat(p); return { executablePath: p, args: [], headless: true }; } catch {}
  }
  throw new Error('No chrome executable found. Set PRERENDER_CHROME_PATH or install Chrome.');
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PRERENDER_PORT || 4178);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const ROUTES = (process.env.PRERENDER_ROUTES || '/,/about,/contact').split(',');

const READY_SELECTOR = 'main h1';

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

function startStaticServer(rootDir, port, fallbackHtml) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://x');
        let pathname = decodeURIComponent(url.pathname);
        // SPA fallback - any non-asset path serves the ORIGINAL (pre-prerender)
        // index.html. We must NOT serve prerendered route HTML as the SPA shell,
        // or Helmet's per-page tags get duplicated against the static SEO tags
        // that were baked into a prior route's prerender output.
        let filePath = join(rootDir, pathname);
        let useFallback = false;
        try {
          const s = await stat(filePath);
          if (s.isDirectory()) {
            // Directory request (e.g. /about/) -> serve SPA fallback shell, not
            // any prerendered index.html that may already exist there.
            useFallback = true;
          }
        } catch {
          if (!extname(pathname)) {
            useFallback = true;
          }
        }
        if (useFallback) {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
          });
          res.end(fallbackHtml);
          return;
        }
        const buf = await readFile(filePath);
        res.writeHead(200, {
          'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
          'Cache-Control': 'no-store',
        });
        res.end(buf);
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
      }
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

async function main() {
  console.log(`[prerender] static server starting on ${ORIGIN}`);
  // Snapshot the original SPA shell BEFORE we start overwriting it with
  // prerendered route HTML. This is what the static server returns for any
  // SPA fallback request, ensuring each route renders against a clean shell.
  const fallbackHtml = await readFile(join(DIST, 'index.html'), 'utf8');
  const server = await startStaticServer(DIST, PORT, fallbackHtml);

  const chrome = await resolveChrome();
  console.log(`[prerender] chrome: ${chrome.executablePath}`);
  const browser = await puppeteer.launch({
    executablePath: chrome.executablePath,
    headless: chrome.headless,
    args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  console.log('[prerender] puppeteer up — chrome version:', await browser.version());

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      const url = `${ORIGIN}${route}`;
      console.log(`[prerender] → ${url}`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector(READY_SELECTOR, { timeout: 10000 });

      const html = await page.content();
      // Strip Vercel runtime scripts (Analytics + Speed Insights) from the
      // prerendered HTML. The /_vercel/* endpoints only exist on the Vercel
      // edge - they 404 in any other environment. The @vercel/* React
      // components re-inject these script tags on hydration, so production
      // behaviour is unchanged. Removing them prevents console-error noise
      // when serving prerendered HTML from any non-Vercel host.
      const cleanedHtml = html.replace(
        /<script[^>]*src="\/_vercel\/[^"]*"[^>]*><\/script>/g,
        ''
      );

      const outPath =
        route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, cleanedHtml, 'utf8');

      const bytes = Buffer.byteLength(cleanedHtml);
      const titleMatch = cleanedHtml.match(/<title>([^<]+)<\/title>/);
      console.log(`[prerender]   saved ${outPath}  (${bytes} bytes, title="${titleMatch?.[1] ?? ''}")`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log('[prerender] complete.');
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});

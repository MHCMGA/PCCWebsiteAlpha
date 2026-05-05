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

function startStaticServer(rootDir, port) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://x');
        let pathname = decodeURIComponent(url.pathname);
        // SPA fallback — any non-asset path serves index.html so the SPA can
        // route client-side. Asset paths must have a real file extension.
        let filePath = join(rootDir, pathname);
        try {
          const s = await stat(filePath);
          if (s.isDirectory()) filePath = join(filePath, 'index.html');
        } catch {
          if (!extname(pathname)) {
            filePath = join(rootDir, 'index.html');
          }
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
  const server = await startStaticServer(DIST, PORT);

  const chrome = await resolveChrome();
  console.log(`[prerender] chrome: ${chrome.executablePath}`);
  const browser = await puppeteer.launch({
    executablePath: chrome.executablePath,
    headless: chrome.headless,
    args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  console.log('[prerender] puppeteer up — chrome version:', await browser.version());

  try {
    // First pass: snap every route into memory while the static server still
    // serves the original Vite shell (with <link rel=stylesheet>).
    const snapshots = [];
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
      const url = `${ORIGIN}${route}`;
      console.log(`[prerender] → ${url}`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector(READY_SELECTOR, { timeout: 10000 });
      snapshots.push({ route, html: await page.content() });
      await page.close();
    }

    // Second pass: inline the critical CSS into every snapshot, then write
    // them out. This avoids cross-route contamination — once we modify
    // dist/index.html the SPA fallback would feed already-modified HTML to
    // subsequent puppeteer fetches.
    for (const { route, html: rawHtml } of snapshots) {
      let html = rawHtml;
      const cssLinkMatch = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
      if (cssLinkMatch) {
        const cssHref = cssLinkMatch[1];
        try {
          const cssContent = await readFile(join(DIST, cssHref), 'utf8');
          html = html.replace(
            cssLinkMatch[0],
            `<style data-inline-critical>${cssContent}</style><link rel="preload" as="style" href="${cssHref}">`,
          );
          console.log(`[prerender]   inlined ${cssHref} into ${route} (${cssContent.length} bytes)`);
        } catch (err) {
          console.warn(`[prerender]   could not inline ${cssHref}:`, err.message);
        }
      }

      const outPath =
        route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf8');

      const bytes = Buffer.byteLength(html);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      console.log(`[prerender]   saved ${outPath}  (${bytes} bytes, title="${titleMatch?.[1] ?? ''}")`);
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

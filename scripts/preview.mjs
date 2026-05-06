// Production-like local static preview that mirrors Vercel's clean-URL
// behaviour: a request for `/about` serves `dist/about/index.html` when
// that prerendered file exists. `vite preview` doesn't do this, which
// breaks Lighthouse SEO checks (it sees the unprerendered SPA shell and
// then the page's Helmet adds tags on top, resulting in duplicate
// canonical / title elements that LH counts as conflicting).
//
// Also mirrors Vercel's edge for Lighthouse PERF parity:
//   - brotli / gzip negotiation via Accept-Encoding
//   - long `Cache-Control: immutable` for hashed /assets/*
//   - no `no-store` on HTML (so back/forward cache can cache it)
//
// Usage: node scripts/preview.mjs   (PORT env var, default 4173)

import { readFile, stat } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import {
  gzipSync,
  brotliCompressSync,
  constants as zlibConstants,
} from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

// MIME types that compress well. Images / fonts are already compressed.
const COMPRESSIBLE = new Set([
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".svg",
  ".txt",
  ".xml",
]);

// Tiny LRU for compressed payloads so we don't recompress every request.
const cache = new Map(); // key: filePath + '|' + encoding -> Buffer
function cacheGet(key) {
  if (!cache.has(key)) return null;
  const v = cache.get(key);
  cache.delete(key);
  cache.set(key, v); // bump
  return v;
}
function cacheSet(key, val) {
  cache.set(key, val);
  if (cache.size > 64) cache.delete(cache.keys().next().value);
}

function pickEncoding(req, ext) {
  if (!COMPRESSIBLE.has(ext)) return null;
  const ae = String(req.headers["accept-encoding"] || "");
  if (/\bbr\b/.test(ae)) return "br";
  if (/\bgzip\b/.test(ae)) return "gzip";
  return null;
}

function compress(buf, encoding) {
  if (encoding === "br") {
    return brotliCompressSync(buf, {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: 5,
        [zlibConstants.BROTLI_PARAM_SIZE_HINT]: buf.length,
      },
    });
  }
  if (encoding === "gzip") return gzipSync(buf, { level: 6 });
  return buf;
}

function cacheControlFor(pathname) {
  // hashed assets — immutable, 1y
  if (pathname.startsWith("/assets/") || pathname.startsWith("/icons/")) {
    return "public, max-age=31536000, immutable";
  }
  // images we treat as moderately stable
  if (
    pathname.startsWith("/team/") ||
    pathname.startsWith("/hero-") ||
    pathname === "/og.png"
  ) {
    return "public, max-age=2592000";
  }
  if (
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/site.webmanifest" ||
    pathname === "/browserconfig.xml"
  ) {
    return "public, max-age=86400";
  }
  // HTML and everything else: short, but cacheable so bf-cache works
  return "public, max-age=0, must-revalidate";
}

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
    const url = new URL(req.url, "http://x");
    const pathname = decodeURIComponent(url.pathname);
    let filePath = null;

    if (pathname.startsWith("/_vercel/") || pathname.startsWith("/api/")) {
      // Vercel runtime endpoints don't exist locally. Serve an empty 200 JS
      // response so the browser doesn't log a network error or syntax error
      // for the analytics/speed-insights scripts that the @vercel/* React
      // components inject after hydration. In production these are served
      // by the Vercel edge - this only affects local preview / Lighthouse.
      res.writeHead(200, {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      });
      res.end("// vercel runtime stub (local preview)\n");
      return;
    }

    if (extname(pathname)) {
      // explicit asset request — if missing, return 404 (don't SPA-fallback assets)
      filePath = await tryFile(join(DIST, pathname));
      if (!filePath) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("not found");
        return;
      }
    } else {
      // clean URL -> dir/index.html (Vercel behaviour)
      const candidate = join(DIST, pathname, "index.html");
      filePath = await tryFile(candidate);
    }

    // SPA fallback for unknown routes
    if (!filePath) {
      filePath = join(DIST, "index.html");
    }

    const ext = extname(filePath).toLowerCase();
    const encoding = pickEncoding(req, ext);
    const cacheKey = filePath + "|" + (encoding || "raw");

    let body = cacheGet(cacheKey);
    if (!body) {
      const raw = await readFile(filePath);
      body = encoding ? compress(raw, encoding) : raw;
      cacheSet(cacheKey, body);
    }

    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": cacheControlFor(pathname),
      Vary: "Accept-Encoding",
    };
    if (encoding) headers["Content-Encoding"] = encoding;
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  }
});

server.listen(PORT, () => {
  console.log(`[preview] http://localhost:${PORT}/`);
});

// Emit AVIF siblings for every hero-*.webp in public/.
// Runs ahead of `vite build` so the AVIF files get copied into dist/ along
// with the WebP originals. Re-runs are cheap: skips files whose mtime is
// older than the source.

import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");

const AVIF_OPTS = {
  // effort: 0-9, higher = smaller files but slower encode. 6 is a good
  // build-time balance; raise to 9 if you ever rebuild infrequently.
  effort: 6,
  // Subjectively visually-lossless for the hero photography we ship.
  quality: 50,
  // Chroma subsampling — 4:2:0 is fine for photos, smaller than 4:4:4.
  chromaSubsampling: "4:2:0",
};

async function encodeOne(srcPath, dstPath) {
  let dstNewer = false;
  if (existsSync(dstPath)) {
    const [s, d] = await Promise.all([stat(srcPath), stat(dstPath)]);
    dstNewer = d.mtimeMs >= s.mtimeMs;
  }
  if (dstNewer) {
    return { skipped: true };
  }
  const buf = await sharp(srcPath).avif(AVIF_OPTS).toBuffer();
  const { default: fs } = await import("node:fs/promises");
  await fs.writeFile(dstPath, buf);
  return { bytes: buf.byteLength };
}

async function main() {
  const entries = await readdir(PUBLIC_DIR);
  const heroes = entries.filter((f) => /^hero[-_].*\.webp$/.test(f));
  if (heroes.length === 0) {
    console.warn("[avif] no hero-*.webp in public/, nothing to do");
    return;
  }

  for (const name of heroes) {
    const src = join(PUBLIC_DIR, name);
    const dst = join(PUBLIC_DIR, name.replace(/\.webp$/, ".avif"));
    const r = await encodeOne(src, dst);
    if (r.skipped) {
      console.log(`[avif] skip ${name} (up to date)`);
    } else {
      console.log(`[avif] wrote ${name.replace(/\.webp$/, ".avif")}  (${r.bytes} bytes)`);
    }
  }
}

main().catch((err) => {
  console.error("[avif] failed:", err);
  process.exit(1);
});

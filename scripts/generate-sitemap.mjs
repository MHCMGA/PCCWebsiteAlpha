// Generate dist/sitemap.xml with per-URL <lastmod> derived from git.
// Run after `vite build` so it overwrites the copy of public/sitemap.xml
// emitted into dist/.
//
// For each route we take the most recent commit ISO date that touched the
// route's source files, then fall back to HEAD if none found.

import { execSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const ORIGIN = 'https://palmettoconsulting.us';

const ROUTES = [
  {
    loc: '/',
    priority: '1.0',
    changefreq: 'monthly',
    sources: ['src/pages/Home', 'src/components/HeroBanner', 'src/components/FeatureCard'],
    image: {
      loc: `${ORIGIN}/og.png`,
      title: 'Palmetto Consulting of Columbia',
      caption: 'Independent captive insurance consultants in Columbia, SC since 1998',
    },
  },
  {
    loc: '/about',
    priority: '0.8',
    changefreq: 'monthly',
    sources: ['src/pages/About'],
    image: {
      loc: `${ORIGIN}/team/michael-hunter-v4.webp`,
      title: 'Michael D. Hunter, CPA — Palmetto Consulting of Columbia',
      caption: 'Michael D. Hunter, CPA, Member at Palmetto Consulting of Columbia',
    },
  },
  {
    loc: '/contact',
    priority: '0.7',
    changefreq: 'monthly',
    sources: ['src/pages/Contact'],
  },
];

function gitLastModIso(paths) {
  for (const p of paths) {
    try {
      const out = execSync(`git log -1 --format=%cI -- "${p}"`, {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();
      if (out) return out.slice(0, 10); // YYYY-MM-DD
    } catch {
      /* fall through */
    }
  }
  try {
    const head = execSync('git log -1 --format=%cI', { cwd: ROOT })
      .toString()
      .trim();
    return head.slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function xmlEscape(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[c]));
}

function renderUrl(entry) {
  const loc = `${ORIGIN}${entry.loc === '/' ? '/' : entry.loc}`;
  const lastmod = gitLastModIso(entry.sources);
  const img = entry.image
    ? `
    <image:image>
      <image:loc>${xmlEscape(entry.image.loc)}</image:loc>
      <image:title>${xmlEscape(entry.image.title)}</image:title>
      <image:caption>${xmlEscape(entry.image.caption)}</image:caption>
    </image:image>`
    : '';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${img}
  </url>`;
}

async function main() {
  const body = ROUTES.map(renderUrl).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
  const outPath = join(DIST, 'sitemap.xml');
  await writeFile(outPath, xml, 'utf8');
  console.log(`[sitemap] wrote ${outPath} (${ROUTES.length} urls)`);
}

main().catch((err) => {
  console.error('[sitemap] failed:', err);
  process.exit(1);
});

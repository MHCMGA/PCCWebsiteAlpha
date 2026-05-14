# Palmetto Consulting of Columbia — PCC

[![CI](https://img.shields.io/github/actions/workflow/status/MHCMGA/PCCWebsiteAlpha/ci.yml?branch=main&label=ci&logo=github&style=flat-square)](https://github.com/MHCMGA/PCCWebsiteAlpha/actions/workflows/ci.yml)
[![Production](https://img.shields.io/website?url=https%3A%2F%2Fpalmettoconsulting.us&label=palmettoconsulting.us&up_message=live&down_message=down&style=flat-square&color=003057)](https://palmettoconsulting.us)
[![Vercel](https://img.shields.io/badge/hosted%20on-Vercel-000?logo=vercel&style=flat-square)](https://vercel.com/mhcis/pcc)
[![Node](https://img.shields.io/badge/node-22.x-339933?logo=node.js&logoColor=fff&style=flat-square)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm&logoColor=fff&style=flat-square)](https://pnpm.io)

**Framework**
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=000&style=flat-square)](https://react.dev)
[![React Compiler](https://img.shields.io/badge/React%20Compiler-1.0-61DAFB?logo=react&logoColor=000&style=flat-square)](https://react.dev/learn/react-compiler)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff&style=flat-square)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=fff&style=flat-square)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=fff&style=flat-square)](https://reactrouter.com)

**Quality**
[![Biome](https://img.shields.io/badge/Biome-2.4-60A5FA?logo=biome&logoColor=fff&style=flat-square)](https://biomejs.dev)
[![oxfmt](https://img.shields.io/badge/oxfmt-0.49-A50034?style=flat-square)](https://oxc.rs)
[![mado](https://img.shields.io/badge/mado-0.3-orange?style=flat-square)](https://github.com/akiomik/mado)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=fff&style=flat-square)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33?logo=playwright&logoColor=fff&style=flat-square)](https://playwright.dev)
[![axe-core](https://img.shields.io/badge/axe--core-4.11-663399?style=flat-square)](https://www.deque.com/axe/)
[![knip](https://img.shields.io/badge/knip-clean-22C55E?style=flat-square)](https://knip.dev)
[![size-limit](https://img.shields.io/badge/bundle-size--limit-22C55E?style=flat-square)](./.size-limit.json)

**Security**
[![Sentry](https://img.shields.io/badge/Sentry-error%20%2B%20perf-362D59?logo=sentry&style=flat-square)](https://sentry.io)
[![BotID](https://img.shields.io/badge/Vercel-BotID-000?logo=vercel&style=flat-square)](https://vercel.com/docs/botid)
[![syft](https://img.shields.io/badge/syft-SBOM-0A0?style=flat-square)](https://github.com/anchore/syft)
[![grype](https://img.shields.io/badge/grype-CVE%20scan-FF6F61?style=flat-square)](https://github.com/anchore/grype)

---

Marketing site for **Palmetto Consulting of Columbia, LLC** — independent insurance consultants in Columbia, SC since 1998.

- 🌐 **Production:** [palmettoconsulting.us](https://palmettoconsulting.us)
- 🏢 **Owner:** [MHCIS](https://github.com/MHCMGA)
- 📞 803-904-8461
- 📧 [info@palmettoconsulting.us](mailto:info@palmettoconsulting.us)

---

## Stack

| Layer            | Choice                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Framework        | React 19.2 + React Compiler + Vite 8 (SPA, prerendered to static HTML)  |
| Styling          | Tailwind CSS v4 + shadcn/ui primitives                                  |
| Routing          | react-router-dom v7, `<Link viewTransition>` on every internal link     |
| Icons            | lucide-react                                                            |
| Animations       | CSS scroll-driven (`animation-timeline: view()`) + CSS view transitions |
| Forms            | react-hook-form + zod, Resend for delivery                              |
| Notifications    | sonner toasts                                                           |
| SEO / metadata   | React 19 native document metadata + JSON-LD inline                      |
| OG image         | `@vercel/og` (`api/og.js`)                                              |
| Unit tests       | Vitest + Testing Library + jsdom                                        |
| E2E tests        | Playwright (desktop + mobile chromium) with `@axe-core/playwright`      |
| Lint / format    | Biome 2.4 (lint) + oxfmt 0.49 (JS/TS format) + mado 0.3 (Markdown lint) |
| Dead code        | knip                                                                    |
| Bundle budget    | size-limit                                                              |
| Error monitoring | Sentry (browser + node, sourcemap upload on Vercel)                     |
| Bot shield       | Vercel BotID on `/api/contact` and `/api/ask`                           |
| Analytics        | Vercel Web Analytics + Speed Insights (cookieless)                      |
| Identification   | LinkedIn Insight Tag + RB2B, gated on cookie consent                    |
| Hosting          | Vercel (mhcis/pcc)                                                      |
| Domain           | apex `palmettoconsulting.us`; `www` is a 308 redirect to apex           |

---

## Quick start

```bash
git clone https://github.com/MHCMGA/PCCWebsiteAlpha.git
cd PCCWebsiteAlpha
pnpm install
pnpm dev          # http://localhost:5173
```

## Scripts

| Script                  | What it does                                              |
| ----------------------- | --------------------------------------------------------- |
| `pnpm dev`              | Vite dev server with HMR (port 5173)                      |
| `pnpm build`            | AVIF encode → vite build → prerender → sitemap generate   |
| `pnpm preview`          | Serve built site at <http://localhost:4173>               |
| `pnpm test`             | Vitest run-once                                           |
| `pnpm test:watch`       | Vitest watch                                              |
| `pnpm test:ui`          | Vitest UI                                                 |
| `pnpm test:e2e`         | Playwright e2e (smoke + axe + CLS budget) against preview |
| `pnpm test:e2e:ui`      | Playwright UI mode                                        |
| `pnpm lint`             | Biome lint                                                |
| `pnpm lint:fix`         | Biome lint with safe autofixes                            |
| `pnpm lint:md`          | mado: lint repo Markdown                                  |
| `pnpm biome`            | `biome check` (lint + analyzer)                           |
| `pnpm biome:fix`        | Biome safe + unsafe autofixes                             |
| `pnpm format`           | oxfmt write across src / scripts / api                    |
| `pnpm format:check`     | oxfmt check (no writes)                                   |
| `pnpm knip`             | Knip: unused deps / files / exports                       |
| `pnpm size`             | size-limit gzip budget check (after `build`)              |
| `pnpm size:why`         | size-limit bundle visualizer                              |
| `pnpm avif`             | Re-encode hero photos to AVIF (idempotent, mtime-skips)   |
| `pnpm sitemap`          | Regenerate `dist/sitemap.xml` from git timestamps         |
| `pnpm prerender`        | Re-run Puppeteer prerender against `dist/`                |
| `pnpm lighthouse`       | One-off Lighthouse CI via `npx @lhci/cli@latest`          |
| `pnpm sbom`             | Generate SPDX + CycloneDX + Syft SBOMs in `reports/`      |
| `pnpm scan`             | Grype vulnerability scan against the project              |
| `pnpm audit:all`        | sbom + scan + e2e + lighthouse                            |

---

## Project layout

```text
src/
├── App.jsx                       # Routes, ErrorBoundary, site-wide meta, CookieConsent mount
├── main.jsx                      # Mount (createRoot/hydrateRoot) + deferred extras + consent gate
├── index.css                     # Tailwind v4 @theme tokens, container-x, scroll-driven keyframes
├── assets/
│   └── pcc-icon.svg              # Crescent brand mark (potrace; Vite inlines as data URI)
├── components/
│   ├── Logo/                     # "Palmetto Consulting of Columbia" wordmark
│   ├── Navbar/                   # Sticky white nav + Radix Sheet (mobile)
│   ├── Footer/                   # Navy 3-col grid + bottom bar
│   ├── HeroBanner/               # Reusable banner; AVIF source + WebP fallback
│   ├── FeatureCard/              # Service cards
│   ├── StatsBar/                 # Static stat row
│   ├── AnimatedSection/          # Pure-CSS reveal (animation-timeline: view())
│   ├── ScrollToTop/              # Route-change scroll reset
│   ├── CookieConsent/            # Privacy strip; client-only, hydration-safe
│   ├── ErrorBoundary.jsx
│   └── ui/                       # shadcn primitives (Card, Button, Input, Sheet, etc.)
├── pages/
│   ├── Home/                     # Hero + services + stats + CTA
│   ├── About/                    # Banner + team + CFO services + quote
│   ├── Contact/                  # Banner + form + contact info
│   └── Privacy/                  # Privacy Policy
├── lib/
│   ├── consent.js                # pcc-consent storage + whenAccepted() event gate
│   ├── observers.js              # LinkedIn Insight Tag + RB2B loaders (consent-gated)
│   ├── sentry.client.js          # Browser Sentry init, lazy-loaded
│   ├── VercelInsights.jsx        # Lazy Analytics + Speed Insights mount inside router
│   ├── track.js                  # Vercel Analytics event taxonomy
│   ├── schema.js                 # JSON-LD graph builders
│   ├── site.js                   # Site-wide constants (domain, phone, email, OG image)
│   └── utils.js                  # cn() helper
└── test/setup.js                 # Vitest jsdom polyfills

scripts/
├── prerender.mjs                 # Puppeteer prerender of /, /about, /contact, /privacy
├── generate-sitemap.mjs          # sitemap.xml with per-URL <lastmod> from git log
├── encode-avif.mjs               # sharp AVIF encoder for hero-*.webp (mtime-skips)
└── preview.mjs                   # Static preview server (port 4173)

api/
├── contact.js                    # Resend email send + BotID gate + zod validation
├── ask.js                        # AI ask endpoint (BotID gated)
├── og.js                         # @vercel/og dynamic OG image
├── cron/ping-sitemap.js          # Weekly sitemap ping
└── _lib/sentry.js                # Node Sentry init shared across handlers

public/
├── hero-buildings-{600,900,1400}.{webp,avif}  # Responsive home hero
├── hero-about.{webp,avif}                     # About page hero
├── hero-contact.{webp,avif}                   # Contact page hero
├── team/michael-hunter-v4.webp                # Cropped team headshot
├── icons/                                     # PWA icon set (96/192/512)
├── og.png                                     # Static Open Graph preview
├── robots.txt
├── llms.txt                                   # AI crawler hint file
├── humans.txt
└── .well-known/security.txt
```

---

## Rendering & performance

This is a Vite SPA with build-time prerender. Pipeline:

1. `scripts/encode-avif.mjs` — sharp encodes AVIF siblings for every `public/hero-*.webp` (mtime-skips on rebuild).
2. `vite build` — Rolldown-based Vite emits hashed chunks and the React Compiler memoizes components automatically.
3. `scripts/prerender.mjs` — Puppeteer visits every route in `PRERENDER_ROUTES` and snapshots the rendered HTML to `dist/<route>/index.html`.
4. `scripts/generate-sitemap.mjs` — writes `dist/sitemap.xml` with `<lastmod>` derived from `git log` over each route's source files.

Performance optimizations baked in:

- **React Compiler 1.0** via `@vitejs/plugin-react`'s `babel.plugins`. Auto-memoizes on safe components; no `useMemo`/`memo()` bookkeeping needed.
- **AVIF heroes**: 38–68% smaller than the WebP fallbacks. LCP image preload prefers AVIF; `<picture>` falls back to WebP for older browsers.
- **Speculation Rules** in `<head>`: Chromium-based browsers prerender `/about` and `/contact` on hover and prefetch other internal routes.
- **View Transitions**: every `<Link viewTransition>` wraps navigation in `document.startViewTransition()` for a smooth cross-fade. CSS retunes the default 250 ms linear to 280 ms ease-out under `prefers-reduced-motion: no-preference`.
- **CSS scroll-driven animations** (`animation-timeline: view()`): replaces the previous IntersectionObserver reveal. Runs on the compositor thread; falls back to instant render on browsers without support.
- **`text-wrap: balance` / `pretty`** on headlines and body for better widow/orphan handling.
- **Chunk-404 self-heal** inline script in `<head>`: detects 404 on any `/assets/...` script load and forces one `location.reload()` (sessionStorage-capped to one reload per 30 s) so a stale-HTML user recovers without help.
- **HTML revalidation**: `Cache-Control: public, max-age=0, must-revalidate` on the prerendered routes via `vercel.json` so cached HTML can't outlive its chunks.

---

## SEO

- Inline JSON-LD per page: `Organization` (typed as `InsuranceAgency` + `ProfessionalService`), `WebSite`, `BreadcrumbList`, `Service`, `Person`.
- `og:*` + per-route `<title>` / `<link rel=canonical>` / `<meta name=description>` hoisted to `<head>` by React 19's native document metadata. No `react-helmet`. No `twitter:*` tags — X falls back to `og:*`.
- `sitemap.xml` generated at build time with `<lastmod>` from `git log` per route.
- `robots.txt`, `llms.txt`.
- Canonical URLs set per route. `www.palmettoconsulting.us` is a 308 redirect to apex at the Vercel edge.
- Lighthouse SEO target: **≥ 0.9** (asserted in `lighthouserc.cjs`; run on-demand via `pnpm lighthouse`).

---

## Privacy & consent

- `CookieConsent` mounts client-only after hydration (skips during Puppeteer prerender to avoid hydration mismatch) and persists to `localStorage["pcc-consent"]`.
- **Always loaded** (operational / cookieless): Toaster, Sentry (errors only), BotID, Vercel Analytics, Vercel Speed Insights.
- **Loaded only after explicit Accept**: LinkedIn Insight Tag, RB2B.
- `src/lib/consent.js` exposes `readConsent()`, `writeConsent()`, `hasAccepted()`, and `whenAccepted(fn)` (fires now if accepted, otherwise on the next `pcc:consent` event). Has an in-memory fallback when `localStorage` throws (Brave / Safari private windows).
- `/privacy` is a real Privacy Policy page covering data collection, processors, cookies, and deletion requests.

---

## Accessibility

- **Runtime axe**: `@axe-core/playwright` scans each route inside Playwright, catching dynamic-state issues (open dialogs, focus traps) along with static violations.
- shadcn primitives wrap Radix → focus rings, ARIA, keyboard nav out of the box.
- Lighthouse a11y target: **≥ 0.9**.
- Screen-reader-only alt text on decorative imagery (`aria-hidden`).
- Skip-to-content via `<main>` landmark.
- Animations respect `prefers-reduced-motion`.

Run the runtime scan:

```bash
pnpm test:e2e        # axe (desktop + mobile) + smoke + CLS budget
```

---

## Security & SBOM

| Tool    | Purpose                                 | Config        |
| ------- | --------------------------------------- | ------------- |
| `syft`  | Generate SBOM (SPDX, CycloneDX, native) | `.syft.yaml`  |
| `grype` | Scan SBOM/dir for known CVEs            | `.grype.yaml` |

```bash
pnpm sbom    # writes reports/sbom/sbom.{spdx,cdx,syft}.json
pnpm scan    # writes reports/scan/grype.txt
```

`.grype.yaml` fails the build on **High** or higher severity. Medium / Low are reported but non-blocking. CVE allowlist lives in the same file.

Hard security posture:

- `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (geolocation, camera, microphone, payment, usb, interest-cohort all `()`), `Cross-Origin-Opener-Policy: same-origin` — all set in `vercel.json`.
- Source maps uploaded to Sentry on Vercel builds, then deleted from `dist/` before deploy.
- Vercel BotID gates `/api/contact` and `/api/ask`.
- Vercel firewall allowlist: search bots + LinkedInBot only; all other unfurl/AI bots blocked.

---

## Performance & bundle budgets

Lighthouse minimums (`lighthouserc.cjs`):

| Metric         | Min  |
| -------------- | ---- |
| Performance    | 0.85 |
| Accessibility  | 0.90 |
| Best Practices | 0.90 |
| SEO            | 0.90 |

Bundle limits (`.size-limit.json`):

| Chunk                        | Limit (gzip) |
| ---------------------------- | ------------ |
| Total initial JS             | 170 kB       |
| `react-vendor` chunk         | 75 kB        |
| `index` (app) chunk          | 70 kB        |
| Stylesheet                   | 10 kB        |

Check after a fresh build:

```bash
pnpm build && pnpm size
pnpm size:why    # bundle visualizer
```

---

## Deployment

Vercel auto-deploys on push to `main` (Skew Protection currently off — rolling updates intentionally disabled).

Vercel project: `mhcis/pcc` ([dashboard](https://vercel.com/mhcis/pcc)).

- Framework: **Vite**
- Build command: `pnpm build`
- Output directory: `dist`
- Node: 22.x
- Apex `palmettoconsulting.us` is the canonical host; `www.palmettoconsulting.us` 308-redirects to apex.

Local preview of the production build:

```bash
pnpm build && pnpm preview
```

Rollback or inspect deployments via `vercel rollback` / `vercel inspect` (or the dashboard).

---

## Brand

| Token         | Value     | Notes                       |
| ------------- | --------- | --------------------------- |
| `--color-navy`  | `#003057` | Primary, headings, dark fills |
| `--color-teal`  | `#006fa8` | Accent, CTAs, focus ring    |
| `--color-cyan`  | `#27b6fd` | Accent on dark surfaces     |
| `--color-bg`    | `#f7f7f5` | Page background             |
| `--color-ink`   | `#003057` | Body text                   |
| `--color-muted` | `#6b7280` | Secondary text              |

Tokens defined in `src/index.css` under `@theme`.

---

## Contact

- Issues & PRs: <https://github.com/MHCMGA/PCCWebsiteAlpha/issues>
- Site contact: <https://palmettoconsulting.us/contact>

---

© 2026 Palmetto Consulting of Columbia, LLC. All rights reserved.

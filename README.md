# Palmetto Consulting of Columbia — pcc-v2026

[![Production](https://img.shields.io/website?url=https%3A%2F%2Fpalmettoconsulting.us&label=palmettoconsulting.us&up_message=live&down_message=down&style=flat-square&color=003057)](https://palmettoconsulting.us)
[![Vercel](https://img.shields.io/badge/hosted%20on-Vercel-000?logo=vercel&style=flat-square)](https://vercel.com/mhcis/pcc-2026)
[![Node](https://img.shields.io/badge/node-22.x-339933?logo=node.js&logoColor=fff&style=flat-square)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm&logoColor=fff&style=flat-square)](https://pnpm.io)

**Framework**
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff&style=flat-square)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=fff&style=flat-square)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=fff&style=flat-square)](https://reactrouter.com)

**Quality**
[![Biome](https://img.shields.io/badge/Biome-2.4-60A5FA?logo=biome&logoColor=fff&style=flat-square)](https://biomejs.dev)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=fff&style=flat-square)](https://eslint.org)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=fff&style=flat-square)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-1.59-2EAD33?logo=playwright&logoColor=fff&style=flat-square)](https://playwright.dev)
[![axe-core](https://img.shields.io/badge/axe--core-4.11-663399?style=flat-square)](https://www.deque.com/axe/)
[![pa11y-ci](https://img.shields.io/badge/pa11y--ci-WCAG2AA-1F7A8C?style=flat-square)](https://pa11y.org)
[![knip](https://img.shields.io/badge/knip-clean-22C55E?style=flat-square)](https://knip.dev)

**Security**
[![syft](https://img.shields.io/badge/syft-SBOM-0A0?style=flat-square)](https://github.com/anchore/syft)
[![grype](https://img.shields.io/badge/grype-CVE%20scan-FF6F61?style=flat-square)](https://github.com/anchore/grype)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-perf%20%E2%89%A50.85%20%2F%20a11y%20%E2%89%A50.90-F44B21?logo=lighthouse&logoColor=fff&style=flat-square)](./lighthouserc.cjs)

---

Marketing site for **Palmetto Consulting of Columbia, LLC** — independent insurance consultants in Columbia, SC since 1998.

🌐 **Production:** [palmettoconsulting.us](https://palmettoconsulting.us)
🏢 **Owner:** [MHCIS](https://github.com/MHCMGA)
📞 803-904-8461 · 📧 info@palmettoconsulting.us

---

## Stack

| Layer         | Choice                                 |
| ------------- | -------------------------------------- |
| Framework     | React 19 + Vite 8 (SPA)                |
| Styling       | Tailwind CSS v4 + shadcn/ui primitives |
| Routing       | react-router-dom v7                    |
| Icons         | lucide-react                           |
| Animations    | IntersectionObserver + RAF (no GSAP)   |
| Notifications | sonner toasts                          |
| Schema / SEO  | react-helmet-async, JSON-LD inline     |
| Unit tests    | Vitest + Testing Library + jsdom       |
| E2E tests     | Playwright (desktop + mobile chromium) |
| A11y          | pa11y-ci (static) + axe-core (runtime) |
| Linting       | Biome 2.4 (primary) + ESLint 10        |
| Dead code     | knip                                   |
| Hosting       | Vercel                                 |
| DNS           | Vercel-managed (Cloudflare formerly)   |
| Analytics     | @vercel/analytics                      |

---

## Quick start

```bash
git clone https://github.com/MHCMGA/PCCWebsiteAlpha.git
cd pcc-v2026
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Script               | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `npm run dev`        | Vite dev server with HMR (port 5173)                 |
| `npm run build`      | Production build → `dist/`                           |
| `npm run preview`    | Serve built site at http://localhost:4173            |
| `npm test`           | Vitest run-once                                      |
| `npm run test:watch` | Vitest watch mode                                    |
| `npm run test:ui`    | Vitest UI                                            |
| `npm run test:e2e`   | Playwright e2e (smoke + axe) against `preview`       |
| `npm run test:e2e:ui`| Playwright UI mode                                   |
| `npm run lint`       | ESLint                                               |
| `npm run biome`      | Biome 2 check (primary linter)                       |
| `npm run biome:fix`  | Biome safe + unsafe autofixes                        |
| `npm run knip`       | Knip: unused deps / files / exports                  |
| `npm run format`     | Prettier (writes)                                    |
| `npm run a11y`       | pa11y-ci against running preview (WCAG2AA)           |
| `npm run a11y:serve` | Boots `preview` then runs `a11y` (single command)    |
| `npm run lighthouse` | Lighthouse CI against `dist/` (perf, a11y, SEO, BP)  |
| `npm run sbom`       | Generate SPDX + CycloneDX + Syft SBOMs in `reports/` |
| `npm run scan`       | Grype vulnerability scan against the project         |
| `npm run audit:all`  | sbom + scan + a11y + lighthouse (full CI bundle)     |

---

## Project layout

```
src/
├── App.jsx                  # Routes, ErrorBoundary, Toaster
├── main.jsx                 # Mount + HelmetProvider
├── index.css                # Tailwind v4 @theme tokens, container-x utility
├── assets/
│   └── pcc-icon.png         # Crescent brand mark (transparent)
├── components/
│   ├── Logo/                # "Palmetto Consulting of Columbia" wordmark
│   ├── Navbar/              # Sticky white nav + Radix Sheet (mobile)
│   ├── Footer/              # Navy 3-col grid
│   ├── StatsBar/            # IO-driven count-up
│   ├── AnimatedSection/     # IO-driven fade-in
│   ├── ScrollToTop/         # Route-change scroll reset
│   ├── ErrorBoundary.jsx
│   └── ui/                  # shadcn primitives (Card, Button, Input, Sheet, etc.)
├── pages/
│   ├── Home/                # Hero + services + stats + CTA
│   ├── About/               # Banner + team + CFO services + quote
│   └── Contact/             # Banner + form + contact info
├── lib/utils.js             # cn() helper
└── test/setup.js            # vitest jsdom polyfills

public/
├── hero-buildings-*.webp    # Responsive home hero images
├── hero-about.webp          # About page hero image
├── hero-contact.webp        # Contact page hero image
├── team/michael-hunter-v4.webp # Cropped team headshot
├── icons/                   # PWA icon set (96/192/512)
├── og.png                   # Open Graph preview
├── sitemap.xml
├── robots.txt
├── llms.txt                 # AI crawler hint file
└── humans.txt
```

---

## SEO

- Inline JSON-LD per page: `Organization`, `LocalBusiness`, `WebSite` w/ `SearchAction`, `BreadcrumbList`, `FAQPage`, `Service`, `Person`
- `og:*` + `twitter:*` meta on every route via `react-helmet-async`
- `sitemap.xml` (3 routes), `robots.txt`, `llms.txt`
- Canonical URLs set per route
- Lighthouse SEO target: **≥ 0.9** (asserted in `lighthouserc.cjs`)

---

## Accessibility

- **Static crawl:** pa11y-ci enforces **WCAG 2.0 AA** across `/`, `/about`, `/contact`
- **Runtime axe:** `@axe-core/playwright` scans each route inside Playwright,
  catching dynamic-state issues pa11y can't see (open dialogs, focus traps)
- shadcn primitives wrap Radix → focus rings, ARIA, keyboard nav out of the box
- Lighthouse a11y assertion: **≥ 0.9** (errors out CI if regressed)
- Screen-reader-only alt text on decorative imagery (`aria-hidden`)
- Skip-to-content via `<main>` landmark

Run a single audit:

```bash
npm run build && npm run a11y:serve   # pa11y crawl
npm run test:e2e                      # axe runtime scan
```

---

## Security & SBOM

| Tool    | Purpose                                 | Config        |
| ------- | --------------------------------------- | ------------- |
| `syft`  | Generate SBOM (SPDX, CycloneDX, native) | `.syft.yaml`  |
| `grype` | Scan SBOM/dir for known CVEs            | `.grype.yaml` |

```bash
npm run sbom    # writes reports/sbom/sbom.{spdx,cdx,syft}.json
npm run scan    # writes reports/scan/grype.txt
```

`.grype.yaml` fails the build on **High** or higher severity. Medium / Low are
reported but non-blocking. CVE allowlist lives in the same file.

---

## Performance budget

Tracked via `lighthouserc.cjs`. Current production targets:

| Metric         | Min  |
| -------------- | ---- |
| Performance    | 0.85 |
| Accessibility  | 0.90 |
| Best Practices | 0.90 |
| SEO            | 0.90 |

Bundle size at last build: **~98 kB gzipped** for the entry chunk.

---

## Deployment

Vercel auto-deploys on push to `main`. DNS is Vercel-managed; the `palmettoconsulting.us`
domain is verified and SSL is provisioned automatically.

Vercel project settings:

- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Node: 22.x (LTS)

To preview a deploy locally:

```bash
npm run build && npm run preview
```

---

## Brand

- Primary: `--color-navy` `#003057`
- Accent (teal): `--color-teal` `#006fa8`
- Accent (cyan): `--color-cyan` `#27b6fd`
- Background: `--color-bg` `#f7f7f5`
- Body: `--color-ink` `#003057`
- Muted text: `--color-muted` `#6b7280`

Tokens defined in `src/index.css` under `@theme`.

---

## Contact

Issues & PRs: [github.com/MHCMGA/PCCWebsiteAlpha/issues](https://github.com/MHCMGA/PCCWebsiteAlpha/issues)
Site contact: [palmettoconsulting.us/contact](https://palmettoconsulting.us/contact)

---

© 2026 Palmetto Consulting of Columbia, LLC. All rights reserved.

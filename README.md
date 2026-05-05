# Palmetto Consulting of Columbia — pcc-v2026

Marketing site for **Palmetto Consulting of Columbia, LLC** — independent insurance consultants in Columbia, SC since 1998.

🌐 **Production:** [palmettoconsulting.us](https://palmettoconsulting.us)
🏢 **Owner:** [MHCIS](https://github.com/MHCMGA)
📞 803-904-8461 · 📧 info@palmettoconsulting.us

---

## Stack

| Layer            | Choice                                   |
|------------------|------------------------------------------|
| Framework        | React 19 + Vite 8 (SPA)                  |
| Styling          | Tailwind CSS v4 + shadcn/ui primitives   |
| Routing          | react-router-dom v7                      |
| Icons            | @phosphor-icons/react, lucide-react      |
| Animations       | IntersectionObserver + RAF (no GSAP)     |
| Notifications    | sonner toasts                            |
| Schema / SEO     | react-helmet-async, JSON-LD inline       |
| Testing          | Vitest + Testing Library + jsdom         |
| Hosting          | Vercel                                   |
| DNS              | Vercel-managed (Cloudflare formerly)     |
| Analytics        | @vercel/analytics                        |

---

## Quick start

```bash
git clone https://github.com/MHCMGA/PCCWebsiteAlpha.git
cd pcc-v2026
npm install
npm run dev          # http://localhost:5173
```

## Scripts

| Script              | What it does                                         |
|---------------------|------------------------------------------------------|
| `npm run dev`       | Vite dev server with HMR (port 5173)                 |
| `npm run build`     | Production build → `dist/`                           |
| `npm run preview`   | Serve built site at http://localhost:4173            |
| `npm test`          | Vitest run-once                                      |
| `npm run test:watch`| Vitest watch mode                                    |
| `npm run test:ui`   | Vitest UI                                            |
| `npm run lint`      | ESLint                                               |
| `npm run format`    | Prettier (writes)                                    |
| `npm run a11y`      | pa11y-ci against running preview (WCAG2AA)           |
| `npm run a11y:serve`| Boots `preview` then runs `a11y` (single command)    |
| `npm run lighthouse`| Lighthouse CI against `dist/` (perf, a11y, SEO, BP)  |
| `npm run sbom`      | Generate SPDX + CycloneDX + Syft SBOMs in `reports/` |
| `npm run scan`      | Grype vulnerability scan against the project         |
| `npm run audit:all` | sbom + scan + a11y + lighthouse (full CI bundle)     |

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
├── hero-buildings.jpg       # Self-hosted hero (was Unsplash)
├── team/michael-hunter.jpg  # 600×600 cropped headshot
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

- pa11y-ci enforces **WCAG 2.0 AA** across `/`, `/about`, `/contact`
- shadcn primitives wrap Radix → focus rings, ARIA, keyboard nav out of the box
- Lighthouse a11y assertion: **≥ 0.9** (errors out CI if regressed)
- Screen-reader-only alt text on decorative imagery (`aria-hidden`)
- Skip-to-content via `<main>` landmark

Run a single audit:
```bash
npm run build && npm run a11y:serve
```

---

## Security & SBOM

| Tool   | Purpose                                  | Config        |
|--------|------------------------------------------|---------------|
| `syft` | Generate SBOM (SPDX, CycloneDX, native)  | `.syft.yaml`  |
| `grype`| Scan SBOM/dir for known CVEs             | `.grype.yaml` |

```bash
npm run sbom    # writes reports/sbom/sbom.{spdx,cdx,syft}.json
npm run scan    # writes reports/scan/grype.txt
```

`.grype.yaml` fails the build on **High** or higher severity. Medium / Low are
reported but non-blocking. CVE allowlist lives in the same file.

---

## Performance budget

Tracked via `lighthouserc.cjs`. Current production targets:

| Metric         | Min   |
|----------------|-------|
| Performance    | 0.85  |
| Accessibility  | 0.90  |
| Best Practices | 0.90  |
| SEO            | 0.90  |

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
- Accent (cyan): `--color-cyan` `#0085B7`
- Accent (teal): `--color-teal` `#00A1B7`
- Background: `--color-bg` `#F5F6F7`
- Body: `--color-fg` `#1F2937`

Tokens defined in `src/index.css` under `@theme`.

---

## Contact

Issues & PRs: [github.com/MHCMGA/PCCWebsiteAlpha/issues](https://github.com/MHCMGA/PCCWebsiteAlpha/issues)
Site contact: [palmettoconsulting.us/contact](https://palmettoconsulting.us/contact)

---

© 2026 Palmetto Consulting of Columbia, LLC. All rights reserved.

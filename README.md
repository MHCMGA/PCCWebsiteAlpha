# PCC Website

This project is configured to deploy as a static site on GitHub Pages.

## Local commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## GitHub Pages

The app uses:

- relative Vite asset paths, so the built files work from a repo subpath
- `HashRouter`, so page refreshes do not 404 on GitHub Pages

To deploy with GitHub Pages:

1. Run `npm run build`.
2. Publish the contents of `dist/`.
3. If you use a GitHub Actions Pages workflow, set the build step to `npm ci && npm run build` and upload `dist` as the Pages artifact.

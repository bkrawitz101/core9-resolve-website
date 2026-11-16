# CORE9 RESOLVE™ Website

Astro website built from the approved CORE9 RESOLVE™ staging pages and November 2026 updates, preserving all interactive Function 1–9 and Reflection modules cleanly in `public/`.

## Repository Structure

```text
.
├── .github/workflows/deploy.yml # Builds and deploys Astro to GitHub Pages on push
├── astro.config.mjs             # Static build config (`format: 'file'`) + GitHub Pages base support
├── src/
│   ├── layouts/BaseLayout.astro         # Shared header, nav, footer, and noindex toggle
│   ├── components/                      # ReflectionCard & interactive CircleOfNineStage
│   ├── scripts/nine-functions-canvas.js # Fixed Circle of Nine + fractal zoom canvas
│   ├── utils/url.ts                     # Base-path URL helper
│   ├── data/
│   │   ├── site.json                    # Brand name, global nav, allow_search_indexing, booking_url
│   │   └── pages/*.json                 # Structured copy for each page
│   └── pages/                           # Astro pages + /assessments/booking-config.js
├── public/
│   ├── functions/                       # Preserved interactive Function 1–9 HTML files
│   ├── assessments/                     # Preserved interactive Reflections (9, 27, 45) & RU originals
│   └── assets/                          # Static media/booklet proof files
├── content/functions/                   # Reference JSON/MD snapshots & approval register (private)
└── docs/                                # Checklists & Audio Shows specs (private, not in dist/)
```

## Local Development & Preview

```bash
npm install
npm run dev      # Start Astro dev server
npm run build    # Build static site to dist/
npm run preview  # Preview built dist/ output locally
```

## GitHub Pages Deployment

Pushing to `main` runs `.github/workflows/deploy.yml` with `ASTRO_BASE=/core9-resolve-website` and publishes `dist/` to GitHub Pages when **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**.

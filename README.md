# CORE9 RESOLVE™ Website

Astro + CloudCannon website built from the approved CORE9 RESOLVE™ staging pages and November 2026 updates, preserving all interactive Function and Reflection modules untouched in `public/`.

## Repository Structure

```text
.
├── astro.config.mjs            # Static build config (`format: 'file'`) + CloudCannon Editable Regions
├── cloudcannon.config.yml      # CloudCannon CMS sidebar collections, visual editor & input rules
├── src/
│   ├── layouts/BaseLayout.astro        # Shared header, nav, footer, noindex toggle & CC registration
│   ├── components/ReflectionCard.astro # Visual-editable card component
│   ├── data/
│   │   ├── site.json                   # Brand name, global nav, allow_search_indexing, booking_url
│   │   └── pages/*.json                # Editable page copy (home, book-session, calendar, shows, etc.)
│   ├── content/episodes/               # Audio show episodes collection (Phase 2)
│   └── pages/                          # Astro pages + dynamic /assessments/booking-config.js
├── public/
│   ├── functions/                      # Preserved interactive Function 1–9 HTML files
│   ├── assessments/                    # Preserved interactive Reflections (9, 27, 45) & RU originals
│   ├── assets/                         # Static media/booklet proof files
│   └── uploads/                        # CloudCannon image/file upload folder
├── content/functions/                  # Reference JSON/MD snapshots & approval register (private)
└── docs/                               # Checklists & Audio Shows handoff specs (private, not in dist/)
```

## Local Development & Preview

```bash
npm install
npm run dev      # Start Astro dev server
npm run build    # Build static site to dist/
npm run preview  # Preview built dist/ output locally
```

## CloudCannon & Cloudflare Pages Setup

1. **Cloudflare Pages**: Connect this GitHub repository in **Workers & Pages → Create → Pages → Connect to Git**. Use framework preset **Astro** (`npm run build`, output directory `dist`, environment variable `NODE_VERSION=20`).
2. **CloudCannon**: Connect the same GitHub repository (or a `staging` branch for preview drafts). CloudCannon automatically reads `cloudcannon.config.yml` and lets Svetlana click-to-edit copy, manage the booking URL (`Site Settings & Booking Link`), and add podcast episodes without touching GitHub.

# CORE9 RESOLVE™ Website

Plain static website hosted directly from the `main` branch on GitHub Pages (with `.nojekyll` enabled, zero build tools required).

## Repository Structure

```text
.
├── .nojekyll                   # Disables Jekyll processing for GitHub Pages branch deploys
├── index.html                  # Home page (hero, 3 reflections, interactive Circle of Nine)
├── book-session.html           # Consultation booking / pending scheduling notice
├── functions.html              # Dedicated Circle of Nine page + Function 1–9 index
├── calendar.html               # Personal Cycle Year calculator & calendar overview
├── shows.html                  # Audio Shows overview
├── watch-and-learn.html        # Watch & Learn video playlist page
├── js/nine-functions-canvas.js # Fixed Circle of Nine + fractal zoom canvas script
├── assessments/                # Reflections hub (`index.html`), booking config & interactive tests (9, 27, 45)
├── functions/                  # Interactive Function 1–9 HTML experiences
├── assets/                     # Static proof / media files
├── content/functions/          # Reference content snapshots & approval register
└── docs/                       # Launch checklist & notes
```

## Local Preview

```bash
python3 -m http.server 4321
```

Then open `http://localhost:4321/`.

## GitHub Pages Publishing

In GitHub **Settings → Pages → Build and deployment**:
- **Source:** Deploy from a branch
- **Branch:** `main` / `/ (root)`

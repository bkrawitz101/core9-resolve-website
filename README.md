# CORE9 RESOLVE™ Website

Clean, consolidated website repository assembled from `CORE9 extra pages video and calendar` (core staging site) and updated with the November 14, 2026 Audio Shows developer handoff.

## Repository Structure

```text
.
├── index.html                  # Business landing page (staging)
├── functions.html              # Nine Functions directory shell
├── shows.html                  # CORE9 Audio Shows hub (Business Unusual & Mr. Right & Mrs. Maybe)
├── watch-and-learn.html        # Watch & Learn (Vasili & Svetlana YouTube playlist page)
├── calendar.html               # Personal Calendar & Cycle Year calculator
├── functions/                  # Preserved interactive Function 1–9 HTML pages (untouched source copies)
├── assessments/                # Assessments hub + Tests 9, 27, 45 (v8) & RU reference engines
├── assets/                     # Calendar companion EPUB proof & future media/visual assets
├── content/functions/          # Structured JSON/MD snapshots for Functions 1, 3–9 + approval register
└── docs/
    ├── LAUNCH_CHECKLIST.md     # Remaining approvals, missing URLs, and QA gates before public launch
    └── podcast-handoff/        # Full Nov 14 Audio Shows creative, UX, ops, and dev specs
```

## Local Preview

Run a local static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser.

## Important Notes

- Approved Function (`functions/`) and Assessment (`assessments/test*.html`) HTML files are preserved byte-for-byte from the verified source packages.
- Staging pages still include `<meta name="robots" content="noindex,nofollow">` until all open items in `docs/LAUNCH_CHECKLIST.md` (booking URL, YouTube embeds, Team bios, Function 2/5 approvals, and browser QA) are completed.


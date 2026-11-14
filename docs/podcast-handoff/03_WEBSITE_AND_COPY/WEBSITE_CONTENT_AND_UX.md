# Website information architecture, UX and publish-ready draft copy

## Primary funnel
**Weekly email → episode detail page on CORE9 domain → play immediately → browse the two shows and related episodes → Seriously Curious? → actual consultation booking URL.** Keep the listener on CORE9 for initial click; third-party apps are secondary options.

## Suggested URL structure (confirm actual domain and site routing)
- `/shows/` — main podcast landing and cross-show hub
- `/shows/business-unusual/` — Business Unusual show archive
- `/shows/mr-right-mrs-maybe/` — life and relationships archive
- `/shows/business-unusual/{slug}/` — business episode detail
- `/shows/mr-right-mrs-maybe/{slug}/` — life episode detail
- `/consultation/` — only if actual booking integration exists; otherwise use supplied external booking URL

## Main shows page — exact draft copy

### Hero
**Headline:** Life Is Complicated. At Least We Can Laugh About It.
**Subheading:** Two fictional audio comedies about the ridiculous things we do at work, at home, and with the people who matter most. Quick conversations. Familiar disasters. Unexpected insights.
**Supporting line:** Two new five-minute episodes every week — one about business, one about life and relationships.
**Primary link:** Listen to the Latest Episode
**Secondary link:** Explore Both Shows

### Show tile 1
**Business Unusual**
*Where Business Problems Get Personal.*
Max Logic has a system for everything. Marsha Chaos has a question that ruins it. Together, they tackle the wonderfully messy reality of owning a business — with the occasional expert who makes things even more interesting.
**Link:** Explore Business Unusual

### Show tile 2
**Mr. Right & Mrs. Maybe**
*He Has All the Answers. She Has All the Questions.*
A couple with two opinions about absolutely everything: love, work, family, money, plans and the mysterious rules of living together. Sometimes he is right. Sometimes she is. Sometimes the dishwasher wins.
**Link:** Explore Mr. Right & Mrs. Maybe

### Discovery strip
**Headline:** Same Problems. Different Sides of the Story.
A business owner says nobody takes responsibility. An employee says nobody lets them. At home, the same argument may be happening over dinner. Different lives. Familiar patterns. Plenty to laugh about.
**Link:** Hear Both Sides

### Archive heading
**Headline:** Find Your Next Five-Minute Escape
**Filters:** All | Business | Life & Relationships; newest first; optional topic chips; search; paginated results. Each card: title, show, duration, publish date, 1-line teaser, play/open link.

### Subscribe and listening platforms
**Headline:** Never Miss the Next Disaster
Get the latest episode in your inbox, or follow the shows wherever you listen to podcasts.
**Button:** Get the Weekly Episodes
**Secondary links:** Spotify | Apple Podcasts | Amazon Music | RSS (show only verified live links). Separate follow links for each show.

### Closing consultation invitation — proposed final draft
**Headline:** Seriously Curious?
Sometimes we laugh because the alternative is to cry.

But what if you could laugh about your problems because they're finally behind you?

**Talk to a real expert.** Discover what's keeping you stuck, find a way forward, and turn today's worries into tomorrow's funny stories.

Not because you've learned to live with the problems — but because you've actually resolved them.

**Button:** Talk to a CORE9 Expert
**Supporting microcopy:** A personal conversation, not another podcast episode.

**Important:** This is the user-liked wording from the prior discussion, prepared for publication. The booking button MUST connect to a genuine consultation page or booking service. Do not promise specific outcomes as guarantees.

## Individual episode page — precise vertical order
1. Global CORE9 header and `Shows` nav active.
2. Breadcrumb: Shows / Show Name / Episode.
3. Show eyebrow and episode title; episode number, release date, duration.
4. **Accessible audio player ABOVE the fold** (play/pause, seek, volume, speed if available, time, download optional). Never autoplay.
5. 1–2 sentence teaser and brief “What you'll recognize” section (non-lecturing).
6. **Listen next:** one related episode from same show and optionally a paired opposite-perspective episode from other show (only if actually published).
7. Transcript accordion, readable and crawlable; preserve exact final spoken words.
8. Share link and copy URL; subscribe links to each show; email signup with clear consent.
9. Archive links: More Business Unusual | More Mr. Right & Mrs. Maybe | Browse All Episodes.
10. **Seriously Curious?** CTA repeated at bottom, same copy and actual booking link.
11. Footer: CORE9 identity, privacy, terms, contact, accessibility as available.

## Show archive pages
Unique hero, latest featured episode, season list with search and filters, show description, follow on platforms, related show cross-link, and closing consultation CTA. No walls of text.

## Email behavior
Every episode email has ONE main link to the **episode page on CORE9**, with show name, title, 2–3 sentences, and `Listen to This Episode` button. Never send MP3 attachments. The page must remain publicly accessible with a stable canonical URL. Optional separate “Browse both shows” link below.

## Search, accessibility and performance
- Semantic headings, keyboard operable player, visible focus, sufficient contrast, alt text for cover art, descriptive links.
- Transcripts for every episode; mobile-first player; lazy-load archives; no intrusive popups; no autoplay.
- Unique title/meta, canonical URL, Open Graph image, structured data (`PodcastSeries` and `PodcastEpisode` where valid), sitemap and RSS links.
- Store UTC publish timestamps and display localized dates; keep slugs immutable; 301 redirect if changed.
- Booking and newsletter links instrumented with privacy-conscious analytics.
- Do not expose private methodology files to the public website or RSS feed.

## Visual direction
CORE9 brand-consistent navy, white and gold; elegant but playful. Two visually distinct show covers with consistent CORE9 family identity. Prefer strong typographic headlines, generous spacing, warm editorial illustrations or licensed character art. No stock-photo clichés, no excessive animations. Audio-first, no video UI.

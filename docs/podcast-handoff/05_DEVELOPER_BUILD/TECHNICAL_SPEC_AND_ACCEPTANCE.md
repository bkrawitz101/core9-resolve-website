# Technical specification and acceptance criteria

## Data model (two shows, many episodes)
**Show:** show_id, title, slug, tagline, long_description, cover_art, trailer_url, host_id, rss_url, directory_links map, default_cta, published_status.
**Episode:** episode_id, show_id, episode_number, season, title, slug, teaser, summary, transcript, tags, audio_url/host_embed, duration_seconds, artwork, published_at_utc, status, related_episode_ids, internal_source_refs, content_version, SEO metadata, email_campaign_id.
**Editorial job:** job_id, episode_id, status, assigned_to, source_verified_by, audio_qa_by, approved_at, scheduled_at, published_at, incident_notes.

## CMS and security
Use existing CORE9 site stack; avoid a separate site unless necessary. Nontechnical producer must create/edit/schedule episodes without developer. Separate private source notes from public episode metadata. Use role-based access; protect unpublished audio; audit changes. Do not store credentials in code, source ZIP or CMS plaintext.

## Frontend
Responsive shows hub, two archives, episode detail template. Accessible player; no autoplay; reliable mobile playback; seek, keyboard support, speed if available; transcript and cross-navigation. Show only live directory badges. Keep booking CTA visible on hub, archive and episode pages without blocking listening. Optimize image/audio loading.

## Integrations
- Podcast host API or documented manual upload process. RSS URLs stable and distinct per show.
- Newsletter platform: two show-specific email templates and scheduling; trigger only after successful publish check; unsubscribe and consent compliance.
- Consultation booking: real owner-supplied URL or embedded booking service, with clear outbound behavior.
- Analytics: page view, play start, play complete (only if measurable), episode next click, show switch, subscribe click, CTA click, booking conversion where consent/technical integration allows.
- Automation: queue alerts, release preflight, post-publish validation, email send guard; human QA gate remains mandatory.

## Publishing atomicity and idempotency
1. Producer approves episode and audio.
2. Publish audio to podcast host; confirm valid audio URL and RSS inclusion.
3. Publish CORE9 episode page with player, transcript, metadata and booking CTA.
4. Verify public playback, correct links, and 200 response.
5. Send email once using unique episode/campaign key; if retry occurs, do not duplicate sends.
6. Record timestamps, public URLs and failures; alert producer on any issue.

## Acceptance tests
- Both show archives render 20 planned topics internally; only published episodes publicly visible.
- Any published episode plays on iPhone Safari, Android Chrome and desktop; seek and keyboard controls work.
- New episode can be added by producer without developer and appears in proper archive order.
- An episode email opens the correct CORE9 episode page and the audio starts by user action.
- From any episode, user can reach both show archives, a related episode and a working consultation booking link.
- Each show has independent RSS feed, distinct cover and verified directory links.
- Scheduled email is blocked if audio or page fails preflight.
- Transcripts, titles, canonical links, mobile layout, screen-reader labels and sitemap verified.
- Booking CTA clicks track without exposing personal data; actual bookings only counted if verified integration exists.
- Draft/unapproved content cannot be published by automation; founder approval not required for routine episodes after pilot signoff.
- Invalid RSS, missing media, broken booking URL and unsubscribe failure all raise actionable alerts.

## Handoff and documentation
Developer supplies admin guide with screenshots, architecture diagram, source repo/config ownership, staging and production URLs, domain/DNS notes, account inventory, backup/restore, credential transfer through secure channel, acceptance test evidence, directory feed links, and short producer training. No secrets in shared archive.

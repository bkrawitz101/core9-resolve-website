# Distribution and podcast hosting — implementation guidance (checked 14 Nov 2026)

## Recommended architecture
**One podcast host, two distinct shows, two RSS feeds**, each with its own cover, description and stable feed URL. Host each MP3 once. Connect feeds to listening directories; place verified directory links on each show page. The CORE9 site is the marketing hub and canonical email destination, not necessarily the audio file host.

## Host choices to evaluate
**Buzzsprout:** publisher-oriented hosting and directory workflow; offers RSS, embedded players and directory submissions. Confirm plan supports two shows, sufficient monthly audio, storage, ownership, analytics, costs and desired embedding before buying. Official: https://www.buzzsprout.com/features/distribution
**Spotify for Creators:** Spotify-hosted shows are on Spotify; external directory distribution requires enabling RSS and submitting feeds to other services. RSS contact email may be publicly visible; use a dedicated podcast contact address. Official: https://support.spotify.com/us/creators/article/finding-and-enabling-your-rss-feed/ and https://support.spotify.com/lc/creators/article/distributing-your-show-to-other-platforms/
**Other hosts:** compare Podbean, Libsyn, Transistor or another RSS-compatible host against the same requirements; do not assume pricing or features without verification.

## Directory rollout
1. Create show identities, art, owner-controlled email and podcast host accounts.
2. Upload a trailer or first episode to each show; obtain two valid RSS feeds.
3. Validate each feed and enclosure; submit to **Apple Podcasts** and **Spotify** (if not automatically hosted there); then **Amazon Music**, **iHeartRadio**, **Pocket Casts**, **Overcast**, and other host-supported directories.
4. Verify actual public show links and add to website only when live.
5. Once accepted, routine episodes distribute via RSS; producer uploads once to host. Review host-specific timing, since directory indexing can lag.
6. Optional: audio RSS ingestion to YouTube/YouTube Music where supported, but this creates a static-image video representation; **not required** for the audio-only initial launch.

## Technical RSS checklist
Apple requires a public RSS 2.0 feed, required metadata, cover artwork, at least one episode, valid audio enclosures, unique immutable GUIDs, and servers supporting byte-range and HEAD requests. Use a hosting service to avoid implementing RSS manually. Validate in Apple Podcasts Connect and confirm playback on actual apps. See https://podcasters.apple.com/support/823-podcast-requirements and https://podcasters.apple.com/support/897-submit-a-show

## Editorial/brand details for feeds
- Show-specific titles and descriptions; publisher `CORE9 RESOLVE™`; appropriate categories selected by producer.
- Website URL points to the matching CORE9 show page; episode links to individual CORE9 episode page where supported by host metadata.
- Explicit/clean flag chosen correctly per episode; no profanity assumption.
- Artwork should meet host/directory specifications; verify current requirements before final export.
- Include a concise fictional-show disclosure, not a misleading claim of real interviews.
- Use dedicated public RSS contact email, not a private personal email.

## Sources checked 14 Nov 2026
- Apple RSS: https://podcasters.apple.com/support/823-podcast-requirements
- Apple submit: https://podcasters.apple.com/support/897-submit-a-show
- Spotify RSS: https://support.spotify.com/us/creators/article/finding-and-enabling-your-rss-feed/
- Spotify external distribution: https://support.spotify.com/lc/creators/article/distributing-your-show-to-other-platforms/
- Buzzsprout distribution: https://www.buzzsprout.com/features/distribution
- Buzzsprout directories: https://www.buzzsprout.com/help/139-submitting-to-directories
- YouTube RSS availability: https://support.google.com/youtube/answer/14106258?hl=en

**Note:** Third-party platform capabilities and prices may change. Developer must recheck live requirements at implementation. No service has been connected, subscribed to or deployed as part of this handoff.

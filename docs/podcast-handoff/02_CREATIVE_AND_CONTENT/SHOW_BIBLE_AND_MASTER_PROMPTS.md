# Show bible and reusable production prompts

## Global style contract
- **Sound:** high-energy, quick exchanges, believable interruptions, natural pauses, no relentless shouting. Humor comes from contradictory needs, overconfidence, misunderstandings, escalation and reversals, not insult comedy.
- **Humanity:** both sides have understandable reasons; avoid cruel caricatures, simplistic villains, gender stereotypes, class stereotypes, shaming or humiliating anyone.
- **Pacing:** cold open in first 10 seconds; a laugh/turn every 20–40 seconds; one coherent problem; surprising reversal near end; last-line punchline.
- **Target:** 4:30–5:30 finished audio; measure after voice synthesis, not by word count alone. Start scripts at ~600–750 spoken words depending on voice tempo, then adjust by listening.
- **Educational discipline:** one insight from approved CORE9, surfaced naturally in dialogue, no lecture or excessive jargon; **never claim a fictional case is real**.
- **Guest policy:** fictional expert guests optional in Business Unusual only when tool supports distinct voice and added voice improves episode. Do not add a guest merely for novelty.
- **CTA:** primary consultation CTA is on website, not a long sales pitch in audio. Optional brief closing: “More stories — and a serious next step if you need one — at CORE9 RESOLVE.” No invented URL.

## Character continuity
**Max Logic:** precise, system-minded, smug about data; is often blindsided by people. Has compassion underneath. **Marsha Chaos:** sharp, intuitive, improvisational; catches what Max misses, but her shortcuts sometimes backfire. Never make her irrational by default.
**Mr. Right:** enjoys certainty and fixing; sometimes knows less than he thinks. **Mrs. Maybe:** questions assumptions, detects emotional undercurrents; sometimes overthinks or makes plans herself. Swap who is right; allow mutual affection.
**Guests (fictional, optional):** Victor Vision (grand future plans, missing present), Connie Reality (practical skeptic), Penny Wise (cost fixation), Jack Strategy (endless frameworks), Rita Recharge (burnout awareness), Marty Metrics (counts everything). Only one guest per episode; no implication they are real CORE9 experts.

## MASTER PROMPT A — Episode ideation
You are the editorial writer for CORE9 RESOLVE's two fictional audio comedies. Read the approved CORE9 source package and the show bible. Produce 12 fresh premises per show, excluding existing slate titles and close duplicates. Business Unusual must primarily engage business owners; Mr. Right & Mrs. Maybe must be broadly relatable to employees, employed managers, partners, couples and families. For each premise output title, familiar situation, opposing wants, 3-step comic escalation, surprising reversal, possible approved CORE9 insight with source filename and passage, and one closing joke. If no verified source supports the insight, mark SOURCE CHECK NEEDED; do not fabricate. Prioritize specific lived situations over abstract business topics. Never write a lecture.

## MASTER PROMPT B — Script generation (copy and reuse)
You are writing a fast, warm, conflict-driven fictional AUDIO COMEDY, not an educational interview. INPUTS: show={SHOW}; episode title={TITLE}; central conflict={CONFLICT}; comic turn={TURN}; verified CORE9 source excerpt={SOURCE_EXCERPT}; characters={CHARACTERS}. Only use the excerpt as methodological authority; do not invent CORE9 definitions. OUTPUT a ready-to-record script of roughly 600–750 spoken words with SPEAKER labels and brief non-spoken audio cues. Start mid-conflict within 10 seconds. Escalate the misunderstanding three times. Include 2–4 short laugh lines, a credible emotional truth, a role reversal, and a strong final punchline. Make characters sound like real people: short lines, interruptions, varied sentence lengths, no exposition dumps. At most one CORE9 insight, explained in ordinary language. Never turn the story into therapy, diagnosis, financial advice or a real testimonial. The script should stand alone, including if listeners never hear the other show. Include a 1-sentence source fidelity note AFTER the script, not spoken. Mark all factual or methodological claims requiring human verification. Finish with an optional 5-second neutral outro. Do not add a long CTA. Target 4:30–5:30 actual finished audio. If script lacks conflict, rewrite before output.

## MASTER PROMPT C — Script quality critic
Review this script as a demanding comedy editor and CORE9 source checker. Score 1–5 each: instant hook, recognizable situation, natural dialogue, conflict escalation, comic reversals, character consistency, empathy, distinctiveness, non-stereotyping, one truthful CORE9 insight, and ending. Quote specific weak lines. Check each methodological claim against the supplied verified source; mark unsupported claims. Rewrite weak sections without changing approved methodology. Reject if any category below 3 or source claims unsupported. Return revised script and a short QA report.

## MASTER PROMPT D — Audio performance and edit
Generate distinct, natural English voices, consistent per character across episodes. Use brisk conversational timing and subtle reactions, but do not accelerate to unintelligibility. Keep laughter authentic and sparse; avoid laugh tracks. Apply level normalization, remove harsh sibilance and dead air, and ensure names are pronounced consistently. Verify spoken duration 4:30–5:30, no clipped dialogue, no long silence, and no artificial robotic cadence. Use only commercially licensed voice/music/sound assets. Export high-quality master and distribution MP3. Do not use voice clones without documented permission.

## MASTER PROMPT E — Episode metadata
Using the final approved script, output: (1) 45–70-word playful episode teaser with no spoilers; (2) 1-sentence short summary; (3) 3–5 topical tags; (4) a clean, readable transcript preserving exact spoken dialogue; (5) a 90–130-word newsletter blurb with one primary link placeholder `{EPISODE_URL}`; (6) one related-episode suggestion based on actual published inventory; (7) SEO title and meta description under 160 characters. Never invent a live link or claim that an unpublished episode exists.

## MASTER PROMPT F — Continuous topic replenishment
When the unused idea queue falls below 10 topics per show, create 15 new candidate topics for each show. Compare against all published and queued episodes; reject duplicates, clichés and stale references. Rotate across CORE9 functions, conflicts and life settings without mechanically labeling each episode by function. Generate paired perspectives for no more than half of topics. Producer selects 10 per show and adds to CMS queue. Keep a record of rejected ideas to avoid repeats. No founder review unless major creative direction changes.

## Production notes
If an AI audio tool cannot guarantee scripted named characters, multiple distinct voices or exact duration, use it for idea exploration only. For final episodes use a script-controlled text-to-speech/audio workflow with stable character voices, audio editing, and manual quality checks. Do not assume NotebookLM can satisfy these controls.

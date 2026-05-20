<!--
last_updated: 2026-05-19
updated_by: research-agent (general-purpose)
status: active
-->

# Open-Source Dev-Tool Landing Page Survey — for Bug-Fab

Research output from background agent on 2026-05-19. Brief: survey best-in-class open-source dev-tool landing pages, extract patterns to steal for Bug-Fab. Target aesthetic: Awwwards-tier, bold, willing to use 3D/WebGL. Brand voice: apolitical, friendly, self-deprecating hobbyist ("Don't bash me" energy).

---

## Linear — [linear.app](https://linear.app)

- **Hero:** Inter (custom-tightened), ~96px display weight 500, tight tracking. Subhead in mid-gray. Single-screen, low copy density.
- **Scroll:** Section reveals with subtle fade+rise; sticky horizontal product slabs; gradient orb parallax that follows scroll.
- **Show-the-product:** Looping silent MP4s of the actual UI inside a rounded "device" frame with a faint inner glow border.
- **Color:** Near-black `#08090A`, electric purple/blue gradient sphere as anchor; 2025 update stripped most color out — mostly mono with a single accent per section.
- **Distinctive:** The hero "aurora" — a giant blurred radial gradient drifting behind the H1, the single visual that everyone copies.

## Vercel — [vercel.com](https://vercel.com)

- **Hero:** Geist Sans (their own), ~80px weight 600, very tight leading. Geist Mono for kbd/code accents.
- **Scroll:** Snap-to "deploy timeline" section, bento grid of feature tiles with looping micro-videos.
- **Show-the-product:** A real terminal-style `git push` → preview-URL animation. Triangle prism hero visual with subtle volumetric light.
- **Color:** Pure `#000` / `#fff` only; chromatic prism is the _only_ color. Forced dark via `color-scheme: dark`.
- **Distinctive:** ASCII-shader hero variants and the chromatic triangular prism that refracts on cursor proximity.

## Resend — [resend.com](https://resend.com)

- **Hero:** Inter Display, large + tight; tagline "Email for developers" in pure white on near-black.
- **Scroll:** Quiet, classy — sections separated by horizontal hairlines; minimal motion.
- **Show-the-product:** Physical 3D objects (Rubik's-cube-era, now wax-seal/letter-press 3D renders). Tangible "this is mail" metaphors.
- **Color:** Dark-mode-first; "Eggshell" warm white, "Iron" / "Stone" / "Zinc" grays, gradient washes for premium texture.
- **Distinctive:** Every section anchored by a tactile 3D render — they sell email by making bytes feel physical. ([rebrand notes](https://resend.com/blog/rebranding-resend))

## tldraw — [tldraw.com](https://tldraw.com)

- **Hero:** The entire homepage IS the product — you land directly in an editable canvas. No traditional hero.
- **Scroll:** N/A — single-screen app surface. Marketing copy is hand-drawn sticky notes inside the canvas.
- **Show-the-product:** Zero abstraction. The "demo" is the live tool itself, complete with multiplayer cursors.
- **Color:** Light-mode default, chalky off-white canvas, primary colors used like a kid's marker set.
- **Distinctive:** No landing page at all — radical confidence that the product sells itself in 3 seconds.

## Trigger.dev — [trigger.dev](https://trigger.dev)

- **Hero:** Geist-ish sans, hero anchored by an animated DAG/flow diagram of running jobs.
- **Scroll:** Section-locked scroll: code block on left morphs while a visual run-graph on right animates step-by-step.
- **Show-the-product:** Live-looking "Run" timeline with nodes pulsing as they "execute" — fake but convincing real-time.
- **Color:** Black background, neon mint/lime accent — single bright color against full mono.
- **Distinctive:** The pulsing job-graph in the hero — workflow as kinetic sculpture.

## Liveblocks — [liveblocks.io](https://liveblocks.io)

- **Hero:** Suisse Int'l, generous weight 500 display + Suisse Mono. Crisp Swiss feel.
- **Scroll:** Each section is itself a working collaborative demo (cursors, comments, threads moving as you scroll).
- **Show-the-product:** Multiplayer cursors with fake-user names dart across the page — visitor's own cursor joins.
- **Color:** Off-white light mode with one accent per section (rose, indigo, amber) — rotating palette.
- **Distinctive:** Real interactive cursors on the marketing page — the page IS a multiplayer room. ([reference](https://a-fresh.website/websites/liveblocks-3))

## Inngest — [inngest.com](https://inngest.com)

- **Hero:** Bold sans, hero copy "however it's written, wherever it runs." Code snippet beside hero showing `step.run`.
- **Scroll:** Tabbed code playgrounds, animated function-call traces that draw themselves on viewport entry.
- **Show-the-product:** Live-trace visualizations — function steps connected by drawn lines, replays on hover.
- **Color:** Deep navy/black with matrix-green accent (rotating to violet in 2025 refresh).
- **Distinctive:** The auto-drawing trace diagram that turns "durable execution" from jargon into a watchable animation.

---

## Patterns to steal for Bug-Fab

1. **Live multiplayer cursors on the marketing page** (Liveblocks) — show a fake "bug report being filed" with cursors and a screenshot annotation happening in real time as visitors land.
2. **Hero IS the product** (tldraw) — instead of a screenshot, open with a fully interactive Bug-Fab report form pre-filled with a funny fake bug ("the cat walked on my keyboard"). Submit button leads to the demo.
3. **Auto-drawing trace/flow diagram** (Inngest, Trigger.dev) — animate the bug-report lifecycle (Captured → Annotated → Filed → Triaged) drawing itself on scroll.
4. **Tactile 3D object as anchor** (Resend) — render a chunky 3D "bug specimen jar" or pinned beetle as the hero centerpiece. Plays into the "Fab" / craft hobbyist tone without being corporate.
5. **Single bright accent on near-black** (Linear, Trigger) — pick ONE Bug-Fab accent (lime/acid yellow suits "don't bash me" energy), use it ruthlessly against `#08090A`.
6. **Looping silent UI MP4s in rounded device frames with inner glow** (Linear) — the cheapest premium signal that exists; far better than static screenshots.
7. **Self-deprecating microcopy in monospace** (Geist Mono / JetBrains Mono) interleaved with display sans — code-comment style asides like `// it's just a hobby project, be nice` reinforce the voice.
8. **Aurora/radial gradient drifting behind H1** (Linear) — one giant blurred orb that subtly tracks the cursor. Cheap to build, instantly "expensive" looking.

**Bonus for the Awwwards tilt:** combine #1 and #2 — the landing page is a Bug-Fab room where the visitor can actually file a meta-bug _about the landing page itself_, and the report shows up in a public wall scrolling below. That's the single move that gets the award.

---

## Sources

- [The rise of Linear style design — Medium](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- [Linear design trend — LogRocket](https://blog.logrocket.com/ux-design/linear-design/)
- [Vercel Hero Gallery breakdown](https://hero.gallery/hero-gallery/vercel)
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
- [Rebranding Resend](https://resend.com/blog/rebranding-resend)
- [Liveblocks landing page inspiration — a-fresh](https://a-fresh.website/websites/liveblocks-3)
- [Inngest homepage](https://www.inngest.com/)
- [tldraw site](https://tldraw.com)

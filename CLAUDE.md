# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`SITE-BUG-FAB` is the public marketing/landing website for the parent open-source project **Bug-Fab** — a framework-agnostic, drop-in floating-action-button bug-reporter for web frontends.

- **Parent project workspace:** `C:\Users\Andrew\Project\PERSONAL\PUBLIC\BUG-FAB\` (separate Claude Code session, separate CLAUDE.md, strict public/private split)
- **Parent's public GitHub repo:** https://github.com/AZgeekster/Bug-Fab
- **Parent's live demo:** https://bug-fab.fly.dev/
- **This site's goal (Andrew's words):** "the fanciest, most sophisticated website we can" for Bug-Fab. Awwwards-tier design bar. Not a generic SaaS landing page.

As of 2026-05-19, **no application code has been written yet** — only research docs and credentials. The decisions below define the chosen direction; treat the research docs in `docs/research/` as the canonical reasoning behind them.

## Cross-project boundary

The parent BUG-FAB workspace has a strict public/private split (its outer dir holds private planning docs naming Shortridge, consumer projects, internal infra; its inner `repo/` is the public GitHub repo). **This site is the public face of the parent.** When pulling content into this site:

- Anything already in `BUG-FAB/repo/` is publishable — quote it freely.
- Anything in `BUG-FAB/docs/`, `BUG-FAB/notes/`, or `BUG-FAB/PROGRESS.md` is **private** — never copy text from those into this site. No client names (Shortridge), no consumer project names (Inventory, Cal-current, TownHall, etc.), no internal infrastructure references.
- Treat the parent workspace as **read-only** when working from this session. Edits to the parent happen from a session opened there.

## Tech stack (decided, see `docs/research/`)

- **Framework:** Astro 6.1, static output, with one React or Svelte island for the interactive hero. Chosen for zero-JS-by-default bundle and clean vanilla-bundle embedding (no hydration model to fight).
- **Motion kit:** GSAP 3.13 (free under MIT since Apr 2025) + ScrollTrigger + Flip + Lenis (~3 KB smooth scroll) + native CSS scroll-driven animations + View Transitions API. Total first-paint critical JS target: ~60 KB gzipped.
- **3D / illustration (optional, lazy-loaded behind viewport triggers):** Three.js + R3F + drei for WebGL, Rive for interactive vector. Skip Spline (runtime cost) and Theatre.js (unneeded complexity).
- **Hero centerpiece (chosen direction):** the actual Bug-Fab vanilla-JS FAB widget runs live on this page. Visitors can fire a real (sandboxed) report. "Show, don't tell." Likely combined with a tactile 3D anchor (per Resend pattern) + live multiplayer cursors (per Liveblocks pattern) — visitors file a meta-bug about the landing page itself.

Don't re-litigate these decisions without reading the research docs first; they exist precisely so future sessions don't repeat the survey.

## Brand voice (inherited from `BUG-FAB/CLAUDE.md`)

- **Apolitical, friendly, self-deprecating.** "A hobbyist who happens to also use this at their day job." The parent README literally says "Don't bash me."
- **No corporate framing.** This is a personal open-source tool, not an enterprise product. Closer to tldraw than to Pendo.
- **Names that read OK on a resume.** Variables, error messages, microcopy all stay neutral and professional. No jokes that age badly.
- **Tone in copy:** code-comment style asides (`// it's just a hobby project, be nice`) in monospace, interleaved with confident display sans for the actual product claims.

## Hosting / deploy

- **Target:** Fly.io, **co-located with the parent's live demo** at `bug-fab.fly.dev`. Same platform, same CLI, same mental model.
- **Why not DO droplet:** considered and rejected — running both Bug-Fab and its site on one platform beats nginx-on-a-droplet operational debt. (See memory `project-site-bug-fab-overview` for the trade-off.)
- **Deploy story:** Astro static build → `nginx:alpine` Dockerfile → `fly deploy` from project root. `fly.toml` defines the app.
- **DNS:** TBD — likely a subdomain off Bug-Fab's domain or a new short domain.

## Sensitive files (per Andrew's global CLAUDE.md)

The following are gitignored and **must never be committed**:

- `docs/logins.md`
- `docs/credentials.md`
- `docs/secrets.md`
- `docs/apis.md`

`.gitignore` already covers these. Save any new credentials to `docs/logins.md` (per memory `feedback-credential-save-location` — credentials always go in the _current_ project's `docs/`, never in the source project the credential belongs to).

A DigitalOcean API token currently lives in `docs/logins.md` from earlier in the session. It's not load-bearing for this site (we're on Fly) but is kept for general infrastructure use.

## Documentation conventions (per Andrew's global CLAUDE.md)

Every file in `docs/` opens with a metadata header:

```
<!--
last_updated: YYYY-MM-DD
updated_by: [agent name or "human"]
status: draft | active | stale | archived
-->
```

Standard subfolders Andrew expects:

- `docs/plans/` — implementation plans saved as `YYYY-MM-DD_description.md` **before** executing; rename with `_DONE` suffix when complete. Never execute a plan without saving it first.
- `docs/audits/` — audit findings as `YYYY-MM-DD_name_audit.md` with companion `_fixes.md`. Update audit findings `OPEN → IN PROGRESS → FIXED` as fixes land.
- `docs/research/` — discovery output (currently 3 files from the 2026-05-19 launch). Not in Andrew's global standard but established for this project.
- `docs/tracking/` — `status.md`, `todo.md`, `gaps.md`, `agent_log.md`. Not yet created here.

## Where things stand (2026-05-19)

**The site is built and ready to deploy.** All 11 plan phases shipped in one session. Full per-phase status in `docs/plans/2026-05-19_build-bug-fab-site.md`. Highlights:

- Astro 6.3.5 static site, single page, ~50 KB critical JS (GSAP + ScrollTrigger + Lenis), ~600 KB total with lazy iframe.
- Specimen-drawer aesthetic — Fraunces display H1 + JetBrains Mono everywhere else, acid-lime `#d4ff00` accent on warm pitch-black, hand-drawn SVG beetle as brand totem.
- **The actual Bug-Fab FAB widget runs live in the corner**, wired to `https://bug-fab.fly.dev/api/bug-reports`. Reports land in the public viewer.
- Awwwards moves: breathing aurora, drifting fake-user cursors with occasional "filed a bug" bubbles, cursor-tracked CSS 3D specimen card, animated lifecycle diagram, hover-pin feature tiles.
- Deploy infra ready (`Dockerfile`, `nginx.conf`, `fly.toml` mirroring parent's sjc/shared/1/256). First deploy: `flyctl launch --no-deploy && flyctl deploy`.

**To preview locally:** `npm run dev` → http://localhost:4321.

**To deploy:** `npm run sync:bugfab && flyctl deploy` (or `./scripts/deploy.sh`).

**What's deferred to post-deploy:**
- OG image PNG (`/og.png` is referenced in meta but the file doesn't exist yet)
- Lighthouse pass (verify ≥ 95 across all categories from PageSpeed Insights once live)
- Public reports wall currently iframes `bug-fab.fly.dev/admin/bug-reports/`. Could be upgraded to a custom card grid if/when the viewer exposes a JSON listing endpoint.
- Rive bug-mascot was in the original plan but dropped — two visual moves (cursors + specimen) carry the page

## Global conventions still apply

Andrew's `~/.claude/CLAUDE.md` (task-list usage, session continuity via `PROGRESS.md`, plan-mode discipline, "save plan before executing", credential file conventions, etc.) applies here. This file augments, doesn't replace.

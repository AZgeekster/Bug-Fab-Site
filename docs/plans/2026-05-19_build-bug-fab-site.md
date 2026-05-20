<!--
last_updated: 2026-05-19
updated_by: claude
status: active
-->

# Plan: Build the Bug-Fab marketing site (`SITE-BUG-FAB`)

_Canonical plan copy. Original approved at `~/.claude/plans/crystalline-greeting-lemur.md` on 2026-05-19. Rename this file to add `_DONE` suffix when execution completes._

## Context

`SITE-BUG-FAB` is the public marketing/landing site for the parent open-source project **Bug-Fab** (a framework-agnostic in-app bug-reporter — repo at `BUG-FAB/repo/`, live demo at `bug-fab.fly.dev`). The user's brief is "the fanciest, most sophisticated website we can" — Awwwards-tier, willing to use 3D/WebGL, with the actual Bug-Fab vanilla-JS FAB widget embedded live in the hero so visitors can fire a real (sandboxed) report against the demo's public intake.

Hosting target is **Fly.io**, co-located with `bug-fab.fly.dev`, on the default `*.fly.dev` subdomain (no custom domain for v1). Stack is **Astro 6.1 static**, with **GSAP + Lenis + native CSS scroll-driven animations** for motion, plus optional lazy-loaded **R3F / Rive** for 3D and the bug-mascot (3D model sourced CC-0 from Sketchfab / Poly Haven). Brand voice (inherited from parent CLAUDE.md): apolitical, friendly, self-deprecating — "vibe-coded by a hobbyist, don't bash me." Single bright accent on near-black, monospace asides, no enterprise-purple. Research backing this lives in `SITE-BUG-FAB/docs/research/` (four files dated 2026-05-19: reference sites, tech stack, motion libraries, competitors).

The project currently contains only `docs/` and `.gitignore`. This plan scaffolds the Astro project, builds out content + motion in phases, wires the live FAB widget to the demo's intake, and ships to Fly.io.

## Phase summary

1. **Phase 0** — scaffold Astro project + tooling
2. **Phase 1** — sync bug-fab.js bundle from parent repo
3. **Phase 2** — design tokens, layout, fonts
4. **Phase 3** — hero (static-feel version)
5. **Phase 4** — content sections (install, features, framework support, footer)
6. 🛑 **CHECKPOINT** — confirm Phase-4 baseline before Phase 5+
7. **Phase 5** — motion layer (Lenis, GSAP entrance, ScrollTrigger reveals, lifecycle diagram)
8. **Phase 6** — awwwards moves (live cursors, 3D bug specimen, Rive mascot)
9. **Phase 7** — public reports wall
10. **Phase 8** — deploy infrastructure (Dockerfile, fly.toml, deploy)
11. **Phase 9** — SEO, OG image, favicon, Lighthouse pass
12. **Finalize** — run `/finalize` skill

## Existing patterns

- **Parent project Fly deploy** — `BUG-FAB/repo/fly.toml` already defines a Fly app: 1 CPU / 256 MB shared, `auto_stop_machines = "stop"`, volume at `/data`. Mirror this for the marketing site (no volume needed since static).
- **Bug-Fab vanilla-JS install pattern** — `BUG-FAB/repo/static/README.md` documents two styles. We use the explicit-init style (set `window.BugFabAutoInit = false` first, then call `BugFab.init({ submitUrl: 'https://bug-fab.fly.dev/api/bug-reports', ... })`).
- **Brand voice / public-facing copy** — `BUG-FAB/repo/README.md` is canonical. Lift tagline + feature list verbatim. **Do not lift from `BUG-FAB/docs/`, `BUG-FAB/notes/`, or `BUG-FAB/PROGRESS.md`** — private (see `SITE-BUG-FAB/CLAUDE.md` § "Cross-project boundary").
- **No analogous Astro projects** in this workspace. Starting fresh — no local conventions to mirror.

## Critical reference files

- `BUG-FAB/repo/static/bug-fab.js` (83 KB pre-built) — copy to `public/bug-fab/static/bug-fab.js` at build time.
- `BUG-FAB/repo/static/vendor/html2canvas.min.js` (198 KB) — also copy.
- `BUG-FAB/repo/static/README.md` — FAB init API reference.
- `BUG-FAB/repo/README.md` — tagline + feature list source.
- `BUG-FAB/repo/docs/{INSTALLATION,PROTOCOL,DEPLOYMENT_OPTIONS,ADAPTERS,ROADMAP,FAQ}.md` — link from site, don't embed.
- `BUG-FAB/repo/fly.toml` — reference for fly.toml config style.
- `SITE-BUG-FAB/docs/research/*` — four research docs; don't contradict without good reason.

---

(Full per-phase detail is in the approved plan at `~/.claude/plans/crystalline-greeting-lemur.md`. This file is the project-local index. Update each phase's status here as it completes.)

## Status

| Phase                   | Status     | Notes                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 Scaffold              | ✅         | Astro 6.3.5, GSAP 3.15, Lenis 1.3.23, Fraunces + JetBrains Mono via Astro Fonts API                                                                                                                                                                                                                                  |
| 1 Sync bundle           | ✅         | `scripts/sync-bug-fab.mjs` copies `bug-fab.js` (81 KB) + `html2canvas.min.js` (194 KB) + records source SHA                                                                                                                                                                                                          |
| 2 Design tokens / fonts | ✅         | tokens.css with specimen-drawer palette (`#0a0a0a` / `#e8e6e1` / `#d4ff00`); Geist-free, Inter-free                                                                                                                                                                                                                  |
| 3 Hero                  | ✅         | HeroAurora (CSS-only breathing radial), TopBar (pinned-beetle SVG mark), Hero (Fraunces display H1 + JetBrains Mono), live BugFabEmbed wired to bug-fab.fly.dev intake                                                                                                                                               |
| 4 Content sections      | ✅         | InstallSnippet (3 tabs, copy buttons), Features (6-tile bento, hover-pin), FrameworkSupport (8-row adapter table), AntiPitch (10 anti-conventions), Footer                                                                                                                                                           |
| 5 Motion layer          | ✅         | Lenis smooth scroll + GSAP hero entrance (line stagger) + ScrollTrigger section reveals + Lifecycle SVG (stroke-dashoffset, IntersectionObserver, no DrawSVG plugin). `motion-on` html class gates initial-hidden CSS so reduced-motion never flickers. ~50 KB gzipped critical JS.                                  |
| 6 Awwwards moves        | ✅         | FakeCursors (4 named cursors, bezier drift, occasional "filed a bug" bubble); Specimen (hand-drawn SVG beetle, cursor-tracked CSS 3D rotation, independent elytra parallax). Rive mascot deferred — two moves carry the page. R3F + Three.js dropped in favor of layered SVG (zero framework cost, better brand fit) |
| 7 Public reports wall   | ✅         | Lazy-loaded iframe of `bug-fab.fly.dev/admin/bug-reports/` with specimen-plate corner ticks. Authentic over re-skinned                                                                                                                                                                                               |
| 8 Deploy infra          | ✅         | Two-stage Dockerfile (node:22-alpine → nginx:alpine), nginx.conf with gzip + immutable caching for `_astro` + CSP allowing `bug-fab.fly.dev`, fly.toml mirroring parent (sjc, shared/1/256, auto-stop), scripts/deploy.sh wrapper                                                                                    |
| 9 SEO / Lighthouse      | ✅         | favicon.svg (pinned-beetle in accent), robots.txt, sitemap.xml, NoScriptNotice. OG image PNG and Lighthouse run deferred to post-deploy.                                                                                                                                                                             |
| Finalize                | ⏳ pending | `/finalize` skill next                                                                                                                                                                                                                                                                                               |

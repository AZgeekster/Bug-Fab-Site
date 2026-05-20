# Bug-Fab — marketing site

Public landing page for [Bug-Fab](https://github.com/AZgeekster/Bug-Fab), a drop-in floating-action-button bug-reporter for web frontends.

- **Live:** https://bugfab-site.fly.dev (TBD after first deploy)
- **Parent project:** https://github.com/AZgeekster/Bug-Fab
- **Live product demo:** https://bug-fab.fly.dev/

## Develop

```bash
npm install
npm run dev   # opens http://localhost:4321
```

The dev / build scripts auto-run `npm run sync:bugfab`, which copies the pre-built `bug-fab.js` bundle (and its `html2canvas` vendor dependency) from the sibling `../BUG-FAB/repo/static/` into `public/bug-fab/`. After pulling parent-repo updates, restart `npm run dev` (or just `npm run sync:bugfab`) to pick them up.

## Build

```bash
npm run build      # output to ./dist
npm run preview    # serve dist locally
```

## Deploy

First time only:

```bash
flyctl launch --no-deploy   # creates the app, assigns *.fly.dev domain
```

Every deploy after that:

```bash
npm run sync:bugfab   # refresh the bundle from ../BUG-FAB/repo (do this BEFORE Docker build, since the Docker context doesn't include the parent repo)
flyctl deploy
```

Or use the wrapper:

```bash
./scripts/deploy.sh
```

The deploy ships a two-stage Docker build (Node 22 → nginx alpine) on a Fly shared/1/256 machine in `sjc`. Auto-stops when idle; first request after sleep is a 1–3s cold start. Same region + machine class as the parent Bug-Fab POC for operational consistency.

## Layout

```
src/
  pages/index.astro       # the whole site (single page)
  layouts/Base.astro      # html shell, fonts, meta
  components/             # Hero, InstallSnippet, Features, etc.
  styles/                 # tokens.css, reset.css, global.css
public/
  bug-fab/                # synced from ../BUG-FAB/repo/static (gitignored)
scripts/
  sync-bug-fab.mjs        # the sync script
docs/
  plans/                  # implementation plans
  research/               # 2026-05-19 research lanes (refs, stack, motion, competitors)
  logins.md               # gitignored credentials
```

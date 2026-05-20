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

## Deploy (co-hosted with the parent Bug-Fab demo)

This site is co-hosted on the **same Fly app** as the live Bug-Fab demo (`bug-fab.fly.dev`) to save a second machine. Marketing site at `/`, playground at `/playground/`, `/api/*` and `/admin/bug-reports/*` are owned by the parent's FastAPI app.

Deploy flow:

```bash
npm run build:cohost                    # build + sync dist/ → ../BUG-FAB/repo/marketing-dist/
cd ../BUG-FAB/repo && flyctl deploy     # parent's existing flyctl pipeline ships the merged image
```

**Before first deploy** the parent project needs to know how to serve `marketing-dist/`. See [`docs/plans/2026-05-20_cohost-handoff.md`](docs/plans/2026-05-20_cohost-handoff.md) for the three small edits to make in `BUG-FAB/repo/` (main.py + Dockerfile + .gitignore). Do those once, in a Claude session rooted in the parent.

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

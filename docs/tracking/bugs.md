<!--
last_updated: 2026-05-20
updated_by: claude
status: active
-->

# Open bugs — SITE-BUG-FAB

## ✅ BUG-001 — Live FAB does nothing on dev server

**Reported:** 2026-05-20 by Andrew
**Severity:** Critical (the FAB is the centerpiece of the site)
**Status:** **FIXED** 2026-05-20 — same-origin proxy added (see § Fix below)

### Fix applied

**Root cause confirmed: CORS.** The upstream FastAPI app at `bug-fab.fly.dev` (parent project's `examples/error-playground/main.py`) has **no CORS middleware**. Browser blocks any cross-origin POST from `localhost:4321` *or* the planned production `bug-fab-site.fly.dev` — this would have broken production too, not just dev.

**Fix: same-origin reverse proxy for `/api/*`.** Three changes in commit (this commit):

1. `astro.config.mjs` — added `vite.server.proxy` for `/api` → `https://bug-fab.fly.dev` (dev mode).
2. `nginx.conf` — added `location /api/` reverse_proxy block with DNS resolver + SNI (production mode).
3. `src/components/BugFabEmbed.astro` — changed `submitUrl` from `https://bug-fab.fly.dev/api/bug-reports` to relative `/api/bug-reports`. Also dropped `defer` on the bundle script and removed the DOMContentLoaded wrapper since sync loading guarantees `window.BugFab` is defined by the next inline `<script>`.

**Verification:** `curl http://localhost:4321/api/bug-reports` returns HTTP 405 (Method Not Allowed) from the upstream FastAPI app — proves the dev proxy is reaching `bug-fab.fly.dev`. Page + bundle still serve cleanly (HTTP 200).

**Side benefit:** CSP `connect-src` could be tightened from `'self' https://bug-fab.fly.dev` to `'self'` — the browser only ever sees same-origin fetches now.

**Caveat:** the in-browser smoke test still needs to happen — `curl` proved the proxy works at the network layer, but only a real browser click → annotate → submit confirms the end-to-end flow. See [[feedback-smoke-test-widget-integration]].

### Follow-up 2026-05-20: same-origin via co-host instead

The proxy fix was correct but became obsolete the same day. Andrew chose to **co-host the marketing site on the same Fly app as the parent Bug-Fab demo** to avoid a second machine. That makes `/api/bug-reports` genuinely same-origin without needing a reverse proxy. The standalone deploy artifacts (`Dockerfile`, `nginx.conf`, `fly.toml`, `.dockerignore`, `scripts/deploy.sh`) were deleted in the co-host migration. The Vite dev proxy in `astro.config.mjs` stays — dev still talks to the live FastAPI app at `bug-fab.fly.dev` over the proxy so `npm run dev` works without running the FastAPI locally.

Co-host execution plan: `docs/plans/2026-05-20_cohost-handoff.md` (parent-side wiring; cross-boundary from a parent-rooted session).

**Deployed 2026-05-20.** `https://bug-fab.fly.dev/` now serves the marketing site, `/playground` serves the error-button demo, `POST /api/bug-reports` returns 422 on empty body (route exists, FAB will work).

### Real root cause (revealed by in-browser test)

The CORS/proxy/co-host work was all valuable but **none of it was the actual blocker.** Once the user clicked the FAB on the deployed site, the real failure surfaced in the console:

> `Bug-Fab screenshot failed: Attempting to parse an unsupported color function "color"`

**Diagnosis:** the FAB's screenshot step uses `html2canvas` v1.4.1 (the version vendored in the parent's `static/vendor/`), which doesn't support the modern CSS `color-mix()` function. Our `tokens.css` and several component stylesheets used `color-mix(in srgb, var(--accent) N%, transparent)` extensively to derive alpha-modulated accent variants — and `html2canvas` bails on the very first `color-mix()` it encounters while serializing the page CSS for canvas rendering.

The library is effectively unmaintained (last 1.4.x release April 2022) so this won't get fixed upstream.

**Fix:** replaced all 10 `color-mix()` usages with plain `rgba()` equivalents (numerically identical output). New named tokens in `tokens.css` cover the previously-inline tints (`--accent-tint-3`, `--accent-tint-4`, `--accent-tint-6`, `--amber-tint-6`, `--amber-glow-65`, `--amber-transparent`). Build + deploy was a no-op infrastructure-wise; the only behavioral change is that html2canvas can now finish parsing the CSS.

**Lesson:** see [[feedback-html2canvas-css-limits]].

---

## 🟡 BUG-002 — `/admin/bug-reports/` (with trailing slash) 404s after co-host

**Reported:** 2026-05-20 by Claude during deploy verification
**Severity:** Low (affects only legacy URL form; the canonical `/admin/bug-reports` works fine)
**Status:** Worked around on our side; parent-side fix remains TODO

### Diagnosis

The parent's `viewer.viewer_router` is included at prefix `/admin/bug-reports`, so its root endpoint registers as exact path `/admin/bug-reports` (no trailing slash). Before the co-host, a request to `/admin/bug-reports/` (with slash) would get a 307 redirect to the canonical path via FastAPI's `redirect_slashes=True`. After the co-host, the static marketing-site mount at `/` (with `html=True`) intercepts `/admin/bug-reports/` first, treats it as a file-lookup in `marketing-dist/admin/bug-reports/`, doesn't find anything, returns 404.

### Workaround (this side, applied)

`src/components/PublicWall.astro` now uses `/admin/bug-reports` (no slash) for both the iframe `src` and the caption link.

### Real fix (parent side, follow-up)

Either:
- Add an explicit `@app.get("/admin/bug-reports/")` route in `examples/error-playground/main.py` that returns a `RedirectResponse("/admin/bug-reports", status_code=307)`, registered BEFORE the static mount. Or
- Update the playground HTML (`DEMO_PAGE` in `examples/error-playground/main.py` lines 136 and 189) to drop the trailing slash so the legacy form is never used.

Either is a one-line change in the parent repo. Tracked here so a future parent-session Claude finds it without re-investigating.

### Symptom

User clicked the floating bug-report button at the bottom-right of `http://localhost:4321/` and "it didn't report or work." Exact failure mode unclear — could be (a) FAB not visible, (b) click does nothing, or (c) overlay opens but submit fails. Resolve this ambiguity FIRST before chasing a specific cause.

### What's verified

- `GET /bug-fab/static/bug-fab.js` returns HTTP 200 + 83 KB — bundle is served.
- Bundle source exposes `window.BugFab` and auto-inits on `DOMContentLoaded` unless `window.BugFabAutoInit === false` is set first (verified at lines 2334, 2343–2356 of `public/bug-fab/static/bug-fab.js`).
- `BugFabEmbed.astro` does set `BugFabAutoInit = false` in inline script before the deferred bundle script.
- Initial commit `096d173` on `main`.

### Hypotheses (in order of likelihood)

1. **CORS** — dev page at `localhost:4321` POSTs cross-origin to `https://bug-fab.fly.dev/api/bug-reports`. The Fly intake server may not allow `localhost` origin. Test: open DevTools → Network → click FAB → submit → check for CORS error.
2. **Astro script load race** — Vite/Astro dev may reorder `<script is:inline>` tags vs the deferred bundle. Test: in DevTools console after page load, type `window.BugFab` — if `undefined`, the bundle didn't load before our init handler.
3. **CSP** — only applies in production via `nginx.conf`. On dev, no CSP active. Eliminate unless reproducing in production.
4. **Bundle's own init failed** — check console for `[bug-fab]` warnings.
5. **`html2canvas` lazy-load 404** — bundle fetches `/bug-fab/static/vendor/html2canvas.min.js` on first FAB click. We DO sync this file. Verify it's served.

### Next investigation steps

1. Ask user to open DevTools (F12), click FAB, and share console + network errors.
2. If `window.BugFab` is undefined post-load, the script-order assumption is wrong.
3. If FAB appears but submit fails with CORS: either (a) self-host the intake (add a Bug-Fab Python adapter to the marketing site's deploy), or (b) request the parent project add `Access-Control-Allow-Origin: *` to its intake.
4. Fallback approach for testing: switch `BugFabEmbed.astro` from explicit init to the data-attribute style (`<script src="..." data-submit-url="https://bug-fab.fly.dev/api/bug-reports" defer></script>`). If that works, the explicit-init code path is buggy.

### Files implicated

- `src/components/BugFabEmbed.astro` — our init wiring
- `public/bug-fab/static/bug-fab.js` — bundle (synced, do not edit; if it's buggy, fix in parent repo and re-sync)

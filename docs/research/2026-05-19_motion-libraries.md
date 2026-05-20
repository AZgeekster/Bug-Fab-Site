<!--
last_updated: 2026-05-19
updated_by: research-agent (general-purpose)
status: active
-->

# Motion & Interactivity Libraries for Awwwards-Tier Sites (May 2026)

Research output from background agent on 2026-05-19. Brief: survey current state of motion / interactivity / 3D libraries used on high-end marketing sites, recommend a minimum kit for Bug-Fab.

---

## Animation Engines

**GSAP** — Tweening + timeline engine. Webflow acquired GreenSock (late 2024) and made the **entire library free for all use, including commercial, as of April 30, 2025**. All formerly-Club plugins (ScrollTrigger, SplitText, MorphSVG, Flip, DrawSVG, MotionPath, Physics2D, Inertia) are now free. Core ~35 KB gzipped; ScrollTrigger ~12 KB; Flip ~8 KB. Universal browser support. Reach for it when you need orchestrated, deterministic, scrubbable timelines. Don't reach for it for trivial CSS transitions.

**Motion (formerly Framer Motion)** — v12.39.x. Imports from `motion/react` (or `motion` for vanilla). ~30 KB gzipped full bundle; with `LazyMotion` + `domAnimation` ~15 KB. Use in React for declarative variants, layout animations, and gesture-driven UI. Overkill for non-React or pure scroll work.

**Motion One** — Vanilla WAAPI wrapper by Matt Perry (same author). `animate()` is ~3.8 KB. Modern browser support is universal now that WAAPI is everywhere. Best when you want native performance + tiny footprint, no spring physics needed.

**Anime.js v4** — v4.4.0 (Apr 2026), full rewrite. Modular ESM, tree-shakable; core ~7 KB gzipped. Sweet spot for SVG morphs, staggered DOM animation, timeline composition without GSAP's footprint.

## Scroll

**Lenis** — v1.3.23, ~3 KB gzipped. Still the de-facto smooth-scroll on Awwwards sites in 2026 because native scroll on Windows/trackpad is still inconsistent and Lenis syncs cleanly with GSAP's ticker. **Native CSS `animation-timeline: scroll() / view()`** is Baseline-ish (Chromium + Safari 26; Firefox 144 behind flag), so use CSS scroll-driven for reveal-on-scroll/parallax and reserve Lenis for the _feel_ of the scroll itself.

**View Transitions API** — Same-document = Baseline (Chrome 111, Safari 18, Firefox 144). Cross-document = Chromium-only (Chrome 126+); Safari/Firefox still not shipped. Safe for SPA route swaps; progressive-enhance the cross-doc case.

## 3D / WebGL

**Three.js** r170+ — ~155 KB gzipped core; WebGPU renderer still experimental.
**React Three Fiber** v9.6.x — declarative R3F wrapper, adds ~10 KB on top of Three.
**drei** — helper grab-bag; only import what you use (tree-shakes).
**Theatre.js** — designer-friendly timeline editor for R3F; +~40 KB. Use when the 3D scene needs choreographed cinematic motion.
**Spline `@splinetool/runtime`** v1.12.x — designer-export runtime, **~120–150 KB gzipped plus your `.splinecode` scene**. Fastest path to a hero, worst path to a Lighthouse score.

## Vector / Illustration

**Rive** — ~200 KB gzipped runtime (WASM), but `.riv` files are 10–15× smaller than Lottie JSON and animations are state-machine interactive. Best for the bug-fab logo, CTA micro-interactions.
**Lottie-web** — ~60 KB gzipped, playback-only. Use only if you already have AE assets.

---

## Recommended Minimum Kit for Bug-Fab

1. **GSAP + ScrollTrigger + Flip** (~55 KB) — free now, single source of truth for the hero timeline, section pinning, and the live-demo "before/after" Flip transitions. Works identically in Astro or SvelteKit.
2. **Lenis** (~3 KB) — fixes Windows trackpad scroll-jank that CSS scroll-driven cannot. Syncs with GSAP's ticker out of the box.
3. **CSS scroll-driven animations + View Transitions** (0 KB) — handle 80% of reveal/parallax work natively; reserve GSAP for the bits CSS can't express.
4. **Three.js + R3F + drei** (~180 KB, lazy-loaded behind an Intersection trigger) only if the hero is genuinely 3D. Skip Spline (designer convenience isn't worth the weight on a solo OSS project) and skip Theatre.js unless the scene is cinematic.
5. **Rive** (~200 KB, lazy-loaded) for one hero illustration / interactive bug mascot — its interactivity sells the "fab" in Bug-Fab better than a static Lottie.

**Total first-paint critical JS: ~60 KB gzipped** (GSAP + Lenis). 3D and Rive deferred. Comfortably under any 2 MB ceiling.

---

## Sources

- [GSAP Pricing](https://gsap.com/pricing/)
- [Webflow makes GSAP 100% free](https://webflow.com/blog/gsap-becomes-free)
- [Motion docs / upgrade guide](https://motion.dev/docs/react-upgrade-guide)
- [framer-motion on Bundlephobia](https://bundlephobia.com/package/framer-motion)
- [Motion One intro](https://blog.logrocket.com/exploring-motion-one-framer-motion/)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [lenis on Bundlephobia](https://bundlephobia.com/package/lenis)
- [MDN: scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [caniuse: cross-document view transitions](https://caniuse.com/cross-document-view-transitions)
- [caniuse: animation-timeline scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll)
- [Anime.js v4](https://animejs.com/) / [animejs on Bundlephobia](https://bundlephobia.com/package/animejs)
- [R3F GitHub](https://github.com/pmndrs/react-three-fiber)
- [Rive vs Lottie](https://rive.app/blog/rive-as-a-lottie-alternative)
- [Spline runtime npm](https://www.npmjs.com/package/@splinetool/runtime)
- [Threlte](https://threlte.xyz/)

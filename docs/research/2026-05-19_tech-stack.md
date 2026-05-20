<!--
last_updated: 2026-05-19
updated_by: research-agent (general-purpose)
status: active
-->

# Marketing-Site Tech Stack Comparison — for Bug-Fab

Research output from background agent on 2026-05-19. Brief: compare Astro / Next / SvelteKit / Nuxt / Vite / RR7 for a design-forward marketing site that must embed a vanilla-JS widget (the Bug-Fab FAB) in the hero. Solo hobbyist project, cheap/free hosting preferred.

> **Note:** The agent was given a hosting framing of Vercel / Netlify / Cloudflare Pages / Fly.io free tiers. **The actual hosting decision is Fly.io** (see [[project-site-bug-fab-overview]]). The framework comparison (bundle size, animation ergonomics, widget embedding, SEO, maintenance) is hosting-agnostic and still fully valid. Discount the "Cloudflare Pages" deploy recommendation — Fly will be just as happy serving an Astro static build out of a tiny container.

---

**Current versions verified (May 2026):** Astro 6.1, Next.js 16.2.6, SvelteKit 2.60.1 (Svelte 5.55), Nuxt 4.4, Vite 8.0.13, React Router 7 (framework mode, Remix's successor).

## Scoring (1–5, higher = better)

| Framework         | Bundle | Anim. Ergo | Vanilla Widget | Deploy/Free | SEO | Maint. | **Total** |
| ----------------- | ------ | ---------- | -------------- | ----------- | --- | ------ | --------- |
| **Astro 6.1**     | 5      | 4          | 5              | 5           | 5   | 5      | **29**    |
| Next.js 16        | 2      | 4          | 3              | 4\*         | 5   | 3      | 21        |
| SvelteKit 2.6     | 4      | 5          | 4              | 4           | 5   | 4      | 26        |
| Nuxt 4.4          | 3      | 4          | 3              | 4           | 5   | 3      | 22        |
| Vite + vanilla TS | 5      | 3          | 5              | 5           | 2   | 3      | 23        |
| React Router 7    | 2      | 3          | 3              | 4           | 4   | 3      | 19        |

\*Vercel Hobby is technically personal-use-only; commercial OSS projects are a grey area.

## Notes per option

- **Astro 6.1** ships ~0 KB JS by default; the new Fonts API, stable CSP, and Vite 7/Rolldown pipeline make a 100-post rebuild ~200ms. Islands let you opt in to React/Svelte/Vue _only_ in the hero where you need GSAP/Three. A vanilla bundle drops in as `<script src="bug-fab.js">` with no hydration ceremony at all — best-in-class for the widget-embedding requirement. First-class Cloudflare Workers adapter in v6.
- **Next.js 16** (Turbopack stable, React Compiler stable) is excellent but ships a React runtime regardless. The FAB widget will work but you'll wrap it in a `'use client'` + `useEffect` + `dynamic({ ssr:false })` dance, and you're carrying ~80–100 KB of framework JS for a brochure site. Vercel-first; Cloudflare adapter exists but lags.
- **SvelteKit 2.60 / Svelte 5.55** is the strongest non-Astro pick. Smallest framework runtime of the React-class options, native `svelte/motion` (now exports tween/spring types), excellent transitions. Vanilla bundle embeds cleanly via `onMount`. Works on CF Pages, Vercel, Netlify, Fly equally well.
- **Nuxt 4.4** is solid (typed layout props, ISR payload extraction) but heavier than needed for a marketing page, and the Vue 3rd-party-bundle integration story is fine but not better than Astro+Vue-island.
- **Plain Vite 8** gives you total control and zero framework overhead — but you re-implement routing, head/OG management, sitemap, RSS. Wrong tradeoff for a "1–2 deploys/month" solo project.
- **React Router 7 (framework mode)** is the merged Remix successor. Good DX but same React-runtime cost as Next with a smaller ecosystem of marketing-site primitives. No reason to pick it here over Next.

## Animation / 3D layer (framework-agnostic)

GSAP 3.13 (now MIT-licensed including SplitText/MorphSVG since 2024), Motion One, Lenis for smooth scroll, Three.js / OGL, and native CSS `@scroll-timeline` + View Transitions all work in any of these. Astro/Vite expose them most directly. See [[2026-05-19_motion-libraries]] for the full survey.

## Recommendation

**Primary: Astro 6.1 + a single React (or Svelte) island for the hero, GSAP + Lenis for motion, deployed on Fly.io.** Best bundle, cleanest vanilla-JS embedding (just a `<script>` tag — no hydration model to fight), best SEO/RSS/sitemap story out of the box, lowest maintenance burden for a solo hobbyist. Astro static build → tiny `nginx:alpine` container → `fly deploy`.

**Runner-up:** SvelteKit 2.60 on Fly.io — pick this if you want one unified component model and love Svelte's motion primitives.

**If you want maximum React ecosystem & Vercel previews instead, pick Next.js 16** — accept the bundle cost.

## Sources

- [Astro 6.0 announcement](https://astro.build/blog/astro-6/)
- [What's new in Astro - March 2026](https://astro.build/blog/whats-new-march-2026/)
- [Next.js Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [SvelteKit npm](https://www.npmjs.com/package/@sveltejs/kit) / [What's new in Svelte May 2026](https://svelte.dev/blog/whats-new-in-svelte-may-2026)
- [Announcing Nuxt 4.0](https://nuxt.com/blog/v4) / Nuxt 4.4 release notes
- [Vite 8.0 announcement](https://vite.dev/blog/announcing-vite8)
- [Merging Remix and React Router](https://remix.run/blog/merging-remix-and-react-router)

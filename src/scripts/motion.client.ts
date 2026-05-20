// Motion layer — Lenis smooth scroll + GSAP hero entrance + ScrollTrigger
// section reveals. Loaded once per page from Base.astro.
//
// Skipped entirely when prefers-reduced-motion is set; the `motion-on` html
// class controls the CSS initial-hidden states, so reduced-motion visitors
// never see anything fade in.

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  initLenis();
  initHero();
  initRevealSections();
  initLifecycle();
}

function initLenis() {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function initHero() {
  const lines = document.querySelectorAll<HTMLElement>("[data-anim='hero-line']");
  const extras = document.querySelectorAll<HTMLElement>("[data-anim='hero-fade-up']");
  if (lines.length === 0 && extras.length === 0) return;

  // Stagger the H1 lines up from below, then fade-up everything else.
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.to(lines, { y: 0, opacity: 1, duration: 0.95, stagger: 0.085 }, 0.1).to(
    extras,
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
    0.45,
  );
}

function initRevealSections() {
  const targets = document.querySelectorAll<HTMLElement>("[data-anim='reveal']");
  for (const el of targets) {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });
  }
}

function initLifecycle() {
  const root = document.querySelector<HTMLElement>("[data-lifecycle]");
  if (!root) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 },
  );
  observer.observe(root);
}

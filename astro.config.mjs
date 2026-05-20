import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://bug-fab.fly.dev",
  output: "static",
  trailingSlash: "never",
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },
  // Dev-mode reverse proxy: forward live API + viewer routes to the
  // public Bug-Fab demo so dev mode matches production (where the
  // FastAPI app and the marketing site share an origin).
  vite: {
    server: {
      proxy: {
        "/api": { target: "https://bug-fab.fly.dev", changeOrigin: true, secure: true },
        "/admin": { target: "https://bug-fab.fly.dev", changeOrigin: true, secure: true },
        "/playground": { target: "https://bug-fab.fly.dev", changeOrigin: true, secure: true },
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-display",
      weights: [700, 900],
      styles: ["normal"],
      subsets: ["latin"],
      // Crank the WONK + SOFT axes for specimen-card feel
      variationSettings: '"SOFT" 100, "WONK" 1',
      fallbacks: ["Georgia", "serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
    },
  ],
});

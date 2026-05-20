import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://bugfab-site.fly.dev",
  output: "static",
  trailingSlash: "never",
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
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

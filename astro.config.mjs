// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";

import svelte from "@astrojs/svelte";

export default defineConfig({
  site: "https://lmns.fr",
  integrations: [sitemap(), svelte()],
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "vitesse-light",
        dark: "github-dark",
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
});

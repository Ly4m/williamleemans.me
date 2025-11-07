// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";

import svelte from "@astrojs/svelte";

export default defineConfig({
  site: "https://williamleemans.me",
  integrations: [sitemap(), svelte()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'nord',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
});
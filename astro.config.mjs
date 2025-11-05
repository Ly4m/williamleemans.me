// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";
import rehypeMermaid from "rehype-mermaid";

import svelte from "@astrojs/svelte";

export default defineConfig({
  site: "https://williamleemans.me",
  integrations: [sitemap(), svelte()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["math", "mermaid"],
    },
    rehypePlugins: [[rehypeMermaid, { strategy: "img-svg" }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
});
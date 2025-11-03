// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  site: "https://williamleemans.me",
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["math", "mermaid"],
    },
    rehypePlugins: [rehypeMermaid],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify(),
});

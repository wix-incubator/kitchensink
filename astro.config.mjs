// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    wix(),
    mdx({
      extendMarkdownConfig: false,
      remarkPlugins: [],
      rehypePlugins: [],
    })
  ]
});
// @ts-check
import { defineConfig } from "astro/config";
import wix from "@wix/astro";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://kitchensink-netanelg4.wix-host.com",

  output: "server",

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@wix/image"],
    },
  },

  integrations: [
    react(),
    wix(),
    mdx({
      extendMarkdownConfig: false,
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    sitemap(),
  ],
});

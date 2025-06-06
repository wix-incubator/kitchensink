// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(),wix(),]
});
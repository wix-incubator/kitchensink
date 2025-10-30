// @ts-check
import { defineConfig } from 'astro/config';
import wix from '@wix/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { headlessDocsWrapper } from './docs-wrapper-plugin.ts';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kitchensink-netanelg4.wix-host.com',

  output: 'server',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss(), headlessDocsWrapper()],
    // Bundle @wix/image for SSR compatibility to fix module loading issues
    ssr: {
      noExternal: [
        '@wix/image',
        '@wix/fast-gallery-ui',
        '@wix/fast-gallery-core',
      ],
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

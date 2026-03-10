// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';

import partytown from '@astrojs/partytown';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://mahdikhan.com',
  prefetch: true,
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [react(), expressiveCode(), mdx(), sitemap(), partytown(), pagefind()]
});
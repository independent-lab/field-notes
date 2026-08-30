import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://julessalonga-tech.github.io',
  base: '/field-notes',
  integrations: [mdx(), sitemap()],
  output: 'static',
  markdown: { shikiConfig: { theme: 'github-dark' } },
});

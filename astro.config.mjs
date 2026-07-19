import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkJoinCjkLines from 'remark-join-cjk-lines';
import remarkToc from 'remark-toc';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { SITE_DEFAULT_LANG } from './src/config';

import gruvboxLight from './src/shiki/gruvbox-light.json';
import gruvboxDark from './src/shiki/gruvbox-dark.json';

// Import the mhchem extension.
import 'katex/contrib/mhchem';

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: gruvboxLight,
        dark: gruvboxDark,
      },
    },
    processor: unified({
      remarkPlugins: [remarkMath, remarkToc, remarkJoinCjkLines],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            macros: {
              '\\e': '\\mathrm{e}',
              '\\d': '\\mathrm{d}',
              '\\i': '\\mathrm{i}',
            },
          },
        ],
      ],
    }),
  },
  integrations: [sitemap()],
  site: 'https://earthmessenger.xyz',
  redirects: {
    '/': `/${SITE_DEFAULT_LANG}/`,
    '/about': `/${SITE_DEFAULT_LANG}/about/`,
    '/oi-notes': `/${SITE_DEFAULT_LANG}/oi-notes/`,
    '/tags': `/${SITE_DEFAULT_LANG}/tags/`,
  },
});

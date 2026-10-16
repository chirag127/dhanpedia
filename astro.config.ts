import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/lib/site.ts';

const base = process.env.BASE_PATH ?? '';

// Vite resolve aliases matching tsconfig paths (per-prefix).
const aliases = {
  '@registry': fileURLToPath(new URL('./content-registry', import.meta.url)),
  '@types': fileURLToPath(new URL('./types', import.meta.url)),
  '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
  '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
  '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
  '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
  '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
  '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
};

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Unified markdown processor: keeps GFM + smartypants, adds KaTeX math
// (```mermaid fences are handled by the MDX codeTransformer + client render).
const processor = unified({
  gfm: true,
  smartypants: false,
  remarkPlugins: [remarkMath],
  rehypePlugins: [[rehypeKatex, { output: 'html', strict: false, throwOnError: false }]],
});

export default defineConfig({
  site: SITE.origin,
  base,
  trailingSlash: 'never',
  integrations: [
    mdx({
      codeTransformers: [
        (code, { lang }) => {
          if (lang === 'mermaid') {
            return {
              preContent: '<pre class="mermaid-src" data-processed="false">',
              postContent: '</pre>',
              content: escapeHtml(code),
            };
          }
          return { content: code };
        },
      ],
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    processor,
    shikiConfig: {
      theme: 'github-dark-dimmed',
      defaultWrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: aliases },
  },
  build: {
    inlineStylesheets: 'always',
  },
  output: 'static',
});

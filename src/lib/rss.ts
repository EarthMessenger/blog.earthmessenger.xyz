import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DISCRIPTION, type Lang } from '../config';
import { baseSlug } from './content-paths';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import path from 'node:path';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkJoinCjkLines from 'remark-join-cjk-lines';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const site = 'https://earthmessenger.xyz';
const projectRoot = process.cwd();
const contentDir = path.resolve(projectRoot, 'src/content/posts');

const rasterModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/posts/**/*.{png,jpg,jpeg,gif,webp}',
  { eager: true },
);

const svgModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/posts/**/*.svg',
  { eager: true },
);

export async function generateRss(lang: Lang) {
  const pagesDir = path.resolve(projectRoot, 'src/pages');

  const imageUrlMap = new Map<string, string>();
  await Promise.all(
    Object.entries(rasterModules).map(async ([key, mod]) => {
      const absPath = path.resolve(pagesDir, key);
      const relPath = path.relative(projectRoot, absPath);
      const { src } = await getImage({ src: mod.default });
      imageUrlMap.set(relPath, new URL(src, site).href);
    }),
  );
  for (const [key, mod] of Object.entries(svgModules)) {
    const absPath = path.resolve(pagesDir, key);
    const relPath = path.relative(projectRoot, absPath);
    imageUrlMap.set(relPath, new URL(mod.default.src, site).href);
  }

  const posts = (await getCollection('posts'))
    .filter((p) => p.data.lang === lang)
    .sort((p, q) => q.data.pubDate.getTime() - p.data.pubDate.getTime())
    .slice(0, 10);

  return rss({
    title: SITE_TITLE,
    description: SITE_DISCRIPTION,
    site,
    items: posts.map((post) => {
      const slug = baseSlug(post);
      const postUrl = `${site}/${lang}/posts/${slug}/`;

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        link: `/${lang}/posts/${slug}`,
        content: String(
          createParser(postUrl, imageUrlMap).processSync(post.body),
        ),
      };
    }),
    customData: `<language>${lang}</language>`,
  });
}

function createParser(postUrl: string, imageUrlMap: Map<string, string>) {
  return unified()
    .use(remarkParse)
    .use(() => remarkReplaceImages(postUrl, imageUrlMap))
    .use(remarkJoinCjkLines)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify);
}

function remarkReplaceImages(
  postUrl: string,
  imageUrlMap: Map<string, string>,
) {
  return (tree: any) => {
    function walk(node: any) {
      if (node.type === 'image' && typeof node.url === 'string') {
        const url = node.url;
        if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return;
        if (url.startsWith('/')) {
          node.url = `${site}${url}`;
          return;
        }
        const resolved = path.resolve(contentDir, url);
        const relPath = path.relative(projectRoot, resolved);
        const optimized = imageUrlMap.get(relPath);
        node.url = optimized ?? new URL(url, postUrl).href;
      }
      if (node.children) node.children.forEach(walk);
    }
    walk(tree);
  };
}

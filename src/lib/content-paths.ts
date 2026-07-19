import { getCollection } from 'astro:content';
import { type Lang } from '../config';

export async function buildEntryPaths(collection: 'posts' | 'solution') {
  const entries = await getCollection(collection);

  const paths: Array<{
    params: { lang: Lang; slug: string };
    props: { entry: any };
  }> = [];

  for (const entry of entries) {
    const lang = entry.data.lang as Lang;
    if (entry.data.opencc) {
      // OpenCC copies have id like "beijing.zh-hans"; strip the lang suffix
      // Note: github-slugger replaces '.' with '' in the slug, so the trailing
      // dot from slice is harmless in the URL. The route [lang]/posts/[...slug]
      // sees the slug without the trailing dot.
      paths.push({
        params: { lang, slug: entry.id.slice(0, -lang.length) },
        props: { entry },
      });
    } else {
      paths.push({
        params: { lang, slug: entry.id },
        props: { entry },
      });
    }
  }

  return paths;
}

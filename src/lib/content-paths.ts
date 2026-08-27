import { getCollection } from 'astro:content';
import { type Lang } from '../config';

/**
 * The URL slug for an entry. Converted copies have ids like `beijing.zh-hant`;
 * strip the full `.{lang}` suffix (including the dot) so both locales share
 * one clean URL.
 */
export function baseSlug(entry: {
  id: string;
  data: { lang: string; opencc?: boolean };
}): string {
  return entry.data.opencc
    ? entry.id.slice(0, -entry.data.lang.length - 1)
    : entry.id;
}

export async function buildEntryPaths(collection: 'posts' | 'solution') {
  const entries = await getCollection(collection);

  const paths: Array<{
    params: { lang: Lang; slug: string };
    props: { entry: any };
  }> = [];

  for (const entry of entries) {
    const lang = entry.data.lang as Lang;
    paths.push({
      params: { lang, slug: baseSlug(entry) },
      props: { entry },
    });
  }

  return paths;
}

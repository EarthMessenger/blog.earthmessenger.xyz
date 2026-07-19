import { SITE_LOCALES, type Lang } from '../../config';
import { generateRss } from '../../lib/rss';

export async function getStaticPaths() {
  return SITE_LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET({ params }: { params: { lang: Lang } }) {
  return generateRss(params.lang);
}

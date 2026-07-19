import { generateRss } from '../lib/rss';

export async function GET() {
  return generateRss('zh-hant');
}

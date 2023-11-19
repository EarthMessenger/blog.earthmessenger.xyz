import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_LANG, SITE_DISCRIPTION } from "../config";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkJoinCjkLines from "remark-join-cjk-lines";
import remarkRehype from 'remark-rehype';
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const markdownParser = unified()
  .use(remarkParse)
  .use(remarkJoinCjkLines)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

export async function GET() {
  const posts = (await getCollection("posts")).sort((p, q) => q.data.pubDate.getTime() - p.data.pubDate.getTime()).slice(0, 10);

  return rss({
    title: SITE_TITLE,
    description: SITE_DISCRIPTION,
    site: "https://earthmessenger.xyz",
    items: posts.map((post) => ({
      link: `/posts/${post.slug}`,
      content: String(markdownParser.processSync(post.body)),
      ...post.data
    })),
    customData: `<language>${SITE_LANG}</language>`,
  });
}

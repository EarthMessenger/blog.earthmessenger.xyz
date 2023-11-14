import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_LANG, SITE_DISCRIPTION } from "../config";
import sanitizeHtml from "sanitize-html";

export async function GET() {
  const items = import.meta.glob("./posts/*.md", { eager: true });
  const posts = Object.values(items)
    .sort((a, b) => Date.parse(b.frontmatter.pubDate) - Date.parse(a.frontmatter.pubDate))
    .slice(0, 10);
  return rss({
    title: SITE_TITLE,
    description: SITE_DISCRIPTION,
    site: "https://earthmessenger.xyz",
    items: posts.map((post) => ({
      link: post.url,
      content: sanitizeHtml(post.compiledContent()),
      ...post.frontmatter
    })),
    customData: `<language>${SITE_LANG}</language>`,
  });
}

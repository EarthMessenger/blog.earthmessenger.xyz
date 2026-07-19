import { load, dump } from 'js-yaml';

export function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const data = load(match[1]) || {};
  return { data, body: match[2] };
}

export function recompose(data, body) {
  let fm = dump(data, { sortKeys: true, lineWidth: -1 }).trimEnd();
  fm = fm.replace(/^pubDate: '(2\d{3}-\d{2}-\d{2})'$/gm, 'pubDate: $1');
  return `---\n${fm}\n---\n\n${body.trim()}\n`;
}

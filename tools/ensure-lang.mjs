import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, dump } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src/content/posts');
const DEFAULT_LANG = 'zh-hans';

async function main() {
  const files = await readdir(CONTENT_DIR);

  for (const file of files) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    const filePath = path.join(CONTENT_DIR, file);
    const content = await readFile(filePath, 'utf-8');

    const { data, body } = splitFrontmatter(content);
    if (data.lang) continue;

    data.lang = DEFAULT_LANG;
    const newContent = recompose(data, body);
    await writeFile(filePath, newContent, 'utf-8');
    console.log(`  + ${file}: lang: ${DEFAULT_LANG}`);
  }

  console.log('ensure-lang complete.');
}

function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content, fmRaw: '' };
  const fmRaw = match[1];
  const body = match[2];
  const data = load(fmRaw) || {};
  return { data, body, fmRaw };
}

function recompose(data, body) {
  let fm = dump(data, { sortKeys: true, lineWidth: -1 }).trimEnd();
  fm = fm.replace(/^pubDate: '(2\d{3}-\d{2}-\d{2})'$/gm, 'pubDate: $1');
  return `---\n${fm}\n---\n\n${body.trim()}\n`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

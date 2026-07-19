import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitFrontmatter, recompose } from './utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIRS = [
  { dir: path.join(PROJECT_ROOT, 'src/content/posts'), recursive: false },
  { dir: path.join(PROJECT_ROOT, 'src/content/oi-notes'), recursive: true },
];
const DEFAULT_LANG = 'zh-hans';

async function ensureLang(contentDir, { recursive }) {
  const files = await readdir(contentDir, { recursive });

  for (const file of files) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    const filePath = path.join(contentDir, file);

    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) continue;

    const content = await readFile(filePath, 'utf-8');
    const { data, body } = splitFrontmatter(content);
    if (data.lang) continue;

    data.lang = DEFAULT_LANG;
    const newContent = recompose(data, body);
    await writeFile(filePath, newContent, 'utf-8');
    console.log(`  + ${file}: lang: ${DEFAULT_LANG}`);
  }
}

async function main() {
  for (const { dir, recursive } of CONTENT_DIRS) {
    console.log(`processing ${path.relative(PROJECT_ROOT, dir)}...`);
    await ensureLang(dir, { recursive });
  }

  console.log('ensure-lang complete.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

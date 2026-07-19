import {
  readdir,
  readFile,
  writeFile,
  stat,
  unlink,
  mkdir,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Converter } from 'opencc-js';
import { splitFrontmatter, recompose } from './utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(PROJECT_ROOT, 'src/pages');
const LOCALES = ['zh-hans', 'zh-hant'];

const COLLECTIONS = [
  {
    dir: path.join(PROJECT_ROOT, 'src/content/posts'),
    recursive: false,
  },
  {
    dir: path.join(PROJECT_ROOT, 'src/content/oi-notes'),
    recursive: true,
  },
];

async function main() {
  const s2t = Converter({ from: 'cn', to: 'twp' });
  const t2s = Converter({ from: 'twp', to: 'cn' });

  function convert(text, from, to) {
    if (from === to || !text) return text;
    if (from === 'zh-hans' && to === 'zh-hant') return s2t(text);
    if (from === 'zh-hant' && to === 'zh-hans') return t2s(text);
    return text;
  }

  for (const { dir, recursive } of COLLECTIONS) {
    console.log(`syncing ${path.relative(PROJECT_ROOT, dir)}...`);
    await syncCollection(dir, { recursive }, convert);
  }

  await syncAbout(convert);

  console.log('OpenCC sync complete.');
}

async function syncCollection(contentDir, { recursive }, convert) {
  const files = await readdir(contentDir, { recursive });

  // Filter to only real .md files (not directories from recursive listing)
  const allMd = [];
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileStat = await stat(filePath);
    if (fileStat.isFile() && file.endsWith('.md') && !file.startsWith('_')) {
      allMd.push(file);
    }
  }

  const originals = new Set(
    allMd.filter((f) => {
      for (const lang of LOCALES) {
        if (f.endsWith(`.${lang}.md`)) return false;
      }
      return true;
    }),
  );

  for (const file of originals) {
    const sourcePath = path.join(contentDir, file);
    const content = await readFile(sourcePath, 'utf-8');
    const { data, body } = splitFrontmatter(content);
    const sourceLang = data.lang;

    const base = file.replace(/\.md$/, '');

    for (const targetLang of LOCALES) {
      if (targetLang === sourceLang) continue;

      const targetFile = `${base}.${targetLang}.md`;
      const targetPath = path.join(contentDir, targetFile);

      const sourceStat = await stat(sourcePath);
      if (existsSync(targetPath)) {
        const targetContent = await readFile(targetPath, 'utf-8');
        const { data: targetData } = splitFrontmatter(targetContent);
        if (!targetData.opencc) continue;
        const targetStat = await stat(targetPath);
        if (targetStat.mtimeMs >= sourceStat.mtimeMs) continue;
      }

      const newData = {
        ...data,
        title: convert(data.title, sourceLang, targetLang),
        lang: targetLang,
        opencc: true,
      };
      const newBody = convert(body, sourceLang, targetLang);

      await writeFile(targetPath, recompose(newData, newBody), 'utf-8');
      console.log(`  -> ${targetFile}`);
    }
  }

  // Clean orphans
  for (const file of allMd) {
    let targetLang = null;
    for (const lang of LOCALES) {
      if (file.endsWith(`.${lang}.md`)) {
        targetLang = lang;
        break;
      }
    }
    if (!targetLang) continue;

    const filePath = path.join(contentDir, file);
    const content = await readFile(filePath, 'utf-8');
    const { data } = splitFrontmatter(content);
    if (!data.opencc) continue;

    const originalForm = file.replace(
      new RegExp(`\\.${targetLang}\\.md$`),
      '.md',
    );
    if (!originals.has(originalForm)) {
      await unlink(filePath);
      console.log(`  \u{1F480} orphan: ${file}`);
    }
  }
}

async function syncAbout(convert) {
  const sourceFile = path.join(PAGES_DIR, 'zh-hant', 'about.md');
  if (!existsSync(sourceFile)) return;

  const sourceContent = await readFile(sourceFile, 'utf-8');
  const { data, body } = splitFrontmatter(sourceContent);
  const sourceLang = 'zh-hant';

  for (const targetLang of LOCALES) {
    if (targetLang === sourceLang) continue;

    const targetDir = path.join(PAGES_DIR, targetLang);
    await mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, 'about.md');

    const sourceStat = await stat(sourceFile);
    if (existsSync(targetPath)) {
      const targetContent = await readFile(targetPath, 'utf-8');
      const { data: targetData } = splitFrontmatter(targetContent);
      if (!targetData.opencc) continue;
      const targetStat = await stat(targetPath);
      if (targetStat.mtimeMs >= sourceStat.mtimeMs) continue;
    }

    const newData = { ...data, lang: targetLang, opencc: true };
    const newBody = convert(body, sourceLang, targetLang);
    await writeFile(targetPath, recompose(newData, newBody), 'utf-8');
    console.log(`  -> ${targetLang}/about.md`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

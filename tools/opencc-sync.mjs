import { readdir, readFile, writeFile, stat, unlink, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load, dump } from "js-yaml";
import { Converter } from "opencc-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(PROJECT_ROOT, "src/content/posts");
const PAGES_DIR = path.join(PROJECT_ROOT, "src/pages");
const LOCALES = ["zh-hans", "zh-hant"];

async function main() {
  const s2t = Converter({ from: "cn", to: "twp" });
  const t2s = Converter({ from: "twp", to: "cn" });

  function convert(text, from, to) {
    if (from === to || !text) return text;
    if (from === "zh-hans" && to === "zh-hant") return s2t(text);
    if (from === "zh-hant" && to === "zh-hans") return t2s(text);
    return text;
  }

  await syncPosts(CONTENT_DIR, convert);
  await syncAbout(convert);

  console.log("OpenCC sync complete.");
}

async function syncPosts(contentDir, convert) {
  const files = await readdir(contentDir);

  const originals = files.filter((f) => {
    if (!f.endsWith(".md") || f.startsWith("_")) return false;
    for (const lang of LOCALES) {
      if (f.endsWith(`.${lang}.md`)) return false;
    }
    return true;
  });

  for (const file of originals) {
    const sourcePath = path.join(contentDir, file);
    const content = await readFile(sourcePath, "utf-8");
    const { data, body } = splitFrontmatter(content);
    const sourceLang = data.lang;

    for (const targetLang of LOCALES) {
      if (targetLang === sourceLang) continue;

      const baseName = path.basename(file, ".md");
      const targetFile = `${baseName}.${targetLang}.md`;
      const targetPath = path.join(contentDir, targetFile);

      const sourceStat = await stat(sourcePath);
      if (existsSync(targetPath)) {
        const targetContent = await readFile(targetPath, "utf-8");
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

      await writeFile(targetPath, recompose(newData, newBody), "utf-8");
      console.log(`  -> ${targetFile}`);
    }
  }

  // Clean orphans
  for (const file of files) {
    let targetLang = null;
    for (const lang of LOCALES) {
      if (file.endsWith(`.${lang}.md`)) { targetLang = lang; break; }
    }
    if (!targetLang) continue;

    const filePath = path.join(contentDir, file);
    const content = await readFile(filePath, "utf-8");
    const { data } = splitFrontmatter(content);
    if (!data.opencc) continue;

    const baseName = path.basename(file, `.${targetLang}.md`);
    if (!originals.includes(`${baseName}.md`)) {
      await unlink(filePath);
      console.log(`  \u{1F480} orphan: ${file}`);
    }
  }
}

async function syncAbout(convert) {
  const sourceFile = path.join(PAGES_DIR, "zh-hant", "about.md");
  if (!existsSync(sourceFile)) return;

  const sourceContent = await readFile(sourceFile, "utf-8");
  const { data, body } = splitFrontmatter(sourceContent);
  const sourceLang = "zh-hant";

  for (const targetLang of LOCALES) {
    if (targetLang === sourceLang) continue;

    const targetDir = path.join(PAGES_DIR, targetLang);
    await mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, "about.md");

    const sourceStat = await stat(sourceFile);
    if (existsSync(targetPath)) {
      const targetContent = await readFile(targetPath, "utf-8");
      const { data: targetData } = splitFrontmatter(targetContent);
      if (!targetData.opencc) continue;
      const targetStat = await stat(targetPath);
      if (targetStat.mtimeMs >= sourceStat.mtimeMs) continue;
    }

    const newData = { ...data, lang: targetLang, opencc: true };
    const newBody = convert(body, sourceLang, targetLang);
    await writeFile(targetPath, recompose(newData, newBody), "utf-8");
    console.log(`  -> ${targetLang}/about.md`);
  }
}

function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const data = load(match[1]) || {};
  return { data, body: match[2] };
}

function recompose(data, body) {
  let fm = dump(data, { sortKeys: true, lineWidth: -1 }).trimEnd();
  fm = fm.replace(/^pubDate: '(2\d{3}-\d{2}-\d{2})'$/gm, "pubDate: $1");
  return `---\n${fm}\n---\n\n${body.trim()}\n`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

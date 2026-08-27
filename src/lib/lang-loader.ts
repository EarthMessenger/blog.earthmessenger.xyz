import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import { SITE_LOCALES, type Lang } from '../config';
import { convertText } from '../utils';
import { planLangEntries, slugFromRelPath } from './lang-entries';

export const DEFAULT_LANG: Lang = 'zh-hans';

interface LangLoaderOptions {
  /** unique loader name, e.g. `posts-lang-loader` */
  name: string;
  /** content directory relative to the project root, e.g. `./src/content/posts` */
  base: string;
}

interface ParsedRaw {
  relPath: string;
  absPath: string;
  id: string;
  data: Record<string, any>;
  body: string;
  digest: string;
  opencc?: boolean;
  lang: Lang;
}

interface EntryType {
  getEntryInfo(opts: {
    contents: string;
    fileUrl: URL;
  }): Promise<{ data: Record<string, any>; body: string; slug?: string }>;
  getRenderFunction?(
    config: any,
  ): Promise<
    (entry: {
      id: string;
      data: Record<string, any>;
      body: string;
      filePath: string;
      digest: string;
    }) => Promise<{
      html: string;
      metadata: { imagePaths?: string[] };
    }>
  >;
  contentModuleTypes?: unknown;
}

type RenderFunction = Awaited<NonNullable<ReturnType<NonNullable<EntryType['getRenderFunction']>>>>;

const renderFunctionCache = new WeakMap<EntryType, RenderFunction>();

/**
 * Loads a content directory once and emits one entry per locale: the original
 * file for its declared language, plus OpenCC-converted copies for the other
 * locales (id `{base}.{lang}`, `opencc: true`). No generated files are ever
 * written to disk.
 */
export function createLangCollectionLoader({
  name,
  base,
}: LangLoaderOptions): Loader {
  return {
    name,
    async load(ctx) {
      const baseUrl = new URL(base.endsWith('/') ? base : `${base}/`, ctx.config.root);
      const baseDir = fileURLToPath(baseUrl);

      if (!existsSync(baseDir)) {
        ctx.logger.warn(`The base directory "${baseDir}" does not exist.`);
        return;
      }

      await syncAll(ctx, baseDir);

      const watcher = ctx.watcher;
      if (!watcher) return;

      watcher.add(baseDir);
      const onFsEvent = async (changedPath: string) => {
        if (!isWithin(baseDir, changedPath)) return;
        try {
          await syncAll(ctx, baseDir);
          ctx.logger.info(`Reloaded ${name} after ${path.basename(changedPath)} changed`);
        } catch (error) {
          ctx.logger.error(`Failed to reload ${name}: ${(error as Error).message}`);
        }
      };
      watcher.on('change', onFsEvent);
      watcher.on('add', onFsEvent);
      watcher.on('unlink', onFsEvent);
      watcher.on('unlinkDir', onFsEvent);
    },
  };
}

async function syncAll(ctx: LoaderContext, baseDir: string): Promise<void> {
  const entryTypes = (ctx as LoaderContext & { entryTypes?: Map<string, EntryType> })
    .entryTypes;
  const files = await readdir(baseDir, { recursive: true });
  const raws: ParsedRaw[] = [];

  for (const rel of files) {
    if (!isContentFile(rel)) continue;

    const absPath = path.join(baseDir, rel);
    const info = await stat(absPath);
    if (!info.isFile()) continue;

    const ext = path.extname(rel);
    const entryType = entryTypes?.get(ext);
    if (!entryType) {
      ctx.logger.warn(`No entry type found for ${rel}`);
      continue;
    }

    const contents = await readFile(absPath, 'utf-8');
    const { data, body } = await entryType.getEntryInfo({
      contents,
      fileUrl: pathToFileURL(absPath),
    });
    const id = typeof data.slug === 'string' && data.slug ? data.slug : slugFromRelPath(rel);
    const parsedData = await ctx.parseData({ id, data, filePath: absPath });

    raws.push({
      relPath: toPosixRelative(ctx.config.root, absPath),
      absPath,
      id,
      data: parsedData,
      body,
      digest: ctx.generateDigest(contents),
      opencc: parsedData.opencc,
      lang: parsedData.lang,
    });
  }

  const plan = planLangEntries(
    raws.map((raw) => ({ id: raw.id, lang: raw.lang, opencc: raw.opencc })),
    SITE_LOCALES,
  );

  for (const id of plan.shadowed) {
    ctx.logger.warn(
      `Skipping duplicate language entry ${id}; the base file takes precedence.`,
    );
  }

  const byId = new Map(raws.map((raw) => [raw.id, raw]));
  const seen = new Set<string>();

  for (const raw of raws) {
    if (!plan.keep.has(raw.id)) continue;
    seen.add(raw.id);
    await storeRaw(ctx, raw, entryTypes);
  }

  for (const convert of plan.converts) {
    const source = byId.get(convert.sourceId);
    if (!source) continue;

    const convertedBody = convertText(source.body, source.lang, convert.lang);
    const convertedData = await ctx.parseData({
      id: convert.id,
      data: {
        ...source.data,
        title: convertText(source.data.title, source.lang, convert.lang),
        lang: convert.lang,
        opencc: true,
      },
      filePath: source.absPath,
    });
    const rendered = await ctx.renderMarkdown(convertedBody, {
      fileURL: pathToFileURL(source.absPath),
    });

    ctx.store.set({
      id: convert.id,
      data: convertedData,
      body: convertedBody,
      filePath: source.relPath,
      digest: ctx.generateDigest(convertedBody + JSON.stringify(convertedData)),
      rendered,
      assetImports: rendered?.metadata?.imagePaths,
    });
    seen.add(convert.id);
  }

  for (const id of ctx.store.keys()) {
    if (!seen.has(id)) ctx.store.delete(id);
  }
}

async function storeRaw(
  ctx: LoaderContext,
  raw: ParsedRaw,
  entryTypes: Map<string, EntryType> | undefined,
): Promise<void> {
  const entryType = entryTypes?.get(path.extname(raw.relPath));
  const base = {
    id: raw.id,
    data: raw.data,
    body: raw.body,
    filePath: raw.relPath,
    digest: raw.digest,
  };

  if (entryType?.getRenderFunction) {
    let render = renderFunctionCache.get(entryType);
    if (!render) {
      render = await entryType.getRenderFunction(ctx.config);
      renderFunctionCache.set(entryType, render);
    }
    const rendered = await render({
      id: raw.id,
      data: raw.data,
      body: raw.body,
      filePath: raw.absPath,
      digest: raw.digest,
    });
    ctx.store.set({
      ...base,
      rendered,
      assetImports: rendered?.metadata?.imagePaths,
    });
  } else if (entryType && 'contentModuleTypes' in entryType) {
    ctx.store.set({ ...base, deferredRender: true });
  } else {
    ctx.store.set(base);
  }
}

function isContentFile(relPath: string): boolean {
  const baseName = path.posix.basename(relPath);
  if (baseName.startsWith('_')) return false;
  const ext = path.posix.extname(relPath);
  return ext === '.md' || ext === '.mdx';
}

function toPosixRelative(rootUrl: URL, absPath: string): string {
  return path
    .relative(fileURLToPath(rootUrl), absPath)
    .split(path.sep)
    .join('/');
}

function isWithin(baseDir: string, changedPath: string): boolean {
  const relative = path.relative(baseDir, changedPath);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

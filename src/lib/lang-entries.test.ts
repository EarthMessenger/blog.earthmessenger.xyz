import { expect, test } from 'vitest';
import {
  baseIdOf,
  planLangEntries,
  slugFromRelPath,
  slugifySegment,
} from './lang-entries';
import { SITE_LOCALES } from '../config';

test('slugifySegment keeps existing safe filenames unchanged', () => {
  expect(slugifySegment('beijing')).toBe('beijing');
  expect(slugifySegment('csp2023-ji')).toBe('csp2023-ji');
  expect(slugifySegment('vim-tutor-for-oi')).toBe('vim-tutor-for-oi');
});

test('slugifySegment normalizes exotic names', () => {
  expect(slugifySegment('Foo Bar')).toBe('foo-bar');
  expect(slugifySegment('a.b_c')).toBe('a-b-c');
  expect(slugifySegment('X.Y_Z')).toBe('x-y-z');
});

test('slugFromRelPath mirrors the previous glob ids', () => {
  expect(slugFromRelPath('beijing.md')).toBe('beijing');
  expect(slugFromRelPath('atcoder/abc299f.md')).toBe('atcoder/abc299f');
  expect(slugFromRelPath('misc/loj-6039.md')).toBe('misc/loj-6039');
  expect(slugFromRelPath('atcoder/index.md')).toBe('atcoder');
});

test('baseIdOf strips the lang suffix', () => {
  expect(baseIdOf('beijing')).toBe('beijing');
  expect(baseIdOf('beijing.zh-hans')).toBe('beijing');
  expect(baseIdOf('atcoder/abc299f.zh-hant')).toBe('atcoder/abc299f');
});

test('a source file produces one entry per locale, keeping URLs stable', () => {
  const plan = planLangEntries(
    [{ id: 'beijing', lang: 'zh-hans' }],
    SITE_LOCALES,
  );

  expect([...plan.keep]).toEqual(['beijing']);
  expect(plan.converts).toEqual([
    { id: 'beijing.zh-hant', sourceId: 'beijing', lang: 'zh-hant' },
  ]);
  expect(plan.shadowed).toEqual([]);
});

test('a zh-hant source converts to zh-hans', () => {
  const plan = planLangEntries(
    [{ id: 'coredump', lang: 'zh-hant' }],
    SITE_LOCALES,
  );

  expect(plan.converts).toEqual([
    { id: 'coredump.zh-hans', sourceId: 'coredump', lang: 'zh-hans' },
  ]);
});

test('an explicit manual translation is preferred over conversion', () => {
  const plan = planLangEntries(
    [
      { id: 'foo', lang: 'zh-hans' },
      { id: 'foo.zh-hant', lang: 'zh-hant', opencc: false },
    ],
    SITE_LOCALES,
  );

  expect([...plan.keep].sort()).toEqual(['foo', 'foo.zh-hant']);
  expect(plan.converts).toEqual([]);
  expect(plan.shadowed).toEqual([]);
});

test('a standalone manual translation acts as the group source', () => {
  const plan = planLangEntries(
    [{ id: 'foo.zh-hant', lang: 'zh-hant' }],
    SITE_LOCALES,
  );

  expect([...plan.keep]).toEqual(['foo.zh-hant']);
  expect(plan.converts).toEqual([
    { id: 'foo.zh-hans', sourceId: 'foo.zh-hant', lang: 'zh-hans' },
  ]);
});

test('stale OpenCC artifacts are ignored', () => {
  const plan = planLangEntries(
    [
      { id: 'foo', lang: 'zh-hans' },
      { id: 'foo.zh-hant', lang: 'zh-hant', opencc: true },
    ],
    SITE_LOCALES,
  );

  expect([...plan.keep]).toEqual(['foo']);
  expect(plan.converts).toEqual([
    { id: 'foo.zh-hant', sourceId: 'foo', lang: 'zh-hant' },
  ]);
});

test('a lang-suffixed duplicate of the base file is shadowed', () => {
  const plan = planLangEntries(
    [
      { id: 'foo', lang: 'zh-hans' },
      { id: 'foo.zh-hans', lang: 'zh-hans' },
    ],
    SITE_LOCALES,
  );

  expect([...plan.keep]).toEqual(['foo']);
  expect(plan.shadowed).toEqual(['foo.zh-hans']);
  expect(plan.converts).toEqual([
    { id: 'foo.zh-hant', sourceId: 'foo', lang: 'zh-hant' },
  ]);
});

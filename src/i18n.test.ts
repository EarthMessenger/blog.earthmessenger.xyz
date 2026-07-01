import { expect, test } from 'vitest';
import { useTranslations, getLangFromUrl } from './i18n';
import { SITE_DEFAULT_LANG } from './config';

test('useTranslations', () => {
  const ts = useTranslations('zh-hans');
  const tt = useTranslations('zh-hant');
  expect(tt('footer.subscribe')).toBe('訂閱');
  expect(ts('footer.subscribe')).toBe('订阅');

  expect(tt('tag.title', { tag: 'TTT' })).toBe('帶有「TTT」標籤的博客');
  expect(ts('tag.title', { tag: 'TTT' })).toBe('带有「TTT」标签的博客');

  expect(tt('tag.title')).toBe('帶有「{tag}」標籤的博客');
  expect(ts('tag.title')).toBe('带有「{tag}」标签的博客');

  expect(tt('tag.title', { foo: 'bar' })).toBe('帶有「{tag}」標籤的博客');
  expect(ts('tag.title', { foo: 'bar' })).toBe('带有「{tag}」标签的博客');
});

test('getLangFromUrl', () => {
  const url1 = new URL('https://example.com/zh-hant/some/path');
  const url2 = new URL('https://example.com/');
  expect(getLangFromUrl(url1)).toBe('zh-hant');
  expect(getLangFromUrl(url2)).toBe(SITE_DEFAULT_LANG);
});

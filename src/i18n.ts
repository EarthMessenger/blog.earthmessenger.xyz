import { SITE_DEFAULT_LANG } from "./config";
import { convertText } from "./utils";

const uiZhHant = {
  "zh-hans": "簡體中文",
  "zh-hant": "繁體中文",

  "footer.subscribe": "訂閱",
  "footer.license": "授權方式",

  "language-notice": `本文原文爲{from}，由 <a href="https://github.com/BYVoid/OpenCC" target="_blank" rel="noopener">OpenCC</a> 自動轉換爲{to}。`,

  "nav.home": "首頁",
  "nav.about": "關於",
  "nav.solution": "題解",
  "nav.tags": "標籤",

  "post.date": "日期",
  "post.tags": "標籤",

  "tag.title": "帶有「{tag}」標籤的博客",

  "404.title": "404 Not Found",
  "404.explain": "由於本博客經歷過多次更新和遷移，可能存在連接失效，可以在 GitHub 中搜索：",
  "404.search": "搜索",
} as const;

const uiZhHans = Object.fromEntries(
  Object.entries(uiZhHant).map(([key, value]) => [key, convertText(value, "zh-hant", "zh-hans")])
);

export const ui = {
  "zh-hant": uiZhHant,
  "zh-hans": uiZhHans,
};

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return SITE_DEFAULT_LANG;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof SITE_DEFAULT_LANG], vars?: Record<string, string>) {
    const translation = ui[lang][key] || ui[SITE_DEFAULT_LANG][key];
    if (!vars) return translation;
    return translation.replace(/\{(\w+)\}/g, (match: string, varName: string) => vars[varName] || match);
  }
}
export const SITE_TITLE = "EarthMessenger 博客";
export const SITE_DISCRIPTION = "EarthMessenger 的個人博客 — 寫程式、寫日常、寫想法";
export const SITE_DEFAULT_LANG = "zh-hant";
export const SITE_LOCALES = ["zh-hans", "zh-hant"] as const;
export const SITE_AUTHOR = "EarthMessenger";
export const SITE_URL = "https://earthmessenger.xyz";

export type Lang = typeof SITE_LOCALES[number];
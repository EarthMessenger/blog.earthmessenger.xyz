import lunarCalendar from "lunar-calendar";
const { solarToLunar } = lunarCalendar;

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const lunar = solarToLunar(year, month, day);
  return `${year}年${month}月${day}日，${lunar.GanZhiYear}${lunar.lunarMonthName}${lunar.lunarDayName}`;
};

let s2t = null;
let t2s = null;

import OpenCC from 'opencc-js';

export function convertText(text, from, to) {
  if (from === to) return text;
  if (!text) return text;
  if (from === "zh-hans" && to === "zh-hant") {
    if (!s2t) s2t = OpenCC.Converter({ from: "cn", to: "twp" });
    return s2t(text);
  }
  if (from === "zh-hant" && to === "zh-hans") {
    if (!t2s) t2s = OpenCC.Converter({ from: "twp", to: "cn" });
    return t2s(text);
  }
  return text;
}

// By DeepSeek
// This should be changed later:
// 1. parse markdown using regex is basically enough, but not perfect.
// 2. description from first 150 chars, i dont think this can make seo.
export function extractDescription(body, maxLength = 150) {
  if (!body) return "";
  let text = body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[#*_~>|]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length > maxLength) {
    text = text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
  }
  return text;
}

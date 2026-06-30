---
lang: zh-hant
opencc: true
pubDate: 2023-06-03
tags: ad
title: 從 Jekyll 遷移到 Astro
---

## 🎉 經過兩天的努力，現在部落格從 Jekyll 遷移到了 Astro！🎉

根本原因：不會 Ruby，使用 Jekyll 非常拘束，出鍋了自己也改不來。

所以我想選一個方便的 Javascript 生態的框架。這個選項非常多，有 Next.js, Gastby,
Nuxt, Hexo 之類的。

Hexo 是個不錯的選擇，但是我不喜歡 nunjucks 之類的模板語言。而 Astro 有非常方便
的元件功能，編譯出來的程式碼只有較少的 Javascript。同時，Astro 大部分文件有中文翻
譯，看著文件上手非常快。得益於 vite，熱更新的功能也很強，直接儲存，在瀏覽器就可
以看到結果。

## upd: 2023-07-05

今天發現 Hexo 確實有那種支援類似 JSX 語法進行主題開發的外掛。有
[hexo-render-inferno][hr-inferno] 和 [hexo-render-jsx][hr-jsx]。可以參考部落格：
[⚛️ 使用 React JSX 重構我的部落格主題][jsx-with-hexo]。

但是 Astro 確實好用。

[hr-inferno]: https://github.com/hexojs/hexo-renderer-inferno
[hr-jsx]: https://github.com/hexojs/hexo-renderer-jsx
[jsx-with-hexo]: https://blog.yidaozhan.top/2023/04/01/new-blog-theme-with-react-jsx/

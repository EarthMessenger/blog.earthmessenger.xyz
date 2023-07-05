---
layout: ../../layouts/PostLayout.astro
title: 从 Jekyll 迁移到 Astro
tags: ad
pubDate: 2023-06-03
---

## 🎉 经过两天的努力，现在博客从 Jekyll 迁移到了 Astro！🎉

根本原因：不会 Ruby，使用 Jekyll 非常拘束，出锅了自己也改不来。

所以我想选一个方便的 Javascript 生态的框架。这个选项非常多，有 Next.js, Gastby,
Nuxt, Hexo 之类的。

Hexo 是个不错的选择，但是我不喜欢 nunjucks 之类的模板语言。而 Astro 有非常方便
的组件功能，编译出来的代码只有较少的 Javascript。同时，Astro 大部分文档有中文翻
译，看着文档上手非常快。得益于 vite，热更新的功能也很强，直接保存，在浏览器就可
以看到结果。

## upd: 2023-07-05

今天发现 Hexo 确实有那种支持类似 JSX 语法进行主题开发的插件。有
[hexo-render-inferno][hr-inferno] 和 [hexo-render-jsx][hr-jsx]。可以参考博客：
[⚛️ 使用 React JSX 重构我的博客主题][jsx-with-hexo]。

但是 Astro 确实好用。

[hr-inferno]: https://github.com/hexojs/hexo-renderer-inferno
[hr-jsx]: https://github.com/hexojs/hexo-renderer-jsx
[jsx-with-hexo]: https://blog.yidaozhan.top/2023/04/01/new-blog-theme-with-react-jsx/

---
layout: ../../layouts/PostLayout.astro
title: "偏见"
pubDate: 2023-01-20
tags: thought oi
---

> hyj 哲学

## C、C++ 与其他语言

C 仿佛草原上奔放不羁的野马，原始而自由。没有各种奇怪的语法，结构简单。
每一处内存都可以亲自控制，这便是自由所在，然而过分的自由也会导致麻烦。
选手往往难以亲自管理好底层的内存，代码也容易混乱。

C++ 仿佛是穿上了一件破衣的原始人，虽有了现代的模样，却改不了原始的根。
C++ 的确引入了一些现代的特性，却往往因为巨大的历史包袱及各种原因难以充分现代化，发展也相当缓慢。
不过值得肯定的是 C++ 的面向对象及 STL 的确方便了许多，然而在大多数选手的代码中 C++ 唯一的体现可能就是 `cin`、`sort`，
这与 CCF 对于现代 C++ 的消极推行有一定关系。而且 OI 中常有常数相关的题目，有些选手也有意识在代码中减少对 C++ 的使用，
以减少常数。

Python 是优雅的，是穿上了华丽衣服的舞者。熟练掌握 Python 可以提高（编程）效率，但常数较大。
Python 在竞赛中通常可以充当数据生成器，简单的对拍及各种工具。

Rust 就是一个脱去了历史包袱的语言的例子，与其他语言相比创新很多，也足够底层，然而较为复杂，不好入门。
它像 C++ 一样哪里都能用，前景光明。

JavaScript 是个神奇的语言，有许多设计缺陷的地方，但生态极好。
随便一个项目能有 GiB 级别的 `node_modules`，能同时用同个依赖的不同版本，居然还能流畅地跑起来。
TypeScript 是好的，一定程度上改善了这些设计缺陷。

## 0 还是 1

大量 OIer 的代码中，数组是从 1 开始的，还有一些语言（如 lua）也是这样。诚然，这种编号方法更加符合人类对数字的认知，
也不容易出错。但这样使用 C++ STL 时总少不了各种 +1 -1，不如统一成从 0 开始，左闭又开，这样更加符合 C++ 的哲学。

左闭又开有许多好处。比如说对于区间 `[l1, r1)` 和 `[l2, r2]`，他们的长度分别是 `r1 - l1` 和 `r2 - l2 + 1`；
如果要对差分数组操作，一个是 `d[l1] += x; d[r1] -= x`，一个是 `d[l2] += x; d[r2 + 1] -= x`；
表示连续区间时，左闭又开的两个区间的中间端点是相同的；表达空区间时，开区间不得不使右端点小于左端点；

## 操作系统

Windows 设计冗杂，历史包袱重，对命令行支持太差，还是微软家的。唯一优点是生态好。

GNU/Linux 十分自由，能高度自定义，同样是历史悠久的操作系统，Unix 一直以来就设计良好。还有开源软件心理 buff。
微软、腾讯及其他科技巨头对 GNU/Linux 的消极支持，用户对大量非 FOSS 软件的依赖，是 GNU/Linux 无法在桌面端流行的重要原因。

## vim 和 neovim

我现在仍然在使用 vim。

neovim 是推动 vim 前进的重要力量。

vim9 比 lua 好。

## 文档与排版

这篇文章就是直接在 vim 中写的。

通常 WYSIWYG 是没有必要的，它反而可能会使排版混乱，而纯文本界面中，字号样式一目了然，对于电脑也更容易处理。

图形界面有极大的局限性，比如说公式排版，LaTeX 比 Word 好用多。

## 软件

当代中小学计算机教育应当减少非 FOSS 软件的教授，这样可以避免整个社会在未来被某些巨头所主导。

非 FOSS 的软件是不值得信赖的，当然 FOSS 软件也需要经过充分审查才能信赖。


---
layout: ../../layouts/PostLayout.astro
title: CSP2022 游只因
pubDate: 2022-11-07
tags: csp
---

## Day 0

在日本网站上头打板子。

发现啥都不会。

## Day 1

### J

普及组开始时相当自信，1h 写完 ABD,C调自闭了，爆0。  

赛后又发现 B 好像也挂了，没判完全平方都过样例了。  

j组 G

### S

下午 S 组，A 题想了 1h，想到双向搜索，写了一个 $O(n^2\lg n)$ 的废物。  

然后发现 B 题傻逼题，我就傻逼地维护了八个 st 表，配合 C++ 大常数
全家桶（std::cin, std::vector），大样例虚拟机下头跑了 6s，准备 tle。

C 题直接跳了。

D 题写了个 $k=1$ 的部分分。当时开到这道题的时候已经是 17:45 了，
我以为和普及组一样只有三个半小时，便浪费了十多分钟，到 18:00 才
知道还有半个小时，于是以平生最快手速写了个 lca 水个 16pts。

发现 hfy 直接 ak 了，怀疑这次分数线比较高。

### 事后诸葛亮

20 点回到家，SC 的代码早已公布了，下载评测，B 题 CE，
`std::numeric_limits` 没有加 `#include <limits>`，估计是手贱删掉了。

上了 SC 迷惑代码大赏：[CSP-S 2022 SC 迷惑行为大赏](https://www.luogu.com.cn/blog/546086/csp-s-2022-sc-mi-huo-xing-wei-tai-shang)
（就是那个抛头露面的）

## Day 11月5日

通知说 NOIP 初中生名额极少，全校就 hfy 一人。

卷文化课去了。

## Day 11月7日

期中考试，只考了双语，GGGGGG

晚上回家查 CSP 成绩：

![csps](/assets/images/score-feacca04.png)

还有普及组 B 挂完了，总共只有 200pts, 比提高组差。

~~感谢 ccf 不杀之恩~~

### 总结

1. t1: 没有维护次次大 -> 100pts
2. t2: ???????? -> 100pts
3. t3: nononononononononononono -> 45pts
4. t4: 与预估相符

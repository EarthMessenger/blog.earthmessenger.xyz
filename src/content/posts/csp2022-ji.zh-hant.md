---
lang: zh-hant
opencc: true
pubDate: 2022-11-07
tags: journal
title: CSP2022 遊只因
---

## Day 0

在日本網站上頭打板子。

發現啥都不會。

## Day 1

### J

普及組開始時相當自信，1h 寫完 ABD,C調自閉了，爆0。  

賽後又發現 B 好像也掛了，沒判完全平方都過樣例了。  

j組 G

### S

下午 S 組，A 題想了 1h，想到雙向搜尋，寫了一個 $O(n^2\lg n)$ 的廢物。  

然後發現 B 題傻逼題，我就傻逼地維護了八個 st 表，配合 C++ 大常數
全家桶（std::cin, std::vector），大樣例虛擬機器下頭跑了 6s，準備 tle。

C 題直接跳了。

D 題寫了個 $k=1$ 的部分分。當時開到這道題的時候已經是 17:45 了，
我以為和普及組一樣只有三個半小時，便浪費了十多分鐘，到 18:00 才
知道還有半個小時，於是以平生最快手速寫了個 lca 水個 16pts。

發現 hfy 直接 ak 了，懷疑這次分數線比較高。

### 事後諸葛亮

20 點回到家，SC 的程式碼早已公佈了，下載評測，B 題 CE，
`std::numeric_limits` 沒有加 `#include <limits>`，估計是手賤刪掉了。

上了 SC 迷惑程式碼大賞：[CSP-S 2022 SC 迷惑行為大賞](https://www.luogu.com.cn/blog/546086/csp-s-2022-sc-mi-huo-xing-wei-tai-shang)
（就是那個拋頭露面的）

## Day 11月5日

通知說 NOIP 初中生名額極少，全校就 hfy 一人。

卷文化課去了。

## Day 11月7日

期中考試，只考了雙語，GGGGGG

晚上回家查 CSP 成績：

![csps](/assets/images/score-feacca04.png)

還有普及組 B 掛完了，總共只有 200pts, 比提高組差。

~~感謝 ccf 不殺之恩~~

### 總結

1. t1: 沒有維護次次大 -> 100pts
2. t2: ???????? -> 100pts
3. t3: nononononononononononono -> 45pts
4. t4: 與預估相符

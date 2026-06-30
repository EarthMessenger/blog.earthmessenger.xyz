---
lang: zh-hant
opencc: true
pubDate: 2022-01-11
tags: cpp trick
title: 快速 log2
---

眾所周知, $\lg$ 是 OI 中十分常用的操作。

然而每次使用 `std::log` 來計算開銷往往較大，因此需要考慮對其最佳化。

## 浮點數求法

現代計算機中，浮點數是通過二進位制下的科學計數法，由符號位，指數位，和基數位來表示的。

如圖：

$$
13 =
\begin{cases}
    \overbrace{\overbrace{0}^{\text{符號位 (1 bit)}}
    \overbrace{10000000010}^{\text{指數位 (11 bits)}}
    \overbrace{1010000000000000000000000000000000000000000000000000}^{\text{基數位 (52 bits)}}}^{\text{double (64 bits)}} \\
    \overbrace{\overbrace{0}^{\text{符號位 (1 bit)}}
    \overbrace{10000010}^{\text{指數位 (8 bits)}}
    \overbrace{10100000000000000000000}^{\text{基數位 (23 bits)}}}^{\text{float (32bits)}}
\end{cases}
$$

> 可以到 [這個網站](https://www.h-schmidt.net/FloatConverter/IEEE754.html) 視覺化浮點數表示。

我們不用理會其表示細節，只需要關注其中的**指數位**。於是我們把一個整數強轉成 `double` 或 `float`，再取出中間幾位指數位就可以了。

程式碼如下

```cpp
unsigned int float_log2(unsigned long long x)
{
    double tmp = x;
    return (((*(unsigned long long*)&tmp) >> 52) + 1) & ((1 << 10) - 1);
}
```

其中 `(*(unsigned long long*)&tmp)` 用於強制讀 tmp 在記憶體中的二進位制位。

## clz 求法

GCC 中有一個叫 `__builtin_clz` 的函式來求一個二進位制數的前導零。

因此用二進位制中位數減去前導零的個數再減一便是 $\lg$ 值。

```cpp
unsigned int clz_log2(unsigned long long x)
{
    return sizeof(unsigned long long) * 8 - __builtin_clzll(x) - 1;
}
```

update: 推薦使用 `std::countl_zero` 代替 `__builtin_clzll`，前者在 C++20 標準中。

## benchmark

使用 `google-benchmark` 跑了一下，結果如下：
```
---------------------------------------------------------
Benchmark               Time             CPU   Iterations
---------------------------------------------------------
double_log            603 ns          600 ns      1156889
math_log              615 ns          618 ns      1114121
clz_log               596 ns          598 ns      1152931
preprocess_log        600 ns          603 ns      1118500 # 1e5
preprocess_log        687 ns          689 ns       934936 # 1e6
preprocess_log        706 ns          709 ns       988641 # 1e7
```

可以看到，平時常用的預處理 `log` 隨著值域的增大，速度也變慢，而基於 `__builtin_clz()` 的 `log` 是相對最快的。

還有用四種 log 實現的 st 在洛谷上的表現情況：

| 方法 | 用時 |
| --: | :-- |
| `std::log2()` | 1.69s |
| `__builtin_clz()` | 1.57s |
| 浮點數演算法 | 1.56s |
| 預處理 | 1.53s |

> 由於值域較小（$10^5$），預處理顯然更快。

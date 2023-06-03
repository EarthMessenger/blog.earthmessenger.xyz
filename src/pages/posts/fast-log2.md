---
layout: ../../layouts/PostLayout.astro
title: 快速 log2
date: 2022-01-11
tags: cpp trick
---

众所周知, $\lg$ 是 OI 中十分常用的操作。

然而每次使用 `std::log` 来计算开销往往较大，因此需要考虑对其优化。

## 浮点数求法

现代计算机中，浮点数是通过二进制下的科学计数法，由符号位，指数位，和基数位来表示的。

如图：

$$
13 =
\begin{cases}
    \overbrace{\overbrace{0}^{\text{符号位 (1 bit)}}
    \overbrace{10000000010}^{\text{指数位 (11 bits)}}
    \overbrace{1010000000000000000000000000000000000000000000000000}^{\text{基数位 (52 bits)}}}^{\text{double (64 bits)}} \\
    \overbrace{\overbrace{0}^{\text{符号位 (1 bit)}}
    \overbrace{10000010}^{\text{指数位 (8 bits)}}
    \overbrace{10100000000000000000000}^{\text{基数位 (23 bits)}}}^{\text{float (32bits)}}
\end{cases}
$$

> 可以到 [这个网站](https://www.h-schmidt.net/FloatConverter/IEEE754.html) 可视化浮点数表示。

我们不用理会其表示细节，只需要关注其中的**指数位**。于是我们把一个整数强转成 `double` 或 `float`，再取出中间几位指数位就可以了。

代码如下

```cpp
unsigned int float_log2(unsigned long long x)
{
    double tmp = x;
    return (((*(unsigned long long*)&tmp) >> 52) + 1) & ((1 << 10) - 1);
}
```

其中 `(*(unsigned long long*)&tmp)` 用于强制读 tmp 在内存中的二进制位。

## clz 求法

GCC 中有一个叫 `__builtin_clz` 的函数来求一个二进制数的前导零。

因此用二进制中位数减去前导零的个数再减一便是 $\lg$ 值。

```cpp
unsigned int clz_log2(unsigned long long x)
{
    return sizeof(unsigned long long) * 8 - __builtin_clzll(x) - 1;
}
```

update: 推荐使用 `std::countl_zero` 代替 `__builtin_clzll`，前者在 C++20 标准中。

## benchmark

使用 `google-benchmark` 跑了一下，结果如下：
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

可以看到，平时常用的预处理 `log` 随着值域的增大，速度也变慢，而基于 `__builtin_clz()` 的 `log` 是相对最快的。

还有用四种 log 实现的 st 在洛谷上的表现情况：

| 方法 | 用时 |
| --: | :-- |
| `std::log2()` | 1.69s |
| `__builtin_clz()` | 1.57s |
| 浮点数算法 | 1.56s |
| 预处理 | 1.53s |

> 由于值域较小（$10^5$），预处理显然更快。

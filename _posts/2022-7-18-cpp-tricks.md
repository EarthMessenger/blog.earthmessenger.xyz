---
layout: post
title: "C++ 技巧"
date: 2022-7-18
tags: cpp trick
---

## 计算 $\mathrm{highbit}$

```cpp
unsigned int highbit(unsigned int x)
{
    x |= x >> 1;
    x |= x >> 2;
    x |= x >> 4;
    x |= x >> 8;
    x |= x >> 16;
    return x - (x >> 1);
}
```

$2$ 到 $7$ 行是将数字 $x$ 变成 $\mathrm{highbit}(x) \times 2 - 1$ 的格式。  
例子：$00110110 \Rightarrow 00111111$ 。  
再通过 $x - \frac{x}{2}$ 得到 $\mathrm{highbit}$。

## `bitset` 快速输出数字二进制

```cpp
void print_binary(unsigned int x)
{
    std::cout << std::bitset<32>(x);
}
```

## `emplace` 系列

使用 `emplace` 通常会比 `push` 之类的函数快一点，前者省去了一个拷贝过程。


> 待续

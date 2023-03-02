---
title: "C++ 技巧"
date: 2022-7-18
tags: cpp trick continually-updated
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

$2$ 到 $7$ 行是将数字 $x$ 变成 $\mathrm{highbit}(x) \times 2 - 1$ 的格式。\
例子：$00110110 \Rightarrow 00111111$ 。\
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

## lambda 函数递归

```cpp
auto f = [](auto &f, int i) -> int {
    if (i <= 1) return 1;
    else return f(f, i - 1) + f(f, i - 2);
}
```

类似函数式编程的 yc

## vector 的末尾元素

```cpp
std::vector a{0, 1, 2, 3, 4};
a[a.size() - 1] == 4;       // true
a.rbegin()[0] == 4;         // true
a.end()[-1] == 4;           // true
std::end(a)[-1] == 4;       // true
```

## std::ranges

C++20 带来的十分强大的功能，算是对迭代器之类东西的补充。

[cppreference.com: 范围库 (C++20)](https://zh.cppreference.com/w/cpp/ranges)

对于参数含 \[begin, end) 的迭代器对的函数，通常都有它的 ranges 版本：

```cpp
std::sort(a.begin(), a.end());
std::ranges::sort(a);

std::unique(a.begin(), a.end());
std::ranges::unique(a);

std::lower_bound(a.begin(), a.end(), x);
std::ranges::unique(a, x);
```

就相当于每处 `.begin()`、`.end()` 都可以节省 8 个非空白字符。

值得注意的是，`min`，`max` 也可以这样：

```cpp
*std::max_element(a.begin(), a.end());
std::ranges::max(a);
```

其他没用过，其他管道、过滤器啥的好像挺高级。

## 更多算法

### std::fill

[cppreference.com: std::fill](https://zh.cppreference.com/w/cpp/algorithm/fill)

与 memset 相比，优点在于可以任意设置填充的值，`std::fill(a.begin(), a.end(), 114514)`，
或 `std::ranges::fill(a, 114514)`，更加人性化。

性能上，不开 O2 与手写 for 循环填充相当，开了 O2 与 memset 相当。
（我没法测出开 O2 后手写填充的速度，它总是被 g++ 优化掉）。

<details>
<summary>测试代码</summary>

```cpp
#include <algorithm>
#include <cstring>
#include <ctime>
#include <cstdio>

uint8_t a[1 << 20];

int main()
{
    auto t1 = clock();
    for (int i = 0; i < (1 << 10); i++) {
        std::memset(a, 0, sizeof(a));
    }
    auto t2 = clock();
    printf("memset, filled with %u:  %lf\n", a[0], (double)(t2 - t1) / CLOCKS_PER_SEC);
    for (int i = 0; i < (1 << 10); i++) {
        std::fill(a, a + (1 << 20), 0);
    }
    auto t3 = clock();
    printf("std::fill, filled with %u: %lf\n", a[0], (double)(t3 - t2) / CLOCKS_PER_SEC);
    for (int i = 0; i < (1 << 10); i++) {
        for (int j = 0; j < (1 << 20); j++) {
            a[i] = 0;
        }
    }
    auto t4 = clock();
    printf("for, filled with %u: %lf\n", a[0], (double)(t4 - t3) / CLOCKS_PER_SEC);
}
```

在我的电脑上的结果：

无优化（-O0）：

    memset, filled with 0:  0.027887
    std::fill, filled with 0: 2.433606
    for, filled with 0: 2.133989

优化（-O2，下面那个 for 被优化掉了)：

    memset, filled with 0:  0.027291
    std::fill, filled with 0: 0.023069
    for, filled with 0: 0.000010

</details>

### 堆

[cppreference.com: std::make\_heap](https://zh.cppreference.com/w/cpp/algorithm/make_heap)

这里的堆不是 `std::priority_queue`，而是利用 `std::make_heap`、`std::push_heap`、
`std::pop_heap` 等函数实现的堆。

个人认为优点在于建堆是 $O(n)$ 的，而建 `std::priority_queue` 只能是 $O(n \log n)$ 的。

注意用法：

```cpp
std::vector<int> a{9, 9, 8, 2, 4, 4, 3, 5, 3};
std::make_heap(a.begin(), a.end()); // O(n) 建堆，等同于 std::ranges::make_heap(a);

a.emplace_back(6);
std::push_heap(a.begin(), a.end()); // 将 a.back() 加到堆中，等同于 std::ranges::push_heap(a);

std::pop_heap(a.begin(), a.end()); // 将 a.front() 与堆尾交换，并维护堆，等同于 std::ranges::pop_heap(a);
a.pop_back();
```

### std::iota

[cppreference.com: std::iota](https://zh.cppreference.com/w/cpp/algorithm/iota)

从某个值开始，依次自增填充数组。

```cpp
std::vector<int> a(10);
std::iota(a.begin(), a.end(), 0); // a = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
```

注意：std::ranges::iota 是 C++23 才加入的~漏网之鱼~。

### std::accumulate

[cppreference.com: std::accumulate](https://zh.cppreference.com/w/cpp/algorithm/accumulate)

给定初始值，求给定范围的和。注意：返回类型由初值决定。

```cpp
std::vector<int> a{3, 1, 4, 1, 5}
int sum = std::accumulate(a.begin(), a.end(), 0); // 14
int proc = std::accumulate(a.begin(), a.end(), 1, std::multiplies<int>()); // 60
```

### std::boyer\_moore\_searcher

[cppreference.com: std::boyer\_moore\_searcher](https://zh.cppreference.com/w/cpp/utility/functional/boyer_moore_searcher)

Boyer-Moore 匹配算法，是 $O(n)$ 的，配合 `std::search` 使用，但主要用于单次字符串匹配，多次的话最坏是 $O(nm)$。

反面教材：[loj 提交记录 \#1683441](https://loj.ac/s/1683441)

## bit

注意：不是 `bits`。

[cppreference.com: 位操纵](https://zh.cppreference.com/w/cpp/numeric#.E4.BD.8D.E6.93.8D.E7.BA.B5_.28C.2B.2B20_.E8.B5.B7.29)

C++20 的新东西，用于二进制位的操作。通常来说比手写快（编程效率和执行效率）。

以下的 `x` 均为 `unsigned`。

```cpp
x != 0 && x == lowbit(x);
std::has_single_bit(x);

highbit(x + 1); // 就是开头那个 highbit
std::bit_ceil(x);

x <= 1 ? 1 : highbit(x - 1) * 2;
std::bit_ceil(x);

x == 0 ? 1 : highbit(x);
std::bit_floor(x);

x == 0 ? 0 : (int)std::log2(x) + 1;
std::bit_width(x);

__builtin_clz(x); // count leading zero
std::countl_zero(x); // count left zero

__buildin_ctz(x); // count trailing zero
std::countr_zero(x); // count right zero

__builtin_clz(~x);
std::countl_one(x);

__builtin_ctz(~x);
std::countr_one(x);

__builtin_popount(x);
std::popcount(x);
```

## 三路比较

C++20 引入的新东西，主要用于简写六个比较运算符（`==`、`<`、`>`、`<=`、`>=`、`!=`）。

[cppreference.com: 三路比较](https://zh.cppreference.com/w/cpp/language/operator_comparison#.E4.B8.89.E8.B7.AF.E6.AF.94.E8.BE.83)

例子：

```cpp
template<int P> struct modint 
{
    int val;
    modint(int x) {
        val = (x % P + P) % P;
    }
    // ...
    auto operator<=>(const modint &x) const {
        return val <=> x.val;
    }
};
```


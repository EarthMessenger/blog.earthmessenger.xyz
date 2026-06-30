---
lang: zh-hant
opencc: true
pubDate: 2022-07-18
tags: cpp trick continually-updated
title: C++ 技巧
---

## 計算 $\mathrm{highbit}$

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

$2$ 到 $7$ 行是將數字 $x$ 變成 $\mathrm{highbit}(x) \times 2 - 1$ 的格式。\
例子：$00110110 \Rightarrow 00111111$ 。\
再通過 $x - \frac{x}{2}$ 得到 $\mathrm{highbit}$。

## `bitset` 快速輸出數字二進位制

```cpp
void print_binary(unsigned int x)
{
    std::cout << std::bitset<32>(x);
}
```

## `emplace` 系列

使用 `emplace` 通常會比 `push` 之類的函式快一點，前者省去了一個複製過程。

## lambda 函式遞迴

類似函數語言程式設計的 yc

```cpp
auto f = [](auto &f, int i) -> int {
    if (i <= 1) return 1;
    else return f(f, i - 1) + f(f, i - 2);
}
```

## 迭代器技巧

### 取末尾元素

非常 pythonic

```cpp
std::vector a{0, 1, 2, 3, 4};
a[a.size() - 1] == 4;       // true
a.rbegin()[0] == 4;         // true
a.end()[-1] == 4;           // true
std::end(a)[-1] == 4;       // true
```

### 逆序排序

```cpp
std::sort(a.begin(), a.end()); // 順序
std::sort(a.rbegin(), a.rend()); // 逆序
```

## std::ranges

C++20 帶來的十分強大的功能，算是對迭代器之類東西的補充。

[cppreference.com: 範圍庫 (C++20)](https://zh.cppreference.com/w/cpp/ranges)

對於引數含 \[begin, end) 的迭代器對的函式，通常都有它的 ranges 版本：

```cpp
std::sort(a.begin(), a.end());
std::ranges::sort(a);

std::unique(a.begin(), a.end());
std::ranges::unique(a);

std::lower_bound(a.begin(), a.end(), x);
std::ranges::lower_bound(a, x);
```

就相當於每處 `.begin()`、`.end()` 都可以節省 8 個非空白字元。

值得注意的是，`min`，`max` 也可以這樣：

```cpp
*std::max_element(a.begin(), a.end());
std::ranges::max(a);
```

其他沒用過，其他管道、過濾器啥的好像挺高階。

## 更多演算法

### std::fill

[cppreference.com: std::fill](https://zh.cppreference.com/w/cpp/algorithm/fill)

與 memset 相比，優點在於可以任意設定填充的值，`std::fill(a.begin(), a.end(), 114514)`，
或 `std::ranges::fill(a, 114514)`，更加人性化。

效能上，不開 O2 與手寫 for 迴圈填充相當，開了 O2 都差不多。

```cpp
#include <algorithm>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <ctime>

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
            a[j] = 0;
        }
    }
    auto t4 = clock();
    printf("for, filled with %u: %lf\n", a[0], (double)(t4 - t3) / CLOCKS_PER_SEC);
}
```

在我的電腦上的結果：

無最佳化（-O0）：

    memset, filled with 0:  0.022000
    std::fill, filled with 0: 2.298235
    for, filled with 0: 2.282090

最佳化（-O2)：

    memset, filled with 0:  0.023301
    std::fill, filled with 0: 0.026282
    for, filled with 0: 0.022732

### 堆

[cppreference.com: std::make\_heap](https://zh.cppreference.com/w/cpp/algorithm/make_heap)

這裡的堆不是 `std::priority_queue`，而是利用 `std::make_heap`、`std::push_heap`、
`std::pop_heap` 等函式實現的堆。

個人認為優點在於建堆是 $O(n)$ 的，而建 `std::priority_queue` 只能是 $O(n \log n)$ 的。

update: `std::priority_queue` 可以 $O(n)$ 建堆，使用其建構函式。這個東西我不知
道有什麼優勢。

注意用法：

```cpp
std::vector<int> a{9, 9, 8, 2, 4, 4, 3, 5, 3};
std::make_heap(a.begin(), a.end()); // O(n) 建堆，等同於 std::ranges::make_heap(a);

a.emplace_back(6);
std::push_heap(a.begin(), a.end()); // 將 a.back() 加到堆中，等同於 std::ranges::push_heap(a);

std::pop_heap(a.begin(), a.end()); // 將 a.front() 與堆尾交換，並維護堆，等同於 std::ranges::pop_heap(a);
a.pop_back();
```

### std::iota

[cppreference.com: std::iota](https://zh.cppreference.com/w/cpp/algorithm/iota)

從某個值開始，依次自增填充陣列。

```cpp
std::vector<int> a(10);
std::iota(a.begin(), a.end(), 0); // a = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
```

注意：std::ranges::iota 是 C++23 才加入的~~漏網之魚~~。

### std::accumulate

[cppreference.com: std::accumulate](https://zh.cppreference.com/w/cpp/algorithm/accumulate)

給定初始值，求給定範圍的和。注意：返回型別由初值決定。

```cpp
std::vector<int> a{3, 1, 4, 1, 5}
int sum = std::accumulate(a.begin(), a.end(), 0); // 14
int proc = std::accumulate(a.begin(), a.end(), 1, std::multiplies<int>()); // 60
```

<!--

### std::boyer\_moore\_searcher

[cppreference.com: std::boyer\_moore\_searcher](https://zh.cppreference.com/w/cpp/utility/functional/boyer_moore_searcher)

update: 我確實不知道它的原理，不要亂用。

Boyer-Moore 匹配演算法，是 $O(n)$ 的，配合 `std::search` 使用，但主要用於單次字串匹配，多次的話最壞是 $O(nm)$。

反面教材：[loj 提交記錄 \#1683441](https://loj.ac/s/1683441)

-->

## bit

注意：不是 `bits`。

[cppreference.com: 位操縱](https://zh.cppreference.com/w/cpp/numeric#.E4.BD.8D.E6.93.8D.E7.BA.B5_.28C.2B.2B20_.E8.B5.B7.29)

C++20 的新東西，用於二進位制位的操作。通常來說比手寫快（程式設計效率和執行效率）。

以下的 `x` 均為 `unsigned`。

```cpp
x != 0 && x == lowbit(x);
std::has_single_bit(x);

highbit(x + 1); // 就是開頭那個 highbit
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

## 比較

### 三路比較

C++20 引入的新東西，主要用於簡寫多個比較運算子。

[cppreference.com: 三路比較](https://zh.cppreference.com/w/cpp/language/operator_comparison#.E4.B8.89.E8.B7.AF.E6.AF.94.E8.BE.83)

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

### `std::greater<>` 等

C++14 之後，所有的這種比較類都有了這種特化，當你不在模板引數中填寫內容，或者填
寫 `void` 的時候，可用於任意兩個型別的比較。大概長這樣：

```cpp
template< class T, class U >

constexpr auto operator()( T&& lhs, U&& rhs ) const
    -> decltype(std::forward<T>(lhs) > std::forward<U>(rhs));
```

這意味著你在大多是需要傳這種比較類的地方可以這樣寫了：

```cpp
std::priority_queue<std::pair<int, int>, std::vector<int, int>, std::greater<>>
std::sort(a.begin(), a.end(), std::greater<>());
```

### 透明比較器

見[用於關聯式容器的透明比較器技巧](/posts/associative-containers-trick)。

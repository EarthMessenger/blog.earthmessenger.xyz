---
title: "一种 ODT 实现"
pubDate: 2023-10-15
tags: cpp trick oi
---

## 介绍

这是定义：

```cpp
std::map<int, T> a;
```

`a[i] = v` 表示从 `i` 到 `i` 的下一个节点的下标这个区间对应的值都是 `v`。建议先
把 `a[0]` 和 `a[n]` 赋上值。

`split` 操作如下：

```cpp
auto split(int x)
{
    auto p = --a.upper_bound(x);
    if (p->first == x) return p;
    auto v = p->second;
    auto [q, _] = a.emplace(x, v);
    return q;
}
```

注意到你在 `split` 操作中没有删除节点，所以这样迭代器不会失效，可以直接先
`split` 左节点再 `split` 右节点，非常优美。

`assign` 操作如下：

```cpp
void assign(int l, int r, T v)
{
    auto lp = split(l);
    auto rp = split(r);
    a.erase(lp, rp);
    a.emplace(l, v);
}
```

## 实践

这是 ODT 板子 [CF896C Willem, Chtholly and Seniorious][cf896c]。

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <vector>

int pow_mod(long long x, long long y, int m)
{
    x %= m;
    long long res = 1;
    while (y) {
        if (y & 1) res = res * x % m;
        x = x * x % m;
        y >>= 1;
    }
    return res;
}

int main()
{
    int n, m;
    long long seed;
    int vmax;
    std::cin >> n >> m >> seed >> vmax;

    auto rnd = [&seed]()
    {
        auto ret = seed;
        seed = (seed * 7 + 13) % 1000000007;
        return ret;
    };

    std::vector<int> a(n);
    std::map<int, long long> t;
    for (int i = 0; i < n; i++) {
        a[i] = rnd() % vmax + 1;
        t.emplace(i, a[i]);
    }
    t.emplace(n, 0);

    auto split = [&t](int x)
    {
        auto p = --t.upper_bound(x);
        if (p->first == x) return p;
        auto v = p->second;
        auto [q, _] = t.emplace(x, v);
        return q;
    };

    auto add = [&split, &t](int l, int r, int v)
    {
        auto lp = split(l);
        auto rp = split(r);
        for (auto p = lp; p != rp; p++) {
            p->second += v;
        }
    };

    auto assign = [&split, &t](int l, int r, int v)
    {
        auto lp = split(l);
        auto rp = split(r);
        t.erase(lp, rp);
        t.emplace(l, v);
    };

    auto kth = [&split, &t](int l, int r, int k) -> long long
    {
        std::vector<std::pair<long long, int>> a;
        auto lp = split(l);
        auto rp = split(r);
        for (auto p = lp; p != rp; p++) {
            a.emplace_back(p->second, std::next(p)->first - p->first);
        }
        std::sort(a.begin(), a.end());
        for (auto [v, c] : a) {
            k -= c;
            if (k <= 0) return v;
        }
        return -1;
    };

    auto sum = [&split, &t](int l, int r, int x, int y)
    {
        int ans = 0;
        auto lp = split(l);
        auto rp = split(r);
        for (auto p = lp; p != rp; p++) {
            ans = (ans + (long long)pow_mod(p->second, x, y) * (std::next(p)->first - p->first) % y) % y;
        }
        return ans;
    };

    for (int i = 0; i < m; i++) {
        int op = rnd() % 4 + 1;
        int l = rnd() % n + 1;
        int r = rnd() % n + 1;
        if (l > r) std::swap(l, r);
        int x = 0, y = 0;
        if (op == 3) {
            x = rnd() % (r - l + 1) + 1;
        } else {
            x = rnd() % vmax + 1; 
        }
        if (op == 4) {
            y = rnd() % vmax + 1;
        }
        l--;

        if (op == 1) {
            add(l, r, x);
        } else if (op == 2) {
            assign(l, r, x);
        } else if (op == 3) {
            std::cout << kth(l, r, x) << std::endl;;
        } else {
            std::cout << sum(l, r, x, y) << std::endl;
        }
    }
}
```

[cf896c]: https://codeforces.com/contest/896/problem/C

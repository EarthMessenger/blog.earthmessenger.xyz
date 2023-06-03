---
layout: ../../../layouts/PostLayout.astro
title: CWOI J C30D 糖果
tags: cwoi
---

给定 $n$ 个二元组 $\left(a_i, b_i\right)$，选取其中 $\lfloor\dfrac{n}{2}\rfloor + 1$ 个元素，
使得选取元素的 $a$, $b$ 的和超过所有元素 $a$, $b$ 和的一半，求选取元素。

当 $n$ 是偶数时，随便选取一个，转化成奇数的情况。

当 $n$ 是奇数时，将二元组按照 $a_i$ 从大到小排序。先选一个 $a_i$ 最大的，然后将余下 $n-1$ 个二元组分成相邻两个一组，
对于每一组选取 $b_i$ 较大的。

证明：wip

```cpp
struct node_t
{
    int id, a, b;
};

int main()
{
    int n;
    std::cin >> n;
    std::vector<node_t> a(n);
    long long as = 0, bs = 0;
    for (auto &i : a) std::cin >> i.a;
    for (auto &i : a) std::cin >> i.b;
    for (int i = 0; i < n; i++) {
        as += a[i].a;
        bs += a[i].b;
        a[i].id = i + 1;
    }
    as = as / 2 + as % 2;
    bs = bs / 2 + bs % 2;
    std::sort(a.begin(), a.end(), [](node_t a, node_t b) { return a.a < b.a; });
    std::vector<int> ans;
    if (n % 2 == 0) {
        ans.emplace_back(a.back().id);
        as -= a.back().a;
        bs -= a.back().b;
        a.pop_back();
        n--;
    }
    for (int i = 0; i < n - 1; i += 2) {
        int select = i;
        if (a[i].b < a[i + 1].b) select++;
        ans.emplace_back(a[select].id);
        as -= a[select].a;
        bs -= a[select].b;
    }
    as -= a.back().a;
    bs -= a.back().b;
    ans.emplace_back(a.back().id);
    if (as > 0 || bs > 0) std::cout << -1;
    else {
        std::cout << ans.size() << std::endl;
        for (auto i : ans) std::cout << i << " ";
    }
    std::cout << std::endl;
}
```

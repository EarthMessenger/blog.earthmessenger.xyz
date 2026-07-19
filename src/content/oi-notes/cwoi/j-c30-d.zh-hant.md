---
lang: zh-hant
opencc: true
tags: cwoi
title: CWOI J C30D 糖果
---

給定 $n$ 個二元組 $\left(a_i, b_i\right)$，選取其中 $\lfloor\dfrac{n}{2}\rfloor + 1$ 個元素，
使得選取元素的 $a$, $b$ 的和超過所有元素 $a$, $b$ 和的一半，求選取元素。

當 $n$ 是偶數時，隨便選取一個，轉化成奇數的情況。

當 $n$ 是奇數時，將二元組按照 $a_i$ 從大到小排序。先選一個 $a_i$ 最大的，然後將餘下 $n-1$ 個二元組分成相鄰兩個一組，
對於每一組選取 $b_i$ 較大的。

證明：wip

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

---
title: Atcoder ABC 290 E Make it Palindrome
tags: abc
---

对于数列 $X$，定义 $f(X)$ 表示将 $X$ 变成回文串最少的需要改变的元素数量。给定
数组 $A$，求其所有连续子串的 $f(X)$ 值之和。

对于每一个 $i, j$ 对，若 $A_i \neq A_j$，则会产生 $\min\\{i + 1, n - j\\}$ 的贡献。
发现找这个不同值对不方便，可以考虑反面，算出所有数对的贡献再减去相同数对的贡献。

令值 $i$ 出现的所有位置为 $P_{i, 0}, P_{i, 1}, P_{i, 2}, \cdots$，任意一个 $P_i$
中两个数组成的数对都会产生数贡献。考虑如何计算所有相同数对的负贡献。枚举 $i$，
令 $l, r$ 分别表示当前考虑的 $P_i$ 的左右端点。如果 $P_{i, l} + 1 < n - P_{i, r}$，
则每一个以 $P_{i, l}$ 开始的相同数对都可以产生 $(P_{i, l} + 1) \times (r - l + 1)$ 
的负贡献，然后把 $l \gets l + 1$，反之亦然。计算所有数对的贡献也可以用类似的方法。

```cpp
int main()
{
    int n;
    cin >> n;
    vector<int> a(n);
    vector<vector<int>> pos(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        a[i]--;
        pos[a[i]].emplace_back(i);
    }
    long long res = 0;
    {
        int l = 0, r = n - 1;
        while (l <= r) {
            if (l + 1 < n - r) {
                res += (long long)(r - l + 1) * (l + 1);
                l++;
            } else {
                res += (long long)(r - l + 1) * (n - r);
                r--;
            }
        }
    }
    // cout << res << endl;
    for (int i = 0; i < n; i++) {
        int l = 0, r  = pos[i].size() - 1;
        auto &p = pos[i];
        while (l <= r) {
            if (p[l] + 1 < n - p[r]) {
                res -= (long long)(r - l + 1) * (p[l] + 1);
                l++;
            } else {
                res -= (long long)(r - l + 1) * (n - p[r]);
                r--;
            }
        }
    }
    cout << res << endl;
}
```

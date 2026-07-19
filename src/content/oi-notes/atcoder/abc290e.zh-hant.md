---
lang: zh-hant
opencc: true
tags: abc
title: AtCoder ABC 290 E Make it Palindrome
---

對於數列 $X$，定義 $f(X)$ 表示將 $X$ 變成迴文串最少的需要改變的元素數量。給定
陣列 $A$，求其所有連續子串的 $f(X)$ 值之和。

對於每一個 $i, j$ 對，若 $A_i \neq A_j$，則會產生 $\min\{i + 1, n - j\}$ 的貢獻。
發現找這個不同值對不方便，可以考慮反面，算出所有數對的貢獻再減去相同數對的貢獻。

令值 $i$ 出現的所有位置為 $P_{i, 0}, P_{i, 1}, P_{i, 2}, \cdots$，任意一個 $P_i$
中兩個陣列成的數對都會產生數貢獻。考慮如何計算所有相同數對的負貢獻。列舉 $i$，
令 $l, r$ 分別表示當前考慮的 $P_i$ 的左右端點。如果 $P_{i, l} + 1 < n - P_{i, r}$，
則每一個以 $P_{i, l}$ 開始的相同數對都可以產生 $(P_{i, l} + 1) \times (r - l + 1)$ 
的負貢獻，然後把 $l \gets l + 1$，反之亦然。計算所有數對的貢獻也可以用類似的方法。

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

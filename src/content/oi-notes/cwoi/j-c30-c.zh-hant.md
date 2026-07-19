---
lang: zh-hant
opencc: true
tags: cwoi
title: CWOI J C30C 覆蓋
---

有一個 $n$ 個節點的有根樹，每次操作隨機選取一個無色的點，將它到根的所有節點染成黑色，求將整棵樹染黑的期望操作次數。

參考：[CF 280C](https://codeforces.com/problemset/problem/280/C).

一個節點產生 $1$ 的貢獻，僅當以它為根的子樹中的節點沒有在他前面被操作，因此每個節點的貢獻期望為 $\dfrac{1}{size_i}$，
其中 $size_i$ 是以 $i$ 為根子樹的節點數量。

```cpp
int main()
{
    int n;
    scanf("%d", &n);
    for (int i = 2; i <= n; i++) {
        scanf("%d", &fa[i]);
        deg[fa[i]]++;
    }
    std::queue<int> q;
    for (int i = 1; i <= n; i++)
        if (deg[i] == 0) q.emplace(i);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        size[u]++;
        deg[fa[u]]--;
        size[fa[u]] += size[u];
        if (deg[fa[u]] == 0) q.emplace(fa[u]);
    }
    get_inv(n);
    long long ans = 0;
    for (int i = 1; i <= n; i++) {
        ans = (ans + inv[size[i]]) % MODN;
    }
    printf("%lld\n", ans);
}
```

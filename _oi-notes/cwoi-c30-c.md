---
layout: oi-notes
title: CWOI C30C 覆盖
tags: cwoi
---

有一个 $n$ 个节点的有根树，每次操作随机选取一个无色的点，将它到根的所有节点染成黑色，求将整棵树染黑的期望操作次数。

参考：[CF 280C](https://codeforces.com/problemset/problem/280/C).

一个节点产生 $1$ 的贡献，仅当以它为根的子树中的节点没有在他前面被操作，因此每个节点的贡献期望为 $\dfrac{1}{size_i}$，
其中 $size_i$ 是以 $i$ 为根子树的节点数量。

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
---
layout: ../../../layouts/PostLayout.astro
title: CWOI J C30B 幻想商店
tags: cwoi
---

有 $n$ 个人 $m$ 个商店，每个人可以选择去编号为 $a_i$ 或 $b_i$ 的商店，问最多有多少个商店访客数量为偶数。

将所有的商店看成一个图，每一个人的选择就相当于一条边。现在我们选取一个连通块取其任意一个 dfs 树。 

![tree.png](https://s2.loli.net/2022/08/11/psyUeVBIY2vNkJD.png)

如图，对于一个 $\{2, 7, 6, 8, 5\}$ 几个节点组成的子树，无论初始状态如何，总可以使 $\{7, 6, 8, 5\}$ 是偶数。
同理向上一层，$\{2, 3, 4\}$ 也可以保证是偶数，只有 $1$ 不能保证，但倘若有偶数条边，其他的节点都是偶数，$1$ 也必然是偶数，反之必是奇数。

得到结论，当一个连通块边数为偶数时，可以全部为偶数，反之必有一个为奇数。

```cpp
int main()
{
    int n, m;
    std::cin >> n >> m;
    std::vector<int> cnt(m, 0);
    std::vector<int> fa(m);
    std::iota(fa.begin(), fa.end(), 0);

    std::function<int(std::vector<int> &, int)> find =
        [&find](std::vector<int> &f, int x) {
            if (f[x] == x) return x;
            else return f[x] = find(f, f[x]);
        };

    for (int i = 0; i < n; i++) {
        int x, y;
        std::cin >> x >> y;
        x--;
        y--;
        int fx = find(fa, x);
        int fy = find(fa, y);
        if (fx != fy) {
            cnt[fx] += cnt[fy] + 1;
            fa[fy] = fx;
        } else cnt[fx]++;
    }

    int ans = 0;
    for (int i = 0; i < m; i++)
        if (i == fa[i] && cnt[i] % 2 == 1) ans++;
    std::cout << m - ans << std::endl;
}
```

---
lang: zh-hant
opencc: true
tags: cwoi
title: CWOI J C30B 幻想商店
---

有 $n$ 個人 $m$ 個商店，每個人可以選擇去編號為 $a_i$ 或 $b_i$ 的商店，問最多有多少個商店訪客數量為偶數。

將所有的商店看成一個圖，每一個人的選擇就相當於一條邊。現在我們選取一個連通塊取其任意一個 dfs 樹。 

![tree.png](https://s2.loli.net/2022/08/11/psyUeVBIY2vNkJD.png)

如圖，對於一個 $\{2, 7, 6, 8, 5\}$ 幾個節點組成的子樹，無論初始狀態如何，總可以使 $\{7, 6, 8, 5\}$ 是偶數。
同理向上一層，$\{2, 3, 4\}$ 也可以保證是偶數，只有 $1$ 不能保證，但倘若有偶數條邊，其他的節點都是偶數，$1$ 也必然是偶數，反之必是奇數。

得到結論，當一個連通塊邊數為偶數時，可以全部為偶數，反之必有一個為奇數。

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

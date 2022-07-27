---
layout: post
title: On Changing Tree 题解
date: 2022-2-9
tags: solution ds
categories: common
---

题目：[On Changing Tree](https://www.luogu.com.cn/problem/CF396C)

显然，我们可以先 `dfs` 预处理转成区间问题，然后再使用线段树来维护。

然后你会发现线段树的 `lazytag` 难以维护，既有不同的深度，又有不同的 \\(x\\) 和 \\(k\\)。因此考虑将修改操作化简。

我们假设节点 \\(i\\) 的深度为 \\(dep_i\\)，父亲为 \\(fa_i\\)。

对于以 \\(u\\) 为根节点的子树，如果我们执行修改操作 \\((x, k)\\)，就等价于在 \\(fa_u\\) 为根的子树上执行操作 \\((x + k, k)\\)（当然，我们不修改 \\(u\\) 的其他兄弟子树）。因此我们可以把所有的修改操作的根统一到节点 \\(1\\) 上面，也就是说把操作化为在根节点上执行 \\((x + k(dep_u - dep_1), k)\\)。

那么放到根节点上有何好处呢？假如现在 `lazytag` 中标记了操作 \\((x, k)\\)，又要放置新标记 \\((x', k')\\)，由于距离根节点的深度相等，因此可以直接合并为 \\((x + x', k + k')\\)。

所以代码如下：

```cpp
#include <cstdio>
#include <vector>

typedef long long i64;

const int MAXN = 3e5;
const i64 MODN = 1e9 + 7;

std::vector<int> graph[MAXN + 5];

int n;

int dfs_start[MAXN + 5], dfs_end[MAXN + 5], dfs_map[MAXN + 5], dep[MAXN + 5], cnt = 0;

void dfs(int cur, int fa)
{
    dep[cur] = dep[fa] + 1;
    dfs_start[cur] = ++cnt;
    dfs_map[cnt] = cur;
    for (auto i : graph[cur])
    {
        dfs(i, cur);
    }
    dfs_end[cur] = cnt;
}

struct lazy_t
{
    i64 x, k;
    lazy_t(i64 x = 0, i64 k = 0) : x(x), k(k) {}
    bool nolazy() { return x == 0 && k == 0; }
};

template<class T, class L, size_t S>
struct segtree
{
    T data[S * 4];
    L lazy[S * 4];
};

segtree<i64, lazy_t, MAXN> tree;

void build_segtree(int ll, int rr, int p)
{
    if (ll == rr)
    {
        tree.data[p] = 0;
    }
    else
    {
        int mid = (ll + rr) / 2, lchild = p * 2, rchild = p * 2 + 1;
        build_segtree(ll, mid, lchild);
        build_segtree(mid + 1, rr, rchild);
        tree.data[p] = 0;
    }
}

i64 to_root(i64 x, int u, i64 k) // 将操作统一到根节点 1 上，求出新的 x
{
    return (x + (dep[u] - dep[1]) * k);
}

void put_tag(i64 x, i64 k, int ll, int rr, int p)
{
    tree.data[p] += ((x - (dep[dfs_map[ll]] - dep[1]) * k) % MODN + MODN) % MODN;
    tree.lazy[p].k = (tree.lazy[p].k + k) % MODN; // 全部统一到根节点后可以直接合并 (x, k)。
    tree.lazy[p].x = (tree.lazy[p].x + x) % MODN;
}

void push_down(int ll, int rr, int p)
{
    if (!tree.lazy[p].nolazy())
    {
        int mid = (ll + rr) / 2, lchild = p * 2, rchild = p * 2 + 1;
        put_tag(tree.lazy[p].x, tree.lazy[p].k, ll, mid, lchild);
        put_tag(tree.lazy[p].x, tree.lazy[p].k, mid + 1, rr, rchild);
        tree.lazy[p].k = tree.lazy[p].x = 0;
    }
}

void update_segtree(int l, int r, i64 x, i64 k, int ll, int rr, int p)
{
    if (l <= ll && rr <= r)
    {
        put_tag(x, k, ll, rr, p);
    }
    else
    {
        push_down(ll, rr, p);
        int mid = (ll + rr) / 2, lchild = p * 2, rchild = p * 2 + 1;
        if (l <= mid) update_segtree(l, r, x, k, ll, mid, lchild);
        if (mid < r) update_segtree(l, r, x, k, mid + 1, rr, rchild);
    }
}

i64 query_segtree(int pos, int ll, int rr, int p)
{
    if (ll == pos && rr == pos)
    {
        return (tree.data[p] % MODN + MODN) % MODN;
    }
    else
    {
        push_down(ll, rr, p);
        int mid = (ll + rr) / 2, lchild = p * 2, rchild = p * 2 + 1;
        if (pos <= mid) return query_segtree(pos, ll, mid, lchild);
        else if (mid < pos) return query_segtree(pos, mid + 1, rr, rchild);
    }
    return 0;
}

int main()
{
    scanf("%d", &n);
    for (int i = 2; i <= n; i++)
    {
        int p;
        scanf("%d", &p);
        graph[p].push_back(i);
    }

    dfs(1, 0);
    build_segtree(1, n, 1);
    int q;
    scanf("%d", &q);
    while (q--)
    {
        int op;
        scanf("%d", &op);
        if (op == 1)
        {
            int v;
            i64 x, k;
            scanf("%d%lld%lld", &v, &x, &k);
            update_segtree(dfs_start[v], dfs_end[v], to_root(x, v, k), k, 1, n, 1);
        }
        else if (op == 2)
        {
            int u;
            scanf("%d", &u);
            printf("%lld\n", query_segtree(dfs_start[u], 1, n, 1));
        }
    }
}
```


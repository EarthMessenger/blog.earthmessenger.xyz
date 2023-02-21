---
layout: oi-notes
title: Atcoder ABC 290 F Maximum Diameter
tags: at
---

## 题意

给定一个长度为 $N$ 的序列 $X_0, X_1, X_2, \cdots, X_{N-1}$，$f(X)$ 定义如下：

> 对于所有有 $N$ 个节点的树，满足第 $i$ 个节点的度数为 $X_i$，$f(X)$ 及为所有
> 这样树的直径的最大值。

给定一个 $N$，求所有长度为 $N$ 的序列 $X$ 的 $f(X)$ 之和。

由于有多组询问，单次询问时间复杂度必须小于 $O(\log N)$。

## 解法

首先，一棵有 $N$ 个节点的树有 $N-1$ 条边，故 $\sum X = 2(N - 1)$，且 
$\min{X} \ge 1$。

考虑如何从 $X$ 求出 $f(X)$。先从链的情况考虑，这时有 $X$ 由两个 $1$ 和 $n - 2$
个 $2$ 组成，且 $f(X) = n - 1$。对于其他 $X$，可以理解成一些 $2$ 变成了 $1$，
并且把多余的 $1$ 加到了其他非 $1$ 的地方，反映到图上就是原来的链中的一些度为 $2$
的节点被删除，又重新连到了其他原来非 $1$ 的节点上，变成了叶子。自然，每多一个 
$1$，直径就小 $1$，故设序列 $A$ 中 $1$ 有 $i$ 个，则 $f(X) = n - i + 1$。
（有点抽象，自己画图理解）

故枚举 $i$，$1$ 的个数为 $i$ 的答案为 
$(n - i + 1) \times \binom{n}{i} \times \binom{i - 2 + n - i - 1}{n - i - 1}$。
其中 $n - i + 1$ 为直径，$\binom{n}{i}$ 为所有的 $1$ 位置的方案数，
$\binom{i - 2 + n - i - 1}{n - i - 1}$ 为把多余的 $i$ 分配到其他 $n - i$ 个位置
的方案数（插板法）。

所以总答案为：

$$
\begin{aligned}
  & \sum_{i = 2}^{n - 1} (n - i + 1) \binom{n}{i} \binom{i - 2 + n - i - 1}{n - i - 1} \\\\
= & \sum_{i = 2}^{n - 1} (n - i + 1) \binom{n}{i} \binom{n - 3}{n - i - 1} \\\\
= & (n + 1) \sum_{i = 2}^{n - 1} \binom{n}{i} \binom{n - 3}{n - i - 1} - \sum_{i = 2}^{n - 1} i \binom{n}{i} \binom{n - 3}{n - i - 1} \\\\
= & (n + 1) \sum_{i = 2}^{n - 1} \binom{n}{i} \binom{n - 3}{n - i - 1} - \sum_{i = 2}^{n - 1} n\binom{n - 1}{i - 1} \binom{n - 3}{n - i - 1} \\\\
\end{aligned}
$$

然而这样仍然是 $O(n)$ 的。问题在于如何快速计算那两个 sigma。以 
$\sum_{i = 2}^{n - 1} \binom{n}{i} \binom{n - 3}{n - i - 1}$ 为例，它的相当于有
$n$ 个蓝色球和 $n - 3$ 个红色球，选 $i$ 个蓝色球和 $n - i - 1$ 个红色球的方案数，
即是 $2n - 3$ 个球中选择 $n - 1$ 个球的方案数，也就是 $\binom{2n - 3}{n - 1}$。

故答案为 $(n + 1)\binom{2n - 3}{n - 1} - n\binom{2n - 4}{n - 2}$。

```cpp
void solve()
{
    int n;
    cin >> n;
    if (n == 2) {
        cout << 1 << endl;
        return ;
    }
    mint ans = (n + 1) * binom(2 * n - 3, n - 1);
    ans -= n * binom(n * 2 - 4, n - 2);
    cout << ans.val() << endl;
}
```

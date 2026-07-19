---
lang: zh-hant
opencc: true
tags: at
title: AtCoder ABC 290 F Maximum Diameter
---

## 題意

給定一個長度為 $N$ 的序列 $X_0, X_1, X_2, \cdots, X_{N-1}$，$f(X)$ 定義如下：

> 對於所有有 $N$ 個節點的樹，滿足第 $i$ 個節點的度數為 $X_i$，$f(X)$ 及為所有
> 這樣樹的直徑的最大值。

給定一個 $N$，求所有長度為 $N$ 的序列 $X$ 的 $f(X)$ 之和。

由於有多組詢問，單次詢問時間複雜度必須小於 $O(\log N)$。

## 解法

首先，一棵有 $N$ 個節點的樹有 $N-1$ 條邊，故 $\sum X = 2(N - 1)$，且 
$\min{X} \ge 1$。

考慮如何從 $X$ 求出 $f(X)$。先從鏈的情況考慮，這時有 $X$ 由兩個 $1$ 和 $n - 2$
個 $2$ 組成，且 $f(X) = n - 1$。對於其他 $X$，可以理解成一些 $2$ 變成了 $1$，
並且把多餘的 $1$ 加到了其他非 $1$ 的地方，反映到圖上就是原來的鏈中的一些度為 $2$
的節點被刪除，又重新連到了其他原來非 $1$ 的節點上，變成了葉子。自然，每多一個 
$1$，直徑就小 $1$，故設序列 $A$ 中 $1$ 有 $i$ 個，則 $f(X) = n - i + 1$。
（有點抽象，自己畫圖理解）

故列舉 $i$，$1$ 的個數為 $i$ 的答案為 
$(n - i + 1) \times \binom{n}{i} \times \binom{i - 2 + n - i - 1}{n - i - 1}$。
其中 $n - i + 1$ 為直徑，$\binom{n}{i}$ 為所有的 $1$ 位置的方案數，
$\binom{i - 2 + n - i - 1}{n - i - 1}$ 為把多餘的 $i$ 分配到其他 $n - i$ 個位置
的方案數（插板法）。

所以總答案為：

$$
\begin{aligned}
  & \sum_{i = 2}^{n - 1} (n - i + 1) \binom{n}{i} \binom{i - 2 + n - i - 1}{n - i - 1} \\
= & \sum_{i = 2}^{n - 1} (n - i + 1) \binom{n}{i} \binom{n - 3}{n - i - 1} \\
= & (n + 1) \sum_{i = 2}^{n - 1} \binom{n}{i} \binom{n - 3}{n - i - 1} - \sum_{i = 2}^{n - 1} i \binom{n}{i} \binom{n - 3}{n - i - 1} \\
= & (n + 1) \sum_{i = 2}^{n - 1} \binom{n}{i} \binom{n - 3}{n - i - 1} - \sum_{i = 2}^{n - 1} n\binom{n - 1}{i - 1} \binom{n - 3}{n - i - 1} \\
\end{aligned}
$$

然而這樣仍然是 $O(n)$ 的。問題在於如何快速計算那兩個 sigma。以 
$\sum_{i = 2}^{n - 1} \binom{n}{i} \binom{n - 3}{n - i - 1}$ 為例，它的相當於有
$n$ 個藍色球和 $n - 3$ 個紅色球，選 $i$ 個藍色球和 $n - i - 1$ 個紅色球的方案數，
即是 $2n - 3$ 個球中選擇 $n - 1$ 個球的方案數，也就是 $\binom{2n - 3}{n - 1}$。

故答案為 $(n + 1)\binom{2n - 3}{n - 1} - n\binom{2n - 4}{n - 2}$。

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

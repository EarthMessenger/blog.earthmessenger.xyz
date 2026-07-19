---
lang: zh-hant
opencc: true
tags: joi math
title: JOISC 2018 D 修行 (Asceticism)
---

## 題意

給定 $n$ 和 $k$，求有多少個 1-n 的排列 $p$ 使得恰好存在 $k$ 個不同的位置 $i$
滿足 $p_{i} > p_{i+1}$。

即是 Eulerian Number 單點求值。

- $1 \le k+1 \le n \le 1 \times 10^5$

## 解析

求一個這種排列的數量可以轉化為求出現機率。而某種長度為 $n$ 的排列的出現機率其實
是可以轉化為有 $n$ 個取值為 $[0, 1)$ 的連續隨機變數的，為兩個連續隨機變數相等的
機率為 0，排列中兩個值相等的機率也是 0，每一組隨機變數的偏序關係都可以對應成一
個排列。

要求剛好有 $k$ 個滿足 $p_{i} > p_{i+1}$ 的不好解決，考慮求至多有 $k$ 個，即令
$f(k)$ 表示**小於**有 $k$ 個位置滿足 $p_{i} > p_{i+1}$ 的機率，要求的答案就是
$f(k+1)-f(k)$。

假設我們隨機的序列叫作 $a_{1}, a_{2}, \cdots, a_{n}$，令：

$$
b_{i}=
\begin{cases}
a_{1}                               & i=1 \\
a_{i}-a_{i-1} + [a_{i} < a_{i-1}]   & i>1
\end{cases}
$$

這個 $b$ 與 $a$ 是一一對應的，可以想象成有一個環，則這個 $b_{i}$ 就是在環上
$a_{i-1}$ 到 $a_{i}$ 的步長。同時，$b$ 的值域和 $a$ 一樣，都是 $[0, 1)$。容易發
現，如果 $a$ 有**不超過** $k$ 個位置滿足那個條件，則有 $\sum b < k+1$。換句話說，
我們要求的就是 $f(k)$ 就是找 $\sum b < k$ 的機率。

如何求 $\sum b < k$ 的機率呢？參考某一道叫作 [Hyperrectangle][at_hyperrectangle]
的題目。考慮一個 $n$ 維座標系，這個問題就轉化為，有一個超立方體，從 $(0,0,\cdots,0)$
到 $(1,1,\cdots,1)$，與一個 $\sum_{i=1}^{n} x_{i} = k$ 的超平面，問這個超立方體
被這個超平面切割後的體積與原體積（即 1）之比。如圖：

![hyperrenctangle](/assets/images/hyperrenctangle-ecdf63c7.webp)

接下來考慮求這個被切割的體積。首先考慮沒有這個超立方體的限制，令 $S_{n}(k)$ 表
示在 $n$ 維中 $\sum_{i=1}^{n} x_{i} < k\ (x_{i}\ge 0)$ 的體積。

- 當 $n=2$ 時，是三角形，容易得到 $S_{2}(k)=\frac{k^2}{2}$。
- 當 $n=3$ 時，是稜錐，容易得到 $S_{3}(k)=\frac{k^3}{6}$。
- 猜測 $S_{n}(k)=\frac{k^n}{n!}$。通過數學歸納法：

$$
\begin{aligned}
S_{n}(k)    &= \int_{0}^{k} S_{n-1}(x) \mathrm{d}x \\
            &= \int_{0}^{k} \frac{x^{n-1}}{(n-1)!} \mathrm{d}x \\
            &= \frac{1}{(n-1)!} \cdot \int_{0}^{k} x^{n-1} \mathrm{d}x \\
            &= \frac{1}{(n-1)!} \cdot \frac{k^n}{n} \\
            &= \frac{k^n}{n!}
\end{aligned}
$$

當然還有一種比較感性的理解方法。我們要求 $n$ 維中 $\sum_{i=1}^{n} x_{i} < k\
(x_{i}\ge 0)$ 的體積。令 $y_{i} = \sum_{j=1}^{i} x_{j}$，即 $x$ 的字首和，$y$
和 $x$ 是一一對應的。由於和不超過 $k$，所以 $y_{i}$ 可以取 $[0, k)$ 的所有值，
體積為 $k^n$。同時，由於 $x_{i} \ge 0$，故 $y_{i}$ 是單調遞增的，所以需要再除以
$n!$，即 $\frac{k^n}{n!}$。

然後對於這個超立方體的限制，可以容斥。令 $g(t)$ 表示有 $t$ 個座標在 $[1, k)$ 中，
$n-t$ 個座標在 $[0, k)$ 中，滿足 $\sum x < k$ 的體積。實際上，加上這個限制可以
當作有 $t$ 個座標軸平移了 1 個單位，可以得到 $g(t)=S_{n}(k-t)$。所以總的體積
（機率）就是：

$$
\begin{aligned}
f(k)    &= \sum_{i=0}^{k} (-1)^i \cdot \binom{n}{i} \cdot g(i) \\
        &= \sum_{i=0}^{k} (-1)^i \cdot \binom{n}{i} \cdot \frac{(k-i)^n}{n!}
\end{aligned}
$$

時間複雜度 $O(n\log n)$，這個 $\log$ 是快速冪。

[at_hyperrectangle]: https://atcoder.jp/contests/jag2014summer-day2/tasks/icpc2014summer_day2_j
[hyperrenctangle_sol]: https://www.luogu.com.cn/blog/chen196422803/solution-at-icpc2014summer-day2-j

## 實現

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

const int M = 1'000'000'007;

int pow_mod(int x, int y)
{
	int r = 1;
	while (y) {
		if (y & 1) r = (long long)r * x % M;
		x = (long long)x * x % M;
		y >>= 1;
	}
	return r;
}

int get_inv(int x)
{
	return pow_mod(x, M - 2);
}

int main()
{
	int n, k;
	std::cin >> n >> k;

	std::vector<int> fac(n * 2 + 1), ifac(n * 2 + 1);
	fac[0] = 1;
	for (int i = 1; i <= n * 2; i++) fac[i] = (long long)fac[i - 1] * i % M;
	ifac.back() = get_inv(fac.back());
	for (int i = n * 2; i > 0; i--) ifac[i - 1] = (long long)ifac[i] * i % M;
	auto binom = [&fac, &ifac](int n, int m)
	{
		return (long long)fac[n] * ifac[m] % M * ifac[n - m] % M;
	};

	auto f = [&fac, &ifac, &binom](int n, int k)
	{
		int res = 0;
		for (int i = 0; i <= k; i++) {
			int t = (long long)pow_mod(k - i, n) * ifac[n] % M * binom(n, i) % M;
			if (i % 2 == 1) res = (res + M - t) % M;
			else res = (res + t) % M;
		}
		return res;
	};

	k--;
	int p = (f(n, k + 1) + M - f(n, k)) % M;
	std::cout << (long long)p * fac[n] % M << std::endl;
}
```

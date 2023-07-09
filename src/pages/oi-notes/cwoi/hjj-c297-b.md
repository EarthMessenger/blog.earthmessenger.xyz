---
layout: ../../../layouts/PostLayout.astro
title: 号家军 C297 B 序列
tags: hjj dp combinatorics
---

## 题意

使用 `openssl enc -aes256 -pbkdf2 -a` 加密。

```
U2FsdGVkX18FbmNqmPI0wJSCMHB2X55+MQ5MnLnu9qdlAW3d0V1XrOhjYhf/qp2v
LpISl0yOCk+cBZk36RIhwEje3lxaCmCeDH9bB2SfxAWnVEhKt26qTKSCAkXcqRn8
IN9uqV7/MiadEORk0ngFAxRzrzkIYD5xJxBn/Js8KlMvnFUU5KwDHPpMwanYU90z
i83n9tXMeRJjWm5zP0wHwPGJZQfBQyl8n0VNNGMOFMSNVo6AsJFM0vWb5GFLjo0b
xvatOEagKcVK2Ajc8OiO7kLKyDkSTm1pEAxSrpXezcrKrwuLRB7tE2PCuWXf1MI0
q7SiV2dOWaGNgOV99immaTJF+KrngVs1ny0A1dLbm+AHhh9wFwuPL993K+5kP/6W
```

## 解析

约定，如果 $m > n$，则 $\binom{n}{m} = 0$。令 $N = \sum a$。

考虑容斥。定义 $f(i)$ 表示划分为严格递增子段的段数为 $i$ 的方案数，注意没有**最
少**。由于每一段中每个数最多出现一次，可以得到：

$$
f(i) = \prod\limits_{0 \le j < n} \binom{i}{a_j}
$$

但是这样会有许多重复，具体来说，如果某个序列 $b$ 可以被划分成 $j$ 段（$j < i$），
你只需要在序列 $b$ 中的 $N+1$ 个空中再随便插入 $j-i$ 个段分隔，就可以变成 $i$
段。可以插板法计算出插入的方式为 $\binom{N + i - j}{i - j}$。

由此，令 $g(i)$ 表示最少划分为严格递增子段段数为 $i$ 的方案数，可以得到：

$$
g(i) = f(i) - \sum_{0 \le j < i} g(j) \binom{N + i - j}{i - j}
$$

## 实现

```cpp
using mint = static_modint<1'000'000'007>;

int main()
{
	int n, k;
	std::cin >> n >> k;
	std::vector<int> a(n);
	for (auto &i : a) std::cin >> i;

	int sa = std::accumulate(a.begin(), a.end(), 0);
	int maxfac = sa * 2;
	std::vector<mint> fac(maxfac + 1), ifac(maxfac + 1);
	fac[0] = 1;
	for (int i = 1; i <= maxfac; i++) fac[i] = fac[i - 1] * i;
	ifac[maxfac] = fac[maxfac].inv();
	for (int i = maxfac; i >= 0; i--) ifac[i - 1] = ifac[i] * i;
	auto binom = [fac, ifac](int n, int m) -> mint
	{
		if (m < 0 || m > n) return 0;
		return fac[n] * ifac[m] * ifac[n - m];
	};

	std::vector<mint> f(k + 1);
	for (int i = 1; i <= k; i++) {
		mint res = 1;
		for (auto j : a) res *= binom(i, j);
		for (int j = 1; j < i; j++) res -= f[j] * binom(sa + i - j, i - j);
		f[i] = res;
	}
	std::cout << f[k].val() << std::endl;
}
```

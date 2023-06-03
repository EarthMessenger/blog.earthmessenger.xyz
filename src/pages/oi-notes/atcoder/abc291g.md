---
layout: ../../../layouts/PostLayout.astro
title: AtCoder ABC 291 G OR Sum
tags: at convolution
---

给定一个长度为 $N$ 的数组 $A$ 和 $B$，你可以选定一个整数 $k$，令 
$C_i = A_{(i + k) \bmod n}$。求 
$\sum_{i=0}^{n-1}(B_i \operatorname{or} C_i)$ 最大值。

$0 \le A_i, B_i < 32$

由于值域不大，每个数位可以单独计算贡献。对于一位的或运算，可以转换成乘法，
即 $a \operatorname{or} b = 1 - a\times b (a, b \in \{0, 1\})$。那么对于某一位，
答案就是求 $n - \sum_{i=0}^{n-1}(B_i \times C_i)$ 最大值，即后面那个 sigma 
的最小值。后面那个 sigma 的形式和卷积很像，考虑用卷积优化计算。

多项式卷积是这样的：

> 给定一个长度为 $n$ 的数组 $A$，和一个长度为 $m$ 的数组 $B$。求一个长度为 $n +
> m - 1$ 的数组 $C$ 使得：
> $$C_i = \sum_{j=0}^{i}A_j B_{i - j}$$

这个形式和我们要求的十分相似，我们把 $A$ 数组翻转，再断环成链，再与 $B$ 卷积，
即可求得对于每一个 $k$ 的答案。

而多项式卷积可以做到 $O(n\log n)$，一般使用 FFT，NTT 之类的算法。

```cpp
#include <algorithm>
#include <iostream>
#include <vector>

#include <atcoder/convolution>

int main()
{
	int n;
	std::cin >> n;
	std::vector<int> a(n), b(n);
	for (auto &i : a) std::cin >> i;
	for (auto &i : b) std::cin >> i;
	std::vector<int> ans(n);
	for (int k = 0; k < 5; k++) {
		std::vector<int> bina(n), binb(n);
		for (int i = 0; i < n; i++) {
			bina[i] = ((a[i] ^ 31) >> k) & 1;
			binb[i] = ((b[i] ^ 31) >> k) & 1;
		}
		std::reverse(bina.begin(), bina.end());
		bina.insert(bina.end(), bina.begin(), bina.end());
		auto con = atcoder::convolution(bina, binb);
		for (int i = 0; i < n; i++) {
			ans[i] += (con[i + n] << k);
		}
	}
	std::cout << 31 * n - *std::min_element(ans.begin(), ans.end()) << std::endl;
}
```

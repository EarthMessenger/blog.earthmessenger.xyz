---
lang: zh-hant
opencc: true
tags: at convolution
title: AtCoder ABC 291 G OR Sum
---

給定一個長度為 $N$ 的陣列 $A$ 和 $B$，你可以選定一個整數 $k$，令 
$C_i = A_{(i + k) \bmod n}$。求 
$\sum_{i=0}^{n-1}(B_i \operatorname{or} C_i)$ 最大值。

$0 \le A_i, B_i < 32$

由於值域不大，每個數位可以單獨計算貢獻。對於一位的或運算，可以轉換成乘法，
即 $a \operatorname{or} b = 1 - a\times b (a, b \in \{0, 1\})$。那麼對於某一位，
答案就是求 $n - \sum_{i=0}^{n-1}(B_i \times C_i)$ 最大值，即後面那個 sigma 
的最小值。後面那個 sigma 的形式和卷積很像，考慮用卷積最佳化計算。

多項式卷積是這樣的：

> 給定一個長度為 $n$ 的陣列 $A$，和一個長度為 $m$ 的陣列 $B$。求一個長度為 $n +
> m - 1$ 的陣列 $C$ 使得：
> $$
> C_i = \sum_{j=0}^{i}A_j B_{i - j}
> $$

這個形式和我們要求的十分相似，我們把 $A$ 陣列翻轉，再斷環成鏈，再與 $B$ 卷積，
即可求得對於每一個 $k$ 的答案。

而多項式卷積可以做到 $O(n\log n)$，一般使用 FFT，NTT 之類的演算法。

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

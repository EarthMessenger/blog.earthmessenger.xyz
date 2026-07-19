---
lang: zh-hant
opencc: true
tags: at string dp
title: AtCoder ABC 299 F Square Subsequence
---

## 題意

給定一個字串 $S$ （$|S| \leq 100$），求有多少個字串 $T$ 使得 $TT$ 為 $S$ 的
子序列。

## 解析

這題的難點主要在於防止算重。我們定義 $p$ 表示前一個 $T$ 中的字元在原串中出現的
位置，$q$ 表示後一個 $T$ 中的字元在原串中出現的位置，令 $t(i, ch)$ 表示從 $i$
往後第一個 $ch$ 出現的位置（包括 $i$）。

為了避免算重，我們強制要求 $p$ 和 $q$ 儘量小。舉個例子，如果原串是 `acbcab`，
$T$ 是 `ab`，那麼 $p$ 和 $q$ 便如下計算：

- $p_0 = t(0, a) = 0$
- $p_1 = t(p_0 + 1, b) = 2$
- $q_0 = t(p_1 + 1, a) = 4$
- $q_1 = t(q_0 + 1, b) = 5$

可以發現，這樣算出來的 $p$ 和 $q$ 一定是最小的，並且對於每一個 $T$，最多隻有一
個 $p$ 和 $q$。

我們列舉一個 $q_0$，則 $p_0 = t(0, s_{q_0})$。令 $f(i, j)$ 表示 $p$ 的末尾元素
為 $i$，$q$ 的末尾元素為 $j$ 時的方案數，顯然 $f(p_0, q_0) = 1$。轉移方程：$f(i,
j) = \sum\limits_{i', t(i' + 1, s_i) = i} \sum\limits_{j', t(j' + 1, s_j) = j}
f(i', j')$。當然，人人為我的轉移寫起來很困難，可以考慮我為人人的轉移，列舉一個
字元 $ch$，$f(i, j)$ 會對 $f(t(i + 1, ch), t(j + 1, ch))$ 貢獻。最後統計 $q_0$
的答案就 $\sum\limits_{i, t(i + 1, s_{q_0}) = q_0}\sum\limits_{j} f(i, j)$。

時間複雜度 $O(n^3)$。

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string>
#include <vector>

#include <atcoder/modint>

using mint = atcoder::modint998244353;

int main()
{
	std::string s;
	std::cin >> s;

	int n = s.size();

	std::vector<std::array<int, 26>> next(n + 1);
	std::fill(next[n].begin(), next[n].end(), n);
	for (int i = n; i > 0; ){
		i--;
		next[i] = next[i + 1];
		next[i][s[i] - 'a'] = i;
	}

	mint ans = 0;
	for (int q = 0; q < n; q++) {
		int p = next[0][s[q] - 'a'];
		if (p >= q) continue;

		std::vector f(n, std::vector<mint>(n));
		f[p][q] = 1;
		for (int i = 0; i < n; i++) {
			for (int j = 0; j < n; j++) {
				for (int ch = 0; ch < 26; ch++) {
					int ni = next[i + 1][ch];
					int nj = next[j + 1][ch];
					if (ni >= q || nj >= n) continue;
					f[ni][nj] += f[i][j];
				}
			}
		}

		for (int i = 0; i < n; i++) {
			for (int j = 0; j < n; j++) {
				if (next[i + 1][s[q] - 'a'] != q) continue;
				ans += f[i][j];
			}
		}
	}

	std::cout << ans.val() << std::endl;
}

```

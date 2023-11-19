---
title: AtCoder ABC 299 F Square Subsequence
tags: at string dp
---

## 题意

给定一个字符串 $S$ （$|S| \leq 100$），求有多少个字符串 $T$ 使得 $TT$ 为 $S$ 的
子序列。

## 解析

这题的难点主要在于防止算重。我们定义 $p$ 表示前一个 $T$ 中的字符在原串中出现的
位置，$q$ 表示后一个 $T$ 中的字符在原串中出现的位置，令 $t(i, ch)$ 表示从 $i$
往后第一个 $ch$ 出现的位置（包括 $i$）。

为了避免算重，我们强制要求 $p$ 和 $q$ 尽量小。举个例子，如果原串是 `acbcab`，
$T$ 是 `ab`，那么 $p$ 和 $q$ 便如下计算：

- $p_0 = t(0, a) = 0$
- $p_1 = t(p_0 + 1, b) = 2$
- $q_0 = t(p_1 + 1, a) = 4$
- $q_1 = t(q_0 + 1, b) = 5$

可以发现，这样算出来的 $p$ 和 $q$ 一定是最小的，并且对于每一个 $T$，最多只有一
个 $p$ 和 $q$。

我们枚举一个 $q_0$，则 $p_0 = t(0, s_{q_0})$。令 $f(i, j)$ 表示 $p$ 的末尾元素
为 $i$，$q$ 的末尾元素为 $j$ 时的方案数，显然 $f(p_0, q_0) = 1$。转移方程：$f(i,
j) = \sum\limits_{i', t(i' + 1, s_i) = i} \sum\limits_{j', t(j' + 1, s_j) = j}
f(i', j')$。当然，人人为我的转移写起来很困难，可以考虑我为人人的转移，枚举一个
字符 $ch$，$f(i, j)$ 会对 $f(t(i + 1, ch), t(j + 1, ch))$ 贡献。最后统计 $q_0$
的答案就 $\sum\limits_{i, t(i + 1, s_{q_0}) = q_0}\sum\limits_{j} f(i, j)$。

时间复杂度 $O(n^3)$。

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

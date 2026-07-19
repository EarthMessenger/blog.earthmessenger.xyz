---
lang: zh-hant
opencc: true
tags: at interactive binary-search
title: AtCoder ABC 299 Find by Query
---

## 題意

互動題：給定一個 01 序列 $S$（$|S| \leq 2\times 10^5$），保證 $S_0 = 0$ 且
$S_{n - 1} = 1$。你可以詢問至多 20 次某個位置的值，求任意一個 $p$ 使得 $S_p
\neq S_{p + 1}$。

## 解析

考慮二分，如果 $S_{mid} = 1$，則說明 $0$ 到 $mid$ 中間存在可行的 $p$，如果
$S_{mid} = 0$ 則說明 $mid$ 到 $n-1$ 存在可行 $p$。

```cpp
int main()
{
	int n;
	std::cin >> n;
	
	int l = 1, r = n;
	
	std::map<int, int> cache;
	auto ask = [&cache](int pos) mutable -> int
	{
		if (cache.count(pos) != 0) {
			return cache[pos];
		} else {
			std::cout << "? " << pos << std::endl << std::flush;
			int res;
			std::cin >> res;
			cache[pos] = res;
			return res;
		}
	};
	
	while (l < r) {
		int mid = (l + r) / 2;
		int s1 = ask(mid);
		if (s1 == 1) {
			r = mid;
		} else {
			l = mid + 1;
		}
	}
	std::cout << "! " << r - 1 << std::endl << std::flush;
}
```

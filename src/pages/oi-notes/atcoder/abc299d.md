---
layout: ../../../layouts/PostLayout.astro
title: AtCoder ABC 299 Find by Query
tags: at interactive binary-search
---

## 题意

交互题：给定一个 01 序列 $S$（$|S| \leq 2\times 10^5$），保证 $S_0 = 0$ 且
$S_{n - 1} = 1$。你可以询问至多 20 次某个位置的值，求任意一个 $p$ 使得 $S_p
\neq S_{p + 1}$。

## 解析

考虑二分，如果 $S_{mid} = 1$，则说明 $0$ 到 $mid$ 中间存在可行的 $p$，如果
$S_{mid} = 0$ 则说明 $mid$ 到 $n-1$ 存在可行 $p$。

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

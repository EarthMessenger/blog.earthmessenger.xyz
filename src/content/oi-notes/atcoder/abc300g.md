---
title: AtCoder ABC 300 G P-smooth number
tags: at brute-force dfs meet-in-the-middle
---

## 题意

给定 $n$（$1 \le n \le 10^{16}$）和 $P$（$2 \le P \le 100$），求有多少小于 $n$ 的正整数的最大质因子不超过 $P$。

## 解析

答案是 $10^9$ 级别的，直接算会爆炸，考虑优化暴力。

### 法 1

考虑使用 meet-in-the-middle 的思想。

具体来说，维护两个数组 $A$，$B$，初始都只有 $1$。为了防止算重，我们考虑将为了将质数分配成两部分，分配给 $A$ 和 $B$，将 $A$ 中一个元素乘上 $B$ 中一个元素组成答案。

具体如何分配呢？可以遍历质数，如果 $A$ 当前的大小小于 $B$ 的大小，则分配给 $A$，否则分配给 $B$。如代码：

```cpp
std::vector<long long> a({1}), b({1});

for (size_t i = 0; primes[i] <= p && i < primes.size(); i++) {
	int pi = primes[i];
	if (a.size() > b.size()) std::swap(a, b);
	auto as = a.size();
	for (size_t j = 0; j < as; j++) {
		long long tmp = a[j] * pi;
		while (tmp <= n) {
			a.emplace_back(tmp);
			tmp *= pi;
		}
	}
}

std::sort(a.begin(), a.end());
std::sort(b.begin(), b.end());
```

对于极限数据，$A$、$B$ 两个数组的大小一个是 $4,141,074$，一个是 $2,903,751$。双指针统计一下答案即可。

```cpp
long long ans = 0;

for (size_t i = 0, j = b.size(); i < a.size(); i++) {
	while (j > 0 && a[i] * b[j - 1] > n) j--;
	ans += j;
}
```

### 法 2

定义 $f(x, p)$ 表示小于等于 $x$ 的 $p$-smooth number 的个数。小于等于 $x$ 这个条件不好处理，可以改成有多少个 $p$-smooth number $y$ 可以使得 $\left\lfloor\frac{x}{y}\right\rfloor \ge 1$。

由于 $\left\lfloor\frac{a}{bc}\right\rfloor=\left\lfloor\frac{\left\lfloor\frac{a}{b}\right\rfloor}{c}\right\rfloor$。所以可以得到转移方程 $f(x, p) = f(x, \operatorname{prevprime}(p)) + f\left(\left\lfloor\frac{x}{p}\right\rfloor, p\right)$，其中 $\operatorname{prevprime}(p)$ 表示小于 $p$ 的最大质数。容易写出 dfs 代码：

```cpp
constexpr std::array primes = {2,  3,  5,  7,  11, 13, 17, 19, 23,
			   29, 31, 37, 41, 43, 47, 53, 59, 61,
			   67, 71, 73, 79, 83, 89, 97};
 
long long dfs(long long x, int pi)
{
	if (pi == 0) return std::__lg(x) + 1;
	long long res = 0;
	res += dfs(x, pi - 1);
	if (x >= primes[p]) res += dfs(x / primes[p], p);
	return res;
}
```

然而这样是过不了的，极限数据下在我的电脑上跑了 28s。可以考虑使用记忆化，当然 $x$ 的范围很大，你没法全部记忆化，可以记忆到 $2^{16}$ 左右。

```cpp
constexpr std::array primes = {2,  3,  5,  7,  11, 13, 17, 19, 23,
			       29, 31, 37, 41, 43, 47, 53, 59, 61,
			       67, 71, 73, 79, 83, 89, 97};

struct dfs
{
	static constexpr int MAX_MEM = 0;

	std::vector<std::vector<std::optional<long long>>> mem;
	dfs(long long n, int p)
	    : mem(std::min((long long)MAX_MEM, n),
		  std::vector<std::optional<long long>>(p))
	{
	}

	long long operator()(long long x, int p)
	{
		if (p == 0) return std::__lg(x) + 1;
		if (x < (int)mem.size() && mem[x][p]) return mem[x][p].value();
		long long res = 0;
		res += operator()(x, p - 1);
		if (x >= primes[p]) res += operator()(x / primes[p], p);
		if (x < (int)mem.size()) mem[x][p] = res;
		return res;
	}
};
```

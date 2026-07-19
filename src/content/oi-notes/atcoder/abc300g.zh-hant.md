---
lang: zh-hant
opencc: true
tags: at brute-force dfs meet-in-the-middle
title: AtCoder ABC 300 G P-smooth number
---

## 題意

給定 $n$（$1 \le n \le 10^{16}$）和 $P$（$2 \le P \le 100$），求有多少小於 $n$ 的正整數的最大質因子不超過 $P$。

## 解析

答案是 $10^9$ 級別的，直接算會爆炸，考慮最佳化暴力。

### 法 1

考慮使用 meet-in-the-middle 的思想。

具體來說，維護兩個陣列 $A$，$B$，初始都只有 $1$。為了防止算重，我們考慮將為了將質數分配成兩部分，分配給 $A$ 和 $B$，將 $A$ 中一個元素乘上 $B$ 中一個元素組成答案。

具體如何分配呢？可以遍歷質數，如果 $A$ 當前的大小小於 $B$ 的大小，則分配給 $A$，否則分配給 $B$。如程式碼：

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

對於極限資料，$A$、$B$ 兩個陣列的大小一個是 $4,141,074$，一個是 $2,903,751$。雙指標統計一下答案即可。

```cpp
long long ans = 0;

for (size_t i = 0, j = b.size(); i < a.size(); i++) {
	while (j > 0 && a[i] * b[j - 1] > n) j--;
	ans += j;
}
```

### 法 2

定義 $f(x, p)$ 表示小於等於 $x$ 的 $p$-smooth number 的個數。小於等於 $x$ 這個條件不好處理，可以改成有多少個 $p$-smooth number $y$ 可以使得 $\left\lfloor\frac{x}{y}\right\rfloor \ge 1$。

由於 $\left\lfloor\frac{a}{bc}\right\rfloor=\left\lfloor\frac{\left\lfloor\frac{a}{b}\right\rfloor}{c}\right\rfloor$。所以可以得到轉移方程 $f(x, p) = f(x, \operatorname{prevprime}(p)) + f\left(\left\lfloor\frac{x}{p}\right\rfloor, p\right)$，其中 $\operatorname{prevprime}(p)$ 表示小於 $p$ 的最大質數。容易寫出 dfs 程式碼：

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

然而這樣是過不了的，極限資料下在我的電腦上跑了 28s。可以考慮使用記憶化，當然 $x$ 的範圍很大，你沒法全部記憶化，可以記憶到 $2^{16}$ 左右。

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

---
layout: ../../layouts/PostLayout.astro
title: 一种很新的二分答案写法
tags: oi trick
pubDate: 2023-03-17
---

## 原理

众所周知，C++ 中的 algorithm 中有 `std::upper_bound` 和 `std::lower_bound` 函数
用于二分查找。

- [std::lower\_bound - cppreference.com](https://en.cppreference.com/w/cpp/algorithm/lower_bound)
- [std::upper\_bound - cppreference.com](https://en.cppreference.com/w/cpp/algorithm/upper_bound)

简单来说，这两个函数前两个参数是两个迭代器以指定二分的范围，第三个参数是需要二
分的值，第四个参数是比较函数。

然而这种二分通常来说无法二分答案，因为当答案范围很大的时候，你无法生成值域大小
的数组。然而我们可以把 `int` 封装成一个迭代器，把它传到 stl 中。这个迭代器不需
要实际地指向某个元素，因此不会占用内存。

代码如下：

```cpp
struct int_iterator
{
public:
	using value_type = const long long;
	using difference_type = long long;	
	using pointer = const long long *;
	using reference = const long long;
	using iterator_category = std::random_access_iterator_tag;
	
	int_iterator() : _val(0) {}
	int_iterator(long long x) : _val(x) {}
	
	value_type operator*() const { return _val; }
	
	int_iterator &operator+=(difference_type n)
	{
		_val += n;
		return *this;
	}
	
	int_iterator &operator++() { return *this += 1; }
	
	int_iterator &operator--() { return *this += -1; }
	
	difference_type operator-(const int_iterator &iit) const
	{
		return _val - iit._val;
	}

private:
	long long _val;
};
```

首先，前几行 using 是迭代器的必需定义，只有定义了这些量，标准库才能用 
`std::iterator_traits` 访问迭代器的各个属性。`iterator_category` 被定义成
了 `std::random_access_iterator_tag`，即
[老式随机访问迭代器](https://en.cppreference.com/w/cpp/named_req/RandomAccessIterator)。
这样调用 STL 时，STL 会用 `+=` 来实现 `std::advance`，而不是一个一个地自增，也
会用 `-` 来求两个迭代器的距离，保证复杂度正确（这也是为什么不要在 map、set 上直
接用 STL 二分而用自带二分的原因）。

RandomAccessIterator 要求定义的运算符很多，然而我们可以根据 `std::upper_bound` 
和 `std::lower_bound` 调用的运算符按需定义。

## 例子

P1873：给定一个长度为 $N$ 的数组 $a$，和一个正整数 $M$，求最大的 $x$ 使得 
$\sum \max\left(a_i-x, 0\right) \ge M$。

```cpp
int main()
{
	int n;
	long long m;
	scanf("%d%lld", &n, &m);
	std::vector<int> a(n);
	for (auto &i : a) scanf("%d", &i);

	auto cmp = [&a](const int &mid, const long long &m)
	{
		long long sum = 0;
		for (auto i : a) sum += std::max(0, i - mid);
		return sum >= m;
	};

	int ans = std::lower_bound(int_iterator(0), 
				   int_iterator(*std::max_element(a.begin(), a.end())), 
				   m, 
				   cmp) - int_iterator(0) - 1;

	printf("%d\n", ans);
}
```

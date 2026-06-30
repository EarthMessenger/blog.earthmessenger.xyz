---
lang: zh-hant
opencc: true
pubDate: 2023-03-17
tags: oi trick
title: 一種很新的二分答案寫法
---

## 原理

眾所周知，C++ 中的 algorithm 中有 `std::upper_bound` 和 `std::lower_bound` 函式
用於二分查詢。

- [std::lower\_bound - cppreference.com](https://en.cppreference.com/w/cpp/algorithm/lower_bound)
- [std::upper\_bound - cppreference.com](https://en.cppreference.com/w/cpp/algorithm/upper_bound)

簡單來說，這兩個函式前兩個引數是兩個迭代器以指定二分的範圍，第三個引數是需要二
分的值，第四個引數是比較函式。

然而這種二分通常來說無法二分答案，因為當答案範圍很大的時候，你無法生成值域大小
的陣列。然而我們可以把 `int` 封裝成一個迭代器，把它傳到 stl 中。這個迭代器不需
要實際地指向某個元素，因此不會佔用記憶體。

程式碼如下：

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

首先，前幾行 using 是迭代器的必需定義，只有定義了這些量，標準庫才能用 
`std::iterator_traits` 訪問迭代器的各個屬性。`iterator_category` 被定義成
了 `std::random_access_iterator_tag`，即
[老式隨機訪問迭代器](https://en.cppreference.com/w/cpp/named_req/RandomAccessIterator)。
這樣呼叫 STL 時，STL 會用 `+=` 來實現 `std::advance`，而不是一個一個地自增，也
會用 `-` 來求兩個迭代器的距離，保證複雜度正確（這也是為什麼不要在 map、set 上直
接用 STL 二分而用自帶二分的原因）。

RandomAccessIterator 要求定義的運算子很多，然而我們可以根據 `std::upper_bound` 
和 `std::lower_bound` 呼叫的運算子按需定義。

## 例子

P1873：給定一個長度為 $N$ 的陣列 $a$，和一個正整數 $M$，求最大的 $x$ 使得 
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

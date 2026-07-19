---
lang: zh-hant
opencc: true
tags: hjj dp data-structure
title: 號家軍 C297 D 聚會
---

## 題意

使用 `openssl enc -aes256 -pbkdf2 -a` 加密。

```
U2FsdGVkX1+lnrvP9RpZAvFXZ+NHgsLYp2UqiE3W/89lyPn7wGdfjeg1KpIsc7xA
NE3HchVIq7WHhdgqzAKassS7P5A58ADuRoJUOKHsvk5+RNvlaEE8cYhA+cNyQJ/g
xC2i6XaQRiOFWPiZ12kNc8aXHWWz2f9wOUdIDcQxMexes1o0mQl66o1Y+3poOSVv
lNZ2qvY67HCZ05hXdNV6Q/ufAwtu/fSUaWLoVD21LWY9m5f7FuUKoGjMKPQEtRvj
mz/NG4oD22Wuh7ir0gabjdRKhy/GhUNd0TLxLKa5UxpOvyiVX1IYF9YKHSmTySd3
bQduEsj3WP23j9SokPwSxoFTPYr73Skb7vW6uCNLw1XGg+VAKH9DE1C0ycf3JkYc
UEjNwSeACcDvFlnZ0I6lWxvXBPwp3G5Y0ujzC2N/SlWNh8hP1g+aH1hilB2Nl3+B
k9DGrIFzkQcj8GceFThmXgklHeSJRf+k6u2qdN20FLT12HLimFftzLN16XdkU7h7
eM9+Lbxn1YfScY/UKTpd1nOoJH5BntVw5fkx0N+TAN6IE2Usg7mD9BbgrX4qKn3L
Ccs7CGosUvFfOph57xky0w==
```

## 解析

首先，如果所有區間的並不是一個整體的話，就無法完成，特判一下這種情況。

由於一次轉發只能轉發一份訊息，所以對於每個區間分別擁有的訊息，都是獨立的問題。
而且對於某個訊息，我們只需要傳遞到最左邊和最右邊的區間，所有的區間就一定收到了
這個訊息。容易得到一個比較貪心的做法，定義 $f(i)$ 表示將 $i$ 區間的訊息傳遞到左
邊的最小轉發次數，同理 $g(i)$ 表示將 $i$ 區間的訊息傳遞到最右邊的最小轉發次數，
以求解 $f(i)$ 為例，按照區間右端點從小往大排序，然後線段樹最佳化 dp 即可。

但是隻考慮往單個方向轉發是不夠的，有可能出現這種情況：

```
       +--+         A
    +--+  +--+      B C
     +------+       D
  +--+      +--+    E F
```

對於區間 A，$f(A) = 1$，$g(A) = 1$，但是最終答案並不是 $f(A) + g(A)$ 因為可以通
過 D 一次轉發傳遞到 E 和 F。因此，我們再用線段樹維護一下對於每個位置 $x$ ，所有
包含 $x$ 的區間 $i$ 的 $f(i) + g(i)$ 的最小值，如果某個區間 $j$ 的 $f(j) + g(j)
$ 大於了線段樹上 $j$ 對應區間的最小值加一，則可以通過上面類似的方法減少轉發次數。

## 實現

```cpp
bool check_connected(std::vector<std::pair<int, int>> a)
{
	std::sort(a.begin(), a.end());
	int r = a[0].second;
	for (int i = 1; i < (int)a.size(); i++) {
		if (r < a[i].first) return false;
		r = std::max(r, a[i].second);
	}
	return true;
}

struct min_segtree
{
	int n;
	std::vector<int> t;
	std::vector<int> lazy;
	static const int NOLAZY;

	min_segtree(int n) : 
		n(n),
		t(n * 4, std::numeric_limits<int>::max() / 3),
		lazy(n * 4, NOLAZY) 
	{
	}

	void put_tag(int v, int p)
	{
		t[p] = std::min(t[p], v);
		lazy[p] = std::min(lazy[p], v);
	}

	void spread_tag(int p)
	{
		if (lazy[p] != NOLAZY) {
			put_tag(lazy[p], p * 2 + 1);
			put_tag(lazy[p], p * 2 + 2);
			lazy[p] = NOLAZY;
		}
	}

	std::tuple<int, int, int> get_info(int ll, int rr, int p)
	{
		return {ll + (rr - ll) / 2, p * 2 + 1, p * 2 + 2};
	}

	void update(int l, int r, int v, int ll, int rr, int p)
	{
		if (l <= ll && rr <= r) {
			put_tag(v, p);
		} else {
			spread_tag(p);
			auto [mid, lc, rc] = get_info(ll, rr, p);
			if (l < mid) update(l, r, v, ll, mid, lc);
			if (mid < r) update(l, r, v, mid, rr, rc);
			t[p] = std::min(t[lc], t[rc]);
		}
	}

	void update(int l, int r, int v)
	{
		return update(l, r, v, 0, n, 0);
	}

	int min(int l, int r, int ll, int rr, int p)
	{
		if (l <= ll && rr <= r) {
			return t[p];
		} else {
			spread_tag(p);
			auto [mid, lc, rc] = get_info(ll, rr, p);
			int res = std::numeric_limits<int>::max();
			if (l < mid) res = std::min(res, min(l, r, ll, mid, lc));
			if (mid < r) res = std::min(res, min(l, r, mid, rr, rc));
			return res;
		}
	}

	int min(int l, int r)
	{
		return min(l, r, 0, n, 0);
	}
};

const int min_segtree::NOLAZY = std::numeric_limits<int>::max();

std::vector<int> gen_perm(int n)
{
	std::vector<int> p(n);
	for (int i = 0; i < n; i++) p[i] = i;
	return p;
}

int main()
{
	int n;
	std::cin >> n;
	std::vector<std::pair<int, int>> a(n);
	std::vector<int> cc;
	for (auto &[l, r] : a) {
		std::cin >> l >> r;
		cc.emplace_back(l);
		cc.emplace_back(r);
	}

	if (!check_connected(a)) {
		std::cout << "-1" << std::endl;
		return 0;
	}

	std::sort(cc.begin(), cc.end());
	cc.erase(std::unique(cc.begin(), cc.end()), cc.end());
	
	auto val = [&cc](int x)
	{
		return std::lower_bound(cc.begin(), cc.end(), x) - cc.begin();
	};
	for (auto &[l, r] : a) {
		l = val(l);
		r = val(r);
	}

	std::vector<int> f(n), g(n);

	{
		auto p = gen_perm(n);
		min_segtree t(cc.size() + 1);
		std::sort(p.begin(), p.end(), 
			  [&a](int x, int y)
			  {
				  return a[x].second < a[y].second;
			  });
		f[p[0]] = 0;
		t.update(a[p[0]].first, a[p[0]].second + 1, -1);
		for (int i = 0; i < n; i++) {
			int j = p[i];
			auto m = t.min(a[j].first, a[j].second + 1);
			f[j] = m + 1;
			t.update(a[j].first, a[j].second + 1, f[j]);
		}
	}

	{
		auto p = gen_perm(n);
		min_segtree t(cc.size() + 1);
		std::sort(p.begin(), p.end(), 
			  [&a](int x, int y)
			  {
				  return a[x].first > a[y].first;
			  });
		g[p[0]] = 0;
		t.update(a[p[0]].first, a[p[0]].second + 1, -1);
		for (int i = 0; i < n; i++) {
			int j = p[i];
			auto m = t.min(a[j].first, a[j].second + 1);
			g[j] = m + 1;
			t.update(a[j].first, a[j].second + 1, g[j]);
		}
	}

	long long ans = 0;
	{
		min_segtree t(cc.size() + 1);
		for (int i = 0; i < n; i++) {
			t.update(a[i].first, a[i].second + 1, std::max(0, f[i]) + std::max(0, g[i]) + 1);
		}
		for (int i = 0; i < n; i++) {
			ans += std::min(std::max(0, f[i]) + std::max(0, g[i]), t.min(a[i].first, a[i].second + 1));
		}
	}
	std::cout << ans << std::endl;
}
```

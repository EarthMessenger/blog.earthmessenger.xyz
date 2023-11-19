---
title: 号家军 C297 D 聚会
tags: hjj dp data-structure 
---

## 题意

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

首先，如果所有区间的并不是一个整体的话，就无法完成，特判一下这种情况。

由于一次转发只能转发一份消息，所以对于每个区间分别拥有的消息，都是独立的问题。
而且对于某个消息，我们只需要传递到最左边和最右边的区间，所有的区间就一定收到了
这个消息。容易得到一个比较贪心的做法，定义 $f(i)$ 表示将 $i$ 区间的消息传递到左
边的最小转发次数，同理 $g(i)$ 表示将 $i$ 区间的消息传递到最右边的最小转发次数，
以求解 $f(i)$ 为例，按照区间右端点从小往大排序，然后线段树优化 dp 即可。

但是只考虑往单个方向转发是不够的，有可能出现这种情况：

```
       +--+         A
    +--+  +--+      B C
     +------+       D
  +--+      +--+    E F
```

对于区间 A，$f(A) = 1$，$g(A) = 1$，但是最终答案并不是 $f(A) + g(A)$ 因为可以通
过 D 一次转发传递到 E 和 F。因此，我们再用线段树维护一下对于每个位置 $x$ ，所有
包含 $x$ 的区间 $i$ 的 $f(i) + g(i)$ 的最小值，如果某个区间 $j$ 的 $f(j) + g(j)
$ 大于了线段树上 $j$ 对应区间的最小值加一，则可以通过上面类似的方法减少转发次数。

## 实现

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

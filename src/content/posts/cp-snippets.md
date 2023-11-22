---
title: 算法竞赛的板子
pubDate: 2023-07-28
tags: oi continually-updated
---

这篇文章主要存一些板子，应该会继续更新。

## 数据生成器

### 有 N 个节点的树

```python
edges = [(random.randrange(i), i) for i in range(1, N)]
```

### 有 N 个节点的二叉树

```python
edges = []
def build(l, r):
    p = random.randrange(l, r)
    if p - l > 0:
        edges.append((p, build(l, p)))
    if r - p - 1 > 0:
        edges.append((p, build(p + 1, r)))
    return p
build(0, N)
```

`build` 函数会返回一个数，表示二叉树的根节点，如果希望以 0 为根的话，可以输出边
的时候把 0 和根对调一下。

### 长度为 N，和为 M 的正整数序列

```python
def generate_sequence(N, M):
    sequence = sorted(random.sample(range(1, M), N-1))
    sequence = [0] + sequence + [M]
    return [sequence[i+1] - sequence[i] for i in range(N)]
```

### 有 N 个节点，M 条边的简单无向图

```python
edges = set()
cnt = 0
while cnt < M:
    u, v = sorted(random.sample(range(N), 2))
    if (u, v) in edges:
        continue
    edges.add((u, v))
    cnt += 1
```

## 对拍脚本

```sh
while true
do
    seed=$RANDOM
    echo $seed
    python -m gen_data $seed > a.in
    cat a.in | ./bf > a.ans
    cat a.in | ./a > a.out
    if ! diff -Z ans.ans ans.out
    then
        echo WA
        break
    fi
done
```

其中 `bf` 是暴力程序，`a` 是需要对拍的程序，`gen_data` 是用 Python 写的数据生成
器，`diff` 的 `-Z` 选项用于忽略行末空格。

`$RANDOM` 的值域一般是 $[0, 32768)$，如果觉得太小可以考虑将多个 `$RANDOM` 拼到
一起，类似这样：

```sh
print "%04x" $RANDOM $RANDOM $RANDOM $RANDOM
```

## judgesh

```sh
#!/usr/bin/bash

program=$1
tmp=$(mktemp)

clean() {
  rm -f "${tmp}"
}

trap clean EXIT

while read -r t
do
  echo -ne "${t}\t"
  if ! { "./${program}"; } < "${t}.in" > "${tmp}" 2> /dev/null
  then
    echo "RE"
  elif ! diff -ZB "${t}.ans" "${tmp}" > /dev/null 2> /dev/null
  then
    echo "WA"
  else
    echo "AC"
  fi
done < <(find . -name "${program}*.in" | sed "s/.in$//" | sort)
```

自动寻找目录下所有与可执行文件同名的 `.in` 文件进行评测，注意 TLE 会导致卡死。

完整版：[judgesh](https://github.com/EarthMessenger/judgesh)

## 数据结构

### 并查集

```cpp
struct dsu
{
	int n;
	std::vector<int> fa;
	std::vector<int> size;

	dsu(int n) : n(n), fa(n), size(n, 1)
	{
		for (int i = 0; i < n; i++) fa[i] = i;
	}

	int find(int x)
	{
		if (x == fa[x]) return x;
		return fa[x] = find(fa[x]);
	}

	int merge(int x, int y)
	{
		int fx = find(x), fy = find(y);
		if (fx == fy) return fx;
		if (size[fx] < size[fy]) std::swap(fx, fy);
		fa[fy] = fx;
		size[fx] += size[fy];
		return fx;
	}

	bool same(int x, int y)
	{
		return find(x) == find(y);
	}

	bool is_root(int x) const
	{
		return fa[x] == x;
	}
};
```

### Treap

这是 join-based 实现。

```cpp
struct Treap
{
	static std::mt19937 mt;

	struct node_t
	{
		using pnode_t = node_t*;

		const int key;
		const unsigned int prior;

		int cnt;
		int size;

		pnode_t lc, rc;
		node_t(int key) :
			key(key), prior(mt()), 
			cnt(1), size(1)
			lc(nullptr), rc(nullptr) {}

		void update()
		{
			size = cnt;
			if (lc) {
				size += lc->size;
			}
			if (rc) {
				size += rc->size;
			}
		}
	};

	using pnode_t = node_t::pnode_t;

	pnode_t root;

	Treap() : root(nullptr) {}

	template <typename Compare> 
	std::tuple<pnode_t, pnode_t> split(pnode_t p, int key, Compare &&cmp)
	{
		if(p == nullptr) {
			return {nullptr, nullptr};
		} else if (cmp(p->key, key)) {
			pnode_t r;
			std::tie(p->rc, r) = split(p->rc, key, cmp);
			p->update();
			return {p, r};
		} else {
			pnode_t l;
			std::tie(l, p->lc) = split(p->lc, key, cmp);
			p->update();
			return {l, p};
		}
	}

	std::tuple<pnode_t, pnode_t, pnode_t> split3(pnode_t p, int key)
	{
		auto [le, g] = split(p, key, std::less_equal<int>());
		auto [l, e] = split(le, key, std::less<int>());
		return {l, e, g};
	}

	pnode_t join(pnode_t p, pnode_t q)
	{
		if (p == nullptr && q == nullptr) return nullptr;
		if (p == nullptr) return q;
		if (q == nullptr) return p;
		if (p->prior < q->prior) {
			p->rc = join(p->rc, q);
			p->update();
			return p;
		} else {
			q->lc = join(p, q->lc);
			q->update();
			return q;
		}
	}

	pnode_t join3(pnode_t a, pnode_t b, pnode_t c)
	{
		return join(join(a, b), c);
	}

	void insert(int key)
	{
		auto [l, e, g] = split3(root, key);

		if (e == nullptr) {
			e = new node_t(key);
		} else {
			e->cnt++;
			e->update();
		}

		root = join3(l, e, g);
	}

	void del(int key) 
	{
		auto [l, e, g] = split3(root, key);

		if (e->cnt > 1) {
			e->cnt--;
			e->update();
		} else {
			delete e;
			e = nullptr;
		}

		root = join3(l, e, g);
	}

	template <typename Compare> 
	int get_cnt(pnode_t p, int key, Compare &&cmp) const
	{
		if (p == nullptr) return 0;
		int les = p->size;
		if (p->rc != nullptr) les -= p->rc->size;
		if (cmp(p->key, key)) {
			return les + get_cnt(p->rc, key, cmp);
		} else {
			return get_cnt(p->lc, key, cmp);
		}
	}
	template <typename Compare> int get_cnt(int key, Compare &&cmp) const { return get_cnt(root, key, cmp); }

	int size() const
	{
		if (root) return root->size;
		else return 0;
	}
};

std::mt19937 Treap::mt;
```

`cmp` 只能传 `std::less` 或 `std::less_equal`。其实我觉得改成一个 `bool` 值表示
是否要有等于也挺好的。

## 数学

### `static_modint`

```cpp
template <unsigned int P> struct static_modint
{
	using mint = static_modint;
	unsigned int _v;

	static_modint() : _v(0) {}

	static_modint(long long v)
	{
		long long x = v % mod();
		if (x < 0) x += mod();
		_v = x;
	}

	unsigned int val() const { return _v; }
	static constexpr unsigned int mod() { return P; }

	mint operator-() const { return mint(P - _v); }
	mint &operator+=(const mint &a)
	{
		_v += a._v;
		if (_v >= mod()) _v -= mod();
		return *this;
	}
	mint &operator-=(const mint &a)
	{
		_v += mod() - a._v;
		if (_v >= mod()) _v -= mod();
		return *this;
	}
	mint &operator*=(const mint &a)
	{
		_v = (long long)_v * a._v % mod();
		return *this;
	}
	mint operator+(const mint &a) const { return mint(*this) += a; }
	mint operator-(const mint &a) const { return mint(*this) -= a; }
	mint operator*(const mint &a) const { return mint(*this) *= a; }

	mint pow(long long n) const
	{
		mint x = *this, r = 1;
		while (n) {
			if (n & 1) r *= x;
			x *= x;
			n >>= 1;
		}
		return r;
	}

	mint inv() const { return pow(mod() - 2); }

	mint &operator/=(const mint &a) { return *this *= a.inv(); }
	mint operator/(const mint &a) const { return mint(*this) /= a; }
};
```

模数固定，编译器（应该）会自动加上 Barrett reduction 优化。

## 图论

### Dinic

```cpp
struct maxflow
{
	int n;
	int s, t;

	struct flow_edge
	{
		int u, v;
		int cap, flow;
		flow_edge(int u, int v, int cap) : u(u), v(v), cap(cap), flow(0)
		{
		}
	};
	std::vector<flow_edge> edges;
	std::vector<std::vector<int>> adj;

	std::vector<int> level, ptr;

	maxflow(int n, int s, int t)
	    : n(n), s(s), t(t), adj(n), level(n), ptr(n)
	{
	}

	void add_edge(int u, int v, int cap)
	{
		adj[u].emplace_back((int)edges.size());
		edges.emplace_back(u, v, cap);
		adj[v].emplace_back((int)edges.size());
		edges.emplace_back(v, u, 0);
	}

	bool bfs()
	{
		std::fill(level.begin(), level.end(), -1);
		level[s] = 0;
		std::queue<int> q;
		q.emplace(s);
		while (!q.empty()) {
			int u = q.front();
			q.pop();
			for (auto id : adj[u]) {
				if (edges[id].cap - edges[id].flow < 1)
					continue;
				if (level[edges[id].v] != -1) continue;
				level[edges[id].v] = level[u] + 1;
				q.emplace(edges[id].v);
			}
		}
		return level[t] != -1;
	}

	int dfs() { return dfs(s, std::numeric_limits<int>::max()); }

	int dfs(int u, int flow_limit)
	{
		if (u == t || flow_limit == 0) return flow_limit;
		int res = 0;
		for (int &cid = ptr[u]; cid < (int)adj[u].size(); cid++) {
			int id = adj[u][cid];
			int v = edges[id].v;
			if (level[v] != level[u] + 1 ||
			    edges[id].cap - edges[id].flow < 1)
				continue;
			int d = dfs(v, std::min(flow_limit - res, edges[id].cap - edges[id].flow));
			if (d == 0) continue;
			res += d;
			edges[id].flow += d;
			edges[id ^ 1].flow -= d;
			if (res == flow_limit) return res;
		}
		return res;
	}

	int flow()
	{
		int res = 0;
		while (true) {
			if (!bfs()) break;
			std::fill(ptr.begin(), ptr.end(), 0);
			while (int f = dfs()) { res += f; }
		}
		return res;
	}
};
```

### SCC

```cpp
struct scc_graph
{
  int n;
  std::vector<std::vector<int>> adj;

  scc_graph(int n) : n(n), adj(n) {}

  void add_edge(int u, int v) { adj[u].emplace_back(v); }

  std::pair<int, std::vector<int>> solve()
  {
    std::vector<int> dfn(n, -1), low(n, -1), stk;
    std::vector<bool> vis(n);
    std::vector<int> belong(n, -1);
    int scc_cnt = 0;
    int cnt = 0;
    auto dfs = [&](auto &&self, int u) -> void
    {
      dfn[u] = low[u] = cnt++;
      stk.emplace_back(u);
      vis[u] = true;
      for (auto v : adj[u]) {
        if (dfn[v] == -1) {
          self(self, v);
          low[u] = std::min(low[u], low[v]);
        } else if (vis[v]) {
          low[u] = std::min(low[u], dfn[v]);
        }
      }
      if (low[u] == dfn[u]) {
        while (true) {
          int x = stk.back();
          stk.pop_back();
          vis[x] = false;
          belong[x] = scc_cnt;
          if (x == u) break;
        }
        scc_cnt++;
      }
    };
    for (int i = 0; i < n; i++) {
      if (belong[i] == -1) dfs(dfs, i);
    }
    return {scc_cnt, belong};
  }
};
```

### Two SAT

```cpp
struct twosat
{
  int n;
  std::vector<bool> ans;
  scc_graph scc;

  twosat(int n) : n(n), ans(n), scc(n * 2) {}

  void add_clause(int i, bool f, int j, bool g)
  {
    scc.add_edge(i * 2 + !f, j * 2 + g);
    scc.add_edge(j * 2 + !g, i * 2 + f);
  }

  bool satisfiable()
  {
    auto belong = scc.solve().second;
    for (int i = 0; i < n; i++) {
      if (belong[i * 2] == belong[i * 2 + 1]) return false;
      ans[i] = belong[i * 2] > belong[i * 2 + 1];
    }
    return true;
  }

  const std::vector<bool> &answer() const { return ans; }
};
```

## 字符串

### KMP

```cpp
std::vector<int> prefix_function(const std::string &s)
{
	const int n = s.size();
	std::vector<int> p(n);
	for (int i = 1; i < n; i++) {
		int j = p[i - 1];
		while (j > 0 && s[i] != s[j]) j = p[j - 1];
		if (s[i] == s[j]) j++;
		p[i] = j;
	}
	return p;
}
```

### AC 自动机

```cpp
struct AhoCorasick
{
	struct node_t
	{
		std::array<int, 26> next;
		int fail;

		int operator[](int x) const { return next[x]; }
		int &operator[](int x) { return next[x]; }
	};

	std::vector<node_t> t;

	AhoCorasick() : t(1) {}

	int insert(const std::string &s)
	{
		int p = 0;
		for (auto c : s) {
			c -= 'a';
			if (t[p][c] == 0) {
				t[p][c] = t.size();
				t.emplace_back();
			}
			p = t[p][c];
		}
		return p;
	}

	void build()
	{
		std::queue<int> q;
		for (int i = 0; i < 26; i++) {
			if (t[0][i] != 0) {
				q.emplace(t[0][i]);
			}
		}
		while (!q.empty()) {
			int u = q.front();
			q.pop();
			for (int i = 0; i < 26; i++) {
				int &v = t[u][i];
				if (v) {
					t[v].fail = t[t[u].fail][i];
					q.emplace(v);
				} else {
					v = t[t[u].fail][i];
				}
			}
		}
	}
	
	std::vector<int> query(const std::string &s)
	{
		std::vector<int> cnt(t.size());
		int u = 0;
		cnt[0]++;
		for (auto c : s) {
			c -= 'a';
			u = t[u][c];
			cnt[u]++;
		}

		std::vector<std::vector<int>> child(t.size());
		for (int i = 1; i < (int)t.size(); i++) {
			child[t[i].fail].emplace_back(i);
		}
		auto dfs = [&child, &cnt](auto &&self, int u) -> void
		{
			for (auto v : child[u]) {
				self(self, v);
				cnt[u] += cnt[v];
			}
		};
		dfs(dfs, 0);

		return cnt;
	}
};
```

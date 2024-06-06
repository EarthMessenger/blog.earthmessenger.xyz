---
title: 算法競賽的板子
pubDate: 2023-07-28
tags: oi continually-updated
lang: zh-hant
---

https://earthmessenger.github.io/icpc-snippet/

這篇文章主要存一些板子，應該會繼續更新。

## TOC

## 數據生成器

### 有 N 個節點的樹

```python
edges = [(random.randrange(i), i) for i in range(1, N)]
```

### 有 N 個節點的二叉樹

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

`build` 函數會返回一個數，表示二叉樹的根節點，如果希望以 0 爲根的話，可以輸出邊
的時候把 0 和根對調一下。

### 長度爲 N，和爲 M 的正整數序列

```python
def generate_sequence(N, M):
    sequence = sorted(random.sample(range(1, M), N-1))
    sequence = [0] + sequence + [M]
    return [sequence[i+1] - sequence[i] for i in range(N)]
```

### 有 N 個節點，M 條邊的簡單無向圖

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

## 對拍腳本

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

其中 `bf` 是暴力程序，`a` 是需要對拍的程序，`gen_data` 是用 Python 寫的數據生成
器，`diff` 的 `-Z` 選項用於忽略行末空格。

`$RANDOM` 的值域一般是 $[0, 32768)$，如果覺得太小可以考慮將多個 `$RANDOM` 拼到
一起，類似這樣：

```sh
printf "%04x" $RANDOM $RANDOM $RANDOM $RANDOM
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

自動尋找目錄下所有與可執行文件同名的 `.in` 文件進行評測，注意 TLE 會導致卡死。

完整版：[judgesh](https://github.com/EarthMessenger/judgesh)

## 數據結構

### 並查集

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

  bool merge(int x, int y)
  {
    int fx = find(x), fy = find(y);
    if (fx == fy) return false;
    if (size[fx] < size[fy]) std::swap(fx, fy);
    fa[fy] = fx;
    size[fx] += size[fy];
    return true;
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

### 平衡樹

此 [Dynamic Sequence Range Affine Range Sum](https://judge.yosupo.jp/problem/dynamic_sequence_range_affine_range_sum)。

#### RBST

```cpp
struct SumMonoid
{
  mint sum;
  SumMonoid() : sum(0) {}
  SumMonoid(mint sum) : sum(sum) {}

  SumMonoid operator*(const SumMonoid &s) const
  {
    return sum + s.sum;
  };
};

struct AddTimesMonoid
{
  mint k, b;
  AddTimesMonoid() : k(1), b(0) {}
  AddTimesMonoid(mint k, mint b) : k(k), b(b) {}

  AddTimesMonoid operator*(const AddTimesMonoid &a) const
  {
    return {k * a.k, b * a.k + a.b};
  };

  SumMonoid operator()(const SumMonoid &s, u32 size) const
  {
    return {s.sum * k + b * size};
  }

  bool is_unit() const
  {
    return k.val() == 1 && b.val() == 0;
  }
};

struct RBST
{
  struct node_t
  {
    bool reverse;
    AddTimesMonoid tag;
    u32 size;
    SumMonoid prod;
    SumMonoid m;
    node_t *lc, *rc;

    node_t() : reverse(false), tag(), size(0), prod(), m(), lc(nullptr), rc(nullptr) {}
    node_t(SumMonoid m) : reverse(false), tag(), size(1), prod(m), m(m), lc(nullptr), rc(nullptr) {}

    void update()
    {
      size = 1;
      prod = m;
      if (lc) {
        size = size + lc->size;
        prod = prod * lc->prod;
      }
      if (rc) {
        size = size + rc->size;
        prod = prod * rc->prod;
      }
    }

    void toggle_reverse()
    {
      reverse = !reverse;
      std::swap(lc, rc);
    }

    void apply(const AddTimesMonoid &t)
    {
      prod = t(prod, size);
      m = t(m, 1);
      tag = tag * t;
    }

    void push()
    {
      if (reverse) {
        if (lc) lc->toggle_reverse();
        if (rc) rc->toggle_reverse();
        reverse = false;
      }
      if (!tag.is_unit()) {
        if (lc) lc->apply(tag);
        if (rc) rc->apply(tag);
        tag = AddTimesMonoid{};
      }
    }
  };

  node_t *root;

  // 可用 std::mt19937 之類代替
  static u32 get_random()
  {
    static u32 x = 123456789;
    static u32 y = 362436069;
    static u32 z = 521288629;
    static u32 w = 88675123;
    u32 t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    return w = (w ^ (w >> 19)) ^ (t ^ (t >> 8));
  };

  static bool choice(u32 ls, u32 rs)
  {
    return get_random() % (ls + rs) < ls;
  }

  RBST() : root(nullptr) {}
  RBST(const std::vector<mint> &a) : root(build_tree(0, a.size(), a)) {}

  static node_t *build_tree(u32 l, u32 r, const std::vector<mint> &a)
  {
    if (r - l == 0) return nullptr;
    u32 mid = l + (r - l) / 2;
    auto p = new node_t(a[mid]);
    p->lc = build_tree(l, mid, a);
    p->rc = build_tree(mid + 1, r, a);
    p->update();
    return p;
  }

  static std::pair<node_t *, node_t *> split(u32 k, node_t *p)
  {
    if (p == nullptr) return {nullptr, nullptr};

    p->push();
    u32 ls = p->lc ? p->lc->size : 0;
    if (ls < k) {
      node_t *r;
      std::tie(p->rc, r) = split(k - ls - 1, p->rc);
      p->update();
      return {p, r};
    } else {
      node_t *l;
      std::tie(l, p->lc) = split(k, p->lc);
      p->update();
      return {l, p};
    }
  }

  static node_t *join(node_t *p, node_t *q)
  {
    if (p == nullptr) return q;
    if (q == nullptr) return p;

    if (choice(p->size, q->size)) {
      p->push();
      p->rc = join(p->rc, q);
      p->update();
      return p;
    } else {
      q->push();
      q->lc = join(p, q->lc);
      q->update();
      return q;
    }
  }

  static node_t *join3(node_t *p1, node_t *p2, node_t *p3)
  {
    return join(p1, join(p2, p3));
  }

  void insert(u32 i, SumMonoid m)
  {
    auto [lp, rp] = split(i, root);
    root = join3(lp, new node_t(m), rp);
  }

  void remove(u32 i)
  {
    auto [lp, irp] = split(i, root);
    auto [ip, rp] = split(1, irp);
    root = join(lp, rp);
  }

  void reverse(u32 l, u32 r)
  {
    auto [lp, mrp] = split(l, root);
    auto [mp, rp] = split(r - l, mrp);
    if (mp) mp->toggle_reverse();
    root = join3(lp, mp, rp);
  }

  void apply(u32 l, u32 r, const AddTimesMonoid &m)
  {
    auto [lp, mrp] = split(l, root);
    auto [mp, rp] = split(r - l, mrp);
    if (mp) mp->apply(m);
    root = join3(lp, mp, rp);
  }

  static SumMonoid prod(u32 l, u32 r, u32 ll, u32 rr, node_t *p)
  {
    if (p == nullptr) return {};

    if (l <= ll && rr <= r) {
      return p->prod;
    } else {
      p->push();

      u32 mid = ll + (p->lc ? p->lc->size : 0);
      SumMonoid res;
      if (l < mid) res = res * prod(l, r, ll, mid, p->lc);
      if (l <= mid && mid < r) res = res * p->m;
      if (mid + 1 < r) res = res * prod(l, r, mid + 1, rr, p->rc);
      return res;
    }
  }

  SumMonoid prod(u32 l, u32 r) const
  {
    if (root == nullptr) return {};
    return prod(l, r, 0, root->size, root);
  }
};
```

#### Splay

```cpp
struct SumMonoid
{
  mint sum;
  SumMonoid() : sum(0) {}
  SumMonoid(mint sum) : sum(sum) {}

  SumMonoid operator*(const SumMonoid &s) const
  {
    return sum + s.sum;
  };
};

struct AddTimesMonoid
{
  mint k, b;
  AddTimesMonoid() : k(1), b(0) {}
  AddTimesMonoid(mint k, mint b) : k(k), b(b) {}

  AddTimesMonoid operator*(const AddTimesMonoid &a) const
  {
    return {k * a.k, b * a.k + a.b};
  };

  SumMonoid operator()(const SumMonoid &s, u32 size) const
  {
    return {s.sum * k + b * size};
  }

  bool is_unit() const
  {
    return k.val() == 1 && b.val() == 0;
  }
};

struct Splay
{
  struct node_t
  {
    bool reversed;
    u32 size;

    SumMonoid prod;
    SumMonoid m;
    AddTimesMonoid tag;

    using pnode_t = node_t *;
    pnode_t fa;
    pnode_t ch[2];

    node_t() : reversed(false), size(0), prod(), m(), tag(), fa(nullptr), ch{nullptr, nullptr} {}
    node_t(SumMonoid m) : reversed(false), size(1), prod(m), m(m), tag(), fa(nullptr), ch{nullptr, nullptr} {}

    void update()
    {
      size = 1;
      prod = m;
      for (auto c : ch) {
        if (!c) continue;
        size += c->size;
        prod = prod * c->prod;
      }
    }

    void reverse()
    {
      reversed = !reversed;
      std::swap(ch[0], ch[1]);
    }

    void apply(const AddTimesMonoid &t)
    {
      prod = t(prod, size);
      m = t(m, 1);
      tag = tag * t;
    }

    void push()
    {
      for (auto c : ch) {
        if (!c) continue;
        if (reversed) c->reverse();
        if (!tag.is_unit()) c->apply(tag);
      }
      reversed = false;
      tag = AddTimesMonoid();
    }

    u32 which_child() const
    {
      assert(this->fa != nullptr);
      return this->fa->ch[1] == this;
    }

    void rotate()
    {
      auto x = this;
      assert(x->fa != nullptr);

      auto y = x->fa;
      auto z = y->fa;
      auto xci = x->which_child();
      y->ch[xci] = x->ch[xci ^ 1];
      if (x->ch[xci ^ 1]) x->ch[xci ^ 1]->fa = y;
      x->ch[xci ^ 1] = y;
      if (z) z->ch[y->which_child()] = x;
      y->fa = x;
      x->fa = z;

      y->update();
      x->update();
    }
  };

  using pnode_t = node_t *;
  pnode_t root;

  Splay() : root(nullptr) {}
  Splay(pnode_t root) : root(root) {}
  template <typename F>
  Splay(u32 n, F &&f) : root(build_tree(0, n, f, nullptr)) {}

  template <typename F>
  static pnode_t build_tree(u32 l, u32 r, F &&f, pnode_t fa)
  {
    if (r - l == 0) return nullptr;
    u32 mid = l + (r - l) / 2;
    auto p = new node_t(f(mid));
    p->ch[0] = build_tree(l, mid, f, p);
    p->ch[1] = build_tree(mid + 1, r, f, p);
    p->fa = fa;
    p->update();
    return p;
  }

  void splay(pnode_t x)
  {
    assert(x != nullptr);

    x->push();
    while (x->fa) {
      auto y = x->fa;
      if (!y->fa) {
        y->push();
        x->push();
        x->rotate();
      } else {
        auto z = y->fa;
        z->push();
        y->push();
        x->push();
        if (y->which_child() == x->which_child()) y->rotate();
        else x->rotate();
        x->rotate();
      }
    }
    root = x;
  };

  void splay_kth(u32 k)
  {
    auto p = root;
    while (true) {
      auto ls = p->ch[0] ? p->ch[0]->size : 0;
      if (k == ls) break;
      p->push();
      if (k < ls) {
        p = p->ch[0];
      } else {
        k -= ls + 1;
        p = p->ch[1];
      }
    }
    splay(p);
  }

  std::pair<pnode_t, pnode_t> split(u32 k)
  {
    if (!root) return {nullptr, nullptr};
    if (k == 0) return {nullptr, root};
    if (k == root->size) return {root, nullptr};
    splay_kth(k);
    auto l = root->ch[0];
    root->ch[0] = nullptr;
    root->update();
    if (l) l->fa = nullptr;
    return {l, root};
  }

  std::tuple<pnode_t, pnode_t, pnode_t> split3(u32 l, u32 r)
  {
    pnode_t mp, rp;
    std::tie(root, rp) = split(r);
    std::tie(root, mp) = split(l);
    return {root, mp, rp};
  }

  static pnode_t join(pnode_t p, pnode_t q)
  {
    if (!p) return q;
    if (!q) return p;
    Splay sq = q;
    sq.splay_kth(0);
    q = sq.root;
    q->ch[0] = p;
    p->fa = q;
    q->update();
    return q;
  }

  static pnode_t join3(pnode_t p1, pnode_t p2, pnode_t p3)
  {
    return join(p1, join(p2, p3));
  }

  void insert(u32 x, SumMonoid m)
  {
    auto [lp, rp] = split(x);
    root = join3(lp, new node_t(m), rp);
  }

  void remove(u32 x)
  {
    auto [lp, xp, rp] = split3(x, x + 1);
    delete xp;
    root = join(lp, rp);
  }

  void reverse(u32 l, u32 r)
  {
    auto [lp, mp, rp] = split3(l, r);
    if (mp) mp->reverse();
    root = join3(lp, mp, rp);
  }

  void apply(u32 l, u32 r, AddTimesMonoid m)
  {
    auto [lp, mp, rp] = split3(l, r);
    if (mp) mp->apply(m);
    root = join3(lp, mp, rp);
  }

  SumMonoid prod(u32 l, u32 r)
  {
    auto [lp, mp, rp] = split3(l, r);
    SumMonoid res;
    if (mp) res = mp->prod;
    root = join3(lp, mp, rp);
    return res;
  }
};
```

### LCT

[Dynamic Tree Vertex Add Path Sum](https://judge.yosupo.jp/problem/dynamic_tree_vertex_add_path_sum)

```cpp
template <typename T>
struct LinkCutTree
{
  struct Splay
  {
    using ptr = Splay *;

    u32 size;
    bool reversed;
    T val, prod;
    ptr fa, ch[2];

    Splay() : size(0), reversed(false), val(), prod(), fa(nullptr), ch{nullptr, nullptr} {}
    Splay(const T &val) : size(1), reversed(false), val(val), prod(val), fa(nullptr), ch{nullptr, nullptr} {}

    void update()
    {
      size = 1;
      prod = val;
      for (auto c : ch) {
        if (!c) continue;
        size += c->size;
        prod = prod * c->prod;
      }
    }

    void reverse()
    {
      reversed = !reversed;
      std::swap(ch[0], ch[1]);
    }

    void set(const T &v)
    {
      val = v;
      update();
    }

    void push()
    {
      for (auto c : ch) {
        if (!c) continue;
        if (reversed) c->reverse();
      }
      reversed = false;
    }

    u32 which_child() const
    {
      assert(fa != nullptr);
      return fa->ch[1] == this;
    }

    bool is_root() const
    {
      return fa == nullptr || (fa->ch[0] != this && fa->ch[1] != this);
    }

    void rotate()
    {
      auto x = this;
      assert(!is_root());

      auto y = x->fa;
      auto z = y->fa;
      auto xci = which_child();
      y->ch[xci] = x->ch[xci ^ 1];
      if (x->ch[xci ^ 1]) x->ch[xci ^ 1]->fa = y;
      x->ch[xci ^ 1] = y;
      if (!y->is_root()) z->ch[y->which_child()] = x;
      y->fa = x;
      x->fa = z;

      y->update();
      x->update();
    }

    void splay()
    {
      push();
      while (!is_root()) {
        auto y = fa;
        if (y->is_root()) {
          y->push();
          push();
          rotate();
        } else {
          auto z = y->fa;
          z->push();
          y->push();
          push();
          if (y->which_child() == which_child()) y->rotate();
          else rotate();
          rotate();
        }
      }
    }

    ptr access()
    {
      ptr rp = nullptr;
      ptr cur = this;
      while (cur) {
        cur->splay();
        cur->ch[1] = rp;
        cur->update();
        rp = cur;
        cur = cur->fa;
      }
      splay();
      return rp;
    }

    void make_root()
    {
      access();
      reverse();
    }
  };

  using ptr = typename Splay::ptr;

  std::vector<ptr> ptrs;

  template <typename F>
  LinkCutTree(int n, F &&f) : ptrs(n)
  {
    for (int i = 0; i < n; i++) ptrs[i] = new Splay(f(i));
  }

  void link(int x, int y)
  {
    auto xp = ptrs[x], yp = ptrs[y];
    xp->make_root();
    xp->fa = yp;
  }

  void cut(int x, int y)
  {
    auto xp = ptrs[x], yp = ptrs[y];
    xp->make_root();
    yp->access();
    assert(xp->fa == yp);
    yp->ch[0] = xp->fa = nullptr;
  }

  T prod(int x, int y)
  {
    auto xp = ptrs[x], yp = ptrs[y];
    xp->make_root();
    yp->access();
    return yp->prod;
  }

  void set(int x, const T &v)
  {
    auto xp = ptrs[x];
    xp->splay();
    xp->set(v);
  }

  void multiply(int x, const T &v)
  {
    auto xp = ptrs[x];
    xp->splay();
    xp->set(xp->val * v);
  }

  T get(int x)
  {
    return ptrs[x]->val;
  }
};
```

## 數學

### `static_modint`

```cpp
template <int M>
struct static_modint
{
  static constexpr u32 UM = M;
  static_assert(UM < 0x80'00'00'00u);

  u32 v;
  constexpr static_modint() : v(0) {}

  template <typename T, std::enable_if_t<std::is_signed_v<T>>* = nullptr>
  constexpr static_modint(T n) : v((n %= M) < 0 ? n + M : n) {}

  template <typename T, std::enable_if_t<std::is_unsigned_v<T>>* = nullptr>
  constexpr static_modint(T n) : v(n %= UM) {}

  using mint = static_modint;

  static mint raw(u32 v)
  {
    mint res;
    res.v = v;
    return res;
  }

  constexpr u32 val() const { return v; }

  mint operator-() const { return mint::raw(v == 0 ? 0u : UM - v); }

  mint &operator+=(mint a)
  {
    if ((v += a.v) >= UM) v -= UM;
    return *this;
  }
  mint &operator-=(mint a)
  {
    if ((v += UM - a.v) >= UM) v -= UM;
    return *this;
  }
  mint &operator*=(mint a)
  {
    v = (u64)v * a.v % UM;
    return *this;
  }
  mint &operator/=(mint a) { return *this *= a.inv(); }

  friend mint operator+(mint a, mint b) { return a += b; }
  friend mint operator-(mint a, mint b) { return a -= b; }
  friend mint operator*(mint a, mint b) { return a *= b; }
  friend mint operator/(mint a, mint b) { return a /= b; }

  mint pow(u64 n) const
  {
    mint res = 1, base = *this;
    while (n) {
      if (n & 1) res *= base;
      base *= base;
      n >>= 1;
    }
    return res;
  }

  mint inv() const { return pow(UM - 2); }
};
```

模數固定，編譯器（應該）會自動加上 Barrett reduction 優化。

### `dynamic_modint`

UPD: 刪除了 `dynamic_modint::bar()`，以此函數得 barrett 很慢。

```cpp
struct barrett {
  u32 m;
  u64 im;

  barrett() {}
  barrett(u32 m) : m(m), im((u64)(-1) / m + 1) {}

  u32 mod() const { return m; }

  u32 reduce(u64 x) const 
  {
    u64 y = ((u128)x * im) >> 64;
    u32 z = x - y * m;
    if (z >= m) z += m;
    return z;
  }
};

template <int id>
struct dynamic_modint
{
  static barrett b;
  static u32 mod() { return b.m; }
  static void set_mod(u32 x) { b = barrett(x); }
  static u32 reduce(u64 x) { return b.reduce(x); }

  u32 v;

  dynamic_modint() = default; // as a trivial struct
  template <typename T>
  dynamic_modint(T x) : v((x % (T)mod() < 0) ? x + (T)mod() : x) {}

  using mint = dynamic_modint;

  static mint raw(u32 x)
  {
    mint res;
    res.v = x;
    return res;
  }

  u32 val() const { return v; }

  mint operator-() const { return dynamic_modint(mod() - v); }
  mint &operator+=(mint x)
  {
    if ((v += x.v) >= mod()) v -= mod();
    return *this;
  }
  mint &operator-=(mint x)
  {
    if ((v += mod() - x.v) >= mod()) v -= mod();
    return *this;
  }
  mint &operator*=(mint x)
  {
    v = reduce((u64)v * x.v);
    return *this;
  }
  friend mint operator+(mint x, mint y) { return x += y; }
  friend mint operator-(mint x, mint y) { return x -= y; }
  friend mint operator*(mint x, mint y) { return x *= y; }

  mint pow(long long y) const
  {
    mint res = 1;
    mint base = *this;
    while (y) {
      if (y & 1) res *= base;
      base *= base;
      y >>= 1;
    }
    return res;
  }

  mint inv() const { return pow(mod() - 2); }

  mint &operator/=(mint x) { return *this *= x.inv(); }
  friend mint operator/(mint x, mint y) { return x *= y.inv(); }
};

template <int id> barrett dynamic_modint<id>::b;
```

## 圖論

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

### `static_graph`

卡常用，從 AtCoder Library 摘的。

```cpp
template <typename E>
struct static_graph
{
  std::vector<int> start;
  std::vector<E> elist;

  static_graph(int n, const std::vector<std::pair<int, E>> &edges) 
    : start(n + 1), elist(edges.size())
  {
    for (const auto &e : edges) start[e.first + 1]++;
    for (int i = 1; i <= n; i++) start[i] += start[i - 1];
    auto counter = start;
    for (const auto &e : edges) elist[counter[e.first]++] = e.second;
  }

  auto operator[](int u) const
  {
    return std::span{elist.begin() + start[u], elist.begin() + start[u + 1]};
  };
};
```

`static_graph::operator[]` 用到了 `std::span`，需要 C++20，如果不支持可以考慮寫
一個支持 `begin()`，`end()` 的簡單 wrapper。

註：複製 `start` 於 `counter`，使其序與 `edges` 同。若無此要求，可改作：

```cpp
  static_graph(int n, const std::vector<std::pair<int, E>> &edges) 
    : start(n + 1), elist(edges.size())
  {
    for (const auto &e : edges) start[e.first]++;
    for (int i = 0; i < n; i++) start[i + 1] += start[i];
    for (const auto &e : edges) elist[--start[e.first]] = e.second;
  }
```

又註：`static_graph` 雖減少內存碎片，但不能減少內存使用。構建之時，`edges`
`elist` 並存，用內存二倍。

## 字符串

### KMP

```cpp
std::vector<int> prefix_function(const std::string &s)
{
  int n = s.size();
  std::vector<int> p(n + 1);
  p[0] = p[1] = 0;
  for (int i = 1; i < n; i++) {
    int t = p[i];
    while (t > 0 && s[t] != s[i]) t = p[t];
    if (s[t] == s[i]) t++;
    p[i + 1] = t;
  }
  return p;
}

```

### AC 自動機

```cpp
struct aho_corasick
{
  struct node_t
  {
    std::array<int, 26> next;
    int fail;
    node_t() : fail(0) { std::fill(next.begin(), next.end(), 0); }
    int &operator[](int x) { return next[x]; }
    int operator[](int x) const { return next[x]; }
  };

  std::vector<node_t> t;

  aho_corasick() : t(1) {}

  int insert(const std::string &s)
  {
    int p = 0;
    for (auto c : s) {
      c -= 'a';
      if (!t[p][c]) {
        int id = t.size();
        t.emplace_back();
        t[p][c] = id;
      }
      p = t[p][c];
    }
    return p;
  }

  void build()
  {
    std::queue<int> q;
    for (int i = 0; i < 26; i++) {
      if (t[0][i]) q.emplace(t[0][i]);
    }
    while (!q.empty()) {
      auto u = q.front();
      q.pop();
      for (auto i = 0; i < 26; i++) {
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

  int walk(int u, char ch) const { return t[u][ch - 'a']; }

  int size() const { return t.size(); }

  std::vector<std::vector<int>> fail_tree() const
  {
    int n = size();
    std::vector<int> deg(n);
    for (int i = 1; i < n; i++) deg[t[i].fail]++;
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < n; i++) adj[i].reserve(deg[i]);
    for (int i = 1; i < n; i++) adj[t[i].fail].emplace_back(i);
    return adj;
  }
};
```

### 後綴數組

```cpp
std::pair<std::vector<int>, std::vector<int>> suffix_array(const std::string &s)
{
  int n = s.size();
  int m = std::max(128, n);

  std::vector<int> sa(n), rk(n), sa2(n), rk2(n * 2, -1), cnt(m + 1);
  for (int i = 0; i < n; i++) rk[i] = s[i];
  for (int i = 0; i < n; i++) cnt[rk[i] + 1]++;
  for (int i = 1; i < m; i++) cnt[i] += cnt[i - 1];
  for (int i = 0; i < n; i++) sa[cnt[rk[i]]++] = i;

  for (int w = 1; ; w *= 2) {
    int p = 0;
    for (int i = n - w; i < n; i++) sa2[p++] = i;
    for (int i = 0; i < n; i++) {
      if (sa[i] >= w) sa2[p++] = sa[i] - w;
    }

    std::fill(cnt.begin(), cnt.end(), 0);
    for (int i = 0; i < n; i++) cnt[rk[sa2[i]] + 1]++;
    for (int i = 1; i < m; i++) cnt[i] += cnt[i - 1];
    for (int i = 0; i < n; i++) sa[cnt[rk[sa2[i]]]++] = sa2[i];

    std::copy(rk.begin(), rk.end(), rk2.begin());
    int q = 0;
    rk[sa[0]] = 0;
    for (int i = 1; i < n; i++) {
      int u = sa[i - 1], v = sa[i];
      if (rk2[u] != rk2[v] || rk2[u + w] != rk2[v + w]) q++;
      rk[sa[i]] = q;
    }
    if (q + 1 == n) break;
  }

  return {sa, rk};
}
```

### 後綴自動機

```cpp
struct suffix_automaton
{
  struct node_t
  {
    std::array<int, 26> next;
    int link;
    int len;
    node_t() : link(0), len(0) { std::fill(next.begin(), next.end(), -1); }
  };

  int n;
  std::vector<node_t> t;
  int last;

  suffix_automaton() : n(0), t(1), last(0) {}

  int new_node()
  {
    int id = t.size();
    t.emplace_back();
    return id;
  }

  int size() const { return t.size(); }

  void append(char ch)
  {
    int cv = ch - 'a';
    int x = new_node();
    t[x].len = n + 1;
    int p = last;
    while (p != 0 && t[p].next[cv] == -1) {
      t[p].next[cv] = x;
      p = t[p].link;
    }
    if (t[p].next[cv] == -1) {
      t[p].next[cv] = x;
    } else {
      int q = t[p].next[cv];
      if (t[p].len + 1 == t[q].len) {
        t[x].link = q;
      } else {
        int nq = new_node();
        t[nq].next = t[q].next;
        t[nq].link = t[q].link;
        t[q].link = nq;
        t[nq].len = t[p].len + 1;
        while (p != 0 && t[p].next[cv] == q) {
          t[p].next[cv] = nq;
          p = t[p].link;
        }
        if (t[p].next[cv] == q) t[p].next[cv] = nq;
        t[x].link = nq;
      }
    }
    last = x;
    n++;
  }
};
```

### Z

```cpp
std::vector<int> z_algorithm(const std::string &s)
{
  int n = s.size();
  std::vector<int> z(n + 1);
  z[0] = n;
  int l = 0, r = 0;
  for (int i = 1; i <= n; i++) {
    int t = 0;
    if (i <= r) t = std::min(z[i - l], r - i);
    while (i + t < n && s[t] == s[i + t]) t++;
    z[i] = t;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  return z;
}
```

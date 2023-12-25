---
title: PA2021 Wystawa
tags: binary-search greedy data-structure
---

## 题意

给定长度为 $n$ 的序列 $a, b$。

你需要构造一个序列 $c$，构造方法为：

- 选择 $k$ 个 $i$，令 $c_i \leftarrow a_i$。
- 对于其他 $i$，令 $c_i \leftarrow b_i$。

求序列 $c$ 的最大子段和的最小值，并给出一种方案。

来自洛谷。

## 解析

https://sio2.mimuw.edu.pl/c/pa-2021-1/forum/167/9811/

波兰老哥做法，感觉常数挺大。

考虑二分答案，通过贪心求出最大连续子段和小于等于 lim 的 [kmin,kmax]（能满足条件
的 k 一定是一段连续的区间，设 f(x) 表示 k=x 时最小最大连续子段和，f 一定是先不
增后不减的 V，因为可以先把 Ai < Bi 的替换，然后剩下的只有 Ai > Bi）。求 kmin 和
kmax 本质上是相同的，只需要把 A 和 B 交换就行了。

贪心地求 kmin，我们从空序列开始不断往序列末尾追加值，先追加 B，如果出现后缀最大
值大于 lim，就要将某些地方 Bi 替换成 Ai 以满足限制。首先，为了快速修改后缀最大
值，需要建一颗线段树，支持单点修改，全局查后缀最大值。

维护替换的候选，候选一定满足 Bi > Ai，否则换后不优。候选分为两类，一类是换了 i
之后，后缀最大值变化量恰为 Bi-Ai 的（即后缀最大值取到的位置仍然包含 i），另一类
是换之后后缀最大值变化量小于 Bi-Ai 的（不包含 i）。在换的过程中，前一类有可能会
归到后一类，但后一类一定不会归到前一类。使用第一类候选时，我们优先选用变化量最
大的用一个优先队列存候选的变化量和位置，在选取的时候 lazy 地将应该归入第二类的
候选放入第二类。使用第二类候选时，由于第二类候选换之后后缀最大值一定不包含 i，
所以优先选取最靠后的候选，这样后缀最大值可以选取的区间更少，更容易满足条件，同
样使用一个优先队列维护。选择第一类候选和第二类候选的较优者。

最后构造答案，根据上面的过程，我们可以求出取到 kmin 和 kmax 的方案。我们总可以
将其中一个调整成目标的 k，只需要选取 Ai Bi 较小者替换即可。

感觉好抽象，把代码放一下。

```cpp
#include <algorithm>
#include <bit>
#include <cassert>
#include <cctype>
#include <iostream>
#include <limits>
#include <queue>
#include <string>
#include <tuple>
#include <vector>

using i64 = long long;
using i128 = __int128_t;
using u32 = unsigned int;
using u64 = unsigned long long;
using u128 = __uint128_t;

struct MonoidMaxSuf
{
  i64 sum, suf;
  MonoidMaxSuf() : sum(0), suf(0) {}
  MonoidMaxSuf(i64 v) : sum(v), suf(std::max(0ll, v)) {}
  MonoidMaxSuf(i64 sum, i64 suf) : sum(sum), suf(suf) {}
  MonoidMaxSuf operator*(const MonoidMaxSuf &m) const
  {
    return {sum + m.sum, std::max(suf + m.sum, m.suf)};
  }
};

template <typename Monoid>
struct Segtree
{
  int n, size, log;
  std::vector<Monoid> s;

  Segtree(int n) :
    n(n),
    size(std::bit_ceil((unsigned)n)),
    log(std::countr_zero((unsigned)size)),
    s(size * 2) {}

  void update(int x) { s[x] = s[x * 2] * s[x * 2 + 1]; }

  void set(int x, const Monoid &v) 
  {
    s[x += size] = v;
    while (x >>= 1) update(x);
  }

  const Monoid &get(int x) const { return s[x + size]; }
  const Monoid &prod_all() const { return s[1]; }

  Monoid max_suf_change(int x, Monoid v) const
  {
    x += size;
    while (x > 1) {
      if (x & 1) v = s[x ^ 1] * v;
      else v = v * s[x ^ 1];
      x >>= 1;
    }
    return v;
  }
};

std::pair<int, std::string> find_kmin(const std::vector<int> &a, const std::vector<int> &b, i64 lim)
{
  int n = a.size();
  std::string s(n, 'B');
  int kmin = 0;
  Segtree<MonoidMaxSuf> t(n);

  std::priority_queue<int> less;
  std::priority_queue<std::pair<i64, int>> equal;

  for (int i = 0; i < n; i++) {
    t.set(i, b[i]);
    if (a[i] < b[i]) equal.emplace(b[i] - a[i], i);
    while (t.prod_all().suf > lim) {
      while (!equal.empty()) {
        auto [d, p] = equal.top();
        if (t.prod_all().suf - t.max_suf_change(p, a[p]).suf == d) break;
        else {
          equal.pop();
          less.emplace(p);
        }
      }

      i64 v_equal = std::numeric_limits<i64>::max(), v_less = std::numeric_limits<i64>::max();
      if (!equal.empty()) {
        v_equal = t.prod_all().suf - equal.top().first;
      }
      if (!less.empty()) {
        auto p = less.top();
        v_less = t.max_suf_change(p, a[p]).suf;
      }
      if (v_equal == std::numeric_limits<i64>::max() && v_less == std::numeric_limits<i64>::max()) {
        return {n + 1, ""};
      }
      if (v_equal < v_less) {
        auto p = equal.top().second;
        t.set(p, a[p]);
        s[p] = 'A';
        equal.pop();
      } else {
        auto p = less.top();
        t.set(p, a[p]);
        s[p] = 'A';
        less.pop();
      }
      kmin++;
    }
  }

  return {kmin, s};
}

std::pair<int, std::string> find_kmax(const std::vector<int> &a, const std::vector<int> &b, i64 lim)
{
  int n = a.size();
  auto [kmin, s] = find_kmin(b, a, lim);
  for (auto &i : s) i = i ^ ('A' ^ 'B');
  return {n - kmin, s};
}

std::pair<bool, std::string> adjust_b2a(const std::vector<int> &a, const std::vector<int> &b, int k, std::string s)
{
  int kcur = std::count(s.begin(), s.end(), 'A');
  int n = a.size();
  for (int i = 0; i < n; i++) {
    if (kcur < k && s[i] == 'B' && a[i] <= b[i]) {
      s[i] = 'A';
      kcur++;
    }
  }
  if (kcur == k) return {true, s};
  else return {false, ""};
}

std::pair<bool, std::string> adjust_a2b(const std::vector<int> &a, const std::vector<int> &b, int k, std::string s)
{
  int kcur = std::count(s.begin(), s.end(), 'A');
  int n = a.size();
  for (int i = 0; i < n; i++) {
    if (kcur > k && s[i] == 'A' && a[i] >= b[i]) {
      s[i] = 'B';
      kcur--;
    }
  }
  if (kcur == k) return {true, s};
  else return {false, ""};
}

template <typename T>
T next_int()
{
  T x = 0, f = 1;
  char ch = getchar();
  while (!isdigit(ch)) {
    if (ch == '-') f = -1;
    ch = getchar();
  }
  while (isdigit(ch)) {
    x = x * 10 + ch - '0';
    ch = getchar();
  }
  return x * f;
}

template <typename T>
i64 get_max_sum(const std::vector<int> &a, const std::vector<int> &b, T cmp)
{
  int n = a.size();
  i64 s = 0, t = 0;
  i64 ans = 0;
  for (int i = 0; i < n; i++) {
    int v = std::min(a[i], b[i], cmp);
    s += v;
    ans = std::max(ans, s - t);
    t = std::min(t, s);
  }
  return ans;
}

int main()
{
  int n = next_int<int>();
  int k = next_int<int>();
  std::vector<int> a(n), b(n);
  for (auto &i : a) i = next_int<int>();
  for (auto &i : b) i = next_int<int>();

  i64 l = get_max_sum(a, b, std::less<>()), r = get_max_sum(a, b, std::greater<>());
  while (l < r) {
    i64 mid = l + (r - l) / 2;
    int kmin = find_kmin(a, b, mid).first;
    int kmax = find_kmax(a, b, mid).first;
    if (kmin <= k && k <= kmax) {
      r = mid;
    } else {
      l = mid + 1;
    }
  }

  auto [flag, s] = adjust_b2a(a, b, k, find_kmin(a, b, r).second);
  if (!flag) {
    std::tie(flag, s) = adjust_a2b(a, b, k, find_kmax(a, b, r).second);
    assert(flag);
  }

  std::cout << r << std::endl << s << std::endl;
}
```

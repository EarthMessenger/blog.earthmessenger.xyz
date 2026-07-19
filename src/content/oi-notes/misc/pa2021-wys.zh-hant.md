---
lang: zh-hant
opencc: true
tags: binary-search greedy data-structure
title: PA2021 Wystawa
---

## 題意

給定長度為 $n$ 的序列 $a, b$。

你需要構造一個序列 $c$，構造方法為：

- 選擇 $k$ 個 $i$，令 $c_i \leftarrow a_i$。
- 對於其他 $i$，令 $c_i \leftarrow b_i$。

求序列 $c$ 的最大子段和的最小值，並給出一種方案。

來自洛谷。

## 解析

https://sio2.mimuw.edu.pl/c/pa-2021-1/forum/167/9811/

波蘭老哥做法，感覺常數挺大。

考慮二分答案，通過貪心求出最大連續子段和小於等於 lim 的 [kmin,kmax]（能滿足條件
的 k 一定是一段連續的區間，設 f(x) 表示 k=x 時最小最大連續子段和，f 一定是先不
增後不減的 V，因為可以先把 Ai < Bi 的替換，然後剩下的只有 Ai > Bi）。求 kmin 和
kmax 本質上是相同的，只需要把 A 和 B 交換就行了。

貪心地求 kmin，我們從空序列開始不斷往序列末尾追加值，先追加 B，如果出現字尾最大
值大於 lim，就要將某些地方 Bi 替換成 Ai 以滿足限制。首先，為了快速修改後綴最大
值，需要建一顆線段樹，支援單點修改，全域性查字尾最大值。

維護替換的候選，候選一定滿足 Bi > Ai，否則換後不優。候選分為兩類，一類是換了 i
之後，字尾最大值變化量恰為 Bi-Ai 的（即字尾最大值取到的位置仍然包含 i），另一類
是換之後字尾最大值變化量小於 Bi-Ai 的（不包含 i）。在換的過程中，前一類有可能會
歸到後一類，但後一類一定不會歸到前一類。使用第一類候選時，我們優先選用變化量最
大的用一個優先佇列存候選的變化量和位置，在選取的時候 lazy 地將應該歸入第二類的
候選放入第二類。使用第二類候選時，由於第二類候選換之後字尾最大值一定不包含 i，
所以優先選取最靠後的候選，這樣字尾最大值可以選取的區間更少，更容易滿足條件，同
樣使用一個優先佇列維護。選擇第一類候選和第二類候選的較優者。

最後構造答案，根據上面的過程，我們可以求出取到 kmin 和 kmax 的方案。我們總可以
將其中一個調整成目標的 k，只需要選取 Ai Bi 較小者替換即可。

感覺好抽象，把程式碼放一下。

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

---
lang: zh-hant
opencc: true
pubDate: 2023-12-31
tags: cpp trick
title: 用於關聯式容器的透明比較器技巧
---

為什麼不寫到 [C++ 技巧](/posts/cpp-tricks) 裡，單純只是想水一份部落格。

最近模擬賽考到了 [[Ynoi2012] WC2016 充滿了失望][P5525]，題意大概是問有哪些圓在
一個凸包內。大概思路是將圓按照半徑排序，然後將凸包向內“收縮”，判斷圓心是否在凸
包內。難點就在於這個“收縮”：

![convex hull](/assets/images/convex_hull-0e5f8579.svg)

凸包上的頂點 A 和 B 分別會沿著角平分線 AE 和 BE 向內收縮，這個收縮的過程可以用
一個線性的函式描述，可以令 $f_{A}(t)$ 表示收縮了 t 距離後頂點 A 應該在的位置。
顯然，如果收縮到了 E 這個位置，那麼就應該將 A、B 兩點刪除，再加入一個新的點 F，
這就需要支援在凸包上插入和刪除，同時還需要支援二分，因為我們還要判斷圓心是否在
凸包上。插入刪除這個工作用 `set` 很好搞定，但是如果我們要查詢一個圓 $(O, R)$ 是
否在凸包內，就需要二分最靠後的的 $f_{A}(R) \le O$（這裡的小於都是先比較 x 再比
較 y），直接 `lower_bound` 一個點是做不到的。

為了解決這個問題，我們需要寫一個透明比較器。透明比較器就是有 `is_transparent`
型別的比較器，如果關聯式容器檢測到比較器有 `is_transparent`，那麼在比較的時候就
不會將比較的物件強轉成 `key_type`，而會原封不動的傳給比較器。一個典型的例子是
[`std::less<void>`][std::less<void>]，它可以比較任意型別，但是無須型別轉換。對
於這道題，我們在 `set` 中存入各個點的收縮函式 $f_{A}$，對於兩個收縮函式的比較，
我們在兩個函式的定義域的並中選一個點，計算出對應的點，進行比較，二分的時候，我
們傳入圓的圓心 $O$ 和半徑 $R$，按照上面說的東西比較即可。

比較器大概寫成這樣：

```cpp
struct Compare
{
  using is_transparent = void;

  template <typename T, typename X>
  bool operator()(const std::pair<LinearFunc<T, X>, int> &a, const std::pair<LinearFunc<T, X>, int> &b) const
  {
    X x = std::max(a.first.s, b.first.s);
    return a.first.calc(x) < b.first.calc(x);
  }

  template <typename T, typename X>
  bool operator()(const std::pair<LinearFunc<T, X>, int> &a, const std::pair<T, X> &b) const
  {
    return a.first.calc(b.second) < b.first;
  }

  template <typename T, typename X>
  bool operator()(const std::pair<T, X> &a, const std::pair<LinearFunc<T, X>, int> &b) const
  {
    return a.first < b.first.calc(a.second);
  }
};
```

[完整程式碼在 gist 上][circle.cpp]。

一個要注意的點是，雖然透明比較器填什麼都可以，但是一定要保證有單調性（要不然怎麼二分）。

透明比較器還有許多有用的地方，比如說用 `set` 存了許多不交區間（比如珂朵莉樹），
想要找到包含某個點 x 的區間，一般做法是構造一個區間，左端點是 x，而右端點是什麼
就比較疑惑，而使用透明比較器就能輕鬆解決。再比如說用 `set` 存很多 `vector`，按
照長度排序，想找到長度小於等於 k 的最大 `vector` 等。

[P5525]: https://www.luogu.com.cn/problem/P5525
[std::less<void>]: https://en.cppreference.com/w/cpp/utility/functional/less_void
[circle.cpp]: https://gist.github.com/EarthMessenger/d526d2620f6a619dead742f80baa5a4d

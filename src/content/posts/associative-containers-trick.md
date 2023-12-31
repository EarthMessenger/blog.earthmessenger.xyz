---
title: 用于关联式容器的透明比较器技巧
pubDate: 2023-12-31
tags: cpp trick
---

为什么不写到 [C++ 技巧](/posts/cpp-tricks) 里，单纯只是想水一份博客。

最近模拟赛考到了 [[Ynoi2012] WC2016 充满了失望][P5525]，题意大概是问有哪些圆在
一个凸包内。大概思路是将圆按照半径排序，然后将凸包向内“收缩”，判断圆心是否在凸
包内。难点就在于这个“收缩”：

![convex hull](/assets/images/convex_hull-0e5f8579.svg)

凸包上的顶点 A 和 B 分别会沿着角平分线 AE 和 BE 向内收缩，这个收缩的过程可以用
一个线性的函数描述，可以令 $f_{A}(t)$ 表示收缩了 t 距离后顶点 A 应该在的位置。
显然，如果收缩到了 E 这个位置，那么就应该将 A、B 两点删除，再加入一个新的点 F，
这就需要支持在凸包上插入和删除，同时还需要支持二分，因为我们还要判断圆心是否在
凸包上。插入删除这个工作用 `set` 很好搞定，但是如果我们要查询一个圆 $(O, R)$ 是
否在凸包内，就需要二分最靠后的的 $f_{A}(R) \le O$（这里的小于都是先比较 x 再比
较 y），直接 `lower_bound` 一个点是做不到的。

为了解决这个问题，我们需要写一个透明比较器。透明比较器就是有 `is_transparent`
类型的比较器，如果关联式容器检测到比较器有 `is_transparent`，那么在比较的时候就
不会将比较的对象强转成 `key_type`，而会原封不动的传给比较器。一个典型的例子是
[`std::less<void>`][std::less<void>]，它可以比较任意类型，但是无须类型转换。对
于这道题，我们在 `set` 中存入各个点的收缩函数 $f_{A}$，对于两个收缩函数的比较，
我们在两个函数的定义域的并中选一个点，计算出对应的点，进行比较，二分的时候，我
们传入圆的圆心 $O$ 和半径 $R$，按照上面说的东西比较即可。

比较器大概写成这样：

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

[完整代码在 gist 上][circle.cpp]。

一个要注意的点是，虽然透明比较器填什么都可以，但是一定要保证有单调性（要不然怎么二分）。

透明比较器还有许多有用的地方，比如说用 `set` 存了许多不交区间（比如珂朵莉树），
想要找到包含某个点 x 的区间，一般做法是构造一个区间，左端点是 x，而右端点是什么
就比较疑惑，而使用透明比较器就能轻松解决。再比如说用 `set` 存很多 `vector`，按
照长度排序，想找到长度小于等于 k 的最大 `vector` 等。

[P5525]: https://www.luogu.com.cn/problem/P5525
[std::less<void>]: https://en.cppreference.com/w/cpp/utility/functional/less_void
[circle.cpp]: https://gist.github.com/EarthMessenger/d526d2620f6a619dead742f80baa5a4d

---
title: 左闭右开神教
date: 2023-02-13
tags: oi trick
---

## 前言

~~缺点：同学读不懂你的代码了~~

不难发现，在大多数编程语言的标准库中，通常都会以左闭又开，从 0 开始的方式表示
区间。本文将论述这种表示方式在算法竞赛中的诸多优势。

注：具体问题具体分析，辩证看待这篇文章。

## 理解左闭右开

如果表示的数是连续的，自然会有这种区间表示的问题，该开就开，该闭就闭。

然而计算机无法表示连续的数，无论是在实践上还是理论上。能够表示连续的数意味着可以
表示两个数 $a$、$b$，使得 $\forall \varepsilon > 0, |a - b| < \varepsilon$，
这显然是做不到的。

因此，计算机在表示数值时，常常会**离散化**成离散的整数，再用“段”来表示。这就导致
了闭区间，开区间，左闭右开，左开右闭四种区间表示方法的混乱。

![number line](/assets/images/number-line-1a39e843.png)

如图，绿色的数表示计算机中的实际的数，是**离散成段**的，而蓝色的数表示两个绿色的
数之间的**分隔**。 那么，表示绿色的左闭右开区间 $[l, r)$ 就可以理解成以蓝色的端
点 $l$、$r$ 所围起来的区间。这样离散整数的区间 $[l, r)$ 就对应连续实数区间的
$[l, r)$，不需要任何额外转换，更加符合人类的直觉。

蓝色和绿色数就相当于物理上时刻和时间段，编程时一定要厘清两者之间的关系。

> 如果你是色盲，那么你只需要知道图片上数轴的线是红色的，较高的数字是蓝色的，较
低的数字是绿色的就行了。

当然，左闭右开的表示和 C++ 中下标从 0 开始有极大关系。

## 优势

这些优势是由上面的“离散左闭右开区间与实数的区间对应”，所引出来的。

### 计算长度

这离散区间的长度就是左右两个端点的距离，由于离散左闭右开区间与连续实数区间天然
的对应关系，计算区间 $[l, r)$ 的长度就是 $r - l$，无需额外转换。

C++ 中，长度为 $n$ 数组为 $a_0, a_1, a_2, \cdots, a_{n-1}$，正好和左闭右开呼应。

### 表示空集

可以使左右端点相同来表示空集，如果是闭区间的话，必须要（不优雅地）使右端点小于
左端点。这在编写莫队时十分有用。

### 表示连续区间

由于 $[l, r)$ 可以理解为 $l$ 端点到 $r$ 端点，因此表示连续区间端点就应该重合，
这在编写分治、线段树之类的代码时十分有用。

## 实践

### 环状数组

一个数组长度为 $n$，那么第 $i$ 个元素的前一个就是 $i + n - 1 \pmod n$，后一个就是
$i + 1 \pmod n$。

环状数组的下标不能比大小，不能用类似 `for (int i = l; i <= r; i = (i + 1) % n)`
的方式循环，但用左闭右开表示区间就可以写成 
`for (int i = l; i != r; i = (i + 1) % n)`。

### 前缀和和差分

前缀和可以理解成离散化的积分，差分可以理解为离散化的微分。

对于数列 $a_0, a_1, a_2, \cdots$，我们定义其前缀和数组：

$$s_i = 
\begin{cases}
0                     & i = 0 \\
a_{i - 1} + s_{i - 1} & i > 0
\end{cases}$$

即前 $i$ 项的和。

同样我们定义差分数组：

$$d_i = 
\begin{cases}
a_i             & i = 0 \\
a_i - a_{i - 1} & i > 0 \\
\end{cases}$$

求区间 $[l, r)$ 的和：$s_r - s_l$

区间 $[l, r)$ 加 $x$：$d_l = d_l + x$，$d_r = d_r - x$

实践：

```cpp
std::vector<int> a(n), s(n + 1), d(n);
for (int i = 0; i < n; i++) s[i + 1] = s[i] + a[i];
for (int i = 1; i < n; i++) d[i] = a[i] - a[i - 1];
```

注意**前缀和数组比原数组的长度大一**，且这样定义会使得**原数组的差分数组的前缀
和数组比原数组多一个 0**。

仿照前缀和，我们也可以定义出字符串 $s$ 的前缀哈希：

$$h_i = 
\begin{cases}
0                                  & i = 0 \\
h_{i - 1} \times M + s_{i} \pmod N & i > 0
\end{cases}
$$

这样求子串 $s_{[l, r)}$ 的哈希就是 $h_r - h_l \times M^{r - l} \pmod N$。

各种 dp 数组也可以仿照这种方式定义。

> 还是那句话：具体问题具体分析，这种定义依然存在许多不方便之处。

### 二分

在数组 $a$ 的区间 $[l, r)$ 中找值 $x$ 出现的位置。

`lower_bound`:

```cpp
int l = 0, r = n;
while (l < r) {
    int mid = (l + r) / 2;
    if (a[mid] >= x) r = mid;
    else l = mid + 1;
}
return r;
```

`upper_bound`:

```cpp
int l = 0, r = n;
while (l < r) {
    int mid = (l + r) / 2;
    if (a[mid] > x) r = mid;
    else l = mid + 1;
}
return r;
```

两份代码唯一的区别在于：一个是 `a[mid] >= x`，一个是 `a[mid] > x`。

~挺没用的~

### 树状数组

树状数组可以下标从 0 开始，通过简单的找规律发现，`x` 的父节点是 `x | (x + 1)`，
能管辖的范围是 `x & (x + 1)` 到 `x`，不需要依赖 `lowbit`。可以写出如下代码：

```cpp
struct fenwick_tree
{
    int n;
    std::vector<int> t;
    fenwick_tree(int n) : n(n), t(n) {}
    void add(int x, int v)
    {
        for (; x < n; x |= (x + 1)) t[x] += v;
    }
    int sum(int x)
    {
        int res = 0;
        for (x--; x >= 0; x = (x & (x + 1)) - 1) res += t[x];
        return res;
    }
};
```

然而这样很没有必要，也容易背错，你也可以写传统的下标从 1 开始的树状数组再封装成
下标从 0 开始：

```cpp
struct fenwick_tree
{
    int n;
    std::vector<int> t;
    fenwick_tree(int n) : n(n), t(n) {}
    void add(int x, int v)
    {
        for (x++; x <= n; x += x & -x) t[x - 1] += v;
    }
    int sum(int x)
    {
        int res = 0;
        for (; x >= 1; x -= x & -x) res += t[x - 1];
        return res;
    }
};
```

注意这里两个 `fenwick_tree::sum` 都表示 $[0, x)$ 的和，与前面前缀和的定义吻合。

类比前面前缀和和差分，可以容易得出单点修改区间查询和单点修改区间查询的代码。

对于区间修改区间查询，则和常规思路一致，假设 $a$ 的差分数组为 $d$，则：

$$
\begin{aligned}
 & \sum_{i=0}^{r-1} a_i \\\\
=& \sum_{i=0}^{r-1} \sum_{j=0}^{i} d_i \\\\
=& \sum_{i=0}^{r-1} d_i \times (r - i) \\\\
=& \sum_{i=0}^{r-1} d_i \times r - \sum_{i=0}^{r-1} d_i \times i
\end{aligned}
$$

容易发现这个结论明显比普通的树状数组优美，没有了奇怪的 +1。

代码（[LibreOJ 提交记录](https://loj.ac/s/1698497)）：

```cpp
int main()
{
    int n, q;
    scanf("%d%d", &n, &q);
    std::vector<long long> a(n), d(n), di(n);

    for (int i = 0; i < n; i++) {
        scanf("%lld", &a[i]);
    }

    d[0] = a[0];
    di[0] = 0;

    for (int i = 1; i < n; i++) {
        d[i] = a[i] - a[i - 1];
        di[i] = d[i] * i;
    }

    fenwick_tree f(d), fi(di);

    while (q--) {
        char op;
        scanf(" %1c", &op);

        if (op == '2') {
            int l, r;
            scanf("%d%d", &l, &r);
            l--;
            auto ans = f.sum(r) * r - fi.sum(r) - f.sum(l) * l + fi.sum(l);
            printf("%lld\n", ans);
        } else if (op == '1') {
            long long l, r, v;
            scanf("%lld%lld%lld", &l, &r, &v);
            l--;
            f.add(l, v);
            f.add(r, -v);
            fi.add(l, v * l);
            fi.add(r, -v * r);
        }
    }
}
```

没有奇怪的 +1 -1，舒服！

### 线段树

堆式存储线段树也可以让下标从 0 开始。具体来说节点 `x` 的左儿子为 `x * 2 + 1`，
右儿子为 `x * 2 + 2`，当然我觉得这很不优美，不如下标从 1 开始。

重点是区间表示，左闭右开的区间意味着连续区间的左右端点一致，如下面常见的 
`add_tree` 函数（用于线段树区间加）：

```cpp
 void add_tree(int l, int r, long long x, int ll, int rr, int p)
 {
     if (l <= ll && rr <= r) {
         put_tag(x, ll, rr, p);
         return ;
     }
     spread_tag(ll, rr, p);
     int mid = (ll + rr) / 2, lchild = p * 2, rchild = p * 2 + 1;
     if (l < mid) add_tree(l, r, x, ll, mid, lchild);
     if (mid < r) add_tree(l, r, x, mid, rr, rchild);
     t[p].sum = t[lchild].sum + t[rchild].sum;
 }
```

[完整代码 LibreOJ 提交记录](https://loj.ac/s/1700394)

注意到代码往下递归的那两行，得益于左闭右开的优点，这里对齐了！再看其他的线段树
模板，无法对齐，丑陋不堪。

### 分块

判断区间在哪一块是明显方便许多，可以直接取模相除：
[LibreOJ 提交记录](https://loj.ac/s/1700529)

## 总结

具体问题具体分析，没有什么是完美的，上述内容依然存在不优雅之处，比如倒序遍历时
左开右闭明显比左闭右开好用。一定要区分清楚数和边界的关系，也要注意题目给的是哪
种区间表示，自己代码又用的是哪种区间表示，不能混淆。

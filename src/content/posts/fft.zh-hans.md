---
title: FFT
pubDate: 2024-11-11
tags: math fft
lang: zh-hans
opencc: true
---

注意，下面文字中用 $w_{n}$ 表示 n 次单位根（而不是用 $\omega$）。

求多项式 $F(x) = \sum_{i=0}^{n-1}a_{i}x^{i}$ 在 $x = w_{n}^{k}$ 处的点值（$n$
是 2 的幂）。

将 $F(x)$ 分成按照次数奇偶分成两部分。令：

$$
G(x) = \sum_{i=0}^{n/2-1}a_{2i}x^{i}
$$

$$
H(x) = \sum_{i=0}^{n/2-1}a_{2i+1} x^{i}
$$

则有 $F(x) = G(x^{2}) + xH(x^{2})$。

带入单位根。

$$
\begin{aligned}
F(w_{n}^{k}) &= G(w_{n}^{2k}) + w_{n}^{k} H(w_{n}^{2k}) \\
             &= G(w_{n/2}^{k}) + w_{n}^{k} H(w_{n/2}^{2k}) \\
\end{aligned}
$$

$$
\begin{aligned}
F(w_{n}^{k+n/2}) &= G(w_{n}^{2k+n}) + w_{n}^{k+n/2} H(w_{n}^{2k+n}) \\
                 &= G(w_{n}^{2k}) - w_{n}^{k} H(w_{n}^{2k}) \\
                 &= G(w_{n/2}^{k}) - w_{n}^{k} H(w_{n/2}^{2k}) \\
\end{aligned}
$$

如此可以分治成两个规模减半的子问题，然后 $O(n)$ 归并。

反过来，从点值如何求回原多项式？令：

$$
A(x) = \sum_{i=0}^{n-1} F(w_{n}^{k}) x^{i}
$$

即 F 的 FFT 算出来的点值组成一个多项式。我们注意到将 $w_{n}^{-k}$ 带入 A：

$$
\begin{aligned}
A(w_{n}^{-k}) &= \sum_{i=0}^{n-1} F(w_{n}^{i}) w_{n}^{-ik} \\
              &= \sum_{i=0}^{n-1} (\sum_{j=0}^{n-1} a_{j} w_{n}^{ij}) w_{n}^{-ik} \\
              &= \sum_{i=0}^{n-1} \sum_{j=0}^{n-1} a_{j} w_{n}^{i(j-k)} \\
              &= \sum_{j=0}^{n-1} a_{j} \sum_{i=0}^{n-1} w_{n}^{i(j-k)} \\
\end{aligned}
$$

计算后面的 $\sum_{i=0}^{n-1} w_{n}^{i(j-k)}$，分类讨论 $j-k=0$ 和 $j-k\ne 0$。

对于 $j-k=0$，则 $w_{n}^{i(j-k)}=1$，上式等于 $n$。

对于 $j-k\ne 0$，则可以应用等比数列求和：

$$
\sum_{i=0}^{n-1} w_{n}^{i(j-k)} = \frac{1 - w_{n}^{n(j-k)}}{1 - w_{n}^{j-k}} = 0
$$

综上：

$$
A(w_{n}^{-k}) = na_{k}
$$

所以逆 FFT 相当于将单位根的逆元带进去算，做类似 FFT 的步骤，最后再除以 n。

---

实现上。分治可以用倍增代替。分治按照次数奇偶划分，对于 $i$ 次项系数 $a_{i}$，它
在分治的第 $j$ 层被划分到 $G$ 当且仅当 $i$ 的第 $j$ 位是 $0$，分到 $H$ 同理，总
体来看，也就相当于将系数的二进制表示倒过来。

可以 $O(n)$ 递推预处理一个数倒过来的值。令 $R(i)$ 表示 $i$ 倒过来的值，容易从
$R(i / 2)$ 递推过来。

实现（[yosupo 提交记录](https://judge.yosupo.jp/submission/248347)）：

```cpp
template <typename mint>
std::vector<mint> ntt(std::vector<mint> a, const std::vector<mint> &w)
{
  u32 n = a.size();
  u32 log = w.size() - 1;
  std::vector<u32> r(n);
  r[0] = 0;
  for (u32 i = 1; i < n; i++) r[i] = r[i / 2] / 2 + ((i & 1) << (log - 1));
  for (u32 i = 0; i < n; i++) {
    if (i < r[i]) std::swap(a[i], a[r[i]]);
  }

  for (u32 i = 0; i < log; i++) {
    u32 len = 1u << i;
    for (u32 j = 0; j < n; j += len * 2) {
      mint wi = 1;
      for (u32 k = j, end = j + len; k < end; k++) {
        mint g = a[k];
        mint h = wi * a[k + len];
        a[k] = g + h;
        a[k + len] = g - h;
        wi *= w[i + 1];
      }
    }
  }

  return a;
}

template <typename mint, mint pr = 3>
std::pair<std::vector<mint>, std::vector<mint>> prepare_pr(u32 log)
{
  std::vector<mint> w(log + 1), iw(log + 1);
  w[log] = pr.pow((mint::UM - 1) >> log);
  iw[log] = w[log].inv();
  for (int i = log; i--; ) {
    w[i] = w[i + 1] * w[i + 1];
    iw[i] = iw[i + 1] * iw[i + 1];
  }

  return {w, iw};
}

template <typename mint, mint pr = 3>
std::vector<mint> convolution(std::vector<mint> a, std::vector<mint> b)
{
  u32 n = a.size();
  u32 m = b.size();

  u32 log = 0;
  while ((1u << log) < n + m - 1) log++;

  u32 size = 1u << log;

  a.resize(size);
  b.resize(size);

  auto [w, iw] = prepare_pr<mint, pr>(log);

  a = ntt(std::move(a), w);
  b = ntt(std::move(b), w);

  for (u32 i = 0; i < size; i++) a[i] *= b[i];

  a = ntt(std::move(a), iw);

  mint isize = mint{size}.inv();
  for (auto &i : a) i *= isize;
  a.resize(n + m - 1);
  return a;
}
```

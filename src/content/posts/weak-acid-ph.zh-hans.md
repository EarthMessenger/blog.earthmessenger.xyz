---
title: 认真计算弱酸 pH
pubDate: 2025-08-31
tags: chemistry whk
lang: zh-hans
opencc: true
---

很久以前就写好了，但是由于 Astro 不好配置 mhchem 一直没发，没想到更新到 Astro 5 然后突然就能用了🤯。

---

有了 $K_{a}$，$K_{w}$，以及两个守恒之后，可以解出所有东西。假设某一元弱酸 $\ce{HA}$，其电离常数为 $K_{a}$，水的电离常数为 $K_{w}$，总共有 $\pu{n mol}$，体积为 $\pu{V L}$。可以列出以下式子：

$$
\begin{cases}
\ce{[H+]} \ce{[OH-]} = K_{w} \\
\dfrac{\ce{[H+]} \ce{[A-]}}{\ce{[HA]}} = K_{a} \\
\ce{[HA]} + \ce{[A-]} = \frac{n}{V} \\
\ce{[H+]} = \ce{[OH-]} + \ce{[A-]}
\end{cases}
$$

总共有 4 个方程，同时也恰好有 4 个未知量，所以每个未知量都**可解**。

消元整理得到：

$$
\ce{[H+]}^{3} + K_{a} \ce{[H+]}^{2} - \left(K_{w} + \frac{K_{a} n}{V}\right)\ce{[H+]} - K_{a} K_{w} = 0
$$

简单的一元弱酸，$\ce{[H+]}$ 与 $V$ 的关系居然是一个三次方程，并且没法因式分解。对于 $n$ 元酸，则是 $n+2$ 次方程。

这个方程一共有三个实根，两负一正。求解三次方程可以用 NumPy 的 roots 函数，使用方法如 `np.polynomial.Polynomial([1, 1, 4]).roots()`。也可以用 SymPy，但是 SymPy 是直接套的三次方程求根公式，求数值的时候会有精度问题。lambdify 后可能出现 `invalid value encountered in sqrt`，一个粗暴的解决方法是让 lambdify 使用 mpmath 计算（传入参数 `modules=["mpmath"]`）。

最终图像（带的是醋酸 $K_a=1.8 \times 10^-5$，$K_w = 1 \times 10^{-14}$）：

![-pH-V](../../assets/posts/weak-acid-ph/result.svg)

参考代码：

```python
import sympy as sp
import numpy as np
from mpmath import mp
import matplotlib.pyplot as plt

K_a, K_w, n, V = sp.symbols('K_a, K_w, n, V', positive=True, real=True)
H, OH, X, HX = sp.symbols('[H^{+}], [OH^{-}], [X^{-}], [HX]', positive=True, real=True)

root = sp.solve(H**3 + K_a * H**2 - (K_a * n / V + K_w) * H - K_a * K_w, H)

root_lambda = sp.lambdify(V, root[2].subs(((K_a, sp.Rational("1.8e-5")), (K_w, sp.Rational("1e-14")), (n, sp.Rational("1")))), modules=["mpmath"])
mp.dps=100

V_values = np.logspace(1, 8, 1000)
H_values = []

for i in V_values:
    res = root_lambda(i)
    H_values.append(res.real)

plt.plot(V_values, H_values, label='pH-V')
plt.xlabel("Volume (L)")
plt.ylabel("[H+] (mol)")
plt.yscale("log")
plt.xscale("log")
plt.grid(True, which="both", linestyle="--", linewidth=0.5)
plt.legend()
plt.show()
```

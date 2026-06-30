---
title: 测电阻
pubDate: 2025-11-08
tags: physics math
lang: zh-hans
opencc: true
---

伏安法测量电阻，根据电压表所测范围是否包含电流表，可以分为内接法和外置法。

![](../../assets/posts/measuring-resistance/inner-outer-connection.svg)

如图，左边是内接法，右边是外置法。由于我确实不知道内外置的英文叫什么😅，姑且用 i(nner) 表示内接，o(uter) 表示外置。

众所周知，内接测量出来的电阻：

$$
R_i = R_x + R_A
$$

外置的：

$$
R_o = \frac{R_xR_V}{R_x+R_V}
$$

## 大内小外

我们希望比较内接和外置的误差，可以比较相对误差。内接是：

$$
\eta_i = \frac{R_i-R_x}{R_x} = \frac{R_A}{R_x}
$$

外置：

$$
\eta_o = \frac{R_x-R_o}{R_x} = \frac{R_x}{R_x+R_V}
$$

当内接优于外置的时候，即：

$$
\begin{aligned}
\eta_i &< \eta_o \\
\frac{R_A}{R_x} &< \frac{R_x}{R_x+R_V} \\
R_A(R_x+R_V) &< R_x^2
\end{aligned}
$$

即应该比较 $R_A(R_x+R_V)$ 和 $R_x^2$ 的大小关系。不过正常来说，$R_V$ 应该比 $R_x$ 大很多，干脆把 $R_x+R_V$ 当成 $R_V$，所以就有了我们背的 $\sqrt{R_AR_V}$ 和 $R_x$ 比大小。

## 根据测量数据选择内外置

> 测量未知电阻，内接法测出 $U_i = 1.75\text{V}, I_i = 0.33\text{A}$，外置法测出 $U_o = 1.65\text{V}, I_o = 0.34\text{A}$，问应该使用内接还是外置？

正确解法是：认为内接的 $I_i$ 是准的，外置的 $U_o$ 是准的，于是内接的 $U$ 相对误差为 $0.1/1.65=2/33$，外置的 $I$ 相对误差是 $0.01/0.33=1/33$，所以电流表变化较小，更精准，因此选用外置。

有点不好理解，有人会问：$U$ 和 $I$，计算电阻的时候，一个在分子，一个在分母，两个怎么能直接比较相对误差呢？比如 $1/0.1=10$，分子差 $1\%$ 是 $1.01/0.1 = 10.1$，分母差 $1\%$ 则是 $1/0.101\approx 9.901$。貌似不太一样，能不能比较精确地分析呢。

令 $R_i = U_i/I_i$，$R_o = U_o/I_o$，根据众所周知，有：

$$
\begin{aligned}
\frac{1}{R_x + R_A} &= \frac{1}{R_i} \\
\frac{1}{R_x} + \frac{1}{R_V} &= \frac{1}{R_o} \\
\end{aligned}
$$

两个方程三个未知数，肯定解不了。假设 $R_A$ 已知，则可以消元：

$$
\begin{aligned}
R_x &= R_i-R_A \\
R_V &= \frac{R_xR_o}{R_x-R_o} = \frac{R_o(R_i-R_A)}{R_i-R_A-R_o}\\
\end{aligned}
$$

注意：这里头分母带减法了，分母可能为 0。但此时，$R_x = R_o$，说明外置绝对精确，$R_V$ 当作无穷大，就是理想电表，其实很合理。

带到大内小外的判别式里头（sympy 算的）：

$$
R_A(R_x+R_V) - R_x^2 = \frac{\left(R_{A} - R_{i}\right)^{2} \left(2 R_{A} - R_{i} + R_{o}\right)}{R_{i} - R_{A} - R_{o}}
$$

居然可以因式分解！不考虑分母为 0 的情况，由于小外偏小，分母一定正。所以我们得到：

1. 当 $R_A = R_i$ 的时候，呃，相当于 $R_x = 0$ 了，内外置都可以。
2. 当 $R_A < \frac{R_i - R_o}{2}$ 的时候，用内接。等于皆可。大于外置。

太神奇了。

假如说我们知道的是 $R_V$，同样的方法：

$$
\begin{aligned}
R_x &= \frac{R_VR_o}{R_V-R_o} \\
R_A &= R_i - R_x = \frac{R_iR_V - R_iR_o - R_VR_o}{R_V - R_o}\\
\end{aligned}
$$

由于小外偏小，$R_V-R_o$ 肯定大于 0。

不用算判别式了，直接带上面的结论，内接更好时：

$$
R_{A} = \frac{R_iR_V - R_iR_o - R_VR_o}{R_V - R_o} < \frac{R_i - R_o}{2}
$$

解得，$R_V < \frac{(R_i+R_o)R_o}{R_i-R_o}$。

**但是**，我们其实还有信息没用完。由于内外置测量的时候都是同一个电源（$E,r$），我们可以写出闭合电路欧姆定律：

$$
E = I_o(r+R_A+R_o) = U_i\left(\frac{1}{R_V} + \frac{1}{R_i}\right)r + U_i
$$

多了 $r$ 这一个自由元，也多了一个方程，什么都解不了。

先考虑 $r=0$ 的简单情况，即：

$$
I_o\left(R_A + R_o\right) = U_i
$$

解得：

$$
R_A = \frac{U_i}{I_o} - R_o = \frac{U_i - U_o}{I_o}
$$

带入数据算得：$R_A \approx 0.294 > (R_i - R_o) / 2 \approx 0.225$，所以外置👍。

对于 $r > 0$……

有亿点💩：

```python
from sympy import *
init_printing()

Ui,Ii,Uo,Io,r,RV,RA,Rx = symbols("U_i, I_i, U_o, I_o, r, R_V, R_A, R_x", positive=True)
Ri = Ui/Ii
Ro = Uo/Io
eq1 = Io*(r+RA+Ro) - (Ui*(1/RV + 1/Ri)*r+Ui)
eq2 = 1/Ro - (1/Rx+1/RV)
eq3 = Ri - (Rx + RA)

sol = solve([eq1, eq2, eq3], [RV, RA, Rx])

for RV_sol, RA_sol, Rx_sol in sol:
    D = sympify(RA_sol*(RV_sol + Rx_sol) - Rx_sol**2)
    print(D)
```

结果大家自己跑吧😊。

---

## 附

绘制电路图代码：

```latex
\documentclass{standalone}
\usepackage[european]{circuitikz}
\begin{document}

\begin{circuitikz}
  \draw
  (0, 0) to[battery1] (2, 0) to[switch] (4, 0)
  (0, 0) to (0, 1)
         to[R=$R_x$] (2, 1)
         to[ammeter={$I,R_{A}$}] (4, 1)
         to (4, 0)
  (0, 1) to (0, 2.5)
         to[voltmeter={$U,R_{V}$}] (4, 2.5)
         to (4, 1);

  \draw
  (5, 0) to[battery1] (7, 0) to[switch] (9, 0)
  (5, 0) to (5, 1)
         to[R=$R_x$] (7, 1)
         to[ammeter={$I,R_{A}$}] (9, 1)
         to (9, 0)
  (5, 1) to (5, 2.5)
         to[voltmeter={$U,R_{V}$}] (7, 2.5)
         to (7, 1);
\end{circuitikz}

\end{document}
```

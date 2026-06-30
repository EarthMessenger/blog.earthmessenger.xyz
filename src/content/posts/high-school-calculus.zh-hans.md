---
title: 导
pubDate: 2025-08-30
tags: math calculus whk e
lang: zh-hans
opencc: true
---

高中可能讲了，但是高中讲了不太可能。

## 莱布尼茨记法

高中一般都喜欢用**拉格朗日记法**来表示导数（如 $f'$ 这种），但是有一个弊端是不好表示自变量和因变量。而**莱布尼茨记法**就能更好地展现变量之间的关系。

比如 f 的关于 x 的一阶导写作：$\frac{\d f}{\d x}$，二阶导：$\frac{\d^2 f}{\d x^2}$，三阶导：$\frac{\d^3 f}{\d x^3}$。

这里的 $\frac{\d f}{\d x}$ 其实就相当于 $\lim_{\Delta x \to 0} \frac{\Delta f}{\Delta x}$ 的简写，因此在运算中可以像分数那样操作。

如链式法则，将 $f[g(x)]$ 对 $x$ 求导：

$$
\boxed{
  \frac{\d f}{\d x} = \frac{\d f}{\d g} \cdot \frac{\d g}{\d x}
}
$$

又比如 $y = f(x)$，则很显然可以看出：

$$
\boxed{
  \frac{\d x}{\d y} \cdot \frac{\d y}{\d x} = 1
}
$$

这是反函数求导法则。

## e

> 假如说你有 100 元，存到某银行，1 年之后利率 100%，那么一年之后你就有 200 元。
>
> 但是若能分 2 次结算利率，每次利率 $\frac12$，则两次结算利率之后，就能得到 $100 \times \left(1 + \frac12\right)^2 = 225$ 元。
> 
> 如果能分 3 次结算利率，每次利率 $\frac13$，则最后能得到 $100 \times \left(1 + \frac13\right)^3 \approx 237$ 元。
>
> 好像越来越多了，那么当结算利率的次数无限多，最终收益就会变成：
>
> $$
> \lim_{n \to \infty} 100\left(1 + \frac1n\right)^n = 100\e
> $$

这就是 $\e$ 最早、最经典的定义就是用极限：

$$
\boxed{
  \e = \lim_{n\to \infty} \left(1 + \frac1n\right)^n
}
$$

高中教材中曾经可能有这个定义，但是现在删掉了。

此外，我们可以用均值不等式证明数列 $\left(1 + \frac1n\right)^n$ 单调递增：

$$
\left(1 + \frac1n\right)^n 
= \textcolor{red}{1} \cdot \textcolor{blue}{\left(1 + \frac1n\right)}^n 
< \left(\frac{\textcolor{red}{1} + n \textcolor{blue}{\left(1 + \frac{1}{n}\right)}}{n + 1}\right)^{n+1} 
= \left(1 + \frac{1}{n+1}\right)^{n+1}
$$

高中都学过二项式定理，我们把这个 $\e$ 的表达式展开：

$$
\begin{aligned}
\e &= \lim_{n\to \infty} \left(1 + \frac1n\right)^n \\
   &= \lim_{n\to \infty} \sum_{i=0}^{n}\binom{n}{i} \frac{1}{n^i} \\
   &= \lim_{n\to \infty} \sum_{i=0}^{n} \frac{n^{\underline i}}{i!} \frac{1}{n^i} \\
\end{aligned}
$$

这里 $n^{\underline i}$ 是 $n$ 的 $i$ 次下降幂的意思。当 $n\to \infty$ 的时候，可以认为 $n^{\underline i} = n^i$，于是就有：

$$
\boxed{
  \e = \sum_{i=0}^{\infty}\frac{1}{i!}
}
$$

看到 $\e$ 不由自主想要求幂，还是类似上面的推导：

$$
\def\x{\textcolor{red}{x}}

\begin{aligned}
\e^{\x}
&= \lim_{n\to \infty} \left(1 + \frac1n\right)^{n\x} \\
&= \lim_{n\to \infty} \sum_{i=0}^{n\x} \binom{n\x}{i} \frac{1}{n^i} \\
&= \lim_{n\to \infty} \sum_{i=0}^{n\x} \frac{\x^{i}}{i!} \\
&= \boxed{\sum_{i=0}^{\infty}\frac{\x^i}{i!}} \\
\end{aligned}
$$

证明 $\e^x$ 的导数等于其自身：

$$
\begin{aligned}
\left(\e^x\right)' 
&= \lim_{\Delta x \to 0} \frac{\e^{x + \Delta x} - \e^x}{\Delta x} \\
&= \e^x\lim_{\Delta x \to 0} \frac{\e^{\Delta x} - 1}{\Delta x} \\
\end{aligned}
$$

把 $\e^{\Delta x}$ 展开：

$$
\e^x \lim_{\Delta x \to 0} \frac{\textcolor{red}{1 + \frac{\Delta x}{1!} + \frac{\Delta x^2}{2!} + \cdots} - 1}{\Delta x}
$$

高端无穷小丢掉，就是：


$$
\e^x \lim_{\Delta x \to 0} \frac{1 + \Delta x - 1}{\Delta x} = \e^x
$$

从而我们就证明了 $\boxed{(\e^x)' = \e^x}$。

定义 $\ln x$ 为 $\e^x$ 的反函数。要给 $\ln x$ 求导，不妨令 $y = \ln x$，也有 $x = \e^y$。

$$
\begin{aligned}
\frac{\d y}{\d x}
&= \frac{1}{\frac{\d x}{\d y}} \\
&= \frac{1}{\e^y} \\
&= \frac{1}{x} \\
\end{aligned}
$$

由此就证明了 $\boxed{(\ln x)' = \frac{1}{x}}$。

$\e$ **太伟大了**。现在我们可以来求 $x^n$ 的导数，但是这个其实不好搞，我们先对它取个对数再 $\exp$。

$$
\begin{aligned}
(x^n)' &= (\e^{n \ln x})' \\
       &= (n\ln x)' \cdot \e^{n \ln x} \\
       &= \frac{n}{x} \cdot x^{n} \\
       &= nx^{n-1} \\
\end{aligned}
$$

并没有用到广义二项式定理。

可以求 $a^x$ 的导数：

$$
\begin{aligned}
(a^x)' &= (\e^{x \ln a})' \\
       &= (x \ln a)' \cdot \e^{x \ln a} \\
       &= a^{x}\ln a \\
\end{aligned}
$$

甚至还可以求 $f^g$ 的导数：

$$
\begin{aligned}
(f^g)' &= (\e^{g\ln f})' \\
       &= \left(g'\ln f + \frac{g}{f}f'\right)f^g
\end{aligned}
$$

天不生 $\e^x$，万古如长夜。

## 洛必达法则

由于是高中，不用讨论函数能不能导问题。

先从一个很显然的东西出发。

**罗尔定理**：若函数 $f(x)$ 满足 $f(a) = f(b)$，则 $\exists c \in (a, b)$ s.t. $f'(c) = 0$。

假如说 $f(x)$ 是常函数，那么显然有导数为 0 的地方。

否则，$f(x)$ 中间一定有最大值或者最小值，不妨假设有最大值 $f(x_0)$。则 $x_0$ 左侧导数：

$$
\lim_{\Delta x \to 0} \frac{f(x - \Delta x) - f(x)}{-\Delta x} \ge 0
$$

右侧导数：

$$
\lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x} \le 0
$$

这两个导数要相等，所以在 $x_0$ 处的导数应该为 0。

这个是 $f(a) = f(b)$ 的情况，那么如果 $f(a) \ne f(b)$ 该怎么办呢。一个简单的思路是把 $f(x)$ 减去过 $(a, f(a))$，$(b, f(b))$ 的直线，即 $y = \frac{f(b)-f(a)}{b-a}(x-a) + f(a)$。这样就转化成了罗尔定理的情况。

令 $g(x) = f(x) - \frac{f(b)-f(a)}{b-a}(x-a) - f(a)$，根据罗尔定理，这个函数在 $(a, b)$ 之间也有导数为 0 的地方。对 $g(x)$ 求导，得：

$$
g'(c) = f'(c) - \frac{f(b)-f(a)}{b-a} = 0
$$

即：

$$
f'(c) = \frac{f(b)-f(a)}{b-a}
$$

这就是**拉格朗日中值定理**。

直观来看中值定理，说的就是**平面上固定两点的可微曲线，一定存在一点使得这点的切线斜率和两端点之间的斜率相同**。

若这个线甚至不是函数，而是类似 $(f(t), g(t))$ 描述的曲线，类似的结论呢？

首先我们要知道这种曲线怎么求切线斜率，模拟求导：

$$
\begin{aligned}
k &= \lim_{\Delta t \to 0} \frac{g(t + \Delta t) - g(t)}{f(t + \Delta t) - f(t)} \\
  &= \lim_{\Delta t \to 0} \frac{g(t + \Delta t) - g(t)}{\Delta t} \cdot \frac{\Delta t}{f(t + \Delta t) - f(t)} \\
  &= \frac{g'(x)}{f'(x)} \\
\end{aligned}
$$

即我们希望证明 $(a, b)$ 之间存在一点 $c$，使得 $\frac{g'(c)}{f'(c)} = \frac{g(b)-g(a)}{f(b)-f(a)}$。

模拟拉格朗日中值定理的证法，搞一条过 $(f(a), g(a))$ 和 $(f(b), g(b))$ 的直线，然后相减。即构造：

$$
h(t) = g(t) - \frac{g(b)-g(a)}{f(b)-f(a)}(f(t)-f(a)) - g(a)
$$

$h(a)$ 和 $h(b)$ 都为 0，套用罗尔定理，存在 $c \in (a, b)$：

$$
h'(c) = g'(c) - \frac{g(b)-g(a)}{f(b)-f(a)}f'(c) = 0
$$

即：

$$
\frac{g'(c)}{f'(c)} = \frac{g(b)-g(a)}{f(b)-f(a)}
$$

当然，有分数不太好，因为很可能出现分母为 0 的情况，即斜率不存在。我们还是最好全部化成乘积形式：

$$
g'(c)(f(b)-f(a)) = f'(c)(g(b)-g(a))
$$

这是**柯西中值定理**。

柯西中值定理的形式让人想起洛必达法则。现在我们要求 $\lim_{x\to a}\frac{f(x)}{g(x)}$，但是 $f(a) = g(a) = 0$。

对于任意一个 $b > a$，根据柯西中值定理，我们知道在 $(a, b)$ 中存在一点 $c$ 满足：

$$
\frac{f'(c)}{g'(c)} = \frac{f(b) - f(a)}{g(b) - g(a)} = \frac{f(b)}{g(b)}
$$

当 $b \to a$，也有 $c \to a$。所以就有：

$$
\boxed{
  \lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x\to a} \frac{f'(x)}{g'(x)}
}
$$

## 泰勒级数

<del>退役 OIer 还不会泰勒展开正常吗？但是我就是不会。</del>

我们希望用一个多项式函数去逼近一个复杂函数。具体来说，我们设我们要逼近的函数 $f(x)$ 可以用 $(x-a)$ 为基底的无穷次多项式表示：

$$
f(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + c_3(x-a)^3 + \cdots
$$

其中 $c_i$ 是待定的 $i$ 次项系数。

为了逼近，首先在 $x=a$ 处式子左右两边一定要相等：

$$
\def\a{\textcolor{red}{a}}
f(\a) = c_0 + c_1(\a-a) + c_2(\a-a)^2 + c_3(\a-a)^3 + \cdots
$$

这样就得到了 $c_0 = f(a)$。

继续，在 $x=a$ 处不但要相等，我们还希望它们的一阶导数也要相等：

$$
\def\a{\textcolor{red}{a}}
f'(\a) = c_1 + 2c_2(\a-a) + 3c_3(\a-a)^2 + 4c_4(\a-a)^3 + \cdots
$$

于是 $c_1 = f'(a)$。

二阶导：

$$
\def\a{\textcolor{red}{a}}
f''(\a) = 2c_2 + 6c_3(\a-a) + 12(\a-a)^2 + 20(\a-a)^3 + \cdots \Rightarrow c_2 = \frac{f''(a)}{2}
$$

……

规律不言自明了：$c_{i} = \frac{f^{(i)}(a)}{i!}$，这里 $f^{(i)}(a)$ 是 $f(x)$ 的 $i$ 阶导在 $x=a$ 处的值。

也可以写作：

$$
\boxed{
  f(x) = \sum_{i=0}^{\infty} \frac{f^{(i)}(a)}{i!} (x-a)^i
}
$$

特别地，当 $a=0$ 的时候，是**马克劳林级数**：

$$
\boxed{
  f(x) = \sum_{i=0}^{\infty} \frac{f^{(i)}(0)}{i!} x^i
}
$$

来试试把一些常用函数给泰勒展开一下：

首先是 $\e^x$，由于其任意次导数均为 $\e^x$，而 $\e^{0} = 1$，则可以容易得到：

$$
\boxed{
  \e^{x} = 1 + x + \frac{x^2}{2} + \frac{x^3}{3!} + \cdots + \frac{x^n}{n!} + \cdots
}
$$

和上面我们推的吻合。

然后来试试 $\sin x$。$\sin x$ 的导数有周期性，分别是 $\sin x, \cos x, -\sin x, -\cos x$，它们在 0 处的值分别为 0, 1, 0, -1。容易得到：

$$
\boxed{
  \sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots + (-1)^n\frac{x^{2n+1}}{(2n+1)!} + \cdots
}
$$

$\cos x$ 同理，有：

$$
\boxed{
  \cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots + (-1)^n\frac{x^{2n}}{(2n)!} + \cdots
}
$$

考虑将 $(1+x)^\alpha$ 展开：

$$
(1+x)^\alpha = 
1 + \alpha x + \frac{\alpha(\alpha - 1)}{2!} x^2 + \frac{\alpha(\alpha - 1)(\alpha - 2)}{3!} x^3 + \cdots + \frac{\alpha^{\underline n}}{n!}x^n + \cdots
$$

这个结果和广义二项式定理的一致。

多项式有个好处是可以很自然地将扩展到复数域。

$$
e^{\i x} = \textcolor{blue}{1} \textcolor{red}{+\i x} \textcolor{blue}{- \frac{x^2}{2}} \textcolor{red}{- \frac{\i x^3}{3!}} + \cdots + \frac{(\i x)^n}{n!} + \cdots
$$

其偶数次项正好是 $\textcolor{blue}{(-1)^k\frac{x^{2k}}{(2k)!}}$，也是 $\cos x$ 的展开项；奇数次项是 $\textcolor{red}{(-1)^k\i \frac{x^{2k+1}}{(2k+1)!}}$，是 $\i\sin x$ 的展开项。

于是就有了**欧拉公式**：

$$
\boxed{
  \e^{\i x} = \cos x + \i\sin x
}
$$

## 微分方程

$f(x) = f'(x)$ 的唯一解是 $f(x) = C\e^{x}$，其中 $C$ 是常数。

假设有其它函数满足这个条件，假设为 $g(x)$，那么我们考虑 $h(x) = \frac{g(x)}{\e^{x}}$。$h'(x) = \frac{g'(x)\e^x - g(x)\e^x}{\e^{2x}} = 0$，即 $h(x)$ 是个常数，所以得到 $g(x)$ 也属于 $C\e^{x}$。

由于导数之间可以线性相加，所以如果一个微分方程有若干解 $f_1(x), f_2(x), f_3(x), \cdots$，则它们的线性组合 $C_1f_1(x) + C_2f_2(x) + C_3f_3(x) + \cdots$ 也是解。

物理中有很多物理量之间有导数的关系。比如位置 $x$，对时间 $t$ 求导是速度 $v$，再对 $t$ 求导是加速度 $a$。求解这些量之间的关系，就相当于解微分方程。

### 单杆问题

考虑这样的问题：

> 平行导轨间距为 $L$，连通且忽略电阻，有垂直与两导轨所成平面的匀强磁场 $B$。有长度为 $L$，电阻为 $R$ 导体棒放置在平行导轨上，其初速度为 $v_0$，方向沿导轨方向。问导体棒什么时候停下来。

导体产生的电动势：

$$
E = vLB
$$

产生的电流：

$$
I = \frac{E}{R} = \frac{vLB}{R}
$$

产生的安培力：

$$
F = ILB = \frac{vL^2B^2}{R}
$$

牛二：

$$
F = ma
$$

$a$ 是什么？$a$ 是 $v$ 的导数，所以我们相当于有这样一个方程：

$$
-\frac{vL^2B^2}{R} = m\dot v
$$

这里 $\dot v$ 是牛顿的导数记号，表示对时间求导。

我们只需要求出 $v$ 关于时间的表达式，然后解出 $v=0$ 对应的 $t$ 就行了。

看到这个导数形式让人不由得想起了 $\e$，不妨假设 $v = C\e^{rt}$，只需解出 $C$ 和 $r$。 $C$ 很简单：当 $t=0$ 的时候 $v=v_0$，所以 $C=v_0$。

解 $r$，将 $v = C\e^{rt}$ 直接带入：

$$
-\frac{\e^{rt}L^2B^2}{R} = m r \e^{rt}
$$

解得：

$$
r = -\frac{L^2B^2}{mR}
$$

所以有：

$$
\boxed{
  v = v_0 \e^{-\frac{L^2B^2t}{mR}}
}
$$

但是指数函数永远不会变成 0，所以导体棒永远不会停下来。

有没有可能还有其它的解呢？类似前面关于 $f(x) = f'(x)$ 的解唯一的讨论，可以证明没有其它解。

### 简谐振动

又来考虑简谐震动。简谐振动中有回复力：

$$
F = -kx
$$

还有牛二：

$$
F = ma = m\ddot x
$$

设 $x = \e^{rt}$，带入可得：

$$
-k\e^{rt} = mr^2e^{rt}
$$

解得：

$$
r = \textcolor{red}{\pm} \i \sqrt\frac{k}{m}
$$

带回去：

$$
\begin{aligned}
v_1 &= \cos \left(\sqrt\frac{k}{m} t\right) \textcolor{red}{+} \i \sin \left(\sqrt\frac{k}{m} t\right) \\
v_2 &= \cos \left(\sqrt\frac{k}{m} t\right) \textcolor{red}{-} \i \sin \left(\sqrt\frac{k}{m} t\right)
\end{aligned}
$$

为什么有两个解？速度怎么还有虚部？实际上，**$v_1$ 和 $v_2$ 的所有线性组合都能满足上面的方程**，但我们应该选择符合实际情况的。

假如振幅为 $\textcolor{blue}{A}$，初相位为 $\textcolor{red}{\varphi}$。

先看怎么搞出来一个 $\textcolor{red}{\varphi}$，根据复数乘法规则（模长相乘，幅角相加），乘一个 $\cos \textcolor{red}{\varphi} + \i \sin \textcolor{red}{\varphi}$：

$$
(\cos \textcolor{red}{\varphi} + \i \sin \textcolor{red}{\varphi})v_1 =
  \cos \left(\sqrt\frac{k}{m} t + \textcolor{red}{\varphi}\right)
+ \i \sin \left(\sqrt\frac{k}{m} t + \textcolor{red}{\varphi}\right)
$$

为了能抵消掉虚部，给 $v_2$ 乘个 $\cos \textcolor{red}{\varphi} - \i \sin \textcolor{red}{\varphi}$:

$$
(\cos \textcolor{red}{\varphi} \textcolor{blue}{-} \i \sin \textcolor{red}{\varphi})v_2 =
  \cos \left(\sqrt\frac{k}{m} t + \textcolor{red}{\varphi}\right)
- \i \sin \left(\sqrt\frac{k}{m} t + \textcolor{red}{\varphi}\right)
$$

相加，再乘一个 $\frac{\textcolor{blue}{A}}{2}$ 就能得到：

$$
v = \textcolor{blue}{A}\cos \left(\sqrt\frac{k}{m} t + \textcolor{red}{\varphi}\right)
$$

所以发现简谐运动的周期：

$$
\boxed{
  T = \frac{2\pi}{\sqrt\frac{k}{m}} = 2\pi \sqrt \frac{m}{k}
}
$$

最后结果可以看出来，初相位和振幅都不影响周期。而且在前面解出 $r = \pm \i \sqrt\frac{k}{m}$ 时，你就已经可以知道 $\omega = \sqrt\frac{k}{m}$ 了，因为后面的线性操作都没法影响到 $\omega$。

### LC 振荡电路

最后我们看到 LC 振荡电路。

LC 振荡电路由一个电容和一个线圈组成。对于电容我们有：

$$
C = \frac{Q}{U_C}
$$

对于线圈，我们也有：

$$
U_L = L \dot I
$$

一条回路电压和应该为 0：

$$
U_C + U_L = 0
$$

同时我们还知道 $I$ 是 $Q$ 的导数：

$$
I = \dot Q
$$

联立得微分方程

$$
\frac{Q}{C} + L\ddot Q = 0
$$

和简谐振动那个几乎一样，解得：

$$
Q = \e^{\pm \i \sqrt{\frac{1}{LC}}}
$$

所以 LC 振荡电路的周期：

$$
\boxed{
  T = 2 \pi \sqrt{LC}
}
$$

后面不会了。

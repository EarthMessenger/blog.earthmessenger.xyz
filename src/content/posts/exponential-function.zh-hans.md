---
title: 幂
pubDate: 2025-09-13
tags: e math real-analysis calculus limits
lang: zh-hans
opencc: true
---

大量~~抄袭~~参考 [Wikipedia][wiki]，这下成搬运工了。

作为对与[导][der]的补充。

叶总说这一步不对：

> $$
> \def\x{\textcolor{red}{x}}
> 
> \begin{aligned}
> \e^{\x}
> &= \lim_{n\to \infty} \left(1 + \frac1n\right)^{n\x} \\
> &= \lim_{n\to \infty} \sum_{i=0}^{n\x} \binom{n\x}{i} \frac{1}{n^i} \\
> &= \lim_{n\to \infty} \sum_{i=0}^{n\x} \frac{\x^{i}}{i!} \\
> &= \boxed{\sum_{i=0}^{\infty}\frac{\x^i}{i!}} \\
> \end{aligned}
> $$

因为 $nx$ 并不是整数，直接展开相当于用到了广义二项式定理，就有循环论证的嫌疑了。

仔细想来，高中似乎并没有讲怎么处理实数幂次，甚至连明确的定义都没有。空中楼阁，怎么都不可能证出来的。

所以我们要从幂的定义开始研究起。

但是我不会实分析。

## Z Q

首先，当指数 $n$ 是整数的时候：

$$
b^n = \underbrace{b \times b \times b \cdots \times b}_{\text{$n$ 个 $b$}}
$$

完全可以理解。我们还有指数的乘法规则：

$$
\def\n{\textcolor{red}{n}}
\def\m{\textcolor{blue}{m}}

\begin{aligned}
b^{\n} \times b^{\m} &= \underbrace{b \times \cdots \times b}_{\text{$\n$ 个 $b$}} \times
\underbrace{b \times \cdots \times b}_{\text{$\m$ 个 $b$}} \\
&= \underbrace{b \times \cdots \times b}_{\text{$(\n + \m)$ 个 $b$}} \\
&= b^{\n + \m}
\end{aligned}
$$

当 $b \ne 0$ 时，由于 $b^0 \times b^n = b^{0+n} = b^n$，所以 $b^0 = 1$。

也容易得到 $\left(b^n\right)^m = b^{nm}$。

定义 $b^{\frac{1}{n}} = \sqrt[n]{b}$ 为**唯一的非负实数 $y$** 满足 $y^{n} = b$。

然后由 $\left(b^n\right)^m = b^{nm}$，整个有理数上的定义就很容易了。

## R

这确实是一个巨大的飞跃。一个简单的想法是，定义：

$$
\boxed{
b^{x} = \lim_{r(\in \mathbb{Q}) \to x} b^{r}
}
$$

看着就特别对😊️。

> 题外话，在做题的时候经常会遇到这种抽象函数问题 $f(x+y) = f(x)f(y)$。如果我们设 $f(1) = a$，那么可以得到在 $n \in \mathbb{Z}$ 时候，$f(n) = a^n$，然后就能容易得到 $r \in \mathbb{Q}$ 的时候 $f(r) = a^r$。
> 
> **但是**对于 $x \in \mathbb{R} \setminus \mathbb{Q}$，$f(x) = a^r$ 却不一定，除非有 $f(x)$ **连续**的条件。

好消息是还有其他定义方法。

我们定义 $\exp(x)$ 为：

$$
\boxed{
\def\x{\textcolor{red}{x}}
\exp(\x) = \lim_{n \to \infty} \left(1 + \frac{\x}{n}\right)^{n}
}
$$

可以知道 $\exp(0) = 1$，$\exp(1) = \e$。

这里指数上的 $n$ 可以理解为数列极限，当成整数，可以放心用二项式定理展😋️。

$$
\boxed{
\def\x{\textcolor{red}{x}}
\exp(\x) = \sum_{i=0}^{\infty} \frac{\x^i}{i}
}
$$

$\exp(x)$ 满足上面说的**指数乘法**规则：

$$
\def\x{\textcolor{red}{x}}
\def\y{\textcolor{blue}{y}}

\begin{aligned}
\exp(\x)\exp(\y) &= \lim_{n \to \infty} \left(1 + \frac{\x}{n}\right)^n \left(1 + \frac{\y}{n}\right)^n \\
                 &= \lim_{n \to \infty} \left(1 + \frac{\x}{n} + \frac{\y}{n} + \frac{\x\y}{n^2}\right)^n \\
\end{aligned}
$$

$\frac{xy}{n^2}$ 高端无穷小，忽略掉：

$$
\def\x{\textcolor{red}{x}}
\def\y{\textcolor{blue}{y}}

\boxed{
\begin{aligned}
\exp(\x)\exp(\y) &= \lim_{n \to \infty} \left(1 + \frac{\x + \y}{n}\right)^n \\
                 &= \exp(\x + \y) \\
\end{aligned}
}
$$

然后很容易就得到在 $x \in \mathbb{Q}$ 的时候，$\exp(x) = \e^x$。

因为：

$$
\lim_{x \to 0} \exp(x) = 1 + \frac{x}{1} + \frac{x^2}{2} + \cdots = 1
$$

所以对于一个 $x \in \mathbb{R} \setminus \mathbb{Q}$：

$$
\begin{aligned}
\exp(x) &= \lim_{r (\in \mathbb{Q}) \to x} \exp(r) \exp(r-x) \\
        &= \lim_{r (\in \mathbb{Q}) \to x} \exp(r) \\
\end{aligned}
$$

符合上面那个定义，所以我们可以认为在 $\mathbb R$ 里头，$\exp(x)$ 就是我们想要的 $\e^x$。

然后就是已经在[导][der]中已经阐述的，定义 $\ln x$ 为 $\exp(x)$ 的反函数，最终就能定义：

$$
\boxed{
b^x = \exp(x\ln b) = \e^{x\ln b}
}
$$

## C

$\e^x$ 自然能扩展到 $\mathbb C$ 上面。根据欧拉公式：

$$
e^{\i x} = \cos x + \i \sin x
$$

所以可以容易得到：

$$
\boxed{
b^{x + \i y} = b^x[\cos(y\ln b) + \i \sin(y\ln b)]
}
$$

还可以算对数：

$$
\boxed{
\ln z = \ln r + \i (\theta + 2k\pi)\quad (k \in \mathbb Z)
}
$$

其中 $r$ 是 $z$ 的模长，$\theta$ 是 $z$ 的幅角。

底数是 $\mathbb C$ 的怎么办呢？

$$
\begin{aligned}
z^{a+b\i} &= \e^{(a+b\i) \ln z} \\
          &= \e^{(a+b\i)[\ln |z| + i(\theta + 2k\pi )]} \\
          &= \e^{a\ln r - b\theta - 2bk\pi  + \i(b\ln r + a\theta + 2ak\pi)} \\
          &= r^a \e^{-2bk\pi - b\theta} [\cos(b\ln r + a\theta + 2ak\pi) + \i \sin(b\ln r + a\theta + 2ak\pi)] \\
\end{aligned}
$$

太恶心了🤮，什么都有多解。不好玩。

[der]: /posts/high-school-calculus
[wiki]: https://en.wikipedia.org/wiki/Exponentiation

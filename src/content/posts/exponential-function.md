---
title: 冪
tags: e math real-analysis calculus limits
pubDate: 2025-09-08
lang: zh-hant
---

大量~~抄襲~~參考 [Wikipedia][wiki]，這下成搬運工了。

作爲對與[導][der]的補充。

葉總說這一步不對：

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

因爲 $nx$ 並不是整數，直接展開相當於用到了廣義二項式定理，就有循環論證的嫌疑了。

仔細想來，高中似乎並沒有講怎麼處理實數冪次，甚至連明確的定義都沒有。空中樓閣，怎麼都不可能證出來的。

所以我們要從冪的定義開始研究起。

但是我不會實分析。

## Z Q

首先，當指數 $n$ 是整數的時候：

$$
b^n = \underbrace{b \times b \times b \cdots \times b}_{\text{$n$ 個 $b$}}
$$

完全可以理解。我們還有指數的乘法規則：

$$
\def\n{\textcolor{red}{n}}
\def\m{\textcolor{blue}{m}}

\begin{aligned}
b^{\n} \times b^{\m} &= \underbrace{b \times \cdots \times b}_{\text{$\n$ 個 $b$}} \times
\underbrace{b \times \cdots \times b}_{\text{$\m$ 個 $b$}} \\
&= \underbrace{b \times \cdots \times b}_{\text{$(\n + \m)$ 個 $b$}} \\
&= b^{\n + \m}
\end{aligned}
$$

當 $b \ne 0$ 時，由於 $b^0 \times b^n = b^{0+n} = b^n$，所以 $b^0 = 1$。

也容易得到 $\left(b^n\right)^m = b^{nm}$。

定義 $b^{\frac{1}{n}} = \sqrt[n]{b}$ 爲**唯一的非負實數 $y$** 滿足 $y^{n} = b$。

然後由 $\left(b^n\right)^m = b^{nm}$，整個有理數上的定義就很容易了。

## R

這確實是一個巨大的飛躍。一個簡單的想法是，定義：

$$
\boxed{
b^{x} = \lim_{r(\in \mathbb{Q}) \to x} b^{r}
}
$$

看着就特別對😊️。

> 題外話，在做題的時候經常會遇到這種抽象函數問題 $f(x+y) = f(x)f(y)$。如果我們設 $f(1) = a$，那麼可以得到在 $n \in \mathbb{Z}$ 時候，$f(n) = a^n$，然後就能容易得到 $r \in \mathbb{Q}$ 的時候 $f(r) = a^r$。
> 
> **但是**對於 $x \in \mathbb{R} \setminus \mathbb{Q}$，$f(x) = a^r$ 卻不一定，除非有 $f(x)$ **連續**的條件。

好消息是還有其他定義方法。

我們定義 $\exp(x)$ 爲：

$$
\boxed{
\def\x{\textcolor{red}{x}}
\exp(\x) = \lim_{n \to \infty} \left(1 + \frac{\x}{n}\right)^{n}
}
$$

可以知道 $\exp(0) = 1$，$\exp(1) = \e$。

這裏指數上的 $n$ 可以理解爲數列極限，當成整數，可以放心用二項式定理展😋️。

$$
\boxed{
\def\x{\textcolor{red}{x}}
\exp(\x) = \sum_{i=0}^{\infty} \frac{\x^i}{i}
}
$$

$\exp(x)$ 滿足上面說的**指數乘法**規則：

$$
\def\x{\textcolor{red}{x}}
\def\y{\textcolor{blue}{y}}

\begin{aligned}
\exp(\x)\exp(\y) &= \lim_{n \to \infty} \left(1 + \frac{\x}{n}\right)^n \left(1 + \frac{\y}{n}\right)^n \\
                 &= \lim_{n \to \infty} \left(1 + \frac{\x}{n} + \frac{\y}{n} + \frac{\x\y}{n^2}\right)^n \\
\end{aligned}
$$

$\frac{xy}{n^2}$ 高階無窮小，忽略掉：

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

然後很容易就得到在 $x \in \mathbb{Q}$ 的時候，$\exp(x) = \e^x$。

因爲：

$$
\lim_{x \to 0} \exp(x) = 1 + \frac{x}{1} + \frac{x^2}{2} + \cdots = 1
$$

所以對於一個 $x \in \mathbb{R} \setminus \mathbb{Q}$：

$$
\begin{aligned}
\exp(x) &= \lim_{r (\in \mathbb{Q}) \to x} \exp(r) \exp(r-x) \\
        &= \lim_{r (\in \mathbb{Q}) \to x} \exp(r) \\
\end{aligned}
$$

符合上面那個定義，所以我們可以認爲在 $\mathbb R$ 裏頭，$\exp(x)$ 就是我們想要的 $\e^x$。

然後就是已經在[導][der]中已經闡述的，定義 $\ln x$ 爲 $\exp(x)$ 的反函數，最終就能定義：

$$
\boxed{
b^x = \exp(x\ln b) = \e^{x\ln b}
}
$$

## C

$\e^x$ 自然能擴展到 $\mathbb C$ 上面。根據歐拉公式：

$$
e^{\i x} = \cos x + \i \sin x
$$

所以可以容易得到：

$$
\boxed{
b^{x + \i y} = b^x[\cos(y\ln b) + \i \sin(y\ln b)]
}
$$

還可以算對數：

$$
\boxed{
\ln z = \ln r + \i (\theta + 2k\pi)\quad (k \in \mathbb N)
}
$$

其中 $r$ 是 $z$ 的模長，$\theta$ 是 $z$ 的幅角。

底數是 $\mathbb C$ 的怎麼辦呢？

$$
\begin{aligned}
z^{a+b\i} &= \e^{(a+b\i) \ln z} \\
          &= \e^{(a+b\i)[\ln |z| + i(\theta + 2k\pi )]} \\
          &= \e^{a\ln r - b\theta - 2bk\pi  + \i(b\ln r + a\theta + 2ak\pi)} \\
          &= r^a \e^{-2bk\pi - b\theta} [\cos(b\ln r + a\theta + 2ak\pi) + \i \sin(b\ln r + a\theta + 2ak\pi)] \\
\end{aligned}
$$

太噁心了🤮，什麼都有多解。不好玩。

[der]: /posts/high-school-calculus
[wiki]: https://en.wikipedia.org/wiki/Exponentiation

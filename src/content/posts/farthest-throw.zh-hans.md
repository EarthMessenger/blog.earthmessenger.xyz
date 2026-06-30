---
title: 斜抛运动最远
pubDate: 2024-08-14
tags: physics whk
lang: zh-hans
opencc: true
---

从高度为 h 的位置，以初速度 v 丢出一球，沿什么仰角才能让落点距离 x 最远？如图：

![](../../assets/posts/farthest-throw/farthest-throw.svg)

## 做法 1

直接爆算。

- 水平方向位移：$x = v\cos\theta\,t$
- 竖直方向位移：$y = v\sin\theta\,t - \frac{1}{2}gt^2 = -h$

随便联立一下，把 t 给消掉：

$$
-h = v\sin\theta\,\frac{x}{v\cos\theta} - \frac{1}{2}g\left(\frac{x}{v\cos\theta}\right)^2
$$

整理得：

$$
-h = x\tan\theta - \frac{gx^2}{2v^2}\frac{1}{\cos^2\theta}
$$

由 $\frac{1}{\cos^2\theta} = \frac{\sin^2\theta+\cos^2\theta}{\cos^2\theta} =
\tan^2\theta+1$，得到三角函数仅有 $\tan\theta$ 的式子：

$$
-h = x\tan\theta - \frac{gx^2}{2v^2}(\tan^2\theta+1)
$$

欲求 x 最大值，考虑关于 $\tan\theta$ 二次方程之 $\Delta$：

$$
\begin{aligned}
\Delta &= x^2 - 4\left(-\frac{gx^2}{2v^2}\right)\left(-\frac{gx^2}{2v^2}+h\right) \\
       &= -\frac{g^2}{v^4}x^4 + \left(\frac{2gh}{v^2}+1\right)x^2 \ge 0\\
\end{aligned}
$$

解得：

$$
x^2 \le \frac{2ghv^2+v^4}{g^2}
$$

即：

$$
|x| \le \frac{v}{g}\sqrt{2gh+v^2}
$$

计算太难。

## 做法 2

注意到无论向什么方向发射，最后落至地面时，速度的大小是一样的，因为机械能守恒。

可求出最后的速度 vt：

$$
\begin{aligned}
\frac{1}{2}mv^2+mgh &= \frac{1}{2}mv_{t}^2 \\
v_{t} &= \sqrt{v^2+2gh}
\end{aligned}
$$

考察这个 vt 和 v 以及 v-vt 构成的矢量三角形：

![](../../assets/posts/farthest-throw/vector-triangle.svg)

注意到要求的 $x = v\cos\theta\,t$。倘若为其乘上一个 $g$，即 $v\cos\theta\,gt$，
恰好为此矢量三角形之面积两倍，所以求此面积最值，即可得答案。

必刷题上是设 vt 与 v 夹角为 α，正弦定理有：

$$
\begin{aligned}
\frac{gt}{\sin\alpha} &= \frac{v_{t}}{\sin(\pi/2-\theta)} \\
gt\cos\theta &= v_{t}\sin\alpha
\end{aligned}
$$

所以：

$$
\begin{aligned}
x &= \frac{v\cos\theta\,gt}{g} \\
  &= \frac{v v_{t} \sin\alpha}{g} \\
  &\le \frac{v v_{t}}{g}
\end{aligned}
$$

妙哉！

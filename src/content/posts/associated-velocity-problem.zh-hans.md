---
title: 关联速度问题
pubDate: 2024-03-10
tags: whk
lang: zh-hans
opencc: true
---

高中物理关联速度问题是类似这种这样的问题：

![](/assets/images/avp-0d8fc566.svg)

用一个绳子经过一个定滑轮 $A$ 拉一个固定在一条杆子上的质点 $P$，给定拉绳子的速度
$v_{1}$ 和绳子与杆子形成的夹角 $\theta$，求质点 $P$ 运动速度 $v_{2}$。

---

一般做法是将 $v_{2}$ 分解成平行于绳子的速度 $v_{\parallel}$ 和垂直与绳子的速度
$v_{\bot}$，得到 $v_{\parallel} = v_{1}$，又由于这个几何关系推出 $v_{2}\cos
\theta=v_{\parallel}$，然后求得答案。

然而我确实不太理解为什么分解后刚好有 $v_{\parallel}=v_{1}$，感觉很疑惑。

有一个比较数学的推导方法：

由于 $\angle AOP$ 是直角，所以，$\triangle OPA$ 满足：$OP^2+OA^2=AP^2$

为了方便，不妨设 $OA=h$，$OP=x$，$AP=l$，即：

$$
h^2+x^2=l^2
$$

考虑在 $\Delta t$ 的时间内 $P$ 移动了 $\Delta x$，同时绳子收缩了 $\Delta l$，
有：

$$
\begin{aligned}
h^2+(x-\Delta x)^2 &= (l-\Delta l)^2 \\
h^2+x^2+(\Delta x)^2-2x(\Delta x) &= l^2+(\Delta l)^2-2l(\Delta l) \\
\end{aligned}
$$

由于前面的 $h^2+x^2=l^2$，故：

$$
(\Delta x)^2-2x(\Delta x) = (\Delta l)^2 - 2l(\Delta l)
$$

当 $\Delta t \to 0$ 的时候，忽略掉高端无穷小的 $(\Delta x)^2$ 和 $(\Delta l)^2$：

$$
2x(\Delta x) = 2l(\Delta l)
$$

两边同时除以 $2\Delta t$，得：

$$
xv_{2} = lv_{1}
$$

因为几何关系，有 $x=l\cos\theta$，故：

$$
v_{2}\cos\theta = v_{1}
$$

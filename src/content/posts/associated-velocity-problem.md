---
title: 關聯速度問題
tags: whk
pubDate: 2024-03-10
---

高中物理關聯速度問題是類似這種這樣的問題：

![](/assets/images/avp-0d8fc566.svg)

用一個繩子經過一個定滑輪 $A$ 拉一個固定在一條杆子上的質點 $P$，給定拉繩子的速度
$v_{1}$ 和 繩子與杆子形成的夾角 $\theta$，求質點 $P$ 運動速度 $v_{2}$。

---

一般做法是將 $v_{2}$ 分解成平行於繩子的速度 $v_{\parallel}$ 和垂直與繩子的速度
$v_{\bot}$，得到 $v_{\parallel} = v_{1}$，又由於這個幾何關係推出 $v_{2}\cos
\theta=v_{\parallel}$，然後求得答案。

然而我確實不太理解爲什麼分解後剛好有 $v_{\parallel}=v_{1}$，感覺很疑惑。

有一個比較數學的推導方法：

由於 $\angle AOP$ 是直角，所以，$\triangle OPA$ 滿足：$OP^2+OA^2=AP^2$

爲了方便，不妨設 $OA=h$，$OP=x$，AP=$l$，即：

$$
h^2+x^2=l^2
$$

考慮在 $\Delta t$ 的時間內 $P$ 移動了 $\Delta x$，同時繩子收縮了 $\Delta l$，
有：

$$
\begin{aligned}
h^2+(x-\Delta x)^2 &= (l-\Delta l)^2 \\
h^2+x^2+(\Delta x)^2-2x(\Delta x) &= l^2+(\Delta l)^2-2l(\Delta l) \\
\end{aligned}
$$

由於前面的 $h^2+x^2=l^2$，故：

$$
(\Delta x)^2-2x(\Delta x) = (\Delta l)^2 - 2l(\Delta l)
$$

當 $\Delta t \to 0$ 的時候，忽略掉高階無窮小的 $(\Delta x)^2$ 和 $(\Delta l)^2$：

$$
2x(\Delta x) = 2l(\Delta l)
$$

兩邊同時除以 $2\Delta t$，得：

$$
xv_{2} = lv_{1}
$$

因爲幾何關係，有 $x=l\cos\theta$，故：

$$
v_{2}\cos\theta = v_{1}
$$

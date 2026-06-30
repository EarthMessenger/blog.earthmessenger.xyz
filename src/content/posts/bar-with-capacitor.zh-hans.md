---
title: 有电容有外力单杆
pubDate: 2026-03-07
tags: math whk physics
lang: zh-hans
opencc: true
---

## 典

经典的有电容有外力单杆：

![有电容有外力单杆](../../assets/posts/bar-with-capacitor/problem.svg)

PS：图是 Gemini 画的，直接输出 Typst 代码。感觉加训 pelican riding a bicycle 有效果。

很容易列出几个方程：

$$
\begin{gather*}
Ft - ILBt = mv - 0 \\
It = q \\
E = vBL \\
C = \frac{q}{U} \\
I = \frac{E - U}{R} \\
\end{gather*}
$$

我去，这怎么做。

还好，高中只会考 $R = 0$ 的情况。由于电阻是 $0$，所以能**瞬间**达到稳态。于是可以认为 $E = U$。

但是 $I = \frac{E - U}{R}$ 是什么？这下子成 $0/0$ 未定式了。先不管它。

那：

$$
It = q = CU = CvBL
$$

于是：

$$
\begin{gather*}
Ft - CvB^2L^2 = mv \\
v = \frac{Ft}{m + CB^2L^2} \\
\end{gather*}
$$

好吧，求出速度了。然后其它的都可以求了，比如 $I = \dot{q} = CaBL = \frac{FCBL}{m + CB^2L^2}$。

## 干

可是某同学不太能理解电阻为 $0$，凭什么就瞬间稳态，所以他想出来可以先求解电阻 $R$ 不为 $0$ 的情况，再分析 $R \to 0$ 的极限。

先消元，把 $v$ 用 $q$ 表示：

$$
\begin{align*}
I = \dot q &= \frac{vBL - \frac{q}{C}}{R} \\
v &= \frac{\dot q R + \frac{q}{C}}{BL} \\
\end{align*}
$$

带回动量守恒：

$$
\begin{align*}
Ft - qLB &= mv \\
Ft - qLB &= m \frac{\dot q R + \frac{q}{C}}{BL} \\
\frac{mR}{LB} \dot q + \left( \frac{m}{LBC} + LB \right)q - Ft &= 0 \\
\end{align*}
$$

只用把 $q$ 解出来就行了。

## 解

姜萍会偏微分方程，而这是一个简单的一阶常系数不齐次微分方程。

为了让式子不要太乱，我们其实就相当于解：

$$
A \dot q + B q = F t
$$

某同学于是找物理竞赛同学借了一本《高等数学》，仔细研读了一节晚自习。

众所周知，解不齐次微分方程只需要用一个**特解**叠加上齐次方程的**通解**。

先来看通解，这个在 [导][high-school-calculus] 中有介绍。即先把 $Ft$ 当成 $0$：

[high-school-calculus]: /posts/high-school-calculus#微分方程

$$
A \dot q + B q = 0
$$

解得 $q_h(t) = C_0\e^{-\frac{B}{A}t}$

然后只需要找一个特解，我们使用待定系数法，因为 $Ft$ 关于 $t$ 是一次的，所以应该假设 $q_p(t) = b_0 t + b_1$。带入：

$$
\begin{align*}
A b_0 + B (b_0 t + b_1) &= F t \\
(B b_0 - F) t + A b_0 + B b_1 &= 0 \\
\end{align*}
$$

故解得：

$$
\begin{cases}
b_0 = \frac{F}{B} \\
b_1 = -\frac{AF}{B^2} \\
\end{cases}
$$

即特解：$q_p(t) = \frac{F}{B} t - \frac{AF}{B^2}$。

然后叠加。

$$
\begin{align*}
q(t) &= q_p(t) + q_h(t) \\
     &= \frac{F}{B}t - \frac{AF}{B^2} + C_0 \e^{-\frac{B}{A}t}\\
\end{align*}
$$

要满足初始条件 $q(0) = 0$：

$$
q(0) = - \frac{AF}{B^2} + C_0 = 0
$$

故 $C_0 = \frac{AF}{B^2}$。

最后带回来，这里 $A = \frac{mR}{LB}, B = \frac{m}{LBC} + LB$：

$$
q = \frac{F}{\frac{m}{LBC} + LB} t + \frac{\frac{mR}{LB} F}{\left( \frac{m}{LBC} + LB \right)^2}\left( \e^{-\frac{\frac{m}{LBC} + LB}{\frac{mR}{LB}} t} - 1 \right)
$$

停停停。我们虽然是解出来了，但是这个有点太丑了。不过可以看出，当 $R=0$ 时，后面项就是 $0$，于是 $q = \frac{FLB}{m + L^2B^2C}t$ 很合理，也和上面推出来的吻合。

## 等

其实电容和杆子是有惊人的相似性的。

再看一眼动量守恒的式子：

$$
Ft - ILBt = mv - 0
$$

我们不妨把 $ILBt = qLB$ 当作电容的动量，这样刚好动量守恒：$Ft = mv + qLB$。

既然这样，不如假设电容有「等效质量」$M$ 和「等效速度」$u$，那么：

$$
Mu = qLB
$$

为了让这个等效的质量速度有和谐美好的性质，$M$ 和 $u$ 可不能随便乱取，最好还要满足能量守恒：

$$
\frac12 Mu^2 = \frac12 CU^2 = \frac12 \frac{q^2}{C}
$$

于是解得：

$$
\begin{cases}
M = L^2B^2C \\
u = \frac{q}{LBC} \\
\end{cases}
$$

豁然开朗啊。这个 $M = L^2B^2C$ 似曾相识。

甚至当 $u = v$ 的时候，相当于：

$$
\begin{align*}
\frac{q}{LBC} &= v \\
\frac{q}{C} &= vBL \\
\end{align*}
$$

恰好是稳态条件。所以下次再遇到一个电容加一个带初速度的杆子的时候，可以直接写出最终稳态时杆子速度 $v = \frac{mv_0}{m + L^2B^2C}$。

### 例

感谢成都七中二诊仿真考试供题。

如图所示，在水平面内有间距为 $d$ 的两根导轨平行放置。每根导轨由两段光滑的直金属杆组成，连接点 $O_1, O_2$ 分别由一小段绝缘材料平滑连接。在整个导轨区域存在竖直向上的匀强磁场，磁感应强度为 $B$。在靠近 $A_1 A_2$ 处静止放置一根金属棒，$B_1, B_2$ 之间连接有电感为 $L$ 的线圈，$A_1, A_2$ 之间连接有电容值为 $C$ 的电容和阻值为 $R$ 的电阻。电容带有初始电量 $Q_0$，靠近 $A_2$ 的极板带正电。除电阻 $R$ 外，所有的导轨、金属棒和组件的电阻均忽略不计。导轨连接处的绝缘材料不会对金属棒的运动产生干扰。$O_1, O_2$ 左右两边的导轨均足够长。现闭合开关 S，金属棒开始运动。已知金属棒质量为 $m$（线圈中产生的自感电动势大小为 $E = L \frac{\Delta I}{\Delta t}$，简谐振动的周期为 $2\pi \sqrt{\frac{m}{k'}}$）。

1. 求金属棒第一次在 $O_1 A_1 A_2 O_2$ 区域达到稳定状态的速度；
2. 求金属棒第一次经过 $O_1 O_2$ 到下一次经过 $O_1 O_2$ 经历的时间；
3. 若有 $\frac{B^2 d^2 C}{m} = k > 1$，求金属杆第 $n$ 次经过 $O_1 O_2$ 时，电阻上消耗的总热量占电容初始储存能量的比例，用 $k$ 表示。

图大概：

```
          O1
  A1 +-----*----------+ B1
     |    |           |
   S \ .. | ......... |
     | .. | ......... $
   R # .. | ......... $ L
     | .. | ......... $
   C = .. | ......... | 
     |    |           |
  A2 +-----*----------+ B2
          O2
```

第一问口算 $v_0 = \frac{Q_0dB}{m + d^2B^2C}$。

第二问主要是注意到右边没有电阻，所以 $vBd = L\dot I$，积分就是 $xBd = LI$，所以 $I = \frac{xBd}{L}$，安培力 $F = \frac{xB^2d^2}{L}$，可以等效于弹簧振子。

第三问，出题老师这个 $\frac{B^2 d^2 C}{m} = k > 1$ 体现他深谙以上电容等效的道理。容易发现杆子的运动相当于每次在左侧与电容发生**完全非弹性碰撞**，然后在右侧**速度反向**。

假设在左侧的时候电容杆子速度共为 $v$，则去右侧后回来就是 $v' = \frac{kmv - mv}{km + m} = \frac{k-1}{k+1}v$，公比 $q = \frac{k-1}{k+1}$ 这就出来了，后面的随便做。

## RC

考虑一个简单的 RC 串联电路。电容初始有 $q_0$ 的电荷量。可以列方程：

$$
\begin{gather*}
I = \frac{U}{R} \\
C = \frac{q}{U} \\
I = - \dot q \\
\end{gather*}
$$

于是：

$$
\dot q + \frac{1}{RC} q = 0
$$

然后很显然可以看出。

$$
q = q_0 \e^{-\frac{1}{RC}t}
$$

令 $\tau = RC$，量纲分析这个 $\tau$ 就是一个时间。$\tau$ 很有意义，比如 $q(\tau) = \frac{1}{\e} q_0$，恰好是电荷量变成初始 $\frac{1}{\e}$ 的时候。

好吧，更大的意义是就可以把上面 $q$ 写成：

$$
q = q_0 \e^{-\frac{t}{\tau}}
$$

由此可见，理论上 RC 串联电路永远不会达到稳态。

## 简

我们现在可以来通过设一些比较有意义的常数把上面的 $q$ 化简了。就按照上面的，令：

$$
\begin{gather*}
M = L^2B^2C \\
u = \frac{q}{LBC} \\
\end{gather*}
$$

那么

$$
\begin{align*}
q &= \frac{F}{\frac{m}{LBC} + LB} t + \frac{\frac{mR}{LB} F}{\left( \frac{m}{LBC} + LB \right)^2}\left( \e^{-\frac{\frac{m}{LBC} + LB}{\frac{mR}{LB}} t} - 1 \right) \\
  &= \frac{FLBC}{m + M}t + \frac{mRLBC^2F}{(m+M)^2}(\e^{-\frac{m + M}{mRC}t} - 1) \\
\end{align*}
$$

不妨令 $\tau = \frac{mRC}{m + M}$：

$$
\begin{align*}
q &= \frac{LBCF}{m + M}t + \frac{LBCF\tau}{m+M}(\e^{-\frac{t}{\tau}} - 1) \\
  &= LBC\left( \frac{F}{m + M}t + \frac{F\tau}{m+M}(\e^{-\frac{t}{\tau}} - 1) \right) \\
\end{align*}
$$

那么：

$$
\begin{align*}
u &= \frac{q}{LBC} \\
  &= \frac{F}{m + M} \left( t + \tau(\e^{-\frac{t}{\tau}} - 1) \right) \\
\end{align*}
$$

回过来求 $v$。别忘了，我们可以直接动量守恒：

$$
\begin{gather*}
mv + Mu = Ft \\
\begin{align*}
v &= \frac{Ft - Mu}{m} \\
  &= \frac{Ft - M\frac{F}{m + M} \left( t + \tau(\e^{-\frac{t}{\tau}} - 1) \right)}{m} \\
  &= \frac{F}{m + M}\left(t - \frac{M}{m}\tau\left(\e^{-\frac{t}{\tau}} - 1\right)\right) \\
\end{align*}
\end{gather*}
$$

好吧，其实挺美观的，不是吗。

那时间跟质量乘除有什么直观物理意义呢？不知道，也许让式子美观就是它的意义。

---
title: 導
pubDate: 2025-08-30
tags: math calculus whk e 
lang: zh-hant
---

高中可能講了，但是高中講了不太可能。

## 萊布尼茨記法

高中一般都喜歡用**拉格朗日記法**來表示導數（如 $f'$ 這種），但是有一個弊端是不好表示自變量和因變量。而**萊布尼茨記法**就能更好地展現變量之間的關係。

比如 f 的關於 x 的一階導寫作：$\frac{\d f}{\d x}$，二階導：$\frac{\d^2 f}{\d x^2}$，三階導：$\frac{\d^3 f}{\d x^3}$。

這裏的 $\frac{\d f}{\d x}$ 其實就相當於 $\lim_{\Delta x \to 0} \frac{\Delta f}{\Delta x}$ 的簡寫，因此在運算中可以像分數那樣操作。

如鏈式法則，將 $f[g(x)]$ 對 $x$ 求導：

$$
\boxed{
  \frac{\d f}{\d x} = \frac{\d f}{\d g} \cdot \frac{\d g}{\d x}
}
$$

又比如 $y = f(x)$，則很顯然可以看出：

$$
\boxed{
  \frac{\d x}{\d y} \cdot \frac{\d y}{\d x} = 1
}
$$

這是反函數求導法則。

## e

> 假如說你有 100 元，存到某銀行，1 年之後利率 100%，那麼一年之後你就有 200 元。
>
> 但是若能分 2 次結算利率，每次利率 $\frac12$，則兩次結算利率之後，就能得到 $100 \times \left(1 + \frac12\right)^2 = 225$ 元。
> 
> 如果能分 3 次結算利率，每次利率 $\frac13$，則最後能得到 $100 \times \left(1 + \frac13\right)^3 \approx 237$ 元。
>
> 好像越來越多了，那麼當結算利率的次數無限多，最終收益就會變成：
>
> $$
> \lim_{n \to \infty} 100\left(1 + \frac1n\right)^n = 100\e
> $$

這就是 $\e$ 最早、最經典的定義就是用極限：

$$
\boxed{
  \e = \lim_{n\to \infty} \left(1 + \frac1n\right)^n
}
$$

高中教材中曾經可能有這個定義，但是現在刪掉了。

此外，我們可以用均值不等式證明數列 $\left(1 + \frac1n\right)^n$ 單調遞增：

$$
\left(1 + \frac1n\right)^n 
= \textcolor{red}{1} \cdot \textcolor{blue}{\left(1 + \frac1n\right)}^n 
< \left(\frac{\textcolor{red}{1} + n \textcolor{blue}{\left(1 + \frac{1}{n}\right)}}{n + 1}\right)^{n+1} 
= \left(1 + \frac{1}{n+1}\right)^{n+1}
$$

高中都學過二項式定理，我們把這個 $\e$ 的表達式展開：

$$
\begin{aligned}
\e &= \lim_{n\to \infty} \left(1 + \frac1n\right)^n \\
   &= \lim_{n\to \infty} \sum_{i=0}^{n}\binom{n}{i} \frac{1}{n^i} \\
   &= \lim_{n\to \infty} \sum_{i=0}^{n} \frac{n^{\underline i}}{i!} \frac{1}{n^i} \\
\end{aligned}
$$

這裏 $n^{\underline i}$ 是 $n$ 的 $i$ 次下降冪的意思。當 $n\to \infty$ 的時候，可以認爲 $n^{\underline i} = n^i$，於是就有：

$$
\boxed{
  \e = \sum_{i=0}^{\infty}\frac{1}{i!}
}
$$

看到 $\e$ 不由自主想要求冪，還是類似上面的推導：

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

證明 $\e^x$ 的導數等於其自身：

$$
\begin{aligned}
\left(\e^x\right)' 
&= \lim_{\Delta x \to 0} \frac{\e^{x + \Delta x} - \e^x}{\Delta x} \\
&= \e^x\lim_{\Delta x \to 0} \frac{\e^{\Delta x} - 1}{\Delta x} \\
\end{aligned}
$$

把 $\e^{\Delta x}$ 展開：

$$
\e^x \lim_{\Delta x \to 0} \frac{\textcolor{red}{1 + \frac{\Delta x}{1!} + \frac{\Delta x^2}{2!} + \cdots} - 1}{\Delta x}
$$

高階無窮小丟掉，就是：


$$
\e^x \lim_{\Delta x \to 0} \frac{1 + \Delta x - 1}{\Delta x} = \e^x
$$

從而我們就證明了 $\boxed{(\e^x)' = \e^x}$。

定義 $\ln x$ 爲 $\e^x$ 的反函數。要給 $\ln x$ 求導，不妨令 $y = \ln x$，也有 $x = \e^y$。

$$
\begin{aligned}
\frac{\d y}{\d x}
&= \frac{1}{\frac{\d x}{\d y}} \\
&= \frac{1}{\e^y} \\
&= \frac{1}{x} \\
\end{aligned}
$$

由此就證明了 $\boxed{(\ln x)' = \frac{1}{x}}$。

$\e$ **太偉大了**。現在我們可以來求 $x^n$ 的導數，但是這個其實不好搞，我們先對他取個對數再 $\exp$。

$$
\begin{aligned}
(x^n)' &= (\e^{n \ln x})' \\
       &= (n\ln x)' \cdot \e^{n \ln x} \\
       &= \frac{n}{x} \cdot x^{n} \\
       &= nx^{n-1} \\
\end{aligned}
$$

並沒有用到廣義二項式定理。

可以求 $a^x$ 的導數：

$$
\begin{aligned}
(a^x)' &= (\e^{x \ln a})' \\
       &= (x \ln a)' \cdot \e^{x \ln a} \\
       &= a^{x}\ln a \\
\end{aligned}
$$

甚至還可以求 $f^g$ 的導數：

$$
\begin{aligned}
(f^g)' &= (\e^{g\ln f})' \\
       &= \left(g'\ln f + \frac{g}{f}f'\right)f^g
\end{aligned}
$$

天不生 $\e^x$，萬古如長夜。

## 洛必達法則

由於是高中，不用討論函數能不能導問題。

先從一個很顯然的東西出發。

**羅爾定理**：若函數 $f(x)$ 滿足 $f(a) = f(b)$，則 $\exists c \in (a, b)$ s.t. $f'(c) = 0$。

假如說 $f(x)$ 是常函數，那麼顯然有導數爲 0 的地方。

否則，$f(x)$ 中間一定有最大值或者最小值，不妨假設有最大值 $f(x_0)$。則 $x_0$ 左側導數：

$$
\lim_{\Delta x \to 0} \frac{f(x - \Delta x) - f(x)}{-\Delta x} \ge 0
$$

右側導數：

$$
\lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x} \le 0
$$

這兩個導數要相等，所以在 $x_0$ 處的導數應該爲 0。

這個是 $f(a) = f(b)$ 的情況，那麼如果 $f(a) \ne f(b)$ 該怎麼辦呢。一個簡單的思路是把 $f(x)$ 減去過 $(a, f(a))$，$(b, f(b))$ 的直線，即 $y = \frac{f(b)-f(a)}{b-a}(x-a) + f(a)$。這樣就轉化成了羅爾定理的情況。

令 $g(x) = f(x) - \frac{f(b)-f(a)}{b-a}(x-a) - f(a)$，根據羅爾定理，這個函數在 $(a, b)$ 之間也有導數爲 0 的地方。對 $g(x)$ 求導，得：

$$
g'(c) = f'(c) - \frac{f(b)-f(a)}{b-a} = 0
$$

即：

$$
f'(c) = \frac{f(b)-f(a)}{b-a}
$$

這就是**拉格朗日中值定理**。

直觀來看中值定理，說的就是**平面上固定兩點的可微曲線，一定存在一點使得這點的切線斜率和兩端點之間的斜率相同**。

若這個線甚至不是函數，而是類似 $(f(t), g(t))$ 描述的曲線，類似的結論呢？

首先我們要知道這種曲線怎麼求切線斜率，類比求導：

$$
\begin{aligned}
k &= \lim_{\Delta t \to 0} \frac{g(t + \Delta t) - g(t)}{f(t + \Delta t) - f(t)} \\
  &= \lim_{\Delta t \to 0} \frac{g(t + \Delta t) - g(t)}{\Delta t} \cdot \frac{\Delta t}{f(t + \Delta t) - f(t)} \\
  &= \frac{g'(x)}{f'(x)} \\
\end{aligned}
$$

即我們希望證明 $(a, b)$ 之間存在一點 $c$，使得 $\frac{g'(c)}{f'(c)} = \frac{g(b)-g(a)}{f(b)-f(a)}$。

類比拉格朗日中值定理的證法，搞一條過 $(f(a), g(a))$ 和 $(f(b), g(b))$ 的直線，然後相減。即構造：

$$
h(t) = g(t) - \frac{g(b)-g(a)}{f(b)-f(a)}(f(t)-f(a)) - g(a)
$$

$h(a)$ 和 $h(b)$ 都爲 0，套用羅爾定理，存在 $c \in (a, b)$：

$$
h'(c) = g'(c) - \frac{g(b)-g(a)}{f(b)-f(a)}f'(c) = 0
$$

即：

$$
\frac{g'(c)}{f'(c)} = \frac{g(b)-g(a)}{f(b)-f(a)}
$$

當然，有分數不太好，因爲很可能出現分母爲 0 的情況，即斜率不存在。我們還是最好全部化成乘積形式：

$$
g'(c)(f(b)-f(a)) = f'(c)(g(b)-g(a))
$$

這是**柯西中值定理**。

柯西中值定理的形式讓人想起洛必達法則。現在我們要求 $\lim_{x\to a}\frac{f(x)}{g(x)}$，但是 $f(a) = g(a) = 0$。

對於任意一個 $b > a$，根據柯西中值定理，我們知道在 $(a, b)$ 中存在一點 $c$ 滿足：

$$
\frac{f'(c)}{g'(c)} = \frac{f(b) - f(a)}{g(b) - g(a)} = \frac{f(b)}{g(b)}
$$

當 $b \to a$，也有 $c \to a$。所以就有：

$$
\boxed{
  \lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x\to a} \frac{f'(x)}{g'(x)}
}
$$

## 泰勒級數

<del>退役 OIer 還不會泰勒展開正常嗎？但是我就是不會。</del>

我們希望用一個多項式函數去逼近一個複雜函數。具體來說，我們設我們要逼近的函數 $f(x)$ 可以用 $(x-a)$ 爲基底的無窮次多項式表示：

$$
f(x) = c_0 + c_1(x-a) + c_2(x-a)^2 + c_3(x-a)^3 + \cdots
$$

其中 $c_i$ 是待定的 $i$ 次項係數。

爲了逼近，首先在 $x=a$ 處式子左右兩邊一定要相等：

$$
f(a) = c_0 + c_1(a-a) + 2c_2(a-a) + 3c_3(a-a)^2 + \cdots
$$

這樣就得到了 $c_0$。

繼續，在 $x=a$ 處不但要相等，我們還希望他們的一階導數也要相等：

$$
f'(a) = c_1 + 2c_2(a-a) + 3c_3(a-a)^2 + 4c_4(a-a)^3 + \cdots
$$

於是 $c_1 = f'(a)$。

二階導：

$$
f''(a) = 2c_2 + 6c_3(a-a) + 12(a-a)^2 + 20(a-a)^3 + \cdots \Rightarrow c_2 = \frac{f''(a)}{2}
$$

……

規律不言自明了：$c_{i} = \frac{f^{(i)}(a)}{i!}$，這裏 $f^{(i)}(a)$ 是 $f(x)$ 的 $i$ 階導在 $x=a$ 處的值。

也可以寫作：

$$
\boxed{
  f(x) = \sum_{i=0}^{\infty} \frac{f^{(i)}(a)}{i!} (x-a)^i
}
$$

特別地，當 $a=0$ 的時候，是**馬克勞林級數**：

$$
\boxed{
  f(x) = \sum_{i=0}^{\infty} \frac{f^{(i)}(0)}{i!} x^i
}
$$

來試試把一些常用函數給泰勒展開一下：

首先是 $\e^x$，由於其任意次導數均爲 $\e^x$，而 $\e^{0} = 1$，則可以容易得到：

$$
\boxed{
  \e^{x} = 1 + x + \frac{x^2}{2} + \frac{x^3}{3!} + \cdots + \frac{x^n}{n!} + \cdots
}
$$

和上面我們推的吻合。

然後來試試 $\sin x$。$\sin x$ 的導數有週期性，分別是 $\sin x, \cos x, -\sin x, -\cos x$，它們在 0 處的值分別爲 0, 1, 0, -1。容易得到：

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

考慮將 $(1+x)^\alpha$ 展開：

$$
(1+x)^\alpha = 
1 + \alpha x + \frac{\alpha(\alpha - 1)}{2!} x^2 + \frac{\alpha(\alpha - 1)(\alpha - 2)}{3!} x^3 + \cdots + \frac{\alpha^{\underline n}}{n!}x^n + \cdots
$$

這個結果和廣義二項式定理的一致。

多項式有個好處是可以很自然地將擴展到複數域。

$$
e^{\i x} = \textcolor{blue}{1} \textcolor{red}{+\i x} \textcolor{blue}{- \frac{x^2}{2}} \textcolor{red}{- \frac{\i x^3}{3!}} + \cdots + \frac{(\i x)^n}{n!} + \cdots
$$

其偶數次項正好是 $\textcolor{blue}{(-1)^k\frac{x^{2k}}{(2k)!}}$，也是 $\cos x$ 的展開項；奇數次項是 $\textcolor{red}{(-1)^k\i \frac{x^{2k+1}}{(2k+1)!}}$，是 $\i\sin x$ 的展開項。

於是就有了**歐拉公式**：

$$
\boxed{
  \e^{\i x} = \cos x + \i\sin x
}
$$

## 微分方程

$f(x) = f'(x)$ 的唯一解是 $f(x) = C\e^{x}$，其中 $C$ 是常數。

假設有其他函數滿足這個條件，假設爲 $g(x)$，那麼我們考慮 $h(x) = \frac{g(x)}{\e^{x}}$。$h'(x) = \frac{g'(x)\e^x - g(x)\e^x}{\e^{2x}} = 0$，即 $h(x)$ 是個常數，所以得到 $g(x)$ 也屬於 $C\e^{x}$。

由於導數之間可以線性相加，所以如果一個微分方程有若干解 $f_1(x), f_2(x), f_3(x), \cdots$，則它們的線性組合 $C_1f_1(x) + C_2f_2(x) + C_3f_3(x) + \cdots$ 也是解。

物理中有很多物理量之間有導數的關係。比如位置 $x$，對時間 $t$ 求導是速度 $v$，再對 $t$ 求導是加速度 $a$。求解這些量之間的關係，就相當於解微分方程。

### 單杆問題

考慮這樣的問題：

> 平行導軌間距爲 $L$，連通且忽略電阻，有垂直與兩導軌所成平面的勻強磁場 $B$。有長度爲 $L$，電阻爲 $R$ 導體棒放置在平行導軌上，其初速度爲 $v_0$，方向沿導軌方向。問導體棒什麼時候停下來。

導體產生的電動勢：

$$
E = vLB
$$

產生的電流：

$$
I = \frac{E}{R} = \frac{vLB}{R}
$$

產生的安培力：

$$
F = ILB = \frac{vL^2B^2}{R}
$$

牛二：

$$
F = ma
$$

$a$ 是什麼？$a$ 是 $v$ 的導數，所以我們相當於有這樣一個方程：

$$
-\frac{vL^2B^2}{R} = m\dot v
$$

這裏 $\dot v$ 是牛頓的導數記號，表示對時間求導。

我們只需要求出 $v$ 關於時間的表達式，然後解出 $v=0$ 對應的 $t$ 就行了。

看到這個導數形式讓人不由得想起了 $\e$，不妨假設 $v = C\e^{rt}$，只需解出 $C$ 和 $r$。 $C$ 很簡單：當 $t=0$ 的時候 $v=v_0$，所以 $C=v_0$。

解 $r$，將 $v = C\e^{rt}$ 直接帶入：

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

但是指數函數永遠不會變成 0，所以導體棒永遠不會停下來。

有沒有可能還有其他的解呢？類似前面關於 $f(x) = f'(x)$ 的解唯一的討論，可以證明沒有其他解。

### 簡諧振動

又來考慮簡諧震動。簡諧振動中有回復力：

$$
F = -kx
$$

還有牛二：

$$
F = ma = m\ddot x
$$

設 $x = \e^{rt}$，帶入可得：

$$
-k\e^{rt} = mr^2e^{rt}
$$

解得：

$$
r = \pm \i \sqrt\frac{k}{m}
$$

帶回去：

$$
v = \e^{rt} = \cos \left(\sqrt\frac{k}{m} t\right) \pm \i \sin \left(\sqrt\frac{k}{m} t\right)
$$

所以發現簡諧運動的週期：

$$
\boxed{
  T = \frac{2\pi}{\sqrt\frac{k}{m}} = 2\pi \sqrt \frac{m}{k}
}
$$

注意，這裏的 $v$ 實際上是可以乘以任意常數的，相當於可以改變振幅和初相，但都與週期無關。

### LC 振盪電路

最後我們看到 LC 振盪電路。

LC 振盪電路由一個電容和一個線圈組成。對於電容我們有：

$$
C = \frac{Q}{U_C}
$$

對於線圈，我們也有：

$$
U_L = L \dot I
$$

一條迴路電壓和應該爲 0：

$$
U_C + U_L = 0
$$

同時我們還知道 $I$ 是 $Q$ 的導數：

$$
I = \dot Q
$$

聯立得微分方程

$$
\frac{Q}{C} + L\ddot Q = 0
$$

和簡諧振動那個幾乎一樣，解得：

$$
Q = \e^{\pm \i \sqrt{\frac{1}{LC}}}
$$

所以 LC 振盪電路的週期：

$$
\boxed{
  T = 2 \pi \sqrt{LC}
}
$$

後面不會了。

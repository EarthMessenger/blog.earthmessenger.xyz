---
title: CSP 初赛
pubDate: 2023-09-15
tags: oi 
---

## 主定理

对于一个递推关系式子：$T(n) = aT(\frac{n}{b}) + f(n)$。其复杂度为：

- 如果存在常数 $\epsilon > 0$，有 $f(n) = O\left(n^{\log_{b}(a) - \epsilon}
        \right)$，则 $T(n) = \Theta\left(n^{\log_{b}a}\right)$。
- 如果存在常数 $\epsilon \ge 0$，有 $f(n) = \Theta\left(n^{\log_{b}a}
        \log^{\epsilon}n\right)$，则 $T(n) = \Theta\left(n^{\log_{b}a}
            \log^{\epsilon+1}n\right)$
- 如果存在常数 $\epsilon > 0$，有 $f(n) = \Omega\left(n^{\log_{b}(a)+]\epsilon}
        \right)$，且存在常数 $c < 1$ 以及充分大的 $n$ 使得 $af\left(\frac{n}{b}
            \right) \le cf(n)$，则 $T(n) = \Theta\left[f(n)\right]$

参考[维基百科][wiki-master-theorem]，与算法导论对应章节。

其实就是找 $aT(\frac{n}{b})$ 与 $f(n)$ 两个部分复杂度较大的。

[wiki-master-theorem]: https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)

## 复杂度记号

- $O$：上界
- $\Theta$：上下界
- $o$：上界（不取等的那种）
- $\Omega$：下界
- $\omega$：下界（不取等的那种）

$\mathrm{poly}(n)$ 指和 $n$ 有关的多项式，同理 $\mathrm{polylog}(n)$ 实际上就是
$\mathrm{poly}(\log n)$，即和 $\log n$ 有关的多项式。

## 错排问题

考虑容斥，若存在 $i$ 个数在原来的位置上，这种情况的数量是 $\binom{n}{i}(n-i)!$，
所以可以得到错排公式：

$$
\begin{aligned}
D(n)    &= \sum_{i=0}^{n} (-1)^{i} \binom{n}{i}(n-i)! \\
        &= \sum_{i=0}^{n} (-1)^{i} \frac{n!}{i!} \\
        &= n! \sum_{i=0}^{n} \frac{(-1)^{i}}{i!}
\end{aligned}
$$

也可以考虑递推，对于第 $n$ 个数，假设它被放到位置 $i$ 构成错排，考虑第 $i$ 个数的位置：

- 如果 $i$ 位于 $n$，余下的数构成 $n-2$ 阶错排，即 $(n-1)D(n-2)$。
- 如果 $i$ 不位于 $n$，即又是一个 $n-1$ 阶错排，答案为 $(n-1)D(n-1)$。

故得到递推公式：$D(n)=(n-1)[D(n-1)+D(n-2)]$。

OEIS: [A000166][oeis-A000166]。

[oeis-A000166]: https://oeis.org/A000166

## 卡特兰数

从最经典的出栈序列计数开始。将入栈记作 -1，出栈记作 +1，可以得到一个长度为 2n
的序列，一个合法的出栈序列满足其任意一个前缀和非负，且总和为 0。

考虑统计不合法的出栈序列。对于任意一个不合法的出栈序列，找到第一个满足前缀和等
于 -1，的位置 p，将 p 之前的所有数翻转，即 -1 变为 +1，+1 变为 -1，得到一个长度
为 2n 且有 n+1 个 +1，n-1 个 -1 的序列。容易得到对于任意一个有 n+1 个 +1，n-1
个 -1 的序列都能对应一个不合法的出栈序列，这是个双射。故不合法序列的总数为
$\binom{2n}{n+1}$，总共合法序列的数量为 $\binom{2n}{n} - \binom{2n}{n+1}
=\frac{\binom{2n}{n}}{n+1}$。

OEIS: [A000108][oeis-A000108]。

[oeis-A000108]: https://oeis.org/A000108

## Twelvefold way

$n$ 个球，$x$ 个盒子。

### $n$ 个有标号球放入 $x$ 个有标号盒子

$$
x^{n}
$$

### $n$ 个有标号球放入 $x$ 个有标号盒子，每个盒子至多一个球

$$
x^{\underline n}
$$

### $n$ 个有标号球放入 $x$ 个有标号盒子，每个盒子至少一个球

$$
x!
\begin{Bmatrix}
n \\
x
\end{Bmatrix}
$$

第二类斯特林数统计的是不区分盒子时的数量，乘上 $x!$ 表示考虑 $x$ 个盒子的顺序。

### $n$ 个无标号球放入 $x$ 个有标号盒子

$$
\binom{n+x-1}{x-1}
$$

每个盒子预先放上一个球，即转化为 $n+x$ 个无标号球放入 $x$ 个有标号盒子，每个盒
子至少一个球。

### $n$ 个无标号球放入 $x$ 个有标号盒子，每个盒子至多一个球

$$
\binom{x}{n}
$$

考虑哪些盒子放了球。

### $n$ 个无标号球放入 $x$ 个有标号盒子，每个盒子至少一个球

$$
\binom{n-1}{x-1}
$$

插板法，考虑 $n$ 个球之间有 $n-1$ 个空位，在这些空位中插入 $x-1$ 个分隔。

### $n$ 个有标号球放入 $x$ 个无标号盒子

$$
\sum_{i=0}^{k}
\begin{Bmatrix}
n \\
i
\end{Bmatrix}
$$

盒子是可空的，所以枚举有多少个盒子空，转化为每个盒子至少一个球的问题。

### $n$ 个有标号球放入 $x$ 个无标号盒子，每个盒子至多一个球

$$
[n \le x]
$$

### $n$ 个有标号球放入 $x$ 个无标号盒子，每个盒子至少一个球

$$
\begin{Bmatrix}
n \\
x
\end{Bmatrix}
$$

第二类斯特林数就是这样定义的。

计算第二类斯特林数，有递推公式：

$$
\begin{Bmatrix}
n \\
x
\end{Bmatrix}
=
\begin{Bmatrix}
n-1 \\
x-1
\end{Bmatrix}
+
x
\begin{Bmatrix}
n-1 \\
x
\end{Bmatrix}
$$

考虑第 $n$ 个球应该放在哪里。如果它单独放一个盒子，那么就是转化为
$\begin{Bmatrix} n-1 \\ x-1\end{Bmatrix}$；如果它放入一个现有的非空盒子，那么就
是 $x\begin{Bmatrix} n-1 \\ x \end{Bmatrix}$。

### $n$ 个无标号球放入 $x$ 个无标号盒子

$$
p_{x}(n+x)
$$

每个盒子预先放上一个球，即转化为 $n+x$ 个无标号球放入 $x$ 个有标号盒子，每个盒
子至少一个球。

### $n$ 个无标号球放入 $x$ 个无标号盒子，每个盒子至多一个球

$$
[n \le x]
$$

### $n$ 个无标号球放入 $x$ 个无标号盒子，每个盒子至少一个球

$$
p_{x}(n)
$$

相当于将 $n$ 拆分成恰好 $x$ 个正整数的方案数。

计算 $p_{x}(n)$，有转移方程：

$$
p_{x}(n) = p_{x}(n-x) + p_{x-1}(n-1)
$$

即考虑拆分方案中不存在 $1$ 和存在 $1$ 的情况。如果不存在 $1$，那么把方案中所有
数减一，转化为 $p_{x}(n-x)$；如果存在 $1$，那么去掉这个 $1$，转化为 $p_{x-1}
(n-1)$。

## 命令

就列一些常用的。我非常反感考这种东西。

- `cat`: 连接文件，并输出
- `cd`: 改变 shell 工作目录
- `chmod`: 更改文件权限
- `chown`: 更改文件所有者
- `cp`: 复制文件
- `diff`: 寻找文件差异
- `echo`: 输出参数
- `find`: 找文件
- `grep`/`egrep`/`fgrep`: 找满足条件的行
- `help`: shell 内建帮助
- `less`/`more`: 阅读器
- `ln`: 链接文件
- `ls`: 列出文件信息
- `man`: 查看手册
- `mkdir`: 创建目录
- `mv`: 移动文件
- `printf`: 格式化打印参数
- `pwd`: 输出当前目录名称
- `rm`: 删除文件
- `tar`: 打包文件
- `time`: 报告程序执行时间与使用资源，这不是 shell 的内建命令，通常需要用
  `/usr/bin/time`。
- `time`: 报告程序执行时间，这是大部分 shell 的内建命令，不同 shell 输出格式可
  能不同。
- `touch`: 更改文件修改时间和访问时间，如果文件不存在则会创建空文件

## 历史

2023 年，第 40 届 NOI，第 29 届 NOIp，第 35 届 IOI，第 5 届 CSP。

## ASCII

- `'0'`: 48
- `'A'`: 65
- `'a'`: 97


## 哈夫曼树

1. 对于给定的 $n$ 个权值，先建立 $n$ 个有 $1$ 个节点的树。
2. 不断进行以下操作，直到剩下 $1$ 棵树：
    1. 选取权值最小的两棵树 $A$ 和 $B$，将他们分别为左右子树，构造一颗新的树，
       其权值为 $A$ 的权值加 $B$ 的权值。
    2. 删除 $A$ 和 $B$。

## 人

- 艾伦·图灵：计算机科学与人工智能之父
- 约翰·冯·诺伊曼：冯·诺伊曼结构，又称存储程序计算机
- 克劳德·香农：奠定了现代信息论的基础

## 补码

对于一个长度为 $n$ 的二进制数 $x$，其补码为 $x \bmod 2^n$。

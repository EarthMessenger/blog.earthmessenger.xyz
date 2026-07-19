---
lang: zh-hant
opencc: true
tags: hjj dp
title: 號家軍 C297 C 繪畫
---

## 題意

使用 `openssl enc -aes256 -pbkdf2 -a` 加密。

```
U2FsdGVkX184vcghfc7YZTN9dITNNHBRjd28uIvf9G/uCCqHHXFw6v3wsAgHWlhl
lqkZpxn3yEeav0V/Gu3Z8yUmaqMHwdhTkmJjeJDkTqnYUmsYYWTABduG1s7g/fdQ
bvS92Uhk7VhESkOKu8vU/HSwrADSHkpEONRGE+GG3cq8kojZYZAOfmoPzxC95TND
vQSW2Ng1hLzR5lkql4HzhtevFkLhPDD+H0JKv01BOJbNg/nC3XZAjF6fdbEgMm6Y
8FADw+iDjV0Ry69NFSRBmO9GvfLCdlI19haRtNDHV4ei3fVkHItssaOmJJkCZM9+
+NWFjTfq+5odMRjjjJmP646wZ06jna3cPrLH1ymbfRqgS/6NrXocVTkVdcjaKmW5
G+cskCDdQ+vvTqjVnmYqB7rfOri9s1Spps5rBv4h6g725SWgYTIMEKEcEAi+hDvQ
8p9XYSz3csPud8X4nbiK3A4IkbanyMSxgXYl95d3GM1AqhEQ3aD5sYUVkHEk0cLQ
J0myNZCiZL/NdQ+k7r1rfDe1Ys2sf5D6HNqbktsO9myg71eXRen6EMlRjoSf17Pb
fPOJflPYTdpS1DcT7dCkxrl+tgQq/qh8n874azoYCecsLz/RcEbnfJzbQdM4c9IQ
7dUiDBFZ7cTNpIwe/MewBdse1Z3EvArkRFa8Y6iAYyvAekNnSc5zGfdETHlC4mpz
uqhuUcQ9qa6jov7LqTr/te2hc5KiJK/DBeEmhFlPBF2rQnk+u902amUCkVNjzOSt
551lWEAqru4mImDO2qOwkjrPGZ/Lr9JGnyTn/micXZ4s1OLD1kGBct8StDO7yc2/
s2tEW2dZ5jIRO6I7muuLHW5h1cH4zKXt1ml0poBLohWIHO4YnTgRCpiLUK6HwB5V
```

## 解析

為了方便，我們令格子的右下角為 $(0, 0)$，和題目上的定義不同。可以發現，如果一個
格子 $(i, j)$ 是白色，當且僅當 $i \& j = 0$，這個很容易根據畫板遞迴的定義推出。

所以問題就轉化為了問有多少個 $(i, j)$，使得 $i \& j = 0$ 且 $(i+X) \& (j-Y) =
0$，且 $0 \le i, j, i+X, j-Y \le 2^{k-1}$。考慮數位 dp，定義 $f(t, di, dj)$ 表
示當前考慮到從小往大的第 $t$ 位，$i+X$ 在這一位進位為 $di$，$j-Y$ 在這一位借位
為 $dj$ 的方案數。最後答案就是 $f(k, 0, 0)$，由於只考慮了前 $k$ 位，$i$ 和 $j$
都一定在 $0$ 到 $2^k$ 中，且沒有進位借位，所以一定在重合那個區域裡。

## 實現

應該用高精度，但是我懶，寫了 python。但是 python 的高精度實現得相當優秀，輕鬆超
過了 C++ 最優解。

```python
import itertools
import sys

k, X, Y = map(int, "".join([*open(0)]).split())

if X >= 2**k or Y >= 2**k:
    print(0)
    sys.exit(0)

xb = list(map(int, bin(X)[:1:-1].ljust(k, '0')))
yb = list(map(int, bin(Y)[:1:-1].ljust(k, '0')))

f = [[[0 for _ in (0, 1)] for _ in (0, 1)] for _ in range(k)]

def judge(x, y):
    return (x & y & 1) ^ 1

for i, j in itertools.product((0, 1), repeat=2):
    if judge(i, j) and judge(i ^ xb[0], j ^ yb[0]):
        f[0][i + xb[0] >= 2][j - yb[0] < 0] += 1

for t in range(1, k):
    for i, j, di, dj in itertools.product((0, 1), repeat=4):
        if judge(i, j) and judge(i ^ xb[t] ^ di, j ^ yb[t] ^ dj):
            f[t][i + xb[t] + di >= 2][j - yb[t] - dj < 0] += f[t - 1][di][dj]

print(f[-1][0][0])
```

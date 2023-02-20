---
layout: oi-notes
title: CWOI S C0176D 翻转硬币
tags: cwoi
---

题面使用 openssl enc -aes256 -base64 加密。

```
U2FsdGVkX1/jrmbUIAnfILXERzKUuepEaVmNZGRTKo08QaekNxVy+1kZbpDbVcxb
bVew4Vo39I3K3TEE2XvoRgkb3ZQvH5/NgHK1miEFEqaxmW0T+kTcIsZ01x/DvypE
7VLS8SceRbgXK/x8kwWUl0TUT+P9i3voc2sm0WoavYLhSlC+1kyUJWd1pm5HMfb4
dytyvS/pI9rbwPlnsaU9yjUSfoxlQmEyRwEqrFzFniAdqXb4zIOfcALQHFB+O3f+
uERMa0GPwR6NXPH8X6fMN9tyXOdF7JlsRLrBipr7vIfVGs6AeMPdbFyMdBbQUlIU
aXsRNLdgkOw5lXOzVkB2mi8KQb/mKFlMvHfZJcPguIQ5ItfIwd8bUIqkbE+5iQmV
BTe1Y35hOwWH164E7YVYW3Cp3RO3QxrE/qGV7Uy7AkWe5qNG4duQ28oH6xQ1itZe
gcELQz07wTtSTC/aTHOKMrvzovJ4e/JY+igrDX5BvLc=
```

首先容易观察到，对于每个 i 最多执行一次 1 操作，对于每个 k 最多一次 2 操作。

操作有单点的和区块的，可以考虑根据 $\sqrt{n}$ 与 $m$ 的大小分类做。当 
$\sqrt{n} \le m$ 时每一块都很大，$O(2^{\frac{n}{m}})$ 暴力枚举每一块是否要翻，
然后余下的位置只能一个一个翻，可以直接计算。当 $\sqrt{n} > m$ 时每一块都很小，
可以定义 $f(i, j, k)$ 表示第 $i$ 块状态为 $j$，翻转状态为 $k$（0/1）。

注意首块和最末那个散块的处理。

```cpp
if (m * m > n) {
    int k = n / m;
    int ans = std::numeric_limits<int>::max();
    for (unsigned int i = 0; i < (1u << k); i++) {
        auto s = a;
        int nowans = std::popcount(i);
        for (int j = 0; j < k; j++) {
            for (int jj = j * m; jj < (j + 1) * m; jj++) {
                s[jj] ^= (std::popcount(i >> j) & 1);
            }
        }

        for (int j = 0; j < m; j++) {
            std::vector<int> cnt(2);
            for (int jj = j; jj < n; jj += m) {
                cnt[s[jj]]++;
            }
            nowans += std::min(cnt[0], cnt[1]);
        }
        ans = std::min(ans, nowans);
    }
    printf("%d\n", ans);
} else {
    std::vector<std::vector<std::array<int, 2>>> f(n / m + (n % m > 0), std::vector<std::array<int, 2>>(1 << m));
    for (int i = 0; i < (int)f.size(); i++) {
        int bs = std::min(m, n - i * m);
        for (unsigned int j = 0; j < (1u << m); j++) {
            int rev_cnt = 0;
            for (int ii = i * m; ii < (i + 1) * m && ii < n; ii++) {
                if ((unsigned)a[ii] != ((j >> (ii - i * m)) & 1)) rev_cnt++;
            }
            if (i > 0) {
                f[i][j][0] = std::min(f[i - 1][j][0], f[i - 1][j][1]) + rev_cnt;
                unsigned int rev_j = ((1 << m) - 1) ^ j;
                f[i][j][1] = std::min(f[i - 1][rev_j][0], f[i - 1][rev_j][1]) + bs - rev_cnt + 1;
            } else {
                f[i][j][0] = rev_cnt;
                f[i][j][1] = bs - rev_cnt + 1;
            }
        }
    }
    int ans = std::numeric_limits<int>::max();
    for (unsigned int j = 0; j < (1u << m); j++) {
        ans = std::min({ans, f.back()[j][0], f.back()[j][1]});
    }
    printf("%d\n", ans);
}
```


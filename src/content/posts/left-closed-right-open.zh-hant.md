---
lang: zh-hant
opencc: true
pubDate: 2023-02-13
tags: oi trick
title: 左閉右開神教
---

## 前言

~~缺點：同學讀不懂你的程式碼了~~

不難發現，在大多數程式語言的標準庫中，通常都會以左閉又開，從 0 開始的方式表示
區間。本文將論述這種表示方式在演算法競賽中的諸多優勢。

注：具體問題具體分析，辯證看待這篇文章。

## 理解左閉右開

如果表示的數是連續的，自然會有這種區間表示的問題，該開就開，該閉就閉。

然而計算機無法表示連續的數，無論是在實踐上還是理論上。能夠表示連續的數意味著可以
表示兩個數 $a$、$b$，使得 $\forall \varepsilon > 0, |a - b| < \varepsilon$，
這顯然是做不到的。

因此，計算機在表示數值時，常常會**離散化**成離散的整數，再用“段”來表示。這就導致
了閉區間，開區間，左閉右開，左開右閉四種區間表示方法的混亂。

![number line](/assets/images/number-line-1a39e843.png)

如圖，綠色的數表示計算機中的實際的數，是**離散成段**的，而藍色的數表示兩個綠色的
數之間的**分隔**。 那麼，表示綠色的左閉右開區間 $[l, r)$ 就可以理解成以藍色的端
點 $l$、$r$ 所圍起來的區間。這樣離散整數的區間 $[l, r)$ 就對應連續實數區間的
$[l, r)$，不需要任何額外轉換，更加符合人類的直覺。

藍色和綠色數就相當於物理上時刻和時間段，程式設計時一定要釐清兩者之間的關係。

> 如果你是色盲，那麼你只需要知道圖片上數軸的線是紅色的，較高的數字是藍色的，較
低的數字是綠色的就行了。

當然，左閉右開的表示和 C++ 中下標從 0 開始有極大關係。

## 優勢

這些優勢是由上面的“離散左閉右開區間與實數的區間對應”，所引出來的。

### 計算長度

這離散區間的長度就是左右兩個端點的距離，由於離散左閉右開區間與連續實數區間天然
的對應關係，計算區間 $[l, r)$ 的長度就是 $r - l$，無需額外轉換。

C++ 中，長度為 $n$ 陣列為 $a_0, a_1, a_2, \cdots, a_{n-1}$，正好和左閉右開呼應。

### 表示空集

可以使左右端點相同來表示空集，如果是閉區間的話，必須要（不優雅地）使右端點小於
左端點。這在編寫莫隊時十分有用。

### 表示連續區間

由於 $[l, r)$ 可以理解為 $l$ 端點到 $r$ 端點，因此表示連續區間端點就應該重合，
這在編寫分治、線段樹之類的程式碼時十分有用。

## 實踐

### 環狀陣列

一個數組長度為 $n$，那麼第 $i$ 個元素的前一個就是 $i + n - 1 \pmod n$，後一個就是
$i + 1 \pmod n$。

環狀陣列的下標不能比大小，不能用類似 `for (int i = l; i <= r; i = (i + 1) % n)`
的方式迴圈，但用左閉右開表示區間就可以寫成 
`for (int i = l; i != r; i = (i + 1) % n)`。

### 字首和和差分

字首和可以理解成離散化的積分，差分可以理解為離散化的微分。

對於數列 $a_0, a_1, a_2, \cdots$，我們定義其字首和陣列：

$$
s_i = 
\begin{cases}
0                     & i = 0 \\
a_{i - 1} + s_{i - 1} & i > 0
\end{cases}
$$

即前 $i$ 項的和。

同樣我們定義差分陣列：

$$
d_i = 
\begin{cases}
a_i             & i = 0 \\
a_i - a_{i - 1} & i > 0 \\
\end{cases}
$$

求區間 $[l, r)$ 的和：$s_r - s_l$

區間 $[l, r)$ 加 $x$：$d_l = d_l + x$，$d_r = d_r - x$

實踐：

```cpp
std::vector<int> a(n), s(n + 1), d(n);
for (int i = 0; i < n; i++) s[i + 1] = s[i] + a[i];
for (int i = 1; i < n; i++) d[i] = a[i] - a[i - 1];
```

注意**字首和陣列比原陣列的長度大一**，且這樣定義會使得**原陣列的差分陣列的字首
和陣列比原陣列多一個 0**。

仿照字首和，我們也可以定義出字串 $s$ 的字首雜湊：

$$
h_i = 
\begin{cases}
0                                  & i = 0 \\
h_{i - 1} \times M + s_{i} \pmod N & i > 0
\end{cases}
$$

這樣求子串 $s_{[l, r)}$ 的雜湊就是 $h_r - h_l \times M^{r - l} \pmod N$。

各種 dp 陣列也可以仿照這種方式定義。

> 還是那句話：具體問題具體分析，這種定義依然存在許多不方便之處。

### 二分

在陣列 $a$ 的區間 $[l, r)$ 中找值 $x$ 出現的位置。

`lower_bound`:

```cpp
int l = 0, r = n;
while (l < r) {
    int mid = (l + r) / 2;
    if (a[mid] >= x) r = mid;
    else l = mid + 1;
}
return r;
```

`upper_bound`:

```cpp
int l = 0, r = n;
while (l < r) {
    int mid = (l + r) / 2;
    if (a[mid] > x) r = mid;
    else l = mid + 1;
}
return r;
```

兩份程式碼唯一的區別在於：一個是 `a[mid] >= x`，一個是 `a[mid] > x`。

~挺沒用的~

### 樹狀陣列

樹狀陣列可以下標從 0 開始，通過簡單的找規律發現，`x` 的父節點是 `x | (x + 1)`，
能管轄的範圍是 `x & (x + 1)` 到 `x`，不需要依賴 `lowbit`。可以寫出如下程式碼：

```cpp
struct fenwick_tree
{
    int n;
    std::vector<int> t;
    fenwick_tree(int n) : n(n), t(n) {}
    void add(int x, int v)
    {
        for (; x < n; x |= (x + 1)) t[x] += v;
    }
    int sum(int x)
    {
        int res = 0;
        for (x--; x >= 0; x = (x & (x + 1)) - 1) res += t[x];
        return res;
    }
};
```

然而這樣很沒有必要，也容易背錯，你也可以寫傳統的下標從 1 開始的樹狀陣列再封裝成
下標從 0 開始：

```cpp
struct fenwick_tree
{
    int n;
    std::vector<int> t;
    fenwick_tree(int n) : n(n), t(n) {}
    void add(int x, int v)
    {
        for (x++; x <= n; x += x & -x) t[x - 1] += v;
    }
    int sum(int x)
    {
        int res = 0;
        for (; x >= 1; x -= x & -x) res += t[x - 1];
        return res;
    }
};
```

注意這裡兩個 `fenwick_tree::sum` 都表示 $[0, x)$ 的和，與前面字首和的定義吻合。

類比前面字首和和差分，可以容易得出單點修改區間查詢和單點修改區間查詢的程式碼。

對於區間修改區間查詢，則和常規思路一致，假設 $a$ 的差分陣列為 $d$，則：

$$
\begin{aligned}
 & \sum_{i=0}^{r-1} a_i \\
=& \sum_{i=0}^{r-1} \sum_{j=0}^{i} d_i \\
=& \sum_{i=0}^{r-1} d_i \times (r - i) \\
=& \sum_{i=0}^{r-1} d_i \times r - \sum_{i=0}^{r-1} d_i \times i
\end{aligned}
$$

容易發現這個結論明顯比普通的樹狀陣列優美，沒有了奇怪的 +1。

程式碼（[LibreOJ 提交記錄](https://loj.ac/s/1698497)）：

```cpp
int main()
{
    int n, q;
    scanf("%d%d", &n, &q);
    std::vector<long long> a(n), d(n), di(n);

    for (int i = 0; i < n; i++) {
        scanf("%lld", &a[i]);
    }

    d[0] = a[0];
    di[0] = 0;

    for (int i = 1; i < n; i++) {
        d[i] = a[i] - a[i - 1];
        di[i] = d[i] * i;
    }

    fenwick_tree f(d), fi(di);

    while (q--) {
        char op;
        scanf(" %1c", &op);

        if (op == '2') {
            int l, r;
            scanf("%d%d", &l, &r);
            l--;
            auto ans = f.sum(r) * r - fi.sum(r) - f.sum(l) * l + fi.sum(l);
            printf("%lld\n", ans);
        } else if (op == '1') {
            long long l, r, v;
            scanf("%lld%lld%lld", &l, &r, &v);
            l--;
            f.add(l, v);
            f.add(r, -v);
            fi.add(l, v * l);
            fi.add(r, -v * r);
        }
    }
}
```

沒有奇怪的 +1 -1，舒服！

### 線段樹

堆式儲存線段樹也可以讓下標從 0 開始。具體來說節點 `x` 的左兒子為 `x * 2 + 1`，
右兒子為 `x * 2 + 2`，當然我覺得這很不優美，不如下標從 1 開始。

重點是區間表示，左閉右開的區間意味著連續區間的左右端點一致，如下面常見的 
`add_tree` 函式（用於線段樹區間加）：

```cpp
 void add_tree(int l, int r, long long x, int ll, int rr, int p)
 {
     if (l <= ll && rr <= r) {
         put_tag(x, ll, rr, p);
         return ;
     }
     spread_tag(ll, rr, p);
     int mid = (ll + rr) / 2, lchild = p * 2, rchild = p * 2 + 1;
     if (l < mid) add_tree(l, r, x, ll, mid, lchild);
     if (mid < r) add_tree(l, r, x, mid, rr, rchild);
     t[p].sum = t[lchild].sum + t[rchild].sum;
 }
```

[完整程式碼 LibreOJ 提交記錄](https://loj.ac/s/1700394)

注意到程式碼往下遞迴的那兩行，得益於左閉右開的優點，這裡對齊了！再看其他的線段樹
模板，無法對齊，醜陋不堪。

### 分塊

判斷區間在哪一塊是明顯方便許多，可以直接取模相除：
[LibreOJ 提交記錄](https://loj.ac/s/1700529)

## 總結

具體問題具體分析，沒有什麼是完美的，上述內容依然存在不優雅之處，比如倒序遍歷時
左開右閉明顯比左閉右開好用。一定要區分清楚數和邊界的關係，也要注意題目給的是哪
種區間表示，自己程式碼又用的是哪種區間表示，不能混淆。

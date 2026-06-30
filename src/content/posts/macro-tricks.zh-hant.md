---
lang: zh-hant
opencc: true
pubDate: 2022-08-26
tags: cpp trick
title: 宏魔法
---

## 宏入門

使用 `#define 識別符號 替換列表` 或者 `#define 識別符號( 形參 ) 替換列表` 以定義宏，
這兩種宏分別叫做**仿物件宏**與**仿函式宏**。  
使用 `#undef 識別符號` 以取消巨集定義。

仿函式宏的形參中可以使用 `...` 表示定義可變數量引數的宏，但 `...` 只能放在最後
一個引數。可以在替換列表中使用 `__VA_ARGS__` 來表示 `...` 所對應的引數，也可以
使用 `__VA_OPT__( 內容 )` 表示 `__VA_ARGS__` 非空時替換為 `內容`，反之為空。

宏中可以使用 `#` 和 `##` 運算子。如果一個替換列表中的識別符號前有 `#`，則將其內容
轉譯並用引號包裹；`##` 則表示拼接。

具體看：[https://zh.cppreference.com/w/cpp/preprocessor/replace](https://zh.cppreference.com/w/cpp/preprocessor/replace)

## 技巧

### 使用宏除錯

```cpp
#define SHOW(x) std::cerr << #x << " = " << x << std::endl; 
```

`cerr` 表示輸出到 `stderr` 而不是 `stdout`，`#x` 則將 `x` 的名稱顯示了出來。

```cpp
#define PASS() std::cerr << "PASSING LINE " << __LINE__ << std::endl;
```

顯示了執行的行數，在調不明原因的 RE 時可能有用（然而壓縮行了就沒用了）。

~~並不比 gdb 好用~~

### 使用巨集定義 max 和 min

許多人習慣於使用下面的程式碼定義 max 和 min。

```cpp
#define MAX(x, y) ((x) < (y) ? (y) : (x))
#define MIN(x, y) ((x) > (y) ? (y) : (x))
```

然而這樣是不好的，如果傳入的 x 和 y 是耗時極大的函式或者有副作用的函式，就可能
導致超時乃至錯誤的問題。

一個合理的解法是這樣的：

```cpp
#define MAX(x, y)                                                              \
    ({                                                                         \
        __typeof(x) a12345 = (x);                                              \
        __typeof(y) a123456 = (y);                                             \
        a12345 < a123456 ? a123456 : a12345;                                   \
    })

#define MIN(x, y)                                                              \
    ({                                                                         \
        __typeof(x) a12345 = (x);                                              \
        __typeof(y) a123456 = (y);                                             \
        a12345 > a123456 ? a123456 : a12345;                                   \
    })
```

其中 `a12345`，`a123456` 是為了防止重名而起的名字。

~~不如 C++ 模板~~

### 使用宏預處理 $\lg$

如果我們要求 $1$ 到 $2^n-1$ 的 $\lg$ 值，我們可以分治成求 $1$ 到 $2^{n-1}-1$ 的
$\lg$ 和 $2^{n-1}$ 到 $2^n-1$ 的 $\lg$ 值，對於後者，它們的 $\lg$ 值都是 $n-1$，
而對於前者，則用同樣的方法遞迴求下去。

於是可以得到以下程式碼：

```cpp
#define REPEAT0(x) x
#define REPEAT1(x) REPEAT0(x), REPEAT0(x)
#define REPEAT2(x) REPEAT1(x), REPEAT1(x)
#define REPEAT3(x) REPEAT2(x), REPEAT2(x)
#define REPEAT4(x) REPEAT3(x), REPEAT3(x)
#define REPEAT5(x) REPEAT4(x), REPEAT4(x)
#define REPEAT6(x) REPEAT5(x), REPEAT5(x)
#define REPEAT7(x) REPEAT6(x), REPEAT6(x)
#define REPEAT8(x) REPEAT7(x), REPEAT7(x)
#define REPEAT9(x) REPEAT8(x), REPEAT8(x)
#define REPEAT10(x) REPEAT9(x), REPEAT9(x)
#define REPEAT11(x) REPEAT10(x), REPEAT10(x)
#define REPEAT12(x) REPEAT11(x), REPEAT11(x)
#define REPEAT13(x) REPEAT12(x), REPEAT12(x)
#define REPEAT14(x) REPEAT13(x), REPEAT13(x)
#define REPEAT15(x) REPEAT14(x), REPEAT14(x)
#define REPEAT16(x) REPEAT15(x), REPEAT15(x)
#define REPEAT17(x) REPEAT16(x), REPEAT16(x)
#define REPEAT18(x) REPEAT17(x), REPEAT17(x)
#define REPEAT19(x) REPEAT18(x), REPEAT18(x)

#define LG1 0, 0
#define LG2 LG1, REPEAT1(1)
#define LG3 LG2, REPEAT2(2)
#define LG4 LG3, REPEAT3(3)
#define LG5 LG4, REPEAT4(4)
#define LG6 LG5, REPEAT5(5)
#define LG7 LG6, REPEAT6(6)
#define LG8 LG7, REPEAT7(7)
#define LG9 LG8, REPEAT8(8)
#define LG10 LG9, REPEAT9(9)
#define LG11 LG10, REPEAT10(10)
#define LG12 LG11, REPEAT11(11)
#define LG13 LG12, REPEAT12(12)
#define LG14 LG13, REPEAT13(13)
#define LG15 LG14, REPEAT14(14)
#define LG16 LG15, REPEAT15(15)
#define LG17 LG16, REPEAT16(16)
#define LG18 LG17, REPEAT17(17)
#define LG19 LG18, REPEAT18(18)
#define LG20 LG19, REPEAT19(19)

const int lg2[] = { LG20 };
```

這樣就可以在編譯的時候預處理 $1$ 到 $2^{20} - 1$ $\lg$ 了。

注意，編譯出來的檔案大小超過 4MB，有可能會產生奇怪的編譯錯誤。

## 注意

### 宏是圖靈完備的嗎？

參考 [Is the C99 preprocessor Turing complete?](https://stackoverflow.com/questions/3136686/is-the-c99-preprocessor-turing-complete)。

### 巨集定義的末尾是否需要加分號？

看具體情況，通常是不用加分號的。

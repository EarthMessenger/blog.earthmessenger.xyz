---
title: 宏魔法
pubDate: 2022-08-26
tags: cpp trick
---

## 宏入门

使用 `#define 标识符 替换列表` 或者 `#define 标识符( 形参 ) 替换列表` 以定义宏，
这两种宏分别叫做**仿对象宏**与**仿函数宏**。  
使用 `#undef 标识符` 以取消宏定义。

仿函数宏的形参中可以使用 `...` 表示定义可变数量参数的宏，但 `...` 只能放在最后
一个参数。可以在替换列表中使用 `__VA_ARGS__` 来表示 `...` 所对应的参数，也可以
使用 `__VA_OPT__( 内容 )` 表示 `__VA_ARGS__` 非空时替换为 `内容`，反之为空。

宏中可以使用 `#` 和 `##` 运算符。如果一个替换列表中的标识符前有 `#`，则将其内容
转译并用引号包裹；`##` 则表示拼接。

具体看：[https://zh.cppreference.com/w/cpp/preprocessor/replace](https://zh.cppreference.com/w/cpp/preprocessor/replace)

## 技巧

### 使用宏调试

```cpp
#define SHOW(x) std::cerr << #x << " = " << x << std::endl; 
```

`cerr` 表示输出到 `stderr` 而不是 `stdout`，`#x` 则将 `x` 的名称显示了出来。

```cpp
#define PASS() std::cerr << "PASSING LINE " << __LINE__ << std::endl;
```

显示了运行的行数，在调不明原因的 RE 时可能有用（然而压缩行了就没用了）。

~~并不比 gdb 好用~~

### 使用宏定义 max 和 min

许多人习惯于使用下面的代码定义 max 和 min。

```cpp
#define MAX(x, y) ((x) < (y) ? (y) : (x))
#define MIN(x, y) ((x) > (y) ? (y) : (x))
```

然而这样是不好的，如果传入的 x 和 y 是耗时极大的函数或者有副作用的函数，就可能
导致超时乃至错误的问题。

一个合理的解法是这样的：

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

其中 `a12345`，`a123456` 是为了防止重名而起的名字。

~~不如 C++ 模板~~

### 使用宏预处理 $\lg$

如果我们要求 $1$ 到 $2^n-1$ 的 $\lg$ 值，我们可以分治成求 $1$ 到 $2^{n-1}-1$ 的
$\lg$ 和 $2^{n-1}$ 到 $2^n-1$ 的 $\lg$ 值，对于后者，它们的 $\lg$ 值都是 $n-1$，
而对于前者，则用同样的方法递归求下去。

于是可以得到以下代码：

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

这样就可以在编译的时候预处理 $1$ 到 $2^{20} - 1$ $\lg$ 了。

注意，编译出来的文件大小超过 4MB，有可能会产生奇怪的编译错误。

## 注意

### 宏是图灵完备的吗？

参考 [Is the C99 preprocessor Turing complete?](https://stackoverflow.com/questions/3136686/is-the-c99-preprocessor-turing-complete)。

### 宏定义的末尾是否需要加分号？

看具体情况，通常是不用加分号的。

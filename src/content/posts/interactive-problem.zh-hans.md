---
title: 测交互题
pubDate: 2024-06-03
tags: oi trick
lang: zh-hans
opencc: true
---

## 背景

昨夜打 ARC 遇一[交互题][arc179c]，一小时左右写出来，提交，WA。尝试调试，人工回
答询问太难，便试图用 testlib 写一交互进程。不久写完，竟发现不会使用，
[OI Wiki][interactor] 所述 interactor 用法若无，lemon 亦不支持 IO 交互。研究许久，
最终两题遗憾离场。~~还好 unrated。~~

## 教程

为方便，将选手进程称作 a，而将交互进程称作 b，省 testlib 参数。a stdout 要输到
b stdin，而 b stdout 又要输到 a stdin。两者形式对称，互换影响也不大。

最早我尝试如此：

```sh
$ ./a < tmp | ./b > tmp
```

无效。问题是，a 读 tmp 时，b 还未来得及写，tmp 空，a 只读到 EOF，于是便挂了。

如何解决？使用 fifo，又名 named pipe。fifo 和普通文档类似，但需读取之时，若无内
容，则会阻塞，直到有内容。反之，需写之时，若无读取，亦阻塞。有例曰：

```sh
$ mkfifo p            # 创建 fifo，其名为 p，可 ls 查看
$ echo "1234" > p &   # 写入 p，此时该 echo 阻塞在后台，可以尝试去掉 &。
$ cat p               # 读取 p，此时那个 echo 运行结束
$ rm p                # 删除 p
```

故可以如此测试交互题：

```sh
$ ./a < tmp | ./b > tmp # 这里 tmp 是 fifo！
```

若欲调试，你可能会写出如此代码。

```sh
$ mkfifo p1 p2
$ ./b < p1 > p2 &
$ gdb ./a
(gdb) r < p2 > p1
```

不运行，何故？使 b 运行，则其所读管道 p1 需先有写入者，即需 a 先运行，而 a 运行
亦如此。二进程互相依赖，故无法运行。何以解决？曰：

```sh
$ cat p1 | ./b > p2 &
$ gdb ./a
(gdb) r < p2 > p1
```

如此打破其依赖，便可轻松调试。

仍不好使。原因有二，一是每次运行之后，交互进程停，其次是交互进程输入输出与 gdb
调试混在一起，不好看。更优做法，用 tmux 之类工具，开终端二，一跑 `while true;
do cat p1 | ./b > p2; done` 使交互进程永远运行，二用 gdb 调试。此交互题调试之善
法也！

[arc179c]: https://atcoder.jp/contests/arc179/tasks/arc179_c
[interactor]: https://oi.wiki/tools/testlib/interactor/

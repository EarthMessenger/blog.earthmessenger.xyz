---
title: 測交互題
pubDate: 2024-06-03
tags: oi trick
lang: zh-hant
---

## 背景

昨夜打 ARC 遇一[交互題][arc179c]，一小時左右寫出來，提交，WA。嘗試調試，人工回
答詢問太難，便試圖用 testlib 寫一交互程序。不久寫完，竟發現不會使用，
[OI Wiki][interactor] 所述 interactor 用法若無，lemon 亦不支持 IO 交互。研究許久，
最終兩題遺憾離場。~~還好 unrated。~~

## 教程

爲方便，將選手程序稱作 a，而將交互程序稱作 b，省 testlib 參數。a stdout 要輸到
b stdin，而 b stdout 又要輸到 a stdin。兩者形式對稱，互換影響也不大。

最早我嘗試如此：

```sh
$ ./a < tmp | ./b > tmp
```

無效。問題是，a 讀 tmp 時，b 還未來得及寫，tmp 空，a 只讀到 EOF，於是便掛了。

如何解決？使用 fifo，又名 named pipe。fifo 和普通文件類似，但需讀取之時，若無內
容，則會阻塞，直到有內容。反之，需寫之時，若無讀取，亦阻塞。有例曰：

```sh
$ mkfifo p            # 創建 fifo，其名爲 p，可 ls 查看
$ echo "1234" > p &   # 寫入 p，此時該 echo 阻塞在後臺，可以嘗試去掉 &。
$ cat p               # 讀取 p，此時那個 echo 運行結束
$ rm p                # 刪除 p
```

故可以如此測試交互題：

```sh
$ ./a < tmp | ./b > tmp # 這裏 tmp 是 fifo！
```

若欲調試，你可能會寫出如此代碼。

```sh
$ mkfifo p1 p2
$ ./b < p1 > p2 &
$ gdb ./a
(gdb) r < p2 > p1
```

不運行，何故？使 b 運行，則其所讀管道 p1 需先有寫入者，即需 a 先運行，而 a 運行
亦如此。二程序互相依賴，故無法運行。何以解決？曰：

```sh
$ cat p1 | ./b > p2 &
$ gdb ./a
(gdb) r < p2 > p1
```

如此打破其依賴，便可輕鬆調試。

仍不好使。原因有二，一是每次運行之後，交互程序停，其次是交互程序輸入輸出與 gdb
調試混在一起，不好看。更優做法，用 tmux 之類工具，開終端二，一跑 `while true;
do cat p1 | ./b > p2; done` 使交互程序永遠運行，二用 gdb 調試。此交互題調試之善
法也！

[arc179c]: https://atcoder.jp/contests/arc179/tasks/arc179_c
[interactor]: https://oi.wiki/tools/testlib/interactor/

---
lang: zh-hant
opencc: true
pubDate: 2024-01-21
tags: trick
title: 使用 coredump 輔助除錯
---

最近發現的一個可能有一點用的技巧。

當程式 RE 的時候，會產生 core dump 檔案儲存程式記憶體。利用 core dump 檔案，可以
方便的復現錯誤。

需要安裝 gdb，或者其他類似 debugger（不會有人沒安吧）。

比如說我寫了一個程式 `test.cpp`：

```cpp
#include <iostream>
#include <vector>

int main()
{
  int n;
  std::cin >> n;
  std::vector<std::pair<int, int>> query;
  query.reserve(n);
  std::vector<std::vector<int>> ql(n);
  for (int i = 0; i < n; i++) {
    int l, r;
    std::cin >> l >> r;
    query.emplace_back(l, r);
    ql[l].emplace_back(i);
  }

  for (int i = 1; i <= n; i++) {
    for (auto j : ql[i]) {
      const auto &q = query[j];
      std::cout << q.first << " " << q.second << std::endl;
    }
  }
}
```

這個程式錯在 ql 的下標會訪問到 n，但是大小隻開了 n。

然後執行這個輸入樣例：

```
3
1 3
3 3
2 3
```

得到 RE：

![Aborted (Core dumped)](/assets/images/coredump-52f42ec4.png)

出現 `(Core dumped)` 或者 `(核心已轉儲)` 就說明系統已經產生了 core dump 檔案，
可以直接呼叫。

然而 core dump 檔案一般是儲存在 `/var/lib/systemd/coredump` 類似的位置，輸入這
麼一長串路經很麻煩，更好的做法是使用 `coredumpctl` 工具。比如我們可以使用
`coredumpclt list` 列出系統內所有的 core dump 檔案。

執行 `coredumpctl debug test`，就會自動調出 gdb 除錯，其中 `test` 是程式名。然
後就可以正常使用 gdb 除錯了，比如用 `bt` 檢視呼叫棧。

如果不想用 `coredumpctl` 的話，或者 core dump 檔案不在 `coredumpctl` 管理的那個
位置，可以用 `gdb <執行檔名> <core dump 名>` 指定 gdb 使用 core dump 檔案。

然而大部分情況下，你應該是儲存了輸入檔案的，這個效果和你開 gdb 再輸入一邊樣例差
不多，所以這個技巧挺沒用的。

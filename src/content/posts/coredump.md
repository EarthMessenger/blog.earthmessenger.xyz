---
title: 使用 coredump 辅助调试
pubDate: 2024-01-21
tags: trick
---

最近发现的一个可能有一点用的技巧。

当程序 RE 的时候，会产生 core dump 文件保存程序内存。利用 core dump 文件，可以
方便的复现错误。

需要安装 gdb，或者其他类似 debugger（不会有人没安吧）。

比如说我写了一个程序 `test.cpp`：

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

这个程序错在 ql 的下标会访问到 n，但是大小只开了 n。

然后运行这个输入样例：

```
3
1 3
3 3
2 3
```

得到 RE：

![Aborted (Core dumped)](/assets/images/coredump-52f42ec4.png)

出现 `(Core dumped)` 或者 `(核心已转储)` 就说明系统已经产生了 core dump 文件，
可以直接调用。

然而 core dump 文件一般是存储在 `/var/lib/systemd/coredump` 类似的位置，输入这
么一长串路经很麻烦，更好的做法是使用 `coredumpctl` 工具。比如我们可以使用
`coredumpclt list` 列出系统内所有的 core dump 文件。

运行 `coredumpctl debug test`，就会自动调出 gdb 调试，其中 `test` 是程序名。然
后就可以正常使用 gdb 调试了，比如用 `bt` 查看调用栈。

如果不想用 `coredumpctl` 的话，或者 core dump 文件不在 `coredumpctl` 管理的那个
位置，可以用 `gdb <可执行文件名> <core dump 名>` 指定 gdb 使用 core dump 文件。

然而大部分情况下，你应该是保存了输入文件的，这个效果和你开 gdb 再输入一边样例差
不多，所以这个技巧挺没用的。

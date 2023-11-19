---
title: 在 vim 中编译程序
tags: vim oi
pubDate: 2023-02-26
---

## 新手：直接使用 map 映射编译命令

使用这样的配置：

```vim
nn <F9> :!g++ % -o %< -std=c++2a -Wall<CR>
nn <F10> :!./%<<CR>
```

然后用 F9 编译，F10 运行。

能用，但是太难用。

## 初学者：根据语言配置不同命令

如果只使用 C++，那么上面的方法基本可以满足需求。但你也很有可能需要编写 Python，
Rust 之类的东西，在这样配置便不妥了。

可以使用 `autocmd` 来依据语言选择编译/运行方式：

```vim
augroup Runner
	autocmd!
	autocmd BufRead,BufNewFile *.cpp 
				\ nn <buffer><F9> !:g++ % -o %< -std=c++2a -Wall<CR> 
				\ nn <buffer><F10> :!./%<<CR>
	autocmd BufRead,BufNewFile *.py
				\ nn <buffer><F10> :!python %<CR>
augroup END
```

或者你也可以用 `ftplugin` 来实现：

`~/.vim/ftplugin/cpp.vim`: 

```vim
nn <buffer><F9> :!g++ % -o %< -std=c++2a -Wall<CR>
nn <buffer><F10> :!./%<<CR>
```

`~/.vim/ftplugin/python.vim`:

```vim
nn <buffer><F10> :!python %<CR>
```

你需要在 `vimrc` 中设置 `filetype plugin on` 才能让 vim 根据文件类型执行相应的
命令。

## 专家：使用 quickfix 功能加速对 CE 的处理

上面的配置对于普通算法竞赛已经够用了，然而存在这样一个问题：如果代码 CE，则难以
根据编译信息定位错误位置。我们可以考虑使用 vim 的 quickfix 功能加速对 CE 的处理。

首先确保你的 vim 有 quickfix 功能：`has('quickfix')`。

然后大概是这个流程：

1. 配置 `makeprg`，默认选项是 `make`，你也可以改成 `clang++`，`g++`，`rustc`
   之类的
2. 使用 `:make` 执行 `makeprg` 中的命令，注意这个 `make` 是 vim 中的命令，输出
   将会自动输送到 quickfix 窗口。
3. 打开 quickfix 窗口并根据信息修改代码。

比如我现在有这样一份代码：

```cpp
#include <iostream>
#include <vector>

int main()
{
	int n;
	std::cin >> n;
	std::vector<long long> v(n);
	for (auto &i : v) std::cin >> i;
	long long ans = std::numeric_limits<long long>::max();
	for (auto i : v) ans = std::min(ans, i);
	cout << std::max(ans, 0) << endl;
}
```

这里为了演示 `makeprg` 都用法，我们先不使用默认的 `make`。使用 `set
makeprg=g++\ %\ -o\ %<` 以使用 `g++` 编译，可以使用 `%`，`#` 字符代替文件名，
注意空格需要转义。

然后 `:make` 以编译程序，再 `:copen` 打开 quickfix 窗口。vim 会自动解析出对应的
行号列号。如图：

![quickfix](/assets/images/quickfix-169da6b1.png)

quickfix 窗口是特殊的 buffer，可以定位到高亮的行，回车来到对应位置。

quickfix 常见操作有：

```vim
:copen       " 打开 quickfix 窗口
:cnext       " 下一个定位位置
:cprev       " 上一个定位位置
:cfirst      " 首个定位位置
:clast       " 末个定位位置
```

可以映射成快捷键以方便操作。

注意：如果你再更改程序时行号改变了，quickfix 不会自动更改行号。

**分割线：以下的内容在实际比赛、考试中意义不大，你没有时间进行详尽的配置。**

<hr/>

当你的编译命令复杂了，你也可以使用 Makefile 来管理你的编译命令（即 GNU Make）。
这时，你的 `makeprg` 便不必配置了，使用默认值即可。

关于如何编写 Makefile，可以参考：

- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [GNU make/Makefile
  简明实用教程](https://literaryno4.github.io/makefile_tutorial.html/)
- [Make 命令教程 -
  阮一峰的网络日志](https://ruanyifeng.com/blog/2015/02/make.html)
- [Makefile Cheat Sheet](https://bytes.usc.edu/cs104/wiki/makefile/)

Make 不仅可以用于编译程序，也可以管理测试样例，对拍的脚本。下面就是一个可以自动
测试样例的 Makefile：

```makefile
CXXFLAGS = -std=c++2a -Wall

%-test: % %.in %.ans
	cat $<.in | ./$< | tee $<.out
	diff $<.out $<.ans 

.PHONY: %-test
```

使用 `make a-test` 自动编译 a.cpp，并将 a.in 输入到 a 又输出到 a.out，再对比
a.out 和 a.ans。`CXXFLAGS` 是指定 Make 编译 C++ 代码时使用的参数。

## 大师：异步编译

以上全部都是同步编译的，在编译时会中断操作，十分影响体验。而 vim8 支持了异步操作，
我们可以在后台运行比较费时的操作，而不打断编辑过程。

首先确保你的 vim 有 channel 和 jobs 特性。

下面是个异步运行 Make 的例子，`ToQuickFix` 表示将编译信息输出到 Quickfix 窗口，
`AsyncMake` 用于异步执行 Make。这是 vim9 的脚本，你也可以把它改写成老式 vim 脚
本。

```vimscript
vim9script

var current_job = null_job

def ToQuickfix(channel: channel, msg: string): void
	setqflist([], 'a', {"lines": split(msg, "\n")})
enddef

def AsyncMake(task: string): void
	if current_job != null_job && job_status(current_job) == "run"
		return
	endif
	setqflist([], "r")
	setqflist([], "r", {"title": "make " .. task})
	current_job = job_start("make " .. task, {"callback": "ToQuickfix"})
enddef

command! -nargs=* AsyncMake :call AsyncMake("<args>")
```

~实际上你竞赛写不写得完题目跟编译是不是异步的一点关系都没有~

## PS

rough 的代码高亮太垃圾了

推荐使用 [ALE](https://github.com/dense-analysis/ale) 异步检查文件语法。

直接在 vim 内置终端里头操作也是不错的选择。

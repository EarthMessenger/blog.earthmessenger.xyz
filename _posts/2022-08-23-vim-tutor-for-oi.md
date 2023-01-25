---
title: OIer 的 VIM 教程
date: 2022-08-23
tags: vim oi continually-updated
---

~缺点：同学没法帮你调代码了~

## 快速在考场上配置 vim

1. 在用户目录创建 `.vimrc`；
2. 追加如下的配置：

```vim
so $VIMRUNTIME/vimrc_example.vim

" 使用空格代替 tab
set expandtab
" 控制缩进宽度
set tabstop=4
set softtabstop=4
set shiftwidth=4
" 自动缩进相关配置
set autoindent
set smartindent
set cindent
" 显示行号相对行号
set number
set relativenumber
" 显示状态栏
set laststatus=2
" 自动 cd
set autochdir
" 启用鼠标，注意，对 Windows 默认终端的支持不太好，推荐使用 gvim
set mouse=a

" C-s 保存
nnoremap <C-s> :w<CR>
```

3. 可选配置：

```vim
" 双押退出编辑模式
inoremap jf <ESC>
inoremap fj <ESC>
" 映射按键 200ms 超时，默认是 1000ms，看自己的手速设置
set tm=200

" 根据语言配置
augroup LangSettings
    autocmd BufRead,BufNewFile *.cpp 
                \ nnoremap <F9> :!g++ % -Wall -std=c++2a -o %<<CR>
                \|nnoremap <F10> :!./%<<CR> 
    autocmd BufRead,BufNewFile *.py
                \ nnoremap <F10> :!python %<<CR>
augroup END
```

注意：

1. `so $VIMRUNTIME/vimrc_example.vim` 主要完成了一些琐碎的工作，如关闭兼容模式，打开 `filetype`，调整 `backspace` 等。
2. 有些命令可以简写，如 expandtab = et，tabstop = ts， softtabstop = sts 等，通常来说只需要 1 分钟左右就能配置好。
3. 推荐使用多用 `nore` 模式，除非你本身就希望递归执行按键。
4. 使用 <kbd>jf</kbd> 和 <kbd>fj</kbd> 映射 <kbd>ESC</kbd>，而不是常见的 <kbd>jk</kbd> 的原因是 OI 中常常需要打 `dijkstra`。
5. Windows 下 `nnoremap <F10> :!./%<<CR>` 应该改为 `nnoremap <F10> :!%<<CR>`。

## 快速入门 vim

vim 自带了一个交互式的教程，终端运行 `vimtutor` 以阅读。

vim 自带的 help 永远是学习 vim 最好的资料，
[vimcdoc.sourceforge.net](https://vimcdoc.sourceforge.net/doc/help.html) 提供了一个中文的 vim 文档。

vim 本身相当复杂，不熟练掌握几十个命令就不能体现其优点，下面介绍几个常用的东西。

### 概念

1. **buffer** 是保存所有打开文件及插件显示内容的东西。
2. **window** 是包含 buffer 的视图。
3. **tab** 是包含 window 的容器，类似各种浏览器的标签页。
4. **register** 是存储文本的地方。复制粘贴就是对 register 的操作。

~说了跟没说一个样~

### 控制 buffer

1. `e` 打开文件
2. `bd` 关闭 buffer
3. `bn` 切换到下个 buffer，可以绑定成快捷键以方便使用
4. `buffers` 显示所有 buffer
5. `buffer + 文件名/编号` 可以跳转到其他 buffer。

### 移动光标

| 键                                               | 效果               |
| :----------------------------------------------- | :----------------- |
| <kbd>h</kbd><kbd>j</kbd><kbd>k</kbd><kbd>l</kbd> | 左下上右           |
| <kbd>w</kbd> <kbd>W</kbd>                        | 跳到下一个单词开头 |
| <kbd>e</kbd> <kbd>E</kbd>                        | 跳到下一个单词结尾 |
| <kbd>b</kbd> <kbd>B</kbd>                        | 跳到上一个单词开头 |
| <kbd>^</kbd>                                     | 跳到“软”行首       |
| <kbd>0</kbd>                                     | 跳到“硬”行首       |
| <kbd>$</kbd>                                     | 跳到行尾           |
| <kbd>C-u</kbd> <kbd>C-d</kbd>                    | 向上翻半页         |
| <kbd>gg</kbd>                                    | 跳转到文件开头     |
| <kbd>G</kbd>                                     | 跳转到文件结尾     |

注：

1. “软”行首与“硬”行首的区别在于，前者指行中第一个可见字符，即不包括缩进，而后者指
   第一个字符包括缩进；
2. <kbd>w</kbd><kbd>e</kbd><kbd>b</kbd> 和 
   <kbd>W</kbd><kbd>E</kbd><kbd>B</kbd> 的区别在于，前者只要是有运算符或空格
   就分一个词，后者只有空格才会分词。如下面的例子，假设光标在行首：

```
    l o r e m ( i p s u m   d o l o r )
w : 0         1 2           3         4
W : 0                       1
```

### 普通模式进入编辑模式的几种命令

| 键           | 效果                                       |
| :----------- | :----------------------------------------- |
| <kbd>i</kbd> | 在光标左边进入插入模式                     |
| <kbd>I</kbd> | 在“软”行首进入插入模式                     |
| <kbd>a</kbd> | 在光标右边进入插入模式                     |
| <kbd>A</kbd> | 在行尾进入插入模式                         |
| <kbd>o</kbd> | 先在光标下插入一行，在再那一行进入插入模式 |
| <kbd>O</kbd> | 先在光标上插入一行，在再那一行进入插入模式 |
| <kbd>s</kbd> | 先删除指定字符，再进入插入模式             |
| <kbd>S</kbd> | 先清空当前行，再进入插入模式               |

### 撤销命令

| 键             | 效果             |
| :------------- | :--------------- |
| <kbd>u</kbd>   | 撤销最后一次修改 |
| <kbd>U</kbd>   | 撤销对整行的修改 |
| <kbd>C-r</kbd> | 反撤销           |

### 分割窗口

1. 使用 `:split` 或 `:vsplit` 以水平/垂直分割窗口。
2. 使用 <kbd>C-w</kbd> + <kbd>h</kbd>/<kbd>j</kbd>/<kbd>k</kbd>/<kbd>l</kbd> 
以左下上右浏览窗口。
3. 使用 <kbd>C-w</kbd> + <kbd>H</kbd>/<kbd>J</kbd>/<kbd>K</kbd>/<kbd>L</kbd> 
以左下上右移动窗口。
4. 使用 <kbd>C-w</kbd><kbd>C-w</kbd> 以按照顺序浏览窗口。
5. 使用 <kbd>C-w</kbd><kbd>=</kbd> 平均划分窗口大小。
6. 使用 <kbd>C-w</kbd> + <kbd>-</kbd>/<kbd>+</kbd> 以减少/增加分割窗口的高度。
7. 使用 <kbd>C-w</kbd> + <kbd>\<<kbd>/<kbd>\></kbd> 以减少/增加窗口宽度。

如果使用了 `set mouse=a` 则可以直接用鼠标控制窗口大小，跳转。

### 映射按键

前面 vimrc 也展示了，我们可以映射按键以简化操作。

对于例子：`nnoremap <C-s> :w<CR>`

1. 开头的第一个 `n` 表示该映射作用于默认模式（normal），其他常用模式有 `i`
（insert)、`x`（visual）、`c`（command）等。不写表示作用于所有模式。
2. `nore` 表示不递归，如果有 `imap a b` 和 `imap b c` 那么按下 <kbd>a</kbd>
的效果就是 <kbd>c</kbd>。
3. `<C-` 表示 <kbd>ctrl</kbd>，`<M-` 表示 <kbd>Meta</kbd>，<kbd>shift</kbd> 
用大写字母表示。

用 `[n/i/x/v]unmap` 取消映射。

许多终端对 <kbd>Meta</kbd> 支持不好，需要特殊配置：
[Skywind：终端里正确设置 ALT 键和 BS 键](http://www.skywind.me/blog/archives/2021)，
然而 gvim 是支持的，开箱即用。配置好后十分方便，不会与自带映射冲突。

可以在按键映射中用 `<leader>` 表示特殊的映射前置键，它默认为 <kbd>\\</kbd>，
可以用 `let g:mapleader = ''` 来配置。`<leader>` 开头的映射也不会与自带映射冲突。

### 缩写

缩写只能用于插入，替换，命令模式。

例子：`iab #i #include` 表示输入 `#i` 后自动替换为 `#include`。

### 搜索与替换

普通模式下键入 `/` 以搜索。推荐 set hlsearch 和 incsearch
（如果应用了 vimrc\_example.vim 就不用了）。

用 <kbd>n</kbd>/<kbd>N</kbd> 以跳转到后/前一个匹配项。

在关键词上按 <kbd>#</kbd>/<kbd>\*</kbd> 前后匹配关键词。

替换用 `:s/匹配/替换/` 命令，表示将匹配串替换成替换串，默认作用于当前行第一个。
在 `s` 前面加范围，在最后一个 `/` 后加选项。

### 复制粘贴

vim 的复制粘贴是借助 registers 实现的，你可以看 `:registers` 查看寄存器中的内容。

<kbd>y</kbd> 表示将选中内容放入寄存器 `"0`，可以在 <kbd>y</kbd> 前键入寄存器名称。
如 `"+y`。大写 <kbd>Y</kbd> 表示复制整行，<kbd>yy</kbd> 也是同样效果。

<kbd>p</kbd> 表示把 `"0` 中内容粘贴，同样也可以附加寄存器名称。大写 <kbd>P</kbd>
是粘到光标前，小写则粘到光标后。

在插入模式中用 <kbd>C-r</kbd> 加寄存器名称（省略引号）可以插入寄存器中内容。

如果要复制到系统剪贴板上，首先需要你的 vim 是有 `+clipboard` feature 的，
然后寄存器 `"+` 就是系统剪贴板。

### 补全操作

选项 completeopt 提供了关于补全的配置，推荐直接用缺省值，注意使用
C-y 确认选项，C-n 和 C-p 切换选项。当然你可以用：

```vim
inoremap <expr> <CR> pumvisible() ? "\<C-y>" : "\<CR>"
```

以使用回车确认选项。

`pumvisible()` 用于判断补全窗口是否显示，使用了判断，所以要加 `<expr>`。
注意到这里触发按键是 <kbd>CR</kbd>， 如果补全窗口不显示最终按下的也是 
<kbd>CR</kbd>，所以这里必须加 `nore` 防止递归。

#### 关键词补全

使用 <kbd>C-n</kbd> 或 <kbd>C-p</kbd> 激活关键词补全，如果函数名变量名较长，
可以只打一段前缀然后使用关键词补全。

<kbd>C-x</kbd><kbd>C-n</kbd> 和单独的 <kbd>C-n</kbd> 的区别在于，
前者补全内容来自所有 buffer，后者只来自当前 buffer。

#### 行补全

对于某些重复出现的行，比如二分中的 `int mid = (l + r) / 2` 之类的，
使用 <kbd>C-x</kbd><kbd>C-l</kbd> 进行行补全。

#### 文件名补全

在 freopen 中，为了防止输错文件名，可以考虑使用 <kbd>C-x</kbd><kbd>C-f</kbd>
进行文件名补全。

#### vim 命令补全

在写 `.vimrc` 时，使用 <kbd>C-x</kbd><kbd>C-v</kbd> 进行 vim 命令补全。

## 其他技巧

### 快速注释代码

使用 <kbd>C-v</kbd> 进入可视块模式，用 <kbd>j</kbd><kbd>k</kbd> 选择需要（反）注释的行，
再按 <kbd>I</kbd> 到行首，添加（去掉）注释符号，最后退出可视模式。

### 调试技巧

vim 8.1 更新了 terminal，同时也带来了基于 terminal 的调试工具。

使用 `packadd termdebug` 激活调试工具，再用 `Termdebug <程序名称>` 来调试。

~悲摧的是我们学校用的是 vim 8.0~

## 考场之外

你还可以安装插件，进一步配置 vim。

### 尝试 neovim

neovim 是 vim 的 fork，没有了 vim 上个世纪九十年代遗留下来的历史包袱，支持 lua，
开发更加积极。

当然现在 vim 9.0 引入了新一代 vim9script，性能比以前更好，语义更加清晰现代，
对于计算敏感的项目 vim9script 要比原先快许多，可以与 lua 打平。

### 安装插件

首先你需要个插件管理器，常见的有：

- [dein.vim](https://github.com/Shougo/dein.vim)
- [vim-plug](https://github.com/junegunn/vim-plug)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)

如果是 neovim 推荐用 [packer.nvim](https://github.com/wbthomason/packer.nvim)。

vim 有数以万计的插件，可以去
[rockerBOO/awesome-neovim](https://github.com/rockerBOO/awesome-neovim) 
或 [vimawesome](https://vimawesome.com/) 寻找需要的插件。

大部分插件托管在 GitHub 上，为了提高安装效率，通常推荐为 `git` 设置代理：
`git config --global http.proxy "foo.bar"`。

不推荐安装太多的插件，也不推荐安装大量影响操作逻辑的插件，防止产生过多的依赖性。

vim 有自己的一套哲学，如果你想通过插件把 vim 配置成 vs，vscode，pycharm 等软件的样子的话，
我推荐你直接使用这些 ide，再加个 vim 扩展。vim 的意义就在于它是一套在几乎所有编辑软件中都能用的操作逻辑，
和它极高的自定义性。

## 扩展阅读

- [Seven habits of effective text editing](https://www.moolenaar.net/habits.html)
- [vim-galore](https://github.com/mhinz/vim-galore)
- [oi-wiki](https://oi-wiki.org/tools/editor/vim/)

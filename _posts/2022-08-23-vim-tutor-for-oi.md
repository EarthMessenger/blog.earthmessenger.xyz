---
title: OIer 的 VIM 教程
date: 2022-08-23
tags: vim oi wip
---

~~缺点：同学没法帮你调代码了~~

## 快速在考场上配置 vim

1. 在用户目录（`~`）创建 `.vimrc`；
2. 使用 `:read $VIMRUNTIME/defaults.vim` 以导入默认 vim 配置；
3. 追加如下的配置：

```vim
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
" 启用鼠标，注意，对 Windows 默认终端的支持不太好，推荐使用 gvim
set mouse=a

" C-s 保存
nnoremap <C-s> :w<CR>
```

当然有些命令字可以简写，如 expandtab = et，tabstop = ts，
softtabstop = sts 等，通常来说只需要 1 分钟左右就能配置好。

编译运行也可以用 nnoremap 配置快捷键，比如
`nnoremap <F9> :!g++ %<CR>` 表示普通模式下 <kbd>F9</kbd>
将代码编译成 `a.out`。

## 快速入门 vim

vim 自带了一个交互式的教程，终端运行 `vimtutor` 以阅读。  
[vimcdoc.sourceforge.net](https://vimcdoc.sourceforge.net/doc/help.html) 提供了一个中文的 vim 文档。

vim 本身相当复杂，不熟练掌握几十个命令就不能体现其优点，下面介绍几个常用的东西。

### 移动光标

| 键                                               | 效果               |
| :----------------------------------------------- | :----------------- |
| <kbd>h</kbd><kbd>j</kbd><kbd>k</kbd><kbd>l</kbd> | 左下上右           |
| <kbd>w</kbd> <kbd>W</kbd>                        | 跳到下一个单词开头 |
| <kbd>e</kbd> <kbd>E</kbd>                        | 跳到下一个单词结尾 |
| <kbd>b</kbe> <kbd>B</kbd>                        | 跳到上一个单词开头 |
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

### 补全操作

选项 completeopt 提供了关于补全的配置，推荐直接用缺省值，注意使用
C-y 确认选项，C-n 和 C-p 切换选项。当然你可以用：

```vim
inoremap <expr> <CR> pumvisible() ? "\<C-y>" : "\<CR>"
```

以使用回车确认选项。

#### 关键词补全

使用 C-n 或 C-p 激活关键词补全，如果函数名变量名较长，可以只打一段前缀
然后使用关键词补全。

#### 行补全

对于某些重复出现的行，比如二分中的 `int mid = (l + r) / 2` 之类的，
使用 C-x C-l 进行行补全。

#### 文件名补全

在 freopen 中，为了防止输错文件名，可以考虑使用 C-x C-f 进行文件名补全。

#### vim 命令补全

在写 `.vimrc` 时，使用 C-x C-v 进行 vim 命令补全。

### 撤销命令

| 键             | 效果             |
| :------------- | :--------------- |
| <kbd>u</kbd>   | 撤销最后一次修改 |
| <kbd>U</kbd>   | 撤销对整行的修改 |
| <kbd>C-r</kbd> | 反撤销           |

> wip

## 其他技巧

### 快速注释代码

使用 C-v 进入可视块模式，用 jk 选择需要（反）注释的行，再按 I 到行首，添加（去掉）注释
符号，最后退出可视模式。

> wip

## 考场之外

你还可以安装插件，进一步配置 vim。

### 尝试 neovim

neovim 是 vim 的 fork，没有了 vim 上个世纪九十年代遗留下来的历史包袱，支持 lua，
开发更加积极。  

### 安装插件

vim 有数以万计的插件，可以去
[rockerBOO/awesome-neovim](https://github.com/rockerBOO/awesome-neovim) 
或 [vimawesome](https://vimawesome.com/) 寻找需要的插件。  
大部分插件托管在 GitHub 上，为了提高安装效率，通常推荐为 `git` 设置代理：
`git config --global http.proxy "foo.bar"`。

不推荐安装太多的插件，也不推荐安装大量影响操作逻辑的插件，防止产生过多的依赖性。

#### nvim 推荐插件

1. [kyazdani42/nvim-tree.lua](//github.com/kyazdani42/nvim-tree.lua)
1. [neovim/nvim-lspconfig](//github.com/neovim/nvim-lspconfig)
1. [L3MON4D3/LuaSnip](//github.com/L3MON4D3/LuaSnip)
1. [nvim-lualine/lualine.nvim](//github.com/nvim-lualine/lualine.nvim)
1. [nvim-treesitter/nvim-treesitter](//github.com/nvim-treesitter/nvim-treesitter)

---
lang: zh-hant
opencc: true
pubDate: 2022-08-23
tags: vim oi continually-updated
title: OIer 的 VIM 教程
---

~~缺點：同學沒法幫你調程式碼了~~

## 快速在考場上配置 vim

1. 在使用者目錄建立 `.vimrc`；
2. 追加如下的配置：

```vim
so $VIMRUNTIME/vimrc_example.vim

" 使用空格代替 tab
set expandtab
" 控制縮排寬度
set tabstop=4
set softtabstop=4
set shiftwidth=4
" 自動縮排相關配置
set autoindent
set smartindent
set cindent
" 顯示行號相對行號
set number
set relativenumber
" 顯示狀態列
set laststatus=2
" 自動 cd
set autochdir
" 啟用滑鼠，注意，對 Windows 預設終端的支援不太好，推薦使用 gvim
set mouse=a

" C-s 儲存
nnoremap <C-s> :w<CR>
```

3. 可選配置：

```vim
" 雙押退出編輯模式
inoremap jf <ESC>
inoremap fj <ESC>
" 對映按鍵 200ms 超時，預設是 1000ms，看自己的手速設定
set tm=200

" 根據語言配置
augroup LangSettings
    autocmd BufRead,BufNewFile *.cpp 
                \ nnoremap <buffer><F9> :!g++ % -Wall -std=c++2a -o %<<CR>
                \|nnoremap <buffer><F10> :!./%<<CR> 
    autocmd BufRead,BufNewFile *.py
                \ nnoremap <buffer><F10> :!python %<CR>
augroup END
```

注意：

1. `so $VIMRUNTIME/vimrc_example.vim` 主要完成了一些瑣碎的工作，如關閉相容模式，開啟 `filetype`，調整 `backspace` 等。
2. 有些命令可以簡寫，如 expandtab = et，tabstop = ts， softtabstop = sts 等，通常來說只需要 1 分鐘左右就能配置好。
3. 推薦使用多用 `nore` 模式，除非你本身就希望遞迴執行按鍵。
4. 使用 <kbd>jf</kbd> 和 <kbd>fj</kbd> 對映 <kbd>ESC</kbd>，而不是常見的 <kbd>jk</kbd> 的原因是 OI 中常常需要打 `dijkstra`。
5. Windows 下 `nnoremap <F10> :!./%<<CR>` 應該改為 `nnoremap <F10> :!%<<CR>`。

## 快速入門 vim

vim 自帶了一個互動式的教程，終端執行 `vimtutor` 以閱讀。

vim 自帶的 help 永遠是學習 vim 最好的資料，
[vimcdoc.sourceforge.net](https://vimcdoc.sourceforge.net/doc/help.html) 提供了一箇中文的 vim 文件。

vim 本身相當複雜，不熟練掌握幾十個命令就不能體現其優點，下面介紹幾個常用的東西。

### 概念

1. **buffer** 是儲存所有開啟檔案及外掛顯示內容的東西。
2. **window** 是包含 buffer 的檢視。
3. **tab** 是包含 window 的容器，類似各種瀏覽器的標籤頁。
4. **register** 是儲存文本的地方。複製貼上就是對 register 的操作。

~說了跟沒說一個樣~

### 控制 buffer

1. `e` 開啟檔案
2. `bd` 關閉 buffer
3. `bn` 切換到下個 buffer，可以繫結成快捷鍵以方便使用
4. `buffers` 顯示所有 buffer
5. `buffer + 檔名/編號` 可以跳轉到其他 buffer。

### 移動游標

| 鍵                                               | 效果               |
| :----------------------------------------------- | :----------------- |
| <kbd>h</kbd><kbd>j</kbd><kbd>k</kbd><kbd>l</kbd> | 左下上右           |
| <kbd>w</kbd> <kbd>W</kbd>                        | 跳到下一個單詞開頭 |
| <kbd>e</kbd> <kbd>E</kbd>                        | 跳到下一個單詞結尾 |
| <kbd>b</kbd> <kbd>B</kbd>                        | 跳到上一個單詞開頭 |
| <kbd>^</kbd>                                     | 跳到“軟”行首       |
| <kbd>0</kbd>                                     | 跳到“硬”行首       |
| <kbd>$</kbd>                                     | 跳到行尾           |
| <kbd>C-u</kbd> <kbd>C-d</kbd>                    | 向上翻半頁         |
| <kbd>gg</kbd>                                    | 跳轉到檔案開頭     |
| <kbd>G</kbd>                                     | 跳轉到檔案結尾     |

注：

1. “軟”行首與“硬”行首的區別在於，前者指行中第一個可見字元，即不包括縮排，而後者指
   第一個字元包括縮排；
2. <kbd>w</kbd><kbd>e</kbd><kbd>b</kbd> 和 
   <kbd>W</kbd><kbd>E</kbd><kbd>B</kbd> 的區別在於，前者只要是有運算子或空格
   就分一個詞，後者只有空格才會分詞。如下面的例子，假設游標在行首：

```
    l o r e m ( i p s u m   d o l o r )
w : 0         1 2           3         4
W : 0                       1
```

### 普通模式進入編輯模式的幾種命令

| 鍵           | 效果                                       |
| :----------- | :----------------------------------------- |
| <kbd>i</kbd> | 在游標左邊進入插入模式                     |
| <kbd>I</kbd> | 在“軟”行首進入插入模式                     |
| <kbd>a</kbd> | 在游標右邊進入插入模式                     |
| <kbd>A</kbd> | 在行尾進入插入模式                         |
| <kbd>o</kbd> | 先在游標下插入一行，在再那一行進入插入模式 |
| <kbd>O</kbd> | 先在游標上插入一行，在再那一行進入插入模式 |
| <kbd>s</kbd> | 先刪除指定字元，再進入插入模式             |
| <kbd>S</kbd> | 先清空當前行，再進入插入模式               |

### 撤銷命令

| 鍵             | 效果             |
| :------------- | :--------------- |
| <kbd>u</kbd>   | 撤銷最後一次修改 |
| <kbd>U</kbd>   | 撤銷對整行的修改 |
| <kbd>C-r</kbd> | 反撤銷           |

### 分割視窗

1. 使用 `:split` 或 `:vsplit` 以水平/垂直分割視窗。
2. 使用 <kbd>C-w</kbd> + <kbd>h</kbd>/<kbd>j</kbd>/<kbd>k</kbd>/<kbd>l</kbd> 
以左下上右瀏覽視窗。
3. 使用 <kbd>C-w</kbd> + <kbd>H</kbd>/<kbd>J</kbd>/<kbd>K</kbd>/<kbd>L</kbd> 
以左下上右移動視窗。
4. 使用 <kbd>C-w</kbd><kbd>C-w</kbd> 以按照順序瀏覽視窗。
5. 使用 <kbd>C-w</kbd><kbd>=</kbd> 平均劃分視窗大小。
6. 使用 <kbd>C-w</kbd> + <kbd>-</kbd>/<kbd>+</kbd> 以減少/增加分割視窗的高度。
7. 使用 <kbd>C-w</kbd> + <kbd>\<<kbd>/<kbd>\></kbd> 以減少/增加視窗寬度。

如果使用了 `set mouse=a` 則可以直接用滑鼠控制視窗大小，跳轉。

### 對映按鍵

前面 vimrc 也展示了，我們可以對映按鍵以簡化操作。

對於例子：`nnoremap <C-s> :w<CR>`

1. 開頭的第一個 `n` 表示該對映作用於預設模式（normal），其他常用模式有 `i`
（insert)、`x`（visual）、`c`（command）等。不寫表示作用於所有模式。
2. `nore` 表示不遞迴，如果有 `imap a b` 和 `imap b c` 那麼按下 <kbd>a</kbd>
的效果就是 <kbd>c</kbd>。
3. `<C-` 表示 <kbd>ctrl</kbd>，`<M-` 表示 <kbd>Meta</kbd>，<kbd>shift</kbd> 
用大寫字母表示。

用 `[n/i/x/v]unmap` 取消對映。

許多終端對 <kbd>Meta</kbd> 支援不好，需要特殊配置：
[Skywind：終端里正確設定 ALT 鍵和 BS 鍵](http://www.skywind.me/blog/archives/2021)，
然而 gvim 是支援的，開箱即用。配置好後十分方便，不會與自帶對映衝突。

可以在按鍵對映中用 `<leader>` 表示特殊的對映前置鍵，它預設為 <kbd>\\</kbd>，
可以用 `let g:mapleader = ''` 來配置。`<leader>` 開頭的對映也不會與自帶對映衝突。

### 縮寫

縮寫只能用於插入，替換，命令模式。

例子：`iab #i #include` 表示輸入 `#i` 後自動替換為 `#include`。

### 搜尋與替換

普通模式下鍵入 `/` 以搜尋。推薦 set hlsearch 和 incsearch
（如果應用了 vimrc\_example.vim 就不用了）。

用 <kbd>n</kbd>/<kbd>N</kbd> 以跳轉到後/前一個匹配項。

在關鍵詞上按 <kbd>#</kbd>/<kbd>\*</kbd> 前後匹配關鍵詞。

替換用 `:s/匹配/替換/` 命令，表示將匹配串替換成替換串，預設作用於當前行第一個。
在 `s` 前面加範圍，在最後一個 `/` 後加選項。

### 複製貼上

vim 的複製貼上是藉助 registers 實現的，你可以看 `:registers` 檢視暫存器中的內容。

<kbd>y</kbd> 表示將選中內容放入暫存器 `"0`，可以在 <kbd>y</kbd> 前鍵入暫存器名稱。
如 `"+y`。大寫 <kbd>Y</kbd> 表示複製整行，<kbd>yy</kbd> 也是同樣效果。

<kbd>p</kbd> 表示把 `"0` 中內容貼上，同樣也可以附加暫存器名稱。大寫 <kbd>P</kbd>
是粘到游標前，小寫則粘到游標後。

在插入模式中用 <kbd>C-r</kbd> 加暫存器名稱（省略引號）可以插入暫存器中內容。

如果要複製到系統剪貼簿上，首先需要你的 vim 是有 `+clipboard` feature 的，
然後暫存器 `"+` 就是系統剪貼簿。

### 補全操作

選項 completeopt 提供了關於補全的配置，推薦直接用預設值，注意使用
C-y 確認選項，C-n 和 C-p 切換選項。當然你可以用：

```vim
inoremap <expr> <CR> pumvisible() ? "\<C-y>" : "\<CR>"
```

以使用回車確認選項。

`pumvisible()` 用於判斷補全視窗是否顯示，使用了判斷，所以要加 `<expr>`。
注意到這裡觸發按鍵是 <kbd>CR</kbd>， 如果補全視窗不顯示最終按下的也是 
<kbd>CR</kbd>，所以這裡必須加 `nore` 防止遞迴。

#### 關鍵詞補全

使用 <kbd>C-n</kbd> 或 <kbd>C-p</kbd> 啟用關鍵詞補全，如果函式名變數名較長，
可以只打一段字首然後使用關鍵詞補全。

<kbd>C-x</kbd><kbd>C-n</kbd> 和單獨的 <kbd>C-n</kbd> 的區別在於，
前者補全內容來自所有 buffer，後者只來自當前 buffer。

#### 行補全

對於某些重複出現的行，比如二分中的 `int mid = (l + r) / 2` 之類的，
使用 <kbd>C-x</kbd><kbd>C-l</kbd> 進行行補全。

#### 檔名補全

在 freopen 中，為了防止輸錯檔名，可以考慮使用 <kbd>C-x</kbd><kbd>C-f</kbd>
進行檔名補全。

#### vim 命令補全

在寫 `.vimrc` 時，使用 <kbd>C-x</kbd><kbd>C-v</kbd> 進行 vim 命令補全。

## 其他技巧

### 快速註釋程式碼

使用 <kbd>C-v</kbd> 進入可視塊模式，用 <kbd>j</kbd><kbd>k</kbd> 選擇需要（反）註釋的行，
再按 <kbd>I</kbd> 到行首，新增（去掉）註釋符號，最後退出可視模式。

### 除錯技巧

vim 8.1 更新了 terminal，同時也帶來了基於 terminal 的除錯工具。

使用 `packadd termdebug` 啟用除錯工具，再用 `Termdebug <程式名稱>` 來除錯。

~悲摧的是我們學校用的是 vim 8.0~

## 考場之外

你還可以安裝外掛，進一步配置 vim。

### 嘗試 neovim

neovim 是 vim 的 fork，沒有了 vim 上個世紀九十年代遺留下來的歷史包袱，支援 lua，
開發更加積極。

當然現在 vim 9.0 引入了新一代 vim9script，效能比以前更好，語義更加清晰現代，
對於計算敏感的專案 vim9script 要比原先快許多，可以與 lua 打平。

### 安裝外掛

首先你需要個外掛管理器，常見的有：

- [dein.vim](https://github.com/Shougo/dein.vim)
- [vim-plug](https://github.com/junegunn/vim-plug)
- [vim-pathogen](https://github.com/tpope/vim-pathogen)

如果是 neovim 推薦用 [packer.nvim](https://github.com/wbthomason/packer.nvim)。

vim 有數以萬計的外掛，可以去
[rockerBOO/awesome-neovim](https://github.com/rockerBOO/awesome-neovim) 
或 [vimawesome](https://vimawesome.com/) 尋找需要的外掛。

大部分外掛託管在 GitHub 上，為了提高安裝效率，通常推薦為 `git` 設定代理：
`git config --global http.proxy "foo.bar"`。

不推薦安裝太多的外掛，也不推薦安裝大量影響操作邏輯的外掛，防止產生過多的依賴性。

vim 有自己的一套哲學，如果你想通過外掛把 vim 配置成 vs，vscode，pycharm 等軟體的樣子的話，
我推薦你直接使用這些 ide，再加個 vim 擴充套件。vim 的意義就在於它是一套在幾乎所有編輯軟體中都能用的操作邏輯，
和它極高的自定義性。

## 擴充套件閱讀

- [Seven habits of effective text editing](https://www.moolenaar.net/habits.html)
- [vim-galore](https://github.com/mhinz/vim-galore)
- [oi-wiki](https://oi-wiki.org/tools/editor/vim/)

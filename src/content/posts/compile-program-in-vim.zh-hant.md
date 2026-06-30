---
lang: zh-hant
opencc: true
pubDate: 2023-02-26
tags: vim oi
title: 在 vim 中編譯程式
---

## 新手：直接使用 map 對映編譯命令

使用這樣的配置：

```vim
nn <F9> :!g++ % -o %< -std=c++2a -Wall<CR>
nn <F10> :!./%<<CR>
```

然後用 F9 編譯，F10 執行。

能用，但是太難用。

## 初學者：根據語言配置不同命令

如果只使用 C++，那麼上面的方法基本可以滿足需求。但你也很有可能需要編寫 Python，
Rust 之類的東西，在這樣配置便不妥了。

可以使用 `autocmd` 來依據語言選擇編譯/執行方式：

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

或者你也可以用 `ftplugin` 來實現：

`~/.vim/ftplugin/cpp.vim`: 

```vim
nn <buffer><F9> :!g++ % -o %< -std=c++2a -Wall<CR>
nn <buffer><F10> :!./%<<CR>
```

`~/.vim/ftplugin/python.vim`:

```vim
nn <buffer><F10> :!python %<CR>
```

你需要在 `vimrc` 中設定 `filetype plugin on` 才能讓 vim 根據檔案型別執行相應的
命令。

## 專家：使用 quickfix 功能加速對 CE 的處理

上面的配置對於普通演算法競賽已經夠用了，然而存在這樣一個問題：如果程式碼 CE，則難以
根據編譯資訊定位錯誤位置。我們可以考慮使用 vim 的 quickfix 功能加速對 CE 的處理。

首先確保你的 vim 有 quickfix 功能：`has('quickfix')`。

然後大概是這個流程：

1. 配置 `makeprg`，預設選項是 `make`，你也可以改成 `clang++`，`g++`，`rustc`
   之類的
2. 使用 `:make` 執行 `makeprg` 中的命令，注意這個 `make` 是 vim 中的命令，輸出
   將會自動輸送到 quickfix 視窗。
3. 開啟 quickfix 視窗並根據資訊修改程式碼。

比如我現在有這樣一份程式碼：

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

這裡為了演示 `makeprg` 都用法，我們先不使用預設的 `make`。使用 `set
makeprg=g++\ %\ -o\ %<` 以使用 `g++` 編譯，可以使用 `%`，`#` 字元代替檔名，
注意空格需要轉義。

然後 `:make` 以編譯程式，再 `:copen` 開啟 quickfix 視窗。vim 會自動解析出對應的
行號列號。如圖：

![quickfix](/assets/images/quickfix-169da6b1.png)

quickfix 視窗是特殊的 buffer，可以定位到高亮的行，回車來到對應位置。

quickfix 常見操作有：

```vim
:copen       " 開啟 quickfix 視窗
:cnext       " 下一個定位位置
:cprev       " 上一個定位位置
:cfirst      " 首個定位位置
:clast       " 末個定位位置
```

可以對映成快捷鍵以方便操作。

注意：如果你再更改程式時行號改變了，quickfix 不會自動更改行號。

**分割線：以下的內容在實際比賽、考試中意義不大，你沒有時間進行詳盡的配置。**

<hr/>

當你的編譯命令複雜了，你也可以使用 Makefile 來管理你的編譯命令（即 GNU Make）。
這時，你的 `makeprg` 便不必配置了，使用預設值即可。

關於如何編寫 Makefile，可以參考：

- [GNU Make Manual](https://www.gnu.org/software/make/manual/)
- [GNU make/Makefile
  簡明實用教程](https://literaryno4.github.io/makefile_tutorial.html/)
- [Make 命令教程 -
  阮一峰的網路日誌](https://ruanyifeng.com/blog/2015/02/make.html)
- [Makefile Cheat Sheet](https://bytes.usc.edu/cs104/wiki/makefile/)

Make 不僅可以用於編譯程式，也可以管理測試樣例，對拍的指令碼。下面就是一個可以自動
測試樣例的 Makefile：

```makefile
CXXFLAGS = -std=c++2a -Wall

%-test: % %.in %.ans
	cat $<.in | ./$< | tee $<.out
	diff $<.out $<.ans 

.PHONY: %-test
```

使用 `make a-test` 自動編譯 a.cpp，並將 a.in 輸入到 a 又輸出到 a.out，再對比
a.out 和 a.ans。`CXXFLAGS` 是指定 Make 編譯 C++ 程式碼時使用的引數。

## 大師：非同步編譯

以上全部都是同步編譯的，在編譯時會中斷操作，十分影響體驗。而 vim8 支援了非同步操作，
我們可以在後臺執行比較費時的操作，而不打斷編輯過程。

首先確保你的 vim 有 channel 和 jobs 特性。

下面是個非同步執行 Make 的例子，`ToQuickFix` 表示將編譯資訊輸出到 Quickfix 視窗，
`AsyncMake` 用於非同步執行 Make。這是 vim9 的指令碼，你也可以把它改寫成老式 vim 腳
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

~實際上你競賽寫不寫得完題目跟編譯是不是非同步的一點關係都沒有~

## PS

rough 的程式碼高亮太垃圾了

推薦使用 [ALE](https://github.com/dense-analysis/ale) 非同步檢查檔案語法。

直接在 vim 內建終端裡頭操作也是不錯的選擇。

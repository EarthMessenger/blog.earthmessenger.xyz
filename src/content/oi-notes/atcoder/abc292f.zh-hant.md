---
lang: zh-hant
opencc: true
tags: at math
title: AtCoder ABC 292 F Regular Triangle Inside a Rectangle
---

給定一個 $a \times b$ 的矩形，求能放在矩形中最大的正三角形。

首先我們先假定 $a \le b$。我們假設答案三角形有至少一個頂點和長方形某個頂點重合。
因為對於任意一個正三角形，每個角都是 $\frac{\pi}{3}$，必然存在一個頂點使得它是
最左上/左下/右上/右下角，可以把這個角對齊到長方形的某一個頂點上。除了這個點，
至少還有一個點在長方形的邊上（除了那個和長方形端點對齊的點），否則答案可以更優。

![triangle](/assets/images/abc292f-230b1d41.png)

如圖，$\triangle AFG$ 是我們要求的答案三角形。$A$ 是和長方形對齊的角，
$F$ 是在 $DC$ 上運動的點。$\triangle ADE$ 也是正三角形，可以證得 $\triangle ADF$
和 $\triangle AEG$ 全等，$E$ 又是頂點，$\angle AEG = \frac{\pi}{2}$，所以 $G$ 
在如圖的綠色直線上移動。$G$ 必須在長方形內，所以當 $G$ 處在 $AB$ 上或 $BC$ 上時
答案最優。

具體來說，當 $b \ge a \sec \frac{\pi}{6}$ 時，$G$ 在 $AB$ 上，答案為 
$a \sec \frac{\pi}{6}$，否則，$G$ 在 $BC$ 上，答案為 $\sqrt{b^2 + \left[\left(a \sec \frac{\pi}{6} - b\right) \tan \frac{\pi}{3}\right]^2}$

```cpp
#define _USE_MATH_DEFINES

#include <cmath>
#include <iomanip>
#include <iostream>

int main()
{
	double a, b;
	std::cin >> a >> b;
	if (a > b) std::swap(a, b);

	std::cout << std::fixed << std::setprecision(15);

	auto maxl = a / std::cos(M_PI / 6);
	if (maxl < b) {
		std::cout << maxl << std::endl;
		return 0;
	}
	auto h = (maxl - b) * std::tan(M_PI / 3);
	std::cout << std::sqrt(b * b + h * h) << std::endl;
}
```

注意：使用 `<cmath>` 中的數學常數需要 `_USE_MATH_DEFINES` 宏。

推薦看看小日本的題解：[F - Regular Triangle Inside a Rectangle
解説](https://atcoder.jp/contests/abc292/tasks/abc292_f/editorial)

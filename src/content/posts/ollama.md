---
title: Ollama 在本地運行 AI
pubDate: 2025-01-28
tags: ai ollama local gpu huggingface llama cpu
lang: zh-hant
---

## 安裝 Ollama

去 https://ollama.com/download ，下載 Ollama。

由於我是 Arch Linux，直接 `pacman -S ollama` 就行。如果有 gpu，還應該考慮根據自
己的 gpu 安裝 `ollama-cuda` 或者 `ollama-rocm`，但是我電腦沒有 gpu，所以就沒有
這一步。

## 運行 Ollama 後臺服務

`ollama serve`，或者 `systemctl start ollama.service` 之類的。

## 下載模型

可以上 https://ollama.com/search 查詢 Ollama，可以直接使用的模型，也可以跑
huggingface 上頭的部分模型。

大模型一般比較大，不是平民老百姓能跑得動的。因此，有 **量化（Quantization）**
和 **蒸餾（Distillation）** 兩種方法來縮小模型規模，以使得小設備也能運行。量化
是減小模型使用的數據類型大小。蒸餾是減少參數規模。比如原來某個模型有 500b 參數，
float32 精度，需要的空間就是 $500 \times 10^9 \times 4 \textrm{bytes} = 2000
\textrm{GB}$，要一個巨大的 gpu 集羣才能跑起來。通過量化和蒸餾，它可以變成 8b 參
數，int4 精度，這樣所需的空間只有 $8 \times 10^9 \times 0.5 \textrm{bytes} = 4
\textrm{GB}$，在普通的電腦裏也能跑起來。但實際上比這個計算出來的大小還要加一點
常數。

根據自己的電腦實際硬件和需求選擇合適的模型。對於我這個普通筆記本電腦，我就選擇
了最近較熱門的 DeepSeek-R1，`deepseek-r1:7b-qwen-distill-q8_0` 版本來嚐鮮。使用
命令 `ollama pull deepseek-r1:7b-qwen-distill-q8_0` 安裝。

這個應該是**最煎熬的**。由於模型數據要去 cloudflare 上下載，且動不動就幾十上百
GB，在國內往往不容易下載。（不過那種幾百 GB 甚至上 TB 級別的模型不用寫 bt 之類
科技，純靠 cloudflare，也確實厲害）

首先可以設代理加速，Ollama 支持 `HTTPS_PROXY` 設置代理，當然給 `ollama serve`
設代理。

我在下載的時候遇到了神祕問題，下載一會兒就斷，而且進度總是回滾。可能本來下到 10%
多，結果突然停，然後又變成 6%。一個奇技淫巧是等速度有一點下降的時候，立即
`Ctrl+C` 殺掉，這樣斷點續傳似乎是沒有問題的。或者寫一個腳本自動化：

```bash
while true; do
timeout 10s ollama pull <model-name>
done
```

參考：https://github.com/ollama/ollama/issues/8484#issuecomment-2608929050

## 使用

終於下載好了模型。直接 `ollama run <model-name>` 就能執行。

我筆記本電腦 13th Gen Intel i5-1340P (16) @ 4.600GHz，運行 7b，q8 的版本，純
cpu 推理，能跑到 4 token/s，雖然有點慢，但將就能用。

直接在 terminal 中用可能不太方便，可以在額外安裝一個圖形化前端，比如 [Open
WebUI](https://github.com/open-webui/open-webui)，選擇特別多，不展開。

## 例子

用弱智吧經典例子來。

**例題**：高考滿分才750，怎麼才能考985？

```
ollama run DeepSeek-R1:7b-qwen-distill-q8_0
>>> 高考满分才750，怎么才能考985？
<think>
嗯，我的高考成绩只有750分，但我想考985大学。这让我有点困惑和焦虑。首先，我要理解为什么我的成绩不够。可能是因为我平时的学习方法不太有效，或者是压力太大导致的发挥失常。接下来，我需要分析一下自己在学习
上的优点和不足。

优点方面，我觉得自己很勤奋，每天都会花很多时间复习和做题，而且对于喜欢的科目比如数学、物理比较感兴趣，学起来也更有动力。但是在语文和英语方面，成绩就不太理想了，尤其是阅读理解总是丢分，这让我觉得比较
着急。

那问题出在哪里呢？可能是我在学习方法上没有调整，导致在某些科目上投入了很多时间却没有得到相应的提升。也许我应该尝试一些更适合自己的学习策略，比如把重点放在薄弱环节上，而不是均匀地分配时间到所有科目上
。

关于英语，我发现自己单词背得很多，但在考试中遇到一些不常见的词汇时就会卡壳，无法发挥好。这可能是因为死记硬背没有真正理解单词的用法和语义关系，导致在实际应用中不够灵活。我需要找到一种更有效率的记忆方
法，比如通过句子练习来理解单词的含义。

语文方面，阅读理解部分总是丢分，可能是因为我缺乏有效的阅读技巧和分析方法。有时候，我会直接逐字翻译文章，而忽略了整体把握文章主旨和段落结构的重要性。也许我可以学习一些提高阅读效率的方法，比如先快速浏
览文章，再重点分析关键句和主题句。

除了学习方法，我还要考虑时间管理的问题。高考的时间分配是否合理？在语文考试中，我可能花太多时间在最后一道大题上，导致前面的大题没有完成。这让我意识到，在平时的练习中需要更加注重对各科时间的掌控，合理
安排每一道题目的答题时间。

复习方面，我的复习计划可能过于机械，只是简单地重复做题和记忆知识点，缺乏深度和针对性。我应该根据自己的薄弱环节调整复习重点，进行更有针对性的知识点复习，同时多做一些综合性的题目来提升综合运用能力。

另外，心理压力也是一个重要因素。高考的紧张和焦虑让我在考试中表现不佳，尤其是面对熟悉的题目时，反而因为过度紧张而出现了失误。我需要找到缓解压力的方法，比如通过运动、冥想等方式放松自己，保持冷静的状态
。

接下来，我要制定一个切实可行的计划来提升我的成绩。首先，在语文方面，我会重点练习阅读理解题型，学习如何快速抓住文章主旨和关键信息；在英语方面，我会通过句子练习来提高词汇的灵活运用能力，并开始学习写作
的基本技巧；数学方面，我会针对自己薄弱的知识点进行系统复习，并多做一些综合性的题目来提升解题速度和准确性。

复习计划上，我打算每周安排固定的复习时间，将时间分配到各个科目上，确保每个科目都有足够的练习。同时，我会定期模拟真实的考试环境，进行实战演练，逐步提高自己的应试能力。

在备考过程中，我也需要关注自己的身体状况。保证充足的睡眠，避免过度疲劳；合理饮食，保持良好的状态；适度运动，释放压力，提升整体的健康水平。

此外，我还需要关注自己的心态调整。遇到困难和挫折时，及时进行自我调节，避免过于焦虑和自责。学会从失败中吸取教训，保持积极向上的态度，这将有助于我在未来的复习中更加高效地学习。

通过以上的分析和思考，我认为提高成绩的关键在于找到适合自己的学习方法，并且在日常的学习中不断调整和完善自己的策略。同时，合理的规划和科学的复习方法能够有效提升我的学习效率和效果。在这个过程中，我需要
有足够的耐心和毅力，克服困难，最终实现从750分到985的目标。

当然，在这整个过程中，我也可能会遇到各种各样的问题和挑战，比如时间管理上的不足、知识点掌握不牢固等。这时候，我需要保持积极的心态，不断调整自己的学习方法和计划，寻求在复习中得到提升。同时，如果有条件
的话，可以寻求老师或同学的帮助，共同探讨更好的学习策略。

总的来说，从750分到985的目标虽然看似遥远，但只要能够找到适合自己的学习方法，并且坚持不懈地努力，是完全有可能实现的。我相信通过合理的规划和科学的复习，我能够在未来的高考中取得理想的成绩。
</think>

为了从750分提升到985分，可以按照以下步骤进行：

1. **自我评估与分析**：
   - 识别自己的学习优势和不足，明确目标学校的要求。
   - 分析高考各科的考试重点和自身薄弱环节。

2. **优化学习方法**：
   - 针对薄弱科目（如语文阅读理解、英语写作）制定专项计划。
   - 学习高效的学习策略，如分模块复习、知识点归纳等。

3. **加强基础与技巧**：
   - 重点复习语数外的基础知识和高频考点。
   - 提高解题速度和准确率，掌握应试技巧。

4. **模拟考试与调整策略**：
   - 进行多次模拟考试，熟悉高考题型和时间分配。
   - 根据模拟结果调整复习计划和答题策略。

5. **合理的时间管理和健康习惯**：
   - 制定详细的学习和复习计划，确保各科目平衡分配时间。
   - 保持良好的作息，适度运动，释放压力。

6. **寻求帮助与资源利用**：
   - 向老师、同学请教学习方法和考试技巧。
   - 使用优质的教材和辅导资料进行复习。

7. **保持积极心态与自我激励**：
   - 面对挑战不气馁，学会从失败中吸取教训。
   - 设定短期目标，逐步实现长期规划。

通过以上步骤的系统实施，结合持续的努力和科学的方法，相信可以从750分提升到985分的目标。
```

弱智吧還是太有難度了，試試其他的。

```
ollama run DeepSeek-R1:7b-qwen-distill-q8_0
>>> 简单介绍矩阵树定理。
<think>
好，我来试着理解一下矩阵树定理。首先，这个定理好像和图论有关，具体是
关于树的计数吧？我记得在离散数学里学过一些图的基本概念，比如节点、边
、生成树之类的。

那矩阵树定理到底是怎么回事呢？它的名字听起来像是用矩阵来计算某种树的
数量。我猜可能涉及到构造一个矩阵，然后通过这个矩阵的一些属性来计算不
同的生成树的数量。生成树是指在连通的无向图中，包含所有顶点的树结构，
对吧？

那么，首先需要明确几个概念：基尔霍夫矩阵或者叫做度数矩阵？和别的什么
矩阵结合在一起使用吗？是不是有拉普拉斯矩阵的概念在这里面？哦，对了，
拉普拉斯矩阵可能就是用来计算生成树的数量的。

我记得在构造拉普拉斯矩阵的时候，需要先把图的邻接矩阵处理一下。具体来
说，拉普拉斯矩阵L是一个n×n的矩阵（假设图有n个顶点），其中对角线元素
L[i][i]等于该顶点的度数，非对角线元素L[i][j]等于-1如果顶点i和j之间有
一条边，否则为0。

那么，接下来怎么用这个矩阵来计算生成树的数量呢？是不是删掉一行一列后
的行列式的绝对值就是生成树的数量？或者说是所有可能的n-1阶主子式的行
列式乘积？

对了，我记得有一个名字叫做基尔霍夫定理，也就是矩阵树定理，它说的是：
图的生成树数量等于其拉普拉斯矩阵的任何一个n-1阶主子式的行列式的绝对
值。也就是说，我们可以随便去掉一行和对应的列，然后计算剩下的矩阵的行
列式，这个行列式的绝对值就是生成树的数量。

那具体到计算的时候，是不是可以选择任意删掉一行和一列，比如最后一行和
最后一列？这样可以简化计算吗？因为有时候最后一行或列可能有很多零或者
其他特性，方便计算行列式？

举个例子吧。比如说一个有3个顶点的完全图K3。它的拉普拉斯矩阵应该是怎
样的呢？每个顶点度数都是2，所以对角线元素都是2；边存在的话非对角线位
置是-1。比如：

L = [
[2, -1, -1],
[-1, 2, -1],
[-1, -1, 2]
]

如果我们删掉第三行和第三列，剩下的矩阵就是：
[
[2, -1],
[-1, 2]
]
这个矩阵的行列式是 (2)(2) - (-1)(-1) = 4 - 1 = 3。所以生成树的数量应
该是3，确实K3有三个生成树。

那如果是更复杂的图呢？比如一个有n个顶点的完全图Kn，每个顶点度数都是
n-1，拉普拉斯矩阵的构造也是一样的，删掉一行一列后的行列式是
(n-1)^{n-2}。所以根据矩阵树定理，完全图的生成树数量应该是这样的。

那再比如说一个简单的环形图，四个顶点形成一个环。每个顶点度数都是2，
拉普拉斯矩阵对角线为2，非对角线相邻的位置是-1，其他位置为0：

L = [
[2, -1, 0, -1],
[-1, 2, -1, 0],
[0, -1, 2, -1],
[-1, 0, -1, 2]
]

删掉第四行和第四列后，剩下的矩阵是：
[
[2, -1, 0],
[-1, 2, -1],
[0, -1, 2]
]
这个矩阵的行列式是多少呢？让我算一下：

计算3x3矩阵的行列式：按第一行展开，
= 2*(2*2 + (-1)*(-1)) - (-1)*( -1*2 + 0*(-1) ) + 0*(...)
= 2*(4+1) - (-1)*(-2 + 0)
= 2*5 - (2)
= 10 - 2 = 8
所以生成树的数量是8。但实际上，四个顶点形成一个环的图有多少生成树呢
？应该是每个边都可能被删除，所以生成树数量应该是4吗？

哦，这似乎有问题。或许我的计算哪里错了。或者是不是完全不同的情况？

等等，四顶点环的话，生成树应该是一个环去掉一条边后的线段结构，这样的
生成树数量等于边的数量，也就是4条边，每条边的删去都会得到一个生成树
。所以应该是4个生成树。

但是根据矩阵计算出来的结果是8，这和实际不符啊。哪里出问题了？

可能我的拉普拉斯矩阵是否正确呢？或者是不是删掉的是对的位置？

不，在四个顶点环的情况下，每个顶点度数为2，没错；拉普拉斯矩阵是对的
。那删掉第四行和列之后得到的矩阵的行列式计算结果是8，但实际生成树数
量应该是4。

这说明哪里有问题吗？是不是我的应用有误？

哦，可能是因为图不是连通的时候，才会用到这个定理。不，四顶点环是一个
连通图啊。或者是不是我对拉普拉斯矩阵的理解有误？

等等，或许删除的是第三行和列而不是第四行呢？或者说，在删除前是否需要
对矩阵进行处理？

或者是我的计算行列式时哪里错了？

再重新算一下那个3x3的行列式：

矩阵是：
2  -1   0
-1  2  -1
0  -1  2

计算行列式：

第一项：2 * det([[2, -1], [-1, 2]]) = 2*(4 - 1) = 6
第二项：-(-1) * det([[-1, -1], [0, 2]])，即 +1 * ( (-1)(2) -
(-1)*0 )= +1*(-2)= -2
第三项：0乘以别的东西，不影响结果。

所以总行列式是6 + (-2) =4。这样的话，删掉第四行和列后的行列式为4，绝
对值就是4，和实际情况一致了。

哦，对啊，我之前可能在计算的时候弄错了符号或者展开的方式，导致结果错
误。正确的3x3行列式应该是4，所以生成树的数量是4，符合实际的情况。

看来矩阵树定理确实可以有效地计算生成树的数量，只要正确构造拉普拉斯矩
阵并计算其子式的行列式即可。

那总结一下：矩阵树定理指出，对于连通图G，其生成树数量等于其拉普拉斯
矩阵的任意n-1阶主子式的行列式的绝对值。这个方法在处理复杂图的时候特
别有用，尤其是当手动计算比较困难时。
</think>

矩阵树定理（也称为基尔霍夫定理）是图论中一个重要的工具，用于计算连通
图生成树的数量。具体步骤如下：

1. **构造拉普拉斯矩阵**：对于给定的图G，构建其拉普拉斯矩阵L。该矩阵
为n×n的方阵（n为顶点数），其中对角线元素L[i][i]等于顶点i的度数，非
对角线元素L[i][j]等于-1如果顶点i和j之间有一条边，否则为0。

2. **选择主子式**：从拉普拉斯矩阵中任意删去一行和对应的列（通常删除
最后一行和列以简化计算），得到一个(n-1)×(n-1)的子矩阵M。

3. **计算行列式**：py求解子矩阵M的行列式的绝对值。该结果即为图G生成树
的数量。

**例子验证**：
- 对于完全图K₃，拉普拉斯矩阵的某个2×2主子式行列式为3，确实有3棵生
成树。
- 对于四顶点环图，正确计算后得到4个生成树，符合实际情况。

通过矩阵树定理，我们可以系统地用线性代数的方法解决复杂图中生成树数量
的计数问题。
```

還是不錯的，中途思考時行列式計算錯了，後頭還能自己糾正過來。

斷行是 Ollama 自動根據終端寬度斷的，兩個例子斷行不太一樣。

## 總結

曾經以爲只能在機房，成百上千 gpu 組到一起的集羣，纔能跑的大模型，現在只需要一個
簡單的程序，普通電腦就能絲滑運行，實在是巨大的進步。讓普通人在自家電腦上，不用
聯網，就能體驗到大模型的魅力。

但是普通筆記本電腦能跑的 7b 版本智力還是有些低。希望未來能有更小但更聰明的大模型😇️。

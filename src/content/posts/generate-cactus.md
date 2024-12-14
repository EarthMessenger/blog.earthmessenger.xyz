---
title: 造仙人掌
pubDate: 2024-12-14
tags: generator graph-theory oi
lang: zh-hant
---

思路是先造一棵樹，然後再將樹上節點換成 BCC。

```python
import sys
import random

def generate_cactus(n, s):
    cnt = 0
    edges = set()
    cycles = []

    def add_edge(u, v):
        edges.add((min(u, v), max(u, v)))

    def add_cycle(parent):
        nonlocal cnt
        size = random.randint(2, s)
        nodes = []
        if parent != -1:
            nodes.append(parent)
        while len(nodes) < size:
            nodes.append(cnt)
            cnt += 1
        for i in range(size):
            add_edge(nodes[i], nodes[(i + 1) % size])
        cycles.append(nodes)

    add_cycle(-1)

    for i in range(1, n):
        add_cycle(random.choice(cycles[random.randrange(i)]))

    return cnt, list(edges)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(f'usage: {sys.argv[0]} n s seed')
        sys.exit(-1)

    random.seed(sys.argv[-1])
    n = int(sys.argv[1])
    s = int(sys.argv[2])

    cnt, edges = generate_cactus(n, s)

    print(cnt, len(edges))
    print("\n".join(f"{u + 1} {v + 1}" for u, v in sorted(edges)))
```

`n` 是 BCC 的數量，`s` 是最大 BCC 的大小。

~~又水了一篇文章。~~

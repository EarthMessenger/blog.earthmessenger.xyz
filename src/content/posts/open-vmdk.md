---
title: 使用 QEMU 打开 VMware 的 vmdk 文件
pubDate: 2023-12-16
tags: trick
---

每次需要用的时候都要上网查，挺常用的一个技巧，记录一下。

需要用到的工具是 qemu-nbd，对于 archlinux 用户，这个程序在 extra/qemu-img 中。
它的作用是将一个 qemu 磁盘映像通过 nbd 协议映射出去。同时 qemu 也不止支持 vmdk
文件，可以通过 `qemu-img -h` 查看所有支持的磁盘映像格式。

首先需要启用 nbd 模块，使用 `sudo modprobe nbd`，这样可以直接将 qemu 打开的磁盘
映像连接到 /dev/nbdX。可以用 `ls /dev/nbd*` 检查是否多了几个 nbd 设备。

然后使用 qemu-nbd：`sudo qemu-nbd -c /dev/nbdX image.vmdk`。其中 nbdX 是你希望
连接到的 nbd 设备名称，image.vmdk 是文件名。运行 `ls /dev/nbdX*` 可以发现多了几
个形如 `nbdXpY` 的文件，这些就可以当作正常分区使用了。同时 `/dev/nbdX` 现在也可
以当作一个正常的块设备，你可以对他重新分区之类的。

如果要关闭磁盘映像，使用 `sudo qemu-nbd -d /dev.nbdX` 即可。

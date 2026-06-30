---
lang: zh-hant
opencc: true
pubDate: 2023-12-16
tags: trick
title: 使用 QEMU 開啟 VMware 的 vmdk 檔案
---

每次需要用的時候都要上網查，挺常用的一個技巧，記錄一下。

需要用到的工具是 qemu-nbd，對於 archlinux 使用者，這個程式在 extra/qemu-img 中。
它的作用是將一個 qemu 磁碟映像通過 nbd 協議映射出去。同時 qemu 也不止支援 vmdk
檔案，可以通過 `qemu-img -h` 檢視所有支援的磁碟映像格式。

首先需要啟用 nbd 模組，使用 `sudo modprobe nbd`，這樣可以直接將 qemu 開啟的磁碟
映像連線到 /dev/nbdX。可以用 `ls /dev/nbd*` 檢查是否多了幾個 nbd 裝置。

然後使用 qemu-nbd：`sudo qemu-nbd -c /dev/nbdX image.vmdk`。其中 nbdX 是你希望
連線到的 nbd 裝置名稱，image.vmdk 是檔名。執行 `ls /dev/nbdX*` 可以發現多了幾
個形如 `nbdXpY` 的檔案，這些就可以當作正常分割槽使用了。同時 `/dev/nbdX` 現在也可
以當作一個正常的塊裝置，你可以對他重新分割槽之類的。

如果要關閉磁碟映像，使用 `sudo qemu-nbd -d /dev.nbdX` 即可。

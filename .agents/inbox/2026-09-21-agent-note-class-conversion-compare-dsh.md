# Inbox: 检查 Agent Note 的 class 转换逻辑是否与 dsh 一致

Status: open
Type: bug
ID: Bug-0002

## Spark
本仓库的 Agent Note class 转换逻辑（inbox spark 的 `Type` 映射到 `notes/{lifecycle}/{class}/` 的那套派生规则）需要和 dsh 那边的同套逻辑对一遍，确认二者一致。两边现在各有一份实现（`adlc-inbox-promote` 与 dsh 的 `kit-inbox-promote`），若 class 集合或 type→class 映射已经分叉，同一条 spark 在两个仓库会落进不同的 class 目录，属于已经存在的漂移，而不是新功能。

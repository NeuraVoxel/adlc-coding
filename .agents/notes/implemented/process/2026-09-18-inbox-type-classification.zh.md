# Agent Note: Inbox 灵感带 Feature/Bug 类型

Status: implemented

## Problem

inbox 原来只有一条轴 `Status`，扫队列只能回答「还开着吗」，回答不了「这是要做的新东西，还是已经坏掉的东西」。两类灵感升格时需要不同处理：新能力要设计方案，缺陷要修复记录，而 Agent Note 树已经把它们分在 `feature/` 与 `bug-fix/` 两个 class。没有记录类型，这个选择每次升格都要从正文里重新读一遍；混在一起的队列也无法只扫其中一类。

## Decision

每条 inbox spark 增加第二条头部轴 `Type`，取值封闭：`feature`（尚不存在的东西——新能力、新契约、新流程，或对既有者的改进）与 `bug`（已经错了的东西——缺陷、漂移，或对本仓库既有契约的违反）。它写在 spark 文件里 `Status` 的正下方，并在 [`QUEUE.md`](../../../inbox/QUEUE.md) 每行链接前以标签呈现（`- [ ] [feature] [标题](./yyyy-mm-dd-slug.md)`）。类型捕获一次即定，不随 status 变化：升格与丢弃后仍保留捕获时的类型。

升格由类型推导 Agent Note 的 class：`feature` → `notes/proposed/feature/`，`bug` → `notes/proposed/bug-fix/`。明确指定的 class 优先；类型缺失或含糊时提问一次，不猜。两个 [inbox 技能](../../../skills/kit-inbox-capture/SKILL.md)遵循同一规则：capture 负责把类型落定而非静默缺省，promote 负责映射而非从头再问。

类型是约定，不是门禁：inbox 仍在一切 format gate 之外，[inbox README](../../../inbox/README.md) 是它唯一的权威。

## Alternatives considered

- **类型做成目录（`inbox/feature/`、`inbox/bug/`）。** 落选：inbox 是平铺的捕获面；目录化让每次捕获变成一次归档决策、每次改判都要移动文件，还会弄断已升格 spark 的链接，却没有比头部字段更严格。
- **类型只写在 `QUEUE.md`，用 `## Feature` / `## Bug` 小节分组。** 落选：单独打开 spark 文件时就看不出它是什么类型了；而升格后留存的是文件，队列行只是一层视图。
- **像 Agent Note 树那样给类型上门禁（`verify-inbox-*`）。** 暂不选：inbox 刻意在所有 format gate 之外，而 spark 的全部意义就是捕获要便宜。若标签真与文件漂移了再议。
- **更大的类型集合（chore、spike、research）。** 推迟：两个取值覆盖了迄今捕获的全部 spark，且都能映射到既有 Agent Note class；第三个取值得先有可映射的 class 才配存在。

## Consequences

扫队列可以只看缺陷或只看新能力，不必逐条打开文件；升格从一个 class 起步，而不是先做一次阅读理解。代价是每次捕获多写一行和一个标签，两个 inbox 技能也多带一条规则。此前的 spark 没有 `Type`：现存两条已手工归类（可视化 app 为 `feature`，引用完整性缺口为 `bug`），其余历史条目在首次触碰时补上类型。

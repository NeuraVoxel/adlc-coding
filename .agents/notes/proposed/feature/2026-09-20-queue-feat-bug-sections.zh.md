# Agent Note: 把 inbox 看板分成 Feat 在上、Bug 在下两组

Status: proposed

## Problem

[`QUEUE.md`](../../../inbox/QUEUE.md) 现在是一条按捕获时间新 → 旧的平铺列表，`Feat-` 与 `Bug-` 行交错出现。任务编号取代类型标签之后，行首标签里的前缀是唯一能说明类别的信号，想只扫一类就得逐行读过、在脑内过滤。而看板恰恰是扫队列时第一个打开的文件；分组目前只存在于 `adlc-inbox-view` 的渲染结果里，不在看板本身。

## Proposal

把看板在 `# Inbox queue` 标题下分成两组：`## Feat` 在上，`## Bug` 在下。行本身格式不变——`- [ ] [Feat-0002] [标题](./yyyy-mm-dd-slug.md)`，已离队的行继续保留 `[x]` 与 `→ [Agent Note](…)` 链接——组内仍按新 → 旧排列。新的 `feature` spark 插到 `## Feat` 组顶部，新的 `bug` spark 插到 `## Bug` 组顶部；某组没有行时该组省略。

新的看板形状写进 [inbox README](../../../inbox/README.md) 双份：`## QUEUE.md` 一节说明两组与组内排序，捕获步骤说明新行进哪一组，扫队列段落说明一次扫一组。两种语言同批修改——这对文件在结构上受门禁约束。三个 inbox skill 同步跟随：capture 插进对应组，promote 就地翻转行，view 继续按类型分组（与现在一致）。

spark 见：[Feat-0002](../../../inbox/2026-09-20-queue-feat-bug-sections.md)。

## Alternatives considered

- **保持平铺列表，靠 `Feat-` / `Bug-` 前缀（或 `adlc-inbox-view`）过滤。** 落选：看板正是扫队列时打开的文件，过滤平铺列表就是本次想去掉的那种逐行阅读；view 只在被要求时才渲染表格，并不改变看板本身的样子。
- **只按类别排序、不加分组标题。** 落选：两类之间没有可见边界，读者仍要找在哪里断开；两个 `##` 标题没有任何成本，还能让分组一眼可验。
- **拆成两个看板文件（`QUEUE-Feat.md` / `QUEUE-Bug.md`）。** 落选：合同规定的看板就是一个 `QUEUE.md`，所有链接、skill 与扫队列步骤都指向它；拆成两个文件会破坏全部这些，只换来同样的分组。
- **先按状态分组（`[ ]` 在上、`[x]` 在下），再按类别。** 落选：每次升格与丢弃都会让行在两组之间搬家；类别永不变，这才是适合作为第一轴的维度。

## Acceptance criteria

- `QUEUE.md` 以 `# Inbox queue` 开头，其下依次是 `## Feat` 组与 `## Bug` 组，组内新 → 旧；空组省略。
- 每行保留编号标签、标题与链接；已离队的行保留 `[x]` 及 `→ [Agent Note](…)` 链接。
- inbox README 双份都写明分组后的形状，`pnpm run doc-sync` 通过。
- `adlc-inbox-capture` 按类型把新行插进对应组；`adlc-inbox-promote` 就地翻转该行；`adlc-inbox-view` 的输出含义不变。

## Risks

- 看板不再是单一的时间序列表：新 → 旧只在组内成立，靠行序读取"全局最新"的人会失去这个信号。行内文件名仍带捕获日期，但 README 里关于排序的说法必须随形状一起改。
- 三个 inbox skill 都会读或写行；只有一部分学会分组，捕获就会插错位置，看板会与自己的合同漂移。因此它们要同批改完。
- `QUEUE.md` 本身在门禁之外，分组写错不会有任何门禁失败——校验手段是受门禁约束的 README 双份，以及评审。

# Agent Note: `QUEUE.md` 行按正序排列（先捕获的在前）

Status: implemented

## Problem

[`QUEUE.md`](../../../inbox/QUEUE.md) 原先在每个分组内按倒序排列，最新的在最上面。这个顺序是从扁平看板继承下来的，并且在改成分组时保留了下来：[Feat-0002](../feature/2026-09-20-queue-feat-bug-sections.md) 把看板拆成 `## Feat` 在上、`## Bug` 在下，却沿用了旧的"组内倒序"，而 [inbox README](../../../inbox/README.md) 把它写成了规则——"Order: newest capture first **inside a group**"。capture 严格照做：README 的 Capture 第 2 步与 [`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) 的第 5 步，都把新行插到所属组的组首。

于是看板的阅读方向与队列的用途相反。自上而下读 `## Feat`，走的是 Feat-0007 → Feat-0001：等得最久的那条火花在最底下，而每次 capture 都把整组往下一行推。recency 曾经是扁平看板唯一的轴；分组之后，组内顺序只表达 recency，而 recency 恰恰是 sweep 不需要从看板上读的东西——行里的文件日期与 ID 已经带着它。

当时没有任何东西是坏的：README 写明了顺序，capture 也照做。本次改的是这条既定规则，而不是修补一次违规。

## Decision

组内按先捕获在前排列：同类型中 ID 最小的在最上面，向下递增，于是 `## Feat` 读作 Feat-0001 → Feat-0007，`## Bug` 从 Bug-0001 起向上。capture 改为追加——新行成为所属组的最后一行，它上面的任何行都不移动。

已离开的行保留它被捕获时所在的槽位：[`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) 与丢弃都是就地翻转一行，因此 `[x]` 行停在它被捕获的位置，整组仍然是到达顺序。分组、行格式与 ID 标签完全保持 Feat-0002 定下的样子，只改变组内顺序的方向；那条 note 对顺序的陈述也随之改为正序。

[inbox README](../../../inbox/README.md) 对承载这条规则：`## QUEUE.md` 的顺序条目写"组内先捕获的在前"，Capture 第 2 步把行追加到所属组的末行。两种语言一致，因为 `verify-doc-pairing` 在 `doc-sync` 里检查这对文件的结构。[`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) 第 5 步改为追加到组尾；升格与丢弃不变。看板本身随规则一起重排为正序。

见火花：[Feat-0006](../../../inbox/2026-09-21-queue-ascending-order.md)。

## Alternatives considered

- **保留倒序，让 sweep 自下而上读。** 落败原因：阅读顺序仍然是火花里说的那个反向顺序，而"从底下读"是一条必须单独告知每个读者和每个 agent 的规则；把文件翻过来只要一次改动，并且不需要任何人记住。
- **capture 继续前插，另写一条排序规则（"行按 ID 升序排序"）。** 落败原因：它描述的是同一张看板，却多出一条 capture 仍须手工遵守的规则；由于 inbox 在所有 gate 之外，排序键只能靠眼睛检查，而"追加到组尾"本身就是那个操作。
- **按状态排序——`[ ]` 在上、`[x]` 在下——再按捕获顺序排。** 落败原因：每次升格与丢弃都会改变状态，行会在组间反复跳动；捕获顺序才是永不变化的轴，因此它才是排序键。
- **什么都不做，倒序看板只是有点别扭。** 落败原因：每次 capture 都会重演火花里点名的那次碰撞，而看板会继续把读者训练成"等得最久的条目在最后"。

## Consequences

sweep 自上而下读一个组就是到达顺序，等得最久的未完成行是该组第一条 `[ ]`，刚捕获的火花在最后一行。capture 不再移动任何既有行，升格与丢弃依旧就地翻转一行而不改变位置。

规则写在受门禁保护的 README 对里，而不是只写在文件里，因此它不会在没人察觉的情况下漂出文档描述的形状——`pnpm run doc-sync` 或 reviewer 会看到；看板文件本身在所有 gate 之外，一次违反规则的前插不会让任何门禁失败。代价是：组的末尾现在成了需要关注的一端，最新一行与已离队行的链接都在那里。

两处分歧仍然留着。[`adlc-inbox-view`](../../../skills/adlc-inbox-view/SKILL.md) 的表格仍按最新在前渲染所有火花，于是看板与 view 方向相反；是否对齐没有纳入本次改动。另外，顺序被表述为"按 ID 升序"，它只在每个火花的编号都是捕获时分配的前提下才等于捕获顺序——补号的火花，或日后的任何重编号，都会让"按 ID 升序"与"先捕获在前"变成两张不同的看板。

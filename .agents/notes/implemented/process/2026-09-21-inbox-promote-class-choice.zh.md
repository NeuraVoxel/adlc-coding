# Agent Note: Choose the Agent Note class deliberately at promotion

Status: implemented

## Problem

inbox 与 Agent Notes 树各自用一条轴分类，而晋级用一个有损默认值把两者接了起来。inbox 条目携带的 `Type` 来自二元闭集——`feature` 表示尚不存在的东西，`bug` 表示已经错了的东西（[inbox README](../../../inbox/README.md)）——而 Agent Note 携带的 `class` 来自六元闭集——`feature`、`bug-fix`、`simplification`、`architecture`、`process`、`testing`（[Classification](../../README.md#classification)）。`Type` 记录想法从哪来；`class` 记录这条 note 属于哪一类决策。

晋级把前者机械地映射到后者：`feature` → `feature`、`bug` → `bug-fix`，显式给出的 class 可覆盖（[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md)）。capture 保证每条 spark 都带 `Type`，于是那条本该捕获**缺失**类型的分支从未触发；默认路径永远落在 `feature` 或 `bug-fix`，另外四个 class 在晋级通道里不可达。

本仓库里早就存着反例。同一种改动，因进入树的路线不同，落在两个 class：

| Note | 领域 | 进入路线 | Class |
|---|---|---|---|
| [inbox-view-skill](../process/2026-09-20-inbox-view-skill.md) | inbox skill | 直接撰写 | `process` |
| [inbox-spark-ids](../process/2026-09-20-inbox-spark-ids.md) | inbox 编号 | 直接撰写 | `process` |
| [inbox-queue-empty-state](../process/2026-09-20-inbox-queue-empty-state.md) | 队列看板 | 直接撰写 | `process` |
| [promote-skill-ask-before-implement](../feature/2026-09-21-promote-skill-ask-before-implement.md) | inbox skill | 晋级 | `feature` |
| [zcode-agent-compat](../feature/2026-09-21-zcode-agent-compat.md) | skills 工具链 | 晋级 | `feature` |
| [queue-feat-bug-sections](../feature/2026-09-20-queue-feat-bug-sections.md) | 队列看板 | 晋级 | `feature` |
| [queue-ascending-order](../feature/2026-09-21-queue-ascending-order.md) | 队列看板 | 晋级 | `feature` |

改 inbox skill 的改动，手写是 `process`、晋级是 `feature`；改队列看板的改动同样一分为二。class 追随的是路线，不是决策本身。

另有一处缺陷共享同一盲区。note 在生命周期目录间迁移时会留下过期的入链，而这些链接位于没有任何门禁扫描的表面上。`QUEUE.md` 与 [zcode spark](../../../inbox/2026-09-21-zcode-agent-compat.md) 都指向 `notes/proposed/feature/2026-09-21-zcode-agent-compat.md`，而文件实际在 `implemented/feature/`；所有门禁保持全绿。

## Decision

class 现在是一个刻意做出、并且必须说明的选择，两条轴也被分别写明。

每次运行 [`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) 都把 `class` 解析为六个之一。调用方可以指定；否则 agent 拿 spark 对照 Classification 判别器，选出该决策实际所属的 class，并在报告中说明选择与理由。`Type` 只是对 `feature` / `bug-fix` 的提示，永远不是默认值，因此一条讲工具链的 `feature` spark 可能落到 `process`。澄清性提问只保留一次，且现在只在两个 class 确实相持时触发——此前它在类型缺失时触发，而那是 capture 使之不可能出现的条件。

[inbox README](../../../inbox/README.md) 双语对写明了两者关系：`Type` 是条目自身的来源轴，**不是** note 的 class；六个 class 在晋级时选定。其 Promote 步骤与 skills 表不再描述任何映射。

[notes README](../../README.md#moving-between-lifecycles) 双语对写明：生命周期迁移须在同一变更内修复该 note 的入链，并点名 inbox 的 `QUEUE.md` 行与促成它的 spark 属于任何门禁之外的表面。

过期链接已修复：`QUEUE.md` 与 spark 现在指向 `implemented/feature/2026-09-21-zcode-agent-compat.md`。

## Alternatives considered

- **把 inbox `Type` 扩成六个 class，或给它一份与六个 1:1 的映射。** 代价：inbox 的存在意义是廉价捕获——capture first, promise nothing——在捕获时做六选一的分类判断，等于把最昂贵的判断放在信息最少的时刻，那时想法还没想清楚。它还会把 `Feat-` / `Bug-` 编号前缀与两个队列分组都改成六路，重写本问题从未触及的表面。
- **保留映射，并把它写成有意为之。** 代价：上表不是文档缺口，而是错误答案。`Type` 回答的是"新的还是已经错了"，这决定不了某个改动是能力、是流程变更、还是削减表面；把两个值映射到六个，出错的次数不会少于正确的次数。
- **为 `QUEUE.md` 与 spark 链接加门禁。** 两重代价：inbox 依契约在所有格式门禁之外；而这是入链约定的第一次违反，本仓库自己的规则是约定第二次被违反才提升为门禁。此处加门禁既不合位，也太早。
- **在本次改动里把四条已晋级的 note 改判为 `process`。** 代价：那是一次涉及七个 note 文件的独立改动；而本 note 的职责是陈述反例，不是抹掉产生这条规则的证据。因此改为把它记录在此。

## Consequences

晋级现在会说明自己的 class 与理由，六个 class 由此可以经 inbox 到达，而不再只能靠直接撰写。`Type` 在捕获时保持它廉价的两值含义，并在晋级前后不可变——这正是 inbox 需要它的方式。

代价：每次晋级多了一次必须说明的判断，而粗读 spark 仍可能选出一个说得通但错误的 class——没有门禁能分辨 `feature` note 与 `process` note，所以这仍是评审判断。被修复的链接也无法被校验，因为 `QUEUE.md` 与 spark 文件不在 `verify-doc-references` 的范围内（它只扫配对语料）；将来某次忘记修入链的生命周期迁移，会与这次一样隐于无形。四条反例按决定保留在 `feature/`，所以树里仍存在与上述规则不符的 class。

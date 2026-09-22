# Agent Note: 由 agent 把已接受的议案推进到 `implemented/`

Status: implemented

## Problem

[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) 以一个问题结束本轮：这个提议是否被接受、是否开始实施——而那个"是"无人负责。[notes README](../../README.md) 把 note 在 lifecycle 之间怎么搬（改 `Status:` 行、按目标 skeleton 改写、修复入链）写成一条由人手工执行的规则；没有任何流程去读这条 note 的 `## Acceptance criteria`、为它跑证据，或在活干完之后执行这次搬移。这个断点在实践里是真实的：升格 Feat-0007 走到那个问题就停下了，而那个"是"是靠一次临场会话产出了[那次改动自己的 note](../feature/2026-09-21-promote-skill-ask-before-implement.md)，而不是靠一条流程。

缺口在链路的尾部，不在那个提问上。提问有归属、也有 hard stop；"做完"没有。提议之所以要写验收标准，恰恰是为了让"完成"可判定；而 lifecycle 搬移是"决策已落地"的记录——它正是刚做完有意思的那部分工作之后，最容易被留到以后的那一步。

## Decision

新增技能 [adlc-implement](../../../skills/adlc-implement/SKILL.md)，把一条 `proposed/` Agent Note 推进到落地、再推进到 `implemented/`。它先定位 note——可用路径、slug、标题、关键词，或把它升格出来的那条 spark 的编号——并要求它位于 `proposed/` 之下；动手前先跑 [notes AGENTS.md](../../AGENTS.md) 要求的 supersession 检查；只问一个问题：这条提议是否被接受、是否开始实施，并说明实施会影响什么；随后按 note 实施——`## Proposal` 是范围，`## Acceptance criteria` 是完成定义，`## Risks` 是要盯住的地方；按 [docs/testing.md](../../../../docs/testing.md) 跑改动面所要求的最窄证据；最后在同一次改动里搬移 note，中英两份一起：把 `## Proposal` 改写为现在时的 `## Decision`，把验收标准与风险并入 `## Consequences`。`## Problem` 与 `## Alternatives considered` 保持原样：搬移只是把决策的时态改掉，绝不改写决策本身。

搬移始终是 note 自身的编辑，而不是某个 bot 的动作。第 7、8 步修复**入链**——那条 spark 与 `QUEUE.md` 行，它们都在所有门禁之外——并改写本次改动移动过的下游事实，例如安装器 `COMPONENTS` 里新增的路径、README 配对里的技能清单、`ChangeLog.md` 的 `## Unreleased` 条目。该技能随家族一起发布在安装器的 `workflows` 组件中，并在 README 配对与 changelog 里登记。

提问不在家族内重复：[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) 第 9 步现在把本技能写为它那个"是"所要执行的流程，而已经对那个问题回答过的"是"，进入本技能时直接落到第 4 步，不再问第二遍。一次升格产出多条 note 时，一个回答覆盖全部。接受提议不等于获得提交或推送的许可；而"否"、推迟或不作回答，都让目录树原封不动、note 仍停在 `proposed`。

## Alternatives considered

- **让 `adlc-inbox-promote` 自己实施提议。** 落选：升格的合同是 spark → note，而已接受的路径也必须能从一句普通的实施请求抵达——一条几天后才被接受的提议，可能出现在从未跑过升格的会话里，需要的是一个不以 inbox 为起点的入口。
- **采用外部的独立 implement 技能。** 落选：在评估那条链时，外部的 `implement` 已经被明确拒绝（见[学习笔记](../../../learning/2026-09-21-adlc-flow-with-issue-channel.md)，那次只取了链上 ticket 的前半段、留下 implement 的后半段）；它预设了本仓库没有的 ticket 链与 issue tracker，且本 kit 的 lifecycle、配对与证据规则终究还得硬接上去。
- **在 PR 合入时自动搬移**（仍然 open 的 [Feat-0003](../../../inbox/2026-09-20-proposed-notes-auto-implemented-on-pr.md)）。当下落选：它需要 CI 具备写仓库的权限，把一次可评审的一行状态改动变成一次 bot 提交；而"搬移会被忘"这件事，最省事的解法是把搬移放进真正做了这件事的那一轮运行里。Feat-0003 保持 open，但收窄为"从未跑过本技能的改动"。
- **维持现状——升格负责问，人负责实施并手工搬移 note。** 落选：没有任何环节读验收标准，于是"完成了"始终是一个在提议已经离开视野后作出的判断；而搬移正是此前每一次手工搬运所消耗的那条尾巴。
- **加一个不问就实施的免交互开关。** 落选：那一个问题正是"接受与否"的唯一记录，跳过它恰恰是 hard stop 要防住的行为；而问一次只花一个回合。

## Consequences

一条被接受的提议从此端到端有了归属：实施前先读验收标准，证据对上 note 所说的改动面，note 在同一个改动里抵达 `implemented/`，入链与它移动过的事实一并更新。如今停在 `proposed/` 的那条脚手架提议，是第一条拥有实施路径的 note。

有三条限制是长期的。没有任何机器校验那个问题是否问过、第 7、8 步是否执行——技能是指导而非第二份合同，spark、队列行与技能文件都在所有门禁之外，所以这条纪律靠"写在 agent 会读的地方"成立，与家族其余部分相同。搬移的质量上限就是 note 的质量：`## Proposal` 单薄则问题单薄，验收标准若不描述可观察的行为，产出的 `## Decision` 就无人可验证。而证据步骤的改动面继承自 note 自己的提案，因此一条说错了自己会碰到什么的提议，会跑错检查。

Feat-0003 保留原位并收窄：搬移仍是手工的，所以一次未经过本技能落地的改动，仍可能留下一条 `proposed/` note；但常规路径不再依赖某人记得。

# Agent Note: Inbox 条目携带稳定任务编号

Status: implemented

## Problem

[`QUEUE.md`](../../../inbox/QUEUE.md) 的行此前靠标题文本辨认，一条 spark 没有比中文标题更短的把手：想说"把 apps/inbox 那条升格"只能靠散文匹配，两条标题相近的 spark 还有选错的风险；在对话轮次、提交信息或升格后的 Agent Note 里引用某条 spark，也只能把标题复述一遍。[类型轴](../../../inbox/README.zh.md)给出了类别，但没有给出身份。

## Decision

每条 inbox spark 在 `Type` 之下新增第三个头部字段 `ID`：`feature` 用 `Feat-`、`bug` 用 `Bug-`，后接该类型独立的四位补零序号（`Feat-0001`、`Bug-0001`）。前缀由类型推导，所以编号本身已说明类别。

捕获时取该类型已用的最大号 +1，扫描范围包括 `.agents/inbox/` 下的 spark 文件与 `QUEUE.md` 的行——没有计数器文件。编号分配一次即定，之后不再变化：不随 status 变，升格或丢弃也不变；已离队条目的号码永不回收，因此序号允许出现空档。

编号在 [`QUEUE.md`](../../../inbox/QUEUE.md) 行里**取代**类型标签：`- [ ] [Feat-0001] [标题](./yyyy-mm-dd-slug.md)`。前缀已带类型，所以扫队列仍能按 `Feat-` / `Bug-` 前缀一次只看一类，只是不再靠 `[feature]` 标签。

升格接受编号作为目标：[`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) 对前缀大小写不敏感、对数字按数值比较，故 `feat-1` 能命中 `Feat-0001`；路径、标题、关键词仍是合法目标。升格后的 Agent Note 在回链 spark 时写出编号。[`adlc-inbox-view`](../../../skills/adlc-inbox-view/SKILL.md) 增加 `ID` 列；编号机制之前捕获的 spark 显示 `—`，首次触及时补号。

编号是约定而非门禁：inbox 仍在一切 format gate 之外，[inbox README](../../../inbox/README.md) 是它唯一的权威。

## Alternatives considered

- **编号放进文件名（`Feat-0001-2026-09-20-slug.md`）。** 落选：捕获日期是文件名的首要排序键、也是布局表已写明的命名规则；加前缀会把日期挤到第二位，且回填等于重命名已被其他文档链接的文件。
- **在 inbox 里放计数器文件或登记表。** 落选：它引入一份必须与"已经带着编号的那些文件"保持同步的可写状态，"下一个号"取决于一份人可能忘改的文件；相比之下 max+1 扫描是自愈的。
- **两类共用一个序号（`0001`、`0002`）。** 落选：编号就不再能说明 spark 的类别，而这正是编号能取代队列行里类型标签的原因。
- **保留类型标签，编号作为第二个标签并存。** 落选：两个标签传达同一事实，行更啰嗦且二者会漂移——编号前缀本就从类型推导。
- **像 `agent-note-tree` 管 note 路径那样把编号纳入 gate。** 暂不采纳，理由与类型不加门禁相同：inbox 刻意位于一切 format gate 之外，捕获必须保持低成本。若编号真的出现漂移再议。

## Consequences

一条 spark 从此有了可用于对话、队列行、升格后 note 与扫队列过滤器的把手，升格可以无歧义地指定目标。捕获多写一行与一个标签，[`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) 只推导、不接受外部编号，三个 inbox skill 共同承载该规则。本次改动前捕获的那条 spark 回填为 `Feat-0001`；被删除条目的号码永久消失，因此序号出现空档是预期行为、不表示任何含义。

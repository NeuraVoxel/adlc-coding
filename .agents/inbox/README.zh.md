# Inbox

未承诺灵感的排队区：先捕获、不承诺必做；在 `QUEUE.md` 扫未完成项；值得做的再升格为正式 Agent Note。

## 边界

- **在一切 format gate 之外。** 门禁只扫 `.agents/notes/`；inbox 靠本 README 与人工 / Agent 纪律约束。
- **不是学习笔记。** 复盘与过程样例放 [`.agents/learning/`](../learning/README.md)；复盘里冒出的灵感落到这里，learning 只链过来。
- **不是决策记录。** 值得正式审阅的想法升格为 `notes/proposed/` 下的 Agent Note；禁止把 inbox 文件改名或移进 notes 树。

同一想法不要同时以权威待办存在于 inbox 与 learning 两处。

## 条目语言

正文默认用中文写；Status、Type 与 ID 取值、路径、命令与术语保留英文（例如 Agent Note、`QUEUE.md`、`Status: open`、`Type: bug`、`ID: Feat-0001`）。

## 布局

| 路径 | 职责 |
|---|---|
| `README.md` | 本目录合同 |
| `QUEUE.md` | checkbox 排队板（扫队列读它） |
| `yyyy-mm-dd-slug.md` | 一条灵感；文件名日期 = 捕获日 |

## 单条文件形状

```markdown
# Inbox: <短标题>

Status: open
Type: feature
ID: Feat-0001

## Spark
<几句：想法是什么、为何此刻记下>

## Notes
（可选）上下文、链接、粗略代价；勿写成 Proposal 骨架
```

`Status` 取值：

- `open`——仍在排队
- `promoted`——已升格离队；正文须链到归属 Agent Note
- `discarded`——已丢弃离队；Status 旁或 `## Notes` 里写一行原因

`Type` 取值（封闭集合）：

- `feature`——尚不存在的东西：新能力、新契约、新流程，或对既有者的改进
- `bug`——已经错了的东西：缺陷、漂移，或对本仓库既有契约的违反

`Type` 捕获一次即定，不随 status 变化：升格或丢弃后仍保留捕获时的类型。形状没有门禁检查，靠本 README 与纪律约束。

`ID` 是条目的任务编号：`feature` 用 `Feat-`、`bug` 用 `Bug-`，后接该类型独立的四位序号（`Feat-0001`、`Bug-0001`）。捕获时扫描 spark 文件与 `QUEUE.md` 行，取该类型已用的最大号 +1。编号分配一次即定，之后不再变化——不随 status 变，升格或丢弃也不变；已离队条目的号码永不回收。编号机制之前捕获的 spark 在首次触及时补号。编号同样没有门禁检查，靠本 README 与纪律约束。

## QUEUE.md

- `[ ]` 表示 `open`。
- `[x]` 表示已离队（`promoted` 或 `discarded`）；升格行链到 Agent Note；丢弃行可附短原因。
- 每行在链接前带条目编号标签：`- [ ] [Feat-0001] [标题](./yyyy-mm-dd-slug.md)`。标签本身已带类型——`Feat-` 即 `feature`、`Bug-` 即 `bug`。
- 行按类别分组，`Feat` 在上、`Bug` 在下，各组在 `# Inbox queue` 之下自带 `## ` 标题；某组没有行时该组省略。
- 顺序：**组内**按捕获日旧 → 新：最先捕获的行在该组顶部，后来的行接到组尾。看板不再是单一时间序列表，因此行序表示的是同类内部的先后，不是跨类别的先后。

看板由 `# Inbox queue` 标题、分组标题与条目行组成——没有图例、没有空态说明；本 README 是它唯一的权威，事实写在这里，不写进文件。没有 `[ ]` 行即表示队列为空。

每次捕获、升格、丢弃都须在同一变更中改条目文件并更新 `QUEUE.md` 对应行。不一致时以条目 `Status` 为准，修那一行。

## 捕获

1. 新建 `yyyy-mm-dd-slug.md`，写 `Status: open`、一行 `Type:`（`feature` 或 `bug`）、一行 `ID:`（取该类型已用最大号 +1），`## Spark` 写几句即可。
2. 在 `QUEUE.md` 里加一行 `- [ ] [<编号>] [标题](./yyyy-mm-dd-slug.md)`，追加到与类型对应的组（`feature` → `Feat`，`bug` → `Bug`）的末行；该组还没有行时先建组标题。

也可使用随本仓库一起安装的技能（`adlc-*` 技能平铺在 `.agents/skills/` 下）：

| Skill | 用途 |
|---|---|
| [adlc-inbox-capture](../skills/adlc-inbox-capture/SKILL.md) | 只需主体（可选标题 / slug / Notes / type）：写 spark（类型须落定，不得静默缺省）、分配下一个编号，并更新 `QUEUE.md` |
| [adlc-inbox-promote](../skills/adlc-inbox-promote/SKILL.md) | 明确升格某条 `open` spark（可用编号 / 路径 / 标题 / 关键词指定）为 `proposed/` Agent Note——class 由类型推导，除非显式给定——并改状态与队列 |
| [adlc-inbox-view](../skills/adlc-inbox-view/SKILL.md) | 只读：把全部 spark 渲染成按类型（`feature` / `bug`）分组的表格，新 → 旧，带 `ID` 与 `Status` 列 |

捕获不升格；升格须当轮明确提出。

## 扫队列

打开 `QUEUE.md`，只看 `[ ]` 行；想只扫一类就读那一组、跳过另一组。需要更多上下文再点开条目文件。不强制回顾节奏。想一眼看全整个 inbox（含已离队条目）时，用 [adlc-inbox-view](../skills/adlc-inbox-view/SKILL.md) 渲染成按类型分组的表格。

## 升格

1. 确认这条 spark 值得写完整、认真审阅的 Agent Note。
2. 由类型定 class：`feature` → `notes/proposed/feature/`，`bug` → `notes/proposed/bug-fix/`。明确指定的 class 优先；类型缺失或含糊时提问一次，不猜。
3. 在 `.agents/notes/proposed/<class>/yyyy-mm-dd-….md` 新建正式 note——禁止通过改名或移动 inbox 文件产生。
4. 双向互链：proposed note 链 spark；spark 改为 `Status: promoted` 并链 note，`Type` 保留。
5. `QUEUE.md` 对应行改 `[x]`，附 Agent Note 链接，编号标签保留。
6. 优先同一变更完成；若拆提交，结束时双向链接必须齐全。

Agent 可代写条目并更新 `QUEUE.md`；除非当轮人明确要求，Agent 不得自行升格。

## 丢弃

1. 条目改为 `Status: discarded`，附一行短原因。
2. 对应行改 `[x]`（可选附短原因）。
3. 默认保留文件；仅在没有引用价值时删除，并去掉对应行。

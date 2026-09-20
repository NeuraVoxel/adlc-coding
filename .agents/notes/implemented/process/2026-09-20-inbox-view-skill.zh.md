# Agent Note: inbox 增加只读查看技能

Status: implemented

## Problem

inbox 原来只有两个技能，且都是写操作：[capture](../../../skills/adlc-inbox-capture/SKILL.md) 写入新 spark，[promote](../../../skills/adlc-inbox-promote/SKILL.md) 把它升格成 note。想知道里面有什么，得逐行读 [`QUEUE.md`](../../../inbox/QUEUE.md)、再点开文件补上行里没有的信息——而行只是视图，漂掉的 checkbox 会被当成事实，且 [inbox README](../../../inbox/README.md) 已规定不一致时以条目文件为准。想只看一类要在脑内对 `[feature]` / `[bug]` 标签分组；已离队条目只能靠打开文件找，因为扫队列时真正被关注的是 `[ ]` 行。

## Decision

新增第三个技能 [adlc-inbox-view](../../../skills/adlc-inbox-view/SKILL.md)：只渲染、不写入。它读取 `.agents/inbox/` 下每个 `yyyy-mm-dd-*.md`，按 `Type` 分组输出 Markdown 表格——先 `feature` 后 `bug`——组内按捕获日新 → 旧，列为 `Date` / `Title` / `Status` / `File`，分组标题带条数。全部条目都列出，含已离队的，因为 `Status` 是列而不是过滤器；没有 `Type:` 的历史 spark 落入 `untyped` 组，不做猜测。条目文件仍是权威：当 `QUEUE.md` 行与文件不一致时，view 报文件里的状态并点名那一行需要修，但不自己动手。

该技能与同族技能一起随 installer 的 `workflows` 组件发布，并在 inbox README 对里登记——技能表与「扫队列」小节各一处，后者正是读者找「怎么看队列」的地方。

## Alternatives considered

- **按 `QUEUE.md` 行渲染，而不是读条目文件。** 落选：行是视图，可能与文件漂移，而 README 已规定不一致时以文件为准——基于行的 view 会把漂移当作事实呈现。
- **按 `Status`（`open` / `promoted` / `discarded`）分组而非按 `Type`。** 落选：扫队列真正要问的是「要做的新东西 vs 已坏掉的东西」，而 `Type` 正是升格时已映射到 Agent Note class 的那条轴；status 作为列保留就够了。
- **加过滤参数（`--type bug`、`--status open`、`--all`）。** 落选：一次无条件遍历已同时回答「还有什么开着」与「其余的去了哪」，而每个参数都是要维护的面；真要只看一类时，队列行仍可按标签过滤。
- **让 view 顺手修掉它发现的漂移行。** 落选：只读技能比顺手的技能更值钱——三条写路径仍只有捕获、升格、丢弃；给人类一条可核对的提示，好过一个自称「只看不动」的命令偷偷改文件。
- **不加技能，只在「扫队列」小节里让 agent 读 `QUEUE.md`。** 落选：此前正是如此，而已离队条目与漂移行只能靠读得足够仔细的人发现。

## Consequences

一次请求即可看到整个 inbox：分组、带日期、不必打开任何文件；没有类型的历史 spark 会以 `untyped` 自报身份，而不是消失或被编造。view 在构造上就不可能弄坏队列；它暴露出的漂移仍需人工修。installer 与两种语言的 README 都登记了新技能，因此 adopt 方 inbox 里链到的技能是他们真正收到的那个。

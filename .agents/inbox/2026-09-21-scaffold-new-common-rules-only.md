# Inbox: 脚手架 `create -- new` 只携带公共规范资源

Status: open
Type: feature
ID: Feat-0004

## Spark

`pnpm run create -- new ../my-app --name my-app` 创建新工程时，只应携带公共规范类型的资源（AGENTS.md 规则分层、`run-gates`、lefthook hooks、workflows、ci 等 adopt 会带的东西），不携带本仓库私有的数据：`.agents/notes/` 决策笔记、`.agents/inbox/` 火花队列、`.agents/learning/` 复盘，以及 ChangeLog 里属于本仓库的历史条目。

现在是脚手架行为与 expected 不一致才被注意到；新工程是别人的根，带上本仓库的笔记和历史会污染它的上下文，也让"每个事实只有一个家"的约定在下游直接失效。

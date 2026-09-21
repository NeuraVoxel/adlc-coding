# Agent Note: 脚手架 `create -- new` 只携带公共规范资源

Status: proposed

## Problem

`pnpm run create -- new <dir>` 目前是整体拷贝：`runNew` 递归复制 kit 根目录，只排除 `isExcluded` 认得的 `.git`、`node_modules`、`dist`、`coverage`、`pnpm-lock.yaml` 以及安装器包本身。其余全部带走，包括只属于本仓库的记录：`.agents/notes/implemented/` 下的 Agent Notes、`.agents/inbox/` 里带日期的火花连同 `QUEUE.md` 中标记它们的行、`.agents/learning/` 下的复盘，以及写着本 kit 发布历史的 `ChangeLog.md`。

新目录是另一个工程的根，不是本 kit 的 fork。这些文件落地时就变成了那个工程自己的决策记录、队列和变更日志。`AGENTS.md` 要求每个 agent 去读这几棵树，于是本 kit 的历史从第一条消息起就占据另一个工程的 agent 上下文；同时每个事实有了两个家，副本永不更新，本 kit 一往前走它就开始漂移。这正是"每个事实只有一个家"那条约定在下游失效——而且失效的地点，就是脚手架刚建出来的那个目录。

今天没有东西是坏的：安装器自己的 README 写明了这个行为以及它被容忍的理由，即脚手架整体拷贝、连笔记一起带走、交付即绿。问题在于新工程继承了什么，而不在于拷贝怎么跑。

## Proposal

`new` 不再是整体拷贝，而是组件拷贝：文件集变成 `COMPONENTS` 的并集——也就是 `adopt` 安装的同样五类组件——再加一份显式的 scaffold-only 清单，放新工程需要而任何组件都不携带的根文件，即 `package.json`、`pnpm-workspace.yaml`、`tsconfig.base.json`、`tsconfig.tools.json`、`vitest.config.ts`、`.gitignore`，以及各子树的 `AGENTS.md` 与 `CLAUDE.md` 别名。两种模式共用一个来源：`adopt` 能装什么，`new` 就带什么。

在这些树里，拷贝带的是契约，而不是本 kit 的内容：

- `.agents/notes/` 只带 README 对（`rules` 组件本来就带它），不带任何 lifecycle 子树——没有 `proposed/`、`implemented/`、`rejected/`、`archived/`。
- `.agents/inbox/` 只带 README 对，外加一张空的 `QUEUE.md` 看板（`workflows` 本来就带这个文件），没有火花文件，也没有行。
- `.agents/learning/` 只带 README 对和 `.gitignore`，不带复盘。
- `ChangeLog.md` 只带 `## Unreleased` 标题，不带任何已发布小节。

这些 kit 私有路径进入拷贝本来就遵守的排除集，这也正是交付出去的文档能自洽的原因：`pruneExcludedReferences` 本来就会拆掉指向被拷贝遗漏目标的 Markdown 链接，于是 `AGENTS.md`、各 README 和 `docs/*.md` 里的决策链接会丢掉引用、保留文字，和今天安装器包链接的处理完全一样。`applyRenames`、`CLAUDE.md` 别名、`.codebuddy/skills` 别名与 `git init` 继续在这棵更小的树上执行。

安装器 README 里"脚手架整体拷贝、包括笔记"这句在同一改动中改写，依赖它的那句 kit-history 剪枝说明一并改写，两种语言同时更新。

见火花：[Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md)。

## Alternatives considered

- **保留整体拷贝，在 next-steps 里加一步清理。** 落败原因：任何人动手删除之前，本 kit 的记录已经在磁盘上、并且已经挂在 `AGENTS.md` 的链接里；而"脚手架完先删掉这几个目录"恰恰是脚手架存在的意义要消灭的那种手工步骤。遗漏引用的剪枝也不会触发，于是没人告诉采用者该清哪些链接。
- **把本 kit 的记录放在一个标签明确的目录下（如 `docs/kit-history/`）带出去，让下游仍读得到理由。** 落败原因：同一个事实仍然有两个家，而那正是本次改动要消除的漂移；下游读者去找自己的决策记录时，依然先撞见我们的。
- **加一个模式开关 `--full` 或 `--with-history`，把今天的行为保留成其中一个选项。** 落败原因：默认值仍然把错的东西发给每一个没读完参数列表的人，而且两种模式各自都要一份文件集测试和一份文档描述。
- **什么都不做，让每个新工程自己剪。** 落败原因：火花里点名的代价——上下文污染与事实重复——由每一次脚手架买单，而不是只由注意到它的那几个工程买单。

## Acceptance criteria

- `pnpm run create -- new <dir> --name my-app` 产出的树里，每个文件都属于 `COMPONENTS` 的并集或显式的 scaffold-only 清单，且不含 `.agents/notes/{proposed,implemented,rejected,archived}/` 下的任何路径、`.agents/inbox/` 下任何带日期的火花文件、`.agents/learning/` 下任何复盘，以及只有一个 `## Unreleased` 标题的 `ChangeLog.md`。
- 脚手架产出的树交付即可通过 `pnpm run check:all`，无需手工剪枝：任何被交付文件里的 Markdown 链接都不会指向脚手架遗漏的路径，因此新工程里的 `doc-sync` 就像安装器 README 今天承诺的那样是绿的。
- `tests/lib.spec.ts` 用纯规划函数钉住 `new` 的文件集：一个 acceptance 用例证明私有树被排除，一个 rejection 用例证明某个必须携带的路径缺失时会被发现。
- `adopt` 行为不变：同样的组件安装同样的文件，本仓库继续保留自己的笔记、火花与变更日志历史。
- 两种模式共用的行为在拷贝之后照旧执行——身份改名、`CLAUDE.md` 别名、`.codebuddy/skills` 别名、`git init`——并且临时目录里的脚手架冒烟测试仍通过 gate，这也是 [docs/testing.md](../../../../docs/testing.md) 对安装器改动的要求。

## Risks

- **没人列出清单的文件会消失。** 今天 checkout 本身就是模板，新增一个根文件会自动被带走；改成从 `COMPONENTS` 推导后，组件和 scaffold-only 清单之外的任何东西都会静默停止携带，漏掉 `tsconfig` 或 `vitest.config.ts` 会让 gate 在新工程里崩，而不是在这里失败。临时目录冒烟是唯一的兜底，而每新增一个根文件都要回头检查那份 scaffold-only 清单。
- **剪枝本身就是有损的。** 交付出去的 `AGENTS.md` 与 docs 里的决策链接会丢失目标，下游读者看到结论却看不到理由，而理由只留在这里、别处没有。这正是安装器已经为它自己的包链接做过的取舍；`doc-references` 保持绿，是"引用确实被拆掉了"而不是"链接在静默悬空"的证明。
- **一个文件集，两种模式，方向相反。** `adopt` 拒绝覆盖、只装子集；`new` 全量写入。某个组件日后多出一个只对 adopt 有意义的路径，就会被每一次脚手架继承；而 scaffold-only 清单里漏掉的文件，`adopt` 永远发现不了，因为它从不读那份清单。
- **看板交付时是空的，而它的 README 讲的是火花。** 新工程的 `QUEUE.md` 没有行，因此也没有 `## Feat` 或 `## Bug` 分组；它带走的 README 对会解释一次 capture 如何把它们填上，这没错，但从此只有第一次 capture 能证明交付出去的看板能跑。本 kit 再也不能靠 `new` 来顺带验证一张有内容的看板。

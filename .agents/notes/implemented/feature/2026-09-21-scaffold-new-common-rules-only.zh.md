# Agent Note: 脚手架 `create -- new` 只携带公共规范资源

Status: implemented

## Problem

`pnpm run create -- new <dir>` 过去是整体拷贝：`runNew` 递归复制 kit 根目录，只排除 `.git`、`node_modules`、`dist`、`coverage`、`pnpm-lock.yaml` 以及安装器包本身。其余全部带走，包括只属于本仓库的记录：`.agents/notes/implemented/` 下的 Agent Notes、`.agents/inbox/` 里带日期的火花连同 `QUEUE.md` 中标记它们的行、`.agents/learning/` 下的复盘，以及写着本 kit 发布历史的 `ChangeLog.md`。

新目录是另一个工程的根，不是本 kit 的 fork。这些文件落地时就变成了那个工程自己的决策记录、队列和变更日志。`AGENTS.md` 要求每个 agent 去读这几棵树，于是本 kit 的历史从第一条消息起就占据另一个工程的 agent 上下文；同时每个事实有了两个家，副本永不更新，本 kit 一往前走它就开始漂移。这正是"每个事实只有一个家"那条约定在下游失效——而且失效的地点，就是脚手架刚建出来的那个目录。

当时并没有什么东西是坏的：安装器自己的 README 写明了这个行为以及它被容忍的理由，即脚手架整体拷贝、连笔记一起带走、交付即绿。问题在于新工程继承了什么，而不在于拷贝怎么跑。

## Decision

`new` 写出的是组件拷贝，而不是整仓拷贝。文件集即 `scaffoldFileSet()`——`COMPONENTS`（也就是 `adopt` 会安装的那套）与 `SCAFFOLD_ONLY_FILES` 的并集，后者是新工程需要而任何组件都不携带的根文件：`.gitignore`、`package.json`、`pnpm-workspace.yaml`、`scripts/AGENTS.md`、`scripts/CLAUDE.md`、`tsconfig.base.json`、`tsconfig.tools.json`、`vitest.config.ts`。两种模式共用一个来源：`adopt` 能装什么，`new` 就带什么。

在这些树里，拷贝带的是契约，而不是本 kit 的内容：

- `.agents/notes/` 只带 README 对，以及 `rules` 本来就带的 lifecycle supplement（`AGENTS.md`、`implemented/AGENTS.md`、`archived/AGENTS.md`），一条 note 也不带：任何 `{lifecycle}/{class}/yyyy-mm-dd-topic.md` 路径都不会到达新工程，因此 `proposed/`、`rejected/` 与各 class 目录在那里根本不存在。
- `.agents/inbox/` 只带 README 对，外加一张空的 `QUEUE.md` 看板，没有火花。
- `.agents/learning/` 只带 README 对和 `.gitignore`，不带复盘。
- `ChangeLog.md` 重建为契约抬头加一个空的 `## Unreleased` 标题，既不带已发布历史，也不带未发布条目——新工程的 changelog 里写着我们的改动，是同一种泄漏换了个更小的字号。之所以是重建而不是在该标题处裁断：本 kit 的 changelog 在一次 cut 之后、下一次开发提交之前根本没有 `## Unreleased` 小节——按那个标题裁断只在 cut 之前成立，cut 一旦把它改名，从 cut 后的树跑脚手架就直接失败，而这个回归只有手工跑一次脚手架才发现得了。
- `package.json` 不带本 kit 的 `create` 脚本，因为它会去调用脚手架并不携带的安装器。
- 新工程里没有 `packages/`，所以确实会被带走的 `scripts/` 保留自己的 supplement，而 `packages/AGENTS.md` 不随行：它唯一的主语就是这个安装器。

这份清单是唯一的权威，没有任何东西在背后另行改写它。提案原本是去扩充旧的排除集；实际落地的做法是把它删掉，因为一份"全部减去一份清单"的拷贝需要第二份等长、靠手工保持同步的清单来说明前者漏了什么。`isCarried()` 替原先查排除集的摘链逻辑回答"这条被交付的路径是否存在"，而分量/路径常量随唯一读它们的代码一起消失。完整性检查挪到了机器能查的地方：`packages/create-adlc-coding/tests/lib.spec.ts` 会对本仓库受跟踪的根文件跑 `findUnlistedRootFiles`，于是日后新增的根文件会让 spec 失败，而不是从每个脚手架里静默消失；`NOT_CARRIED_ROOT_PATHS` 记下脚手架有意跳过的四个根路径——本 kit 的 README 对、LICENSE、lockfile 与 `CLAUDE.md`。

有两处提案没点到的细节，都是脚手架冒烟逼出来的、而不是评审时看出来的。摘链现在止步于 `.md`：它原先施加在每一个文本面上，于是改写了 `scripts/verify-doc-references.spec.ts` 里形如 Markdown 链接的字符串字面量——那正是门禁 spec 自己的链接夹具——结果是刚交付出去的树跑不过它自己带走的测试。另外 `CLAUDE.md` 现在会在每一个被交付的 `AGENTS.md` 旁重建为相对别名，而不只是根目录一处，因为子树被拷贝后会产出指回作者 checkout 的绝对符号链接。

安装器 README、根 README 对、[docs/testing.md](../../../../docs/testing.md) 与 `packages/AGENTS.md` 都改写为新行为；而那份文档要求的冒烟——脚手架到临时目录并在其中跑门禁——就是证明。

见火花：[Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md)。

## Alternatives considered

- **保留整体拷贝，在 next-steps 里加一步清理。** 落败原因：任何人动手删除之前，本 kit 的记录已经在磁盘上、并且已经挂在 `AGENTS.md` 的链接里；而"脚手架完先删掉这几个目录"恰恰是脚手架存在的意义要消灭的那种手工步骤。遗漏引用的剪枝也不会触发，于是没人告诉采用者该清哪些链接。
- **把本 kit 的记录放在一个标签明确的目录下（如 `docs/kit-history/`）带出去，让下游仍读得到理由。** 落败原因：同一个事实仍然有两个家，而那正是本次改动要消除的漂移；下游读者去找自己的决策记录时，依然先撞见我们的。
- **加一个模式开关 `--full` 或 `--with-history`，把今天的行为保留成其中一个选项。** 落败原因：默认值仍然把错的东西发给每一个没读完参数列表的人，而且两种模式各自都要一份文件集测试和一份文档描述。
- **什么都不做，让每个新工程自己剪。** 落败原因：火花里点名的代价——上下文污染与事实重复——由每一次脚手架买单，而不是只由注意到它的那几个工程买单。

## Consequences

脚手架从此只是一套规则集。`pnpm run create -- new <dir> --name my-app` 产出的树中每个文件都在 `scaffoldFileSet()` 里，没有 note 路径、没有火花、没有复盘，`ChangeLog.md` 只有一个 `## Unreleased` 标题；`adopt` 未被改动，安装的组件与从前相同，本仓库继续保留自己的笔记、火花、learning 与 changelog 历史。那条点名 lifecycle 目录的验收标准需要在拷贝里落定一处读法：`rules` 本身就带 `implemented/AGENTS.md` 与 `archived/AGENTS.md`，所以"不得有 `.agents/notes/{proposed,implemented,rejected,archived}/` 下的路径"指的是不得有 *note*——lifecycle supplement 照带，而 class 目录根本不存在。

验收标准要求的事都成立，而且全部由那一次冒烟作证：脚手架到临时目录、装好依赖、在其中跑 `pnpm run check:all`——lint、typecheck、56 个用例、五道 `doc-sync` 门禁全绿——零手工剪枝。每一份被交付文档里的每一条 Markdown 链接都指向脚手架确实写出的路径，因为指进未交付记录的链接在拷贝时就被拆掉了。`packages/create-adlc-coding/tests/lib.spec.ts` 钉住这份文件集、只列本 checkout 真实存在的路径、包含"kit 私有树不在集内"的 acceptance 用例与"必须携带的根文件缺失即报错"的 rejection 用例，并核对本仓库受跟踪的每一个根路径要么被携带、要么被声明为不携带。

有三项后果值得带着走。`new` 从此不带 `README.md`、也不带 `LICENSE`：这份封闭清单没有给它们留位置，新工程自己写，而把本 kit 的许可证复制进别人的工程属于授权决定、不是复制。脚手架会原样继承 `tsconfig.tools.json` 与 `vitest.config.ts`，于是两者仍然写着 `packages/create-adlc-coding`——在两个工具里都是惰性的（其它输入已匹配），但那是采用者的树里并不存在的路径；`package.json` 还留着 `1.0.0`，即本 kit 当前的版本，采用者应把它当作起点。这三处都是一行即可定夺、而本 note 并未定夺的取舍，刻意留成可见的，而不是被顺手定死。

提案点名的风险如预料般兑现，如今是被围住而非消失。没人列出的文件依旧会消失，但根文件这一风险最集中的地方会先让 spec 失败；摘链依然按设计有损，所以下游读者看得到结论、看不到理由；`adopt` 依旧不读 `SCAFFOLD_ONLY_FILES`，因此漏在那份清单里的 scaffold-only 文件永远不会被采纳流程发现；交付出去的看板仍是空的，只有第一次 capture 能证明它能用——本 kit 再也不能靠 `new` 顺带验证一张有内容的看板。

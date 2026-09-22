# Agent Note: Align Agent Notes governance with deepseek-harness

Status: implemented

## Problem

本 kit 的 Agent Notes 与 `deepseek-harness`（本地检出 `~/Documents/AI/coding-agent/back/deepseek-harness`，下称 dsh）同源，当时已经变成两份各自演进的规范。生命周期目录、class 集合、正文骨架都相同，但**围绕它们的契约**已经漂移，而本仓库没有任何记录说明漂移发生在哪：dsh 有按生命周期拆分的 `AGENTS.md` 补充文件、每条 note 强制「英/中 + sidecar」三元组、基于 manifest 与 git blob 的冻结、以及一个专门管归档的 skill；本 kit 只有一份 README 双语对、只有 `.zh.md` 对照、以及一份内容哈希 manifest。

两个事实让漂移不再是纸面担忧。其一，当时唯一的差异表躺在 dsh 的一篇学习笔记 `dsh:.agents/learning/2026-09-11-ai-eng-kit-vs-harness-conventions.md` 里 —— 纯中文、自称「非正式权威」、并且在另一个仓库里，两边的门禁都看不到它，也没有任何机制保证它不过期。其二，[Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md) 断言 dsh 有一份与 `adlc-inbox-promote` 对应的 `kit-inbox-promote`；全仓搜索 `kit-inbox-promote`、`inbox-promote`、`adlc-inbox`，在 dsh 的 Markdown、TypeScript、JSON 里零命中。建立在不存在对手方之上的对比，会让之后每一次 cherry-pick 都被带偏。

## Differences

调查日期 2026-09-21，一次性判定；每条差异现在只有一个归属，不再靠读者推断。

| 方面 | 迁移前本 kit | dsh | 结果 |
|---|---|---|---|
| Class 定义 | README 里一行列出六个 class | 一份 `## Classification` 表写明每个 class 覆盖什么，外加 `architecture` 与 `process` 的分界线、以及为什么不设 `refactor` | 已迁移 |
| 按生命周期的补充文件 | 无，规则全部写在 README | `notes/AGENTS.md`（每条新 note 触发一次取代检查）、`implemented/AGENTS.md`（保持事实最新，不得改写判决）、`archived/AGENTS.md`（冻结契约，含「不得检查或修复归档 note 的出向链接」） | 已迁移 |
| 根目录文件白名单 | `agent-note-tree.ts` 只豁免 README 双语对，根目录下的补充文件会被门禁拒掉 | 同一份库已允许根目录出现 `AGENTS.md` / `CLAUDE.md` | 作为使能改动迁移 |
| Note 三元组 | 英语 + `.zh.md`，由 `verify-doc-pairing` 校验 | 英语 + `.zh.md` + 一份记录两侧 git blob 哈希的 `.i18n.yaml` sidecar，`archived/` 下强制 | 刻意分叉 |
| 格式门禁的 grandfather 注释 | 替代方案逃逸注释对任何日期的 Note 都放行，新 Note 可以借此绕开强制要求 | `FORMAT_ADOPTED` 限定其范围：只对早于格式生效日的 Note 放行 | 已迁移 |
| 平凡豁免判据 | 纯机械或局部修改即豁免，没有附加条件 | 豁免还要求不对行为、契约、结构、流程或理由产生任何改动 | 已迁移 |
| 归档冻结 | `verify-archived-agent-notes.ts` + `scripts/archived-notes.manifest.json`，文件内容 sha256，强制双语成对 | 同上思路，另加 git blob SHA-1、每条 note 的 sidecar 一致性记录、与 `HEAD` 的基线比对（可被 `DSH_ARCHIVE_BASE_REF` 覆盖）以及 `merge-translation-pairing` merge driver | 推迟 |
| 禁止集中索引 | README 有说明；靠机制偶然达成 —— 树的门禁只白名单 README 双语对 | 写在文档里、在树库中显式禁止，并由专门的 note 承接理由 | 结论相同，现写明理由 |
| Inbox 层 | `.agents/inbox/` 加 `adlc-inbox-*` skill，由安装器 `workflows` 组件下发 | 全仓没有 inbox 树，未成型想法停留在 chat 或 learning note | 刻意分叉 |
| 归档 skill | 无；五个 `adlc-*` skill 覆盖 capture / promote / view / learning note / release | `dsh-archive-agent-notes` —— 取代触发条件、生命周期结局、以及带字数的标定示例（并声明篇幅不是判断标准） | 推迟到第一次真正归档 |
| Skill 元数据门禁 | 无 | `verify-skill-invocation-metadata.ts`，**零**命中对象（dsh 不存在 `agents/openai.yaml`） | 跳过 |
| 相邻文档策略 | 无 | 带 manifest 的篇幅预算、slop checklist、`verify-md-wrap`、`verify-md-links`、`verify-doc-refs` | 不在本 note 范围 |

## Decision

notes 树现在与 README 双语对并存着自身的 Agent 补充文件。`.agents/notes/README.md` 新增了 `## Classification` 节（就在上面这张表之前），每个 class 一行，外加 `architecture` / `process` 的分界线与为什么不存在 `refactor`；布局条目里那一行式 class 列表指向该节。三份英文单语补充文件已经存在，并由 README 双语对两侧同时链接：

- [`AGENTS.md`](../../AGENTS.md) —— 每条新 Note 触发一次针对活跃树的取代检查，并在同一变更内写出三种结局之一。
- [`implemented/AGENTS.md`](../../implemented/AGENTS.md) —— implemented note 与实际路径、名称、默认值保持同步；更新事实永不等同于改写判决。
- [`archived/AGENTS.md`](../../archived/AGENTS.md) —— 冻结契约，含「归档变更只修复或删除入链，永不碰出链」这条规则。

分类门禁放行这些文件：`agent-note-tree.ts` 导出 `SUPPLEMENT_FILES` 与 `isSupplementPath`，只接受 notes 根目录或某个生命周期目录正下方的 `AGENTS.md` / `CLAUDE.md`，更深层级一律不接受，因此杂放的 `INDEX.md` 依旧会被拒。配对门禁豁免它们，与豁免根 `AGENTS.md` 同理；`verify-archived-agent-notes` 跳过它们，因此补充文件不会被误判成「未记录的封存 note」。三份文件都随安装器的 `rules` 组件下发，因为指向它们的 README 本来就在这个组件里。

两处分叉写在这里和 README 里，而不是把机械装置搬进来：本仓的双语记录是「英语正本 + `.zh.md` 对照」，旁边不放机器工件；inbox 层是本 kit 独有的机制，dsh 没有对应物。三元组冻结与归档 skill 维持推迟，等到有第一条真实归档记录可以校准。Bug-0002 的前提在此记为事实，该 spark 可据此结案。

见 spark：[Bug-0003](../../../inbox/2026-09-21-agent-notes-spec-classification-alignment.md) 及其兄弟 [Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md)。

## Alternatives considered

- **整套照搬 dsh 的 notes 治理，含 `.i18n.yaml` 三元组与 merge driver。** 代价：本仓库已经用门禁和测试守住的双语契约，对一个只有十条 note 的语料来说已经足够；sidecar 里存 git blob 哈希只有在归档条目多到「只信文件内容」变得脆弱时才值回票价。照搬还意味着引入他们的翻译工具链，而本 kit 刻意不 vendor 别人的工具。
- **什么都不做，继续指向 dsh 那篇学习笔记。** 代价：它纯中文、躺在别家仓库、本仓门禁读不到，而且在 inbox 这一点上已经过期 —— 正是这个 spark 指出的问题。
- **宣布本 kit 为唯一权威，让 dsh 按自己节奏对齐。** 代价：那个仓库不是我们的，我们也跑不了它的门禁，所以这个说法无法证伪，下一次 cherry-pick 会静默地把当时的漂移再带回来。为每条差异记下我方判定，才是让双向回灌都变便宜的做法。

## Consequences

上表「已迁移」各行已经落地：README 双语对带上了 Classification 表、无索引的理由和归档链接规则；补充文件存在且两种语言都能到达；`pnpm run check:all` 全绿；`scripts/agent-note-tree.spec.ts` 拒绝 `INDEX.md`、`implemented/notes.md` 以及嵌套在生命周期更深层级的补充文件，同时接受三份真实补充文件；`scripts/verify-archived-agent-notes.spec.ts` 证明补充文件被跳过，而不会被报成未记录的封存内容。`pnpm run create -- adopt <tmp>` 会装上三份补充文件，因此被采用的工程一次拿到完整可信的 notes 治理。Bug-0002 依据本 note 结案。`verify-agent-note-format.ts` 现在导出 `FORMAT_ADOPTED = 2026-09-20` —— 即 notes 树与格式门禁落地之日 —— 并对任何日期在该日或之后的 Note 拒绝替代方案逃逸注释；`scripts/verify-agent-note-format.spec.ts` 在边界上证明该拒绝，并证明前一日仍然放行；README 双语对写明了这个日期。README 双语对里的 trivial 豁免现在改为合取式 —— 纯机械或局部修改只有在对行为、契约、结构、流程或理由都没有改动时才豁免 —— 根 `AGENTS.md` 的条目改为指向该节，而不是复述一个更松的判据。

代价：notes 规则从一份文件变成四份，进入本树的 agent 要读 README 加适用的那份补充——因此每份补充只承载一条规则并指回 README，任何能在 README 里说清的规则都归 README。根目录不变量从「任何杂文件都挂」弱化为「两个具名文件放行」，所以那些拒绝用例是承重的，不是装饰。[`AGENTS.md`](../../AGENTS.md) 里的取代检查是人的步骤，没有门禁能证明它做过，跳过时只有 review 能发现。封存证明的仍是磁盘上的内容，而非与被封存 git blob 相等，历史改写对 `verify-archived-agent-notes` 依然不可见——这是推迟 sidecar 所付的代价，应在首次归档时重议。最后，本 note 只记录「调查日期」粒度的判定与形状，不抄 dsh 的逐行行为：否则刚刚治好的漂移会在对方源码变动时复发。

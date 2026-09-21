# Agent Note: Align Agent Notes governance with deepseek-harness

Status: proposed

## Problem

本 kit 的 Agent Notes 与 `deepseek-harness`（本地检出 `~/Documents/AI/coding-agent/back/deepseek-harness`，下称 dsh）同源，如今是两份各自演进的规范。生命周期目录、class 集合、正文骨架都相同，但**围绕它们的契约**已经漂移，而本仓库没有任何记录说明漂移发生在哪：dsh 有按生命周期拆分的 `AGENTS.md` 补充文件、每条 note 强制「英/中 + sidecar」三元组、基于 manifest 与 git blob 的冻结、以及一个专门管归档的 skill；本 kit 只有一份 README 双语对、只有 `.zh.md` 对照、以及一份内容哈希 manifest。

两个事实让漂移不再是纸面担忧。其一，目前唯一的差异表躺在 dsh 的一篇学习笔记 `dsh:.agents/learning/2026-09-11-ai-eng-kit-vs-harness-conventions.md` 里 —— 纯中文、自称「非正式权威」、并且在另一个仓库里，两边的门禁都看不到它，也没有任何机制保证它不过期。其二，[Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md) 断言 dsh 有一份与 `adlc-inbox-promote` 对应的 `kit-inbox-promote`；但全仓搜索的结果是：dsh 没有 inbox 树、没有 promote skill、也没有任何一处提及二者。建立在不存在对手方之上的对比，会让之后每一次 cherry-pick 都被带偏。

若不为每条差异留下判定，每一个「看起来很刻意」的缺口都要在每次回灌时被重新争论一次；而真正意外的缺口会永久存活，因为没人知道当初是哪边先动的。

## Differences

调查日期 2026-09-21。「判定」是本 note 的建议归属，落地后的章节才承载其结论。

| 方面 | 本 kit 现状 | dsh | 判定 |
|---|---|---|---|
| Class 定义 | README 里一行列出六个 class | 一份 `## Classification` 表写明每个 class 覆盖什么，外加 `architecture` 与 `process` 的分界线、以及为什么不设 `refactor` | 迁移 |
| 按生命周期的补充文件 | 无，规则全部写在 README | `notes/AGENTS.md`（每条新 note 触发一次取代检查）、`implemented/AGENTS.md`（保持事实最新，不得改写判决）、`archived/AGENTS.md`（冻结契约，含「不得检查或修复归档 note 的出向链接」） | 迁移 |
| 根目录文件白名单 | `agent-note-tree.ts` 只豁免 README 双语对，因此今天在 notes 根放补充文件会被门禁拒掉 | 同一份库已允许根目录出现 `AGENTS.md` / `CLAUDE.md` | 作为使能改动迁移 |
| Note 三元组 | 英语 + `.zh.md`，由 `verify-doc-pairing` 校验 | 英语 + `.zh.md` + 一份记录两侧 git blob 哈希的 `.i18n.yaml` sidecar，`archived/` 下三元组强制 | 刻意分叉 |
| 归档冻结 | `verify-archived-agent-notes.ts` + `scripts/archived-notes.manifest.json`，文件内容 sha256，强制双语成对 | 同上思路，另加 git blob SHA-1、每条 note 的 sidecar 一致性记录、与 `HEAD` 的基线比对（可被 `DSH_ARCHIVE_BASE_REF` 覆盖）以及 `merge-translation-pairing` merge driver | 推迟（见 Risks） |
| 禁止集中索引 | README 有说明；靠机制偶然达成 —— 树的门禁只白名单 README 双语对 | 写在文档里、在树库中显式禁止，并由专门的 note 承接理由 | 不改，重述理由 |
| Inbox 层 | `.agents/inbox/` 加 `adlc-inbox-*` skill，由安装器 `workflows` 组件下发 | 全仓没有 inbox 树，未成型想法停留在 chat 或 learning note | 刻意分叉 |
| 归档 skill | 无；五个 `adlc-*` skill 覆盖 capture / promote / view / learning note / release | `dsh-archive-agent-notes` —— 取代触发条件、生命周期结局、以及带字数的标定示例（并声明篇幅不是判断标准） | 推迟到第一次真正归档 |
| Skill 元数据门禁 | 无 | `verify-skill-invocation-metadata.ts`，当前**零**命中对象（dsh 不存在 `agents/openai.yaml`） | 跳过 |
| 相邻文档策略 | 无 | 带 manifest 的篇幅预算、slop checklist、`verify-md-wrap`、`verify-md-links`、`verify-doc-refs` | 不在本次范围 |

## Proposal

为上表每一行留下一份判定：标为「迁移」的在本次改动里落地，其余明确写成「故意如此」，让每条差异在本仓库有归属，不再靠读者推断。

具体落到本次改动：把 README 里一行式的 class 列表升级为 `## Classification` 表，写明每个 class 的覆盖范围与 `architecture` / `process` 的分界线；把三项补充落成真实文件 —— `.agents/notes/AGENTS.md`、`.agents/notes/implemented/AGENTS.md`、`.agents/notes/archived/AGENTS.md` —— 每份只做指针式指向而不重抄 README，并由 README 双语对同时链接过去；放宽 `agent-note-tree.ts` 的根目录白名单，让它接受 `AGENTS.md`（以及 `adopt` 已理解的 `CLAUDE.md` 别名），使这些文件通过分类门禁；并把「只修入向链接，不得检查或修复归档 note 的出向链接」写进 notes README 的归档章节，同时重述为什么没有集中索引。

两处分叉刻意保留，并在 README 里写明理由，而不是把机械装置搬进来：本仓库的双语契约是「英语主线 + `.zh.md` 对照」，旁边不放任何机器工件；inbox 层是本 kit 独有的机制，dsh 与之无关。三元组冻结与归档 skill 推迟到至少有一条真实归档记录可以校准时再说。Bug-0002 的前提在此记为事实，届时可据此结案而不必重做调查。

见 spark：[Bug-0003](../../../inbox/2026-09-21-agent-notes-spec-classification-alignment.md) 及其兄弟 [Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md)。

## Alternatives considered

- **整套照搬 dsh 的 notes 治理，含 `.i18n.yaml` 三元组与 merge driver。** 代价：本仓库已经用门禁和测试守住的双语契约，对一个只有十条 note 的语料来说足够且更轻；sidecar 里存 git blob 哈希只有在归档条目多到「只信文件内容」变得脆弱时才值回票价。现在搬还得连带引入他们的翻译工具链，而本 kit 刻意不 vendor 别人的工具。
- **什么都不做，继续指向 dsh 那篇学习笔记。** 代价：它纯中文、躺在别家仓库、本仓门禁读不到，而且在 inbox 这一点上已经过期 —— 正是这个 spark 指出的问题。
- **宣布本 kit 为唯一权威，让 dsh 按自己节奏对齐。** 代价：那个仓库不是我们的，我们也跑不了它的门禁，所以这个说法无法证伪，下一次 cherry-pick 会静默地把当时的漂移再带回来。为每条差异记下我方判定，才是让双向回灌都变便宜的做法。

## Acceptance criteria

- 上表每一行都带三种判定之一 —— 本次已迁移 / 刻意分叉且在 notes README 双语对中写明理由 / 推迟并写明重开它的触发条件 —— 且没有一行空缺。
- `.agents/notes/README.md` 与 `README.zh.md` 在同一次改动里带上 `## Classification` 表、无索引的理由、以及归档链接规则。
- 三份补充文件存在，可从 README 双语对两侧到达，并在 `agent-note-tree` 的根目录白名单接受 `AGENTS.md` / `CLAUDE.md` 后通过分类门禁；`scripts/agent-note-tree.spec.ts` 增加一个用例，证明根目录里其它杂文件仍被拒绝。
- 按 [docs/testing.md](../../../../docs/testing.md) 对门禁改动的要求，`pnpm run doc-sync` 与窄通道 `vitest run scripts/agent-note-tree.spec.ts scripts/verify-agent-note-format.spec.ts scripts/verify-doc-pairing.spec.ts` 全绿。
- Bug-0002 可依据本 note 结案而无需重新调查：它所断言的 dsh `kit-inbox-promote` 并不存在，该 spark 的对比因此失去对象。

## Risks

- **为别人的门禁行为造第二个家。** 在此描述 dsh 的脚本细节，等于刚刚治好的漂移在对方源码变动时复发。因此表中只写「调查日期」粒度的判定与形状，不写逐行行为；需要当前细节时留给跨仓指针。
- **补充文件切碎了单文件契约。** 今天 agent 读一份 README 就能学会 notes 规则；改动后要读至多四份文件，而这正是「每个事实只有一个家」所防范的分裂。补充文件必须指向而非复述，且每份要独占 README 承载不了的规则，否则这只是换了个目录结构的重复。
- **根目录不变量被削弱。** 白名单一旦放开，就把「拒绝任何杂根文件」换成「允许两个具名文件」；spec 里那条拒绝用例是白名单一旦开放后不再逐个扩张的唯一保障。
- **不可强制的步骤。** 「每条新 note 触发取代检查」是人的步骤，没有门禁能证明它做过；它会成为 `AGENTS.md` 里又一行可能被跳过的指示，只有 review 能发现。
- **只封内容。** 保留「文件内容 sha256」的 manifest，意味着冻结证明的是此刻磁盘上的内容，而不是它与被封存的 git blob 一致，历史改写对这道门禁不可见。这是推迟三元组所付的代价，应在首次归档时重议，而不是被忘掉。

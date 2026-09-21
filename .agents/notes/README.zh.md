# Agent Notes

中文 | [English](README.md)

这里只住一种设计文档。**Agent Note** 记录影响本仓库的决策——*为什么*、*放弃了什么*，即代码和文档承载不了的部分。会话纪要和学习笔记住在 [`.agents/learning/`](../learning/README.md)；未承诺的灵感排队在 [`.agents/inbox/`](../inbox/README.md)。

## 布局与命名

路径编码两个轴：`{lifecycle}/{class}/yyyy-mm-dd-topic.md`，分类门禁（`scripts/agent-note-tree.ts`）拒绝任何越出下列封闭集合的 note 路径。

- **lifecycle**（顶层目录）是状态，Note 随状态在目录间移动：
  - `proposed/`——已评审、未实施的提案。
  - `implemented/`——决策已上线；文件记录决策与被否决的替代方案，并**与实际交付保持同步**（[`implemented/AGENTS.md`](implemented/AGENTS.md)）：代码后续移动文件、改名、改默认值时，同一变更内更新对应事实（只改事实，不改决策本身）。
  - `rejected/`——考虑过并否决；裁决写在 `Status:` 行，提案原样冻结。
  - `archived/`——理由不再指导未来工作的已交付决策；append-only 冻结历史，绝非现行权威。
- **class**（嵌套目录）是决策类别，封闭集合——每一类覆盖什么写在 [Classification](#classification)。新增类别须在同一变更内扩展门禁脚本的 `CLASSES` 并更新该节。

日期是主题**首次提出**的日期（以 git 历史为准）。Note 之间用相对 Markdown 链接互引，不用裸文件名或编号。不设集中索引：索引把每条 Note 的一句话主张重抄一遍，并在 Note 移动生命周期或类别的瞬间开始漂移；活跃目录树**就是**清单，一次 `ls` 即可遍历。门禁在结构上给出同一结论：notes 根目录下除 README 双语对和下列补充文件外的任何文件都无法通过分类，因此自动生成的 `INDEX.md` 活不过这道门禁。

只在本树内生效的环境指令放在英文单语的补充文件里——[`AGENTS.md`](AGENTS.md)、[`implemented/AGENTS.md`](implemented/AGENTS.md)、[`archived/AGENTS.md`](archived/AGENTS.md)——每份只承载 README 承载不了的一条规则，并指回 README 而不是重抄它。分类门禁放行它们；配对门禁豁免它们，与豁免根 `AGENTS.md` 同理。

## Classification

每条 Note 归属一个写进路径的类别，取自 `scripts/agent-note-tree.ts` 强制的封闭集合；分类门禁拒绝其它目录。

| 类别 | 覆盖什么 |
|---|---|
| `feature` | 新的用户或模型可见能力。 |
| `bug-fix` | 修正缺陷，或补上评审/复盘暴露的缺口。 |
| `simplification` | 删掉代码、行为或表面接口，而不新增能力。 |
| `architecture` | 关于**所交付源码**的结构决策——包如何关联、运行时词汇是什么。 |
| `process` | 代码**周围**的工具、策略或工作流——门禁、钩子、安装器——而非运行时行为。 |
| `testing` | 测试基础设施与策略。 |

`architecture` 与 `process` 的分界需要判断：architecture 关乎我们交付的源码，process 是围绕它的工具与工作流。`refactor` 故意缺席——它与 `simplification` 重叠，而后者的判别问句「可观察行为是否改变」已经把它覆盖。

## 归档与删除

当已交付的决策完整、其理由不再可能指导未来工作时归档该 implemented Note；校准的问法是：这里是否有某个替代方案、所有权边界、负面保证、持久语义规则或重新引入条件，仍能防止一个可能犯的错——绝不用字数、年龄或配额衡量。绝不归档 proposed Note：过时就转 rejected。rejected Note 只在其理由还能防止一个可能犯的错时保留，否则整体删除。

归档把完整的英/中对移入 `archived/{class}/`，保留 `Status: implemented`，在两个文件的状态行下方插入 `Archived: YYYY-MM-DD`，并修复或删除入链——这是归档允许的全部内容变更。归档 Note 的**出链**永不被检查、校验或修复：它们随封存一起冻结，现行门禁不负责评判历史。[`archived/AGENTS.md`](archived/AGENTS.md) 是封存之后的冻结契约。封存后永久冻结：[`verify-archived-agent-notes`](../../scripts/verify-archived-agent-notes.ts) 将每个归档文件与 append-only manifest（`scripts/archived-notes.manifest.json`）中的哈希比对，任何后续编辑、移动或删除都会挂门禁。只在新增归档的同一变更内重新记录 manifest。

## 何时写一条

每个**非平凡变更**必须同一 PR 内新增或更新至少一条 Agent Note：改变行为、架构、跨文件或跨包共享的契约、流程或工具、测试策略、磁盘/wire/配置格式，或任何维护者可能需要重新审视的决策。已实施的 Note 随代码迁移、改名、默认值变更在同一变更内同步。只有不对行为、契约、结构、流程或理由产生任何改动的纯机械或局部修改才豁免。

## 取代与合并

Note 永不改写成*另一个*决策：用新 Note 取代并保持两者互链。被完全取代的 Note 可以合并进现行拥有者 Note 后删除，前提是：拥有者保全每一条独特理由、替代方案、后果和已命名的覆盖缺口，修复每一条入链，并在同一变更内删除中文对照。部分取代不合格：保持两条 Note 互链，更新仍然成立的事实。

## 文件格式

格式门禁（[`verify-agent-note-format`](../../scripts/verify-agent-note-format.ts)，属 `doc-sync`）强制本节全部内容；分类门禁强制路径。

### 头部块

前三行固定：

```markdown
# Agent Note: <title>

Status: <status>
```

`Status:` 取 `proposed`、`implemented` 或 `rejected — <一行理由>`，且必须与所在 lifecycle 目录一致——门禁交叉核对。归档 Note 保留 `Status: implemented`，第四行为 `Archived: YYYY-MM-DD`。头部标记在两种语言里都保持英文原样。

### 正文骨架

正文以 `## Problem` 开头（只写动机，脱离方案也能读懂）。每个生命周期的规范章节名固定：

```markdown
proposed:     Problem / Proposal / Alternatives considered / Acceptance criteria / Risks
implemented:  Problem / Decision / Alternatives considered / Consequences
rejected:     提案原样冻结，含 Alternatives considered
archived:     封存时的 implemented 骨架，外加 Archived: 行
```

提案期章节（`## Proposal`、`## Plan`、`## Migration plan`、`## Acceptance criteria`）在 `implemented/` 与 `archived/` 下被拒绝：已实施的 Note 以现在时描述现状。

### Alternatives considered 强制存在

每个 Note 必须携带 `## Alternatives considered`：每个真实替代方案及落败原因。没有记录对手的决策会招来重新争论——这正是 Note 存在要防止的事。早于格式门禁生效日（2026-09-20）、替代方案不可复原的 Note，以精确注释 `<!-- agent-note-format: alternatives-not-recorded (pre-format Agent Note) -->` 代替该节；格式门禁只对早于该日期的 Note 放行该注释，因此现在新写的 Note 必须真实记录替代方案。

### 生命周期之间移动

在生命周期目录间移动文件，意味着同一变更内更新 `Status:` 行并重新满足该目录的骨架——否则门禁拒绝这次移动。具体地：`proposed/` → `implemented/` 把 `## Proposal` 改写为现在时的 `## Decision`，并把 `## Acceptance criteria` 与 `## Risks` 并入 `## Consequences`；`proposed/` → `rejected/` 只在 `Status:` 行加理由。这次移动也要在同一变更内修复该 note 的**入链**——inbox 的 `QUEUE.md` 行、促成它的 spark，以及其他任何指向旧目录的链接；这些表面不在任何门禁的扫描范围内，别处不会发现它们过期。

### 中文对照

`.zh.md` 对照在文档配对门禁下逐节镜像英文正本的结构；机器校验的头部标记（`# Agent Note: ` 与 `Status:` 行）在两种语言里都保持英文原样。格式门禁跳过 `.zh.md` 文件——配对门禁负责它们的结构一致性。

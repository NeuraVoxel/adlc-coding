# 本仓库当前支持哪些能力

一次盘点（2026-09-20，1.0.0 cut 之后）记下的 how-this-repo-behaves 样本。权威契约仍在 `README.md` / `docs/` / Agent Notes，这里只记"怎么摸清全貌"。

仓库本体是规则系统，不ship 应用代码：没有 `server/`、`apps/web/`、`packages/contracts/`，只有一个 installer package（`packages/create-adlc-coding/`）和一整套 gate 脚本（`scripts/`）。所以"支持什么功能"基本等于"能安装什么、能验证什么"。

**能力清单**

- `create -- new` / `create -- adopt`：new 整体脚手架化（改名 + `CLAUDE.md` alias + git init），adopt 按组件装规则。组件是 `COMPONENTS` 里写死的五类：`rules` `gates` `docs` `workflows` `ci`；`--only` 少选会因缺依赖被拒（`lib.ts:79` 的 `findMissingComponentDependencies`）。
- gate：`scripts/run-gates.ts` 聚合，`check:ci` 跑 lint/typecheck/test 主链，`doc-sync` 跑四个 verify（doc-pairing、agent-note-tree、agent-note-format、archived-agent-notes、doc-references）。全部 ~1.8s，很轻。
- `adlc-*` skills（flat 在 `.agents/skills/`，`.codebuddy/skills` 是 symlink）：inbox capture / promote / view，learning note，release。
- 三套 agent 侧目录：`.agents/notes/`（决策记录，进 gate）、`.agents/inbox/`（spark 队列，不进 gate，spark 文件不进 git）、`.agents/learning/`（回顾，不进 gate，`private/` 被 scoped `.gitignore` 挡住）。
- 双语：`README.md` `docs/*` `.agents/notes/**` 都要 `.zh.md` 配对，由 doc-pairing gate 卡；`AGENTS.md` 豁免，英文单份。
- release：版本权威在 root `package.json`，cut 改名 `## Unreleased` 并打 annotated tag，`docs/release.md` 是契约。

**盘点时注意到的两件事**

- `.agents/issues/` 目录存在但为空，README 的 layout 表也没列它 —— 现在没有任何契约说明它归谁管。
- 本次 1.0.0 cut 之前，工作区里已经有一处未提交的版本编辑（0.3.0 → 1.0.0）；release skill 要求遇到这种"不在 release 请求内的版本改动"先停下来报冲突，这规则真的会触发，不是摆设。

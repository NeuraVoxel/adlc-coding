# 架构

中文 | [English](architecture.md)

adlc-coding 是 adlc-coding 系列中面向 AI 工作范式与工作流的 kit：一套语言无关、不携带应用代码的规则体系。本文是改动 `packages/`、`scripts/`、`docs/`、`.agents/` 前的必读地图；决策理由在 [Agent Notes](../.agents/notes/README.md)，逐步操作指南不在本文。

## 组成

| 目录 | 职责 |
|---|---|
| `packages/create-adlc-coding/` | 安装器：从本 checkout 脚手架新项目，或把规则组件采纳进既有项目；checkout 即模板 |
| `scripts/` | `run-gates.ts` 门禁编排与 verify 脚本；语言无关的基础设施，不 import 业务代码 |
| `docs/` | 架构地图（本文）、[测试策略](testing.zh.md)与[发版合同](release.zh.md) |
| `.agents/` | 决策记录（`notes/`）、灵感 inbox 与学习复盘、以及 `adlc-*` 工作流技能 |

## 语言策略

面向人的合同以英文为主档，同一变更内更新 `.zh.md` 中文对照：`README.md`、`docs/*.md`、`.agents/notes/**/*.md`，以及 inbox 与 learning 的 README。`AGENTS.md` 与 `.agents/skills/*/SKILL.md` 保持纯英文——面向 agent，以约束模型上下文。inbox spark、`QUEUE.md`、学习笔记与 `ChangeLog.md` 有意保持单语，在配对门禁之外。`pnpm run doc-sync` 拒绝缺失、孤儿或结构漂移的对照文件。

## typecheck 范围

本 kit 不携带应用代码，因此只有一个覆盖工具链的 TypeScript 编译程序：`tsconfig.tools.json` —— `scripts/`、`vitest.config.ts`、安装器包；共享的严格度选项在 `tsconfig.base.json`。没有跨包边界，因此不存在按 face 覆写的 `module`/`moduleResolution`/`lib`，也没有 `paths` 映射。不存在根级 solution 编译；采纳这套规则的栈拥有自己的 typecheck 程序与泳道。

## 门禁体系

`pnpm run check:ci` 即 `scripts/run-gates.ts ci-primary`。runner 只做聚合图调度（spawn 命令、`needs` 依赖、有界并行、按阶段 fail-fast），不解析任何工具链——加一条泳道是加 Gate 定义，不是改 runner。当前图：

- `ci-primary`：lint、typecheck、test —— 单一并行阶段。
- `doc-sync`：双语文档配对、Agent Note 分类、Agent Note 格式、归档冻结完整性、文档引用完整性 —— 单一并行阶段。
- `check-all`：以上两者；CI 跑的就是它。

引用完整性只覆盖配对语料（`pairedDirs` 加 `pairedRootFiles`，直接从 pairing 门禁导入）中的仓库内相对 Markdown 链接；外链、协议相对目标、纯锚点，以及写在行内代码或围栏代码块里的路径都在范围之外。面向 agent 的指令层改由安装器的组件依赖检查，因为它的指涉物属于打包属性。

扩展点：

- **新 verify 门禁**：`scripts/verify-<invariant>.ts` + 配套 spec（证明拒绝一个非法用例），挂进 `gatesForMode`。
- **新泳道**（如 `ci-web`、`ci-python`）：扩展 `Mode` 联合与 `gatesForMode`；runner 本体不变。
- **UI 文案门禁**：引入 locale 字典时，配套 verify 门禁拒绝组件内硬编码文案。
- **端到端**：`ci-e2e` 泳道，独立于单测泳道，无凭据自跳过；它属于拥有被测进程的那个仓库。

Git 钩子分工：pre-commit 只做暂存文件的快速检查（lint --fix、行尾空白），pre-push 只跑 typecheck，CI 拥有穷举矩阵。本地检查点保持快速，是钩子不被绕过的代价。

## 语言无关的采纳

本 kit 不携带跨语言契约包。两个栈之间只共享两种产物：

1. **schema** —— 各语言的类型由它生成；禁止手写另一个栈的类型副本；生成物新鲜度由 gen/verify 成对门禁守护。
2. **提交在 git 里的 fixtures** —— 双端离线回放，这是每条泳道可独立验证的保障。

采纳这套规则的栈保留自己的仓库、根目录与泳道，并在出现任何跨栈产物之前先跑绿；活进程集成验证只存在于采纳方自己的 e2e 泳道。安装器设计见 `packages/create-adlc-coding/` 及其自带 README。

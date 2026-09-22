# adlc-coding

中文 | [English](README.md)

面向 AI 工作范式与工作流的 kit：范式与 `adlc-*` 技能，加上一套经过门禁验证的工程规范体系（分层 AGENTS.md 指令、`run-gates` 门禁聚合、lefthook 钩子、Agent Note 决策记录）。它语言无关、不携带任何应用代码——任何技术栈都可以用 `adopt` 采纳这套规则，并保留自己的仓库根。

## 快速开始

```sh
pnpm install
pnpm run check:ci     # lint + typecheck + test 门禁聚合
```

## 在新项目中使用本 kit

仓库本身即模板。在本仓库的克隆中：

```sh
# 脚手架新项目：完整拷贝、改名、钩子就位
pnpm run create -- new ../my-app --name my-app

# 只把验证过的规则采纳进既有项目
pnpm run create -- adopt ../existing-app --only rules,gates,docs,workflows,ci
```

`new` 写出的是一份组件拷贝，而不是整仓拷贝：新项目拿到的是整套规范——`adopt` 会装的那些组件，外加新项目必需的根清单、工具配置与 `scripts/` supplement——而本仓库自己的 notes、spark、learning 与 changelog 历史留在原处。它把 `adlc-coding` 改名为 `--name`，并重建 `CLAUDE.md` 别名。`adopt` 不加 `--force` 时拒绝覆盖已有文件，会把缺失的 runner 脚本合并进 `package.json`，并打印门禁所依赖的前置条件。详见[安装器 README](packages/create-adlc-coding/README.md)。

## 目录

| 目录 | 职责 |
|---|---|
| `packages/create-adlc-coding/` | 安装器：脚手架新项目或采纳规则 |
| `scripts/` | 门禁编排 runner 与 verify 脚本 |
| `docs/` | 架构地图、测试策略、发版合同 |
| `.agents/notes/` | 决策记录（Agent Notes） |
| `.agents/inbox/`、`.agents/learning/`、`.agents/research/` | 灵感排队（`QUEUE.md` 排队板）、会话复盘与研究笔记（带来源引用） |
| `.agents/skills/` | 本 kit 发布的 `adlc-*` 技能（inbox 捕获/升格/查看、实施、学习笔记、研究、发版） |
| `.claude/skills/`、`.codebuddy/skills/` | 指向 `.agents/skills` 的符号链接别名——Claude Code、CodeBuddy Code 与 zcode 只在此处发现项目技能 |

文档以英文为主档，配 `.zh.md` 中文对照；`pnpm run doc-sync` 拒绝两侧漂移。`AGENTS.md`（面向 agent）仅英文。

## 采纳清单

1. 根 `package.json` 的 `name` 与目录名：`adlc-coding` → 你的项目名。
2. 添加 git remote；`.github/workflows/ci.yml` 已按 pnpm + Node 22 配好。
3. 提供 `lint` / `typecheck` / `test` 脚本——门禁图会调用它们；脚手架会继承本 kit 的脚本。

`new` 命令会自动完成第 1、2 步。

## 采纳到另一个技术栈

本仓库不携带任何栈相关代码：某个技术栈住在自己的仓库里、拥有自己的泳道，通过 `adopt` 取走规则集并自行保持绿灯。跨栈共享产物只有两种形式——按语言生成的 schema，以及提交进 git、被双方离线回放的 fixture。

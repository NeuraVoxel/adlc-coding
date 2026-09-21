# Agent Note: 让 adlc-coding 能在 zcode agent 开发工具下被发现

Status: implemented

## Problem

adlc-coding 的规则与 workflow skills 此前只适配了已接线的 harness：CodeBuddy Code
在 `.codebuddy/skills`（指向 `.agents/skills` 的符号链接）下发现项目技能，而 Claude Code
只被接入了 `CLAUDE.md`——其技能目录从未建立别名。在 zcode agent 开发工具里做 agent 开发的
同事既拿不到 `.agents/skills/` 里的技能，也没有可用的入口约定。捕获此想法的 spark 是
[Feat-0008](../../../inbox/2026-09-21-zcode-agent-compat.md)。

## Decision

新增指向 `.agents/skills` 的 `.claude/skills` 别名，并以它作为 zcode 的路径，而不是另造
zcode 专属目录。

对 zcode 随包分发的 bundle 的调查确认：它从主流 harness 目录读取技能——其技能来源映射为
`[{agent:"claudeCode", projectPath:[".claude","skills"]}, {agent:"codexCli",
projectPath:[".codex","skills"]}, …, {agent:"codebuddy", projectPath:[".codebuddy","skills"]}]`。
因此 `.claude/skills` 同时被 zcode 读取，又是 Claude Code 的原生项目技能路径：一个别名服务
两者，并顺带补上了此前缺失的 Claude Code 技能支持。具体做法：

- `packages/create-adlc-coding/bin.ts` 用参数化的 `ensureSkillsAlias(dir, harnessDir,
  harnessName)` 取代了仅服务 CodeBuddy 的 `ensureCodebuddySkillsAlias`——一份实现、两处调用。
  它把 `<harnessDir>/skills` 重建为相对 `../.agents/skills` 符号链接（符号链接不可用时回退为
  副本），仅在 `.agents/skills` 存在时创建，且对已有的非符号链接保持不动。
- `runScaffold` 与 `runAdopt` 都分别为 `.claude`（Claude Code）与 `.codebuddy`
  （CodeBuddy Code）调用它。
- kit 仓库自身携带 `.claude/skills`（与 `.codebuddy/skills` 一样提交），使 kit 开箱即可被
  Claude Code、CodeBuddy Code 与 zcode 发现。
- `AGENTS.md`（仅英文）与 `README.md`（及 `README.zh.md`）登记 `.claude/skills` 与
  `.codebuddy/skills` 两个别名。

范围停留在技能加载层面的兼容；未做规则移植。

## Alternatives considered

- **`.zcode/skills` 别名（最初的尝试）。** 经 bundle 检查后不接受：zcode 本就读取
  `.claude/skills` 与 `.codebuddy/skills`，再加 `.zcode` 目录只会多出第三个仅服务 zcode、
  且不覆盖任何 `.claude/skills` 未覆盖 harness 的别名。`.claude/skills` 覆盖面严格更广——它还
  补上了此前没有任何技能别名的 Claude Code。
- **把规则完整移植到 zcode（为 zcode 重写 AGENTS.md）。** 不接受：spark 仅要求技能的读取与
  使用兼容，且完整移植有在 zcode 规则加载语义尚未需要时过早构建的风险。
- **把技能复制到各 harness 目录而非别名。** 不接受：这会让单一事实来源出现副本，技能一旦修改
  即漂移，并破坏 kit 已强制的"只在 `.agents/skills/` 下编写"不变式。

## Consequences

- Claude Code、CodeBuddy Code 与 zcode 现均可发现 kit 的 workflow skills——在 kit 仓库以及
  任何经本安装器 scaffold 或 adopt 的项目中——且都从唯一来源 `.agents/skills/` 经相对别名获得。
- 安装器的别名逻辑从一个 harness 一个函数收敛为一个参数化 helper；将来新增 harness 只是加一处
  调用，而非新增代码。
- zcode 的覆盖依赖其技能来源映射中保留 `.claude/skills` / `.codebuddy/skills`，已对照随包
  bundle 核实。若未来 zcode 移除这些条目，README 表格是唯一信号——届时重审。

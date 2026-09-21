# Agent Note: 升格完成后主动询问是否接受并实施提议

Status: proposed

## Problem

[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) 在第 8 步结束：报告火花路径、Agent Note 路径和队列行，然后停下——它的 hard stop 写得很明确，"Do not implement the proposal"。于是一次升格交付的是一份待评审的提议和一条翻掉的队列行，下一步该谁走则无人为之负责。是否接受并实施这个提议，每次都要由人凭空提出来，哪怕刚刚生成的正是那个决策所针对的制品。

这道接缝在实践中真实存在，不是推想：升格 [Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md) 时走完了整个流程——两种语言的笔记写好、火花翻成 `promoted`、队列行翻成 `[x]`——然后就停了，要不要实施只能靠临场再补一句话。

问题不在于 skill 应该自己去实施：那条 hard stop 是对的，`AGENTS.md` 也禁止在无人明确要求的当轮里提交或推送。问题在于 skill 从不发问，于是升格运行结束时那种"像完成了"的停顿，读起来是收尾，而不是一个等待决策的点。

## Proposal

升格 skill 以一个问题收尾，而不是停住：在第 8 步的报告之后，问一句是否接受该提议并开始实施，等答复之后再动别的任何东西。

- 这个问题是**一个**问题，每次运行只问一次，放在末尾：是否接受这个提议并开始实施？它会点名实施将触及什么，内容取自笔记自己的 Proposal 与 Acceptance criteria，因此一个"同意"是知情的，而不是一张空白支票。
- **沉默、暂缓或拒绝都终止本次运行。** 不实施任何东西，笔记保持 `proposed`，队列行保持升格留下的样子。没被回答的问题不等于同意。
- **同意则在同一次会话里开始实施**，仍然受 `AGENTS.md` 约束：按改动面取最窄的相关证据；`git commit` 与 `git push` 仍需各自独立的明确请求。
- 现有的 hard stop 保留并改写，而不是删除："do not implement the proposal" 变成 "do not implement the proposal unless this run's question was answered yes"。另两条 hard stop——没有明确的升格请求就不写笔记、永不删除或重命名火花文件——不变。
- 当一轮升格多个火花时，一个问题覆盖全部，在最后一份报告之后提出。

只有 skill 文件改动。[adlc-inbox-capture](../../../skills/adlc-inbox-capture/SKILL.md) 仍以自己的报告结束；[inbox README](../../../inbox/README.md) 对仍然照旧描述升格——它的 skills 表格那一行说的是 promote 做什么，而不是之后 agent 做什么。

见火花：[Feat-0007](../../../inbox/2026-09-21-promote-skill-ask-before-implement.md)。

## Alternatives considered

- **维持 skill 现状，让人自己提下一步。** 落败原因：这正是火花点名的那道接缝——每次都靠临场衔接，而升格之后的停顿读起来像活干完了，而不像一个等待决策的点。
- **让 promote 在报告之后直接实施，不发问。** 落败原因：与 skill 自己的 hard stop 和 `AGENTS.md` 相抵触，而且它让评审失去意义——`proposed` 笔记存在的意义就是让人在动手之前接受或拒绝它。
- **问一串问题——范围、顺序、计划、是否提交。** 落败原因：这一族 skill 的纪律是"确有未决之事时才问一个问题"；每次升格后甩一份问卷会把一个是非题变成盘问，何况提交与推送本来各有其规则。
- **把这个提问写进 inbox README 的 Promote 小节，而不是 skill。** 落败原因：README 是"升格是什么"的契约，而这是 agent 在运行时需要的运行行为——agent 读的是 skill；而且 README 对受结构门禁约束，把一次停顿编码在那里等于给同一个事实再找一个家。

## Acceptance criteria

- `adlc-inbox-promote` 的最后一步是那个问题，位置在报告之后、任何实施性编辑之前。
- 每次运行只问一次，点名实施将触及什么，且只问一件事——不盘问范围或顺序。
- 拒绝、暂缓或无答复都终止运行：除升格自身的三处编辑外不碰任何文件，笔记保持 `Status: proposed`，队列行保持升格给它的 `[x]` 与 Agent Note 链接。
- 同意则在同一次会话内开始实施，并且仍然不越界到 `git commit` 与 `git push`——按 `AGENTS.md`，两者始终是各自独立的明确请求。
- Hard stops 小节保留"没有明确升格请求就不写笔记"和"不删除或重命名火花文件"，并载明改写后的实施禁令。
- skill 保持 English-only、不写 `.zh.md`：skills 在配对文档语料之外，因此 `pnpm run doc-sync` 仍然通过，也不需要中文对。

## Risks

- **一个固定的提问会磨损提交纪律。** 每次升格后都被要求问"要不要开始"的 agent，可能把它听成行动的授权，于是同一会话里的下一句就是改代码。措辞必须让"实施"与"提交/推送"清晰分开——接受提议不等于获得提交的许可。
- **这个问题的质量只取决于它所总结的笔记。** 它点名实施会触及什么，所以一份单薄的 Proposal 或含糊的 Acceptance criteria 会产出一个人无法诚实回答的问题；提问继承了它所跟随的那份笔记的全部弱点。
- **多个升格共用一个问题会掩盖分歧。** 一轮升格三个火花只问一次时，"同意"意味着三个都要；只想做其中一个的人必须自己说明，而报告已经把它们当成一批了。
- **停顿从此归 skill 所有，而不归人。** 以前由人决定何时提起下一步，包括永远不提；每次都被问一句之后，"不"成了必须说出口的那个答案，而习惯性的"好"会把 `proposed/` 变成一道形式。

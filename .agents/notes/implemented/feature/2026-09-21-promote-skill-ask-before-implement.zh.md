# Agent Note: 升格完成后主动询问是否接受并实施提议

Status: implemented

## Problem

[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) 原先在第 8 步结束：报告火花路径、Agent Note 路径和队列行，然后停下——它的 hard stop 写得很明确，"Do not implement the proposal"。于是一次升格交付的是一份待评审的提议和一条翻掉的队列行，下一步该谁走则无人为之负责。是否接受并实施这个提议，每次都要由人凭空提出来，哪怕刚刚生成的正是那个决策所针对的制品。

这道接缝在实践中真实存在，不是推想：升格 [Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md) 时走完了整个流程——两种语言的笔记写好、火花翻成 `promoted`、队列行翻成 `[x]`——然后就停了，要不要实施只能靠临场再补一句话。

问题不在于 skill 应该自己去实施：那条 hard stop 是对的，`AGENTS.md` 也禁止在无人明确要求的当轮里提交或推送。问题在于 skill 从不发问，于是升格运行结束时那种"像完成了"的停顿，读起来是收尾，而不是一个等待决策的点。

## Decision

升格 skill 现在以一个问题收尾，而不是停住：第 8 步照旧报告并保留"do **not** commit unless the user asks"，新增的第 9 步问一句是否接受该提议并开始实施，然后等待答复。

- 这个问题是**一个**问题，每次运行只问一次，放在末尾：这个提议是否被接受、是否开始实施？它会点名实施将触及什么，内容取自笔记的 Proposal 与 Acceptance criteria，因此一个"同意"是知情的，而不是一张空白支票。
- **沉默、暂缓或拒绝都终止本次运行。** 不实施任何东西，笔记保持 `proposed`，队列行保持升格留下的样子。没被回答的问题不等于同意。
- **同意则在同一次会话里开始实施**，仍然受 `AGENTS.md` 约束：按改动面取最窄的相关证据；`git commit` 与 `git push` 仍需各自独立的明确请求。
- 原来的 hard stop 保留并改写，而不是删除："do not implement the proposal" 现在写作 "do not implement the proposal unless this run's question was answered yes; accepting a proposal is not permission to commit or push"。另两条 hard stop——没有明确的升格请求就不写笔记、永不删除或重命名火花文件——不变。
- 当一轮升格多个火花时，一个问题在最后一份报告之后覆盖全部。

只有 skill 文件改动。[adlc-inbox-capture](../../../skills/adlc-inbox-capture/SKILL.md) 仍以自己的报告结束；[inbox README](../../../inbox/README.md) 对仍照旧描述升格——它的 skills 表格那一行说的是 promote 做什么，而不是之后 agent 做什么。skill 保持 English-only、不写 `.zh.md`，因为 skills 在配对文档语料之外。

第一次以这个问题收尾的运行，正是 [Feat-0007](../../../inbox/2026-09-21-promote-skill-ask-before-implement.md)——本篇笔记自己的火花——的那次升格；它换来的那个"同意"就产出了本次改动。

## Alternatives considered

- **维持 skill 原状，让人自己提下一步。** 落败原因：这正是火花点名的那道接缝——每次都靠临场衔接，而升格之后的停顿读起来像活干完了，而不像一个等待决策的点。
- **让 promote 在报告之后直接实施，不发问。** 落败原因：与 skill 自己的 hard stop 和 `AGENTS.md` 相抵触，而且它让评审失去意义——`proposed` 笔记存在的意义就是让人在动手之前接受或拒绝它。
- **问一串问题——范围、顺序、计划、是否提交。** 落败原因：这一族 skill 的纪律是"确有未决之事时才问一个问题"；每次升格后甩一份问卷会把一个是非题变成盘问，何况提交与推送本来各有其规则。
- **把这个提问写进 inbox README 的 Promote 小节，而不是 skill。** 落败原因：README 是"升格是什么"的契约，而这是 agent 在运行时需要的运行行为——agent 读的是 skill；而且 README 对受结构门禁约束，把一次停顿编码在那里等于给同一个事实再找一个家。

## Consequences

一次升格现在结束在一个决策点上，而不是戛然而止：提议要不要落地会被说出口，而没人想做的那次升格，它的"不"作为运行的终点被记录下来，而不是变成沉默。[Feat-0007](../../../inbox/2026-09-21-promote-skill-ask-before-implement.md) 是第一例——它的"同意"变成了本次改动，笔记也在同一次改动里从 `proposed/` 移到这里。

验收标准要求的那些，现在就是 skill 的形状：问题是最后一步，位于报告之后、任何实施性编辑之前；每次运行只问一次，点名实施会触及什么，且只问一件事；拒绝、暂缓或无答复都只留下升格自身的三处编辑；同意则开工，但不碰 `git commit` 与 `git push`。原有两条 hard stop 都保留了下来，而 `pnpm run doc-sync` 在整个改动中保持绿——skill 在配对语料之外，因此不需要中文对。

评审中指出的那条持久风险是：停顿从此归 skill 所有，而不归人——每次都被问一句之后，"不"成了必须说出口的那个答案，而习惯性的"好"会把 `proposed/` 变成一道形式。还有两条小一点的：这个问题的质量只取决于它所总结的笔记，单薄的 Proposal 会产出无人能诚实回答的问题；以及一批升格只问一次时，"只做其中一个"必须说出来，而不能被默认。

没有任何机器检查这个问题是否真的被问出口。skills 是指导而非第二份契约，inbox 也在所有 gate 之外，所以这一步的约束力来源与这一族其余部分相同——它被写在了 agent 会读到的地方。

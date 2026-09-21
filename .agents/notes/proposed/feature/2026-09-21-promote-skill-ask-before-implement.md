# Agent Note: Promote asks whether to accept and implement the proposal

Status: proposed

## Problem

[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) ends its run at step 8: report the spark path, the Agent Note path, and the queue line, then stop — its hard stop is explicit, "Do not implement the proposal". So a promotion delivers a reviewed proposal and a flipped queue row, and the next move is nobody's step. Deciding whether the proposal is accepted and built is left to the human to raise out of nothing, every single time, even though the promotion just produced exactly the artifact that decision is about.

The seam is real in practice, not theoretical: promoting [Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md) ran the whole flow — note written in both languages, spark flipped to `promoted`, queue row flipped to `[x]` — and then stopped, with whether to build it left to an improvised follow-up message.

The gap is not that the skill should build things on its own; the hard stop is right, and `AGENTS.md` forbids committing or pushing without an explicit request in the current turn. The gap is that the skill never asks, so the accepted-looking end of a promote run reads as completion rather than as a decision point.

## Proposal

The promote skill ends with one question instead of a stop: after the report in step 8, ask whether the proposal is accepted and implementation should start, and wait for the answer before editing anything else.

- The question is **one** question, asked once, at the end of the run: accept this proposal and start implementing it? It names what implementing would touch, drawn from the note's own Proposal and Acceptance criteria, so a yes is informed rather than a blank cheque.
- **Silence, a deferral, or a no ends the run.** Nothing is implemented, the note stays `proposed`, and the queue row stays as the promotion left it. An unanswered question is not consent.
- **A yes starts implementation in the same session**, still under `AGENTS.md`: the narrowest relevant evidence for the change surface, no `git commit` or `git push` without their own separate explicit request.
- The current hard stop is kept and reworded rather than removed: "do not implement the proposal" becomes "do not implement the proposal unless this run's question was answered yes". The other two hard stops — no explicit promote request means no note, and never delete or rename the spark file — are unchanged.
- When a turn promotes several sparks, one question covers them all, asked after the last report.

Only the skill file changes. [adlc-inbox-capture](../../../skills/adlc-inbox-capture/SKILL.md) keeps ending at its own report, and the [inbox README](../../../inbox/README.md) pair keeps describing promotion as it does today — its skills-table row says what promote does, not what the agent does afterwards.

See the spark: [Feat-0007](../../../inbox/2026-09-21-promote-skill-ask-before-implement.md).

## Alternatives considered

- **Leave the skill as it is and let the human raise the next step.** Lost: that is exactly the seam the spark names — the handoff is improvised each time, and the pause after a promotion reads as the end of the job rather than as a decision waiting to be made.
- **Have promote implement the proposal right after reporting, without asking.** Lost: it contradicts the skill's own hard stop and `AGENTS.md`, and it makes the review meaningless — a `proposed` note exists so a human can accept or reject it before anything is built.
- **Ask a battery of questions — scope, ordering, plan, whether to commit.** Lost: the family's discipline is one question when a thing is genuinely unresolved; a questionnaire after every promotion turns a yes-or-no into an interview, and commit/push already have their own rule.
- **Put the ask in the inbox README's Promote section instead of the skill.** Lost: the README is the contract for what promotion *is*, while this is a run behavior an agent needs at run time — the skill is what the agent reads, and the README pair is gated on structure, so encoding a pause there would buy a second home for one fact.

## Acceptance criteria

- The last step of `adlc-inbox-promote` is the question, placed after the report and before any implementation edit.
- The question is asked once per run, names what implementation would touch, and asks one thing — no interview for scope or ordering.
- A no, a deferral, or no answer ends the run: no file beyond the promotion's own three edits is touched, the note keeps `Status: proposed`, and the queue row keeps the `[x]` and the Agent Note link the promotion gave it.
- A yes starts implementation in the same session and still stops short of `git commit` and `git push`, which stay separate explicit requests under `AGENTS.md`.
- The Hard stops section keeps "no explicit promote request → no note" and "do not delete or rename the spark file", and carries the reworded implementation stop.
- The skill stays English-only with no `.zh.md`: skills live outside the paired documentation corpus, so `pnpm run doc-sync` still passes and no counterpart is expected.

## Risks

- **A standing question can wear down the commit rule.** An agent that is told to ask "shall I start?" after every promotion may hear a mandate to act, and the next sentence in the same session is a code edit. The wording has to keep implementation and commit/push visibly separate — accepting a proposal is not permission to commit.
- **The question is only as good as the note it summarizes.** It names what implementation touches, so a thin Proposal or vague Acceptance criteria produces a question the human cannot answer honestly; the ask inherits every weakness of the note it follows.
- **One question for several promotions hides disagreement.** When a turn promotes three sparks and asks once, a yes means all three — a human who wants one of them now has to say so, and the run has already reported them as one batch.
- **The pause now belongs to the skill, not to the human.** Previously the human decided when to raise the next step, including never; a question asked every time makes "no" the thing that has to be said out loud, and a habitual yes turns `proposed/` into a formality.

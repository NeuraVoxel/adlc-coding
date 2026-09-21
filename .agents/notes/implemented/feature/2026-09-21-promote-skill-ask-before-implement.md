# Agent Note: Promote asks whether to accept and implement the proposal

Status: implemented

## Problem

[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) ended its run at step 8: report the spark path, the Agent Note path, and the queue line, then stop — its hard stop was explicit, "Do not implement the proposal". So a promotion delivered a reviewed proposal and a flipped queue row, and the next move was nobody's step. Deciding whether the proposal is accepted and built was left to the human to raise out of nothing, every single time, even though the promotion had just produced exactly the artifact that decision is about.

The seam was real in practice, not theoretical: promoting [Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md) ran the whole flow — note written in both languages, spark flipped to `promoted`, queue row flipped to `[x]` — and then stopped, with whether to build it left to an improvised follow-up message.

The gap was not that the skill should build things on its own; the hard stop was right, and `AGENTS.md` forbids committing or pushing without an explicit request in the current turn. The gap was that the skill never asked, so the accepted-looking end of a promote run read as completion rather than as a decision point.

## Decision

The promote skill ends with one question instead of a stop: step 8 reports and keeps "do **not** commit unless the user asks", and a new step 9 asks whether the proposal is accepted and implementation should start, then waits.

- The question is **one** question, asked once, at the end of the run: is this proposal accepted, and should implementation start? It names what implementing would touch, drawn from the note's Proposal and Acceptance criteria, so a yes is informed rather than a blank cheque.
- **Silence, a deferral, or a no ends the run.** Nothing is implemented, the note stays `proposed`, and the queue row stays as the promotion left it. An unanswered question is not consent.
- **A yes starts implementation in the same session**, still under `AGENTS.md`: the narrowest relevant evidence for the change surface, no `git commit` or `git push` without their own separate explicit request.
- The old hard stop is kept and reworded rather than removed: "do not implement the proposal" is now "do not implement the proposal unless this run's question was answered yes; accepting a proposal is not permission to commit or push". The other two hard stops — no explicit promote request means no note, and never delete or rename the spark file — are unchanged.
- When a turn promotes several sparks, one question after the last report covers them all.

Only the skill file changed. [adlc-inbox-capture](../../../skills/adlc-inbox-capture/SKILL.md) still ends at its own report, and the [inbox README](../../../inbox/README.md) pair still describes promotion as it did before — its skills-table row says what promote does, not what the agent does afterwards. The skill stays English-only with no `.zh.md`, since skills live outside the paired documentation corpus.

The first run to end with the question was the promotion of [Feat-0007](../../../inbox/2026-09-21-promote-skill-ask-before-implement.md), this note's own spark; the yes it drew is what produced this change.

## Alternatives considered

- **Leave the skill as it was and let the human raise the next step.** Lost: that is exactly the seam the spark names — the handoff was improvised each time, and the pause after a promotion read as the end of the job rather than as a decision waiting to be made.
- **Have promote implement the proposal right after reporting, without asking.** Lost: it contradicts the skill's own hard stop and `AGENTS.md`, and it makes the review meaningless — a `proposed` note exists so a human can accept or reject it before anything is built.
- **Ask a battery of questions — scope, ordering, plan, whether to commit.** Lost: the family's discipline is one question when a thing is genuinely unresolved; a questionnaire after every promotion turns a yes-or-no into an interview, and commit/push already have their own rule.
- **Put the ask in the inbox README's Promote section instead of the skill.** Lost: the README is the contract for what promotion *is*, while this is a run behavior an agent needs at run time — the skill is what the agent reads, and the README pair is gated on structure, so encoding a pause there would have bought a second home for one fact.

## Consequences

A promotion now ends at a decision point instead of trailing off: whether the proposal is built is answered out loud, and a promotion nobody wants to build gets its "no" recorded as the run's end rather than as silence. [Feat-0007](../../../inbox/2026-09-21-promote-skill-ask-before-implement.md) is the first case — its yes turned into this change, and the note moved from `proposed/` to here in the same change.

What the acceptance criteria asked for is now the skill's shape: the question is the last step, after the report and before any implementation edit; it is asked once per run, names what implementation touches, and asks one thing; a no, a deferral, or no answer touches nothing beyond the promotion's own three edits; a yes starts work but not `git commit` or `git push`. Both pre-existing hard stops survived, and `pnpm run doc-sync` stayed green through the change — the skill is outside the paired corpus, so no counterpart was expected.

The durable risk named in review is that the pause now belongs to the skill rather than to the human: a question asked every time makes "no" the answer that has to be said out loud, and a habitual yes turns `proposed/` into a formality. Two smaller ones came with it: the question is only as good as the note it summarizes, so a thin proposal yields a question nobody can answer honestly, and one question for a batch of promotions means a partial yes has to be spoken rather than assumed.

Nothing machine-checks that the question was asked. The skills are guidance rather than a second contract, and the inbox sits outside every gate, so the step holds the same way the rest of the family holds — by being written down where the agent reads it.

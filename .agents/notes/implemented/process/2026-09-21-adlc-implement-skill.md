# Agent Note: An agent carries an accepted proposal to `implemented/`

Status: implemented

## Problem

[adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md) ends its run by asking whether the proposal is accepted and implementation should start, and nothing owned the yes. The [notes README](../../README.md) states how a note moves between lifecycles — the `Status:` line, the skeleton re-tensed, the inbound links repaired — as a rule a reader applies by hand; no procedure read the note's `## Acceptance criteria`, ran evidence for it, or performed the move once the work was done. The seam was real in practice: promoting Feat-0007 ended at that question, and the answer produced [that change's own note](../feature/2026-09-21-promote-skill-ask-before-implement.md) through an improvised session rather than through a procedure.

The gap was the tail of the flow, not the ask. The ask had an owner and a hard stop; "done" did not. A proposal is written with acceptance criteria precisely so that completion is decidable, and the lifecycle move is the record that the decision shipped — the step a session that has just finished the interesting work is most likely to leave for later.

## Decision

A new skill, [adlc-implement](../../../skills/adlc-implement/SKILL.md), carries one `proposed/` Agent Note to shipped work and then to `implemented/`. It resolves the note — by path, slug, title, keyword, or the ID of the spark that promoted into it — and requires it to sit under `proposed/`; runs the supersession check the [notes AGENTS.md](../../AGENTS.md) requires before touching anything; asks one question, is this proposal accepted and should implementation start, naming what implementing would touch; implements to the note, with `## Proposal` as the scope, `## Acceptance criteria` as the definition of done, and `## Risks` as what to watch; runs the narrowest evidence the change surface implies per [docs/testing.md](../../../../docs/testing.md); and then moves the note in the same change, in both language files, rewriting `## Proposal` as a present-tense `## Decision` and folding the criteria and the risks into `## Consequences`. `## Problem` and `## Alternatives considered` stay as written: the move re-tenses the decision, it never rewrites it.

The move stays the note's own edit rather than a bot's. Steps 7 and 8 repair the **inbound** links — the spark and the `QUEUE.md` row, which sit outside every gate — and rewrite the downstream facts a change moved, such as a new path in the installer's `COMPONENTS`, the README pair's skill inventory, or a `ChangeLog.md` `## Unreleased` entry. The skill ships with the family in the installer's `workflows` component and is named in the README pair and the changelog.

The ask is not duplicated across the family: [adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md)'s step 9 now names this skill as the procedure its yes runs, and a yes already given to that question enters this skill at its step 4 instead of being asked again. When one promote run produced several notes, the single answer covers them all. Acceptance is not permission to commit or push, and a no, a deferral, or no answer leaves the tree untouched with the note still `proposed`.

## Alternatives considered

- **Let `adlc-inbox-promote` implement the proposal itself.** Lost: promotion's contract is spark → note, and the accepted path has to be reachable from a plain implement request too — a proposal accepted days later, in a session that never ran a promotion, needs an entry point that does not start from the inbox.
- **Adopt an external standalone implement skill.** Lost: the external `implement` was already declined when that chain was evaluated ([learning note](../../../learning/2026-09-21-adlc-flow-with-issue-channel.md), which took the chain's ticket half and left its implement half); it assumes a ticket chain and an issue tracker this repository does not have, and the kit's lifecycle, pairing, and evidence rules would have to be bolted onto it anyway.
- **Automate the move when a PR merges** (the still-open [Feat-0003](../../../inbox/2026-09-20-proposed-notes-auto-implemented-on-pr.md)). Lost for now: it needs CI with write access to the repository, which turns a reviewable one-line status change into a bot commit; the cheapest answer to "the move gets forgotten" is to put the move inside the run that did the work. Feat-0003 stays open, narrowed to changes that never ran this skill.
- **Leave the flow as it was — promote asks, the human implements and moves the note by hand.** Lost: nothing read the Acceptance criteria, so completion stayed a judgement call made with the proposal out of sight, and the move is the tail every earlier hand-move was spent on.
- **A non-interactive flag that implements without asking.** Lost: the single question is the only record of accepted-versus-not, and skipping it is exactly what the hard stop exists to prevent; it costs one turn.

## Consequences

An accepted proposal now has an owner end to end: the criteria are read before the work, the evidence matches the surface the note names, and the note reaches `implemented/` with its inbound links and the facts it moved in the same change. The scaffolding proposal sitting in `proposed/` today is the first note with an implementing path.

Three limits are durable. Nothing machine-checks that the question was asked or that the link and fact repairs ran — the skills are guidance, and the spark, the queue row, and the skill files sit outside every gate, so this discipline holds the way the rest of the family holds, by being written where the agent reads it. The move is only as good as the note: a thin `## Proposal` yields a thin question, and acceptance criteria that do not describe observable behavior yield a `## Decision` nobody can verify. And the evidence step inherits its surface from the note's own proposal, so a proposal that mis-states what it will touch runs the wrong checks.

Feat-0003 keeps its place and narrows: the move is still manual, so a change that lands without this skill can still leave a `proposed/` note behind, but the ordinary path no longer depends on someone remembering.

---
name: adlc-implement
description: >-
  Carries an accepted `.agents/notes/proposed/` Agent Note through to shipped
  work: confirm the proposal, implement it, run the narrowest evidence, then move
  the note to `implemented/` — status, skeleton, both languages — and repair the
  inbound links and downstream facts. Use when the user asks to 实施 / implement a
  proposal, names a proposed note, or says adlc-implement. Part of the adlc-*
  skill family under `.agents/skills/`. Do not use to write or promote a
  proposal, or to commit and push.
---

# Implement

Carry one accepted proposal to shipped work. Contract authority: the [Agent Notes README](../../notes/README.md) — its [Moving between lifecycles](../../notes/README.md#moving-between-lifecycles) section owns the file move, and [docs/testing.md](../../../docs/testing.md) owns evidence selection. Sibling: [adlc-inbox-promote](../adlc-inbox-promote/SKILL.md). This skill is guidance, not a second contract.

## Inputs

| Input | Required | Notes |
|---|---|---|
| **Target** | yes | A `proposed/` Agent Note: a path, a slug or title, a keyword uniquely matching one note under `.agents/notes/proposed/**`, or the ID of the spark that promoted into it (`Feat-0004`) |
| **Extra facts** | no | Constraints the user adds for this run — an ordering, a scope cut, an interface to hold. Never widen the note's Proposal; a genuine change to the decision needs a new note |

If the target is missing, or matches zero or several proposed notes, ask once and stop.

## Steps

1. Resolve the note. It must sit under `.agents/notes/proposed/{class}/` with a `Status: proposed` line agreeing with that folder. A note already under `implemented/` means the move already happened: stop and report instead of re-implementing it.
2. Read it against the tree. `## Proposal` is the scope, `## Acceptance criteria` is the definition of done, `## Risks` is what to watch. Then run the supersession check the [notes AGENTS.md](../../notes/AGENTS.md) requires: if an `implemented/` note already owns this decision, stop and report the owner rather than giving one decision a second home.
3. **Ask one question and wait:** is this proposal accepted, and should implementation start? Name what implementing would touch, drawn from the Proposal and the Acceptance criteria, so a yes is informed rather than a blank cheque. Silence, a deferral, or a no ends the run — nothing is edited and the note stays `proposed`. A yes the user already gave [adlc-inbox-promote](../adlc-inbox-promote/SKILL.md)'s own question is the answer, never asked twice; when one promote run produced several notes, that single answer covers them all.
4. Implement to the note. Stay inside the Proposal, satisfy every Acceptance criterion, respect the Risks, and follow the root `AGENTS.md` conventions: a doc change ships its `.zh.md` counterpart, every fact keeps one home, and a convention hardened after its second violation becomes a gate. If reality forces a different decision, stop and report it — widening the scope silently is how a note stops describing what shipped.
5. Run the narrowest evidence the change surface implies ([docs/testing.md](../../../docs/testing.md)); never default to the full suite, and never repeat a check that already passed. A failing check is fixed or proven environmental — never loosened, never skipped.
6. Move the note `proposed/` → `implemented/` in the same change, both language files. `Status: implemented`; rewrite `## Proposal` as a present-tense `## Decision`; fold `## Acceptance criteria` and `## Risks` into `## Consequences`. `## Problem` and `## Alternatives considered` stay as written — the move re-tenses the decision, it never rewrites it, and the format gate rejects a proposal-era heading under `implemented/`. The moved note is this change's Agent Note; do not add a second one.
7. Repair the note's **inbound** links in the same change: the spark that promoted it, the `QUEUE.md` row's `→ [Agent Note]` target, and any other reference to the old path. These surfaces sit outside every gate, so nothing else will catch a stale one.
8. Update the facts the change moved. A newly shipped path joins the installer's `COMPONENTS`; a new skill is named in the README pair; the change gets its `ChangeLog.md` `## Unreleased` entry; a doc stating the old behavior is rewritten. Rewrite the stale fact in place — never append a correction or a "previously, …" line ([implemented/AGENTS.md](../../notes/implemented/AGENTS.md)).
9. Report what shipped, the evidence that ran and its result, the new note path, and every link repaired. Do **not** `git commit` or `git push` unless the user asks for that in this turn.

## Hard stops

- No explicit implement / 实施 request in this turn → build nothing.
- No answer, a deferral, or a no → the tree is untouched and the note stays `proposed`.
- Never reverse, replace, or widen the decision while moving it; that takes a new note that supersedes this one, with both cross-linked.
- Never delete the spark or its queue row; the row flips to a link, it does not disappear.
- Accepting a proposal is not permission to `git commit` or `git push`.

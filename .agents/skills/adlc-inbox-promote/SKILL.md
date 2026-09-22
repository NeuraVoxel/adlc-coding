---
name: adlc-inbox-promote
description: >-
  Promotes an open `.agents/inbox/` spark — targeted by ID (`Feat-0001`), path,
  or title — into a formal `proposed/` Agent Note with bidirectional links and
  a QUEUE.md checkbox update. Use only when the
  user explicitly asks to 升格 / promote an inbox item, or says
  adlc-inbox-promote. Part of the adlc-* skill family under `.agents/skills/`.
  Do not use for capture-only requests.
---

# Inbox Promote

Promote one open spark to `proposed/`. Contract authority: the [inbox README](../../inbox/README.md) and the [Agent Notes README](../../notes/README.md). Sibling: [adlc-inbox-capture](../adlc-inbox-capture/SKILL.md). This skill is guidance, not a second contract.

## Inputs

| Input | Required | Notes |
|---|---|---|
| **Target** | yes | A spark ID (`Feat-0001`, `Bug-0002` — matched case-insensitively, number compared numerically so `feat-1` resolves), a spark path, a QUEUE title, or a keyword uniquely matching one `open` spark |
| **class** | yes | Always resolved to one of `feature` / `bug-fix` / `simplification` / `architecture` / `process` / `testing` — the caller may supply it, otherwise **you** choose it by reading the spark against the notes README's [Classification](../../notes/README.md#classification) discriminators and state the reason in the report. The spark's `Type` is a hint, never the answer: `Type` says whether the idea is new or already wrong, `class` says what kind of decision it is. Ask once only when two classes genuinely contend |
| **Extra facts** | no | Additional facts for the Agent Note; never invent beyond spark plus extras |

If the target is missing or matches zero / multiple `open` sparks, ask once and stop. Never promote without an explicit promote / 升格 request in the current turn.

## Steps

1. Resolve the spark file. An ID target (`Feat-NNNN` / `Bug-NNNN`) matches the spark whose `ID:` line — or `QUEUE.md` row tag — is that number; compare the prefix case-insensitively and the number numerically, so `feat-1` and `Feat-0001` are the same spark. Otherwise resolve by path, QUEUE title, or keyword. Require `Status: open`; if `promoted` or `discarded`, stop and report.
2. Choose the `class`: an explicitly given class wins; otherwise read the spark against the notes README's [Classification](../../notes/README.md#classification) discriminators and pick one of the six, then state the choice and its reason in the report. The spark's `Type` is a hint toward `feature` / `bug-fix`, never a default: `Type` and `class` are different axes, so a `feature` spark about tooling may belong to `process`, and a `bug` spark that only removes surface area may belong to `simplification`. Do not land on `feature` / `bug-fix` merely because the `Type` line says so. Ask one clarifying question only when two classes genuinely contend.
3. Create `.agents/notes/proposed/<class>/yyyy-mm-dd-<slug>.md` using today's date and a slug from the spark title. Never move or rename the inbox file into notes. If the path exists, adjust the slug — never overwrite.
4. Write a full **proposed** Agent Note, required sections only:

```markdown
# Agent Note: <title>

Status: proposed

## Problem
## Proposal
## Alternatives considered
## Acceptance criteria
## Risks
```

In `## Proposal` (or a nearby line), link back to the spark with a relative path, naming its ID in the link text (for example `[Feat-0001](../../../inbox/yyyy-mm-dd-slug.md)`) so the spark stays findable by number. Base the content on the spark (plus extras); expand it into a real proposal without inventing unstated product scope. `## Alternatives considered` needs at least one genuine alternative — from the user, implied by the spark, or an honest "defer / do nothing" with why it loses for now. The note follows the language policy for `.agents/notes/`: English primary with a `.zh.md` counterpart.

5. Update the spark: `Status: promoted` and a clear link to the new Agent Note (both language files when a counterpart exists).
6. Update the matching `QUEUE.md` row to `[x]` and append `→ [Agent Note](<relative path>)`; the row stays in its group and the ID tag stays.
7. Satisfy the notes README skeleton; the note-format gate rejects drifted sections once introduced.
8. Report the spark path, the chosen class with its reason, the Agent Note path, and the QUEUE line. Do **not** commit unless the user asks.
9. Ask one question and stop: is this proposal accepted, and should implementation start? Name what implementing would touch, drawn from the note's Proposal and Acceptance criteria, so a yes is informed. Wait for the answer: silence, a deferral, or a no ends the run; a yes starts implementation in the same session, following [adlc-implement](../adlc-implement/SKILL.md) from its step 4 — which is why its step 3 does not ask again — and still without `git commit` or `git push` unless those are separately requested. When a turn promotes several sparks, one question after the last report covers them all.

## Hard stops

- No explicit 升格 / promote in this turn → do not write a proposed note.
- Do not delete or rename the spark file; the inbox entry stays as the promotion record.
- Do not implement the proposal unless this run's question was answered yes; accepting a proposal is not permission to commit or push.

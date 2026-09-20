# Agent Note: The inbox queue board carries rows only

Status: implemented

## Problem

The shipped [`QUEUE.md`](../../../inbox/QUEUE.md) opened with a paragraph — "Empty. A capture adds a `yyyy-mm-dd-slug.md` spark and one row here in the same change; a promotion or dismissal marks the row `[x]` …" — and [capture](../../../skills/adlc-inbox-capture/SKILL.md) prepends each new row directly under the `# Inbox queue` heading, newest first. After the first capture both survived, so the board said "Empty." above a row that said otherwise; a sweep had to know the paragraph was stale prose and not part of the board. The paragraph also restated rules the [inbox README](../../../inbox/README.md) already owns, giving one fact two homes and two places to keep in sync.

## Decision

The board is the `# Inbox queue` heading and its rows — nothing else. No legend, no empty-state note, no prose between or below rows; an empty queue is a board with no `[ ]` row, and the README pair states that and stays the board's only authority. Capture keeps prepending directly under the heading, which is now unambiguous; the skill needed no change. The inbox stays outside every format gate, so this is a convention held by the README and by capture/promote, as with the [type axis](../../../inbox/README.md).

## Alternatives considered

- **Delete the paragraph on first capture (rule added to the skill and README).** Lost: capture would carry a conditional "remove the empty-state line if present" step, and the shipped file would keep duplicating the contract until someone triggered it — the drift we just hit, made permanent.
- **Rewrite the paragraph as a permanent legend under the rows.** Lost: the board would still be a second home for rules the README owns, and a text block living among checkbox rows invites the same "is this part of the board?" question on every sweep.
- **Mark emptiness with an explicit pseudo-row (`_No open entries._`).** Lost: it reads like a checkbox row to a sweep, and the first capture still has to delete it — the same conditional edit, moved one line down.
- **Gate the board shape (`verify-inbox-queue`).** Rejected for now, for the reason the type axis was: the inbox is deliberately outside every format gate, and capture has to stay cheap.

## Consequences

The board and the contract no longer compete, and a capture is one unconditional insert. The shipped and adopted `QUEUE.md` is a heading with no rows, so an adopter's first capture produces a board that already matches this repository's. This drift was found by running a real capture against the shipped board; that test spark is deleted rather than promoted, and its rationale lives here instead.

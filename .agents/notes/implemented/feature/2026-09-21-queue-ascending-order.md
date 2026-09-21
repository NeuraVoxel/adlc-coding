# Agent Note: Order `QUEUE.md` rows oldest capture first

Status: implemented

## Problem

[`QUEUE.md`](../../../inbox/QUEUE.md) listed rows newest-first inside each group. That order came from the flat board and survived the change to groups: [Feat-0002](../feature/2026-09-20-queue-feat-bug-sections.md) split the board into `## Feat` above `## Bug` and kept the old newest-first order inside each group, and the [inbox README](../../../inbox/README.md) stated it as the rule — "Order: newest capture first **inside a group**". Capture followed it literally: step 2 of the README's Capture section and step 5 of [`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) both put a new row at the top of its group.

So the board read backwards from what a queue is for. Reading `## Feat` top-down walked Feat-0007 → Feat-0001; the spark that had waited longest sat at the bottom, and every capture pushed the rest of the group down one line. Recency was the only axis the flat list had; after grouping, order inside a group said recency and nothing else, and recency is the one thing a sweep does not read off the board — the row's filename date and its ID already carry it.

Nothing was broken: the README stated the order and capture followed it. This changed that stated rule; it did not repair a violation of it.

## Decision

Inside a group, rows run oldest capture first: the lowest ID of that kind at the top, ascending below it, so `## Feat` reads Feat-0001 → Feat-0007 and `## Bug` reads Bug-0001 upward. Capture appends — a new row becomes the last row of the group matching its type, and nothing above it moves.

Departed rows keep the slot they were captured into: [`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) and a discard flip a row in place, so a `[x]` row stays interleaved where it was captured and a group still reads in arrival order. Grouping, row shape, and the ID tag remain exactly as Feat-0002 left them; only the direction of the order inside a group changed, and that note's own statement of the order now reads oldest-first.

The [inbox README](../../../inbox/README.md) pair carries the rule: the `## QUEUE.md` order bullet states oldest capture first inside a group, and step 2 of the Capture section appends the row as the last row of the matching group. Both languages carry it, since `verify-doc-pairing` checks the pair's structure under `doc-sync`. Step 5 of [`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) appends to the end of the group; promotion and dismissal are unchanged. The board itself was rewritten into ascending order with the rule.

See the spark: [Feat-0006](../../../inbox/2026-09-21-queue-ascending-order.md).

## Alternatives considered

- **Keep newest-first and sweep the group bottom-up.** Lost: the reading order stayed the one the spark called backwards, and "read it from the bottom" is a rule every reader and every agent has to be told separately, while flipping the file costs one edit and needs no reminder.
- **Keep capture as a prepend and add a written sort rule ("rows are sorted ascending by ID").** Lost: it states the same board with an extra rule that capture still has to obey by hand; the sort key is only checkable by eye, since the inbox is outside every gate, whereas "append to the end of the group" is the operation itself.
- **Order by status first — `[ ]` above `[x]` — and by capture second.** Lost: status changes on every promotion and dismissal, so rows would jump groups constantly; capture order is the axis that never changes, which is what makes it the sort key.
- **Do nothing; the newest-first board is only mildly awkward.** Lost: each capture replays the collision the spark names, and the board keeps training a reader to treat the longest-waiting item as the last one.

## Consequences

A sweep reads a group top-down in arrival order, so the open row that has waited longest is the first `[ ]` line of its group and a newly captured spark is the last line. A capture moves no existing row, and a promotion or dismissal still flips one row in place without changing its position.

The rule lives in the gated README pair rather than only in the file, so it cannot drift out of the documented shape without `pnpm run doc-sync` or a reviewer noticing; the board file itself stays outside every gate, and a prepend made against the rule would fail nothing. The cost is that the bottom of a group is now the interesting end, where the newest row and the departed-row links sit.

Two divergences stay open. [`adlc-inbox-view`](../../../skills/adlc-inbox-view/SKILL.md) still renders every spark newest-first in its tables, so the board and the view run in opposite directions; aligning them was left out of this change. And the order is expressed as ascending ID, which equals capture order only while every spark's number is assigned at capture — a spark numbered on first touch, or any later renumbering, would make "ascending by ID" and "oldest first" different boards.

# Agent Note: Group the inbox queue into Feat then Bug sections

Status: implemented

## Problem

[`QUEUE.md`](../../../inbox/QUEUE.md) was one flat list ordered newest-first, so `Feat-` and `Bug-` rows interleaved in capture order. Since the task ID had replaced the type tag, the prefix in each row tag was the only thing that said which kind a row was, and sweeping one kind meant reading every row and filtering in your head. The board is also the file a sweep opens first — grouping existed only in the `adlc-inbox-view` rendering, not in the board itself.

## Decision

The board is grouped: beneath `# Inbox queue`, `## Feat` comes first and `## Bug` below it, each group holding the rows of that kind, and a group with no rows is omitted. Rows inside a group run oldest capture first: [Feat-0006](../feature/2026-09-21-queue-ascending-order.md) reversed the newest-first order this decision originally kept; the grouping, the row shape, and the ID tag are unchanged. Row shape did not change — `- [ ] [Feat-0002] [title](./yyyy-mm-dd-slug.md)`, with a departed row keeping its `[x]` and its `→ [Agent Note](…)` link.

The [inbox README](../../../inbox/README.md) pair carries the shape: the `## QUEUE.md` section states the two groups and that the oldest capture now comes first inside a group, the Capture step says a row lands at the end of the group matching its type, and the Sweep paragraph says a sweep reads one group. Both languages changed together, since the pair is gated on structure. [`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) inserts into the matching group and creates the heading when the group is empty; [`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) flips a row in place, so departed rows stay in their group; `adlc-inbox-view` needed no change — it already grouped by type.

See the spark: [Feat-0002](../../../inbox/2026-09-20-queue-feat-bug-sections.md).

## Alternatives considered

- **Keep the flat list and rely on the `Feat-` / `Bug-` prefix (or on `adlc-inbox-view`) to filter.** Lost: the board is the file a sweep opens, and filtering a flat list is exactly the reading exercise this removed; the view skill renders tables on request but does not change what the board looks like.
- **Order rows by kind without section headings.** Lost: no visible boundary between the two kinds, so a reader still scans for where one ends; two `##` headings cost nothing and make the grouping checkable by eye.
- **Split into two board files (`QUEUE-Feat.md` / `QUEUE-Bug.md`).** Lost: the contract names one board, `QUEUE.md`, and every link, skill, and sweep step points at it; two files would break all of them to buy the same grouping.
- **Group by status first (`[ ]` above `[x]`) and by kind second.** Lost: status changes on every promotion and dismissal, so rows would move between groups constantly; kind never changes, which is what makes it the right first axis.

## Consequences

A sweep reads one group and skips the other, and the three Feat rows and the Bug row sit where the contract says they sit. The grouping is stated in the README pair rather than only in the file, so it cannot drift silently out of the documented shape without a reviewer noticing; `pnpm run doc-sync` stayed green through the change.

The cost named in review is real and now permanent: the board is no longer one chronological list, so row order says arrival order within a kind — oldest first — never across kinds. Capture dates remain in the row filenames and links, but anything that read global recency off row order has to read dates instead.

`adlc-inbox-capture` and `adlc-inbox-promote` learned the grouping in the same change, so captures cannot land in the wrong group and promotions cannot move a row between groups. `QUEUE.md` itself stays outside the gates — a malformed group would fail nothing — so the check remains the gated README pair plus review.

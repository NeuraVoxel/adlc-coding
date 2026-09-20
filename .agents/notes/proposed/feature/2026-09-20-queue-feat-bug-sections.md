# Agent Note: Group the inbox queue into Feat then Bug sections

Status: proposed

## Problem

[`QUEUE.md`](../../../inbox/QUEUE.md) is one flat list ordered newest-first, so `Feat-` and `Bug-` rows interleave in capture order. Since the task ID replaced the type tag, the prefix in each row tag is the only thing that says which kind a row is, and sweeping one kind means reading every row and filtering in your head. The board is also the file a sweep opens first — grouping exists today only in the `adlc-inbox-view` rendering, not in the board itself.

## Proposal

Split the board into two groups under the `# Inbox queue` heading: a `## Feat` group first and a `## Bug` group below it. Rows keep their exact shape — `- [ ] [Feat-0002] [title](./yyyy-mm-dd-slug.md)`, and a departed row keeps its `[x]` and its `→ [Agent Note](…)` link — and stay newest-first *inside* their group. A new `feature` spark is prepended to the top of the `## Feat` group; a new `bug` spark to the top of the `## Bug` group. A group with no rows is omitted.

The [inbox README](../../../inbox/README.md) pair carries the new shape: the `## QUEUE.md` section states the two groups and the per-group ordering, the Capture step says which group a row lands in, and the Sweep paragraph says a sweep reads one group. Both languages change together — the pair is gated on structure. The three inbox skills follow: capture inserts into the right group, promote flips a row in place, and view keeps grouping by type as it does today.

See the spark: [Feat-0002](../../../inbox/2026-09-20-queue-feat-bug-sections.md).

## Alternatives considered

- **Keep the flat list and rely on the `Feat-` / `Bug-` prefix (or on `adlc-inbox-view`) to filter.** Lost: the board is the file a sweep opens, and filtering a flat list is exactly the reading exercise this asks to remove; the view skill renders tables on request but does not change what the board looks like.
- **Order rows by kind without section headings.** Lost: no visible boundary between the two kinds, so a reader still scans for where one ends; two `##` headings cost nothing and make the grouping checkable by eye.
- **Split into two board files (`QUEUE-Feat.md` / `QUEUE-Bug.md`).** Lost: the contract names one board, `QUEUE.md`, and every link, skill, and sweep step points at it; two files would break all of them to buy the same grouping.
- **Group by status first (`[ ]` above `[x]`) and by kind second.** Lost: status changes on every promotion and dismissal, so rows would move between groups constantly; kind never changes, which is what makes it the right first axis.

## Acceptance criteria

- `QUEUE.md` opens with `# Inbox queue`, then a `## Feat` group and a `## Bug` group, in that order, with the rows of each newest-first; empty groups are omitted.
- Every row keeps its ID tag, title, and link, and a departed row keeps `[x]` plus its `→ [Agent Note](…)` link.
- The inbox README pair states the grouped shape in both languages, and `pnpm run doc-sync` passes.
- `adlc-inbox-capture` prepends into the group matching the spark's type; `adlc-inbox-promote` flips a row where it is; `adlc-inbox-view` output is unchanged in meaning.

## Risks

- The board stops being a single chronological list: "newest first" becomes true only inside a group, so anyone reading global recency off row order loses that signal. Row filenames still carry the capture date, but the ordering claim in the README has to change with the shape.
- The three inbox skills all read or write rows; if only some of them learn the grouping, captures land in the wrong place and the board drifts from its own contract. They change in one pass.
- `QUEUE.md` itself is outside the gates, so a malformed group fails nothing — the check is the README pair, which is gated, plus review.

# Agent Note: Inbox sparks carry a stable task ID

Status: implemented

## Problem

A spark had no handle shorter than its Chinese title. [`QUEUE.md`](../../../inbox/QUEUE.md) rows were identified by title text, so "promote the apps/inbox one" depended on prose matching, and promoting two similarly-titled sparks risked picking the wrong one. There was also no way to refer to a spark from a chat turn, a commit message, or a promoted Agent Note without restating its whole title. The [type axis](2026-09-18-inbox-type-classification.md) added a kind, but not an identity.

## Decision

Every inbox spark carries a third header axis, `ID`, directly below `Type`: `Feat-` for `feature` and `Bug-` for `bug`, followed by a per-type four-digit sequence zero-padded (`Feat-0001`, `Bug-0001`). The prefix derives from the type, so the number already says which kind it is.

Capture derives the number as that type's highest number already in use plus one, scanning both the spark files under `.agents/inbox/` and the `QUEUE.md` rows — no counter file exists. An ID is assigned once and then never changes: not with status, not on promotion or discard. A departed spark's number is never reused, so the sequence can show gaps.

The ID replaces the type tag in the [`QUEUE.md`](../../../inbox/QUEUE.md) row: `- [ ] [Feat-0001] [title](./yyyy-mm-dd-slug.md)`. Because the prefix carries the type, a sweep still reads one kind at a time, now by `Feat-` / `Bug-` prefix instead of by a `[feature]` tag.

Promotion accepts an ID as its target — [`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) matches it case-insensitively on the prefix and numerically on the digits, so `feat-1` resolves to `Feat-0001`; path, title, and keyword remain valid targets. The promoted Agent Note names the ID in its link back to the spark. [`adlc-inbox-view`](../../../skills/adlc-inbox-view/SKILL.md) adds an `ID` column; a spark captured before IDs existed shows `—` and gets its number on first touch.

The ID is a convention, not a gate: the inbox stays outside every format gate, so the [inbox README](../../../inbox/README.md) is its only authority.

## Alternatives considered

- **ID in the filename (`Feat-0001-2026-09-20-slug.md`).** Lost: capture date is the filename's leading sort key and the naming rule the layout table already states; a prefix pushes the date out of first position, and backfilling means renaming files that other documents already link to.
- **A counter file or registry in the inbox.** Lost: it adds writable state that must be kept in sync with the files that already carry the numbers, and it makes "the next number" depend on a file a human can forget to update — the max-plus-one scan is self-healing by comparison.
- **One shared sequence across both types (`0001`, `0002`).** Lost: the number would no longer say which kind of spark it is, which is the property that lets the ID replace the type tag in the queue row.
- **Keep the type tag and add the ID as a second tag.** Lost: two tags convey one fact; the row gets noisier and the two can drift apart, since the ID's prefix is derived from the type.
- **Gate the ID the way `agent-note-tree` gates note paths.** Rejected for now for the same reason the type is not gated: the inbox is deliberately outside every format gate so that capture stays cheap. Revisit if IDs actually drift.

## Consequences

A spark now has a handle usable in a chat turn, a queue row, a promoted note, and a sweep filter, and promotion can be targeted unambiguously. Capture writes one more line and one more tag, [`adlc-inbox-capture`](../../../skills/adlc-inbox-capture/SKILL.md) derives the number instead of accepting one, and the three inbox skills carry the rule. The one spark captured before this change was backfilled as `Feat-0001`; numbers of deleted sparks are gone for good, so gaps in a sequence are expected and mean nothing.

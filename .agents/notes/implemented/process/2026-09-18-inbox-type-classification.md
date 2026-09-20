# Agent Note: Inbox sparks carry a Feature/Bug type

Status: implemented

## Problem

The inbox had one axis, `Status`, so a queue sweep could only answer "is it still open?" — never "is this something we want to build, or something that is broken?". Those two kinds of spark need different handling at promotion: a new capability wants a design proposal, a defect wants a fix note, and the Agent Note tree already separates them into `feature/` and `bug-fix/` classes. Without a recorded type, that choice was re-litigated from prose at promote time, and a queue of mixed sparks could not be swept one kind at a time.

## Decision

Every inbox spark carries a second header axis, `Type`, with a closed set: `feature` (something that does not exist yet — new capability, contract, or process, or an improvement to one) and `bug` (something already wrong — a defect, a drift, or a violation of a contract this repository already states). It sits directly below `Status` in the spark file, and each [`QUEUE.md`](../../../inbox/QUEUE.md) row carries it as a tag before the link (`- [ ] [feature] [title](./yyyy-mm-dd-slug.md)`). Type is captured once and never changes with status: promotion and dismissal keep the type the spark was captured with.

Promotion derives the Agent Note class from the type: `feature` → `notes/proposed/feature/`, `bug` → `notes/proposed/bug-fix/`. An explicitly requested class wins; a missing or ambiguous type is one clarifying question, never a guess. The two [inbox skills](../../../skills/adlc-inbox-capture/SKILL.md) follow the same rule — capture resolves the type instead of silently defaulting it, promote maps it instead of re-asking from scratch.

The type is a convention, not a gate: the inbox stays outside every format gate, so the [inbox README](../../../inbox/README.md) is its only authority.

## Alternatives considered

- **Type as directories (`inbox/feature/`, `inbox/bug/`).** Lost: the inbox is a flat capture surface; a directory split makes capture a filing decision with a move on every reclassification, and breaks the links of already-promoted sparks for no added rigor over a header field.
- **Type only in `QUEUE.md`, grouped into `## Feature` / `## Bug` sections.** Lost: a spark file read on its own would no longer say what it is, and the file is what survives promotion while the queue row is a view.
- **Gate the type (`verify-inbox-*`) like the Agent Note tree.** Rejected for now: the inbox is deliberately outside every format gate, and the whole point of a spark is that capture stays cheap. Revisit if the tag actually drifts from the file.
- **A wider type set (chore, spike, research).** Deferred: two values cover every spark captured so far and map onto existing Agent Note classes; a third value would need a class to map to before it earns its keep.

## Consequences

A sweep can filter the queue to defects or to new capability without reopening each file, and promotion starts from a class instead of a reading exercise. Every capture now writes one more line and one more tag, and the two inbox skills carry the rule. A spark captured before this change has no `Type`; the two existing entries were classified by hand (the visualization app as `feature`, the reference-integrity gap as `bug`), and any other legacy spark gets its type on first touch.

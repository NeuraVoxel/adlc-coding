# Agent Note: Choose the Agent Note class deliberately at promotion

Status: implemented

## Problem

The inbox and the Agent Notes tree classify on two different axes, and promotion joined them with a lossy default. An inbox entry carries a `Type` from a closed set of two — `feature` for something that does not exist yet, `bug` for something already wrong ([inbox README](../../../inbox/README.md)) — while an Agent Note carries a `class` from a closed set of six — `feature`, `bug-fix`, `simplification`, `architecture`, `process`, `testing` ([Classification](../../README.md#classification)). `Type` records where an idea came from; `class` records what kind of decision the note is.

Promotion mapped the first onto the second mechanically: `feature` → `feature`, `bug` → `bug-fix`, with an explicitly supplied class as an override ([adlc-inbox-promote](../../../skills/adlc-inbox-promote/SKILL.md)). Capture guarantees that every spark carries a `Type`, so the branch meant to catch a *missing* type never fired; the default path always landed on `feature` or `bug-fix`, and the other four classes were unreachable through promotion.

The repository already held the counterexamples. The same kind of change sits in two classes depending on the route it took into the tree:

| Note | Domain | Route | Class |
|---|---|---|---|
| [inbox-view-skill](../process/2026-09-20-inbox-view-skill.md) | inbox skill | authored directly | `process` |
| [inbox-spark-ids](../process/2026-09-20-inbox-spark-ids.md) | inbox identifiers | authored directly | `process` |
| [inbox-queue-empty-state](../process/2026-09-20-inbox-queue-empty-state.md) | queue board | authored directly | `process` |
| [promote-skill-ask-before-implement](../feature/2026-09-21-promote-skill-ask-before-implement.md) | inbox skill | promoted | `feature` |
| [zcode-agent-compat](../feature/2026-09-21-zcode-agent-compat.md) | skills tooling | promoted | `feature` |
| [queue-feat-bug-sections](../feature/2026-09-20-queue-feat-bug-sections.md) | queue board | promoted | `feature` |
| [queue-ascending-order](../feature/2026-09-21-queue-ascending-order.md) | queue board | promoted | `feature` |

A change to an inbox skill is `process` when written by hand and `feature` when promoted; a change to the queue board splits the same way. The class tracks the route, not the decision.

A related defect shared the same blind spot. A note that moves between lifecycle folders leaves its inbound links stale, and those links live on surfaces no gate scans. `QUEUE.md` and the [zcode spark](../../../inbox/2026-09-21-zcode-agent-compat.md) both pointed at `notes/proposed/feature/2026-09-21-zcode-agent-compat.md` while the file sat in `implemented/feature/`; every gate stayed green.

## Decision

The class is now a deliberate, stated choice, and the two axes are written down as separate things.

[`adlc-inbox-promote`](../../../skills/adlc-inbox-promote/SKILL.md) resolves `class` to one of the six on every run. The caller may name it; otherwise the agent reads the spark against the Classification discriminators, picks the class the decision actually is, and states the choice and its reason in the report. `Type` is a hint toward `feature` / `bug-fix` and never a default, so a `feature` spark about tooling may land in `process`. One clarifying question survives, but it now fires only when two classes genuinely contend — previously it fired on a missing type, a condition capture makes impossible.

The [inbox README](../../../inbox/README.md) pair states the relationship: `Type` is the entry's own origin axis and is **not** the note class, and the six classes are chosen at promotion. Its Promote step and its skills table no longer describe a mapping.

The [notes README](../../README.md#moving-between-lifecycles) pair states that a lifecycle move repairs the note's inbound links in the same change, naming the inbox `QUEUE.md` row and the promoting spark as surfaces outside every gate.

The stale link is repaired: `QUEUE.md` and the spark now point at `implemented/feature/2026-09-21-zcode-agent-compat.md`.

## Alternatives considered

- **Widen the inbox `Type` set to the six classes, or give it a 1:1 map of them.** Lost: the inbox exists to capture cheaply — capture first, promise nothing — and a six-way class decision at capture puts the expensive judgment at the moment of least information, before the idea has been thought through. It would also make the `Feat-` / `Bug-` ID prefix and the two queue groups six-way, rewriting surfaces this problem never touched.
- **Keep the mapping and document it as intentional.** Lost: the table above is not a documentation gap, it is a wrong answer. `Type` answers "new or already wrong", which does not determine whether a change is a capability, a process change, or a removal of surface area; no mapping of two values onto six is right more often than it is wrong.
- **Add a gate over `QUEUE.md` and spark links.** Lost twice over: the inbox is outside every format gate by contract, and this is the first violation of the inbound-link convention, while the repository's own rule promotes a convention to a gate only after its second violation. A gate here would be both out of place and premature.
- **Reclassify the four promoted notes into `process` in this change.** Lost: that is a separate change touching seven note files, and this note's job is to state the counterexample, not to erase the evidence that produced the rule. The split is recorded here instead.

## Consequences

Promotion now names its class and its reason, so all six classes are reachable through the inbox rather than only through direct authorship. `Type` keeps its cheap two-value meaning at capture and stays immutable across promotion, which is what the inbox needs it for.

What it cost: a promotion carries one more stated judgment, and a careless reading of the spark can still pick a defensible-but-wrong class — no gate can tell a `feature` note from a `process` note, so this remains a review judgment. The repaired links stay unverified, because `QUEUE.md` and spark files are outside `verify-doc-references`, which scans the pairing corpus only; a future lifecycle move that forgets its inbound links will be exactly as invisible as this one was. The four counterexamples remain in `feature/` by decision, so the tree still contains notes whose class the rule above would not produce.

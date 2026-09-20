# Agent Note: The inbox gets a read-only view skill

Status: implemented

## Problem

Two skills covered the inbox and both write: [capture](../../../skills/adlc-inbox-capture/SKILL.md) adds a spark, [promote](../../../skills/adlc-inbox-promote/SKILL.md) turns one into a note. Seeing what was there meant reading [`QUEUE.md`](../../../inbox/QUEUE.md) line by line and opening files for anything the row did not say — the rows are a view, so a drifted checkbox reads as truth, and the row cannot be trusted over the entry file, which the [inbox README](../../../inbox/README.md) makes the authority. Filtering one kind meant grouping the `[feature]` / `[bug]` tags by eye, and a departed entry was only findable by opening its file, since the interesting rows of a sweep are the `[ ]` ones.

## Decision

A third skill, [adlc-inbox-view](../../../skills/adlc-inbox-view/SKILL.md), renders the inbox and writes nothing: it reads every `yyyy-mm-dd-*.md` directly under `.agents/inbox/` and prints one Markdown table per `Type` group — `feature`, then `bug` — newest capture first, with `Date` / `Title` / `Status` / `File` columns and the count in the group heading. Every entry is listed, departed ones included, because `Status` is a column rather than a filter; a legacy spark with no `Type:` line falls into an `untyped` group instead of being guessed. The entry file stays the authority: when a `QUEUE.md` row disagrees with the file, the view reports the file's version and names the row that needs fixing, without fixing it.

The skill ships with the rest of the family in the installer's `workflows` component and is registered in the inbox README pair — in the skills table and in the sweep section, which is where a reader looks for "how do I see the queue".

## Alternatives considered

- **Render from `QUEUE.md` rows instead of the entry files.** Lost: the row is a view and can drift from the file, and the README already rules that the file wins on disagreement — a view built on rows would present the drift as fact.
- **Group by `Status` (`open` / `promoted` / `discarded`) instead of by `Type`.** Lost: the question a sweep actually asks is "what do we want to build versus what is broken", and `Type` is the axis that already maps onto the Agent Note classes at promotion; status survives fine as a column.
- **Add filter arguments (`--type bug`, `--status open`, `--all`).** Lost: one unconditional pass answers both "what is open" and "what happened to the rest", and every argument is a surface to maintain; the queue rows remain the place to filter by tag when someone wants one kind.
- **Let the view repair drifted rows it notices.** Lost: a read-only skill is worth more than a convenient one — the three write paths stay capture, promote, and discard, and a suggestion the human can check beats a silent edit from a command that said it would only look.
- **No skill at all; tell the agent to read `QUEUE.md` in the sweep section.** Lost: that is what happened before, and it leaves departed entries and drifted rows to whoever reads carefully enough.

## Consequences

One request now shows the whole inbox, grouped and dated, without opening a file, and a legacy spark without a type announces itself as `untyped` instead of disappearing or being invented. The view cannot corrupt the queue by construction, and the drift it surfaces still needs a human edit. The installer and both README languages carry the new skill, so an adopter's inbox links to a skill they actually received.

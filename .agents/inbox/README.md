# Inbox

The queue for uncommitted sparks: capture first, promise nothing; sweep `QUEUE.md` for open items; promote what deserves formal review into an Agent Note.

## Boundary

- **Outside every format gate.** The gates scan `.agents/notes/` only; the inbox is held to this README plus human and agent discipline.
- **Not a learning note.** Retrospectives and process samples belong in [`.agents/learning/`](../learning/README.md); sparks surfacing during a retrospective land here, and learning only links over.
- **Not a decision record.** An idea worth formal review is promoted to an Agent Note under `notes/proposed/`; never rename or move an inbox file into the notes tree.

One idea must not exist as an authoritative todo in both the inbox and learning at once.

## Entry language

Default to Chinese for the body; Status, Type, and ID values, paths, commands, and terms stay English (for example Agent Note, `QUEUE.md`, `Status: open`, `Type: bug`, `ID: Feat-0001`).

## Layout

| Path | Responsibility |
|---|---|
| `README.md` | This directory's contract |
| `QUEUE.md` | The checkbox board (what a queue sweep reads) |
| `yyyy-mm-dd-slug.md` | One spark; the filename date is the capture date |

## Entry shape

```markdown
# Inbox: <short title>

Status: open
Type: feature
ID: Feat-0001

## Spark
<a few sentences: the idea and why it is captured now>

## Notes
(optional) context, links, rough cost; never a Proposal skeleton
```

`Status` values:

- `open` — still queued
- `promoted` — left the queue by promotion; the body links the owning Agent Note
- `discarded` — left the queue by dismissal; a one-line reason next to the status or in `## Notes`

`Type` values (closed set):

- `feature` — something that does not exist yet: a new capability, contract, or process, or an improvement to one
- `bug` — something already wrong: a defect, a drift, or a violation of a contract this repository already states

`Type` is captured once and never changes with status: a promoted or discarded spark keeps the type it was captured with. No gate checks the shape; this README and discipline do.

`ID` is the spark's task number: `Feat-` for `feature` and `Bug-` for `bug`, followed by a per-type four-digit sequence (`Feat-0001`, `Bug-0001`). Capture derives it as the highest number of that type already in use plus one, scanning both the spark files and the `QUEUE.md` rows. An ID is assigned once and then never changes — not with status, not on promotion or discard — and a departed spark's number is never reused. A spark captured before IDs existed gets its number on first touch. No gate checks any of this either; this README and discipline do.

## QUEUE.md

- `[ ]` marks `open`.
- `[x]` marks a departed entry (`promoted` or `discarded`); a promoted row links the Agent Note; a discarded row may carry a short reason.
- Each row carries the entry's ID as a tag before the link: `- [ ] [Feat-0001] [title](./yyyy-mm-dd-slug.md)`. The tag carries the type too — `Feat-` is `feature`, `Bug-` is `bug`.
- Rows are grouped by kind, `Feat` above `Bug`, each group under its own `## ` heading beneath `# Inbox queue`; a group with no rows is omitted.
- Order: oldest capture first **inside a group** — the row captured first sits at the top of its group and each later capture joins the bottom.

The board is the `# Inbox queue` heading, its group headings, and its rows — no legend, no empty-state note; this README is the board's only authority, so a fact lives here and never in the file. No `[ ]` row means the queue is empty.

Every capture, promotion, or dismissal updates the entry file and its `QUEUE.md` row in the same change. On disagreement the entry's `Status` wins; fix the row.

## Capture

1. Create `yyyy-mm-dd-slug.md` with `Status: open`, a `Type:` line (`feature` or `bug`), an `ID:` line derived as that type's highest number in use plus one, and a few sentences under `## Spark`.
2. Append `- [ ] [<id>] [title](./yyyy-mm-dd-slug.md)` to `QUEUE.md`, as the last row of the group matching the type (`Feat` for `feature`, `Bug` for `bug`). Create the group heading when the group has no rows yet.

Or use the installed skills (adlc-authored skills live flat under `.agents/skills/`):

| Skill | Purpose |
|---|---|
| [adlc-inbox-capture](../skills/adlc-inbox-capture/SKILL.md) | Given just the body (optional title / slug / notes / type): writes the spark (type resolved, never silently defaulted), assigns the next ID, and updates `QUEUE.md` |
| [adlc-inbox-promote](../skills/adlc-inbox-promote/SKILL.md) | Explicitly promotes one `open` spark — targeted by ID, path, title, or keyword — to a `proposed/` Agent Note (class derived from its type unless one is given) and updates status and queue |
| [adlc-inbox-view](../skills/adlc-inbox-view/SKILL.md) | Read-only: renders every spark as Markdown tables grouped by type (`feature` / `bug`), newest first, with `ID` and `Status` columns |

Capture never promotes; promotion requires an explicit promote request in the turn.

## Sweep the queue

Open `QUEUE.md` and read only the `[ ]` rows; sweeping one kind means reading that group and skipping the other. Open an entry file when more context helps. No mandated review cadence. [adlc-inbox-view](../skills/adlc-inbox-view/SKILL.md) renders the entries as tables grouped by type when you want the whole inbox, departed entries included, in one pass.

## Promote

1. Confirm the spark deserves a full, seriously reviewed Agent Note.
2. Choose the class from the type: `feature` → `notes/proposed/feature/`, `bug` → `notes/proposed/bug-fix/`. An explicitly requested class wins; a missing or ambiguous type is one clarifying question, never a guess.
3. Create the formal note under `.agents/notes/proposed/<class>/yyyy-mm-dd-….md` — never by renaming or moving the inbox file.
4. Cross-link: the proposed note links the spark; the spark becomes `Status: promoted` and links the note, keeping its `Type`.
5. Flip the `QUEUE.md` row to `[x]` with the Agent Note link; the ID tag stays.
6. Prefer one change for all of it; if split across commits, the bidirectional links must be complete by the end.

An agent may draft entries and update `QUEUE.md`; an agent must not promote unless the human explicitly asks in the current turn.

## Discard

1. Set the entry to `Status: discarded` with a short reason.
2. Flip the row to `[x]` (a short reason is optional).
3. Keep the file by default; delete it only when it has no reference value, and remove its row.

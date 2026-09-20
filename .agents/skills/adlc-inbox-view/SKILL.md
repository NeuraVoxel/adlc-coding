---
name: adlc-inbox-view
description: >-
  Lists `.agents/inbox/` sparks as Markdown tables grouped by `Type`
  (`feature` / `bug`), newest first, with `ID` and `Status` columns. Use when the user
  wants to see or sweep the inbox — 看 inbox / 列灵感 / 队列里有什么 — or says
  adlc-inbox-view. Part of the adlc-* skill family under `.agents/skills/`.
  Read-only: for capture use adlc-inbox-capture, for promotion adlc-inbox-promote.
---

# Inbox View

Render the inbox as tables. Contract authority: the [inbox README](../../inbox/README.md). Siblings: [adlc-inbox-capture](../adlc-inbox-capture/SKILL.md), [adlc-inbox-promote](../adlc-inbox-promote/SKILL.md). This skill is guidance, not a second contract.

No inputs. Every spark is listed — open, promoted, and discarded alike — and `Status` says which is which.

## Steps

1. Confirm `.agents/inbox/README.md` and `QUEUE.md` exist; if not, stop and say the inbox is not initialized.
2. Read the spark files: every `yyyy-mm-dd-*.md` directly under `.agents/inbox/` (skip `README*.md` and `QUEUE.md`). No spark file → report an empty inbox (`QUEUE.md` has no `[ ]` row) and stop.
3. From each file take five facts: capture date from the filename, title from the `# Inbox: <title>` heading, and the `Status:`, `Type:`, and `ID:` lines. A file missing a `Type:` line is a legacy spark — it lands in an `untyped` group rather than being guessed. A file missing an `ID:` line shows `—` in the ID column; do not derive a number for it here.
4. Group by `Type` in this order: `feature`, `bug`, `untyped` (omit the `untyped` group when no file needs it).
5. Sort inside a group newest-capture first, the order `QUEUE.md` uses.
6. Emit one Markdown table per group, headed by the type:

```markdown
## feature (2)

| ID | Date | Title | Status | File |
|---|---|---|---|---|
| Feat-0001 | 2026-09-20 | <title> | open | [2026-09-20-slug.md](./2026-09-20-slug.md) |
```

Group heading: `## <type> (<count>)`. Columns: `ID` (`Feat-NNNN` / `Bug-NNNN`, `—` when the spark has none), `Date` (filename date, `yyyy-mm-dd`), `Title` (verbatim from the heading), `Status` (`open` / `promoted` / `discarded`), `File` (relative link to the spark).
7. The entry file is the authority: when a spark has no `QUEUE.md` row, or its row's checkbox disagrees with the file's `Status`, the file wins — add one line naming the entry and saying the row needs fixing. Do not fix it yourself.
8. Report only the tables and that one line. Do **not** commit — nothing was written.

## Hard stops

- Read-only: never create, edit, or delete a spark or a `QUEUE.md` row; never capture, promote, or discard from this skill.
- Do not print spark bodies, `## Spark`, or `## Notes` content — the table is the output. Open a file only when the user asks for one entry.
- Do not run gates on the inbox; it is outside every format gate.

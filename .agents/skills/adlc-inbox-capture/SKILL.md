---
name: adlc-inbox-capture
description: >-
  Captures an uncommitted inspiration into `.agents/inbox/` (spark file with a
  derived `Feat-`/`Bug-` task ID, plus a QUEUE.md checkbox). Use when the user wants to record a spark or idea, says
  adlc-inbox-capture / 记到 inbox / 记灵感, or gives only a spark body and asks to
  queue it without promoting to an Agent Note. Part of the adlc-* skill family
  under `.agents/skills/`. For learning retrospectives use adlc-learning-note.
---

# Inbox Capture

Record one spark. Contract authority: the [inbox README](../../inbox/README.md). Sibling: [adlc-inbox-promote](../adlc-inbox-promote/SKILL.md). This skill is guidance, not a second contract.

## Inputs

| Input | Required | Notes |
|---|---|---|
| **Body** (the spark) | yes | The idea and why it is captured now; body defaults to Chinese, terms and paths stay English |
| **Title** | no | Short title; derive from the body when missing |
| **slug** | no | `kebab-case`; derive from the title when missing |
| **Notes** | no | Optional context only — never a Proposal skeleton |
| **Type** | no | `feature` (something new or an improvement) or `bug` (a defect, drift, or violation of a stated contract); derive from the body when it is clearly one, ask once when ambiguous |

If the body is missing, ask once and stop. Do not interview for optional fields — but a `Type` is written on every spark, so resolve it (derive, or ask once) rather than leaving it off.

## Steps

1. Confirm `.agents/inbox/README.md` and `QUEUE.md` exist; if not, stop and say the inbox is not initialized.
2. Date = today (`yyyy-mm-dd`). Path: `.agents/inbox/{date}-{slug}.md`. If the path exists, adjust the slug (`-2`, `-3`, …) — never overwrite.
3. Derive the ID: `Feat-` for `feature`, `Bug-` for `bug`, followed by that type's highest number already in use plus one, zero-padded to four digits (`Feat-0001`). Scan both the spark files under `.agents/inbox/` and the `QUEUE.md` rows for the numbers already in use; a departed spark's number is never reused.
4. Write the spark file:

```markdown
# Inbox: <title>

Status: open
Type: <feature|bug>
ID: <Feat|Bug>-NNNN

## Spark
<body, lightly edited, never expanded into a plan>

## Notes
<only when the user supplied notes; otherwise omit the whole section>
```

5. Append to `QUEUE.md`, with the ID as the tag: the new row goes last inside the group matching the type (`Feat` for `feature`, `Bug` for `bug`), under that group's `## ` heading; create the group heading when the group has no rows yet. Groups read oldest capture first, so the new row joins the bottom and no existing row moves. `Feat` stays above `Bug`:

```markdown
## Feat

- [ ] [<id>] [<title>](./{date}-{slug}.md)
```

6. Report the created path, the assigned ID, and the QUEUE line. Do **not** commit unless the user asks.

## Hard stops

- Do not promote to `proposed/`, write Agent Notes, or put todos in `.agents/learning/`.
- Do not invent dimensions, architecture, or acceptance criteria beyond what the user wrote.
- Do not silently default `Type`; derive it when the body is unambiguous and ask once when it is not.
- Never take an ID from the caller and never invent one: derive it from the current scan. A spark captured before IDs existed gets its number on first touch.
- The inbox is outside every format gate — do not run gates on it.

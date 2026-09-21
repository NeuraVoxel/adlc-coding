---
name: adlc-research
description: >-
  Investigates a question against high-trust primary sources and captures the
  findings as a cited note in `.agents/research/`, run as a background agent so
  the main thread keeps working. Use when the user wants a topic researched,
  docs or API facts gathered, or the reading legwork delegated — 调研 / 查资料 /
  研究一下 — or says adlc-research. Part of the adlc-* skill family under
  `.agents/skills/`. For reflection on this repository or the session use
  adlc-learning-note instead.
---

# Research

Spin up a **background agent** so you keep working while it reads. Contract authority: the [research README](../../research/README.md). Sibling: [adlc-learning-note](../adlc-learning-note/SKILL.md). This skill is guidance, not a second contract.

## Inputs

| Input | Required | Notes |
|---|---|---|
| **Question** | yes | What to investigate, and what the answer is for |
| **slug** | no | `kebab-case`; derive from the question when missing |

If the question is missing, ask once and stop. Do not interview for optional fields.

## Steps

1. Confirm `.agents/research/README.md` exists; if not, stop and say research is not initialized.
2. Date = today (`yyyy-mm-dd`). Path: `.agents/research/{date}-{slug}.md`. If the path exists, adjust the slug (`-2`, `-3`, …) — never overwrite. Settle the path *before* dispatch so a running agent cannot clobber an existing note.
3. Start a **background agent** for the reading. Its brief:
   1. Investigate against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
   2. Write the findings to that one file: a `# <title>` heading naming the question, then the findings with the source of every claim cited.
   3. Chinese by default; terms, paths, and commands stay English. No Agent Note header, no `Status:` line, no skeleton — research notes sit outside every gate.
4. When it reports back, confirm the file exists at the settled path and spot-check that the claims carry sources. A claim without a source is not a finding.
5. If the note surfaces an uncommitted spark or todo, capture it in `.agents/inbox/` ([adlc-inbox-capture](../adlc-inbox-capture/SKILL.md)) and link it from the note.
6. Report the created path. Do **not** commit unless the user asks.

## Hard stops

- Primary sources only: never let a secondary write-up stand in for the source it summarizes, and when a source cannot be reached say so in the note rather than paraphrasing around it.
- Do not record a claim without the source that owns it.
- Do not write Agent Notes or touch `.agents/notes/`; do not run gates on `.agents/research/`.
- Do not turn the note into a plan, a decision, or a todo list — decisions go to Agent Notes, sparks to the inbox.

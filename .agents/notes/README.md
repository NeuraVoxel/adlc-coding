# Agent Notes

English | [中文](README.zh.md)

One kind of design doc lives here. An **Agent Note** records a decision that affects this repository — the *why* and *what we gave up*, the parts code and docs cannot carry. Session recaps and study notes live in [`.agents/learning/`](../learning/README.md); uncommitted sparks queue in [`.agents/inbox/`](../inbox/README.md).

## Layout and naming

The path encodes both axes: `{lifecycle}/{class}/yyyy-mm-dd-topic.md`, and the classification gate (`scripts/agent-note-tree.ts`) rejects any note path outside the closed sets below.

- **lifecycle** (the top-level directory) is the status, and notes move between folders as it changes:
  - `proposed/` — reviewed proposals, not yet built.
  - `implemented/` — the decision shipped; the file records the decision and the rejected alternatives, and **stays current with what actually shipped** ([`implemented/AGENTS.md`](implemented/AGENTS.md)): when code later moves a file, renames a package, or changes a default, the same change updates the corresponding facts (facts only — never the decision itself).
  - `rejected/` — considered and declined; the verdict lives on the `Status:` line and the proposal stays frozen as it was.
  - `archived/` — shipped decisions whose rationale no longer guides future work; append-only frozen history, never current authority.
- **class** (the nested directory) is the kind of decision, a closed set — what each one covers is spelled out in [Classification](#classification). Adding a class means extending `CLASSES` in the gate script and updating that section in the same change.

The date is when the topic was **first proposed** (per git history). Notes cross-reference through relative Markdown links, never bare filenames or numbers. There is no centralized index, because an index restates every note's one-line claim and drifts the moment a note moves lifecycle or class — the active tree *is* the inventory, and browsing it costs one `ls`. The gate enforces the same conclusion structurally: any file at the notes root other than the README pair and the supplements below fails classification, so a generated `INDEX.md` cannot survive the tree.

Environment instructions that apply only inside this tree live in English-only supplements — [`AGENTS.md`](AGENTS.md), [`implemented/AGENTS.md`](implemented/AGENTS.md), [`archived/AGENTS.md`](archived/AGENTS.md) — each carrying one rule the README cannot carry, and pointing back rather than restating it. The classification gate admits them; the pairing gate exempts them exactly as it exempts the root `AGENTS.md`.

## Classification

Each Note belongs to one path-encoded class from the closed set enforced by `scripts/agent-note-tree.ts`; the classification gate rejects any other folder.

| Class | What it covers |
|---|---|
| `feature` | A new user- or model-facing capability. |
| `bug-fix` | Corrects a defect, or closes a gap a review or postmortem surfaced. |
| `simplification` | Removes code, behavior, or surface area without adding a capability. |
| `architecture` | A structural decision about the **shipped source** — how packages relate, what the runtime vocabulary is. |
| `process` | Tooling, policy, or workflow **around** the code — gates, hooks, the installer — not runtime behavior. |
| `testing` | Test infrastructure and strategy. |

The `architecture` / `process` line is the one that needs judgment: architecture is about the source we ship, process is the surrounding tooling and workflow. `refactor` is deliberately absent — it overlaps `simplification`, whose discriminator, does observable behavior change?, already covers it.

## Archiving and deletion

Archive an implemented note when the shipped decision is complete and its rationale is unlikely to guide future work; the calibrated question is whether any alternative, ownership boundary, negative guarantee, durable-semantics rule, or reintroduction condition here still prevents a plausible mistake — never word count, age, or a quota. Never archive a proposed note: reject it instead. Keep a rejected note only while its rationale prevents a plausible mistake; otherwise delete it entirely.

Archiving moves the complete English/Chinese pair to `archived/{class}/`, keeps `Status: implemented`, inserts `Archived: YYYY-MM-DD` directly below the status line in both files, and repairs or deletes inbound links — the only content changes archiving permits. Links *out of* an archived note are never inspected, verified, or repaired: they were frozen with it, and current gates do not grade history. [`archived/AGENTS.md`](archived/AGENTS.md) is the freeze contract for what happens next. Once sealed, the pair is permanently frozen: [`verify-archived-agent-notes`](../../scripts/verify-archived-agent-notes.ts) hashes every archived file against the append-only manifest (`scripts/archived-notes.manifest.json`), so any later edit, move, or deletion fails the gate. Re-record the manifest only in the same change that adds new archives.

## When to write one

Every **non-trivial change** adds or updates at least one Agent Note in the same PR: changes to behavior, architecture, a contract shared across files or packages, process or tooling, testing strategy, an on-disk/wire/configuration format, or any decision a maintainer may reasonably revisit. Implemented notes sync with code moves, renames, and default changes in the same change. Purely mechanical or local edits are exempt.

## Supersession and consolidation

A note is never edited into a *different* decision: supersede it with a new note and keep both cross-linked. A fully superseded note may be consolidated into the current owning note and deleted only when the owner preserves every unique rationale, alternative, consequence, and named coverage gap, repairs every inbound link, and deletes the Chinese counterpart in the same change. Partial supersession does not qualify: keep both notes cross-linked and update every fact that remains current.

## The file format

The format gate ([`verify-agent-note-format`](../../scripts/verify-agent-note-format.ts), part of `doc-sync`) enforces everything in this section; the classification gate enforces the path.

### The header block

The first three lines are exactly:

```markdown
# Agent Note: <title>

Status: <status>
```

`Status:` is `proposed`, `implemented`, or `rejected — <one-line why>`, and must agree with the lifecycle folder — the gate cross-checks them. An archived note keeps `Status: implemented` with `Archived: YYYY-MM-DD` as its fourth line. The header tokens stay in English verbatim in both languages.

### The body skeleton

The body opens with `## Problem` (motivation only, readable without the solution). The canonical section names per lifecycle are fixed:

```markdown
proposed:     Problem / Proposal / Alternatives considered / Acceptance criteria / Risks
implemented:  Problem / Decision / Alternatives considered / Consequences
rejected:     the proposal frozen as it was, Alternatives considered included
archived:     the implemented skeleton as sealed, plus the Archived: line
```

Proposal-era headings (`## Proposal`, `## Plan`, `## Migration plan`, `## Acceptance criteria`) are rejected under `implemented/` and `archived/`: an implemented note describes what is, in the present tense.

### Alternatives considered is mandatory

Every note carries an `## Alternatives considered` section: each genuine alternative and why it lost. A decision recorded without its opponents invites re-litigation — the failure notes exist to prevent. Notes dated before the format gate took effect (2026-09-20) whose alternatives are not reconstructible carry the exact comment `<!-- agent-note-format: alternatives-not-recorded (pre-format Agent Note) -->` in its place; the format gate accepts that comment only for a note dated before that day, so a note written now records its alternatives for real.

### Moving between lifecycles

Moving a file between lifecycle folders means updating the `Status:` line and re-satisfying that folder's skeleton in the same change — the gate fails the move otherwise. Concretely, `proposed/` → `implemented/` rewrites `## Proposal` into a present-tense `## Decision` and folds `## Acceptance criteria` and `## Risks` into `## Consequences`; `proposed/` → `rejected/` only adds the reason to the `Status:` line.

### Chinese counterparts

A `.zh.md` counterpart mirrors its English sibling's structure section-for-section under the doc pairing gate; the machine-checked header tokens (`# Agent Note: ` and the `Status:` line) stay in English verbatim. The format gate skips `.zh.md` files — the pairing gate checks their consistency.

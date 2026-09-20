# Agent Note: Fix the stale kit-* wording in the Chinese inbox README

Status: implemented

## Problem

The 1.0.0 cut renamed the workflow skills to the repository's own prefix — `kit-inbox-capture`, `kit-inbox-promote`, `kit-learning-note`, `kit-release` became `adlc-inbox-capture`, `adlc-inbox-promote`, `adlc-learning-note`, `adlc-release` — and the changelog records that "paths, skill `name:` fields, the installer's `workflows` component, and every link follow the rename". One line did not follow: the Chinese inbox contract still introduced the skills as "随 kit 安装的技能（kit 创作的技能平铺在 `.agents/skills/` 下）", while the English counterpart line says `adlc-authored skills`. A reader of the Chinese contract was pointed at a prefix that no longer exists and got a different story than the English one. The pair is gated on structure — heading count, fence count, link resolution — never on wording, so the drift was invisible to every gate.

## Decision

The Chinese line names the repository's own prefix: the installed skills are the `adlc-*` skills and they live flat under `.agents/skills/`. The change was wording-only — headings and fenced blocks stayed where they were, so `doc-pairing` kept seeing the same structure while the two files started telling the same story.

Scope stayed at that sentence, not at the word "kit". A grep for `kit-` across the repository returned only this line plus `kit-history` references in `packages/create-adlc-coding/` (the installer's own name for unshipped Agent Note links) and the released 1.0.0 changelog entries that record the rename as history. Those are intentional and stayed. The root `README.md` pair calls this repository a "kit" as a common noun, which the English file does too.

See the spark: [Bug-0001](../../../inbox/2026-09-20-inbox-readme-zh-kit-wording.md).

## Alternatives considered

- **Leave the line as it was.** Lost: the Chinese contract kept naming a prefix no file carries and contradicted its own English counterpart; the fix is one sentence, so deferring buys nothing but the drift itself.
- **Rewrite both languages to a neutral "this repository's own skills" without the prefix.** Lost: `adlc-` is the discoverable name — it is what the skill directories, the installer's `workflows` component, and every link use — and the English line had already settled on it. Dropping the prefix would have made the Chinese line vaguer than the English one instead of equal to it.
- **Replace every `kit` occurrence in the paired corpus.** Lost: "kit" is also this repository's own common noun in the root README pair, and the `kit-history` and changelog occurrences are deliberate history. A blind replace would have corrupted meaning in three files to fix one line.

## Consequences

The two inbox contracts claim the same prefix, and a sweep that greps `kit-inbox-`, `kit-learning-`, or `kit-release` over the paired corpus finds only the released changelog entries that record the rename. Nothing gates the wording, so the pair is held by review and by this note rather than by a gate: the structural gates could not catch this drift and still cannot.

Because the sentence sits inside a pair the gates do read, the change ran `doc-sync` before hand-off — pairing, references, note tree, note format, and archive hashes all stayed green. A wording edit here is louder than the inbox's usual ungated edits: an accidental heading or fence change would have failed `doc-pairing` instead of landing silently.

Fixing this sentence surfaced an unrelated breakage already in `main`: a bulk deletion of Agent Notes had left twelve inbound links dangling in `README.md`, `README.zh.md`, `docs/architecture.md`, `docs/architecture.zh.md`, and two inbox notes. Those were repaired in the same change, separately from this decision.

# Agent Note: Fix the stale kit-* wording in the Chinese inbox README

Status: proposed

## Problem

The 1.0.0 cut renamed the workflow skills to the repository's own prefix — `kit-inbox-capture`, `kit-inbox-promote`, `kit-learning-note`, `kit-release` became `adlc-inbox-capture`, `adlc-inbox-promote`, `adlc-learning-note`, `adlc-release` — and the changelog records that "paths, skill `name:` fields, the installer's `workflows` component, and every link follow the rename". One line did not follow: the Chinese inbox contract still introduces the skills as "随 kit 安装的技能（kit 创作的技能平铺在 `.agents/skills/` 下）", while the English counterpart line says `adlc-authored skills`. A reader of the Chinese contract is pointed at a prefix that no longer exists and gets a different story than the English one. The pair is gated on structure — heading count, fence count, link resolution — never on wording, so the drift was invisible to every gate.

## Proposal

Rewrite that one sentence in `.agents/inbox/README.zh.md` so it names the `adlc-` prefix exactly as the English line does: the installed skills are the repository's own `adlc-*` skills and they live flat under `.agents/skills/`. The change is wording-only — headings and fenced blocks stay where they are, so the pairing gate keeps seeing the same structure.

Scope is that sentence, not the word "kit" in general. A grep for `kit-` across the repository returns only this line plus `kit-history` references in `packages/create-adlc-coding/` (the installer's own name for unshipped Agent Note links) and the released 1.0.0 changelog entries that record the rename as history. Those are intentional and stay. The root `README.md` pair calls this repository a "kit" as a common noun, which the English file does too.

See the spark: [Bug-0001](../../../inbox/2026-09-20-inbox-readme-zh-kit-wording.md).

## Alternatives considered

- **Leave the line as it is.** Lost: the Chinese contract keeps naming a prefix no file carries and contradicts its own English counterpart; the fix is one sentence, so deferring buys nothing but the drift itself.
- **Rewrite both languages to a neutral "this repository's own skills" without the prefix.** Lost: `adlc-` is the discoverable name — it is what the skill directories, the installer's `workflows` component, and every link now use — and the English line has already settled on it. Dropping the prefix would make the Chinese line vaguer than the English one instead of equal to it.
- **Replace every `kit` occurrence in the paired corpus.** Lost: "kit" is also this repository's own common noun in the root README pair, and the `kit-history` and changelog occurrences are deliberate history. A blind replace would corrupt meaning in three files to fix one line.

## Acceptance criteria

- The sentence in `.agents/inbox/README.zh.md` that introduces the installed skills names the `adlc-` prefix and claims exactly what the English line claims.
- `pnpm run doc-sync` passes: the pair keeps structural parity and every relative link still resolves.
- A scoped grep for `kit-inbox-`, `kit-learning-`, and `kit-release` over the paired documentation corpus returns only the released changelog entries that record the rename.

## Risks

- The pair is gated on structure, so an edit that adds or removes a heading or a fenced block fails `doc-pairing` even when the wording is right; keeping the change to one sentence avoids that.
- Editing inside a file the gates do read means a mistake surfaces as a gate failure rather than as silence — the change should run `doc-sync` before hand-off rather than rely on the inbox being ungated.

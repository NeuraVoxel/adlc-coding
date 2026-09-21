# Agent Note: Align Agent Notes governance with deepseek-harness

Status: implemented

## Problem

The Agent Notes system in this kit and the one in `deepseek-harness` (local checkout `~/Documents/AI/coding-agent/back/deepseek-harness`, "dsh") descend from the same idea and had become two separate specifications. Same lifecycle folders, same closed class set, same body skeleton, but the *contract around them* had drifted in ways nothing in this repository recorded: dsh shipped per-lifecycle `AGENTS.md` supplements, a required English/Chinese/sidecar triplet per note, a Manifest-plus-git-blob freeze, and a skill governing archiving; this kit shipped one README pair, `.zh.md` counterparts only, and a content-hash manifest.

Two facts made the drift concrete rather than theoretical. First, the only diff that existed lived in a dsh learning note, `dsh:.agents/learning/2026-09-11-ai-eng-kit-vs-harness-conventions.md` — Chinese-only, filed as a learning note ("非正式权威"), and resident in another repository, so neither side's gates saw it and nothing kept it current. Second, [Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md) asserted that dsh had a `kit-inbox-promote` counterpart to `adlc-inbox-promote`; a repository-wide search for `kit-inbox-promote`, `inbox-promote`, and `adlc-inbox` returns nothing across dsh's Markdown, TypeScript, and JSON. A comparison resting on a nonexistent counterpart misleads every future cherry-pick.

## Differences

Surveyed on 2026-09-21, and decided once: each difference now has exactly one home, so none is left to inference.

| Area | This kit before | dsh | Outcome |
|---|---|---|---|
| Class definitions | Six classes named in one line of the README | A `## Classification` table naming what each class covers, plus the explicit `architecture` vs `process` discriminator and why `refactor` is absent | Migrated |
| Per-lifecycle supplements | None; the README carried every rule | `notes/AGENTS.md` (every new note triggers a supersession check), `implemented/AGENTS.md` (stay current, never rewrite the decision), `archived/AGENTS.md` (the freeze contract, including "never inspect or repair links out of archived notes") | Migrated |
| Root-file allowlist | `agent-note-tree.ts` exempted only the README pair, so a supplement at the notes root failed the gate | The same library already allowed `AGENTS.md` / `CLAUDE.md` at the root | Migrated as the enabling change |
| Note triplets | English + `.zh.md`, checked by `verify-doc-pairing` | English + `.zh.md` + a `.i18n.yaml` sidecar holding each side's git blob hash; mandatory under `archived/` | Divergent on purpose |
| Format-gate grandfather comment | The alternatives escape comment was accepted on a note of any date, so a new note could opt out of the mandate | `FORMAT_ADOPTED` bounds it: accepted only on notes dated before the day the format took effect | Migrated |
| Archive freeze | `verify-archived-agent-notes.ts` + `scripts/archived-notes.manifest.json`, sha256 of file content, counterpart pair required | Same idea plus git blob SHA-1, per-note sidecar consistency record, baseline comparison against `HEAD` (overridable by `DSH_ARCHIVE_BASE_REF`), and a `merge-translation-pairing` merge driver | Deferred |
| No central index | Stated in the README; enforced by accident, because the tree gate whitelisted only the README pair | Stated, banned in the tree library, and owned by a dedicated note | Same conclusion, reason now stated |
| Inbox layer | `.agents/inbox/` plus the `adlc-inbox-*` skills, shipped by the installer's `workflows` component | No inbox tree anywhere; unformed ideas stay in chat or learning notes | Divergent on purpose |
| Archiving skill | None; the five `adlc-*` skills cover capture, promote, view, learning note, release | `dsh-archive-agent-notes` — supersession trigger, lifecycle outcomes, and calibrated word-count examples that say size is not the test | Deferred until the first real archive |
| Skill metadata gate | None | `verify-skill-invocation-metadata.ts`, which matches **zero** skills (no `agents/openai.yaml` exists in dsh) | Skipped |
| Adjacent doc policy | None | Word budgets with a manifest, a slop checklist, `verify-md-wrap`, `verify-md-links`, `verify-doc-refs` | Out of scope of this note |

## Decision

The notes tree now carries its own agent-facing supplements alongside the README pair. `.agents/notes/README.md` gained a `## Classification` section — the table above the exceptions — with one line per class, the `architecture` / `process` discriminator, and why `refactor` does not exist; the one-line class list inside the layout bullet points at it. Three English-only supplements exist and are linked from the README pair in both languages:

- [`AGENTS.md`](../../AGENTS.md) — every new note triggers a supersession check against the active tree, with one of three outcomes written in the same change.
- [`implemented/AGENTS.md`](../../implemented/AGENTS.md) — implemented notes stay current with paths, names, and defaults; updating facts never licenses rewriting the decision.
- [`archived/AGENTS.md`](../../archived/AGENTS.md) — the freeze contract, including the rule that an archival change repairs or deletes inbound links and never touches outbound ones.

The classification gate admits those files: `agent-note-tree.ts` exports `SUPPLEMENT_FILES` and `isSupplementPath`, which accepts `AGENTS.md` and `CLAUDE.md` at the notes root or directly inside one lifecycle and nowhere deeper, so a stray `INDEX.md` still fails. The pairing gate exempts them exactly as it exempts the root `AGENTS.md`, and `verify-archived-agent-notes` skips them so a supplement is not mistaken for an unrecorded sealed note. All three ship with the installer's `rules` component, because the README they are reachable from already does.

Two divergences are stated rather than imported, in the README and here: bilingual records here are an English primary with a `.zh.md` counterpart and no machine artifact beside them, and the inbox layer is a kit-only mechanism with no dsh counterpart. The triplet-and-sidecar freeze and the archiving skill stay deferred until there is one real archived note to calibrate them against. Bug-0002's premise is recorded here as fact, so that spark closes without another survey.

See the spark: [Bug-0003](../../../inbox/2026-09-21-agent-notes-spec-classification-alignment.md) and its sibling [Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md).

## Alternatives considered

- **Copy dsh's notes governance wholesale, including `.i18n.yaml` triplets and the merge driver.** Lost: the pairing contract this repository already enforces and tests is sufficient for a corpus of ten notes, and a sidecar of git blob hashes only earns its cost once the archive holds enough entries that relying on file content alone becomes fragile. Adopting it would also have imported their translation tooling, which this kit deliberately does not vendor.
- **Do nothing; keep pointing at the dsh learning note.** Lost: it is Chinese-only, it sits in another repository that no gate here reads, and it was already stale on the inbox point — the exact failure the spark named.
- **Declare this kit the single authority and let dsh conform on its own schedule.** Lost: we do not own that repository and cannot run its gates, so the claim is unfalsifiable and a future cherry-pick silently reimports whatever drift exists then. Recording our own verdict per difference is what makes the next port cheap in either direction.

## Consequences

The migrated rows above are shipped: the README pair carries the Classification table, the no-index rationale and the archive link rule, the supplements exist and are reachable from both languages, `pnpm run check:all` is green, `scripts/agent-note-tree.spec.ts` rejects `INDEX.md`, `implemented/notes.md`, and a supplement nested below a lifecycle while accepting the three real ones, and `scripts/verify-archived-agent-notes.spec.ts` proves the supplement is skipped rather than reported as unrecorded sealed content. `pnpm run create -- adopt <tmp>` installs all three supplements, so an adopted project gets notes governance it can trust without a second fetch. Bug-0002 closes against this note. `verify-agent-note-format.ts` now exports `FORMAT_ADOPTED = 2026-09-20` — the day the notes tree and its format gate landed — and rejects the alternatives escape comment on any note dated on or after it; `scripts/verify-agent-note-format.spec.ts` proves the rejection at the boundary and that the day before still qualifies, and the README pair states the date.

What it cost: the notes rules now live in four files instead of one, so an agent entering this tree reads the README plus whichever supplement applies — each supplement therefore carries exactly one rule and points back, and any rule that fits the README belongs there. The root invariant weakened from "any stray file fails" to "two named filenames pass", which is why the rejection cases are load-bearing rather than decorative. The supersession check in [`AGENTS.md`](../../AGENTS.md) is a human step no gate proves happened; only review notices when it is skipped. Sealing still proves content on disk rather than equality with a sealed git blob, so a history rewrite stays invisible to `verify-archived-agent-notes` — the accepted cost of deferring the sidecar, to be revisited at the first archive. Finally, this note records verdicts and shape at survey-date granularity, never dsh line-by-line behavior: the drift it cured would otherwise recur the moment their source moves.

# Agent Note: Align Agent Notes governance with deepseek-harness

Status: proposed

## Problem

The Agent Notes system in this kit and the one in `deepseek-harness` (local checkout `~/Documents/AI/coding-agent/back/deepseek-harness`, "dsh") descend from the same idea and are now two separate specifications. Same lifecycle folders, same closed class set, same body skeleton, but the *contract around them* has drifted in ways nothing in this repository records: dsh ships per-lifecycle `AGENTS.md` supplements, a required English/Chinese/sidecar triplet per note, a Manifest-plus-git-blob freeze, and a skill that governs archiving; this kit ships one README pair, `.zh.md` counterparts only, and a content-hash manifest.

Two facts make the drift concrete rather than theoretical. First, the only diff that exists today lives in a dsh learning note, `dsh:.agents/learning/2026-09-11-ai-eng-kit-vs-harness-conventions.md` — Chinese-only, filed as a learning note ("非正式权威"), and resident in another repository, so neither side's gates see it and nothing keeps it current. Second, [Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md) asserts that dsh has a `kit-inbox-promote` counterpart to `adlc-inbox-promote`; a repository-wide search finds no inbox tree, no promote skill, and no mention of either anywhere in dsh. A comparison that rests on a nonexistent counterpart misleads every future cherry-pick.

Without a recorded verdict per difference, each deliberate-looking gap gets re-litigated at every port, and an accidental gap survives forever because nobody knows which side moved.

## Differences

Surveyed on 2026-09-21. "Verdict" is this note's proposal; the ships-stated section it belongs to carries the consequence.

| Area | This kit today | dsh | Verdict |
|---|---|---|---|
| Class definitions | Six classes named in one line of the README | A `## Classification` table naming what each class covers, plus the explicit `architecture` vs `process` discriminator and why `refactor` is absent | Adopt |
| Per-lifecycle supplements | None; the README carries every rule | `notes/AGENTS.md` (every new note triggers a supersession check), `implemented/AGENTS.md` (stay current, never rewrite the decision), `archived/AGENTS.md` (the freeze contract, including "never inspect or repair links out of archived notes") | Adopt |
| Root-file allowlist | `agent-note-tree.ts` exempts only the README pair, so a supplement file at the notes root fails the gate today | Same library already allows `AGENTS.md` / `CLAUDE.md` at the root | Adopt as the enabling change |
| Note triplets | English + `.zh.md`, checked by `verify-doc-pairing` | English + `.zh.md` + a `.i18n.yaml` sidecar holding each side's git blob hash; the triplet is mandatory under `archived/` | Divergent on purpose |
| Archive freeze | `verify-archived-agent-notes.ts` + `scripts/archived-notes.manifest.json`, sha256 of file content, counterpart pair required | Same idea plus git blob SHA-1, per-note sidecar consistency record, baseline comparison against `HEAD` (overridable by `DSH_ARCHIVE_BASE_REF`), and a `merge-translation-pairing` merge driver | Defer (see Risks) |
| No central index | Stated in the README; enforced by accident, because the tree gate whitelists only the README pair | Stated, banned in the tree library, and owned by a dedicated note | No change; restate why |
| Inbox layer | `.agents/inbox/` plus the `adlc-inbox-*` skills, shipped by the installer's `workflows` component | No inbox tree anywhere; unformed ideas stay in chat or learning notes | Divergent on purpose |
| Archiving skill | None; the five `adlc-*` skills cover capture, promote, view, learning note, release | `dsh-archive-agent-notes` — supersession trigger, lifecycle outcomes, and calibrated word-count examples that say size is not the test | Defer until the first real archive |
| Skill metadata gate | None | `verify-skill-invocation-metadata.ts`, which currently matches **zero** skills (no `agents/openai.yaml` exists in dsh) | Skip |
| Adjacent doc policy | None | Word budgets with a manifest, a slop checklist, `verify-md-wrap`, `verify-md-links`, `verify-doc-refs` | Out of scope here |

## Proposal

Record one verdict per row above, ship the rows marked "Adopt", and say explicitly that the rest are intentional — each difference gets a home in this repository, and none is left to inference.

Concretely, in this change: promote the README's one-line class list into a `## Classification` table with the per-class definitions and the `architecture` / `process` discriminator; add the three supplements as real files — `.agents/notes/AGENTS.md`, `.agents/notes/implemented/AGENTS.md`, `.agents/notes/archived/AGENTS.md` — each a pointer-discipline file rather than a second copy of the README, linked from the README pair in both languages; extend the `agent-note-tree.ts` root allowlist to accept `AGENTS.md` (and `CLAUDE.md`, the alias `adopt` already understands) so those files pass the classification gate; and fold the archive clause "repair inbound links only; never verify or repair outbound links from an archived note" into the archiving section of the notes README, alongside a restatement of why no index exists.

Keep two divergences on purpose and say so in the README rather than importing machinery: this repository pairs English-primary docs with a `.zh.md` counterpart and no machine artifact alongside them, and the inbox layer is a kit-only innovation that dsh has no stake in. Defer the triplet-and-sidecar freeze and the archiving skill until there is at least one real archived note to calibrate them against. Bug-0002's premise is recorded here as fact, so it can be resolved without redoing the survey.

See the spark: [Bug-0003](../../../inbox/2026-09-21-agent-notes-spec-classification-alignment.md) and its sibling [Bug-0002](../../../inbox/2026-09-21-agent-note-class-conversion-compare-dsh.md).

## Alternatives considered

- **Copy dsh's notes governance wholesale, including `.i18n.yaml` triplets and the merge driver.** Lost: the pairing contract this repository already enforces and tests is the weaker-but-sufficient one for a corpus of ten notes, and a sidecar of git blob hashes only earns its cost once the archive holds enough entries that relying on file content alone becomes fragile. Adopting it now would also import their translation tooling, which this kit deliberately does not vendor.
- **Do nothing; keep pointing at the dsh learning note.** Lost: it is Chinese-only, it sits in another repository that no gate here reads, and it is already stale on the inbox point — the exact failure this spark names.
- **Declare this kit the single authority and let dsh conform on its own schedule.** Lost: we do not own that repository and cannot run its gates, so the claim is unfalsifiable and a future cherry-pick silently reimports whatever drift exists then. Recording our own verdict per difference is what makes the next port cheap in either direction.

## Acceptance criteria

- Every row of the table above carries one of three verdicts — adopted in this change, divergent on purpose with the reason stated in the notes README pair, deferred with the trigger that would reopen it — and no row is left without one.
- `.agents/notes/README.md` and `README.zh.md` carry the `## Classification` table, the no-index rationale, and the archive link rule, updated in the same change.
- The three supplements exist, are reachable from the README pair in both languages, and pass `agent-note-tree` after its root allowlist accepts `AGENTS.md` / `CLAUDE.md`; `scripts/agent-note-tree.spec.ts` gains one case proving a stray non-allowlisted file at the notes root is still rejected.
- `pnpm run doc-sync` and the narrow `vitest run scripts/agent-note-tree.spec.ts scripts/verify-agent-note-format.spec.ts scripts/verify-doc-pairing.spec.ts` lane are green, per [docs/testing.md](../../../../docs/testing.md) for gate changes.
- Bug-0002 can be closed against this note without another survey: its asserted dsh `kit-inbox-promote` counterpart does not exist, which makes that spark's comparison moot.

## Risks

- **Second homes for someone else's gate behavior.** Describing dsh's scripts here invites the same drift it cures the moment their source changes. The table therefore states verdicts and shape at survey-date granularity, never line-by-line behavior; anything needing current detail stays a pointer to that repository.
- **Supplements fragment the one-file contract.** Today an agent reads one README to learn the notes rules; after this change it reads up to four files, and exactly this kind of split is what the "every fact has one home" rule guards against. The supplements must point back rather than restate, and each must own a rule the README cannot carry — otherwise this becomes duplication with a nicer directory structure.
- **A weakened root invariant.** Allowlisting `AGENTS.md` at the notes root trades a prohibition that currently rejects *any* stray root file for one that admits two named names. The rejection case in the spec is what stops the allowlist from growing file by file once it is open.
- **An unenforceable step.** The supersession check on every new note is a human step no gate can prove happened; it becomes another line in `AGENTS.md` that agents may skip, and only review notices.
- **Content-only sealing.** Keeping the sha256-of-content manifest means the freeze proves what is on disk now, not that it matches the sealed git blob, so a history rewrite is invisible to this gate. That is the cost accepted with the deferred triplet; it should be revisited at the first archive rather than forgotten.

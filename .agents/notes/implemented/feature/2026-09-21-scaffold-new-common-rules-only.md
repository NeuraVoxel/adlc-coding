# Agent Note: Scaffold `create -- new` with shared rule resources only

Status: implemented

## Problem

`pnpm run create -- new <dir>` copied this checkout wholesale: `runNew` copied the kit root recursively and excluded only `.git`, `node_modules`, `dist`, `coverage`, `pnpm-lock.yaml`, and the installer package itself. Everything else shipped, including records that belong to this repository and to nothing else: the Agent Notes under `.agents/notes/implemented/`, the dated sparks under `.agents/inbox/` together with the `QUEUE.md` rows that tag them, the retrospectives under `.agents/learning/`, and a `ChangeLog.md` carrying this kit's release history.

The new directory is another project's root, not a fork of this kit. Those files arrive as that project's own decision record, queue, and changelog. `AGENTS.md` tells every agent to read these trees, so the kit's history lands in another project's agent context from the first message; and every fact in it now has two homes, with the copy never updated and drifting the moment this kit moves on. That is the "every fact has one home" rule failing downstream, in the directory the scaffold just created.

Nothing was broken as such — the installer's own README stated the behavior and why it was tolerated: the scaffold copied the whole checkout including the notes and was green as delivered. The defect was what a new project inherited, not how the copy ran.

## Decision

`new` writes a component copy, not a checkout copy. The file set is `scaffoldFileSet()` — the union of `COMPONENTS`, which is what `adopt` installs, and `SCAFFOLD_ONLY_FILES`, the root files a fresh project needs and no component carries: `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `scripts/AGENTS.md`, `scripts/CLAUDE.md`, `tsconfig.base.json`, `tsconfig.tools.json`, `vitest.config.ts`. One source serves both modes: what `adopt` can install is what `new` ships.

Within those trees the copy carries contracts, not this kit's content:

- `.agents/notes/` ships its README pair and the lifecycle supplements `rules` already carries (`AGENTS.md`, `implemented/AGENTS.md`, `archived/AGENTS.md`), and no note at all: no `{lifecycle}/{class}/yyyy-mm-dd-topic.md` path reaches a new project, so `proposed/`, `rejected/`, and the class directories do not exist there.
- `.agents/inbox/` ships its README pair and an empty `QUEUE.md` board, and no spark.
- `.agents/learning/` ships its README pair and `.gitignore`, and no retrospective.
- `ChangeLog.md` ships cut at its `## Unreleased` heading, without the release history *or* the unreleased entries — a new project's changelog recording our changes is the same leak in a smaller font.
- `package.json` ships without the kit's `create` script, which would invoke an installer a scaffold does not carry.
- `packages/` does not exist in a new project, so `scripts/`, which does ship, keeps its supplement and `packages/AGENTS.md` does not travel: its only subject is this installer.

The set is the single authority, and nothing shadow-writes it. The proposal grew the old exclusion set; what shipped deleted it instead, because a copy that starts from "everything minus a list" needs a second list — the same length, kept in step by hand — to say what the first one missed. `isCarried()` answers "does a shipped path exist here" for the link unwrapping that used to consult the excludes, and the segment/path constants went away with the only code that read them. Completeness moved to where a machine can check it: `findUnlistedRootFiles` is run in `packages/create-adlc-coding/tests/lib.spec.ts` against this repository's tracked root files, so a root file added later fails the spec instead of quietly vanishing from every scaffold, and `NOT_CARRIED_ROOT_PATHS` records the four a scaffold skips on purpose — the kit's README pair, its licence, the lockfile, and `CLAUDE.md`.

Two details the proposal did not name, both forced by the scaffold smoke rather than by review. Link unwrapping now stops at `.md`: run over every text surface it rewrote the markdown-shaped string literals in `scripts/verify-doc-references.spec.ts` — a gate spec's own link fixtures — and the copy failed the suite it had just shipped. And `CLAUDE.md` is recreated as a relative alias beside every shipped `AGENTS.md`, not only at the root, because a copied subtree produced `scripts/CLAUDE.md` as an absolute symlink pointing back into the author's checkout.

The installer README, the root README pair, [docs/testing.md](../../../../docs/testing.md), and `packages/AGENTS.md` state the new behavior; the smoke that file requires — scaffold into a temp directory and run the gates there — is what proves it.

See the spark: [Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md).

## Alternatives considered

- **Keep the whole-checkout copy and add a cleanup step to the next-steps message.** Lost: the kit's records are on disk and linked from `AGENTS.md` before anyone can delete them, and "delete these directories after scaffolding" is the manual step a scaffold exists to remove. The unshipped-referent pruning also never runs, so nothing tells the adopter which links to clean.
- **Ship the kit's records under an explicitly labeled directory, `docs/kit-history/`, so the rationale stays readable downstream.** Lost: it keeps two homes for the same fact, which is the drift this change removes, and a downstream reader reaching for its own decision record still finds ours first.
- **Add a mode flag, `--full` or `--with-history`, and keep today's copy as one of the options.** Lost: the default still ships the wrong thing to everyone who does not read the flag list, and both modes then need their own file-set test and their own documented shape.
- **Do nothing and let each new project prune.** Lost: the cost the spark names — context pollution and duplicated facts — is paid by every scaffold, not only by the projects that notice it.

## Consequences

A scaffold is a rule set and nothing else. `pnpm run create -- new <dir> --name my-app` produces a tree whose every file is in `scaffoldFileSet()`, with no note path, no spark, no retrospective, and a `ChangeLog.md` whose only heading is `## Unreleased`; `adopt` is untouched, installing the same components it did before, and this repository keeps its own notes, sparks, learning, and changelog history. The acceptance criterion that named the lifecycle directories needed one reading settled in the copy: `rules` carries `implemented/AGENTS.md` and `archived/AGENTS.md`, so "no path under `.agents/notes/{proposed,implemented,rejected,archived}/`" means no *note* — the lifecycle supplements ship, and the class directories do not exist.

What the criteria asked for holds, and the smoke is the evidence for all of it: scaffolded into a temp directory, installed, and `pnpm run check:all` passed there — lint, typecheck, 56 tests, and all five `doc-sync` gates — with no manual pruning. Every Markdown link in every shipped document resolves to a path the scaffold writes, because a link into the unshipped record is unwrapped as the file is copied. `packages/create-adlc-coding/tests/lib.spec.ts` pins the set, names only paths this checkout holds, carries the acceptance case that the kit-private trees are out and the rejection case that a root file missing from the set is reported, and checks that every root path this repository tracks is carried or declared uncarried.

Three consequences are worth carrying forward. `new` now ships no `README.md` and no `LICENSE`: the closed list has no entry for either, a new project writes its own, and copying this kit's licence into another project is a licensing decision rather than a copy. A scaffold inherits `tsconfig.tools.json` and `vitest.config.ts` verbatim, so both keep naming `packages/create-adlc-coding` — inert in both tools, since the other inputs match, but a path the adopter's tree does not have; and `package.json` keeps version `1.0.0`, this kit's current cut, which the adopter should treat as their starting point. All three are one-line decisions the note did not make, left visible rather than settled by accident.

The risks the proposal named landed as predicted and are now bounded rather than gone. A file nobody lists still disappears, but the spec fails first for root files, which is where the risk was concentrated; the pruning stays lossy by design, so a downstream reader sees the claim without the rationale; `adopt` still does not read `SCAFFOLD_ONLY_FILES`, so a scaffold-only file forgotten there is never missed by adoption; and the shipped board is empty, so only a first capture proves it works — the kit can no longer exercise a populated board through `new`.

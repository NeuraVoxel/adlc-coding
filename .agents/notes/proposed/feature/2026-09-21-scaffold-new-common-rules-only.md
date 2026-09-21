# Agent Note: Scaffold `create -- new` with shared rule resources only

Status: proposed

## Problem

`pnpm run create -- new <dir>` copies this checkout wholesale: `runNew` copies the kit root recursively and excludes only what `isExcluded` rejects — `.git`, `node_modules`, `dist`, `coverage`, `pnpm-lock.yaml`, and the installer package itself. Everything else ships, including records that belong to this repository and to nothing else: the Agent Notes under `.agents/notes/implemented/`, the dated sparks under `.agents/inbox/` together with the `QUEUE.md` rows that tag them, the retrospectives under `.agents/learning/`, and a `ChangeLog.md` carrying this kit's release history.

The new directory is another project's root, not a fork of this kit. Those files arrive as that project's own decision record, queue, and changelog. `AGENTS.md` tells every agent to read these trees, so the kit's history lands in another project's agent context from the first message; and every fact in it now has two homes, with the copy never updated and drifting the moment this kit moves on. That is the "every fact has one home" rule failing downstream, in the directory the scaffold just created.

Nothing here is broken today — the installer's own README states the behavior and why it is tolerated, namely that a scaffold copies the whole checkout including the notes and is green as delivered. The defect is what a new project inherits, not how the copy runs.

## Proposal

`new` stops being a whole-checkout copy and becomes a component copy: the file set becomes the union of `COMPONENTS` — the same five components `adopt` installs — plus an explicit scaffold-only list for the root files a fresh project needs and no component carries, namely `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `tsconfig.tools.json`, `vitest.config.ts`, `.gitignore`, and the per-subtree `AGENTS.md` and `CLAUDE.md` supplements. One source serves both modes: what `adopt` can install is what `new` ships.

Within those trees the copy carries contracts, not this kit's content:

- `.agents/notes/` ships its README pair, which the `rules` component already carries, and no lifecycle subtree — no `proposed/`, `implemented/`, `rejected/`, or `archived/`.
- `.agents/inbox/` ships its README pair plus an empty `QUEUE.md` board, the file `workflows` already carries, with no spark files and no rows.
- `.agents/learning/` ships its README pair and `.gitignore`, and no retrospectives.
- `ChangeLog.md` ships with the `## Unreleased` heading and no released section.

The kit-private paths join the exclusion set the copy already honors, which is what keeps the shipped docs self-consistent: `pruneExcludedReferences` already unwraps Markdown links whose target the copy omits, so the decision links in `AGENTS.md`, the READMEs, and `docs/*.md` drop their reference and keep their text, exactly as the installer-package links do today. `applyRenames`, the `CLAUDE.md` alias, the `.codebuddy/skills` alias, and `git init` keep running on the smaller tree.

The installer README's claim that a scaffold copies the whole checkout including the notes is rewritten in the same change; the kit-history pruning line that depends on it is rewritten with it, in both languages.

See the spark: [Feat-0004](../../../inbox/2026-09-21-scaffold-new-common-rules-only.md).

## Alternatives considered

- **Keep the whole-checkout copy and add a cleanup step to the next-steps message.** Lost: the kit's records are on disk and linked from `AGENTS.md` before anyone can delete them, and "delete these directories after scaffolding" is the manual step a scaffold exists to remove. The unshipped-referent pruning also never runs, so nothing tells the adopter which links to clean.
- **Ship the kit's records under an explicitly labeled directory, `docs/kit-history/`, so the rationale stays readable downstream.** Lost: it keeps two homes for the same fact, which is the drift this change removes, and a downstream reader reaching for its own decision record still finds ours first.
- **Add a mode flag, `--full` or `--with-history`, and keep today's copy as one of the options.** Lost: the default still ships the wrong thing to everyone who does not read the flag list, and both modes then need their own file-set test and their own documented shape.
- **Do nothing and let each new project prune.** Lost: the cost the spark names — context pollution and duplicated facts — is paid by every scaffold, not only by the projects that notice it.

## Acceptance criteria

- `pnpm run create -- new <dir> --name my-app` produces a tree in which every file belongs to the union of `COMPONENTS` or to the explicit scaffold-only list, and which contains no path under `.agents/notes/{proposed,implemented,rejected,archived}/`, no dated spark file under `.agents/inbox/`, no retrospective under `.agents/learning/`, and a `ChangeLog.md` whose only heading is `## Unreleased`.
- The scaffolded tree passes `pnpm run check:all` as delivered with no manual pruning: no Markdown link in a shipped file resolves to a path the scaffold omitted, so `doc-sync` is green in the new project the way the installer README promises today.
- `tests/lib.spec.ts` pins the `new` file set through the pure planning helpers, with one acceptance case showing the private trees excluded and one rejection case for a path that must ship but is missing from the set.
- `adopt` is unchanged: the same components install the same files, and this repository keeps its own notes, sparks, and changelog history.
- The behaviors both modes share still run after the copy — identity renames, the `CLAUDE.md` alias, the `.codebuddy/skills` alias, `git init` — and the scaffold smoke in a temp directory still passes the gates, as [docs/testing.md](../../../../docs/testing.md) requires for installer changes.

## Risks

- **A file nobody listed disappears.** Today the checkout is the template, so a new root file ships automatically; deriving the set from `COMPONENTS` means anything outside the components and the scaffold-only list silently stops shipping, and a missing `tsconfig` or `vitest.config.ts` breaks the gates in the new project rather than failing here. The temp-directory smoke is what catches it, and the scaffold-only list has to be revisited whenever a root file is added.
- **Pruning is lossy by design.** The decision links in the shipped `AGENTS.md` and docs lose their targets, so a downstream reader sees the claim without the rationale, and the rationale stays here and nowhere else. That is the trade the installer already makes for its own package links; `doc-references` staying green is what proves the unwrap actually happened rather than a link silently dangling.
- **One file set, two modes, opposite directions.** `adopt` refuses to overwrite and installs a subset; `new` writes everything. A component that later grows a path meaningful only for adoption is inherited by every scaffold, and a scaffold-only file that is forgotten is never missed by `adopt`, because `adopt` never reads that list.
- **The board ships empty while its README describes sparks.** A new project's `QUEUE.md` has no rows and therefore no `## Feat` or `## Bug` group; the README pair it ships explains how a capture fills them, which is right, but the first capture becomes the only thing that proves the shipped board works. The kit can no longer rely on `new` to exercise a populated board.

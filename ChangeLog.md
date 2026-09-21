# Changelog

Notable changes to this repository are listed here by released semver. The version authority is root `package.json`; each released cut also carries an annotated git tag `v<version>`. Development accumulates under `## Unreleased`; a cut renames that heading (see [docs/release.md](docs/release.md)).

## Unreleased

### Added

- Inbox sparks carry a stable task ID: `Feat-0001` / `Bug-0001`, a per-type four-digit sequence derived as the highest number in use plus one, written on an `ID:` line in the spark and as the `QUEUE.md` row tag (replacing the type tag, since the prefix carries the type). `adlc-inbox-promote` takes an ID as its target (case-insensitive prefix, numeric digits, so `feat-1` resolves), and `adlc-inbox-view` gains an `ID` column. IDs never change and are never reused.

### Changed

- `adlc-inbox-promote` ends its run with one question instead of a stop: after reporting the spark, note, and queue line, it asks whether the proposal is accepted and implementation should start, naming what implementing would touch, and waits — silence, a deferral, or a no ends the run, a yes starts implementation in the same session, and `git commit` / `git push` still need their own explicit request. The hard stop "do not implement the proposal" becomes "do not implement the proposal unless this run's question was answered yes".

- `QUEUE.md` groups its rows by kind: `## Feat` above `## Bug`, each under its own heading beneath `# Inbox queue`, oldest capture first inside a group and empty groups omitted. Row shape is unchanged, so a departed row still carries `[x]` and its Agent Note link; the board is no longer one chronological list, and the inbox README pair now says that arrival order is per-group. `adlc-inbox-capture` appends to the group matching the type and `adlc-inbox-promote` flips a row in place.

- `QUEUE.md` reads each group in arrival order: the row captured first sits at the top of its group and each later capture joins the bottom, so the longest-waiting open row is the first `[ ]` line a sweep sees. `adlc-inbox-capture` appends a new row as the last row of its group instead of putting it first, and the inbox README pair states the order in both languages. `adlc-inbox-view` still renders newest-first, so the board and the view now run in opposite directions.

### Fixed

- The Chinese inbox README introduces the installed skills with the repository's own `adlc-` prefix, matching its English counterpart's `adlc-authored skills`; the 1.0.0 `kit-*` → `adlc-*` rename had left that one line behind. Generic uses of "kit" as this repository's common noun are untouched.
- Twelve inbound links to Agent Notes that no longer exist are repaired: `README.md` and `README.zh.md` no longer point at the removed roadmap note, `docs/architecture.md` and its counterpart point the installer design at `packages/create-adlc-coding/`, and the two `2026-09-20` inbox notes point the type axis at the inbox README pair, which is where the type axis is documented now.

## [1.0.0] — 2026-09-20

### Added

- `adlc-inbox-view` skill (`.agents/skills/adlc-inbox-view/SKILL.md`, shipped in the installer's `workflows` component): read-only, it renders every inbox spark as a Markdown table grouped by `Type` (`feature` / `bug`), newest first, with a `Status` column.
- Inbox sparks carry a `Type` axis (`feature` / `bug`) below `Status`, and `QUEUE.md` rows carry it as a tag; promotion derives the Agent Note class from it (`feature` → `feature/`, `bug` → `bug-fix/`). The type stays a documented convention — the inbox is still outside every format gate.

### Changed

- The workflow skills are renamed to the repository's own prefix: `kit-inbox-capture`, `kit-inbox-promote`, `kit-learning-note`, and `kit-release` become `adlc-inbox-capture`, `adlc-inbox-promote`, `adlc-learning-note`, and `adlc-release`. Paths, skill `name:` fields, the installer's `workflows` component, and every link follow the rename.

### Removed

- The application faces: `server/` (Fastify), `apps/web/` (React + Vite), and the `packages/contracts/` seam. The kit now ships the AI work-paradigm and workflow rule system only — no application code and no cross-language contract package; a stack adopts the rules with `adopt` and keeps its own root, typecheck program, and lanes.
- `dev:server`, `dev:web`, and `build` scripts, the `web` vitest lane with its `jsdom` / Testing Library / `vite-tsconfig-paths` dependencies, the React oxlint plugins, and the `paths` mapping in `tsconfig.base.json`.
- The installer's `--scope` identity: no scoped packages remain, so `new` renames the project name only.

### Fixed

- `.agents/inbox/QUEUE.md` is the `# Inbox queue` heading and its rows only: the shipped "Empty." paragraph is gone, so a capture's insert under the heading no longer sits under prose claiming the board is empty. An empty queue is a board with no `[ ]` row, and the inbox README pair is the board's only authority.

## [0.3.0] — 2026-09-15

### Added

- Reference-integrity gate (`verify-doc-references`) in `doc-sync`: every repository-relative Markdown link in the paired documentation corpus must resolve to a path that exists and stay inside the repository. External URLs, protocol-relative targets, anchors, and paths written inside code spans or fenced blocks are not checked, and the report counts references checked rather than corpus files.
- Component dependency for the shipped instruction layer: `adopt` refuses an incomplete `--only` selection before writing any file and names the component that carries the missing referent, because `AGENTS.md` links the docs, the workflow contracts, and the CI workflow.

### Fixed

- `docs/architecture.md` and its Chinese counterpart list every gate `doc-sync` runs, and the notes README pair's gate links resolve instead of pointing one directory above the repository root.
- Scaffolding preserves Markdown link targets: identity renames no longer rewrite link paths, so links to files whose names do not change keep working, and links to the excluded installer package are unwrapped to their link text.

## [0.2.0] — 2026-09-15

### Added

- Full Agent Notes gate coverage from the deepseek-harness comparison: the classification gate (`agent-note-tree.ts`, closed lifecycle/class sets including `archived/`), the format gate (`verify-agent-note-format.ts`, header block, per-lifecycle skeletons, alternatives mandate with the pre-format escape), and the frozen-archive gate (`verify-archived-agent-notes.ts`, append-only hash manifest). All join `doc-sync`; supersession, consolidation, archiving, and lifecycle-move rules are now written in the notes README.
- Per-subtree AGENTS.md supplements (`server/`, `apps/web/`, `packages/`, `scripts/`) with `CLAUDE.md` aliases: module-specific obligations (contract-first responses, bundle purity, seam ownership, gate-infrastructure rules) live beside the code they govern; scaffolds ship them, adopt mode does not.
- The explicit-approval standing order, migrated from ai-eng-kit: finishing a change ends with evidence and a report; `git commit` and `git push` run only on the user's explicit request, making the release cut a special case of the general rule.

## [0.1.0] — 2026-09-15

### Added

- Kit skeleton: React + Vite web face, Fastify server face, contracts seam package, the language-agnostic `run-gates` aggregate runner, lefthook hooks, the AGENTS.md instruction layer, the Agent Notes decision system, and the CI workflow.
- English-primary paired docs (`README`, `docs/*`, notes) with the `verify-doc-pairing` gate in the `doc-sync` aggregate; `AGENTS.md` stays English-only by exemption.
- `create-adlc-coding` installer: `new` scaffolds a fresh project from the live checkout (identity renames, git init, `CLAUDE.md` alias); `adopt` installs rule components into an existing project, refusing overwrites without `--force`.
- Workflows migrated from ai-eng-kit: the inbox spark queue and learning-notes contracts, the `kit-*` skill family (`kit-inbox-capture`, `kit-inbox-promote`, `kit-learning-note`, `kit-release`), and this changelog with the release contract (`docs/release.md`).

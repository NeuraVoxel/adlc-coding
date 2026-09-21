# create-adlc-coding

Zero-dependency installer for the adlc-coding rule set. The checkout is the template: files copy live from this repository, so a new project always receives exactly the rules the gates just verified — there is no template snapshot to drift.

## Usage (from a kit checkout)

```sh
# Scaffold a fresh project: component copy, identities renamed, hooks wired
pnpm run create -- new ../my-app --name my-app

# Adopt only the verified rules into an existing project
pnpm run create -- adopt ../existing-app --only rules,gates,docs,workflows,ci
```

## Components

| Component | Files |
|---|---|
| `rules` | `AGENTS.md`, `.agents/notes/README*.md` |
| `gates` | `lefthook.yml`, `.oxlintrc.json`, `scripts/run-gates.*`, `scripts/verify-doc-pairing.*`, `scripts/agent-note-tree.*`, `scripts/verify-agent-note-format.*`, `scripts/verify-archived-agent-notes.*`, `scripts/verify-doc-references.*`, `scripts/archived-notes.manifest.json` |
| `docs` | `docs/architecture*.md`, `docs/testing*.md` |
| `workflows` | inbox, learning, and research contracts, the `adlc-*` skills, `ChangeLog.md`, `docs/release*` |
| `ci` | `.github/workflows/ci.yml` |

`new` writes one more set, which is not a component: `SCAFFOLD_ONLY_FILES` in `lib.ts` — `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `scripts/AGENTS.md`, `scripts/CLAUDE.md`, `tsconfig.base.json`, `tsconfig.tools.json`, `vitest.config.ts`. `findUnlistedRootFiles` is checked against this repository's tracked root files in `lib.spec.ts`, so a root file added later has to be carried by a component or listed there, and `NOT_CARRIED_ROOT_PATHS` records the ones a scaffold skips on purpose: the kit's README pair and licence, the lockfile, and the `CLAUDE.md` alias, which is created rather than copied.

`new` writes a component copy, not a checkout copy: the union of `COMPONENTS` and `SCAFFOLD_ONLY_FILES`, and nothing else. This repository's own record — its Agent Notes, sparks, learning notes, released changelog sections — never reaches another project's root. Links a shipped document carries into that record are unwrapped to their link text, which happens in `.md` files only: a reference is a Markdown construct, and rewriting one inside a gate spec's link fixtures would ship a suite that fails its own tests. Two files ship rewritten rather than verbatim — `ChangeLog.md` is rebuilt as the contract's header above one empty `## Unreleased` heading, and `package.json` loses the kit's `create` script, which invokes an installer a scaffold does not carry. The copy is then renamed: `adlc-coding` becomes `--name` across text surfaces, `CLAUDE.md` is recreated as a relative alias beside every shipped `AGENTS.md`, `.codebuddy/skills` is aliased to `.agents/skills`, and the git repository the postinstall hook requires is initialized.

`adopt` never overwrites an existing file without `--force`; it merges the missing runner scripts into the target `package.json` only when the `gates` component is installed, and prints the dev-dependency and script prerequisites the gate graph assumes. It recreates the same aliases afterwards: `CLAUDE.md` always, and `.claude/skills` and `.codebuddy/skills` when the target has `.agents/skills` (an existing non-symlink alias is left untouched). `.claude/skills` serves Claude Code and zcode; `.codebuddy/skills` serves CodeBuddy Code.

`AGENTS.md` is the file an agent is told to follow, so its referents must land with it: it links the docs, the workflow contracts, and the CI workflow. A `--only` selection that includes `rules` therefore has to include `docs`, `workflows`, and `ci`; an incomplete selection is rejected before any file is written, naming the component that carries the missing referent. `gates` stands alone — nothing in the instruction layer links into `scripts/`.

Adopters still prune the kit-history lines (the links to individual Agent Notes) that no component ships: `adopt` copies files without rewriting them, so `doc-references` reports those links until the pruning happens, which keeps an unshipped referent visible rather than silent. `new` unwraps the same links as it copies, so a scaffold is green as delivered with no pruning at all.

npm distribution (bundling the checkout at publish time so `pnpm create adlc-coding` works without a checkout) is deferred.

# AGENTS.md — packages

Package-specific rules supplementing the root [AGENTS.md](../AGENTS.md); each section owns one package and is not restated in sibling sections.

## create-adlc-coding — the installer

- **Zero dependencies, split brains.** Planning logic lives in `lib.ts` as pure functions with specs; `bin.ts` owns all I/O and process boundaries.
- **The checkout is the template, and a scaffold is a component copy.** Files copy live from this repository — never snapshot, never vendor a second copy of a rule file — but only the paths in `scaffoldFileSet()` reach another project's root. This repository's own notes, sparks, learning, and changelog history stay here, and `findUnlistedRootFiles` makes the next added root file fail the spec rather than disappear from the scaffold.
- **A component change is four edits**: `COMPONENTS` in `lib.ts`, the installer README table, the usage examples (root README pair and installer README), and the `lib.spec.ts` expectations. A path that ships to `new` but belongs to no component is a `SCAFFOLD_ONLY_FILES` edit, pinned by the same spec. Missing one is how the `workflow`/`workflows` drift started.
- **Fail loud at the boundaries.** Unknown component name, non-empty `new` target, existing files without `--force`, a flag without its value — each rejects before any write.
- **Aliases land relative, at every level they ship at.** `CLAUDE.md` for Claude Code, `.claude/skills` for Claude Code and zcode, `.codebuddy/skills` for CodeBuddy Code: each must be recreated as a relative link, never the materialized absolute path that `fs.cp` produces for a copied symlink — that one resolves on the author's machine and nowhere else. Unwrapping Markdown references stops at `.md` for the same reason: over a `.ts` or `.json` surface it rewrites a string literal, and a gate spec's own link fixtures are string literals.

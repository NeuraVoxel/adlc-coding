# AGENTS.md — packages

Package-specific rules supplementing the root [AGENTS.md](../AGENTS.md); each section owns one package and is not restated in sibling sections.

## create-adlc-coding — the installer

- **Zero dependencies, split brains.** Planning logic lives in `lib.ts` as pure functions with specs; `bin.ts` owns all I/O and process boundaries.
- **The checkout is the template.** Components copy live from this repository — never snapshot, never vendor a second copy of a rule file.
- **A component change is four edits**: `COMPONENTS` in `lib.ts`, the installer README table, the usage examples (root README pair and installer README), and the `lib.spec.ts` expectations. Missing one is how the `workflow`/`workflows` drift started.
- **Fail loud at the boundaries.** Unknown component name, non-empty `new` target, existing files without `--force`, a flag without its value — each rejects before any write.
- **Copy hygiene.** Excludes stay minimal and explicit; the tool aliases — `CLAUDE.md` for Claude Code and `.codebuddy/skills` for CodeBuddy Code — must land as relative links, never the materialized absolute paths that `fs.cp` produces for copied symlinks.

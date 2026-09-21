# Agent Note: Make adlc-coding discoverable under the zcode agent dev tool

Status: implemented

## Problem

adlc-coding's rules and workflow skills were only wired for the harnesses we had
adapted: CodeBuddy Code discovers project skills under `.codebuddy/skills` (a
symlink to `.agents/skills`), and Claude Code read `CLAUDE.md` only — its skill
directory was never aliased. A teammate doing agent development in the zcode agent
dev tool got neither the skills in `.agents/skills/` nor a working entry
convention. The spark that captured this is
[Feat-0008](../../../inbox/2026-09-21-zcode-agent-compat.md).

## Decision

Add a `.claude/skills` alias to `.agents/skills`, and reuse it as the zcode path
instead of inventing a zcode-specific directory.

Investigation of zcode's shipped bundle confirmed it reads skills from the
mainstream harness directories — its skill-source map is
`[{agent:"claudeCode", projectPath:[".claude","skills"]}, {agent:"codexCli",
projectPath:[".codex","skills"]}, …, {agent:"codebuddy", projectPath:[".codebuddy","skills"]}]`.
So `.claude/skills` is read by zcode *and* is Claude Code's native project-skill
path: one alias serves both, and it closes the pre-existing Claude Code skills gap.
Concretely:

- `packages/create-adlc-coding/bin.ts` replaced the CodeBuddy-only
  `ensureCodebuddySkillsAlias` with a parameterized `ensureSkillsAlias(dir,
  harnessDir, harnessName)` — one implementation, two call sites. It recreates
  `<harnessDir>/skills` as a relative `../.agents/skills` symlink (or a copy
  fallback where symlinks are unavailable), only when `.agents/skills` exists, and
  leaves a pre-existing non-symlink alone.
- Both `runScaffold` and `runAdopt` call it for `.claude` (Claude Code) and
  `.codebuddy` (CodeBuddy Code).
- The kit repo itself carries `.claude/skills` (committed, like
  `.codebuddy/skills`), so the kit is discoverable by Claude Code, CodeBuddy Code,
  and zcode out of the box.
- `AGENTS.md` (English-only) and `README.md` (+ `README.zh.md`) document the
  `.claude/skills` and `.codebuddy/skills` aliases.

Scope stayed at skills-loading compatibility; no rules port.

## Alternatives considered

- **A `.zcode/skills` alias (the first attempt).** Rejected after the bundle
  inspection: zcode already reads `.claude/skills` and `.codebuddy/skills`, so a
  `.zcode` directory adds a third alias that serves only zcode and no harness that
  `.claude/skills` does not already cover. `.claude/skills` is strictly broader —
  it also fixes Claude Code, which had no skill alias before.
- **Full rules port to zcode (AGENTS.md rewrite for zcode).** Rejected: the spark
  asked only for skill reading/use compatibility, and a full port risks building
  against zcode's rule-loading semantics before they are needed.
- **Copy skills into each harness directory instead of aliasing.** Rejected: it
  duplicates the source of truth, drifts the moment a skill is edited, and breaks
  the "author under `.agents/skills/`" invariant the kit already enforces.

## Consequences

- Claude Code, CodeBuddy Code, and zcode now discover the kit's workflow skills —
  in the kit repo and in any project scaffolded or adopted with this installer —
  from the single `.agents/skills/` source via relative aliases.
- The installer's alias logic collapsed from one function per harness into one
  parameterized helper; adding a future harness is a new call, not new code.
- zcode's coverage rides on `.claude/skills` / `.codebuddy/skills` being in its
  skill-source map, verified against the shipped bundle. If a future zcode drops
  those entries, the README table is the only signal — revisit then.

# adlc-coding

English | [中文](README.zh.md)

An AI work-paradigm and workflow kit: the paradigms and the `kit-*` workflow skills, plus a verified engineering-rule system (layered AGENTS.md instructions, a `run-gates` aggregate, lefthook hooks, Agent Notes decision records). It is language-agnostic and ships no application code — any stack adopts the rule set with `adopt` and keeps its own root.

## Quick start

```sh
pnpm install
pnpm run check:ci     # lint + typecheck + test gate aggregate
```

## Using this kit in a new project

The checkout is the template. From a clone of this repository:

```sh
# Scaffold a fresh project: full copy, identities renamed, hooks wired
pnpm run create -- new ../my-app --name my-app

# Adopt only the verified rules into an existing project
pnpm run create -- adopt ../existing-app --only rules,gates,docs,workflows,ci
```

`new` copies everything except `.git`, `node_modules`, build output, and the lockfile, renames `adlc-coding` to `--name`, and recreates the `CLAUDE.md` alias. `adopt` never overwrites without `--force`, merges the missing runner scripts into `package.json`, and prints the prerequisites the gates assume. Details: [installer README](packages/create-adlc-coding/README.md).

## Layout

| Directory | Responsibility |
|---|---|
| `packages/create-adlc-coding/` | The installer: scaffold or adopt the rule set |
| `scripts/` | Gate orchestrator and verify scripts |
| `docs/` | Architecture map, testing strategy, release contract |
| `.agents/notes/` | Decision records (Agent Notes) |
| `.agents/inbox/`, `.agents/learning/` | Spark queue (`QUEUE.md` board) and session retrospectives |
| `.agents/skills/` | The `kit-*` workflow skills (inbox capture/promote, learning note, release) |
| `.codebuddy/skills/` | Symlink alias to `.agents/skills` — CodeBuddy Code discovers project skills only here |

Docs are English-primary with `.zh.md` Chinese counterparts; `pnpm run doc-sync` rejects drift. `AGENTS.md` (agent-facing) is English-only.

## Adopting checklist

1. Root `package.json` `name` and directory name: `adlc-coding` → your project.
2. Add the git remote; `.github/workflows/ci.yml` is prewired for pnpm + Node 22.
3. Provide `lint` / `typecheck` / `test` scripts — the gate graph invokes them; a scaffold inherits this kit's.

The `new` command performs 1 and 2 automatically.

## Adopting into another stack

This repository ships no stack-specific code: a stack lives in its own repository with its own lane, runs `adopt` to take the rule set, and stays green there. Shared artifacts between stacks take only two forms — schemas generated per language and fixtures committed to git. Composition rules: [roadmap Agent Note](.agents/notes/implemented/architecture/2026-09-15-adlc-coding-three-phase-roadmap.md).

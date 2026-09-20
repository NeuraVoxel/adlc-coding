# Architecture

English | [中文](architecture.zh.md)

adlc-coding is the AI work-paradigm and workflow kit of the adlc-coding series: a language-agnostic rule system that ships no application code. This file is the map to read before changing `packages/`, `scripts/`, `docs/`, or `.agents/`; decision rationale lives in [Agent Notes](../.agents/notes/README.md), and step-by-step guides do not live here.

## Composition

| Directory | Responsibility |
|---|---|
| `packages/create-adlc-coding/` | The installer: scaffolds a new project from this checkout or adopts rule components into an existing one; the checkout is the template |
| `scripts/` | The `run-gates.ts` orchestrator and verify scripts; language-agnostic infrastructure that never imports business code |
| `docs/` | The architecture map (this file), the [testing strategy](testing.md), and the [release contract](release.md) |
| `.agents/` | Decision records (`notes/`), the spark inbox and learning retrospectives, and the `kit-*` workflow skills |

## Language policy

Human-facing contracts are English-primary with a `.zh.md` Chinese counterpart updated in the same change: `README.md`, `docs/*.md`, `.agents/notes/**/*.md`, and the inbox and learning READMEs. `AGENTS.md` and the `.agents/skills/*/SKILL.md` files stay English-only — agent-facing, to bound model context ([pairing decision](../.agents/notes/implemented/process/2026-09-15-bilingual-doc-pairing.md)). Inbox sparks, `QUEUE.md`, learning notes, and `ChangeLog.md` are single-language by design and outside the pairing gate. `pnpm run doc-sync` rejects missing, orphaned, or structurally drifted counterparts.

## Typechecking scope

The kit ships no application code, so one TypeScript program covers the tooling: `tsconfig.tools.json` — `scripts/`, `vitest.config.ts`, the installer package — with shared strictness in `tsconfig.base.json`. Nothing crosses a package boundary, so there are no per-face `module`/`moduleResolution`/`lib` overrides and no `paths` mapping. There is no root solution program; a stack that adopts these rules owns its own typecheck program and lane.

## Gate system

`pnpm run check:ci` is `scripts/run-gates.ts ci-primary`. The runner only schedules the aggregate graph (spawn commands, `needs` dependencies, bounded parallelism, fail-fast per stage) and never parses a toolchain — adding a lane means adding Gate definitions, not runner changes. Current graph:

- `ci-primary`: lint, typecheck, test — one parallel stage.
- `doc-sync`: bilingual doc pairing, agent note classification, agent note format, frozen archive integrity, documentation reference integrity — one parallel stage.
- `check-all`: both of the above; this is what CI runs.

Reference integrity covers repository-relative Markdown links in the paired corpus (`pairedDirs` plus `pairedRootFiles`, imported from the pairing gate); external URLs, protocol-relative targets, pure anchors, and paths written inside code spans or fenced blocks are out of scope. The agent-facing instruction layer is checked by the installer's component dependency instead, since its referents are a packaging property.

Extension points:

- **New verify gate**: `scripts/verify-<invariant>.ts` with a spec proving it rejects one invalid case, wired into `gatesForMode`.
- **New lane** (for example `ci-web`, `ci-python`): extend the `Mode` union and `gatesForMode`; the runner body does not change.
- **UI copy gate**: when locale dictionaries arrive, add a verify gate rejecting copy hard-coded in components.
- **End-to-end**: a `ci-e2e` lane, separate from unit lanes, self-skipping without credentials; it belongs to the repository that owns the process under test.

Git hook ownership: pre-commit runs fast staged-file checks only (lint --fix, trailing whitespace), pre-push runs typecheck only, and CI owns the exhaustive matrix. Fast local checkpoints are the price of hooks that stay installed.

## Language-agnostic adoption

This kit ships no cross-language contract package. Two stacks share exactly two kinds of artifacts:

1. **Schemas** — per-language types are generated from them; hand-written copies of another stack's types are forbidden; generation freshness is gated by a gen/verify pair.
2. **Fixtures committed to git** — replayed offline by both sides, which is what keeps every lane independently validatable.

A stack adopting this rule set keeps its own repository, root, and lane and goes green there before any cross-stack artifact exists; live-process integration verification lives only in the adopter's own e2e lane. The adoption rule and its composition rules: [Agent Note](../.agents/notes/implemented/architecture/2026-09-15-adlc-coding-three-phase-roadmap.md). The installer design: [Agent Note](../.agents/notes/implemented/process/2026-09-15-create-adlc-coding-installer.md).

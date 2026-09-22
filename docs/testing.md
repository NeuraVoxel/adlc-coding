# Testing strategy

English | [中文](testing.zh.md)

Evidence matches the change surface: run the narrowest checks that would fail for this change's regression; never default to the full suite; never repeat a check that already passed. CI owns the exhaustive matrix.

## Change surface → evidence

| Surface | Evidence |
|---|---|
| `scripts/**` | The matching `scripts/*.spec.ts` (each verify gate owns one) + `pnpm run check:all` |
| `packages/create-adlc-coding/**` | `tests/lib.spec.ts` + a real scaffold/adopt smoke (see below) |
| `.agents/{inbox,learning,skills}/**`, `ChangeLog.md`, `docs/release.md` | `pnpm run doc-sync` (paired contracts) + review; sparks, queue rows, and learning notes are ungated user content |
| `docs/**`, `README*` | `pnpm run doc-sync` (bilingual pairing) |

## Focused runs

```sh
pnpm exec vitest run scripts/verify-doc-pairing.spec.ts
pnpm exec vitest run packages/create-adlc-coding/tests/lib.spec.ts
pnpm run doc-sync
```

Installer changes warrant a real smoke: scaffold into a temp directory and run the gates there, since the scaffolded tree is the product — a link the copy cannot follow, or a spec fixture it rewrites, fails there and nowhere else.

## Evolution order

Coverage gates are not enabled yet; introduce a global threshold first, then tighten per-file as risk concentrates. Gate scripts and the installer carry the unit evidence; a stack that adopts these rules adds its own lanes, including a real `ci-e2e` lane that self-skips without credentials. Tests describe behavior, not implementation: refactors leave tests alone; behavior changes move with their tests.

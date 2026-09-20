# Agent Note: rule-only kit and the cross-stack adoption rule

Status: implemented

## Problem

The kit's value is the AI work-paradigm and workflow rule system, not a sample application. Shipping a Fastify server, a React + Vite web app, and a `packages/contracts/` seam made every adopter delete stack-specific code before use, and it framed the series as "one full kit per language" — a framing that triplicates the whole skeleton per stack and parks cross-stack mechanisms (contract generation, two-sided same-PR changes) in a repository with no second stack to validate them against.

## Decision

This repository ships rules only: no application code, no per-stack faces, and no cross-language contract package. A stack lives in its own repository with its own typecheck program and lane, takes the rule set through `adopt`, and goes green there before any cross-stack artifact exists. Cross-stack shared artifacts take exactly two forms: schemas generated per language (hand-written copies of another stack's types are forbidden; generation freshness is gated by a gen/verify pair) and fixtures committed to git, replayed offline by both sides. Live-process integration verification belongs to the repository that owns the process under test. TypeScript remains the implementation language of the gate scripts and the installer, not a statement about the adopting stack.

## Alternatives considered

- **Keep the TypeScript faces as a worked reference.** Lost: every adopter deletes them before use, and a sample face invites rebuilding business code here — the kit's scope becomes ambiguous and the faces drift away from what the gates verify.
- **One integrated repository per stack combination.** Lost: the rule system is independently adoptable; a single evolving repository makes adopters carry other stacks' gates and dependencies they never use.
- **Keep `packages/contracts/` as the future home of generated cross-stack artifacts.** Lost: with one stack there is nothing to generate against, and its two-sided-change rule has no second side — an empty seam is a promise this repository cannot verify.

## Consequences

The kit is smaller and language-agnostic: `adopt` is the primary path, `new` scaffolds a rule-only project, and the gate graph covers the tooling itself (`scripts/` and the installer). The cost: no in-repository reference shows how a stack wires its own lanes, so that guidance lives in prose and in the adopter's own notes; and the identity rename is a single project name, since no scoped packages remain. The benefit: every adoption starts from an all-green gate that becomes the adopter's own regression baseline, and no adopter inherits code it must delete.

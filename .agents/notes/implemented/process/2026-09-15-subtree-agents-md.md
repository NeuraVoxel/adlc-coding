# Agent Note: per-subtree AGENTS.md supplements

Status: implemented

## Problem

All engineering rules lived in the root `AGENTS.md`, so obligations that only make sense inside one module — what a gate script may assume, what a component change in the installer must touch — had no home near the code they govern. The root file could not carry them without bloating the context every session loads.

## Decision

Two subtree instruction files supplement the root, following the deepseek-harness layering: `packages/AGENTS.md` (the installer) and `scripts/AGENTS.md`. Each states only obligations specific to that tree, links the contracts it depends on, and never restates root conventions; each carries a `CLAUDE.md` symlink. Subtree files ship with `new`-mode scaffolds via the whole-checkout copy but are deliberately absent from the `rules` adopt component — their paths describe this kit's layout, which an adopting project does not share. The root file gained one pointer line naming the subtrees.

## Alternatives considered

- **One file per package, even where a subtree holds a single package.** Lost at this scale: deepseek-harness, with two orders of magnitude more packages, still keeps one group-level `packages/AGENTS.md`; one package does not justify its own file.
- **Put the module-specific rules in root anyway.** Lost: every session pays the context cost for rules most work never touches, and the root file drifts toward the budget wall.
- **Wait for drift.** Lost: the installer's four-edit rule and the gate-infrastructure obligations were already being restated in conversation; unwritten obligations are the ones that decay.

## Consequences

Rules now sit beside the code they govern, and the root file stays lean. The two files are obligations to keep current: a rule that stops being true in its subtree must move or die in the same change as the code, and a deleted subtree takes its file with it — the seam section of `packages/AGENTS.md` left with `packages/contracts/`. Adopt-mode projects get the root discipline only; if an adopter's layout converges on this kit's, they copy the subtree files themselves — the roadmap sync at tagged releases treats them as kit content.

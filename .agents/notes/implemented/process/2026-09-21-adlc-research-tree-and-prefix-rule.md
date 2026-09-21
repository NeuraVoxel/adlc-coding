# Agent Note: The kit gains a research tree, and `adlc-` becomes a namespace rule

Status: implemented

## Problem

Every skill in `.agents/skills/` moves an artifact through this repository's own process — a spark through the [inbox](../../../inbox/README.md), a session into [`learning/`](../../../learning/README.md), a version through a release. None covers the step before an artifact exists: finding out what is true. When a maintainer asks what an API actually does, or which of two approaches a spec allows, the reading happens on the main thread or the answer arrives with no recorded source, and the question gets re-litigated at the next decision.

An external engineering skill set solves exactly this with a `research` skill, but it is written to defer to "wherever the repo keeps such notes". This repository has no such open place: every candidate destination is [gated](../../README.md) — an Agent Note carries a mandatory header and skeleton, `docs/` is bilingual-paired and consumer-facing — so adopting the skill verbatim would either collide with a gate or file evidence as a decision. Its `agents/openai.yaml` is a second problem: no skill here carries one, so it would arrive as a convention with a single member.

## Decision

`.agents/research/` is a fourth working tree beside `inbox/` and `learning/`, holding research notes: a question, its findings, and the source of every claim. Its [README](../../../research/README.md) carries the same four-part contract as its neighbours — boundary, entry language, layout, lifecycle — with entries in Chinese by default, named `yyyy-mm-dd-slug.md`, and a claim without a source ruled to belong elsewhere.

The boundary against its nearest neighbour is directional, and it is the part worth remembering: [`learning/`](../../../learning/README.md) reflects on **this repository and this session**; `research/` reports evidence gathered from **outside**, about a subject this repository does not own — the reason the note exists at all is that a claim needs a source. Like a learning note, a research note is absorbed-then-deleted once its durable facts reach an Agent Note or shipped documentation, so it never becomes a second authority.

The migrated skill is [adlc-research](../../../skills/adlc-research/SKILL.md). It dispatches a background agent to read against primary sources while the main thread keeps working, settles the output path **before** dispatch so a running agent cannot clobber an existing note, and treats a claim without its owning source as not a finding. Two upstream elements were dropped: `agents/openai.yaml`, for the single-member reason above, and the "save it wherever the repo keeps such notes" clause, replaced by the pinned `.agents/research/` path. The second drop costs portability to a repository that does not adopt this layout — taken deliberately, because inside this repository every alternative destination carries a gate.

The other half of the change is the prefix rule. `adlc-` now names the kit's own skill namespace — "shipped by this kit" — rather than "operates on an `.agents/` tree". Without that widening a general engineering skill could not join the family without a second naming scheme, and each remaining upstream skill (tdd, code-review, diagnosing-bugs, …) would re-open the same question on migration. Every skill under `.agents/skills/` therefore carries the prefix.

Registration follows the packaging rules rather than inventing any: the three new files join the installer's `workflows` component ([`lib.ts`](../../../../packages/create-adlc-coding/lib.ts)), the README pair joins `pairedRootFiles` in [`verify-doc-pairing`](../../../../scripts/verify-doc-pairing.ts) so the new tree is bilingual-gated exactly as its siblings are, and both the layout table and the installer component table name the new tree.

## Alternatives considered

- **Put research notes in `.agents/learning/`.** Lost: the two trees answer opposite questions — reflection on this repository versus evidence about an outside subject — so one tree would serve two lifecycles, and the boundary could not be retrofitted later without moving files.
- **Put them in `.agents/notes/proposed/` as Agent Notes.** Lost: an Agent Note is a decision, and its format gate demands a header and skeleton; most research is evidence for a decision not yet taken, so the format would either be satisfied by empty decisions or be made to lie. Research becomes an Agent Note when it is absorbed, not when it is gathered.
- **Pin the notes into `docs/`.** Lost: `docs/` is bilingual-paired and states contracts for adopters, while research notes are single-language working notes that mostly expire.
- **No skill; keep doing the reading inline.** Lost: that is the status quo the Problem describes — the reading occupies the main thread and an unsourced answer gets re-litigated.
- **Copy the upstream skill verbatim and let it choose the destination.** Lost: it defers to a convention this repository does not have, and every candidate destination carries a gate, so "pick something sensible" resolves to a guess that fails loudly later.
- **Introduce a new `research` installer component instead of extending `workflows`.** Lost: `AGENTS.md` links the tree, and the installer spec re-derives the required components from those links, so a new component would force a change to `COMPONENT_REQUIRES` and to the spec that guards it — for no gain over the component that already carries every other contract `AGENTS.md` points at.
- **Keep the old prefix meaning and name this skill plain `research`.** Lost: the family would then run on two naming schemes, the `workflows` component would carry a mixed table of contents, and every later migration would re-argue it; the prefix's real job is marking kit ownership, and widening it once is cheaper.
- **Keep `agents/openai.yaml`.** Lost: it is Codex-only metadata for a harness whose policy this repository does not otherwise configure, and a lone file is drift waiting to happen.

## Consequences

A question with an answer outside this repository now has a home a decision can cite, and the reading no longer occupies the main thread. Three working trees sit outside the notes tree, and their boundary is a written directional rule — `notes/` decides, `learning/` reflects inward, `research/` reports inward about outward facts — rather than shared intuition that decays.

`adlc-` is documented as the kit's namespace, so the remaining upstream skills migrate without re-deciding it. The migrated skill itself is no longer portable to a repository that does not adopt this layout; that price is bounded to its destination clause, not to its method, and the method stays as reusable as upstream wrote it.

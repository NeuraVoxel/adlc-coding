# Supplement to AGENTS.md — the notes tree

Environment instructions, English-only by policy, granting this file the same
exemption as the root `AGENTS.md`. It adds one rule the notes README cannot
carry, because the rule is about *when* to act rather than what a note is.

## Every new Agent Note triggers a supersession check

Before adding an Agent Note, search the active tree — `proposed/`,
`implemented/`, `rejected/` — for a note that already owns the same decision.
Then pick one outcome in the same change:

- **No owner exists.** Write the new note.
- **A note owns this decision and the new work only keeps it accurate.** Update
  that note in place per [implemented/AGENTS.md](implemented/AGENTS.md); do not
  add a second one.
- **The new work fully supersedes an owner.** Write the new note, cross-link
  both, and consolidate or archive the old note per the README's supersession
  and archiving rules. Partial supersession is not this outcome: keep both
  notes cross-linked and update every fact that remains current.

Skipping the check is how one decision grows two homes, and two homes is the
drift the notes tree exists to prevent. The notes README ([English](README.md))
owns what a note is and its file format; [archived/AGENTS.md](archived/AGENTS.md)
owns what may never change again.

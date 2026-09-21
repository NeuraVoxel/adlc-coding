# Supplement to AGENTS.md — `archived/`

Environment instructions, English-only by policy, granting this file the same
exemption as the root `AGENTS.md`. It is the freeze contract for everything in
this directory.

## Sealed content never changes again

Once sealed, an archived note is frozen history: never edit, reformat,
translate, update to match current code, move, or delete it, and never treat it
as authority for current behavior — it is what was decided then, not what is
true now.

An **archival change** is the only permitted write, and it may do exactly four
things:

1. Relocate the complete English/Chinese pair to `archived/{class}/`.
2. Insert `Archived: YYYY-MM-DD` directly below the `Status:` line in both files.
3. Record every moved file's hash in the append-only manifest,
   `scripts/archived-notes.manifest.json`; the gate names each entry it is
   missing, so the provenance list is the to-do list.
4. Repair or delete **inbound** links — links pointing at the archived pair.

Nothing else. Do not inspect, verify, or repair links **out of** an archived
note: those targets were frozen with it, and chasing them puts current gates in
the business of grading history. Documentation gates skip archived sources, so
an outbound link there is invisible to CI by construction, not by accident.

[`verify-archived-agent-notes`](../../../scripts/verify-archived-agent-notes.ts)
holds the manifest line: any later edit, move, or deletion fails the gate. The
[rules supplement](../AGENTS.md) owns the supersession check that decides
whether a note belongs here at all.

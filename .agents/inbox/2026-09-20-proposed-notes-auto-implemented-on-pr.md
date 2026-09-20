# Inbox: PR 合入时自动把 proposed Agent Note 搬进 implemented

Status: open
Type: feature
ID: Feat-0003

## Spark
`proposed/` 下的 Agent Note 在对应改动落地后需要人工搬到 `implemented/`：改 `Status:`、按 lifecycle 换骨架（`## Proposal` → `## Decision`，Acceptance criteria 与 Risks 合成 Consequences）、补修入链。这件事靠人记，容易漏（Bug-0001 就是落地后又单独搬的）。希望 PR 完成时自动完成这次合入。

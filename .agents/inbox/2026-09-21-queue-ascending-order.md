# Inbox: QUEUE.md 按正序排列，不要倒序

Status: promoted
Type: feature
ID: Feat-0006

已升格为 Agent Note：[implemented/feature/2026-09-21-queue-ascending-order.md](../notes/implemented/feature/2026-09-21-queue-ascending-order.md)

## Spark
`QUEUE.md` 的行应当按正序（先捕获的在前、后捕获的在后）排列，不要像现在这样最新的排在最前面。现在提出来是因为刚才往 `## Feat` 组头插入 Feat-0005 时又撞上一次：capture 一律往组首插行，队列读起来是从新到旧，跟「排队待办」的直觉相反。当前 [README.md](./README.md) 里写的正是 "newest capture first"，所以这是要改那条既定顺序规则，而不是既有规则被违反了。

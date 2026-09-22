# 把 mattpocock/skills 的 ticket 链并入 adlc：完整链路与并列通道设计

2026-09-21 的一次讨论记录。外部 skill 集是 mattpocock/skills（本地 checkout 在仓库同级目录 `/home/jeff/Documents/AI/adlc/skills`），它有一条 `research → to-spec → to-tickets → implement` 的链。结论是**不引入他的 `implement`**：只用它的前半段产出 ticket，再由脚本转成 GitHub issues，作为**并列于 `.agents/inbox` 的第二条需求输入通道**，之后一律走 adlc 自己的流程。权威契约仍在 `README.md` / `docs/` / Agent Notes，这里只记录设计结论与取舍。

## 完整链路图

```
┌─ 通道 A（现状，全程在 git 里）────────────────────────────┐
│  spark（.agents/inbox + QUEUE.md）                        │
│      ↓ adlc-inbox-promote（须本轮显式要求）              │
│  proposed Agent Note                                     │
└──────────────────────────────────────────────────────────┘
                            │
┌─ 通道 B（新增）──────────────────────────────────────────┐
│  research → to-spec → to-tickets                         │
│      ↓ local markdown 模式产出，agent 全程不碰 gh        │
│  ticket 文件：NN-slug.md（带 Blocked by）                │
│      ↓ scripts/publish-tickets.ts（--dry-run / 幂等）     │
│  GitHub issues：spec=parent，tickets=children            │
│      ↓ skills/adlc-issue-intake（不建 spark）            │
│  proposed Agent Note                                     │
└──────────────────────────────────────────────────────────┘
                            ▼
                 两条通道在此汇合，唯一入口
                    proposed Agent Note
                            ▼
                实现（纵向切片，TDD @ pre-agreed seams）
                            ▼
        pnpm run check:ci（lint + typecheck + test）
        pre-push 只跑 typecheck，CI 跑全矩阵
                            ▼
        implemented Agent Note —— 同 PR 把 proposed 翻成 implemented
                            ▼
        commit / push —— 只在本轮显式要求时才做
                            ▼
                        PR / MR
                            ▼
        CI 全矩阵 + code review（两轴：Standards / Spec，并行 sub-agent）
                            ▼
                          merge
                            ▼
        deploy —— 属 adopter 仓库的职责；本 kit 不 ship 应用代码，自身无此节点
                            ▼
        release cut（另行显式请求，docs/release.md 是契约，不随 merge 自动发生）
```

## 单点真相表

| 产物 | 权威归属 |
|---|---|
| 未成形想法 | `.agents/inbox` spark（`Feat-`/`Bug-` + 四位序号） |
| 已成形的 ticket / 需求 | GitHub issue（标题带 `[Feat-NNNN]` 作为跨系统连接键） |
| 决策记录 | `.agents/notes/{lifecycle}/{class}/…md` Agent Note |
| ticket 中间文本 | 临时目录，issue 创建后即可弃 — 不进配对门禁也不长期留存 |
| 实现进度 | Agent Note 的 lifecycle；**不回写**到 GitHub issue（单向：issues → note） |

## 三条必须写死的不变式

1. **一件事不同时存在于两条通道。** 从 issue 进来的不建 spark。inbox README 里"不得同时作为权威 todo 存在"那句要扩到把 issue 也算进去。
2. **ID 只有一个分配器。** 两条通道共用 `Feat-`/`Bug-` 序列（扫 spark 文件与 QUEUE 行，取该 type 最大值 +1），否则迟早撞号。
3. **外部写操作只发生在脚本里。** `to-spec`/`to-tickets` 一律走 local markdown，只有 `publish-tickets.ts` 调 `gh`；脚本按本仓库规矩自带 spec，网络相关测试无凭据时自跳过。

## 过程中查到的事实（省下次重新摸）

- 他的 skills **已经全量装在 `~/.codebuddy/skills/`**（`to-spec` `to-tickets` `research` `triage` `wayfinder` `ask-matt` 都在），所以不存在"安装"，只有接线。
- `to-tickets` 原生支持 **local markdown 模式**（写文件而非发 issue）— 这是本次最大简化：一个字都不用 fork，agent 也自动远离外部写操作。
- 反过来，`/setup-matt-pocock-skills` 会往 `docs/agents/` 写三份配置，而 `docs` 在 doc-pairing 的 `pairedDirs` 里（`scripts/verify-doc-pairing.ts:13`），所以若跑它就多三份中英配对要养；手写一份即可绕过。
- `CLAUDE.md` 是 `AGENTS.md` 的 symlink，且 `AGENTS.md` 在 `pairingExemptions`（`verify-doc-pairing.ts:29`）— 往它身上加 `## Agent skills` 块不会触发翻译门禁。
- 2026-09-20 那条 note 提到 `.agents/issues/` 存在但为空、README 未登记；本次 `ls .agents` 已经看不到它了。要落本地 ticket 层的话，`.agents/issues/` 比 `.scratch/` 更贴合本仓库布局，值得先确认它是被有意清掉的、还是当时随手建的目录。

## 待办候选（还没进 inbox）

以下都还没落地，讨论到此为止，尚未 formalize：

1. `docs/agents/issue-tracker.md`（+ `.zh.md`）：告诉他的 skill 走 local markdown。
2. `scripts/publish-tickets.ts` + `.spec.ts`：按依赖序发 issue，parent 先于 children，`--dry-run`，凭"先查已有再写回 issue 号"做幂等。
3. `.agents/skills/adlc-issue-intake/SKILL.md`：一个 issue 号/URL → proposed Agent Note，双向回链，不建 spark。
4. ID 分配：先放脚本里，等第一次被违反再升成 gate。
5. `research` 的产物放哪，还没定。
6. 是否复活 `.agents/issues/` 作为 ticket 层目录。

其中 1–3 是"非平凡改动"，动手前按规矩要先有一条 `proposed` Agent Note。

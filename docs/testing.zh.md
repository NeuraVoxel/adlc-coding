# 测试策略

中文 | [English](testing.md)

证据匹配变更面：跑能证明本次变更回归的最窄检查；不默认全量；不重复已通过的检查。CI 拥有穷举矩阵。

## 变更面 → 证据

| 变更面 | 证据 |
|---|---|
| `scripts/**` | 对应的 `scripts/*.spec.ts`（每条 verify 门禁各自持有）+ `pnpm run check:all` |
| `packages/create-adlc-coding/**` | `tests/lib.spec.ts` + 真实脚手架/采纳冒烟（见下） |
| `.agents/{inbox,learning,skills}/**`、`ChangeLog.md`、`docs/release.md` | `pnpm run doc-sync`（配对合同）+ 评审；spark、排队行与学习笔记是不设门禁的用户内容 |
| `docs/**`、`README*` | `pnpm run doc-sync`（双语文档配对） |

## 聚焦运行

```sh
pnpm exec vitest run scripts/verify-doc-pairing.spec.ts
pnpm exec vitest run packages/create-adlc-coding/tests/lib.spec.ts
pnpm run doc-sync
```

安装器变更需要真实冒烟：脚手架到临时目录并在其中跑门禁——脚手架产出的那棵树就是产品：拷贝跟不上的链接、或被拷贝改写的测试夹具，只在那里暴露，别处发现不了。

## 演进顺序

覆盖率门禁暂未启用；先引入全局阈值，风险集中后再 per-file 收紧。单测证据由门禁脚本与安装器承载；采纳这套规则的栈自行添加泳道，包括一条无凭据自跳过的真实 `ci-e2e` 泳道。测试描述行为而非实现：重构不动测试，行为变更连同测试一起改。

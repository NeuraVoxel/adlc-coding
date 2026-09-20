# Agent Note: 修掉中文 inbox README 里遗留的 kit-* 措辞

Status: implemented

## Problem

1.0.0 cut 把工作流技能改名为仓库自己的前缀——`kit-inbox-capture`、`kit-inbox-promote`、`kit-learning-note`、`kit-release` 变成 `adlc-inbox-capture`、`adlc-inbox-promote`、`adlc-learning-note`、`adlc-release`，changelog 也写明"路径、技能 `name:` 字段、installer 的 `workflows` 组件与每个链接都跟随改名"。有一行没跟随：中文 inbox 合同介绍技能时仍写"随 kit 安装的技能（kit 创作的技能平铺在 `.agents/skills/` 下）"，而英文对应行写的是 `adlc-authored skills`。读中文合同的人被指向一个已经不存在的 prefix，并读到与英文版不同的说法。这对文件只在结构上受门禁约束——标题数、代码块数、链接可解析——措辞不受检查，所以这次漂移对所有门禁都是隐形的。

## Decision

中文那一行现在点明仓库自己的前缀：已安装的技能是 `adlc-*` 技能，平铺在 `.agents/skills/` 下。改动只涉及措辞——标题与代码块位置未动，因此 `doc-pairing` 看到的结构不变，而两份文件开始讲同一个故事。

范围就是这一句，不是"kit"这个词。全仓库搜 `kit-` 只命中这一行，外加 `packages/create-adlc-coding/` 里的 `kit-history` 引用（installer 对未随组件 ship 的 Agent Note 链接的称呼）与 1.0.0 changelog 里记录这次改名的历史条目，这些都是有意为之，保留。根目录 `README.md` 双份里把本仓库称作 "kit" 是普通名词，英文版同样如此。

spark 见：[Bug-0001](../../../inbox/2026-09-20-inbox-readme-zh-kit-wording.md)。

## Alternatives considered

- **保持原样不动。** 落选：中文合同继续使用一个没有任何文件携带的 prefix，并与自己的英文对应行矛盾；修复只要一句话，推迟换来的只有漂移本身。
- **两种语言都改成不含前缀的中性写法"本仓库自带的技能"。** 落选：`adlc-` 是可被发现的名字——技能目录、installer 的 `workflows` 组件与所有链接都在用它，英文行也已定下来；去掉前缀只会让中文行比英文行更含糊，而不是对等。
- **把配对语料里每一处 `kit` 都替换掉。** 落选：根目录 README 双份里的 "kit" 是本仓库自己的普通名词，`kit-history` 与 changelog 里的出现是刻意保留的历史；一次盲目替换会为了修一行而破坏三个文件的意思。

## Consequences

两份 inbox 合同现在说的是同一个前缀，按 `kit-inbox-`、`kit-learning-`、`kit-release` 扫配对语料只会命中记录这次改名的已发布 changelog 条目。措辞没有门禁，这对文件靠评审与本 note 维持、而不是靠门禁：结构性门禁抓不到这类漂移，现在也仍然抓不到。

因为这句话落在门禁实际会读的配对文件里，交付前跑了 `doc-sync`——配对、引用、note 分类、note 格式与 archive 哈希全部保持绿灯。这里的措辞改动也比 inbox 通常那些不受门禁约束的编辑更响：误改标题或代码块会直接让 `doc-pairing` 失败，而不是静默落地。

修这一句还带出一处已在 `main` 上的、与此无关的破损：一次批量删除 Agent Note 留下 12 条悬空入链，分布在 `README.md`、`README.zh.md`、`docs/architecture.md`、`docs/architecture.zh.md` 与两篇 inbox note。它们在同一变更里修好了，与本决策分开。

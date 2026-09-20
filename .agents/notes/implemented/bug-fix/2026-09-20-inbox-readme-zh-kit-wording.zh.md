# Agent Note: 修掉中文 inbox README 里遗留的 kit-* 措辞

Status: proposed

## Problem

1.0.0 cut 把工作流技能改名为仓库自己的前缀——`kit-inbox-capture`、`kit-inbox-promote`、`kit-learning-note`、`kit-release` 变成 `adlc-inbox-capture`、`adlc-inbox-promote`、`adlc-learning-note`、`adlc-release`，changelog 也写明"路径、技能 `name:` 字段、installer 的 `workflows` 组件与每个链接都跟随改名"。有一行没跟随：中文 inbox 合同介绍技能时仍写"随 kit 安装的技能（kit 创作的技能平铺在 `.agents/skills/` 下）"，而英文对应行写的是 `adlc-authored skills`。读中文合同的人被指向一个已经不存在的 prefix，并读到与英文版不同的说法。这对文件只在结构上受门禁约束——标题数、代码块数、链接可解析——措辞不受检查，所以这次漂移对所有门禁都是隐形的。

## Proposal

改写 `.agents/inbox/README.zh.md` 里的那一句话，让它像英文行一样点明 `adlc-` 前缀：已安装的技能是本仓库自己的 `adlc-*` 技能，平铺在 `.agents/skills/` 下。改动只涉及措辞——标题与代码块位置不动，配对门禁看到的结构保持不变。

范围就是这一句，不是"kit"这个词。全仓库搜 `kit-` 只命中这一行，外加 `packages/create-adlc-coding/` 里的 `kit-history` 引用（installer 对未随组件 ship 的 Agent Note 链接的称呼）与 1.0.0 changelog 里记录这次改名的历史条目，这些都是有意为之，保留。根目录 `README.md` 双份里把本仓库称作 "kit" 是普通名词，英文版同样如此。

spark 见：[Bug-0001](../../../inbox/2026-09-20-inbox-readme-zh-kit-wording.md)。

## Alternatives considered

- **保持原样不动。** 落选：中文合同继续使用一个没有任何文件携带的 prefix，并与自己的英文对应行矛盾；修复只要一句话，推迟换来的只有漂移本身。
- **两种语言都改成不含前缀的中性写法"本仓库自带的技能"。** 落选：`adlc-` 是可被发现的名字——技能目录、installer 的 `workflows` 组件与所有链接都在用它，英文行也已定下来；去掉前缀只会让中文行比英文行更含糊，而不是对等。
- **把配对语料里每一处 `kit` 都替换掉。** 落选：根目录 README 双份里的 "kit" 是本仓库自己的普通名词，`kit-history` 与 changelog 里的出现是刻意保留的历史；一次盲目替换会为了修一行而破坏三个文件的意思。

## Acceptance criteria

- `.agents/inbox/README.zh.md` 中介绍已安装技能的那一句点明 `adlc-` 前缀，其说法与英文行完全一致。
- `pnpm run doc-sync` 通过：双份结构仍对等，所有相对链接仍可解析。
- 在配对文档语料里按 `kit-inbox-`、`kit-learning-`、`kit-release` 定向搜索，只剩记录这次改名的已发布 changelog 条目。

## Risks

- 这对文件在结构上受门禁约束，即使措辞正确，增删标题或代码块也会让 `doc-pairing` 失败；把改动限制在一句话内即可避开。
- 改动落在门禁实际会读的文件里，意味着出错会以门禁失败的形式暴露、而不是静默——交付前应跑 `doc-sync`，不能因为"inbox 不在门禁内"就不验证。

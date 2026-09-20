# Agent Note: inbox 看板只放条目行

Status: implemented

## Problem

随 kit 发布的 [`QUEUE.md`](../../../inbox/QUEUE.md) 开头带一段说明——"Empty. A capture adds a `yyyy-mm-dd-slug.md` spark and one row here in the same change; a promotion or dismissal marks the row `[x]` …"——而[捕获](../../../skills/adlc-inbox-capture/SKILL.md)把新行直接插在 `# Inbox queue` 标题下、新 → 旧排列。首次捕获后两者并存：看板在写着 "Empty." 的同时下面已经有一行，扫队列的人得先知道那段文字是过期散文、不算看板内容。那段文字还复述了 [inbox README](../../../inbox/README.md) 已有的规则，让一个事实有了两处归属、两处要同步。

## Decision

看板只由 `# Inbox queue` 标题与条目行组成，别无他物：没有图例、没有空态说明、行间与行下不留散文；队列为空即"没有任何 `[ ]` 行"，这一点由 README 对写明写，README 仍是看板唯一的权威。捕获继续直接插在标题下，此时已无歧义；技能无需改动。inbox 依旧在一切 format gate 之外，因此这只是 README 与捕获 / 升格共同维持的约定，与[类型轴](../../../inbox/README.zh.md)相同。

## Alternatives considered

- **首次捕获时删掉那段（规则写进技能与 README）。** 落选：捕获将带一条"若存在空态行则删除"的条件步骤，而发布出去的文件在被触发前一直重复着合同——等于把刚撞上的漂移固化下来。
- **把那段改写成常驻图例放在行下方。** 落选：看板仍是 README 已有规则的第二处归属，且一行散文混在 checkbox 行之间，每次扫队列都要再问一遍"这算不算看板内容"。
- **用显式伪行标记空态（`_No open entries._`）。** 落选：扫队列时它看着就像一条 checkbox 行，首次捕获仍得删掉它——同样的条件编辑，只是下移了一行。
- **给看板形状上门禁（`verify-inbox-queue`）。** 暂不选，理由与类型轴相同：inbox 刻意在所有 format gate 之外，捕获必须保持便宜。

## Consequences

看板与合同不再互相打架，一次捕获就是一次无条件插入。发布与被 adopt 的 `QUEUE.md` 是"只有标题、没有行"的状态，于是 adopt 方的首次捕获产出的看板与本仓库天然一致。这次漂移是用真实的捕获动作撞上发布态看板才发现的；那条测试 spark 已删除而非升格，其理由留在本 note 里。

---
tags:
  - 文章
  - AI
  - Obsidian
  - 效率工具
  - Agent
  - 知识管理
  - 公众号运营
  - 个人成长
  - 内容创作
---
# Obsidian 标签自动化 · 给 AI 的工作说明书（读者交付物 v3）

> **这是什么**：本文件是一份给 AI agent 的「工作说明书」（在 AI 圈叫 skill）。它不是插件、也不是软件，而是一套固定流程——你把它整段丢给任意 agent（Claude Code / Codex / 本地模型 / WorkBuddy 都行），它按你定的规则，把 Obsidian 标签整理好。文件一字不改，换的只是「谁在跑」。
>
> 配套文章：《怎么让 1000 多篇 Obsidian 笔记自己「长」出标签？》（远舟笔记·第25篇）
> 适用：笔记越多越乱、手写标签坚持不下来、且希望**长期可重复维护**的人。本地优先、引擎无关。
> **v3 新增**：可**重复运行**——后续运行先读工作日志、只处理增量笔记；每次运行产出一份 **HTML 标签操作报告**。
> **v3 修订**：异常标签清理**不写死脚本**——附录 B 只给「判定规则 + 处理思路」，由 agent 按运行环境自行实现；附「可选参考实现」供想要可审计版本的高级用户直接用。

## 适用场景

**适合你，如果：**
- 笔记 100 篇以上，标签越打越散、越打越懒；
- 想让 AI 帮忙，但不想学 Python / YAML / 正则；
- 认可一句话：**先理解整个库，再统一打标签**（而不是每篇现想现打）；
- 想要一套**能定期跑、越跑越省事**的长期维护系统。

**暂时不需要，如果：**
- 笔记不到 30 篇（手动更快）；
- 你只想要一个 Obsidian 插件（本方案是「流程」不是「插件」，可配合 Tag Wrangler 用）。

## 怎么用（普通用户 · 4 步）

1. 下载本文件 `obsidian标签skill.md`；
2. 把它整段丢进你的 agent（Claude Code / Codex / WorkBuddy / 本地模型皆可）；
3. 对它说一句：「执行 obsidian 标签 skill」；
4. 回答它的提问、做确认 → 完事（首次会多确认一步词表，之后基本自动）。

agent 自己按下面的流程走。**第一次**是全量梳理；**之后每次**它先读工作日志、只动新增/改过的笔记，并生成一份 HTML 报告。整个过程中，异常标签怎么清理、脚本怎么写，都由 agent 按附录 B 的规则自行决定——**你不需要准备任何代码**。

> 想看 agent 怎么判定「异常标签」、或自定义规则？那是「高级玩法」，见文末附录 B（异常标签处理规则，agent 自行实现，无需你准备脚本）。

## 两个概念（先看懂，流程用得到）

- **工作日志 `tag_ops_log.md`**：放在 `050管理/tag管理/`，由 skill 自动维护。每次运行追加一条记录（日期 / 范围 / 改动数 / 词表版本 / 报告路径）。它是「增量模式」的记忆——下次运行靠它知道「上次弄到哪了」。
- **HTML 操作报告 `tag_report_<日期>.html`**：每次运行结束生成，给你看「动了什么、结果如何、全库标签分布、后续建议」。

## Agent 执行流程（先萃后标 · 可重复）

收到「执行 obsidian 标签 skill」时先判断：
- vault 里**没有** `tag_ops_log.md` → 走 **【首次 · 全量】**；
- vault 里**已有** `tag_ops_log.md` → 走 **【后续 · 增量】**（默认，省时）。

### 【首次 · 全量】

1. **[问]** 你的 vault 路径是？（如 `/Users/你/Documents/obsidian`）
2. **[问]** 这些笔记里有不能出本机的敏感内容吗？（有 → 走本地模型；没有 → 可走云端）
3. **[自动 · 诊断]** 扫描全库，先输出一份诊断报告（此时零改写：笔记总数、有/零标签比例、唯一标签数、单例碎片占比、污染标签示例）。
4. **[自动 · 清理，可选]** 按附录 B 的「异常标签处理规则」做标准化：合并 `ai`/`AI` 这类仅大小写不同的变体、清掉颜色码/纯数字误标等。agent 据运行环境**自行实现**（写 Python / Node / 在对话里直接跑都行），默认只预览、你确认后才真改。
5. **[自动 · 萃取样表]** 基于清理后的库，把同义标签并成簇、识别碎片，按「类型 / 主题 / 状态」三维，长出一套**属于你的**受控词表草案。
6. **[问 · 确认点 ①]** 展示词表草案 + 旧→新映射示例，请你确认或微调。→ **这一步最关键，词定了后面全自动。**
7. **[自动 · 生成知识地图]** 按确认的词表，在 `050管理/tag管理/` 下生成 `TAGS.md`：每个一级标签一段，写清「用途 / 包含 / 关联」。这是你的知识地图，让体系长期稳定。
8. **[自动 · 小范围测试]** 先回标 **50 篇**（首轮上限），逐篇列「文件名 → 建议标签 → 理由」，写入日志雏形。
9. **[问 · 确认点 ②]** 这 50 篇准吗？→ 你抽查无误后说「可以全量」。
10. **[自动 · 全量执行]** 批量写回剩余笔记 frontmatter（不改正文、不超词表、不碰 `[[双链]]`）。
11. **[自动 · 写工作日志]** 初始化 `tag_ops_log.md`：记 `last_run`=现在、`vocab_version`=1、本次统计、报告路径。
12. **[自动 · 生成报告]** 生成 `tag_report_<日期>.html`（模板见同包 `tag-report-template.html` / 附录 C）。

### 【后续 · 增量】（默认，省时）

1. **[自动 · 读日志]** 读 `tag_ops_log.md`，取 `last_run`、`vocab_version`、已处理文件集。
2. **[自动 · 扫增量]** 只扫 `last_run` 之后**新增或修改**的 `.md`（未动的跳过，秒级完成）。
3. **[条件 · 词表确认]** 若 `TAGS.md` 自 last_run 起**没变** → 直接套用，跳过确认点 ①；若**变了** → 触发确认点 ① 重新确认、`vocab_version +1`。
4. **[自动 · 增量回标]** 对增量里「缺标签 / 标签不在词表 / 明显错标」的笔记套用词表（错标含大小写、空白等异常，按附录 B 规则一并标准化），逐篇列「文件 → 旧 → 新 → 理由」。**落地方式见附录 D**：用「白名单闸 + mtime 时间戳闸」的可复用脚本实现，避免每次重写、且保证体系永不发散。
5. **[问 · 确认]** 预览增量改动，你确认后执行（少量可全自动，量大仍人工检）。
6. **[自动 · 追加日志]** 在 `tag_ops_log.md` 追加本次条目，更新 `last_run`。
7. **[自动 · 生成报告]** 生成 `tag_report_<日期>.html`，并标注「增量模式 / 对比上次」；**标签分布基于全库当前快照**（只读扫描，便宜），明细仅含本次增量。

**执行纪律（agent 必须遵守）**：
- 诊断零改写；清理默认预览、确认后执行；
- 词表不预设：首次词必须来自你的库，不套内置词；
- 第 7 步（首次）先出知识地图再回标；
- 首轮限量：第一次全量前先 ≤100 篇测试（默认 50）；
- 不改正文、不超词表、不碰 `[[双链]]`；
- 笔记含敏感信息时全程本地模型，不上传云端；
- 工作日志与报告是**新增文件**，不改动你的任何笔记内容；
- 异常标签清理由 agent 按附录 B 规则自行实现，不要求你提供任何脚本。

## 安全规则（改造前必读）

1. **不备份（省空间）**：批量改写前**不再复制 vault 留备份**（用户要求，占空间）。安全改靠「dry-run 预览 + 人工确认 + 幂等可重做」：回标先抽 50 篇预览、清理默认预览、确认后才执行；白名单过滤是幂等操作，跑多次结果一致，出错随时重跑修正。
2. **本地优先**：笔记含未公开工作信息，**绝不走云端 API**，只用本机模型。
3. **dry-run 优先**：清理默认预览；回标先抽 50 篇人工检。
4. **首轮限量**：第一次全量前，先 ≤100 篇测试（默认 50），或先看日志 patch 再决定。
5. **留修改日志**：每次运行写入 / 追加 `tag_ops_log.md`，记清「旧→新、影响哪些文件、共几篇」。
6. **别动文件系统**：不要用 Auto Note Mover 按标签移文件——会打断 `[[双链]]` 和附件相对路径。
7. **标签粗分组 + 双链细连接**：标签负责「粗分组」，`[[具体概念]]` 负责「精准连」。
8. **异常清理只动标签**：无论 agent 怎么实现清理，都只能改 frontmatter 的 `tags:` 与正文标签的大小写/空白，**绝不改正文语义、不增删正文文字**（详见附录 B.3）。

## 后续维护（让它自己转起来）

- **新笔记防漂移**：给 Obsidian 装 Templater，新建笔记自动带空 `tags:` 字段模板；沿用 `TAGS.md` 作词表基准。
- **定期跑增量**：① 手动——每周 / 每月说一次「执行 obsidian 标签 skill」，agent 读日志只处理增量，几分钟搞定；② 自动——建每周定时任务跑增量维护脚本（见附录 D.3），白名单制下可全自动，异常才告警。
- **压缩收敛（可选）**：若唯一标签反弹过多（如几百个、单例占多数），按附录 D.1 做一次收敛（只留白名单、幂等过滤），把唯一标签压回受控规模（如减 90%）。
- **词表演进**：笔记主题大变时，改 `TAGS.md` 再跑一次，agent 会检测到词表变化并重新确认；**改词表须同步改脚本 `KEEP` 常量**（见 D.2）。

## HTML 报告包含什么

每次运行生成 `tag_report_<日期>.html`，至少含 5 块：

1. **操作概览**：运行类型（全量 / 增量）、范围、处理文件数、改动数、词表版本。
2. **操作明细**：逐条「文件 → 旧标签 → 新标签 → 理由」（可折叠）。
3. **标签分布**：全库当前 Top 标签频次条形图；增量模式附「较上次变化」。
4. **问题诊断**：孤立标签 / 单例标签 / 疑似污染 / 漂移预警。
5. **后期建议**：维护性建议（定期跑增量、词表更新时机、Templater 模板等）+ 我认为必要的其他项。

模板与结构见同包 `tag-report-template.html`（附录 C）。

---

## 附录 A · 受控词表示例（作者个人，非通用，仅供参考）

> ⚠️ 下面这套是作者（文案人）自己的示例，**不是你的词表**。医生、程序员、小说家的词表天差地别。请用流程第 5 步让 agent 从**你的** vault 长出属于你的词表。

| 维度     | 标签（示例）                              | 说明         |
| ------ | ----------------------------------- | ---------- |
| **类型** | `工作` `学习` `写作` `日记` `素材` `知识卡` `模板` | 按笔记"是什么"分  |
| **主题** |  `AI` `效率工具` `知识管理` `个人成长` `平台运营`   | 按笔记"讲什么"分  |
| **状态** | `灵感` `待整理` `进行中` `已发布` `归档`         | 按笔记"在哪一步"分 |

> 想要面板更整洁，可用嵌套写法 `#类型/工作`、`#主题/AI`、`#状态/灵感`。

## 附录 B · 异常标签处理规则（agent 自行实现，无需你准备脚本）

> **核心转变**：不把清理逻辑写成一份写死的 `.py` 交付给你，而是把**判定规则 + 处理思路**写清楚，让 agent 按运行环境自己实现（Python / Node / 直接在对话里跑都行）。普通用户完全不需要碰代码；想要可审计确定性版本的高级用户，文末附「可选参考实现」可直接用或改。

### B.1 什么叫「异常标签」（判定规则）

agent 扫描时把下列情形标记为异常，逐一列出供你确认：

| 类型 | 判定 | 例 |
| --- | --- | --- |
| 大小写变体 | 仅大小写不同的同名标签 | `ai` / `AI` / `Ai` |
| 多余空白 | 标签内含首尾 / 中间多余空格 | `#效率工具 ` / `#效率 工具` |
| 重复标签 | 同一篇 frontmatter 内出现两次 | `AI, AI` |
| 同义标签 | 语义相同写法不同（需结合词表判断） | `AI` / `人工智能` |
| 孤立 / 单例 | 全库只出现 1 次的标签 | `#某冷门项目` |
| 疑似污染 | frontmatter 显式标签里的 hex 颜色码 / 纯数字（正文里的 `#/路由`、CSS 选择器不算） | `#FFFFFF` / `#2024` |

### B.2 处理思路（四步，agent 照做）

1. **标准化**：合并仅大小写不同的变体 → 统一为全库出现次数最多 / 大写字母最多的写法；去首尾空格、折叠中间多空格。
2. **合并同义**：仅在已确认受控词表覆盖时，把同义写法归一为词表标准标签（如 `人工智能 → AI`）。**词表外的同义不擅自合并**，列给你确认。
3. **删污染 / 孤立**：hex 颜色码、纯数字误标直接删；孤立单例默认**保留并标记**（不删，因为可能只是你还没写第二篇），仅在你说「清理单例」时才删。
4. **留痕**：所有改动写入 `tag_ops_log.md`（旧→新、影响文件、共几篇），并进入本次 HTML 报告明细。

### B.3 安全约束（agent 实现时必须遵守，与正文流程同红线）

- 只改 frontmatter 的 `tags:` 与正文标签的**大小写 / 空白**；**不改正文语义、不增删正文文字**。
- 不移动文件、不碰 `[[双链]]`、不改附件相对路径。
- dry-run 默认预览；你确认后才执行（等价于 `--apply`）。
- 不生成整库备份（省空间）：安全靠 dry-run 预览 + 你确认 + 幂等可重做（详见正文安全原则）。
- 首轮限量：清理也先 ≤100 篇预览，再决定全量。
- 凡不确定的是否误标，一律**列给你确认**，不自行删除。

### B.4 可选参考实现（非必需 · 高级用户可审计版）

如果你希望拿到一份确定的、可复现的清理脚本（而不是每次让 agent 重写），可直接使用下面这段参考实现，或让 agent 按 B.1–B.3 改写成你顺手的版本。**它不是 skill 运行的前提**——agent 完全可以不依赖它、按规则自行实现。

```python
#!/usr/bin/env python3
# Obsidian / Markdown 标签异常清理 · 参考实现（dry-run 默认，零依赖，仅标准库）
# 设计：不内置标准词表，只做与词表无关的确定性整理（大小写/空白归一）。
#       同义合并交给受控词表回标流程；疑似污染默认不删，--pollution 才清 frontmatter 显式标签。
import os, re, sys, datetime
from collections import Counter

VAULT = sys.argv[1] if len(sys.argv) > 1 else "."
APPLY = "--apply" in sys.argv
POLLUTION_ON = "--pollution" in sys.argv
TS = datetime.datetime.now().strftime("%Y%m%d")
EXCLUDE_DIRS = {".obsidian", ".trash", ".git", "node_modules", "theme", "plugins", "_tag_backup"}

def split_fm(txt):
    m = re.match(r'^---\n(.*?)\n---\n', txt, re.S)
    return (m.group(1), txt[m.end():]) if m else (None, txt)

def parse_fm_block(fm):
    m = re.search(r'^tags:(.*?)(?=\n[a-zA-Z_]|$)', fm, re.S)
    if not m:
        return None, None, []
    block = m.group(1); val = block.strip()
    if val.startswith('['):
        return m, 'flow', [t.strip() for t in val[1:val.rfind(']')].split(',') if t.strip()]
    if '\n' in block and re.search(r'\n\s*-\s', block):
        return m, 'list', [t.strip() for t in re.findall(r'-\s*([^\n]+)', block)]
    return m, 'inline', [t.strip() for t in val.split(',') if t.strip()]

def rebuild(style, tags):
    if style == 'flow':
        return 'tags: [' + ', '.join(tags) + ']'
    if style == 'list':
        return ('tags: []' if not tags else 'tags:\n' + '\n'.join('  - ' + t for t in tags))
    return 'tags: ' + (', '.join(tags) if tags else '[]')

HEX = re.compile(r'^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$')
def is_pollution(t):
    return bool(HEX.fullmatch(t)) or t.isdigit()

def collect_tags():
    fm_tags, inline_tags = [], []
    for root, dirs, files in os.walk(VAULT):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if not f.endswith('.md'):
                continue
            txt = open(os.path.join(root, f), encoding='utf-8', errors='ignore').read()
            fm, body = split_fm(txt)
            if fm:
                _, _, ts = parse_fm_block(fm)
                fm_tags.extend(ts)
            for t in re.findall(r'(?<![\w/`"])#([\u4e00-\u9fffA-Za-z0-9_/-]+)', body):
                inline_tags.append(t)
    return fm_tags, inline_tags

def build_canonical(all_tags):
    low = {}
    for t in all_tags:
        low.setdefault(t.lower(), set()).add(t)
    canon = {}
    for k, variants in low.items():
        if len(variants) > 1:
            vs = list(variants)
            cands = [v for v in vs if v != v.lower()]
            cands.sort(key=lambda v: sum(1 for c in v if c.isupper()), reverse=True)
            canon[k] = cands[0] if cands else vs[0]
    return canon

def normalize_tag(t, canon):
    tl = t.lower()
    return canon[tl] if (tl in canon and canon[tl] != t) else t

def polish_fm(fm, canon):
    m, style, old = parse_fm_block(fm)
    if m is None:
        return fm, False
    new, seen = [], set()
    for t in old:
        if POLLUTION_ON and is_pollution(t):
            continue
        nt = normalize_tag(t, canon)
        if nt.lower() not in seen:
            new.append(nt); seen.add(nt.lower())
    if new == old:
        return fm, False
    return fm[:m.start()] + rebuild(style, new) + fm[m.end():], True

BOUND = r'(?<=[\s`"\'\[(])'
def polish_file(path, canon):
    txt = open(path, encoding='utf-8', errors='ignore').read()
    fm, body = split_fm(txt)
    changed = False; new_fm = fm
    if fm:
        new_fm, fc = polish_fm(fm, canon)
        if fc:
            changed = True
    work = ' ' + body
    for k, c in canon.items():
        work = re.sub(BOUND + r'#(' + re.escape(k) + r')\b', '#' + c, work, flags=re.I)
    new_body = work[1:]
    if new_body != body:
        changed = True
    return (new_fm, new_body) if changed else None

def main():
    fm_tags, inline_tags = collect_tags()
    canon = build_canonical(fm_tags + inline_tags)
    print("=== 大小写合并组（仅列「只差大小写」的）===")
    for k, c in sorted(canon.items()):
        print(f"  {k} -> {c}")
    print(f"\n共 {len(canon)} 组大小写变体")
    hits = 0
    for root, dirs, files in os.walk(VAULT):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if not f.endswith('.md'):
                continue
            p = os.path.join(root, f)
            res = polish_file(p, canon)
            if not res:
                continue
            hits += 1
            rel = os.path.relpath(p, VAULT)
            print(f"{'APPLY ' if APPLY else 'PREVIEW'} {rel}")
            if APPLY:
                new_fm, new_body = res
                open(p, 'w', encoding='utf-8').write(
                    ('---\n' + new_fm + '\n---\n' + new_body) if new_fm is not None else new_body)
    print(f"\n需改动文件: {hits}")
    print("模式:", "已应用" if APPLY else "只读预览，加 --apply 执行")

if __name__ == '__main__':
    main()
```

> 用法（仅当你选择用这份参考实现时）：
> `python tag_cleanup.py /path/to/vault`            # 预览（仅大小写/空白归一）
> `python tag_cleanup.py /path/to/vault --apply`    # 真正改写
> `python tag_cleanup.py /path/to/vault --pollution` # 额外清 frontmatter 里的颜色码/纯数字误标

## 附录 D · 增量维护可复用实现（含压缩收敛 + 踩坑）

> 本附录把「首次全量之后，怎么让标签体系长期不发散、且能自动跑」落成**可复用配方**。它是对附录 B「不写死脚本」哲学的补充：附录 B 解决「异常清理怎么判」，本附录解决「回标之后怎么守」。
> 普通用户仍不需要碰代码——agent 按本附录要点实现即可；想要确定性版本可直接用 D.5 骨架（或直接复用 vault 里已落好的 `050管理/tag管理/_tag_tools/tag_incremental.py`）。

### D.1 压缩收敛（唯一标签减 90%，可选·用户要求时做）

全量回标后若唯一标签仍过多（如 441 个、单例占 55%），做一次**收敛**：

1. **建白名单**：只保留高频受控标签（如 Top 44 + 类型/状态维度共 46 个），写进 `TAGS.md` 作为唯一合法词表。
2. **不备份**：不做整库复制（占空间）；直接过滤到白名单，幂等可重做，出错随时重跑修正。
3. **过滤到白名单**：遍历所有 frontmatter `tags:`，只保留 ∈ 白名单的；能合并进高频的合并（`一人公司/OPC→AI创业`、`微信/微信公众号→公众号运营`、`方法论/自我迭代→个人成长`、`[[llm]]/大模型/GPT/Prompt→AI`、`[[agent]]/智能体→Agent`），真噪音/人名/污染直接删。**残留非法标签应为 0**（`[[双链]]`、文件路径、分发稿句子片段、人名等）。
4. **幂等**：过滤到白名单是幂等操作——跑多次结果一致，出错随时重跑修正。
5. **同步 TAGS.md**：把维护约定从「单例默认保留」改为「不在白名单即删/合并」。

> 边界：合并只在白名单覆盖内做；白名单外的有机标签默认保留（除非用户要求统一）。原有 frontmatter 标签按「不擅删」合并保留（`OA申请` 等历史标签可保留）。

### D.2 增量维护脚本要点（守门人）

落一个自包含脚本（如 `050管理/tag管理/_tag_tools/tag_incremental.py`），核心是**两道闸**：

1. **白名单闸**：`KEEP` 常量 = `TAGS.md` 的受控标签集。脚本**只写白名单内标签**，跑多少次都不会引入新标签 → 体系永不发散。任何白名单外散落标签一律删。
2. **mtime 时间戳闸**：读 `tag_ops_log.md` 的 `last_run`（**完整 ISO 时间戳**，非日期），只对 `mtime > last_run` 的新建/修改笔记补标（类型+状态+白名单内 inline/关键词）；旧笔记只做「清散落」防护，**绝不重标**。写完更新 `last_run` 为本次运行时间戳。

### D.3 每周自动化（让体系自己转）

把 D.2 脚本挂成**每周定时任务**（如每周日 03:00，`FREQ=WEEKLY;BYDAY=SU;BYHOUR=3`）：

- prompt 要自包含：写明脚本绝对路径、白名单以 `TAGS.md` 为准、异常告警（某次改动突增数百篇 = 时间戳闸异常，立即报告不静默）。
- cwds 指向 vault 根。
- 因白名单制，日常运行可全自动；仅当用户改 `TAGS.md` 词表时需同步改脚本 `KEEP` 常量。

### D.4 踩坑清单（照做可避）

| # | 坑 | 后果 | 正确做法 |
| --- | --- | --- | --- |
| 1 | **无时间闸门**，对所有笔记重做关键词推断 | 旧笔记被过宽重标（曾误改 301 篇） | 只补 `mtime > last_run` 的笔记；旧笔记只清散落 |
| 2 | **日期级**比较（`mtime.date() > last_run.date()`） | 当天新建笔记永不被补标 | 用**完整时间戳**比较（`os.path.getmtime(p) > last_run_ts`） |
| 3 | `last_run` 写成**日期**而非时间戳 | 同日触碰过的文件全被判为「新」→ 大范围重标 | `last_run` 存 `datetime.now().isoformat()`；大操作结束点再推进 |
| 4 | **增量脚本扫到 `TAGS.md` / `tag_ops_log.md` 自身** | 白名单定义文件被反向改写、知识地图被污染（实测：PREVIEW 曾把 `TAGS.md` 标成 `[] -> ['AI','效率工具',...]`） | 脚本 walk 时跳过这两个管理文件路径：`if p == TAGS_MD or p == LOG_MD: continue`（已实测修复） |

### D.5 可选参考实现骨架（非必需）

核心逻辑（伪代码，agent 按环境实现；可直接复用已落好的 `050管理/tag管理/_tag_tools/tag_incremental.py`）：

```python
# 增量维护核心（白名单 + 时间戳闸）
KEEP = {由 TAGS.md 解析出的受控标签集合}      # 与 D.1 白名单一致
def main():
    last_run = read_last_run()               # 完整 ISO 时间戳；None=首次
    for p in content_md_files():             # 仅 8 个内容目录，排除系统/备份目录
        if p == TAGS_MD or p == LOG_MD: continue   # 跳过管理文件自身，防污染白名单定义
        old = extract_tags(p)
        kept = [t for t in old if t in KEEP]  # ① 清散落（对所有文件生效，防发散）
        if last_run is None or os.path.getmtime(p) > last_run:   # ② 时间戳闸
            new = kept + folder_type(p) + path_status(p)
            new += [t for t in inline_tags(p) if t in KEEP]
            new += kw_infer(p)                # 仅白名单内、文件夹限定
        else:
            new = kept                        # 旧笔记绝不重标
        new = dedupe(new)
        if new != old:
            write_frontmatter(p, new)
    update_last_run(datetime.now().isoformat())   # ③ 推进时间戳
```

> 落地示例（作者 vault 实测）：脚本 `050管理/tag管理/_tag_tools/tag_incremental.py` + 每周日 03:00 自动化；白名单 46 标签；端到端验证「新建笔记正确补标、旧笔记 0 触碰（1149 篇仅改 1 篇）」。

---

## 附录 C · HTML 报告模板 `tag-report-template.html`

每次运行，agent 读取同包 `tag-report-template.html`，把占位符替换为本次真实数据，写出 `tag_report_<日期>.html`。模板自带浅色主题与 CSS 条形图，零外部依赖。结构即上方「HTML 报告包含什么」五块；若只下载本 `.md`，agent 仍可按该结构自行生成报告。

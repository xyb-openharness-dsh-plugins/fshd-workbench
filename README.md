# 小飞侠 FSHD 工作台

本机优先的FSHD基因确诊档案、功能与辅助器具、并发症筛查、疼痛疲劳与生活就业、遗传家庭沟通工作台

这是接入骨架，尚未实现真实业务。初始化后先将 [项目设计提示词](docs/DESIGN-PROMPT.md) 交给当前Agent；它应展示实际路径并以已有用户/场景/流程素材对齐设计者、研究与取舍原则。癌种项目另有 [完整专用提示词](prompts/NEW-CANCER-WORKBENCH.md)。需求见 [BRIEF](docs/BRIEF.md)，规格见 [SPEC](docs/SPEC.md)，任务见 [TASKS](docs/TASKS.md)；先读 [AGENTS](AGENTS.md)。CLI输出交接与首问，实际对话由Agent接续。

## 疾病概要

> 四段固定：定义 → 医学资料规范和指南情况 → 目前治疗全景概要 → 发展趋势。整体属**解释层**（第 ② 层）：
> 只整理公开信息，不判断你的病情。工作台顶栏的「?」看同一份内容的整页版。
> FSHD 是罕见神经肌肉病，不是肿瘤：这里引用 AAN / AANEM 指南与 GeneReviews，不套肿瘤指南。
> 原件状态照实写：两份文件都没有存档原件，GeneReviews 直接页出现验证码，只提取到摘要；趋势段的登记与公告是自采快照，第三方原件未存档。

### 定义

FSHD（面肩肱型肌营养不良症）是一种遗传性肌肉疾病，主要累及面部、肩胛带与上臂，也可累及腹部和下肢；不同人的受累范围与变化速度差别很大。本台只抄报告与功能记录原文，不做严重度判读，也不预测外显率。

分型上，FSHD1 与 FSHD2 的分子机制不同，遗传咨询不能合并；基因报告需记录 D4Z4 重复数、4qA / 4qB 单倍型、甲基化，以及 SMCHD1 / DNMT3B / LRIF1 等相关基因原文，字段允许「未明确」。检测方法有 Southern blot、OGM、qPCR 等，写法不同；普通外显子检测阴性不能自动排除 FSHD，报告不全时本台保留缺项与原文，不替报告补结论。诊断依据是临床分布 + 基因检测 + 家族史的组合；本台不以算法确诊，也不拿 D4Z4 重复数自行生成筛查处方。

**来源**：AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy · 2015 · 未取得原件 · 页码待核（公开指南链接 PMC4520817，未存档）｜ GeneReviews · Facioscapulohumeral Muscular Dystrophy · 更新 2025-07-10 · 未取得完整正文 · 页码待核（直接页验证码，仅摘要）

### 医学资料规范和指南情况

| 机构 | 文件 | 版本 / 年份 | 原件 | 本台的用途 |
|---|---|---|---|---|
| AAN / AANEM | Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy | 2015 | 未取得原件（公开指南链接，未存档） | 诊断路径与照护类别（康复、器具、疼痛、呼吸、眼与听力） |
| GeneReviews | Facioscapulohumeral Muscular Dystrophy | 更新 2025-07-10 | 未取得完整正文（直接页验证码，据摘要提取） | 分子机制、FSHD1 / FSHD2 区分、遗传咨询边界 |
| — | 中国 FSHD 诊疗指南 / 共识 | 未检索到可核对版本 | 未取得原件 | 国内口径暂缺；不用其他病种指南代填 |

未取得原件的文件只记「存在」与「大致讲什么」，不引用其具体条文，页码写「页码待核」。「指南里列了这一类照护」不等于「你所在医院能提供」：具体服务、等候时间、跨省手续与报销比例，本台不预填「可做」或「医保报销」。2015 年指南是历史文件，本台不用它替代 2026 年的药物状态核验；新药与在研项目另按登记与开发者公告记录。

**来源**：见上表逐行。

### 目前治疗全景概要

FSHD 没有肿瘤那样的病期与线序，下面按照护类别分组。只列指南与专家综述里出现过的类别，不含具体训练处方、器具品牌、药物剂量与适用条件——那些必须由你的神经肌肉病团队按你的功能状态决定。

- **功能与康复**：个体化物理治疗与作业治疗——针对足下垂、绊倒、抬臂与穿衣受限等具体任务，由康复团队评估后安排，本台只记录「做了什么、多久一次、目标是什么」；适当运动——指南与综述把它列为照护类别，具体强度、频次与禁忌由医生或治疗师给出，本台不生成运动处方；功能记录——面部（吹气 / 闭眼）、肩胛（抬臂 / 翼状肩）、上臂、腹部（腰凸）、下肢（爬楼 / 足下垂）分区自查，医生量表（如 FSHD-CSS）只存原文，本台不打分。
- **器具与手术**：辅助器具评估——踝足矫形器（AFO）、腰背支具、腹带、轮椅与移动辅具，属于「评估—适配—复查」流程，本台记录谁开的、何时、费用与适配情况，不推荐品牌或型号；肩胛固定术——指南把它列为精选患者可评估的选项，手术不阻断疾病进展，获益与风险需由骨科 / 神经肌肉病团队判断，本台只留讨论记录。
- **症状与并发症**：疼痛与疲劳——疼痛评估、物理治疗、按医嘱用药与日常活动调整都属照护类别，本台只记录部位、强度、诱因与活动影响，不给用药建议；呼吸——肺功能评估、专科转诊，必要时通气支持，本台把「已确认的呼吸随访任务」与一般锻炼提醒分开，异常情况提示就诊而不是自行判断；眼与听力——闭眼不全时的眼保护、眼科与听力评估，眼底（Coats 病）与高频听力属于并发症筛查节奏，具体间隔按医生建议记录；脊柱——脊柱侧弯等肌骨问题纳入康复 / 肌骨评估，本台只记录筛查结果原文与下次建议时间。
- **遗传、生活与临床研究**：遗传咨询——FSHD1 / FSHD2 分开讨论，家系结构与风险说明由专业来源与遗传咨询限定，本台不计算个人风险、不替做生育决定，家系记录默认私密；生活与资源——慢特病、残疾证、救助项目、学业与就业的申请状态留痕，本台不担保结果、不代判资格；临床研究——参加登记良好的临床试验是正式选项，不是最后手段，登记不证明有效、安全或开放入组，状态需向研究中心核实。

以上是文献与指南里列出的手段，按病期与线序排列，**不代表任何一项适合你**。选哪一个，这一句需要问你的医生。

**来源**：AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy · 2015 · 未取得原件 · 页码待核 ｜ GeneReviews · Facioscapulohumeral Muscular Dystrophy · 更新 2025-07-10 · 未取得完整正文 · 页码待核

### 发展趋势

只写已经发生、能回源核对的事，每条带日期或版本号。本项目没有自采 FSHD 在研登记的数量与阶段分布，所以不写数量统计；监管批件与分类体系更新也没有核实到，整类不写。

- 2015：AAN / AANEM 发布 FSHD 诊断与管理循证指南；本项目记录为 2015 版，未检索到更新版。
- 2025-07-10：GeneReviews「Facioscapulohumeral Muscular Dystrophy」条目更新（本项目核查记录，仅摘要）。
- 截至 2026-10-18 的公开登记与开发者公告：del-brax 处于 III 期（FORTITUDE-3，NCT07038200；2026-06-11 公告）；EPI-321 处于 I/II 期（NCT06907875；2026-10-05 报告首 6 例六个月数据）；apitegromab 处于 II 期（NCT07435129；2026-09-02 公告已开始给药）。

**来源**：AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy · 2015 · 未取得原件 · 页码待核 ｜ GeneReviews · Facioscapulohumeral Muscular Dystrophy · 更新 2025-07-10 · 未取得完整正文 · 页码待核 ｜ 开发者公告 / ClinicalTrials.gov · del-brax、EPI-321、apitegromab 的登记与公告 · 核查日 2026-10-18 · 原件已取得（自采快照；第三方原件未存档，转引自 `docs/research/FSHD-THERAPIES.md`）

## 开发顺序

先共创SPEC和候选数据关系，再交付HTML交互工作台；由用户确认对应版本/模块后，复核SCHEMA/API并实现生产功能。确认记录见docs/PROTOTYPE-REVIEW.md；模型不依赖前端Tab/流程。模板骨架不是业务已确认。

## 当前能力

- 富原型 `prototypes/v0.1/` 已完成：12 个业务页 + 病情一图秀（对齐 16-ONE-CHART-SPEC）+ 指标卡（对齐 24-METRIC-TREND-TAB-DESIGN）+ 疾病概要 36 号 v2（顶栏「?」整页浮窗、指南链接真实可点、看板状态卡）。
- 原型数据为本机内存模拟（113 点 / 3 档案），刷新重置，**请勿填写真实病历**。
- 已明确布局：customFrame（业务优先，原生 AI 会话由宿主托管）；顶栏三段式 + AI 五态。
- **装机呈现**：`lib/client.js` 正在接入，使装机的「小飞侠 FSHD 工作台」直接呈现上述富原型（见 [docs/G2-SIGNOFF.md](docs/G2-SIGNOFF.md) 与下方 2026-10-27 记录）。当前已发布的骨架包内 `lib/client.js` 仍是占位面板；G2 逐页签认完成后进入 G3 数据模型冻结。
- 无业务数据库、无真实密钥；所有业务页按确认 spec 逐项实现。

## 开发与本地验收

需要 Node.js 22+、Git、包管理器和可用 DSH Desktop；采用 SQLite 时另核验 node:sqlite 版本条件。宿主 peers 的范围仅是模板基线，请与目标 Desktop 实际依赖核对。

```bash
npm install
npm run check      # 含版本同步 + 文案红线 + 包结构校验
npm test           # 跑疾病概要探针 P1–P9（自带本地服务）
npm run pack:check
npm pack
```

`npm install` 可能按 npm 策略解析 peer；勿为消警告重复打包宿主 runtime。客户端本身是单文件；引入 TS/组件库后需添加构建步骤并保留单文件导出。

本地安装入口以当前 Desktop/CLI 帮助为准。安装后按 [docs/06-VALIDATION-AND-RELEASE.md](docs/06-VALIDATION-AND-RELEASE.md) 与官方自测完成真实 UI 验收，并填写 [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md)。静态检查不代表已加载。

Logo 来源与使用限制见 assets/README.md。许可证采用 MIT（见 `LICENSE` 文件）；仓库为 `https://github.com/xyb-openharness-dsh-plugins/fshd-workbench`，`private: true` 保留不公开发布。

感谢小x宝社区、DataElement 社区，以及 sam / hhx / 繁华的 ❤️ 贡献。

初始化来源记录见 `.dsh-wb-starter.json`。更新社区脚手架不会覆盖本项目；需要升级时先用相同确认配置在临时目录生成，再审阅差异。CLI 用法见 [docs/CLI-GIT.md](docs/CLI-GIT.md)。

## HTML先行与数据演进

业务开发前先交付HTML交互工作台原型、实际预览并由用户确认版本/hash和范围。数据设计先区分领域事实、流程状态和页面读模型，走查前端/流程变化、兼容与迁移；原型对象不直接作为表。见[规范](docs/14-HTML-AND-DATA-CONTRACT.md)。

## 2026-10-18 需求调研与原型探索

已完成[调研总览](docs/RESEARCH-2026-10-18.md)，补充SPEC v0.2。第一批[HTML交互探索稿](prototypes/v0.1/index.html)可本机打开；记录为内存模拟，刷新重置，请勿填写真实病历。完整原型、用户确认、生产业务与Desktop接入均待完成。

## 2026-10-27 原型对齐与发布

- **P1 回灌**：补入脚手架适用规范 [21 研究手册](docs/21-RESEARCH-PLAYBOOK.md)、[22 阶段闸口](docs/22-PHASES-AND-GATES.md)、[23 指标分级告警](docs/23-METRIC-GRADING-AND-ALERTS.md)、[24 指标趋势 Tab](docs/24-METRIC-TREND-TAB-DESIGN.md)、[25 指南桥接](docs/25-GUIDELINE-BRIDGE.md)、[32 整页视图](docs/32-FULL-PAGE-VIEW.md)，及缺失 prompts（顶栏、动效、36 回补、指标趋势、ZERO-TO-DEV）；模板与 page-view 参考件一并补齐。不覆盖 FSHD 已定制的 docs。
- **P2 指标卡**：按 24 号修 6 处差距——①指标卡与一图秀共用 `METRIC_CATS` 分组目录（MT03）；②无记录指标保留「还没有记录」占位卡、入口可找；③正面加「N 次已核对」；④背面数据点可点开来源详情且不翻回（MT09）；⑤可比组合同写入 [METRIC-TREND-SPEC.md](docs/METRIC-TREND-SPEC.md)；⑥尺寸偏离（186/1200/620）登记进 [DEVIATIONS.md](docs/DEVIATIONS.md)。
- **P3 留痕**：[TASKS.md](docs/TASKS.md) 修正 Git 状态；新增 [G2-SIGNOFF.md](docs/G2-SIGNOFF.md) 逐页签认追踪（保持「未签认」）；`npm run check` 增版本同步与文案红线，`npm test` 接探针；本文件更新真实状态；重复文档（ONE-CHART-SPEC / ONE-CHART-CONTRACT）定权威。
- **lib/client.js 接入**：进行中，目标是让装机工作台直接呈现富原型（见 [docs/G2-SIGNOFF.md](docs/G2-SIGNOFF.md)）。
- 版本 `0.1.2`，Git 已推 `origin/main`；`npm run check` 全绿。

# 疾病概要 · 面肩肱型肌营养不良症

> 本项目实例文件，由 `xyb-workbench-starter` 的 `templates/DISEASE-PRIMER.md` 复制而来。
> 规范：starter `docs/36-DISEASE-PRIMER.md`。四段固定、顺序不变，缺段不合格。

- 项目 / 品牌：小飞侠 FSHD
- 病种：面肩肱型肌营养不良症（Facioscapulohumeral Muscular Dystrophy，FSHD）
- 最后更新：2026-10-25
- 数据文件：`prototypes/v0.1/primer-data.js`（`window.DISEASE_PRIMER`）
- README 对应段：`## 疾病概要`
- 实现：`prototypes/v0.1/primer.js` + `primer.css`（来自 starter `assets/patterns/`，逻辑未改）
- 探针：`NODE_OPTIONS= node scripts/probe-disease-primer.mjs --port 8132 --url http://127.0.0.1:8132/prototypes/v0.1/index.html` → 9/9

## 0 原件状态（本项目的前提）

| 文件 | 状态 |
|---|---|
| AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy | **未取得原件**：只有公开指南链接（PMC4520817），未存档 |
| GeneReviews · Facioscapulohumeral Muscular Dystrophy | **未取得完整正文**：条目更新 2025-07-10，直接页出现验证码，只提取到摘要 |
| 中国 FSHD 诊疗指南 / 共识 | **未检索到可核对版本**：不拿其他病种指南代填 |

FSHD 是罕见神经肌肉病，不是肿瘤。本项目不引用 CSCO / NCCN / AJCC / WHO 肿瘤分类，也不把肿瘤指南的「病期 / 线序」
硬套过来。`docs/research/FSHD-CLINICAL-BOUNDARIES.md` 的原话是「该文件是历史指南，不用其中药物状态代替 2026 新药核验」。

## 1 定义（`definition`）

FSHD（面肩肱型肌营养不良症）是一种遗传性肌肉疾病，主要累及面部、肩胛带与上臂，也可累及腹部和下肢；不同人的受累范围与变化速度差别很大。

- 分型：FSHD1 与 FSHD2 的分子机制不同，遗传咨询不能合并。基因报告需记录 D4Z4 重复数、4qA / 4qB 单倍型、甲基化，以及 SMCHD1 / DNMT3B / LRIF1 等相关基因原文；字段允许「未明确」。
- 检测方法：Southern blot、OGM、qPCR 等写法不同；普通外显子检测阴性不能自动排除 FSHD，报告不全时本台保留缺项与原文，不替报告补结论。
- 诊断依据是临床分布 + 基因检测 + 家族史的组合。本台不以算法确诊，也不拿 D4Z4 重复数自行生成筛查处方。
- 本台不判读严重程度、不预测外显率；医生量表（如 FSHD-CSS）只存原文。

**来源**：AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy · 2015 · 未取得原件，据二次来源 · 页码待核（公开指南链接 PMC4520817，未存档）｜ GeneReviews · Facioscapulohumeral Muscular Dystrophy · 更新 2025-07-10 · 未取得完整正文，据摘要 · 页码待核（直接页验证码）

## 2 医学资料规范和指南情况（`evidence`）

| 机构 | 文件 | 版本 / 年份 | 原件 | 本台的用途 |
|---|---|---|---|---|
| AAN / AANEM | Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy | 2015 | 未取得原件（公开指南链接，未存档） | 诊断路径与照护类别（康复、器具、疼痛、呼吸、眼与听力） |
| GeneReviews | Facioscapulohumeral Muscular Dystrophy | 更新 2025-07-10 | 未取得完整正文（直接页验证码，据摘要提取） | 分子机制、FSHD1 / FSHD2 区分、遗传咨询边界 |
| — | 中国 FSHD 诊疗指南 / 共识 | 未检索到可核对版本 | 未取得原件 | 国内口径暂缺；不用其他病种指南代填 |

- 一台一表，不合并；未取得原件的必须标出来。
- 本项目没有「国内指南 vs 国际指南」两套分期体系可对照（FSHD 也没有肿瘤式分期），因此不做换算、不造对照列。

**来源**：见上表逐行。

## 3 目前治疗全景概要（`landscape`）

FSHD 没有肿瘤那样的病期与线序，下面按照护类别分组；只列指南与专家综述里出现过的类别，不排序、不比优劣、不含训练处方与器具品牌。

### 3.1 功能与康复

- 个体化物理治疗与作业治疗：针对足下垂、绊倒、抬臂与穿衣受限等具体任务，由康复团队评估后安排；本台只记录「做了什么、多久一次、目标是什么」。
- 适当运动：指南与综述把它列为照护类别；具体强度、频次与禁忌由医生或治疗师给出，本台不生成运动处方。
- 功能记录：面部（吹气 / 闭眼）、肩胛（抬臂 / 翼状肩）、上臂、腹部（腰凸）、下肢（爬楼 / 足下垂）分区自查；医生量表只存原文，本台不打分。

### 3.2 器具与手术

- 辅助器具评估：踝足矫形器（AFO）、腰背支具、腹带、轮椅与移动辅具，属于「评估—适配—复查」流程；本台记录谁开的、何时、费用与适配情况，不推荐品牌或型号。
- 肩胛固定术：指南把它列为精选患者可评估的选项；手术不阻断疾病进展，获益与风险需由骨科 / 神经肌肉病团队判断，本台只留讨论记录。

### 3.3 症状与并发症

- 疼痛与疲劳：疼痛评估、物理治疗、按医嘱用药与日常活动调整都属照护类别；本台只记录部位、强度、诱因与活动影响，不给用药建议。
- 呼吸：肺功能评估、专科转诊，必要时通气支持；本台把「已确认的呼吸随访任务」与一般锻炼提醒分开，异常情况提示就诊而不是自行判断。
- 眼与听力：闭眼不全时的眼保护、眼科与听力评估；眼底（Coats 病）与高频听力属于并发症筛查节奏，具体间隔按医生建议记录。
- 脊柱：脊柱侧弯等肌骨问题纳入康复 / 肌骨评估，本台只记录筛查结果原文与下次建议时间。

### 3.4 遗传、生活与临床研究

- 遗传咨询：FSHD1 / FSHD2 分开讨论，家系结构与风险说明由专业来源与遗传咨询限定；本台不计算个人风险、不替做生育决定，家系记录默认私密。
- 生活与资源：慢特病、残疾证、救助项目、学业与就业的申请状态留痕；本台不担保结果、不代判资格。
- 临床研究：参加登记良好的临床试验是正式选项，不是最后手段；登记不证明有效、安全或开放入组，状态需向研究中心核实。

**固定出口（原话照抄）**：

> 以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。

**来源**：AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy · 2015 · 未取得原件 · 页码待核 ｜ GeneReviews · Facioscapulohumeral Muscular Dystrophy · 更新 2025-07-10 · 未取得完整正文 · 页码待核

## 4 发展趋势（`trend`）

只写已发生的事实，每条带日期或版本号。

1. 2015：AAN / AANEM 发布 FSHD 诊断与管理循证指南；本项目记录为 2015 版，未检索到更新版。
2. 2025-07-10：GeneReviews「Facioscapulohumeral Muscular Dystrophy」条目更新（本项目核查记录，仅摘要）。
3. 截至 2026-10-18 的公开登记与开发者公告：del-brax 处于 III 期（FORTITUDE-3，NCT07038200；2026-06-11 公告）；EPI-321 处于 I/II 期（NCT06907875；2026-10-05 报告首 6 例六个月数据）；apitegromab 处于 II 期（NCT07435129；2026-09-02 公告已开始给药）。

**未写**：本项目没有自采 FSHD 在研登记的数量与阶段分布，所以不写数量统计；监管批件（NMPA / FDA 批准）、分类体系更新、指南结构变化也没有核实到，整类不写。
losmapimod 的 III 期未达终点与 emugrobart 停止 FSHD 开发属于公司研发决定与试验结果，不在趋势段五类白名单内，只留在 `docs/research/FSHD-THERAPIES.md`。

**来源**：AAN / AANEM · Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy · 2015 · 未取得原件 · 页码待核 ｜ GeneReviews · Facioscapulohumeral Muscular Dystrophy · 更新 2025-07-10 · 未取得完整正文 · 页码待核 ｜ 开发者公告 / ClinicalTrials.gov · del-brax、EPI-321、apitegromab 的登记与公告 · 核查日 2026-10-18 · 原件已取得（自采快照；第三方原件未存档，转引自 `docs/research/FSHD-THERAPIES.md`）

## 5 落地清单

- [x] `prototypes/v0.1/primer.css`（starter 原样复制）
- [x] `prototypes/v0.1/primer.js`（starter 原样复制，逻辑未改）
- [x] `prototypes/v0.1/primer-data.js`（四段数据）
- [x] `index.html` 三处引用：`primer.css`、`primer-data.js`、`primer.js`
- [x] 顶栏「?」由模块自动插入 `header`（本原型无 `.topbar` / `.top-actions`；已截图确认在「AI 对话」右侧，不遮挡原按钮）
- [x] README 的 `## 疾病概要` 四段正文（位置：项目简介之后、`## 开发顺序` 之前）
- [x] `NODE_OPTIONS= node scripts/probe-disease-primer.mjs --port 8132 --url …/prototypes/v0.1/index.html` → 9/9 PASS
- [x] `node /Users/qinxiaoqiang/Downloads/xyb-workbench-starter/scripts/check-conformance.mjs .` → primer/* 四条 ok

## 6 验收（P1–P8）

| 编号 | 判据 | 结果 |
|---|---|---|
| P1 | 顶栏有可点「?」，aria-label 说明四段 | ✅ text="?" label="疾病概要：定义、医学资料与指南情况、治疗全景、发展趋势" |
| P2 | 整页面板，四段顺序 定义 → 指南 → 治疗全景 → 趋势 | ✅ definition › evidence › landscape › trend |
| P3 | 面板宽高 ≥ 视口 90% | ✅ 1249×829 / 视口 1280×860 |
| P4 | 打开压一条 history，`history.back()` 收起 | ✅ history.length=3；返回后 open=false |
| P5 | 「返回」「关闭」两个独立入口 | ✅ back=true close=true same=false |
| P6 | 关闭后焦点回触发按钮、滚动位置不变 | ✅ focusOnTrigger=true scrollY=0→0（本页当前不可滚动，探针按 0 记） |
| P7 | Esc 只退一层 | ✅ open=false，URL 仍在 /prototypes/v0.1/index.html |
| P8 | 四段齐全、每段有来源、趋势段无禁止词 | ✅ |

## 7 本项目教训

- **罕见病不能套肿瘤指南**：初稿按前几个癌种的结构想填 CSCO / NCCN / AJCC，但 FSHD 根本没有对应的肿瘤指南。改成 AAN / AANEM 2015 与 GeneReviews，并在表里写明「中国 FSHD 诊疗指南未检索到可核对版本」，不拿别的病种文件凑数。
- **公司研发决定不进趋势段**：losmapimod III 期未达终点、emugrobart 停止 FSHD 开发都是真实且有日期的事实，但不属于趋势段五类白名单（版本更替 / 批件 / 登记规模 / 分类更新 / 结构变化），最终只留在研究稿，没有为了「看起来丰富」塞进去。
- **固定出口句不改写**：FSHD 没有肿瘤式病期与线序，这句「按病期与线序排列」放在这里并不贴切；但它是模块的硬要求，原文照抄，没有改成「按照护类别」。

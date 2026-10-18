# 数据主体—关系—表 · 小飞侠 FSHD 工作台 v0.1

日期：2026-10-18。状态：**设计草案，未冻结；G3 通过前不建库、不写正式迁移**。文内实体仅为候选；当前目录未发现 `schema/draft/0001_initial.sql`，不声称已有SQL草案。

## 1. 四层边界（同家族约定）

| 层 | 内容 | 落库 |
| --- | --- | --- |
| L1 领域事实 | 确诊/功能/筛查/症状/资源等用户核对后的事实 | 是（append-only 为主） |
| L2 流程实例 | 导入任务、候选核对动作 | 是 |
| L3 页面读模型 | 看板摘要、一图秀、复诊材料汇总 | **否**，运行时从 L1/L2 计算，不落表 |
| L4 偏好 | UI 偏好（AI pane 宽度等）、隐私默认 | 是（可覆盖写） |

原始资料（document）、识别候选（candidate）、用户核对记录（record 及各事实表）、专业判断分开；原型 state 不是数据库结构。

## 2. 实体清单

### L1 领域事实

| 实体 | 说明 | 关键约束 |
| --- | --- | --- |
| subject | 本人档案（单主体工作区） | id, display_name, birth_year |
| document | 导入原件 | UNIQUE(subject_id, sha256)；重复导入不重置解析状态 |
| gene_report_finding | 基因确诊档案：D4Z4 重复数、4qA/4qB、方法、FSHD1/2、医院、报告日期 | 字段均可空；改正=新增版本，不覆盖；原文引用 document_id |
| diagnosis_history | 确诊/误诊经历留痕（preliminary/revised/confirmed） | 只新增不删除 |
| function_observation | 分区功能自查：region(face/scapula/upper_arm/abdomen/lower_limb)、side(left/right/both)、ability_key、status_text、is_asymmetric | 自查 `is_conclusion=0`；医生评分**不在此表** |
| clinical_score_record | 医生评分原文（FSHD-CSS 等） | 只存原文+来源+日期，无数值判读位 |
| assistive_device | 辅助器具：kind(AFO/back_brace/abdominal_binder/wheelchair/other)、prescriber、issued_on、cost_note | 无品牌推荐位（free-text 由用户填，界面不诱导） |
| rehab_log | 康复记录打卡 | activity, occurred_on, note |
| screening_event | 四类筛查：ocular_coats/hearing/respiratory/spine | result_text 原文；next_due_on 可空；到期提醒运行时算 |
| symptom_entry | 疼痛/疲劳：kind(pain/fatigue)、site、trigger、severity_text | severity 存原文（如"3/10"），不判读趋势 |
| metric_result | 检验指标（CK 等字典指标） | value_num+unit+ref_text；认不出单位留空 |
| insurance_case | 医保/救助：kind(chronic_outpatient/disability_cert/aid_program)、status、materials_note | 带 last_verified_on；过期标"未核实" |
| resource_item | 患者组织/专家/救助渠道档案 | 标来源与"未核实"，不做推荐排序 |
| research_lead | 研究线索：registration_note 与 clinical_result_note **分列** | 无数据时 clinical_result_note=NULL，界面显示"目前无公开临床疗效数据" |
| family_member | 家系成员：relation、genetic_status_text、note | **默认私密**，fail-closed |
| viewpoint | 心理与生活记录（viewpoint） | `is_conclusion=0`、标"不是医生结论"、默认私密；不进趋势/摘要 |
| task | 待办（复诊、办证、筛查安排） | due_on 允许未来（planned）；已发生事件不适用 |

### L2 流程实例

| 实体 | 说明 |
| --- | --- |
| import_job | 导入/解析任务；失败不产候选，原件留重试 |
| candidate | 识别候选：UNIQUE(document_id, field, value_text)；冲突/缺单位/非数字读取时算，不落库 |
| review_action | 接受/拒绝候选；接受只写对应事实表，`reviewed_by` 保持 NULL（接受≠临床审核） |

### L3 读模型（不落库）

看板「现在可以做」、筛查到期卡、功能变化摘要、一图秀混合序列、复诊携带材料——全部运行时从 L1/L2 查询拼装。

### L4 偏好

| 实体 | 说明 |
| --- | --- |
| ui_pref | AI pane 开/关与宽度（25–45%）、导航折叠；展示偏好，不属病情事实 |
| privacy_pref | 私密默认（遗传/观点 include_private=false，fail-closed）；导出显式勾选 |

## 3. 家族契约（四条沿用 + FSHD 补充）

1. 看法恒不为结论：viewpoint `is_conclusion=0`。
2. 日期可空不回填：候选自带 > 本次传入 > 材料报告日期；都没有报 `DATE_REQUIRED`；`imported_at` 永不顶替。待办/计划允许未来日期，已发生事件不晚于今天。
3. 更正只新增版本：gene_report_finding、clinical_score_record 等改正走新版本行。
4. 事实四层不合并；原型 state 不是库结构。
5. **FSHD 补充**：基因字段只抄录不判读——任何"严重程度/外显预测"不允许成为字段或读模型输出。
6. **FSHD 补充**：研究线索 registration_note 与 clinical_result_note 分列，禁止合并成单一"进展"字段。

## 4. 选型

SQLite（本机文件，`node:sqlite`）；与家族 breast/ovarian 同构，复用 migrate() 增量迁移、`scripts/check-schema.mjs` 冻结合同检查（冻结动作在 G3 通过后执行）。规模：单患者十年量级万行以内，无并发写者，离线优先。


## 5. 研究增补候选（未冻结）

- 公共intervention_reference与study独立；同药物别名映射稳定ID，监管地区/批准、注册阶段、招募、结果分列；结果细分生物标志物/功能/安全性、样本、对照、随访、来源类型与日期。
- study_access包含地点、往返次数、过夜、陪护、交通/误工和补偿，各项允许unknown，不以NULL推断无成本。
- reference_resource具有主体、服务类别、地区、证据类型、来源/checked_on/revision；alias_relation须带verified状态，不自动合并相似组织。private_resource_contact_log存患者个人申请与咨询，不污染公共参考。
- screening_plan与screening_event分离：专业建议原文/出处、适用条件、计划日期可未知；不由重复数直接推导医嘱。功能事实增加life_task与fall_event来源关系，不复制到每个Tab。
- psychosocial_support_request、accommodation_request、accessibility_check均为可选私密流程；记录期望/动作/回应/回顾，和病情事实隔离。
- gene_report_finding保留FSHD2甲基化及相关基因原文与方法局限，类型可未知；不自动临床解释。
- 变化走查：加心理入口不新增事实副本；改药名只加alias；重开咨询保留旧版本；改筛查日期生成计划修订不改历史检查；删收藏不删公共来源；断网保留带日期缓存且不标实时核实。

HTML探索稿records仅用于演示，不作为生产表结构；尚未选择/验证实际SQLite版本与正式迁移。

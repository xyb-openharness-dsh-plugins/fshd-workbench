# 互动设计记录

状态：设计者待对齐。继承用户已明确的决定，未核实的配置素材不自动视为设计确认。
当前阶段/范围：designer-alignment → research → scenarios → specification → independent-review → prototype → implementation；已有项目从当前未决项继续，不重复重置。
设计提示词：docs/DESIGN-PROMPT.md；设计者章程：docs/DESIGNER-BRIEF.md；实际独立审查：docs/DESIGN-REVIEW.md。
权威内容：docs/BRIEF.md、docs/SPEC.md；UI 与数据设计链接：...

| 决策 ID | 待解决的问题 | 用户已确认内容/来源 | Agent 建议及原因 | 待确认项 | 确认人/日期 | 影响功能 ID |
| --- | --- | --- | --- | --- | --- | --- |
| DESIGN-01 | ... | ... | ... | ... | ... | ... |

本轮已写入的章节：...
下一轮最关键的问题（1–3 个相关问题）：...
确认时展示的原型版本/hash、实际预览方式：...
变更：旧决定 → 新决定、原因、受影响数据/API/原型/验收项：...

用户回答后由 Agent 更新对应文档；本记录只保留决策和指向，不重复复制完整需求。

HTML原型关口：路径/版本/hash、实际预览证据、用户确认范围/原话/日期；未确认则业务开发待开始。
数据演进关口：SCHEMA变化矩阵、领域/流程/读模型边界、兼容与迁移未决项。

## 2026-10-18 · 场景排序确认（G1 前置）

- 确认人：用户（WorkBuddy 会话内选择）。
- 确认内容：V1–V11 场景排序（P0=确诊档案/功能变化/并发症筛查/疼痛疲劳/复诊准备；P1=辅助器具/遗传家庭(私密)/医保救助/研究线索；P2=生活就业/资料解读）认可；V10 并入「心理与生活」子页。
- 品牌定名「小飞侠」，logo（绿飞侠+天蓝字样）已入 `assets/brand/`，色彩令牌见 `assets/brand/BRAND.md`（近似值，待精确取色）。
- 产物：`docs/USER-RESEARCH.md` v0.1、`docs/SCENARIOS.md` v0.1（已标确认）。
- 下一步：SPEC v0.1 → demo HTML（prototypes/v0.1，含右侧 AI pane 状态稿）→ schema 设计草案（不冻结、不建库）。


## 2026-10-18 · 五类调研与需求增补

- 用户本轮授权：根据list调研患者规模、药物技术、可及性、患者Top5、公益/医疗机构，完善需求后开始。list采用现有V1–V11，未扩大疾病范围。
- 已完成：RESEARCH-2026-10-18及三条研究线；SPEC v0.2 R1–R8；USER-RESEARCH更新；第一批HTML探索稿。
- 已知继承：小飞侠品牌、P0/P1/P2及V10子页；没有重置确认。
- 新建议：V10提升P1；未确认，仍按原优先级记录。首屏生活支持入口是探索方案，不冒充冻结设计。
- 研究交叉检查发现4点并已入SPEC：登记/招募区分、生活支持保存产物、往返费用/陪护/误工字段、相似患者组织身份不合并。
- HTML：版本/hash及预览限制见PROTOTYPE-REVIEW；浏览器file访问安全策略拒绝，未绕过。没有原型用户签认；后续生产不启动。
- 当前未决：完整原型与实际预览；新增优先级；复杂遗传和筛查的专业审核。


## 2026-10-19 · Agent右侧面板修订

- 用户指出入口与右侧可拖动面板需求；继承AGENTS与20-AGENT-PANE-DESIGN模板。
- 检查发现HTML已有旧按钮/aside，但右栏grid没有消费宽度变量，拖动分界失效；现已建立设计记录并修正原型入口/分栏/ARIA/窄宽折叠。
- 目标仍为customFrame业务主区 + 最右侧host conversation；模拟内容明确标注。目标Desktop/Harness与原生API未核实，生产会话未接入。
- 详细验收状态：AGENT-PANE-DESIGN.md与UI-PARITY.md。浏览器安全策略曾阻止本地文件预览，本轮未实操截图或声称UI通过。

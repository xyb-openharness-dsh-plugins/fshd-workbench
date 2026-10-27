# 实施任务与当前交接

> 最近更新：2026-10-27。Git 已初始化并推送到 `origin/main`（私有，组织 `xyb-openharness-dsh-plugins`）。
> 版本：`VERSION=0.1.2`（package.json / manifest.json 三处一致，由 `npm run check` 校验）。
> G2 逐页签认**未做**，见 [G2-SIGNOFF.md](G2-SIGNOFF.md)；以下状态不默认签认。

## 研究 / 规格

| ID | 业务单元 | 证据 | 状态 |
| --- | --- | --- | --- |
| R01 | 规模/患者诉求/治疗技术/可及性/组织机构 | RESEARCH-2026-10-18.md + research/ | 桌面研究完成，缺口明列 |
| R02 | 需求映射/交叉检查 | SPEC §8；DESIGN-SESSION | 已补充，非临床审核/用户确认 |
| D01 | 数据合同/变化走查 | SCHEMA补充草案 | 未冻结、无库无迁移（G3 前不动） |

## 原型（prototypes/v0.1）

| ID | 业务单元 | 证据 | 状态 |
| --- | --- | --- | --- |
| P01 | 第一批可点击 HTML（12 页 + 一图秀 + 指标卡） | prototypes/v0.1；PROTOTYPE-REVIEW | 已编写，语法通过 |
| P02 | 完整一级/二级模块和关键状态 | PARITY.csv | 未完成 |
| P03 | 完整预览及用户版本/范围确认 | PROTOTYPE-REVIEW / G2-SIGNOFF | **未签认**，未获确认 |
| P04 | 一图秀动效/事件提示词落地 | prompts/TIMELINE-MOTION-AND-EVENTS.md；ONE-CHART-CONTRACT.md（权威） | 源码增强完成，C1–C12 部分通过 |
| P05 | 疾病概要 36 号 v2 补齐（指南可点 + 状态卡） | docs/DISEASE-PRIMER.md；scripts/probe-disease-primer.mjs | 探针 P1–P9 全过，业务未签认 |
| P06 | 指标卡对照 24 号修 6 处差距 | docs/METRIC-TREND-SPEC.md；DEVIATIONS.md | 2026-10-27 完成（MT01–MT15 待逐条填证） |

## 工程契约 / 发布

| ID | 业务单元 | 证据 | 状态 |
| --- | --- | --- | --- |
| E01 | 脚手架规范回灌（P1） | docs/21–25、32；prompts 增量；REVIEW-2026-10-21 | 2026-10-27 补入适用规范与缺失 prompts |
| E02 | 留痕与契约收尾（P3） | G2-SIGNOFF / TASKS / README / check 链 | 2026-10-27 完成 |
| E03 | lib/client.js 接入富原型 | assets/ui + dsh 静态路由 + iframe | 2026-10-27 进行中 |
| T01 | 生产接入/完整业务开发 | P03/D01 之后 | 未开始 |
| T02 | Desktop 打包/安装/实机验收 | release/*.tgz | 骨架已装（占位面板）；富原型待 E03 后重装 |
| T03 | 推送/发布/市场 | 需各自授权 | 私有，未公开发布 |

本轮不是 CLI/初始化器修改；`npm test` 跑 `scripts/probe-disease-primer.mjs`，`npm run check` 含版本同步与文案红线。交付与限制以 HANDOFF/ACCEPTANCE 为准。已有排序和品牌确认不重复申请。

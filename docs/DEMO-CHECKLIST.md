# DEMO-CHECKLIST · 小飞侠 FSHD 工作台原型一致性检查

适用：`prototypes/v0.1/`（index.html + style.css + app.js，研究快照版）。工艺依据：starter `docs/19-PROTOTYPE-CRAFT.md` §8 复刻验收清单，参照小肺宝 v4 / 小粉宝 v0.3 标尺。

## A. 工艺层（对照 craft §8）

- [x] 多列网格全部 `minmax(0,1fr)`（style.css `.grid`/`.grid-card`/`.kv`/`.workspace`）——页面级横向溢出防护。
- [x] 数字 `tabular-nums`（body 全局）。
- [x] 字号标尺对小肺宝 v4：base 14px（large 16px）、页 h1 21px（hero 23px）、卡 h2 13.5px / p 12px、note 11px、tag/pill 10.5px、表 12px、nav 12.5px。
- [x] 触达：主按钮 ≥36px、辅助 small ≥28px（原型层；生产层回到 44px 底线）。
- [x] `:focus-visible` 3px 绿色 outline + offset。
- [x] 动效三件套：页入 pageIn .34s / 画线 draw .85s（pathLength 归一）/ 翻卡 .5s cubic-bezier(.2,.7,.2,1)；`prefers-reduced-motion` 全降级且**折线恢复终态**（不留空白图）。
- [x] 翻面卡 = grid 叠层真 3D（`.flip`/`.flip-inner`/backface），固定 min-height，非展开插入；`aria-pressed` + aria-label 随状态换文案。
- [x] 空态有下一步（"与医生确认后再记录，不自动推算逾期"）。
- [x] 私密卡视觉另系（紫色系 `.card.private`），不与品牌绿混。
- [x] toast `role="status" aria-live="polite"`；切档案 toast 说明"发生了什么+什么没变"（craft §13：记录与收藏按档案隔离）。
- [x] AI 面板：状态稿明标"宿主模拟/非真实 DSH 会话"；冲突态文案"覆盖与发送均被阻止"；不伪装已接通。

## B. FSHD 业务红线（对照 SPEC v0.2 A 条）

- [x] 基因档案只抄录：D4Z4/单倍型/方法有原文位，无"严重程度"判读位（我的确诊页 note 明示）。
- [x] 研究线索注册节点与临床结果分列（trials 卡：stage 与 result 分开 + limit 可及性）；保留失败/停止管线（losmapimod、emugrobart）防旧招募页误导。
- [x] AI 工具解读定位为"待医生复核的线索"（我的确诊页 + OpenRare 卡 limit 明示"最终诊断由医生做出"）。
- [x] 家系/心理记录默认私密：私密卡 + "不进导出/AI 草稿"，导出函数过滤 private。
- [x] 无"建议治疗/等待治愈/治愈率"表述；"无药不等于没有照护"用中性句式。
- [x] 资源卡带来源性质与核对日（2026-10-18），未核实项有"未核实/待确认"标注。
- [x] 版本号 0.1.0 在顶栏 pill 常驻；页脚带免责。

## C. 三组模拟档案（走查矩阵）

| 档案 | 覆盖病程 | 必看点 |
| --- | --- | --- |
| 林晓飞（34 · 进展期） | 误诊 4 年→确诊→AFO→慢特病申请 | 确诊时间线 3 节点、CK 3 点曲线+泳道 3 事件、翻卡"较上次" |
| 周航（22 · 确诊期） | 刚确诊、基线筛查未做 | 筛查空态文案、CK 2 点、收藏→复诊导出 |
| 陈静（41 · 轻症） | 家系已知、照护者视角 | 家系两条（私密卡）、CK 4 点、呼吸复查到期 |

切档路径：顶栏档案按钮 → 选档案 → toast 确认；记录/收藏隔离验证：A 档案记录后切 B 再切回，记录仍在 A。

## D. 已知未完成（不得标"已确认"）

- [ ] 报告导入/解析三态、生产存储、Desktop 实机 AI 面板（全部未接通，界面如实显示）。
- [ ] 完整子页（学业就业、出行无障碍清单、遗传沟通材料生成器）。
- [ ] 用户对原型的逐页签认（G2 闸口）。

最近一轮检查：2026-10-18（本轮改版后：node --check 通过、标签配平通过、grep 抽查通过）。

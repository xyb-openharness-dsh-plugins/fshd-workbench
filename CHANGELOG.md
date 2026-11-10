## 0.1.6（2026-11-11，AI 对话面板激活修复）

- 会话判定改用宿主归属 `ownedSession()`（`ownsSession(currentSession())`），不再用 `Boolean(conversation)`（customFrame 下没会话也会传隐藏容器 → 判断恒为真 → 点了没反应）。
- 创建路径改 `service.newSession(workspaceId)`，工作区取 `service.defaultWorkspace?.()?.workspaceId`；无可用工作区时由宿主提示选目录；不再用 `ensureSession({})`。
- 取消目录选择不留空会话并提示可重试；创建失败在工作台内显示原因；订阅会话变化触发重渲染；草稿仍只填不发。
- 版本与生成物同步 0.1.6；新增 `scripts/check-agent-pane-contract.mjs` 入 check 链。
- **界面加载与真机点击待人工**（需退出重开 DSH Desktop 后新建会话走查）。

# Changelog · 小飞侠 FSHD 工作台

版本唯一来源为仓库根 `VERSION`；`package.json` / `manifest.json` / 原型 `app.js` 中的版本号须与之对齐。

## 0.1.2 (2026-10-27)

- **36 号 v2 补齐（指南可点+状态卡）**：`probe-disease-primer.mjs` 实测 9/9 PASS；浮窗四段顺序 definition → evidence → landscape → trend。`primer.js` / `primer.css` 与 starter 最新 `assets/patterns/disease-primer.js/.css` 复核为 SAME（已支持指南链接），未覆盖。
- **指南链接（§2.5 硬约束）**：evidence 表「原件」列 3 行全部结构化，不再有纯文字。
  - AAN / AANEM 2015 指南 → AAN 官方指南页（`GuidelineDetail/701`，OK）；
  - 国家卫生健康委《罕见病诊疗指南（2019年版）》第 98 章「进行性肌营养不良」→ 卫健委官网通知页（OK；附件 PDF 784 页已下载核对，该章列出 FSHD1 / FSHD2 及 Southern blot / OGM 检测口径）；
  - GeneReviews → NCBI Bookshelf 直连返回人机验证（CHALLENGE），无可验活替代页，标 `nolink: true` + `note`，不编 URL。
- **链接验活**：10 条链接引用（5 个唯一 URL：AAN 官方页、卫健委通知页、3 个 ClinicalTrials.gov 登记页）逐条用 `verify-links.mjs` 实测 OK；5 处 GeneReviews `nolink`（均有 note）。此前写入的 Neurology 原文页（403）与 NCBI Bookshelf（CHALLENGE）不计可达，已替换 / 降级。
- **检查器**：新增 `scripts/check-primer-links.mjs`（L1–L6，15 项断言全过），并入 `npm run check`。
- **版本号**：`VERSION` / `package.json` / `prototypes/v0.1/manifest.json` / 原型 `app.js` / `index.html` 同步至 0.1.2；manifest 快照哈希按当前 `index.html` / `style.css` / `app.js` 重算。
- **看板状态卡（§2.6 四件）**：本仓无 D+N 治疗锚点（FSHD 无移植 / 诱导类 Day 0），按规范做「待初始化」兜底，不造临床锚点、不改数据模型：看板首卡卡头 eyebrow「状态卡 · 待初始化」／大字「待初始化」（28px，天数不手填）／现状行「尚无锚点日；完成三步初始化后自动派生」+ 三步说明／出口按钮排（主「开始三步初始化 →」进设置页，副「疾病概要：FSHD 是什么？」打开现有浮窗）。

## 0.1.1 (2026-10-21)

- **品牌落地**：弃用占位名「小翼宝 ScapPal」，生产入口（`lib/client.js` 的 `metadata.title` 与 DSH 注册 `title`）统一为「小飞侠 FSHD 工作台」。
- **版本号统一**：新增根 `VERSION = 0.1.1` 作为唯一来源；`package.json`、`prototypes/v0.1/manifest.json`、原型 `app.js` 三处对齐（此前 package.json 落后为 0.1.0）。
- **许可证**：`package.json` 的 `license` 由 `UNLICENSED` 改为 `MIT`，与仓库 `LICENSE` 文件一致（用户已定 MIT）。
- **仓库地址**：`package.json` 的 `repository.url` 与 DSH 注册的 `repository` 统一为 `https://github.com/xyb-openharness-dsh-plugins/fshd-workbench`（此前误写为 `xyb-community` 组织）。
- **原型迭代（含于本版本）**：3 组 6 个月模拟数据、一图秀动态曲线与末点标签、顶栏三段式 + AI 五态、字号三档可配、密度与导航优化（详见 `prototypes/v0.1`）。

## 0.1.0 (2026-10-18)

- 基于 `xyb-workbench-starter` 初始化项目骨架；MIT 私有仓库；DSH `customFrame` 接入骨架（健康接口、版本展示、标准/大字切换）。
- 完成需求调研、BRAND 品牌定义（小飞侠）、SPEC/BRIEF 草稿与第一批 HTML 交互探索稿。

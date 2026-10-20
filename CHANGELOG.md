# Changelog · 小飞侠 FSHD 工作台

版本唯一来源为仓库根 `VERSION`；`package.json` / `manifest.json` / 原型 `app.js` 中的版本号须与之对齐。

## 0.1.1 (2026-10-21)

- **品牌落地**：弃用占位名「小翼宝 ScapPal」，生产入口（`lib/client.js` 的 `metadata.title` 与 DSH 注册 `title`）统一为「小飞侠 FSHD 工作台」。
- **版本号统一**：新增根 `VERSION = 0.1.1` 作为唯一来源；`package.json`、`prototypes/v0.1/manifest.json`、原型 `app.js` 三处对齐（此前 package.json 落后为 0.1.0）。
- **许可证**：`package.json` 的 `license` 由 `UNLICENSED` 改为 `MIT`，与仓库 `LICENSE` 文件一致（用户已定 MIT）。
- **仓库地址**：`package.json` 的 `repository.url` 与 DSH 注册的 `repository` 统一为 `https://github.com/xyb-openharness-dsh-plugins/fshd-workbench`（此前误写为 `xyb-community` 组织）。
- **原型迭代（含于本版本）**：3 组 6 个月模拟数据、一图秀动态曲线与末点标签、顶栏三段式 + AI 五态、字号三档可配、密度与导航优化（详见 `prototypes/v0.1`）。

## 0.1.0 (2026-10-18)

- 基于 `xyb-workbench-starter` 初始化项目骨架；MIT 私有仓库；DSH `customFrame` 接入骨架（健康接口、版本展示、标准/大字切换）。
- 完成需求调研、BRAND 品牌定义（小飞侠）、SPEC/BRIEF 草稿与第一批 HTML 交互探索稿。

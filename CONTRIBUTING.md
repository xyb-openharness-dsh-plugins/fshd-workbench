# 贡献指南 · 小飞侠 · fshd-workbench

> 立场先行：本项目只做**信息整理与就诊准备**，不做诊断、不做治疗建议、不替代临床判断。
> FSHD（面肩肱型肌营养不良症）目前无获批的延缓疾病进展药物——工作台聚焦**生活、照顾、并发症预防**，不写"等待治愈"叙事。
> 组织级总指南见 <https://github.com/xyb-openharness-dsh-plugins/.github/blob/main/profile/README.md>，病种路线图与认领见 <https://github.com/xyb-openharness-dsh-plugins/.github/blob/main/ROADMAP.md>。

## 快速开始

```bash
npm install
npm run check   # 检查链建立后，提交前必须通过
```

## 提交流程

1. 从 `main` 切出分支：`feat/xxx`、`fix/xxx`、`docs/xxx`。
2. 完成改动并自测；检查链建立后 `npm run check` 全绿（版本同步、结构/语法、文案红线、密钥扫描、单测、版本一致性）。
3. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：`feat: / fix: / docs: / chore: / test:`。
4. 发起 Pull Request（模板见 `.github/PULL_REQUEST_TEMPLATE.md`），至少一名维护者评审后合入。

## 项目红线（提交前自查）

- **文案红线**：不得出现「建议治疗」「可以停药」「无需就医」「治愈率」「即将上市」「等待治愈」「放弃希望」等表述；免责语句只能出现在否定语境。检查链会拦截，不要用注释绕过。
- **基因信息只抄录不判读**：D4Z4 重复数、单倍型、检测方法只存原文与数值位；任何"严重程度/外显预测"不得成为界面文案或数据字段。
- **研究线索不是治疗承诺**：注册节点（IND/获批临床）与临床结果（已公布数据）必须分列；无公开疗效数据时明写"目前无公开临床疗效数据"。
- **医疗内容**：新增医学相关文案必须标注来源；未核实项明确标注「未核实」。
- **隐私优先**：本机优先架构，任何改动不得把用户数据上传到远端；家系与心理记录默认私密（fail-closed）；不提交患者可识别信息、截图、真实病历；不提交任何密钥（`.secrets/` 已 gitignore）。
- **测试**：新增功能带单测；测试一律用内存库，不依赖固定路径。

## 数据层与版本（本项目特有）

- 当前 `schema/draft/0001_initial.sql` 为**草案，未冻结**；G3 闸口通过后冻结 sha256 并纳入 check-schema。冻结后**只能新增迁移**，修改历史迁移会被拦截。
- 版本唯一来源是仓库根 `VERSION`；页面顶栏 / 页脚 / 关于三处同源渲染，禁止手写第二份。

## 需要帮忙？

在 [Issues](https://github.com/xyb-openharness-dsh-plugins/fshd-workbench/issues) 提问即可，维护者会尽快回复。

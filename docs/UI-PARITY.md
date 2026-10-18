# 原生 Agent 面板 UI Parity · 小飞侠

依据：`docs/AGENT-PANE-DESIGN.md` §5、`prompts/DSH-AGENT-PANE-INTEGRATION.md`。当前源代码里有原型按钮、aside和分隔线事件；按钮与模拟元素的存在不能证明布局有效或原生会话接通。

| ID | 控件/行为 | 原型DOM/CSS/JS | 缺口 | 目标 | 验证 |
|---|---|---|---|---|---|
| AP01 | 顶栏AI助手入口 | `index.html #ai` / `app.js aiToggle` | 文案弱、无明确图标及ARIA展开同步 | 明确AI助手入口与状态 | 键盘/读屏与点击 |
| AP02 | 右侧原生会话列 | `#pane` | 是模拟说明区，无宿主conversation节点 | `customFrame`业务中区+原生最右侧区 | 目标Desktop真实会话 |
| AP03 | splitter | `#split`; `setWidth()` | CSS三列grid轨道现读取JS宽度变量 | 35%初始，25%–45%受限，指针/键盘同步 | 宽度计算与ARIA边界 |
| AP04 | 收起/重开 | `#hideAI`, `#ai` | ResizeObserver按shell宽度收起；ARIA同步 | 容器级行为，入口常驻，业务状态保留 | 收起重开状态对照 |
| AP05 | 连接/失败/草稿冲突 | `#aiState` / `#aiNote` | 仅静态模拟，无真实连接 | 如实报宿主状态，不覆盖草稿 | 模拟状态走查+实机 |
| AP06 | 620/760响应 | `style.css` viewport media | JS测量shell容器；低于620折叠 | 对照面板合同的容器断点 | 嵌套窄容器测量 |
| AP07 | 来源草稿及隐私 | 当前尚无带入动作 | 未接宿主草稿/冲突API | 默认不带私密/未核实材料，显式预览 | owner/API确认后验收 |

所有条目当前未进行本地浏览器实操；状态不写“通过”。真实API和Desktop版本未核实，不做猜测式接入。

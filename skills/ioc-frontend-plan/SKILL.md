---
name: ioc-frontend-plan
description: Use when an Angular project already has ioc-spec and/or ioc-sketch-decode outputs and needs a concise frontend implementation plan plus a testability map before task breakdown or coding.
---

# 前端方案设计

## 概述

这个 skill 面向 Angular 项目，消费上游 IOC 产物，输出两份前端落地文档：

| 产出 | 回答的问题 |
| --- | --- |
| `Frontend-Plan.md` | 前端怎么拆、复用什么、哪些地方要审批、怎么分任务 |
| `Testability-Map.md` | 测试该如何稳定定位元素、指标和展示位如何对应 |

它不生成代码，只生成可直接指导拆 task、评审和编码的方案文档。

## 单一真源

以下规则只在一个文件里定义，其他文件只引用，不重复发明：

| 主题 | 单一真源 |
| --- | --- |
| 组件盘点、证据等级、审批矩阵 | [references/component-inventory-rules.md](references/component-inventory-rules.md) |
| `data-automation-id`、Key 模型、动态元素规则 | [references/automation-id-convention.md](references/automation-id-convention.md) |
| `Frontend-Plan.md` 结构 | [references/frontend-plan-template.md](references/frontend-plan-template.md) |
| `Testability-Map.md` 结构 | [references/testability-map-template.md](references/testability-map-template.md) |

## 输入矩阵

推荐输入是 `Spec.md + Sketch-Decode.md + Display-Contract.md`。如果输入不完整，按下表降级：

| Spec.md | Sketch-Decode.md | Display-Contract.md | 输出级别 | 处理方式 |
| --- | --- | --- | --- | --- |
| ✓ | ✓ | ✓ | 完整 | 正常输出两份文档 |
| ✓ | ✓ | ✗ | 降级 A | 可出前端方案；测试映射不做指标级闭环 |
| ✓ | ✗ | 任意 | 降级 B | 仅按功能模块拆分；不做布局级组件树 |
| ✗ | ✓ | 任意 | 降级 C | 仅按视觉结构推导；FR 溯源精度下降 |
| ✗ | ✗ | 任意 | 阻断 | 提示先运行 `ioc-spec` 或 `ioc-sketch-decode` |

## 交互规范

遵守 [Skill-User 交互黄金原则](../../PRINCIPLES.md)。

| Phase | 用户可见内容 | 结束方式 |
| --- | --- | --- |
| 0 — 输入装载 | 内联进 Phase 1（P6） | — |
| 1 — 组件盘点 | 组件清单 + 审批矩阵 | 确认门（P4） |
| 2 — 架构拆解 | 结构决策 + 组件树 + 模块划分 | 确认门（P4） |
| 3 — 前端澄清 | 批量问题 | 等待回答（P7） |
| 4 — 方案生成 | `Frontend-Plan.md` 预览 | 确认门（P4） |
| 5 — 可测试性生成 | `Testability-Map.md` 预览 | 确认门（P4） |
| 最终 | 三行索引 | — |

## 硬门禁

1. **核心输入至少有一个。** `Spec.md` 与 `Sketch-Decode.md` 不能同时缺失。
2. **只面向 Angular。** 不使用 React/Vue 的术语和实践。
3. **显示名与技术名分离。** 页面文案/区域名沿用上游文档；技术命名和测试命名使用 Key 模型，不混写。
4. **组件分类只认盘点规则。** `复用 / 扩展 / 新增` 的判定与审批只以 [references/component-inventory-rules.md](references/component-inventory-rules.md) 为准。
5. **测试命名只认命名规范。** `data-automation-id` 的格式、动态元素和选择器只以 [references/automation-id-convention.md](references/automation-id-convention.md) 为准。
6. **未审批的扩展/新增方案不得被表述为“可直接编码”。** 允许写入文档，但必须显式标记 `[待确认:需开发者审批]`。

## 何时使用

适用场景：

- 已有 `ioc-spec` / `ioc-sketch-decode` / `ioc-data-plan` 的产物，需要形成 Angular 前端方案
- 需要判断哪些组件能复用、哪些组件要扩展、哪些组件要新建
- 需要在编码前产出稳定的测试定位方案

不适用场景：

- 需要直接生成前端代码
- 非 Angular 项目
- 还没有任何需求规格或视觉输入

## 工作流

### Phase 0 — 输入装载

读取输入并探测项目上下文。此阶段不单独输出，结论内联进 Phase 1。

动作：

1. 读取上游文档：
   - `Spec.md`：提取 FR、范围、角色、约束
   - `Acceptance.md`：提取 GWT 场景和异常路径
   - `Sketch-Decode.md`：提取布局 DSL、组件识别、交互与状态
   - `Display-Contract.md`：提取展示位-指标映射、数据新鲜度等级（刷新策略、空态/异常展示由本 skill 的 Frontend-Plan.md 自行定义）
   - `Data-Dev.md` / `Mock-Spec.md`：作为辅助输入，缺失不阻断
2. 扫描 Angular 项目：
   - 组件模式：standalone 或 NgModule
   - 状态管理：Signal / RxJS / Store / 其他
   - UI 与图表库
   - 路由和目录组织
3. 扫描存量组件：
   - 规则见 [references/component-inventory-rules.md](references/component-inventory-rules.md)
   - 产出内部索引，供 Phase 1 使用

### Phase 1 — 组件盘点

把“页面需要什么组件”与“项目已有多少组件”做交叉比对。

动作：

1. 从 `Sketch-Decode.md` 和 `Spec.md` 提取组件需求项。
2. 按证据等级匹配存量组件。
3. 归类为 `复用 / 扩展 / 新增`。
4. 输出组件清单与审批矩阵。

标准表头：

```markdown
| C-ID | 页面区域 | 组件需求 | 候选组件 | 路径 | 分类 | 证据 | 审批状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C-1 | kpi "今日工单" | 数值卡片 | KpiCardComponent | libs/shared-ui/src/lib/kpi-card/ | 复用 | B | 不需要 |
| C-2 | chart.line "工单趋势" | 双折线趋势图 | LineChartComponent | libs/shared-ui/src/lib/line-chart/ | 扩展 | B | 待确认 |
| C-3 | chart.map "全国节点" | 状态地图 | - | -（新建） | 新增 | C | 待确认 |
```

确认门：

```markdown
---
**[Phase 1 确认门]** 以上是组件清单和审批矩阵。
→ 请确认继续 / 或指出需要修改的地方。
---
```

### Phase 2 — 架构拆解

基于已盘点的组件，产出前端结构决策。

动作：

1. **确认结构层次**——输出一张决策表，明确项目是否需要每一层：

| 层 | 是否采用 | 职责 | 判断依据 |
| --- | --- | --- | --- |
| 路由/页面层 | 是 | 页面入口、路由守卫 | 有独立路由 |
| Facade / ViewModel | 是/否 | 聚合页面数据、编排状态 | 页面数据源 ≥ 2 或有跨组件状态 |
| 容器组件 | 是 | 注入 Service / Facade，向下分发数据 | 子组件 ≥ 2 |
| 展示组件 | 是 | 纯 @Input/@Output，无注入 | 所有叶子节点 |
| 共享组件 | 是 | 来自公共库的复用组件 | Phase 1 已标注 `[复用]` |

2. **生成组件树**——用缩进表示 Angular 模板嵌套，每个节点标注角色和来源：

```text
page "运维监控大屏"
  route "/ops-dashboard" (lazy)
    facade DashboardFacade [页面级]
    container <app-dashboard-page> [新增]
      container <app-kpi-section> [新增]
        shared <app-kpi-card> [复用:C-1] ← DashboardFacade.kpis
        shared <app-kpi-card> [复用:C-1]
      container <app-chart-section> [新增]
        shared <app-line-chart> [扩展:C-2] ← DashboardFacade.trend
        presentational <app-pie-chart> [新增:C-4]
      container <app-alert-section> [新增]
        presentational <app-alert-table> [新增:C-5] ← DashboardFacade.alerts
```

3. **产出模块/路由清单**——标注每个路由入口的加载方式和守卫。

确认门：

```markdown
---
**[Phase 2 确认门]** 以上是结构层次决策和组件树。
→ 请确认继续 / 或指出需要修改的地方。
---
```

### Phase 3 — 前端澄清

Phase 1 已解决"组件从哪来"，Phase 2 已解决"结构怎么拆"。Phase 3 只处理前两步无法收敛的技术不确定项。不得重复 Phase 1 的审批和 Phase 2 的结构决策。

只提真正影响 Phase 4 产出的问题，典型维度：

| 维度 | 典型问题 | 前提 |
| --- | --- | --- |
| 状态管理 | 筛选条件是否需要跨页面持久化 | Phase 2 已确认有 Facade |
| API 对接 | 是否有统一 HTTP 拦截器和错误处理 | 涉及 Service 设计 |
| 扩展兼容性 | C-2 增加多序列输入后是否影响已有页面 | Phase 1 标注"扩展" |
| 图表库 | 是否必须使用指定图表库 | 影响组件实现路径 |
| 测试约束 | 项目是否已有 `data-automation-id` 约定 | 影响 Phase 5 产出 |

禁止重复的问题：

- 不问"是否需要 Facade"——Phase 2 已决策
- 不问"新组件放共享库还是页面内"——Phase 1 审批矩阵已要求回答

提问格式遵守 P7，一轮只输出一张表。

### Phase 4 — 方案生成

生成 `docs/<需求名>/Frontend-Plan.md`。

核心要求：

- 组件清单必须带审批状态
- 架构必须体现 Angular 的层次边界
- Task 必须可执行，而不是泛泛而谈
- 未审批项可以存在，但不得被表述为“已确认实现路径”

模板见 [references/frontend-plan-template.md](references/frontend-plan-template.md)。

确认门：

```markdown
---
**[Phase 4 确认门]** 以上是前端方案设计。
→ 请确认继续 / 或指出需要修改的地方。
---
```

### Phase 5 — 可测试性生成

生成 `docs/<需求名>/Testability-Map.md`。

核心要求：

- 先定义 Key，再定义 `Slot-ID`
- `Metric-ID -> Slot-ID` 是 `1:N`
- `Slot-ID -> 主选择器` 是 `1:1`
- GWT 场景要映射到稳定展示位，而不是脆弱 DOM 结构
- 动态列表优先使用业务键，不优先使用索引

模板见 [references/testability-map-template.md](references/testability-map-template.md)。

确认门：

```markdown
---
**[Phase 5 确认门]** 以上是可测试性对照表。
→ 请确认继续 / 或指出覆盖缺口。
---
```

## 退出门禁

### 文档完成

- 有 `Frontend-Plan.md`
- 有 `Testability-Map.md`
- 组件清单、结构决策、测试映射三者可互相追溯

### 可直接编码

- 所有 `扩展 / 新增` 组件已有明确审批结论
- Task 切片没有阻断项遗漏
- 关键场景已有稳定 `Slot-ID` 和主选择器

## 降级模式

| 情况 | 允许输出 | 明确限制 |
| --- | --- | --- |
| 无 `Display-Contract.md` | 可出前端方案，可出基础测试映射 | 不做指标闭环，只做展示位与场景映射 |
| 无 `Sketch-Decode.md` | 可按功能模块出方案 | 不做布局级 region 拆分 |
| 无 `Spec.md` | 可按视觉结构出方案 | FR 溯源精度下降 |
| 无项目代码 | 可出文档方案 | 组件复用结论降级为候选结论 |

## 工件管理

| 工件 | 路径 |
| --- | --- |
| `Spec.md` | `docs/<需求名>/Spec.md` |
| `Acceptance.md` | `docs/<需求名>/Acceptance.md` |
| `Sketch-Decode.md` | `docs/<需求名>/Sketch-Decode.md` |
| `Display-Contract.md` | `docs/<需求名>/Display-Contract.md` |
| `Frontend-Plan.md` | `docs/<需求名>/Frontend-Plan.md` |
| `Testability-Map.md` | `docs/<需求名>/Testability-Map.md` |

## 与下游的衔接

```text
ioc-sketch-decode → ioc-spec → ioc-data-plan → ioc-frontend-plan → 拆 task / 编码 / 自动化测试
```

## 最终输出

```text
✓ ioc-frontend-plan 完成
产出：docs/<需求名>/Frontend-Plan.md, docs/<需求名>/Testability-Map.md
下一步：<给出一条具体指令>
```

# Frontend-Plan.md 模板

以下是 `Frontend-Plan.md` 的标准结构。所有章节必须保留；无内容时写“不适用”，不要静默省略。

---

```markdown
# 前端方案设计: <需求名>

> 由 ioc-frontend-plan 生成 | <日期>
> 技术栈: Angular

## 摘要

<!-- 1-2 句话说明这份方案解决什么问题，以及本次采用的主结构。 -->

## 技术上下文

| 项 | 结论 | 来源 |
| --- | --- | --- |
| Angular 版本 | ... | package.json / workspace |
| 组件模式 | standalone / NgModule | 项目代码 |
| 状态管理 | Signal / RxJS / Store / ... | 项目代码 |
| UI 组件库 | Angular Material / NG-ZORRO / ... | 项目代码 |
| 图表库 | ECharts / ... | 项目代码 |
| 测试栈 | Cypress / Playwright / ... | 项目代码 |
| 关键约束 | ... | 用户确认 / 现有代码 |

## 决策与审批

<!-- 把真正影响编码路径的事项集中写在这里。 -->

| 事项 | 状态 | 是否阻断编码 | 结论 |
| --- | --- | --- | --- |
| 扩展 C-2 | 已确认 / 待确认 | 是 | ... |
| 新增 C-3 | 已确认 / 待确认 | 是 | ... |
| 状态管理方案 | 已确认 / 工作假设 | 否 | ... |

## 组件清单

| C-ID | DisplayName | TechnicalKey | 分类 | 候选/来源 | 路径 | 审批状态 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C-1 | kpi "今日工单" | today-orders-card | 复用 | KpiCardComponent | libs/shared-ui/src/lib/kpi-card/ | 不需要 | ... |
| C-2 | chart.line "工单趋势" | order-trend-chart | 扩展 | LineChartComponent | libs/shared-ui/src/lib/line-chart/ | 已确认 / 待确认 | ... |
| C-3 | chart.map "全国节点" | node-map | 新增 | - | -（新建） | 已确认 / 待确认 | ... |

## 结构决策

<!-- 借鉴 spec-kit 的 plan 风格：先写“结构决策”，再写细节。 -->

| 层 | 是否采用 | 职责 |
| --- | --- | --- |
| 路由/页面层 | 是 | 页面入口、路由装配 |
| Facade / ViewModel | 是 / 否 | 聚合页面数据、协调状态 |
| 容器组件 | 是 | 连接 Facade 与展示组件 |
| 展示组件 | 是 | 纯展示、尽量无业务副作用 |
| 共享组件 | 是 | 跨页面复用的 UI 单元 |

**结构决策说明**

- ...

## 组件树

<!-- 缩进表示模板层级；每个节点写清角色和依赖。 -->

page "<页面名>"
  route "<route-path>"
    facade "<FacadeName>" [页面级]
    container "<PageContainer>" <app-page>
      presentational "<HeaderBlock>" <app-header>
      container "<KpiSection>" <app-kpi-section>
        shared "<KpiCardComponent>" <app-kpi-card> [复用:C-1]
      container "<TrendSection>" <app-trend-section>
        shared "<LineChartComponent>" <app-line-chart> [扩展:C-2]

## 模块与路由

| 模块/入口 | 包含内容 | 加载方式 | 守卫/限制 |
| --- | --- | --- | --- |
| ... | ... | lazy / eager | ... |

## Facade / Service / State

### Facade / ViewModel

| 名称 | 作用域 | 职责 | 依赖 |
| --- | --- | --- | --- |
| DashboardFacade | 页面级 | 聚合页面数据与状态 | DashboardService, FiltersStore |

### Service

| 名称 | Provider Scope | 职责 | 返回模型 |
| --- | --- | --- | --- |
| DashboardService | root / route / component | 获取页面数据 | Observable<DashboardVm> |

### 状态

| 状态 | 所属层 | 生命周期 | 写入方 | 读取方 |
| --- | --- | --- | --- | --- |
| filters | Facade | 页面级 | FilterBar | Facade, TableSection |

## 数据流

| 来源 | 目标 | 机制 | 说明 |
| --- | --- | --- | --- |
| DashboardService | DashboardFacade | Observable / Signal | 原始数据获取 |
| DashboardFacade | KpiSection | input() / @Input | 传递展示模型 |
| FilterBar | DashboardFacade | output() / @Output | 派发筛选变更 |

## 扩展与新增明细

### 扩展组件

| C-ID | 组件 | 改动点 | 兼容性影响 | 回归范围 |
| --- | --- | --- | --- | --- |
| C-2 | LineChartComponent | 新增多序列输入 | ... | ... |

### 新增组件

| C-ID | 组件 | 归属 | 核心接口 | 备注 |
| --- | --- | --- | --- | --- |
| C-3 | NodeMapComponent | 页面内 / 共享 | `nodes`, `highlightedNode` | ... |

## 数据刷新与空态策略

<!-- 定义各展示位的刷新机制和异常展示。 -->
<!-- 新鲜度等级来自 Display-Contract.md，刷新机制和空态展示由本文档定义。 -->

| 展示位分组 | 新鲜度等级 | 刷新机制 | 空态展示 | 错误展示 | 对应 AC |
| --- | --- | --- | --- | --- | --- |
| KPI 区域 | 准实时 | 定时轮询 N 秒 / WebSocket / Signal | 显示"--" | 显示上次值 + 失败提示 | AC-N 场景 N.M |
| 图表区域 | 定时 | 页面加载 + 手动刷新 | 空态占位图 | 错误提示 + 重试按钮 | ... |
| 表格区域 | 定时 | 页面加载 + 分页触发 | "暂无数据" | 错误提示 | ... |

## 约束与假设

- ...

## Task 切片

<!-- 任务要能直接进入实现。 -->

| T-ID | 切片 | DependsOn | DoD | Verify | Risk | ApprovalNeeded |
| --- | --- | --- | --- | --- | --- | --- |
| T-1 | 页面路由与骨架 | - | 路由可进入、骨架渲染成功 | 手工打开页面 | 低 | 否 |
| T-2 | 扩展 C-2 | - | 新增输入生效且不影响旧调用方 | 回归旧页面 + 新页面演示 | 中 | 是 |
| T-3 | 页面 Facade | T-1 | 页面状态可聚合 | 单测 / 手工验证 | 中 | 否 |
| T-4 | KPI 区域接入 | T-1, T-3 | KPI 正常展示 | 对照 Mock 数据检查 | 低 | 否 |

## 交付检查

- [ ] 组件清单、组件树、Task 切片使用相同的 `C-ID`
- [ ] 所有 `扩展 / 新增` 项都有审批状态
- [ ] 所有阻断项都出现在“决策与审批”章节
- [ ] 结构边界清楚，不把业务逻辑塞进共享组件
- [ ] Task 具备 `DoD` 和 `Verify`
```

---

## 写作规范

1. **先决策，后细节。** 先写“技术上下文”和“结构决策”，再写组件树与任务切片。
2. **显示名与技术名分离。** `DisplayName` 沿用上游文案，`TechnicalKey` 用于内部命名；两者不要混写。
3. **Angular 边界明确。** 明确路由层、Facade / ViewModel、容器组件、展示组件、共享组件的职责边界。
4. **审批集中可扫读。** 所有阻断编码的事项都必须出现在“决策与审批”里。
5. **任务必须可执行。** 每个任务至少写清 `DependsOn / DoD / Verify`。
6. **不写实现代码。** 只写到结构、接口、边界和验证粒度。

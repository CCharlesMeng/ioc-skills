# Testability-Map.md 模板

以下是 `Testability-Map.md` 的标准结构。所有章节必须保留；无内容时写“不适用”，不要静默省略。

命名真源见 [automation-id-convention.md](automation-id-convention.md)。

---

```markdown
# 可测试性对照表: <需求名>

> 由 ioc-frontend-plan 生成 | <日期>
> 命名真源: references/automation-id-convention.md

## Key 总览

| Key | 值 | 来源 |
| --- | --- | --- |
| PageKey | ... | 页面定义 |
| RegionKey | ... | 布局区域 |
| ComponentKey | ... | 组件清单 |

## Slot 树

<!-- 这里写“展示位”，不是写 DOM 结构。 -->

page "<页面名>"                      → <PageKey>
  region "<区域名>"                 → <PageKey>--<RegionKey>
    component "<组件名>"            → <PageKey>--<RegionKey>--<ComponentKey>
      slot "<展示位A>"              → <PageKey>--<RegionKey>--<ComponentKey>--<SlotKey>
      slot "<展示位B>"              → <PageKey>--<RegionKey>--<ComponentKey>--<SlotKey>

## Metric 映射

<!-- 如果上游没有稳定编号，这里补一个临时 Metric-ID（M-1, M-2...）。 -->
<!-- 一个 Metric-ID 可以映射多个 Slot-ID；一个 Slot-ID 只能有一个主选择器。 -->

| Metric-ID | 指标来源 | Slot-ID | 主选择器 | 展示类型 | 备注 |
| --- | --- | --- | --- | --- | --- |
| M-1 | 当日工单总数 | dashboard--kpi-area--today-orders--value | `[data-automation-id="dashboard--kpi-area--today-orders--value"]` | 数值 | 主展示位 |
| M-1 | 当日工单总数 | dashboard--summary-table--row-wo-2024-0031--count | `[data-automation-id="dashboard--summary-table--row-wo-2024-0031--count"]` | 表格列 | 次展示位 |
| M-2 | 同比增长率 | dashboard--kpi-area--today-orders--trend | `[data-automation-id="dashboard--kpi-area--today-orders--trend"]` | 趋势 | ... |

## 场景映射

<!-- 这里把 Acceptance.md 的步骤映射到展示位。 -->

| AC | 场景 | 步骤 | Slot-ID | 主选择器 | 动作/断言 | 断言类型 |
| --- | --- | --- | --- | --- | --- | --- |
| AC-1 | 1.1 正向 | When | orders--header--create-order--trigger | `[data-automation-id="orders--header--create-order--trigger"]` | click | 操作 |
| AC-1 | 1.1 正向 | Then | orders--list--row-wo-2024-0031--status | `[data-automation-id="orders--list--row-wo-2024-0031--status"]` | assert | text |
| AC-1 | 1.2 异常 | Then | orders--form--submit-result--error | `[data-automation-id="orders--form--submit-result--error"]` | assert | visible |

## 空态与异常

| 场景 | Slot-ID | 主选择器 | 断言类型 | 来源 |
| --- | --- | --- | --- | --- |
| 数据为空 | dashboard--kpi-area--today-orders--empty | `[data-automation-id="dashboard--kpi-area--today-orders--empty"]` | visible / text | Display-Contract |
| 加载中 | dashboard--chart-area--order-trend--loading | `[data-automation-id="dashboard--chart-area--order-trend--loading"]` | visible | 方案约定 |
| 接口失败 | dashboard--global-feedback--request-error | `[data-automation-id="dashboard--global-feedback--request-error"]` | visible / text | Acceptance |

## 覆盖矩阵

### FR 覆盖

| FR | 关联 Slot-ID 数量 | 覆盖状态 | 缺口 |
| --- | --- | --- | --- |
| FR-1 | 3 | 完整 | - |
| FR-2 | 1 | 部分 | 缺少异常展示位 |

### AC 覆盖

| AC | When 覆盖 | Then 覆盖 | 覆盖状态 | 缺口 |
| --- | --- | --- | --- | --- |
| AC-1 | 1/1 | 2/2 | 完整 | - |
| AC-2 | 2/2 | 1/2 | 部分 | 缺少错误态断言 |

## 交付检查

- [ ] 所有命名都遵循 automation-id-convention.md
- [ ] 一个 Slot-ID 只有一个主选择器
- [ ] 动态列表优先使用业务键，不优先使用索引
- [ ] 所有关键 GWT 步骤都能落到 Slot-ID
- [ ] 所有关键指标至少落到一个 Slot-ID
```

---

## 写作规范

1. **以展示位为中心。** 先定义 `Slot-ID`，再定义选择器；不要直接围绕 DOM 结构写文档。
2. **映射关系明确。** `Metric-ID -> Slot-ID` 允许 `1:N`；`Slot-ID -> 主选择器` 必须 `1:1`。
3. **断言类型要写清。** 至少区分 `text / value / visible / state / count / action`。
4. **动态元素优先业务键。** 只有没有业务键时，才允许退化为索引，并显式标注风险。
5. **覆盖矩阵不放水。** 缺口必须写出来，不允许默认“已覆盖”。

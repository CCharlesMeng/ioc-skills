# data-automation-id 命名规范

这是 `ioc-frontend-plan` 中 `data-automation-id` 的唯一真源。其他文件只引用，不重复定义。

---

## 核心模型

先定义 Key，再拼接 `Slot-ID`。

| 名称 | 含义 | 示例 |
| --- | --- | --- |
| `PageKey` | 页面级稳定标识 | `ops-dashboard` |
| `RegionKey` | 页面区域标识 | `kpi-area` |
| `ComponentKey` | 组件实例标识 | `today-orders` |
| `SlotKey` | 组件内展示位标识 | `value` |
| `BusinessKey` | 动态实例的稳定业务键 | `wo-2024-0031` |

## 唯一格式

`data-automation-id` 统一使用双短横 `--` 作为层级分隔：

```text
{PageKey}--{RegionKey}--{ComponentKey}--{SlotKey}
```

规则：

1. 只使用 `--` 分层。
2. 层内只使用 kebab-case。
3. 不再使用 `{page}-{region}-{component}-{element}` 这种单短横层级写法。

## 命名来源

### 1. PageKey

- 优先来自页面语义，不直接绑定 URL
- 路由段只能作为参考，不能作为唯一真源
- 中文标题需要转成稳定英文 key

正确：

- `ops-dashboard`
- `work-orders`

错误：

- `yun-wei-jian-kong-da-ping`
- `v2-dashboard-page`

### 2. RegionKey

- 来自稳定的功能区域，而不是 DOM 布局编号
- 用语义命名，不用 `grid-1`、`cell-2`

正确：

- `kpi-area`
- `filters`
- `summary-table`

错误：

- `grid-1`
- `left-panel-2`

### 3. ComponentKey

- 表示一个可独立理解的组件实例
- 相同组件的不同业务实例，用业务语义区分

正确：

- `today-orders`
- `order-trend`
- `row-wo-2024-0031`

### 4. SlotKey

- 表示组件内最小可测“展示位”
- 它不是 DOM tag 名，也不是 CSS class 名

常用值：

| 类型 | SlotKey 示例 |
| --- | --- |
| 文本 | `label` |
| 数值 | `value` |
| 趋势 | `trend` |
| 状态 | `status` |
| 操作触发器 | `trigger` |
| 输入框 | `input` |
| 下拉框 | `select` |
| 空态 | `empty` |
| 错误 | `error` |
| 加载态 | `loading` |

## Slot-ID

`Slot-ID` 是推荐在文档里使用的名字，最终写入 DOM 时对应：

```html
<div data-automation-id="<Slot-ID>"></div>
```

示例：

```text
ops-dashboard--kpi-area--today-orders--value
ops-dashboard--kpi-area--today-orders--trend
work-orders--filters--status-filter--select
work-orders--summary-table--row-wo-2024-0031--status
```

## 动态元素

### 优先业务键

动态列表、表格、卡片组优先使用 `BusinessKey`：

```text
work-orders--summary-table--row-wo-2024-0031--status
work-orders--summary-table--row-wo-2024-0031--count
```

优点：

- 排序不影响 ID
- 筛选不影响 ID
- 插入新行不影响旧 ID

### 索引只作兜底

只有在确实没有稳定业务键时，才允许退化为索引：

```text
work-orders--summary-table--row-0--status
```

必须同时在文档中标注：

- `风险：索引定位，排序/筛选后可能变化`

## 选择器规则

一个 `Slot-ID` 只能有一个主选择器：

```text
[data-automation-id="ops-dashboard--kpi-area--today-orders--value"]
```

如果需要集合选择器，只能作为辅助选择器，不替代主选择器：

```text
[data-automation-id^="work-orders--summary-table--row-"]
```

## 映射原则

### Metric-ID -> Slot-ID

- 允许 `1:N`
- 一个指标可以出现在多个展示位
- 例如：同一个“工单总数”既出现在 KPI，也出现在表格摘要

### Slot-ID -> 主选择器

- 必须 `1:1`
- 一个展示位只能绑定一个主选择器

### GWT 步骤 -> Slot-ID

- `When` 落到可操作展示位
- `Then` 落到可断言展示位

## 完整示例

```text
PageKey: ops-dashboard

RegionKey:
- header
- kpi-area
- chart-area
- summary-table

Slot-ID:
- ops-dashboard--header--clock--value
- ops-dashboard--kpi-area--today-orders--value
- ops-dashboard--kpi-area--today-orders--trend
- ops-dashboard--chart-area--order-trend--loading
- ops-dashboard--summary-table--row-wo-2024-0031--status
- ops-dashboard--summary-table--row-wo-2024-0031--count
```

## 校验清单

- [ ] 所有层级都用 `--` 分隔
- [ ] 所有层内都用 kebab-case
- [ ] `PageKey / RegionKey / ComponentKey / SlotKey` 语义稳定
- [ ] 动态元素优先使用业务键
- [ ] 索引兜底场景已显式标注风险
- [ ] 一个 `Slot-ID` 只有一个主选择器
- [ ] 关键 GWT 步骤都能落到 `Slot-ID`
- [ ] 关键指标至少落到一个 `Slot-ID`

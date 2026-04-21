# 导出 DSL JSON → 布局 DSL 映射规则

当设计平台/低代码平台导出页面结构 JSON 时，按以下规则转换为布局 DSL。

## JSON 结构约定

导出 JSON 的根结构为 `{ "contents": [...] }`，每个元素包含：

| 字段 | 说明 |
|---|---|
| `type` | 元素类型：`card`、`table`、`map`、`echarts`、`text` 等 |
| `title` | 卡片/区域标题 |
| `components` | 子元素数组 |
| `layout.gridArea` | 网格定位：`rowStart`、`rowSpan`、`colStart`、`colSpan` |
| `columns` | 表格列定义（仅 table 类型） |
| `data` | 数据内容 |

## 类型映射表

| JSON `type` | 布局 DSL 关键词 | 映射说明 |
|---|---|---|
| `card` | `card "title"` | 直接映射，title 来自 `title` 字段 |
| `text` | `kpi` 或 `text` | 有 `value` 时映射为 `kpi "text" = "value"`；无 `value` 时映射为 `text` |
| `echarts` | `chart.*` 或 `chart.gauge` | 有 `data` 数组时根据数据形态推断图表类型；仅有 `value` 时映射为 `chart.gauge "text" = "value"` |
| `table` | `table` | `columns` 映射为 `head:`，`data` 数组映射为 `row:` |
| `map` | `chart.map` | `data` 中每项映射为列表条目 |

## gridArea → grid 映射

JSON 中的 `layout.gridArea` 提供绝对网格坐标。转换时：

1. 收集所有元素的 `gridArea`，确定实际使用的行列范围
2. 将同一行（相同 `rowStart` 和 `rowSpan`）的元素归入同一个 `grid` 行
3. 用 `cell` 包裹每个元素，`colSpan > 1` 且相对突出时标注 `(span=N)`

## 转换示例

**输入 JSON**（节选）：

```json
{
  "type": "card",
  "title": "自有人员",
  "components": [
    {"type": "text", "value": "2,888人", "text": "总人力: "},
    {"type": "echarts", "value": "98%", "text": "配置率 "},
    {"type": "text", "value": "98.2%", "text": "干部配置率: "},
    {"type": "text", "value": "95%", "text": "本地化率: "},
    {"type": "echarts", "value": "95%", "text": "重点岗位人力分布"}
  ],
  "layout": {"gridArea": {"rowStart": 1, "rowSpan": 2, "colStart": 1, "colSpan": 6}}
}
```

**输出布局 DSL**：

```
card "自有人员"
  kpi "总人力" = "2,888人"
  chart.gauge "配置率" = "98%"
  kpi "干部配置率" = "98.2%"
  kpi "本地化率" = "95%"
  chart.gauge "重点岗位人力分布" = "95%"
```

**完整页面转换示例**：

以下 JSON 描述了一个人力资源数据大屏：

```json
{
  "contents": [
    {"type": "card", "title": "自有人员", "components": [
      {"type": "text", "value": "2,888人", "text": "总人力: "},
      {"type": "echarts", "value": "98%", "text": "配置率 "}
    ], "layout": {"gridArea": {"rowStart": 1, "rowSpan": 2, "colStart": 1, "colSpan": 6}}},
    {"type": "card", "title": "穿透人力", "components": [
      {"type": "text", "value": "1,888人", "text": "公有云穿透人力: "},
      {"type": "text", "value": "1,000人", "text": "混合云穿透人力: "}
    ], "layout": {"gridArea": {"rowStart": 1, "rowSpan": 2, "colStart": 7, "colSpan": 4}}},
    {"type": "card", "title": "配置率趋势洞察", "components": [
      {"type": "echarts", "data": [
        {"month": "1月", "rate": "81%"}, {"month": "2月", "rate": "70%"}
      ]}
    ], "layout": {"gridArea": {"rowStart": 3, "rowSpan": 2, "colStart": 1, "colSpan": 8}}},
    {"type": "card", "title": "地图", "components": [
      {"type": "map", "data": [{"country": "XX国家", "value": "数据"}]}
    ], "layout": {"gridArea": {"rowStart": 3, "rowSpan": 4, "colStart": 9, "colSpan": 16}}}
  ]
}
```

转换为布局 DSL：

```
page "人力资源大屏" (dark, fullscreen)
  grid 3x1
    cell
      card "自有人员"
        kpi "总人力" = "2,888人"
        chart.gauge "配置率" = "98%"
    cell
      card "穿透人力"
        kpi "公有云穿透人力" = "1,888人"
        kpi "混合云穿透人力" = "1,000人"
    cell
      card "非雇员人力"
        kpi "非雇员人力" = "1,888人"
        chart.gauge "配置率" = "98%"
  grid 2x1
    cell
      card "配置率趋势洞察"
        chart.line "配置率趋势"
          x: 1月 | 2月 | 3月 | 4月 | 5月 | 6月 | 7月 | 8月 | 9月 | 10月 | 11月 | 12月
          series "配置率": 81% | 70% | 79% | 46% | 75% | 52% | 81% | 70% | 79% | 46% | 52% | 79%
    cell
      card "地图"
        chart.map "全球分布"
          - XX国家
          - 巴西

  grid 1x1
    cell
      card "人均效能"
        table
          head: 分类 | 数量 | 收入($) | 收入占比 | 人数 | 人数占比 | 人均收入
          row: 重点国/代 | 32 | 5400 | 73% | 400 | 69% | 688万
          row: 价值国/代 | 30 | 1700 | 23% | 161 | 28% | 1,288万
          row: 其他 | 57 | 300 | 4% | 22 | 3% | 1,088万
```

## 转换注意事项

1. **echarts 类型推断**：`echarts` 是通用图表组件，需要根据数据结构推断具体类型：
   - 仅有 `value`（百分比/数值）→ `chart.gauge`
   - `data` 中有时间序列 → `chart.line`
   - `data` 中有分类占比 → `chart.pie`
   - 无法推断时 → `chart "标题"`，在解析自检中标注

2. **截图补充**：导出 JSON 不包含颜色、状态标识、动画等视觉信息。如果有截图，从截图中补充这些信息到布局 DSL 的修饰词中（如 `(red)`、`(green)`、`(trend=+12%)`）。

3. **gridArea 简化**：导出 JSON 的网格坐标可能很精细（如 24 列栅格），转换时合并为视觉上合理的 `grid NxM` 分组，不需要完全还原原始栅格。

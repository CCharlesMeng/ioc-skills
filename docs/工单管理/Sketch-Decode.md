# Sketch-Decode: 运维监控大屏

> 由 ioc-sketch-decode 生成 | 2026-04-14

---

## 截图 1: 运维监控大屏

### 布局还原

```
page "运维监控大屏" (dark, fullscreen)
  header (row)
    img "logo"
    text "IOC 智慧运维中心"
    text "2024-03-15 14:32:08" (right)
  grid 3x2
    cell
      kpi "今日工单" = "128" (trend=+12%)
    cell
      kpi "待处理" = "23" (red)
    cell
      kpi "SLA达标率" = "96.5%" (green)
    cell
      kpi "平均响应" = "4.2min"
    cell
      kpi "本月完成" = "1,847"
    cell
      kpi "满意度" = "98.2%" (green)
  grid 2x2
    cell
      chart.line "工单趋势（近7日）"
        x: 周一 | 周二 | 周三 | 周四 | 周五 | 周六 | 周日
        series "新增": 18 | 22 | 15 | 25 | 20 | 8 | 5
        series "完成": 16 | 20 | 18 | 22 | 19 | 10 | 6
    cell
      chart.pie "工单类型分布"
        - 故障报修 35%
        - 资源申请 28%
        - 变更请求 22%
        - 咨询 15%
    cell (span=2)
      chart.map "全国节点状态"
        - 北京 (green, 正常)
        - 上海 (green, 正常)
        - 广州 (yellow, 告警)
        - 成都 (red, 故障)
  grid 2x1
    cell
      rank "工单处理排行"
        1. 张三 - 完成 42 单
        2. 李四 - 完成 38 单
        3. 王五 - 完成 35 单
        4. 赵六 - 完成 31 单
        5. 孙七 - 完成 28 单
    cell
      card "实时告警"
        table
          head: 时间 | 级别 | 内容 | 状态
          row: 14:28 | 严重(red,tag) | 广州节点CPU>95% | 处理中(blue,tag)
          row: 14:15 | 警告(orange,tag) | 上海存储>80% | 已确认(gray,tag)
          row: 13:52 | 信息(blue,tag) | 北京备份完成 | 已关闭(green,tag)
          (共12条)
```

### 组件识别

| 页面区域 | 功能描述 |
|---|---|
| header | 顶部横条，左侧 logo + 标题，右侧实时时间 |
| grid 3x2 (KPI区) | 6 个数值指标卡，含趋势箭头和颜色状态标识 |
| chart.line | 近7日工单趋势，双折线（新增/完成），7 个数据点 |
| chart.pie | 4 类工单类型占比饼图，含百分比标签 |
| chart.map | 全国节点分布图，4 个城市标注含红绿黄状态色 |
| rank | TOP5 工单处理排行，序号 + 姓名 + 完成数 |
| card + table (告警) | 实时告警卡片，内嵌 4 列表格，含级别和状态标签 |

### 交互与状态

```
交互元素：
- chart.line "工单趋势" 可见 tooltip 显示"周三: 新增15, 完成18"
- chart.map 各节点可点击，广州节点(red)有脉冲动画
- rank 各条目可能可点击（无明显链接样式，不确定）

状态标识：
- kpi "待处理" 数值红色，表示异常
- kpi "SLA达标率" / "满意度" 数值绿色，表示正常
- kpi "今日工单" 趋势箭头 ↑ +12%
- chart.map 节点颜色：green(正常) / yellow(告警) / red(故障)
- table 告警级别：严重(red,tag) / 警告(orange,tag) / 信息(blue,tag)
- table 处理状态：处理中(blue,tag) / 已确认(gray,tag) / 已关闭(green,tag)

时间刷新：
- header 右上角时间 "2024-03-15 14:32:08"，疑似实时刷新
```

### 解析自检

```
- chart.line 仅显示近7日数据，是否支持切换时间范围不可见
- chart.map 仅标注 4 个城市节点，是否有更多节点被地图缩放层级隐藏未知
- chart.map 节点状态颜色推测 green=正常/yellow=告警/red=故障，无图例确认
- rank 仅显示 TOP5，完整排行长度不可见
- table "实时告警" 显示 3 行，注释"共12条"，是否有滚动/分页不确定
- 页面右上角时间是否为实时刷新，刷新频率无法从静态截图判断
- 整体深色背景下部分文字对比度较低，"平均响应"数值可能为 4.2 或 4.7(模糊)
```

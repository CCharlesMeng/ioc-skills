# IOC 设计流水线：极简思路

> 三个 skill 构成一条从"做什么"到"怎么做"的渐进式设计流水线。
> 每一步只回答一个核心问题，下游不重复上游已收敛的结论。

---

## 一、思考顺序

```text
设计稿 / 需求文档
        │
        ▼
  ┌─────────────┐     Spec.md          "做什么、不做什么"
  │  ioc-spec   │──→  Acceptance.md    "怎样算做完了"
  └──────┬──────┘
         │  + 存量指标 Excel
         ▼
  ┌──────────────────┐  Data-Dev.md          "指标口径、数据从哪来"
  │  ioc-data-plan   │──→ Display-Contract.md "展示位拿什么形状的数据"
  └──────┬───────────┘  Mock-Spec.md         "最少数据覆盖最多场景"
         │  + Angular 项目代码
         ▼
  ┌────────────────────┐  Frontend-Plan.md   "前端怎么拆、复用什么、任务切片"
  │  ioc-frontend-plan │──→ Testability-Map.md "测试如何稳定定位元素"
  └────────────────────┘
         │
         ▼
     拆 task / 编码 / 自动化测试
```

**核心原则：每个 skill 只往下游传递"已收敛的结论"，不传递"过程争论"。**

---

## 二、每个 skill 回答什么

| Skill | 核心问题 | 视角 | 禁区 |
| --- | --- | --- | --- |
| ioc-spec | 做什么、不做什么、做完的标准 | 产品 / 用户 | 不写技术术语 |
| ioc-data-plan | 数据从哪来、口径是什么、Mock 怎么造 | 数据开发 / 前端对接 | 不写 SQL、不定义 API |
| ioc-frontend-plan | 组件怎么拆、状态怎么管、任务怎么切 | 前端工程 | 不写实现代码 |

---

## 三、输入输出链与依赖

```text
            ┌─────────────────── Sketch-Decode.md ───────────────────┐
            │                         │                              │
            ▼                         ▼                              ▼
       ioc-spec                 ioc-data-plan               ioc-frontend-plan
            │                         │                              │
  ┌─────────┴─────────┐    ┌─────────┴──────────┐      ┌───────────┴──────────┐
  │ Spec.md           │───→│ Data-Dev.md        │      │ Frontend-Plan.md     │
  │ Acceptance.md     │───→│ Display-Contract.md│─────→│ Testability-Map.md   │
  └───────────────────┘    │ Mock-Spec.md       │      └──────────────────────┘
                           └────────────────────┘
```

| 上游产出 | 下游消费方 | 消费什么 |
| --- | --- | --- |
| Spec.md | data-plan, frontend-plan | FR 列表、功能范围、角色、约束 |
| Acceptance.md | data-plan, frontend-plan | GWT 场景（data-plan 只取数据态 Given） |
| Sketch-Decode.md | 三个 skill 都用 | 布局 DSL、组件、交互、逐字文案 |
| Display-Contract.md | frontend-plan | 展示位-指标映射、数据新鲜度等级 |
| Mock-Spec.md | frontend-plan（辅助） | 场景数据集，非必须 |

---

## 四、共享机制

三个 skill 共享一套交互范式（详见 `PRINCIPLES.md`），核心模式：

### 4.1 Phase 结构

每个 skill 都是 `输入装载 → 盘点/地图 → 澄清 → 生成文档` 的四段式：

| 阶段 | 作用 | 用户交互 |
| --- | --- | --- |
| Phase 0 — 输入装载 | 读取、校验输入 | 无（内联进下一阶段） |
| Phase 1 — 盘点 | 交叉比对，分类 | 确认门 |
| Phase 2 — 澄清 | 补信息、消歧义 | 多轮问答 |
| Phase 3+ — 生成 | 产出文档 | 确认门 |

### 4.2 三色状态

所有 skill 的澄清阶段共享相同的问题标记：

| 状态 | 含义 | 处理 |
| --- | --- | --- |
| 🔴 | 必须用户回答 | 阻断生成 |
| 🟡 | AI 有推测，用户可确认/跳过 | 跳过则计入"工作假设" |
| 🟢 | 已确认 | 通过 |

### 4.3 确认门

每个有产出的 Phase 以标准格式结束，不用模糊邀请语：

```
---
**[Phase N 确认门]** <一句话描述>
→ 请确认继续 / 或指出需要修改的地方。
---
```

### 4.4 降级策略

输入不完整不等于不能工作。每个 skill 都有输入矩阵，按缺失程度降级：

| 缺失 | 降级方式 |
| --- | --- |
| 无 Sketch-Decode | 跳过 UI 交叉引用，精度下降 |
| 无存量指标 Excel | 所有指标按"新增"处理 |
| 无 Display-Contract | 前端方案可出，但不做指标级闭环 |
| 无 Spec.md | **阻断**（data-plan 和 frontend-plan 都需要） |

---

## 五、边界切分（最关键）

三个 skill 之间最容易搞混的边界：

### 5.1 "展示位需要什么" vs "展示位怎么刷新"

| 关注点 | 归属 | 文档 |
| --- | --- | --- |
| 展示位对应哪个指标、什么数据形状 | ioc-data-plan | Display-Contract.md |
| 数据新鲜度等级（实时/准实时/定时/静态） | ioc-data-plan | Display-Contract.md |
| 刷新机制（轮询/WebSocket/手动） | ioc-frontend-plan | Frontend-Plan.md |
| 空态/错误态的展示方式 | ioc-frontend-plan | Frontend-Plan.md |

### 5.2 "做什么" vs "数据怎么流" vs "代码怎么拆"

| 问题 | 归属 |
| --- | --- |
| 用户能看到什么、操作什么 | ioc-spec |
| 这个数值怎么算出来的 | ioc-data-plan |
| 这个组件是新建还是复用 | ioc-frontend-plan |

### 5.3 Mock 的边界

| Mock 管什么 | Mock 不管什么 |
| --- | --- |
| 数据态场景（空值、极值、部分缺失） | 权限场景 |
| 数据集内部和跨数据集一致性 | 网络异常 |
| 场景与 Acceptance.md GWT 的映射 | 特性开关 |

---

## 六、每个 skill 的关键澄清维度

### ioc-spec（7 维度，面向产品）

功能范围与边界 · 用户角色与权限 · 业务规则 · 交互流程 · 数据生命周期 · 异常与边界 · 术语一致性

### ioc-data-plan（6 维度，面向数据）

数据口径 · 源表定位 · 主题表映射 · 时间粒度 · 维度切面 · 计算逻辑

### ioc-frontend-plan（5 维度，面向工程）

状态管理 · API 对接 · 扩展兼容性 · 图表库选型 · 测试约束

---

## 七、常见问题

### Q1: 三个 skill 必须严格串行吗？

不完全是。ioc-data-plan 和 ioc-frontend-plan 都依赖 ioc-spec 的产出，但两者之间是"推荐串行、允许并行"的关系：
- **串行更好**：data-plan 的 Display-Contract.md 是 frontend-plan 的推荐输入，有它前端方案更完整。
- **可以并行**：如果急着出前端方案，frontend-plan 可以在无 Display-Contract 的降级模式下工作，之后补齐。

### Q2: Sketch-Decode.md 不是这三个 skill 产出的，它从哪来？

来自本仓库中的 `ioc-sketch-decode` skill。它把设计稿截图转为结构化的布局 DSL + 组件识别 + 交互状态。ioc-spec、ioc-data-plan、ioc-frontend-plan 都以它为推荐视觉输入源。

### Q3: 如果需求没有设计稿怎么办？

三个 skill 都支持无 Sketch-Decode 的降级：
- ioc-spec：所有 FR 仅基于需求文档，不做 UI 交叉引用
- ioc-data-plan：从 Spec.md 提取数据需求（精度降低）
- ioc-frontend-plan：不做布局级组件树，仅按功能模块拆分

### Q4: "待确认"标记会一路传播吗？

会。这是设计意图：
- ioc-spec 中标记 `[待确认]` 的 FR，对应的 AC 也标 `[待确认]`
- data-plan 消费这些 FR 时，关联指标也会标 `[待确认]`
- frontend-plan 中未审批的扩展/新增组件标 `[待确认:需开发者审批]`

**不确定性不会被静默吞掉，而是显式传播到所有下游文档。**

### Q5: 用户可以提前终止澄清吗？

可以。所有 skill 都支持用户说"够了"：
- 未澄清的 🔴 标记为 `unresolved`
- 未确认的 🟡 标记为 `assumed`
- 两种标记都会写入最终文档，不会被当作已确认的需求

### Q6: 三个 skill 的产出文档放在哪？

统一路径约定 `docs/<需求名>/`：

```
docs/<需求名>/
├── Sketch-Decode.md       ← ioc-sketch-decode 产出
├── Spec.md                ← ioc-spec 产出
├── Acceptance.md          ← ioc-spec 产出
├── Data-Dev.md            ← ioc-data-plan 产出
├── Display-Contract.md    ← ioc-data-plan 产出
├── Mock-Spec.md           ← ioc-data-plan 产出
├── Frontend-Plan.md       ← ioc-frontend-plan 产出
└── Testability-Map.md     ← ioc-frontend-plan 产出
```

### Q7: 分类/匹配都用打分机制吗？

两个 skill 用了打分：
- **ioc-data-plan**：指标匹配打分（0-15 分），≥8 复用 / 4-7 修改 / 0-3 新增
- **ioc-frontend-plan**：组件匹配用证据等级（A/B/C/D），复用至少需要 A 或 B 级证据

两者思路一致：**用可量化的规则代替直觉判断，让分类结论可审查。**

---

## 八、一句话总结

> ioc-spec 收敛"做什么"，ioc-data-plan 收敛"数据怎么流"，ioc-frontend-plan 收敛"代码怎么拆"。
> 上游不碰下游的领域，下游不重复上游的澄清。每份文档都是一个确定性边界。

---
name: ioc-data-plan
description: Use when ioc-spec outputs (Spec.md + Acceptance.md) exist and the project needs indicator inventory, data development specs, display contracts, and mock data plans before coding.
---

# 数据方案

## 概述

这个 skill 把需求规格（Spec.md）、视觉解码（Sketch-Decode.md）和存量指标资产（Excel）交叉分析，产出三份面向数据开发和前端对接的文档：

| 产出 | 回答的问题 |
| --- | --- |
| `Data-Dev.md` | 指标口径是什么、数据分层怎么划、表结构长什么样（含 DDL 草稿） |
| `Display-Contract.md` | 页面展示位和指标怎么对应、前端拿什么形状的数据 |
| `Mock-Spec.md` | 怎样用最少的数据覆盖最多的测试场景 |

与 ioc-spec 的区别：ioc-spec 回答"做什么"，ioc-data-plan 回答"数据怎么流转、前端拿什么、怎么测"。

与 ioc-frontend-plan 的边界：ioc-data-plan 只定义"展示位需要什么数据、什么形状"；刷新策略、空态/异常展示策略、组件实现方案由 ioc-frontend-plan 承担。

## 单一真源

以下规则只在一个文件里定义，其他文件只引用，不重复发明：

| 主题 | 单一真源 |
| --- | --- |
| 存量指标解析、列名映射、匹配打分规则 | [references/indicator-schema.md](references/indicator-schema.md) |
| `Data-Dev.md` 结构与写作规范 | [references/data-dev-template.md](references/data-dev-template.md) |
| `Display-Contract.md` 结构与写作规范 | [references/display-contract-template.md](references/display-contract-template.md) |
| `Mock-Spec.md` 结构与写作规范 | [references/mock-template.md](references/mock-template.md) |
| 知识反哺规则 | [references/feedback-protocol.md](references/feedback-protocol.md) |
| ETL 模式与领域指标参考 | [references/knowledge-base.md](references/knowledge-base.md) |

## 输入矩阵

推荐输入是 `Spec.md + Acceptance.md + Sketch-Decode.md + 存量指标 Excel`。如果输入不完整，按下表降级：

| Spec.md | Acceptance.md | Sketch-Decode.md | 存量指标 Excel | 输出级别 | 处理方式 |
| --- | --- | --- | --- | --- | --- |
| ✓ | ✓ | ✓ | ✓ | 完整 | 正常输出三份文档 |
| ✓ | ✓ | ✓ | ✗ | 降级 A | 所有指标按"新增"处理，Phase 2 澄清范围扩大 |
| ✓ | ✓ | ✗ | 任意 | 降级 B | 从 Spec.md 提取数据需求（精度降低）；Display-Contract 不做组件级映射 |
| ✓ | ✗ | 任意 | 任意 | 降级 C | Mock-Spec 不做 GWT 场景映射，仅基于指标清单生成基础场景 |
| ✗ | 任意 | 任意 | 任意 | 阻断 | 提示先运行 `ioc-spec` |

## 交互规范

遵守 [Skill-User 交互黄金原则](../../PRINCIPLES.md)。

| Phase | 用户可见内容 | 结束方式 |
| --- | --- | --- |
| 0 — 输入装载 | 内联进 Phase 1（P6） | — |
| 1 — 指标盘点 | 指标清单表 + 分类统计 | 确认门（P4） |
| 2 — 数据澄清 | 批量提问（含选项推荐） | 等待回答（多轮，P7） |
| 3 — 数据模型设计 | Data-Dev.md 内容预览（分层 + 表结构 + DDL 草稿 + 指标归属） | **表设计确认门**（P4） |
| 4 — 展示数据契约 | Display-Contract.md 内容预览（完整/Lite 模式） | 确认门（P4） |
| 5 — Mock 数据方案 | Mock-Spec.md 内容预览 | 确认门（P4） |
| 最终 | 三行索引（P5） | — |

---

## 硬门禁

1. **没有 Spec.md 不准分析。** 见输入矩阵"阻断"行。
2. **不编造源表结构。** 源表信息必须来自用户提供或知识库，不允许猜测字段名和表结构。不确定的标记 `[待确认:源表信息缺失]`。
3. **不生成 SQL。** 口径描述必须精确到可直接翻译为 SQL 的程度，但不写 SQL 本身。规则详见 [references/data-dev-template.md](references/data-dev-template.md)。DDL 草稿不算 SQL，属于表结构规格，允许生成。
4. **指标分类只认打分规则。** 复用/新增/修改的判定只以 [references/indicator-schema.md](references/indicator-schema.md) 的匹配打分规则为准。
5. **不要在澄清未收敛时生成规格。** Phase 2 的所有 🔴 必须变 🟢 才能进入 Phase 3。用户提前终止时，未澄清项在 Data-Dev.md 中显式标记为 `unresolved` 或 `assumed`。
6. **Mock 只覆盖数据态场景。** Mock-Spec.md 的场景覆盖 Acceptance.md 中与数据状态相关的 Given 条件。非数据态（权限、网络异常、特性开关等）由前端测试基座承担，不强塞进表级 Mock。
7. **Display-Contract 字段必须引用已确认的表。** Phase 4 的 `应用表.字段` 列只能引用 Phase 3 已通过确认门的表。无表设计时自动进入 Lite 模式（省略字段列），严禁首次在此处编造字段名。

## 何时使用

适用场景：

- 已有 Spec.md + Acceptance.md（ioc-spec 产出），需要产出数据层方案
- 已有存量指标 Excel，需要盘点复用/新增/修改
- 数据驱动的页面开发（大屏、报表、仪表盘等）

不适用场景：

- 还没有需求规格（先用 `ioc-spec`）
- 需要生成具体的 SQL 实现（留给下游 skill）
- 需要设计 API 接口或前端实现方案（分别由其他 skill 或 `ioc-frontend-plan` 承担）

## 工作流

### Phase 0 — 输入装载

读取所有输入源，校验完整性。此阶段不产生独立输出，结论内联进 Phase 1（P6）。

动作：

1. **读取 Spec.md + Acceptance.md**
   - 路径：`docs/<需求名>/Spec.md`、`docs/<需求名>/Acceptance.md`
   - 从 Spec.md 提取功能需求列表（FR-N），确认数据相关的需求项
   - 从 Acceptance.md 提取 GWT 场景，识别涉及数据状态的 Given 条件（供 Phase 5 Mock 方案使用）

2. **读取 Sketch-Decode.md**（如有）
   - 路径：`docs/<需求名>/Sketch-Decode.md`
   - 提取所有数据展示组件：kpi / chart.* / table / rank / progress / ticker 等
   - 记录每个组件的可见数据内容（标签、数值、单位、趋势等）

3. **解析存量指标 Excel**（如有）
   - 用户在对话中提供的 Excel 文件
   - 按 [indicator-schema](references/indicator-schema.md) 解析每行指标信息
   - 构建存量指标索引，用于 Phase 1 交叉比对

4. **读取专家知识库**（如有）
   - 路径：`skills/ioc-data-plan/references/knowledge-base.md`
   - 加载已有的 ETL 模式和领域指标模板，辅助 Phase 2 澄清时的推荐

5. **接收源表/主题表信息**（如有）
   - 用户在对话中提供的补充信息：源表 DDL、数据字典、ER 图等
   - 作为 Phase 2 澄清的参考依据

退出条件：按输入矩阵判断。Spec.md 缺失 → 阻断。其他输入缺失 → 按对应降级级别继续，在 Phase 1 输出中标注降级模式。

---

### Phase 1 — 指标盘点

将数据展示需求与存量指标交叉对照，产出指标清单。

动作：

1. **提取数据需求项**
   - 有 Sketch-Decode.md：从布局 DSL 提取所有数据展示组件，每个组件映射为一个数据需求项
   - 无 Sketch-Decode.md（降级 B）：从 Spec.md 的 FR 列表提取数据相关需求项
   - 结合 Spec.md 补充隐含的数据需求（如"用户看到同比增长"→ 需要昨日数据）

2. **交叉比对**
   - 将每个数据需求项与存量指标索引逐条匹配
   - 匹配打分规则见 [references/indicator-schema.md](references/indicator-schema.md)
   - 按得分归类为 复用 / 修改 / 新增

3. **产出指标清单表**

```markdown
| # | 页面组件 | 数据需求 | 匹配指标(Excel) | 分类 | 匹配分 | 差异说明 |
|---|---------|---------|----------------|------|--------|---------|
| D-1 | kpi "今日工单" | 当日工单总数 | app_workorder.total_count | 复用 | 10 | — |
| D-2 | chart.line "趋势" | 近7日新增/完成 | — | 新增 | 0 | 无存量指标 |
| D-3 | kpi "SLA达标率" | SLA达标百分比 | app_sla.rate | 修改 | 6 | 现有口径为月度，需改日度 |
```

**确认门**：

```
---
**[Phase 1 确认门]** 以上是指标清单和复用/新增/修改分类。
→ 请确认继续 / 或指出需要修改的地方。
---
```

---

### Phase 2 — 数据澄清

仅对**新增**和**修改**类指标提问。复用类指标已有完整定义，跳过。

#### 步骤 1：澄清维度扫描

对每个新增/修改指标，按以下 3 个维度扫描信息完整度：

| 维度 | 检查什么 | 典型问题 |
| --- | --- | --- |
| 数据口径 | 指标算什么：筛选条件 + 聚合函数 + 业务规则 | "今日工单数"是自然日还是工作日？截止时间点是几点？SLA达标标准是什么？ |
| 分层与表设计 | 数据存在哪：分层归类 + 所属表 + 表结构（时间粒度作为分区/后缀，维度切面作为列） | 落在 dws 还是 ads 层？承载在 `dws_workorder_daily` 还是独立表？需要按 region_id 拆分吗？分区字段是 `dt`？ |
| 计算逻辑 | 衍生指标怎么算：公式 + 基础指标 | SLA达标率 = 达标工单数 / 总工单数？除零如何处理？ |

> 本维度集合是从 6 维简化而来。原先独立的"源表定位 / 主题表映射 / 时间粒度 / 维度切面"已被"分层与表设计"吸收——这些信息在表结构里自然承载，不再作为独立抽象提问。

#### 步骤 2：问题生成与优先级排序

综合扫描结果生成候选问题，按 `影响面 × 不确定性` 排序。

优先级规则：
- 影响多个指标的口径问题 > 影响单个指标的细节
- 新增指标 > 修改指标（新增缺信息更多）
- 数据口径 > 分层与表设计（口径不清无法设计表结构）

每个问题标注三色状态：

| 状态 | 含义 |
| --- | --- |
| 🔴 | 缺失关键信息，无法合理推测，必须用户回答 |
| 🟡 | 有证据可推测（来自知识库或上下文），展示推理，用户可确认/纠正/跳过 |
| 🟢 | 已通过 Excel、Spec.md 或上下文确认（不需要提问） |

#### 步骤 3：批量提问

按 P7 原则，同一优先级的问题合并在一轮输出：

```
以下 N 个问题需要你回答：

| # | 指标 | 维度 | 问题 | 我的推测（如有） |
|---|------|------|------|-----------------|
| Q-1 🔴 | D-2 近7日趋势 | 数据口径 | "近7日"是自然日还是工作日？包含今天吗？ | — |
| Q-2 🟡 | D-3 SLA达标率 | 计算逻辑 | 达标标准是响应时间<4h？ | 推测为<4h，依据：知识库 C-001 |
| Q-3 🔴 | D-2 近7日趋势 | 分层与表设计 | 承载在现有的 dws_workorder_daily，还是新建 dws_workorder_trend_daily？分区字段 `dt`？ | — |

🔴 标记的问题必须回答才能继续；🟡 标记的是推测，可确认、纠正或跳过（标为工作假设）。
```

#### 步骤 4：收敛

每批问题用户回答后：
1. 更新指标清单（标注澄清结论）
2. 检查是否还有未覆盖的维度
3. 如有新问题，追加到下一批

每轮提问按影响面分批，不设硬性总数上限。当所有新增/修改指标的 3 个维度均收敛（🟢 或 🟡 已接受）时停止。

准出条件：
- 所有 🔴 已变为 🟢
- 所有 🟡 要么变为 🟢，要么被用户显式接受为工作假设
- 每个新增/修改指标至少有：口径定义 + 归属表 + 计算逻辑（若衍生指标）。源表/表结构信息缺失时进入 Phase 3 的"无表设计降级"路径（DDL 草稿打 `[待确认]`），并传导到 Phase 4 的 Lite 模式

用户可随时说"够了"提前终止。未澄清的 🔴 标记为 `unresolved`，🟡 标记为 `assumed`，均在 Data-Dev.md 中显式声明。

#### 步骤 5：澄清结论记录

```
## 澄清记录

| Q# | 指标 | 问题 | 结论 | 来源 |
|----|------|------|------|------|
| Q-1 | D-2 | "近7日"的定义 | 自然日，不含今天 | 用户确认 |
| Q-2 | D-3 | SLA达标标准 | 响应时间<4h | 🟡 已接受（工作假设） |
```

---

### Phase 3 — 数据模型设计

基于指标清单和澄清结论，生成 Data-Dev.md。本阶段的确认门**专门检视数据模型是否科学**（分层归类、表命名、表结构），而不是泛泛确认文档。表设计一旦通过确认门，下游（Phase 4 Display-Contract、Phase 5 Mock-Spec）直接引用，不再反复澄清。

结构模板见 [references/data-dev-template.md](references/data-dev-template.md)。

核心规则（详见模板）：

- **口径必须可翻译**：精确到可直接翻译为 SQL 的程度，但不写 SQL 本身
- **分层归类显式化**：每张表归入 ODS/DWD/DWS/ADS 某一层，并说明依据
- **表结构含 DDL 草稿**：每张新增/修改的应用表必须提供可复制的 DDL 骨架（ORC 格式、分区字段、字段 COMMENT），让数据工程师拿到就能翻译成建表脚本
- **指标归属表明确**：每个指标显式标注"归属表.字段"，而不再把时间粒度/维度切面作为独立属性（它们已编码在表结构里）
- **三分类呈现**：复用/新增/修改分开展示
- **影响分析**：修改类指标必须列出影响范围
- **链路可追溯**：每个指标标注数据流向，信息不足时标记 `[待确认]`

写入 `docs/<需求名>/Data-Dev.md`。

**确认门**：

```
---
**[Phase 3 确认门]** 以上是数据模型设计（分层、表结构、指标归属）。
→ 请确认表设计是否科学 / 或指出需要调整的地方（字段名、分区、粒度、拆分维度等）。
---
```

#### 降级：无表设计信息时

如果用户在 Phase 2 明确表示"无法确认表设计，由数据工程师后续定"：

- Data-Dev.md 产出"表结构设计"章节时，DDL 草稿标记 `[待确认:需数据工程师定稿]`
- 指标归属表字段标记 `[推测:待数据工程师确认]`
- Phase 4 自动进入 Lite 模式（只出逻辑层，不含字段列，见 Phase 4 说明）

---

### Phase 4 — 展示数据契约

基于 Sketch-Decode.md 的组件和 Phase 3 **已确认**的表结构，生成展示位-指标映射。

结构模板见 [references/display-contract-template.md](references/display-contract-template.md)。

核心规则（详见模板）：

- **展示位级映射**：每个数据展示组件都必须有对应的指标来源
- **字段必须引用已确认的表**：`应用表.字段` 列只能引用 Phase 3 Data-Dev.md 里已通过确认门的表。严禁在此处首次引入新字段名（防止编造）
- **计算指标显式化**：前端侧衍生值必须写明公式和基础指标
- **命名对应 Sketch-Decode**：展示位命名与布局 DSL 一致
- **只定义数据契约**：不涉及刷新策略、空态展示、异常处理（由 ioc-frontend-plan 承担）

#### 两种模式

| 模式 | 触发条件 | 产出差异 |
| --- | --- | --- |
| 完整模式 | Phase 3 表设计已通过确认门 | 含"应用表.字段"列，字段直接引用 Data-Dev 已确认的表 |
| Lite 模式 | Phase 3 采用降级（无表设计） | **省略"应用表.字段"列**，只保留"展示位 → 指标语义名 → 值形状 → 新鲜度"的逻辑契约。字段绑定留待后续补齐 |

两种模式的输出都可直接被 `ioc-frontend-plan` 消费：前端方案关心的是"展示位要什么指标、什么形状、什么新鲜度"，不依赖具体字段名。

写入 `docs/<需求名>/Display-Contract.md`。

**确认门**：

```
---
**[Phase 4 确认门]** 以上是展示数据契约。
→ 请确认继续 / 或指出需要修改的地方。
---
```

---

### Phase 5 — Mock 数据方案

基于 Acceptance.md 的 GWT 场景和指标清单，生成 Mock 数据方案。

结构模板见 [references/mock-template.md](references/mock-template.md)。

核心规则（详见模板）：

- **场景驱动**：每个 Mock 场景对应 Acceptance.md 中与数据状态相关的 Given 条件
- **消费契约优先**：Mock 以页面消费的数据集为主抽象，表级 fixture 为可选附录
- **最小覆盖**：用最少的数据集覆盖最多的场景组合
- **可执行**：提供足够信息使下游可直接生成可运行的脚本

写入 `docs/<需求名>/Mock-Spec.md`。

**确认门**：

```
---
**[Phase 5 确认门]** 以上是 Mock 数据方案。
→ 请确认继续 / 或指出覆盖缺口。
---
```

---

## 退出门禁

- 每个数据展示组件有对应的指标来源
- 每个新增/修改指标有口径定义、归属表字段、计算逻辑（若衍生）
- 每张新增/修改的应用表有 DDL 草稿（含分区、存储格式、字段 COMMENT）
- Display-Contract 的字段引用均落在 Data-Dev 已确认的表上（Lite 模式除外）
- 每个 Mock 场景对应至少一个数据态 GWT 场景
- 待确认项已显式标记，不会被误认为已确认的规格
- Data-Dev.md 的口径描述精确到可翻译为 SQL

## 工件管理

| 工件 | 路径约定 |
| --- | --- |
| `Spec.md` | `docs/<需求名>/Spec.md`（前置输入，ioc-spec 产出） |
| `Acceptance.md` | `docs/<需求名>/Acceptance.md`（前置输入，ioc-spec 产出） |
| `Sketch-Decode.md` | `docs/<需求名>/Sketch-Decode.md`（前置输入，ioc-sketch-decode 产出） |
| `Data-Dev.md` | `docs/<需求名>/Data-Dev.md` |
| `Display-Contract.md` | `docs/<需求名>/Display-Contract.md` |
| `Mock-Spec.md` | `docs/<需求名>/Mock-Spec.md` |

`<需求名>` 使用需求的短标识，与 ioc-spec 产出中的保持一致。

## 与下游的衔接

```
ioc-sketch-decode → ioc-spec → ioc-data-plan → ioc-frontend-plan → 拆 task / 编码
```

下一步由项目实际情况决定：

| 场景 | 下一步 |
| --- | --- |
| 需要生成 SQL 实现 | 进入下游 skill（如 ioc-data-dev），消费 Data-Dev.md + 源表 DDL |
| 前端可以开始开发 | 进入 `ioc-frontend-plan`，消费 Display-Contract.md + Mock-Spec.md |
| 需要补充源表信息 | 补充后重新运行 Phase 2-3，或人工补充 Data-Dev.md |

## 最终输出

```
✓ ioc-data-plan 完成
产出：docs/<需求名>/Data-Dev.md, docs/<需求名>/Display-Contract.md, docs/<需求名>/Mock-Spec.md
下一步：<根据项目情况给出一条具体指令>
```

## 知识反哺

最终输出（三行索引）之后，如果本次运行产生了可沉淀的新经验，作为独立的后续动作执行知识反哺。规则见 [references/feedback-protocol.md](references/feedback-protocol.md)。

知识反哺是一个新的交互轮次，不挂在最终三行索引上。

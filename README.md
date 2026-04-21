# ioc-skills

IOC 设计流水线 skill 库：从设计稿视觉解码，到需求规格、数据方案与前端实施方案，形成可追溯的文档链。

## 流水线

```
ioc-sketch-decode → ioc-spec → ioc-data-plan ─┬→ ioc-frontend-plan → 拆 task / 编码 / 测试
                                               └→（可与 frontend-plan 并行，见 docs/IOC-Design-Overview.md）
```

设计思路与边界说明见 [docs/IOC-Design-Overview.md](docs/IOC-Design-Overview.md) 与 [docs/guideline.md](docs/guideline.md)。示例产物见 [docs/工单管理/](docs/工单管理/)。

## Installation

安装整个仓库：

```bash
npx skills add CCharlesMeng/ioc-skills
```

只安装单个 skill：

```bash
npx skills add CCharlesMeng/ioc-skills --skill ioc-spec
```

列出本仓库中的 skills：

```bash
npx skills add CCharlesMeng/ioc-skills --list
```

克隆本仓库：

```bash
git clone git@github.com:CCharlesMeng/ioc-skills.git
```

## Repository Layout

- `skills/` — `ioc-sketch-decode`、`ioc-spec`、`ioc-data-plan`、`ioc-frontend-plan`
- `docs/` — 设计总览、指南、[数据开发流程](docs/数据开发流程.md)（规范摘录）、示例工单产物
- `PRINCIPLES.md` — Skill-User 交互黄金原则（部分 skill 的 `SKILL.md` 会引用）

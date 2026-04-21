# ioc-skills

IOC 设计流水线 skill 库：从设计稿视觉解码，到需求规格、数据方案与前端实施方案，形成可追溯的文档链。

## 流水线

```
ioc-sketch-decode → ioc-spec → ioc-data-plan ─┬→ ioc-frontend-plan → 拆 task / 编码 / 测试
                                               └→（可与 frontend-plan 并行，见 docs/IOC-Design-Overview.md）
```

设计思路与边界说明见 [docs/IOC-Design-Overview.md](docs/IOC-Design-Overview.md) 与 [docs/guideline.md](docs/guideline.md)。示例产物见 [docs/工单管理/](docs/工单管理/)。

## Installation

安装整个仓库（将 `<owner>/ioc-skills` 替换为实际上线后的 GitHub 路径）：

```bash
npx skills add <owner>/ioc-skills
```

只安装单个 skill：

```bash
npx skills add <owner>/ioc-skills --skill ioc-spec
```

列出本仓库中的 skills：

```bash
npx skills add <owner>/ioc-skills --list
```

> **Note:** 在 GitHub 仓库创建并推送本目录后，把上述 `<owner>/ioc-skills` 换成你的 `组织名/仓库名`。

首次推送到新建的 GitHub 空仓库时（将 URL 换成你的远程地址，分支名以本地为准）：

```bash
git remote add origin https://github.com/<owner>/ioc-skills.git
git push -u origin main
```

## Repository Layout

- `skills/` — `ioc-sketch-decode`、`ioc-spec`、`ioc-data-plan`、`ioc-frontend-plan`
- `docs/` — 设计总览、指南与示例工单产物
- `PRINCIPLES.md` — Skill-User 交互黄金原则（部分 skill 的 `SKILL.md` 会引用）

## 与 moon-skills 的关系

本仓库与 [moon-skills](https://github.com/ccharlesmeng/moon-skills) 并列维护；moon-skills 聚焦分析驱动 SDD 主链（initialize、analysis-spec、design-pack 等），IOC 流水线单独在此仓库演进。

#!/usr/bin/env node
/**
 * 将 Sketch-Decode.md 中的布局 DSL 渲染为 ASCII wireframe。
 *
 * 用法：
 *   node render-wireframe.mjs docs/工单管理/Sketch-Decode.md
 *
 * 输出渲染后的 ASCII wireframe 到 stdout，不修改原文件。
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// --------------- Markdown Extractor ---------------

function extractDslBlocks(md) {
  const blocks = [];
  const lines = md.split("\n");
  let currentTitle = "";
  let inCode = false;
  let inLayout = false;
  let codeLines = [];

  for (const line of lines) {
    if (line.startsWith("## 截图")) {
      currentTitle = line.replace(/^#+\s*/, "").trim();
    } else if (line.trim() === "### 布局还原") {
      inLayout = true;
    } else if (inLayout && line.trim().startsWith("```") && !inCode) {
      inCode = true;
      codeLines = [];
    } else if (inCode && line.trim().startsWith("```")) {
      inCode = false;
      inLayout = false;
      blocks.push([currentTitle, codeLines.join("\n")]);
    } else if (inCode) {
      codeLines.push(line);
    }
  }
  return blocks;
}

// --------------- DSL Parser ---------------

function createNode(kind, text = "", mods = []) {
  return { kind, text, mods, children: [] };
}

function hasMod(node, m) {
  return node.mods.includes(m);
}

function getModValue(node, prefix) {
  const mod = node.mods.find((m) => m.startsWith(prefix + "="));
  return mod ? mod.slice(prefix.length + 1) : null;
}

function getIndent(line) {
  return line.length - line.trimStart().length;
}

function parseMods(text) {
  const mods = [];
  let clean = text.trim();
  while (clean.endsWith(")")) {
    const start = clean.lastIndexOf("(");
    if (start === -1) break;
    const modStr = clean.slice(start + 1, -1);
    mods.unshift(...modStr.split(",").map((m) => m.trim()));
    clean = clean.slice(0, start).trim();
  }
  return [clean, mods];
}

const CONTAINERS = new Set([
  "page", "modal", "nav", "header", "filters", "pagination",
  "footer", "form", "table", "grid", "cell", "card",
  "tabs", "sidebar", "section",
]);

const ELEMENTS = new Set([
  "text", "btn", "link", "input", "textarea", "select",
  "upload", "img",
]);

const VIZ = new Set([
  "kpi", "chart", "rank", "progress", "ticker", "legend",
]);

function parseDsl(dsl) {
  const lines = dsl.split("\n");
  const root = createNode("root");
  const stack = [[-1, root]];

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue;

    const indent = getIndent(rawLine);
    const line = rawLine.trim();

    while (stack.length > 0 && stack[stack.length - 1][0] >= indent) {
      stack.pop();
    }

    const parent = stack.length > 0 ? stack[stack.length - 1][1] : root;
    let node;

    if (line.startsWith("- ")) {
      const [text, mods] = parseMods(line.slice(2));
      node = createNode("item", text, mods);
    } else if (/^(head|row|x):/.test(line)) {
      const colonIdx = line.indexOf(":");
      const kind = line.slice(0, colonIdx);
      const content = line.slice(colonIdx + 1).trim();
      node = createNode(kind, content);
    } else if (line.startsWith("series ")) {
      const colonIdx = line.indexOf(":");
      if (colonIdx > -1) {
        const label = line.slice(7, colonIdx).replace(/["']/g, "").trim();
        const data = line.slice(colonIdx + 1).trim();
        node = createNode("series", `${label}: ${data}`);
      } else {
        node = createNode("series", line.slice(7).replace(/["']/g, "").trim());
      }
    } else if (/^\d+\.\s/.test(line)) {
      node = createNode("ranked-item", line);
    } else if (line.startsWith("(") && line.endsWith(")")) {
      node = createNode("note", line);
    } else if (line === "---") {
      node = createNode("separator");
    } else {
      const parts = line.split(/\s+(.+)/);
      const keyword = parts[0];
      const rest = parts[1] || "";
      const baseKw = keyword.split(".")[0];

      if (CONTAINERS.has(baseKw) || ELEMENTS.has(baseKw) || VIZ.has(baseKw)) {
        let [restClean, mods] = parseMods(rest);
        restClean = restClean.replace(/["']/g, "").trim();
        if (keyword.includes(".")) {
          mods.unshift(keyword.split(".")[1]);
        }
        node = createNode(baseKw, restClean, mods);
      } else {
        node = createNode("text", line);
      }
    }

    parent.children.push(node);
    stack.push([indent, node]);
  }

  return root;
}

// --------------- Renderer ---------------

function center(str, width) {
  if (str.length >= width) return str;
  const left = Math.floor((width - str.length) / 2);
  const right = width - str.length - left;
  return " ".repeat(left) + str + " ".repeat(right);
}

class Renderer {
  constructor(width = 78) {
    this.width = width;
    this.output = [];
  }

  push(line) {
    this.output.push(line);
  }

  box(content, w) {
    const inner = w - 4;
    this.push("+" + "-".repeat(w - 2) + "+");
    for (const c of Array.isArray(content) ? content : [content]) {
      this.push("| " + c.padEnd(inner) + " |");
    }
    this.push("+" + "-".repeat(w - 2) + "+");
  }

  render(root) {
    for (const child of root.children) {
      this.renderTopLevel(child, this.width);
    }
    return this.output;
  }

  renderTopLevel(node, w) {
    if (node.kind === "page") {
      this.push("+" + "-".repeat(w - 2) + "+");
      for (const child of node.children) {
        this.renderNode(child, w, 1);
      }
      this.push("+" + "-".repeat(w - 2) + "+");
    } else if (node.kind === "modal") {
      this.renderModal(node, w);
    }
  }

  renderModal(node, w) {
    const iw = w - 8;
    this.push("+" + "-".repeat(w - 2) + "+");
    this.push("|" + " ".repeat(w - 2) + "|");
    this.push("|   +" + "-".repeat(iw - 2) + "+   |");
    const titlePad = Math.max(iw - node.text.length - 8, 1);
    this.push(`|   | ${node.text}${" ".repeat(titlePad)}[X] |   |`);
    this.push("|   |" + "-".repeat(iw - 2) + "|   |");

    for (const child of node.children) {
      if (child.kind === "separator") {
        this.push("|   |" + "-".repeat(iw - 2) + "|   |");
      } else {
        this.renderNode(child, iw, 1, "|   ", "   |");
      }
    }

    this.push("|   +" + "-".repeat(iw - 2) + "+   |");
    this.push("|" + " ".repeat(w - 2) + "|");
    this.push("+" + "-".repeat(w - 2) + "+");
  }

  renderNode(node, w, pad = 1, wrapL = "", wrapR = "") {
    const addLine = (content) => {
      const inner = w - 2 - pad * 2;
      const line =
        "|" +
        " ".repeat(pad) +
        content.padEnd(inner) +
        " ".repeat(pad) +
        "|";
      this.push(wrapL + line + wrapR);
    };

    switch (node.kind) {
      case "nav":
        return this.renderNav(node, w, wrapL, wrapR);
      case "header":
      case "footer":
      case "filters":
      case "pagination":
        return this.renderRowGroup(node, w, pad, wrapL, wrapR);
      case "grid":
        return this.renderGrid(node, w, pad, wrapL, wrapR);
      case "card":
        return this.renderCard(node, w, pad, wrapL, wrapR);
      case "table":
        return this.renderTable(node, w, pad, wrapL, wrapR);
      case "form":
        return this.renderForm(node, w, pad, wrapL, wrapR);
      case "tabs":
        return this.renderTabs(node, w, pad, wrapL, wrapR);
      case "sidebar":
        return this.renderSidebar(node, w, pad, wrapL, wrapR);
      case "kpi":
        return this.renderKpi(node, addLine);
      case "chart":
        return this.renderChart(node, addLine);
      case "rank":
        return this.renderRank(node, addLine);
      case "progress":
        return this.renderProgress(node, addLine);
      case "separator":
        this.push(wrapL + "|" + "-".repeat(w - 2) + "|" + wrapR);
        return;
      case "text":
      case "note":
        addLine(node.text);
        return;
      case "section":
        for (const child of node.children) {
          this.renderNode(child, w, pad, wrapL, wrapR);
        }
        return;
      default:
        addLine(this.fmtElement(node));
        return;
    }
  }

  renderNav(node, w, wrapL, wrapR) {
    const items = node.children.map((c) =>
      c.text + (hasMod(c, "active") ? "*" : "")
    );
    const content = items.join(" | ");
    const inner = w - 4;
    this.push(wrapL + "+" + "-".repeat(w - 2) + "+" + wrapR);
    this.push(
      wrapL + "| " + content.padEnd(inner) + " |" + wrapR
    );
    this.push(wrapL + "+" + "-".repeat(w - 2) + "+" + wrapR);
  }

  renderRowGroup(node, w, pad, wrapL, wrapR) {
    const items = node.children.map((c) => this.fmtElement(c));
    const isRight = hasMod(node, "right");
    const inner = w - 2 - pad * 2;
    let content = items.join("   ");
    if (isRight) content = content.padStart(inner);
    this.push(
      wrapL +
        "|" +
        " ".repeat(pad) +
        content.padEnd(inner) +
        " ".repeat(pad) +
        "|" +
        wrapR
    );
  }

  renderGrid(node, w, pad, wrapL, wrapR) {
    const gridSpec = node.text.match(/(\d+)x(\d+)/);
    const cols = gridSpec ? parseInt(gridSpec[1]) : 1;

    const cells = node.children.filter((c) => c.kind === "cell");

    const cellW = Math.floor((w - 2 - pad * 2 - (cols - 1)) / cols);

    const rows = [];
    for (let i = 0; i < cells.length; i += cols) {
      rows.push(cells.slice(i, i + cols));
    }

    for (const row of rows) {
      const cellOutputs = row.map((cell) => {
        const span = parseInt(getModValue(cell, "span") || "1");
        const cw = cellW * span + (span - 1);
        return this.renderCellToLines(cell, cw);
      });

      const maxH = Math.max(...cellOutputs.map((o) => o.length));
      for (const co of cellOutputs) {
        const cw = co.length > 0 ? co[0].length : cellW;
        while (co.length < maxH) {
          co.push("|" + " ".repeat(cw - 2) + "|");
        }
      }

      const sep = "+" + "-".repeat(cellW - 2) + "+";
      const sepLine = wrapL + "|" + " ".repeat(pad) +
        row.map((cell) => {
          const span = parseInt(getModValue(cell, "span") || "1");
          const cw = cellW * span + (span - 1);
          return "+" + "-".repeat(cw - 2) + "+";
        }).join(" ") +
        " ".repeat(pad) + "|" + wrapR;

      this.push(sepLine);

      for (let h = 0; h < maxH; h++) {
        const parts = cellOutputs.map((co) => co[h]);
        this.push(
          wrapL +
            "|" +
            " ".repeat(pad) +
            parts.join(" ") +
            " ".repeat(pad) +
            "|" +
            wrapR
        );
      }

      this.push(sepLine);
    }
  }

  renderCellToLines(cell, w) {
    const sub = new Renderer(w);
    for (const child of cell.children) {
      sub.renderNode(child, w, 1, "", "");
    }
    return sub.output;
  }

  renderCard(node, w, pad, wrapL, wrapR) {
    const inner = w - 2 - pad * 2;
    const cardW = inner;
    const addOuter = (content) => {
      this.push(
        wrapL + "|" + " ".repeat(pad) + content.padEnd(inner) + " ".repeat(pad) + "|" + wrapR
      );
    };

    addOuter("+" + "-".repeat(cardW - 2) + "+");
    if (node.text) {
      addOuter("| " + node.text.padEnd(cardW - 4) + " |");
      addOuter("|" + "-".repeat(cardW - 2) + "|");
    }

    for (const child of node.children) {
      const sub = new Renderer(cardW);
      sub.renderNode(child, cardW, 1, "", "");
      for (const sl of sub.output) {
        addOuter(sl);
      }
    }

    addOuter("+" + "-".repeat(cardW - 2) + "+");
  }

  renderTable(node, w, pad, wrapL, wrapR) {
    const dataRows = [];
    const notes = [];

    for (const child of node.children) {
      if (child.kind === "head" || child.kind === "row") {
        const cells = child.text
          .split("|")
          .map((c) => c.trim().replace(/link\s+/g, "").replace(/"/g, ""));
        dataRows.push([child.kind, cells]);
      } else if (child.kind === "note") {
        notes.push(child.text);
      }
    }

    if (dataRows.length === 0) return;

    const maxCols = Math.max(...dataRows.map((r) => r[1].length));
    const colWidths = new Array(maxCols).fill(4);
    for (const [, cells] of dataRows) {
      for (let i = 0; i < cells.length; i++) {
        colWidths[i] = Math.max(colWidths[i], cells[i].length + 2);
      }
    }

    const fmtCells = (cells) => {
      const parts = cells.map((cell, i) => center(cell, colWidths[i] || 6));
      return "| " + parts.join(" | ") + " |";
    };
    const sep = () =>
      "+-" + colWidths.map((cw) => "-".repeat(cw)).join("-+-") + "-+";

    const tableLines = [sep()];
    for (const [kind, cells] of dataRows) {
      tableLines.push(fmtCells(cells));
      if (kind === "head") tableLines.push(sep());
    }
    for (const note of notes) {
      const totalInner =
        colWidths.reduce((a, b) => a + b, 0) + 3 * (colWidths.length - 1) + 4;
      tableLines.push("| " + center(note, totalInner - 4) + " |");
    }
    tableLines.push(sep());

    const inner = w - 2 - pad * 2;
    for (const tl of tableLines) {
      this.push(
        wrapL +
          "|" +
          " ".repeat(pad) +
          tl.padEnd(inner) +
          " ".repeat(pad) +
          "|" +
          wrapR
      );
    }
  }

  renderForm(node, w, pad, wrapL, wrapR) {
    const inner = w - 2 - pad * 2;
    const addLine = (content) => {
      this.push(
        wrapL +
          "|" +
          " ".repeat(pad) +
          content.padEnd(inner) +
          " ".repeat(pad) +
          "|" +
          wrapR
      );
    };
    addLine("");
    for (const child of node.children) {
      addLine("  " + this.fmtFormField(child));
    }
    addLine("");
  }

  renderTabs(node, w, pad, wrapL, wrapR) {
    const items = node.children
      .filter((c) => c.kind === "item")
      .map((c) => (hasMod(c, "active") ? `[${c.text}]` : ` ${c.text} `));
    const inner = w - 2 - pad * 2;
    this.push(
      wrapL +
        "|" +
        " ".repeat(pad) +
        items.join("  ").padEnd(inner) +
        " ".repeat(pad) +
        "|" +
        wrapR
    );
  }

  renderSidebar(node, w, pad, wrapL, wrapR) {
    const inner = w - 2 - pad * 2;
    const addLine = (content) => {
      this.push(
        wrapL +
          "|" +
          " ".repeat(pad) +
          content.padEnd(inner) +
          " ".repeat(pad) +
          "|" +
          wrapR
      );
    };
    for (const child of node.children) {
      if (child.kind === "item") {
        const mark = hasMod(child, "active") ? " >" : "  ";
        addLine(mark + " " + child.text);
      } else {
        this.renderNode(child, w, pad, wrapL, wrapR);
      }
    }
  }

  renderKpi(node, addLine) {
    const trend = node.mods.find((m) => m.startsWith("trend="));
    const trendStr = trend ? "  " + trend.slice(6) : "";
    const color = node.mods.find((m) => ["red", "green", "blue", "yellow"].includes(m));
    const colorMark = color ? ` (${color})` : "";
    const val = node.text.includes("=") ? node.text.split("=")[1].trim() : node.text;
    const label = node.text.includes("=") ? node.text.split("=")[0].trim() : "";
    if (label) {
      addLine(`${label}${colorMark}`);
      addLine(`  ${val}${trendStr}`);
    } else {
      addLine(`${val}${trendStr}${colorMark}`);
    }
  }

  renderChart(node, addLine) {
    const chartType = node.mods.find((m) =>
      ["bar", "line", "pie", "gauge", "map", "scatter", "radar", "heatmap"].includes(m)
    ) || "chart";
    const icon = {
      bar: "📊", line: "📈", pie: "◉", gauge: "◎",
      map: "🗺", scatter: "⁘", radar: "◇", heatmap: "▦",
    }[chartType] || "📊";

    addLine(`${icon} ${node.text || chartType}`);

    for (const child of node.children) {
      if (child.kind === "x" || child.kind === "series") {
        addLine(`  ${child.kind === "x" ? "X" : "▸"} ${child.text}`);
      } else if (child.kind === "item") {
        addLine(`  · ${child.text}`);
      }
    }
  }

  renderRank(node, addLine) {
    addLine(`🏆 ${node.text}`);
    for (const child of node.children) {
      if (child.kind === "ranked-item") {
        addLine(`  ${child.text}`);
      } else if (child.kind === "item") {
        addLine(`  · ${child.text}`);
      }
    }
  }

  renderProgress(node, addLine) {
    const val = node.text.includes("=") ? node.text.split("=")[1].trim() : "0%";
    const label = node.text.includes("=") ? node.text.split("=")[0].trim() : node.text;
    const pct = parseInt(val) || 0;
    const barW = 20;
    const filled = Math.round((pct / 100) * barW);
    const bar = "█".repeat(filled) + "░".repeat(barW - filled);
    addLine(`${label}: [${bar}] ${val}`);
  }

  // --- element formatting ---

  fmtFormField(node) {
    const required = hasMod(node, "必填") ? " *" : "";
    const text = node.text;

    if (node.kind === "input") return `[${text}]${required}`;
    if (node.kind === "select") {
      if (text.includes("=")) {
        const [label, val] = text.split("=", 2);
        return `${label.trim()}: [${val.trim()}  ▼]${required}`;
      }
      return `[${text}  ▼]${required}`;
    }
    if (node.kind === "textarea") {
      const rowsMod = node.mods.find((m) => m.includes("行")) || "";
      return `[${text}]${required} ${rowsMod}`;
    }
    if (node.kind === "upload") return `[📎 ${text}]`;
    return this.fmtElement(node);
  }

  fmtElement(node) {
    if (node.kind === "btn") {
      let style = "";
      if (hasMod(node, "primary")) style = "■";
      else if (hasMod(node, "ghost")) style = "○";
      else if (hasMod(node, "danger")) style = "✕";
      return style ? `[${style} ${node.text}]` : `[${node.text}]`;
    }
    if (node.kind === "link") return node.text;
    if (node.kind === "text") return node.text;
    if (node.kind === "img") return `[img: ${node.text}]`;
    if (node.kind === "input") return `[${node.text}...]`;
    if (node.kind === "select") {
      if (node.text.includes("=")) {
        const [label, val] = node.text.split("=", 2);
        return `${label.trim()}: [${val.trim()} ▼]`;
      }
      return `[${node.text} ▼]`;
    }
    if (node.kind === "item") {
      return node.text + (hasMod(node, "active") ? "*" : "");
    }
    return node.text;
  }
}

// --------------- Main ---------------

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("用法: node render-wireframe.mjs <Sketch-Decode.md>");
    process.exit(1);
  }

  const mdPath = resolve(args[0]);
  let content;
  try {
    content = readFileSync(mdPath, "utf-8");
  } catch {
    console.log(`文件不存在: ${mdPath}`);
    process.exit(1);
  }

  const blocks = extractDslBlocks(content);
  if (blocks.length === 0) {
    console.log("未找到布局还原 DSL 代码块");
    process.exit(1);
  }

  for (const [title, dsl] of blocks) {
    console.log(`\n${"=".repeat(78)}`);
    console.log(`  ${title}`);
    console.log(`${"=".repeat(78)}\n`);
    const tree = parseDsl(dsl);
    const renderer = new Renderer(78);
    const rendered = renderer.render(tree);
    for (const line of rendered) {
      console.log(line);
    }
    console.log();
  }
}

main();

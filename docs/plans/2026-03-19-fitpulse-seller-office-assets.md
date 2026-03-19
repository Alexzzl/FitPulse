# FitPulse Seller Office Assets Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 FitPulse 生成三星 TV Seller Office 提审文档、自动截图工具和 UI Description PPT 生成脚本。

**Architecture:** 复用 MoneTV 已验证的 Seller Office 资料结构和无依赖 CDP 截图方式，但按 FitPulse 的页面流转、截图顺序和应用文案重写。PPT 继续基于三星模板填充，输出 FitPulse 专用的 UI Description。

**Tech Stack:** Node.js ESM, Chrome DevTools Protocol, Python, python-pptx, Pillow

---

### Task 1: 提审文档

**Files:**
- Create: `docs/samsung-tv-seller-office-上线流程.md`
- Create: `docs/samsung-tv-seller-office-字段填写模板.md`
- Create: `docs/samsung-tv-ui-description-pptx-中文大纲.md`

**Step 1:** 根据 Seller Office 官方流程整理 FitPulse 的实际提交顺序。

**Step 2:** 将 FitPulse 当前包信息、页面结构、素材要求和风险点写入中文文档。

**Step 3:** 补齐字段填写模板，给出可直接复制的英文标题、描述、测试说明。

### Task 2: 截图脚本

**Files:**
- Create: `tools/capture-store-screenshots.mjs`
- Create: `tools/capture-ui-description-screenshots.mjs`
- Modify: `src/main.js`
- Modify: `src/app.js`
- Modify: `package.json`

**Step 1:** 暴露只读/调试友好的应用实例入口，供自动化脚本调用。

**Step 2:** 写商店截图脚本，自动打开应用并依次截取 4 张商店图。

**Step 3:** 写 UI Description 截图脚本，自动跑核心流程并截取补充页面。

**Step 4:** 为脚本补充 `npm` 命令。

### Task 3: PPT 生成

**Files:**
- Create: `tools/fill-app-description-ppt.py`
- Create: `docs/outputs/`（运行时生成文件）

**Step 1:** 基于三星模板填充 FitPulse 的标题、Revision、页面结构、使用场景和按键说明。

**Step 2:** 引用商店截图和 UI Description 截图生成拼图页。

**Step 3:** 输出 FitPulse 专用 PPTX。

### Task 4: 验证

**Files:**
- Verify: `docs/*.md`
- Verify: `tools/*.mjs`
- Verify: `tools/*.py`

**Step 1:** 运行截图脚本，确认图片成功生成。

**Step 2:** 运行 PPT 填充脚本，确认 PPTX 成功生成。

**Step 3:** 重新跑 `npm test` 和 `npm run build`，确认本项目原有功能未被破坏。

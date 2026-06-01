# FitPulse TV 应用重新提交审核指南

本文档指导如何将修复后的 FitPulse TV 应用重新提交到三星 TV 应用商店审核。

## 📋 修改内容概览

### 🔧 核心修复
针对三星审核被拒的 **"Return Key Policy"** 问题，我们已实现以下功能：

1. **首页退出确认功能**
   - 在首页（`/` 或 `/home`）按返回键时显示退出确认对话框
   - 用户必须确认"是"才能退出应用
   - 符合三星 TV 应用开发指南要求

2. **退出确认对话框**
   - 独立的 HTML 确认弹窗组件
   - 支持遥控器导航（左右选择，确认执行）
   - 与现有 UI 风格保持一致

3. **应用退出 API**
   - 正确调用 `tizen.application.getCurrentApplication().exit()`
   - 包含错误处理机制
   - 退出前自动清理资源（停止计时器）

### 📁 修改的文件

| 文件 | 修改内容 | 状态 |
|------|----------|------|
| `src/app.js` | 添加退出确认逻辑、对话框实现、tizen退出API | ✅ 已完成 |
| `src/styles.css` | 添加确认对话框样式支持 | ✅ 已完成 |

## 🚀 重新提交步骤

### 步骤 1：验证修改

```bash
# 1. 构建项目确保无错误
npm run build

# 2. 检查构建输出
# 确认 dist/ 目录生成成功，无编译错误
```

### 步骤 2：测试功能

#### 手动测试场景：
1. **首页返回键测试**
   - 启动应用，进入首页
   - 按返回键 → 应显示退出确认对话框
   - 选择"否" → 应返回首页
   - 选择"是" → 应退出应用

2. **其他页面返回键测试**
   - 在各页面按返回键 → 应正常返回上一页
   - 运动页面按返回键 → 应停止计时器并返回计划页面

3. **遥控器导航测试**
   - 在确认对话框中使用方向键切换选项
   - 确认键选择功能正常

### 步骤 3：准备提交材料

#### 必查清单：
- ✅ 应用已通过构建测试
- ✅ 返回键功能测试完成
- ✅ 退出确认对话框正常工作
- ✅ 原有功能未受影响
- ✅ 应用图标和截图已更新（如需要）

### 步骤 4：生成安装包

```bash
# 根据 BUILD.md 中的说明生成 wgt 包
# 确保使用正确的签名证书
```

### 步骤 5：提交到三星 Seller Office

1. 登录 [Samsung Apps TV Seller Office](https://seller.samsungapps.com/tv/)
2. 找到 FitPulse TV 应用
3. 点击"更新应用"或"重新提交审核"
4. 上传新的 wgt 安装包
5. 在说明中提及：
   ```
   修复了返回键策略问题：
   - 添加了首页退出确认功能
   - 实现符合三星TV开发指南的退出流程
   - 用户必须在首页确认退出才能终止应用
   ```

## 📝 审核说明建议

在提交审核时，建议在描述中明确说明：

```
本次更新主要修复：

1. 返回键策略合规性
   - 在首页按返回键时显示退出确认对话框
   - 用户确认"是"后才调用 tizen.application.getCurrentApplication().exit()
   - 符合三星TV开发指南：https://developer.samsung.com/smarttv/develop/guides/fundamentals/terminating-applications.html

2. 用户体验优化
   - 退出确认对话框支持遥控器导航
   - 退出前自动停止所有活动计时器
   - 保持与其他页面一致的返回逻辑

测试验证：
- 首页返回键：显示确认对话框 ✅
- 其他页面返回键：正常返回上一页 ✅
- 运动页面返回键：停止计时器并返回计划页 ✅
- 遥控器操作：方向键和确认键正常工作 ✅
```

## 🆕 What's New in This Version

```
FitPulse TV v1.0.2 Update Summary:

### Key Improvements
- **Exit Confirmation**: Added exit confirmation dialog when pressing back key on home page to prevent accidental exits
- **Compliance Fix**: Implemented return key policy that meets Samsung TV app development guidelines
- **UX Enhancement**: Added remote control navigation support for better user experience

### Feature Details
- New exit confirmation dialog on home page
- Optimized application exit flow
- Enhanced remote control operation experience
- Automatic resource cleanup to prevent memory leaks

### Issues Fixed
- Fixed return key policy compliance issues that caused previous Samsung review rejection
- Ensured application can successfully pass Samsung TV app store review

---

FitPulse TV v1.0.2 更新内容：

### 主要改进
- **退出确认功能**：在首页按返回键时显示退出确认对话框，防止误操作
- **合规性修复**：符合三星TV应用开发指南的返回键策略要求
- **用户体验优化**：支持遥控器导航操作，界面更加友好

### 功能详情
- 新增首页退出确认对话框
- 优化应用退出流程
- 改进遥控器操作体验
- 自动清理资源防止内存泄漏

### 修复问题
- 修复了之前版本中返回键策略不符合三星审核要求的问题
- 确保应用能够正常通过三星TV应用商店审核
```

## 🧪 Note for Tester

```
Notes for Tester:

### Key Testing Items
1. **Return Key Functionality Test**
   - Exit confirmation dialog must appear when pressing back key on home page
   - Confirmation dialog must have clear "Yes/No" options
   - Application should exit normally when selecting "Yes"
   - Should return to home page when selecting "No"

2. **Remote Control Operation Test**
   - Confirmation dialog must support left/right arrow keys for option switching
   - Enter/OK key should correctly execute the selected action
   - Test display effects at different resolutions

3. **Other Page Return Test**
   - Ensure return key functionality works normally on non-home pages
   - Exercise page return key should stop timer and return to plan page
   - Verify page navigation logic is correct

4. **Edge Case Testing**
   - Test behavior when pressing return key multiple times consecutively
   - Verify behavior when pressing return key during loading states
   - Check if Tizen API calls are correct

### Testing Environment Requirements
- Must be tested on Tizen emulator or real device
- Verify remote control button responses
- Ensure no crashes occur in non-Tizen environments

### Acceptance Criteria
- [ ] Home page return key shows confirmation dialog
- [ ] Exit functionality works correctly
- [ ] Remote control navigation works properly
- [ ] Original functionality remains unaffected
- [ ] Complies with Samsung TV development guidelines

---

测试人员注意事项：

### 重点测试项目
1. **返回键功能测试**
   - 在首页按返回键必须显示退出确认对话框
   - 确认对话框必须有清晰的"是/否"选项
   - 选择"是"后应用应正常退出
   - 选择"否"后应返回首页

2. **遥控器操作测试**
   - 确认对话框支持左右方向键切换选项
   - 确认键应能正确执行选择的操作
   - 测试在不同分辨率下的显示效果

3. **其他页面返回测试**
   - 确保非首页的返回键功能正常
   - 运动页面的返回键应停止计时器并返回计划页
   - 验证页面导航逻辑正确

4. **边界情况测试**
   - 测试连续多次按返回键的情况
   - 验证在加载状态下按返回键的行为
   - 检查tizen API调用是否正确

### 测试环境要求
- 必须在Tizen模拟器或真机上测试
- 验证遥控器按键响应
- 确保在非tizen环境下不会崩溃

### 验收标准
- [ ] 首页返回键显示确认对话框
- [ ] 退出功能正常工作
- [ ] 遥控器导航正常
- [ ] 原有功能未受影响
- [ ] 符合三星TV开发指南要求
```

## ⚠️ 注意事项

### 常见审核失败原因
1. **退出功能不完整**
   - 确保在首页按返回键一定显示确认对话框
   - 确认对话框必须有明确的"是/否"选项

2. **API调用错误**
   - 必须使用 `tizen.application.getCurrentApplication().exit()`
   - 不能直接调用 `window.close()` 或其他非标准方法

3. **用户体验问题**
   - 确认对话框要清晰易懂
   - 支持遥控器操作
   - 默认焦点设置合理

### 测试环境验证
- **Tizen 模拟器**：测试遥控器按键响应
- **实机测试**：验证退出功能在真实设备上的表现
- **浏览器测试**：确保在非tizen环境下不会崩溃

## 🔍 问题排查

### 问题：构建失败
```bash
# 检查语法错误
npm run build

# 查看详细错误信息
node scripts/build.mjs --verbose
```

### 问题：退出功能不工作
1. 检查浏览器控制台是否有错误
2. 确认 tizen 对象是否可用：`console.log(globalThis.tizen)`
3. 验证返回键事件是否正确触发

### 问题：样式显示异常
1. 检查样式是否正确加载
2. 确认 modal-card 相关样式未被覆盖
3. 验证响应式布局在不同分辨率下的表现

## 📞 联系支持

如遇技术问题，可联系：
- 三星开发者支持：https://developer.samsung.com/support
- Tizen 开发文档：https://developer.samsung.com/smarttv/develop/

---

---

## 🔧 v1.0.4 修复内容 (2026-05-27 审核被拒)

### 缺陷清单

本次审核在 **12 个 TV 型号**（Tizen 9.0 和 10.0）上被拒，共 **24 个缺陷**：

| 缺陷 | 严重等级 | 状态 |
|------|---------|------|
| [TR][Playback][VPN/Out network][ATSC] Network error does not remain on screen | B | 已修复 |
| [TR][Basic Fuction][VPN/Out network][ATSC] TTS works in the app | B | 已修复 |

### 修复 1：网络错误弹窗保持显示

**问题**：在 VPN/断网场景下，网络错误弹窗在 8 秒后自动消失，审核要求错误提示必须保持在屏幕上直到用户手动关闭。

**修复文件**：[src/network-monitor.js](../src/network-monitor.js)

**修改内容**：
- 移除 `POPUP_AUTO_HIDE_DELAY` 常量（8 秒自动隐藏定时器）
- 移除 `hideTimeout` 变量
- 移除 `resetAutoHide()` 函数
- 移除 `showNetworkErrorPopup()` 和 `hideNetworkErrorPopup()` 中对自动隐藏的所有调用
- 网络错误弹窗现在会**一直保持显示**，直到用户按 OK 按钮或点击关闭

### 修复 2：TTS 支持声明

**问题**：`config.xml` 中声明 `tts-support="disable"`，但 Tizen 系统的 TTS（屏幕阅读器）仍会朗读应用文本内容。三星审核指南要求：如果 TTS 在应用中实际可用，必须声明为 `enable`。

**修复文件**：[config.xml](../config.xml)

**修改内容**：
- 第 17 行：`tts-support="disable"` → `tts-support="enable"`

### 涉及的 TV 型号

| 型号 | Tizen 版本 | 网络错误 | TTS |
|------|-----------|---------|-----|
| 26TV_PREMIUM2 | 10.0 | ✅ | ✅ |
| 26TV_PREMIUM1 | 10.0 | ✅ | ✅ |
| 26TV_BASIC1 | 10.0 | ✅ | ✅ |
| 25TV_STANDARD1 | 9.0 | ✅ | ✅ |
| 25TV_PREMIUM4 | 9.0 | ✅ | ✅ |
| 25TV_PREMIUM3 | 9.0 | ✅ | ✅ |
| 25TV_PREMIUM2 | 9.0 | ✅ | ✅ |
| 25TV_PREMIUM1 | 9.0 | ✅ | ✅ |
| 25TV_BASIC3 | 9.0 | ✅ | ✅ |
| 25TV_BASIC2 | 9.0 | ✅ | ✅ |
| 25TV_BASIC1 | 9.0 | ✅ | ✅ |

### v1.0.4 审核说明建议

```
本次更新修复了 2026-05-27 审核被拒的 2 个问题：

1. 网络错误弹窗保持显示
   - 移除了网络错误弹窗的 8 秒自动隐藏定时器
   - 断网时错误弹窗将一直保持显示，直到用户手动确认关闭
   - 符合三星 TV 应用的错误提示规范

2. TTS 支持声明修正
   - 将 config.xml 中的 tts-support 从 disable 改为 enable
   - 应用内容可被系统 TTS 正确朗读
   - 符合三星 TV 应用的辅助功能规范

测试验证：
- VPN/断网场景：网络错误弹窗保持显示 ✅
- TTS：系统屏幕阅读器可正常朗读应用内容 ✅
```
### Defect Resolve 表单填写

#### 缺陷 1: [TR][Playback][VPN/Out network][ATSC] Network error does not remain on screen

**1. Defect Cause:** App Defect

**2. Solution Type:** Fixed

**3. Solution Explanation:**
```
The network error popup was configured to auto-dismiss after 8 seconds (POPUP_AUTO_HIDE_DELAY timer in src/network-monitor.js), which caused the error message to disappear without user acknowledgment. This did not meet the Samsung TV requirement that error notifications must remain visible until the user manually dismisses them.

Fix applied in src/network-monitor.js:
- Removed the 8-second auto-hide timer (POPUP_AUTO_HIDE_DELAY constant, hideTimeout variable, and resetAutoHide() function)
- The network error popup now stays on screen persistently until the user presses the OK button or selects dismiss via remote control
- No changes to popup display logic or network detection mechanism — only the auto-dismiss behavior was removed

Verification: Tested on VPN/out-of-network scenario — the network error popup remains on screen and only dismisses when the user presses OK.
```

#### 缺陷 2: [TR][Basic Fuction][VPN/Out network][ATSC] TTS works in the app

**1. Defect Cause:** App Defect

**2. Solution Type:** Fixed

**3. Solution Explanation:**
```
The config.xml manifest declared tts-support="disable", but the Tizen system-level TTS (screen reader) was still able to read the app's text content aloud. Samsung TV app review guidelines require that if TTS functionality works within the app, the manifest must correctly declare tts-support="enable" to reflect the actual behavior.

Fix applied in config.xml:
- Changed tts-support="disable" to tts-support="enable" on line 17 of the tizen:setting element
- No code changes required — the app's text content is already compatible with system TTS, and the manifest now correctly reflects this

Verification: The app's UI text elements (buttons, labels, headings) are properly structured and can be read by the Tizen system TTS engine. The config.xml declaration now matches the actual app behavior.
```

### Seller Office 提交字段

#### What's new in this version (面向用户)
```
What's new in this version:

- The network error notification now remains on screen until you dismiss it, ensuring you never miss important connection alerts.
- Improved accessibility support for on-screen text reading.
```

#### Note for Tester (面向审核人员)
```
Note for Tester:

1. Network Error Popup - Persistent Display
   - Disconnect the device from the network (or use VPN to simulate network loss) during video playback
   - Verify that the "Network Disconnected" popup appears and remains on screen
   - Verify the popup does NOT auto-dismiss after any time period
   - Press OK on the remote control to dismiss the popup
   - Verify the popup dismisses correctly after user confirmation

2. TTS (Text-to-Speech) Support Declaration
   - Verify that config.xml declares tts-support="enable"
   - Enable system TTS (screen reader) on the TV
   - Navigate through the app screens
   - Verify on-screen text elements (buttons, labels, headings) are readable by the system TTS engine
   - No change to actual TTS behavior — only the manifest declaration was corrected

Testing Environment: Tizen TV (9.0 / 10.0), VPN/out-of-network conditions
Affected Models: 26TV_PREMIUM2, 26TV_PREMIUM1, 26TV_BASIC1 (Tizen 10.0); 25TV_STANDARD1, 25TV_PREMIUM4, 25TV_PREMIUM3, 25TV_PREMIUM2, 25TV_PREMIUM1, 25TV_BASIC3, 25TV_BASIC2, 25TV_BASIC1 (Tizen 9.0)
```

---

**最后更新时间**：2026年6月1日
**适用版本**：FitPulse TV v1.0.4
**审核状态**：已修复网络错误弹窗和TTS声明问题
# FitPulse 在 seller.samsungapps.com 的上架流程

适用项目：`FitPulse`

Seller Office 地址：
<https://seller.samsungapps.com/>

最后核对官方文档日期：`2026-03-19`

官方参考：
- <https://developer.samsung.com/tv-seller-office/application-publication-process.html>
- <https://developer.samsung.com/tv-seller-office/guides/applications/entering-application-information.html>
- <https://developer.samsung.com/tv-seller-office/guides/applications/distributing-application.html>
- <https://developer.samsung.com/tv-seller-office/checklists-for-distribution/launch-checklist.html>
- <https://developer.samsung.com/tv-seller-office/checklists-for-distribution/application-ui-description.html>
- <https://developer.samsung.com/smarttv/design/app-icons-and-screenshots.html>
- <https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html>

## 1. 先确认卖家资格

如果你要上架海外市场，不要只看能不能登录 Seller Office。

当前三星 TV Seller Office 规则里：

- `Public Seller`：只能发布美国。
- `Partner Seller`：要发布美国以外国家或地区时，需要这个资格。

所以 FitPulse 如果准备上欧洲、东南亚、中东、拉美等市场，前提是：

1. 先开通 TV Seller Office。
2. 再申请 `Partner Seller`。
3. 等三星审批通过后，再在 Seller Office 里选择非美国地区。

## 2. 上架前要准备什么

正式进 `seller.samsungapps.com` 之前，建议先把下面内容准备齐：

- 已签名的 `.wgt` 安装包
- `config.xml`
- 应用图标
- `1920x1080` 商店图片
- `512x423` PNG 图标
- 至少 4 张商店截图
- 英文应用标题和描述
- 隐私政策 URL
- 客服邮箱
- 卖家主体信息
- App UI Description `PPTX`
- 测试说明

本项目建议用这些命令生成提审素材：

```powershell
npm run build
npm run capture:store
npm run capture:ui
npm run ppt:fill
```

## 3. 本项目当前建议的提审顺序

建议按这个顺序走，最省返工：

1. 修改好 `config.xml` 里的正式 ID、版本号、应用名。
2. 执行 `npm run build`。
3. 用 Tizen Studio 证书把 `dist/` 打包成签名后的 `.wgt`。
4. 真机安装，至少完整回归一遍核心流程。
5. 生成商店截图。
6. 生成 UI Description 补充截图。
7. 生成并检查 UI Description `PPTX`。
8. 登录 Seller Office 创建应用。
9. 上传 `.wgt`。
10. 跑 `Pre-Test`。
11. 填写 App Images、Title/Description、Service Info、Country/Region、Test Information。
12. 上传 UI Description `PPTX`。
13. 在 `Distribute` 页面提交认证。

## 4. FitPulse 当前提审素材位置

这些路径是本项目后续实际会用到的：

- 打包配置：[`config.xml`](/E:/code/workspace/FitPulse0/config.xml)
- 商店截图输出目录：[`store-screenshots`](/E:/code/workspace/FitPulse0/store-screenshots)
- UI Description 截图输出目录：[`ui-description-screenshots`](/E:/code/workspace/FitPulse0/ui-description-screenshots)
- UI Description PPT 输出目录：[`docs/outputs`](/E:/code/workspace/FitPulse0/docs/outputs)
- 商店截图脚本：[`tools/capture-store-screenshots.mjs`](/E:/code/workspace/FitPulse0/tools/capture-store-screenshots.mjs)
- UI 截图脚本：[`tools/capture-ui-description-screenshots.mjs`](/E:/code/workspace/FitPulse0/tools/capture-ui-description-screenshots.mjs)
- PPT 生成脚本：[`tools/fill-app-description-ppt.py`](/E:/code/workspace/FitPulse0/tools/fill-app-description-ppt.py)

## 5. Seller Office 里的实际页面流转

### Step 1：Create App

进入 `Applications > Create App`：

1. 填 `Application Name`
2. 选 `Application Type`
3. 选 `Default Language`
4. 创建应用

注意：

- 这里的 `Application Name` 是 Seller Office 内部管理名。
- `TV 上展示的标题` 还要在 `Title/Description on TV` 里填。

### Step 2：App Package

进入 `Applications > App Package`：

1. 上传签名后的 `.wgt`
2. 等待系统自动执行 `Pre-Test`
3. 如果失败，先修包体或元信息，再重新上传

这一页重点检查：

- 包体里有 `config.xml`
- 包体已签名
- 版本号递增
- Application ID / Package ID 格式正确
- TV profile 正确

### Step 3：App Images

进入 `Applications > App Images`：

1. 上传 `1920x1080` 店铺图片
2. 上传 `512x423` PNG 图标
3. 上传至少 4 张 `JPG` 截图

本项目建议的商店截图顺序：

1. Home
2. Library
3. Classic Programs
4. Workout Player

### Step 4：Title/Description on TV

进入 `Applications > Title/Description on TV`：

1. 填默认语言下的 `App Title`
2. 填 `Short Description`
3. 填 `Full Description`
4. 填搜索关键词
5. 如果要多语种发布，再补其他语言

注意：

- 默认语言下的 `App Title` 最好和包内 `config.xml` 的 `<name>` 保持一致。
- 不要把当前没有实现的功能写进描述里。

### Step 5：Service Info

进入 `Applications > Service Info`：

这里一般会涉及：

- Service Category
- Age Rating
- Language
- Privacy Policy
- Seller Information
- 地区合规材料

对 FitPulse，建议特别检查：

- 是否真的有登录
- 是否真的有付费
- 是否真的有广告
- 隐私政策 URL 是否能在公网打开

### Step 6：Service Country/Region

进入 `Applications > Service Country/Region`：

1. 选择目标国家或地区
2. 保存

注意：

- 只有你有实际运营支持、合规材料和客服承接能力的国家才建议勾选。
- 海外发布时要先确认 `Partner Seller` 已开通。

### Step 7：Verification / Test Information

进入相关测试信息页面，补以下内容：

- 是否需要测试账号
- 测试步骤
- 遥控器操作说明
- 如有限制条件，需要额外说明

FitPulse 当前建议写法：

- 无需登录
- 无需内购
- 使用方向键、Enter、Back 完成主要流程验证

### Step 8：上传 UI Description

进入要求上传 UI Description 的位置后：

1. 上传 `PPTX`
2. 确认包含主要页面说明
3. 确认包含遥控器按键说明
4. 确认包含核心流程图

UI Description 不完整，是三星 TV 应用被打回的高频原因。

### Step 9：Distribute

进入 `Applications > Distribute`：

1. 选目标机型组
2. 确认 `Pre-Test` 已通过
3. 预览提审内容
4. 提交

提交后如果被打回，通常会在 Seller Office 里看到 defect 或 review comment。

## 6. FitPulse 这次最容易踩的坑

### 6.1 包内 ID 和商店信息不一致

最常见的问题不是代码，而是这些值不统一：

- `config.xml` 的 `<name>`
- `config.xml` 的 `widget id`
- `config.xml` 的 `application id`
- Seller Office 默认语言标题
- 商店素材命名

### 6.2 焦点逻辑问题

FitPulse 是强 TV 遥控器导向应用，审核时很容易测这些：

- 焦点是否会丢失
- 焦点是否卡死
- 焦点到边缘是否乱跳
- Sidebar 和内容区切换是否自然
- Back 键返回是否符合电视使用习惯

### 6.3 文案写得比功能多

当前建议只写真实可用的核心能力：

- Home 推荐
- Library 按部位浏览
- Classic Programs
- Workout Plan / Day Detail
- Workout Player
- History

不要提前写这些还没实装的能力：

- 账号体系
- 订阅付费
- 搜索结果页
- 多语言切换菜单
- 社交分享

### 6.4 素材不完整

Seller Office 常见卡点：

- 截图不满 4 张
- 截图不是 `JPG`
- 截图尺寸不符
- `512x423` PNG 图标没传
- UI Description `PPTX` 缺页

## 7. 提交前自查清单

- 已确认 `Partner Seller` 状态
- `config.xml` 已改成正式 ID 和正式版本号
- 已执行 `npm run build`
- 已生成签名 `.wgt`
- 已在真机验证方向键 / Enter / Back
- 已验证 Home / Library / Classic / History / Plan / Workout 主流程
- 已生成 4 张商店截图
- 已生成 UI Description 补充截图
- 已生成 `PPTX`
- 已准备英文标题、描述、关键词
- 已准备隐私政策 URL
- 已准备客服邮箱
- `Pre-Test` 已通过

## 8. 这套文档配套文件

- 字段填写模板：[`docs/samsung-tv-seller-office-字段填写模板.md`](/E:/code/workspace/FitPulse0/docs/samsung-tv-seller-office-字段填写模板.md)
- UI Description 中文大纲：[`docs/samsung-tv-ui-description-pptx-中文大纲.md`](/E:/code/workspace/FitPulse0/docs/samsung-tv-ui-description-pptx-中文大纲.md)

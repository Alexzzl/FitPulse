# FitPulse 三星电视商店上架说明

最后核对官方文档日期：2026-03-18

这份文档是按你当前这个项目写的：

- 应用类型：Samsung Smart TV Web App
- 打包格式：`.wgt`
- 当前构建目录：`dist/`
- 目标：上架海外三星电视商店

## 1. 关键结论

- 海外发布先申请 `Partner Seller`。
- `Public Seller` 目前只能发布美国。
- 每次提审都要升版本号。
- 后续版本更新需要继续使用同一个 author certificate。
- author certificate 和密码一定要备份。

## 2. 你的实操顺序

1. 准备 Samsung account 和 TV Seller Office 账号。
2. 申请 `Partner Seller`。
3. 安装 Tizen Studio、Samsung TV Extension、Samsung Certificate Extension。
4. 检查 `config.xml` 里的 Widget ID / Package ID / Application ID / version。
5. 执行 `npm run build`。
6. 用证书把 `dist/` 打包成签名后的 `.wgt`。
7. 先在真机上安装和测试。
8. 登录 Seller Office 创建应用、填资料、传素材、传 `.wgt`。
9. 跑 Pre-Test。
10. 填写 QA 测试说明并提交认证。
11. 过审后再选择国家和机型组发布。

## 3. 打包命令

先构建：

```powershell
npm run build
```

然后打包签名：

```powershell
tizen cli-config "default.profiles.path=C:\\path\\to\\profiles.xml"
tizen package -t wgt -s <你的证书配置名> -- E:\code\workspace\FitPulse0\dist
```

## 4. 提审前必须准备的内容

- 签名后的 `.wgt`
- 应用图标
- `1920x1080` 应用图
- `512x423` 应用图
- 至少 4 张 `JPG` 截图
- 英文 App Name
- 英文 Short Description
- 英文 Long Description
- Support Email
- Privacy Policy URL
- 测试说明
- 如果需要登录，还要准备 QA 测试账号

## 5. Seller Office 可以直接照填的内容

下面这些是我根据你现在这个项目整理的提交稿，不是三星官方逐字模板。

- App Name：`FitPulse`
- Default Language：`English`
- App Type：`TV Web App`
- Category：以 Seller Office 实际下拉项为准，建议选最接近 Fitness / Health / Sports / Lifestyle 的类目。这里是基于应用内容的推断。
- Support Email：填你真实会看的邮箱
- Privacy Policy URL：填你的隐私政策页面
- Support URL：有官网或帮助页就填，没有也建议尽快补一个

### Short Description 英文示例

`A remote-friendly fitness app for Samsung Smart TV with guided home workouts, workout plans, and easy focus-based navigation.`

### Long Description 英文示例

`FitPulse is a fitness experience designed for Samsung Smart TV. Users can browse workout plans, explore body-part-based training, continue daily routines, and navigate every screen with the TV remote. The app is optimized for large-screen viewing, simple directional focus movement, and fast access to guided home workouts.`

## 6. QA 测试说明模板

如果你现在没有登录功能，可以直接填下面这段英文：

```text
Launch the app and wait for the Home screen. The app is fully navigated with the Samsung TV remote.

Use Arrow Up, Down, Left, and Right to move focus. Press Enter to select the focused item. Press Back to return to the previous screen.

Main test path: Home -> Library -> Classic -> Plan Calendar -> Day Detail -> Start Workout -> Back.

Focus movement is directional and stops at screen edges. On sidebar-based screens, focus can move between the sidebar and the content area with Left and Right.

No login is required for testing. All core flows are accessible without an account.
```

## 7. 最容易被打回的点

- `Partner Seller` 没开通就想选非美国市场
- 版本号没升
- 签名不对
- `config.xml` 的 ID 和 Seller Office 资料不一致
- 图标或截图尺寸不符合要求
- Privacy Policy URL 打不开
- 焦点丢失、焦点卡死、Back 键返回异常
- 真机上文字被裁切或资源加载失败

## 8. 你提审当天的执行顺序

1. 确认 `Partner Seller` 已开通。
2. 确认 `config.xml` 的 ID 和 version 正确。
3. 执行 `npm run build`。
4. 生成签名 `.wgt`。
5. 真机安装回归一遍。
6. 准备图标、应用图、截图。
7. 登录 Seller Office 填基础资料。
8. 上传 `.wgt` 并跑 Pre-Test。
9. 填 QA 测试说明。
10. 提交认证。
11. 过审后再发布到选定国家和机型组。

## 9. 适合你的最终 checklist

- TV Seller Office 已开通
- `Partner Seller` 已拿到
- `config.xml` 的 Widget ID / Package ID / App ID 已定稿
- version 已升
- 证书已备份
- `npm run build` 已执行
- 签名 `.wgt` 已生成
- 真机已测通
- Home / Library / Classic / Me / History / Workout 主流程已验证
- 遥控器方向键 / Enter / Back 已验证
- 图标、`1920x1080` 应用图、`512x423` 应用图已备好
- 至少 4 张 `JPG` 截图已备好
- 英文 App Name / Short Description / Long Description 已备好
- Support Email 和 Privacy Policy URL 已备好
- QA 测试说明已写好
- Pre-Test 已通过
- 已提交认证

## 10. 官方参考链接

- TV Seller Office 总览：https://developer.samsung.com/tv-seller-office
- Seller 会员说明：https://developer.samsung.com/tv-seller-office/guides/membership/becoming-seller-office-member.html
- Partner 会员说明：https://developer.samsung.com/tv-seller-office/guides/membership/becoming-partner.html
- 应用发布流程：https://developer.samsung.com/tv-seller-office/application-publication-process.html
- 应用信息填写：https://developer.samsung.com/tv-seller-office/guides/applications/entering-application-information.html
- 应用分发说明：https://developer.samsung.com/tv-seller-office/guides/applications/distributing-application.html
- 上线检查清单：https://developer.samsung.com/tv-seller-office/checklists-for-distribution/launch-checklist.html
- Smart TV 开发检查清单：https://developer.samsung.com/smarttv/develop/development-checklist/development-checklist.html
- 遥控器开发说明：https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html
- 证书创建说明：https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html

# FitPulse 的 Seller Office 字段填写模板

适用项目：`FitPulse`

配套文档：

- [上线流程](E:/code/workspace/FitPulse0/docs/samsung-tv-seller-office-上线流程.md)
- [UI Description 中文大纲](E:/code/workspace/FitPulse0/docs/samsung-tv-ui-description-pptx-中文大纲.md)

注意：

- 这份模板是按 FitPulse 当前页面和功能整理的可直接复制稿。
- 其中卖家主体信息、隐私政策 URL、客服邮箱这几项需要你替换成自己的正式值。
- 分类字段要以 Seller Office 当时页面的实际下拉选项为准。

## 1. Create App

页面：`Applications > Create App`

| 字段             | 建议值                   | 备注                     |
| ---------------- | ------------------------ | ------------------------ |
| Application Name | `FitPulse`          | Seller Office 内部管理名 |
| Application Type | `TV App` / `Web App` | 以页面实际选项为准       |
| Default Language | `English`              | 当前 UI 主语言是英文     |

## 2. App Package

页面：`Applications > App Package`

| 字段             | 建议值                          | 备注                                                    |
| ---------------- | ------------------------------- | ------------------------------------------------------- |
| Package File     | `你的已签名 FitPulse .wgt` | 上传最新签名包                                          |
| Version          | `config.xml` 当前版本         | 每次提审必须递增                                        |
| Required Version | `6.0`                         | 见[`config.xml`](E:/code/workspace/FitPulse0/config.xml) |

上传后重点确认：

- `Pre-Test` 通过
- 包内有 `config.xml`
- 包内签名正常
- `profile` 是 `tv`

## 3. App Images

页面：`Applications > App Images`

### 3.1 必传素材

| 字段                | 建议文件                                      | 备注         |
| ------------------- | --------------------------------------------- | ------------ |
| 1920x1080 App Image | `待补`                                      | 商店主展示图 |
| 512x423 PNG Icon    | `待补`                                      | 店铺图标     |
| Screenshot 1        | `store-screenshots/01-home-dashboard.jpg`   | Home         |
| Screenshot 2        | `store-screenshots/02-library-explore.jpg`  | Library      |
| Screenshot 3        | `store-screenshots/03-classic-programs.jpg` | Classic      |
| Screenshot 4        | `store-screenshots/04-workout-player.jpg`   | Workout      |

### 3.2 截图要求

- 格式：`JPG`
- 建议尺寸：`1920x1080`
- 至少 4 张
- 建议突出核心使用场景，不要截空页或配置页

## 4. Title/Description on TV

页面：`Applications > Title/Description on TV`

### 4.1 默认语言建议值

| 字段              | 建议值                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language          | `English`                                                                                                                                                                                                                                                                                                                                                                                                         |
| App Title         | `FitPulse`                                                                                                                                                                                                                                                                                                                                                                                                        |
| Short Description | `A remote-friendly fitness app for Samsung Smart TV with guided home workouts, structured plans, and easy focus-based navigation.`                                                                                                                                                                                                                                                                                |
| Full Description  | `FitPulse is a fitness experience designed for Samsung Smart TV. Users can browse workout recommendations, explore body-part-based training in Library, open structured plans in Classic Programs, review workout history, and start guided daily workout sessions with the TV remote. The app is optimized for large-screen viewing, directional focus navigation, and quick access to home fitness content.` |
| Keywords          | `fitness, workout, home workout, exercise, smart tv`                                                                                                                                                                                                                                                                                                                                                              |

### 4.2 中文备注

当前更稳妥的写法是：

- 不写登录
- 不写付费
- 不写订阅
- 不写搜索是核心能力
- 不写多语言切换

因为这些都不是当前版本的主能力。

## 5. Service Info

页面：`Applications > Service Info`

### 5.1 基础服务信息

| 字段               | 建议值                                  | 备注                                   |
| ------------------ | --------------------------------------- | -------------------------------------- |
| Service Category   | `Health` / `Sports` / `Lifestyle` | 以页面实际选项为准，优先选最贴近健身的 |
| Age Rating         | `General` / `All`                   | 以页面选项和内容分级要求为准           |
| Supported Language | `English`                             | 当前主语言                             |
| Privacy Policy URL | `待补`                                | 必须是公网可访问链接                   |
| Terms of Use URL   | `可选`                                | 若页面要求则补                         |

### 5.2 Seller Information

下面这些要替换成你的正式卖家资料：

| 字段                    | 当前建议值                 |
| ----------------------- | -------------------------- |
| Seller Name             | `待补正式主体名`         |
| Customer Support E-mail | `待补客服邮箱`           |
| Seller Homepage         | `待补官网`               |
| Representative's Name   | `待补负责人姓名`         |
| Phone Number            | `待补联系电话`           |
| Address                 | `待补注册地址或联系地址` |
| Registration Number     | `待补`                   |
| VAT / Tax Number        | `待补或按页面要求填写`   |

## 6. Service Country/Region

页面：`Applications > Service Country/Region`

建议：

- 只选你能实际运营和客服覆盖的国家
- 海外发布前先确认 `Partner Seller` 已开通
- 第一次上线不要铺太多国家，先少量市场更稳

| 字段                | 建议值       |
| ------------------- | ------------ |
| Countries / Regions | `待你确认` |

## 7. App Feature Info

页面：`Applications > App Feature Info`

| 字段             | 建议值                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| App Type         | `Fitness / Wellness` 或最接近项                                                                    |
| Login Required   | `No`                                                                                               |
| In-App Purchase  | `No`                                                                                               |
| Ads              | `No` / `待确认`                                                                                  |
| Network Required | `Yes`                                                                                              |
| Main Features    | `Browse workouts, explore plans, open day detail, start guided workout, remote-control navigation` |

## 8. Verification Information / Test Information

页面：`Applications > Verification Information` 或 `Test Information`

### 8.1 Test Account

| 字段                  | 建议值  |
| --------------------- | ------- |
| Test Account Required | `No`  |
| ID                    | `N/A` |
| Password              | `N/A` |

### 8.2 Test Steps

可直接复制：

```text
1. Launch the app.
2. The app opens with the onboarding flow and then reaches the Home screen.
3. Use the remote directional keys to move focus across the sidebar and workout cards.
4. Open Library and browse body-part workout categories.
5. Open Classic Programs and select a workout plan.
6. Open the plan calendar and select an available day.
7. Start the workout from the Day Detail page.
8. Verify the workout player opens correctly and can be controlled with the remote.
9. Press Back to return to previous screens.
10. Open Me and History to verify the history list page.
```

### 8.3 Additional Notes

可直接复制：

```text
This application does not require account login.
No in-app purchase is included in the current release.
The app is designed for Samsung TV remote navigation with directional focus movement, Enter for selection, and Back for returning to the previous screen.
```

## 9. Billing

页面：`Applications > Billing`

| 字段              | 建议值 |
| ----------------- | ------ |
| Billing Supported | `No` |
| In-App Purchase   | `No` |

## 10. App UI Description

页面：上传 `UI Description` 的位置

建议上传：

- 生成后的 `FitPulse` UI Description `PPTX`
- 文件由 [`tools/fill-app-description-ppt.py`](E:/code/workspace/FitPulse0/tools/fill-app-description-ppt.py) 生成

## 11. 当前提审前仍需你补齐的信息

- 正式 Seller 名称
- 正式客服邮箱
- 正式官网
- 注册地址
- 公司注册号 / 税号
- 隐私政策 URL
- 1920x1080 店铺图片
- 512x423 PNG 图标
- 实际要上线的国家或地区

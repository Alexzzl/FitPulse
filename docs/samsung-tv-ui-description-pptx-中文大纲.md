# FitPulse TV 的 Samsung TV UI Description PPT 中文大纲

适用项目：`FitPulse TV`

用途：用于 Seller Office 提交 `App UI Description` 的 `PPTX`

配套文档：
- [上线流程](E:/code/workspace/FitPulse0/docs/samsung-tv-seller-office-上线流程.md)
- [字段填写模板](E:/code/workspace/FitPulse0/docs/samsung-tv-seller-office-字段填写模板.md)

官方参考：
- <https://developer.samsung.com/tv-seller-office/checklists-for-distribution/application-ui-description.html>

## 1. 整体建议

三星要看的不是漂亮海报，而是审核员能不能快速理解：

- 这个应用做什么
- 有哪些主要页面
- 遥控器怎么操作
- 核心流程怎么走
- 是否需要登录、付费、特殊权限

对 FitPulse TV，建议聚焦真实可用流程：

- Home
- Library
- Classic Programs
- Plan Calendar
- Day Detail
- Workout Player
- Me / History

不要把当前没有完整实现的功能写成已上线能力。

## 2. 推荐页数

建议做成 10 到 12 页。

推荐结构：

1. Cover
2. App Overview
3. Screen Flow
4. Home
5. Library
6. Classic Programs
7. Plan Calendar / Day Detail
8. Workout Player
9. Remote Control Behavior
10. Test Information
11. Seller Information
12. Additional Notes

## 3. 每页中文大纲

### 第 1 页：封面

标题建议：

```text
FitPulse TV
Samsung TV App UI Description
```

副标题建议：

```text
Version: 1.0.0
Platform: Samsung Smart TV Web App
Seller: Your Company Name
```

### 第 2 页：App Overview

建议说明：

```text
FitPulse TV is a fitness application designed for Samsung Smart TV.
Users can browse recommended workouts, explore body-part-based training, open structured plans, and start guided home workout sessions with the TV remote.
The app is optimized for large-screen viewing and directional focus navigation.
```

建议补充要点：

- 电视遥控器操作
- 家庭健身
- 计划浏览
- 每日训练入口
- 历史记录

### 第 3 页：Screen Flow

建议流程图：

```text
Launch
  -> Welcome
      -> Profile Ready
          -> Home
              -> Library
              -> Classic
                  -> Plan Calendar
                      -> Day Detail
                          -> Get Ready
                              -> Workout Player
                                  -> Rest
                                      -> Workout Complete
              -> Me
                  -> History
```

说明建议：

```text
The app starts with onboarding and then enters the Home screen.
Users can browse workout content, open workout plans, start guided workout sessions, and review history using the Samsung TV remote.
```

### 第 4 页：Home

建议放图：

- `store-screenshots/01-home-dashboard.jpg`

说明建议：

```text
The Home screen is the main dashboard of FitPulse TV.
It provides weekly activity, a resume workout card, and recommended workout content.
Users can move focus with directional keys and open a workout with the Enter key.
```

### 第 5 页：Library

建议放图：

- `store-screenshots/02-library-explore.jpg`

说明建议：

```text
The Library screen lets users browse workouts by body part.
Users can move between filter chips and workout cards using the remote.
Selecting a workout opens the guided workout flow.
```

### 第 6 页：Classic Programs

建议放图：

- `store-screenshots/03-classic-programs.jpg`
- `ui-description-screenshots/07-plan-calendar.jpg`

说明建议：

```text
Classic Programs presents structured workout plans.
Users can select a plan, open the plan calendar, and choose an available training day.
```

### 第 7 页：Day Detail

建议放图：

- `ui-description-screenshots/08-day-detail.jpg`

说明建议：

```text
The Day Detail screen shows the selected workout day, description, estimated time, and exercise count.
Users can start the workout directly from this page.
```

### 第 8 页：Workout Player

建议放图：

- `store-screenshots/04-workout-player.jpg`
- `ui-description-screenshots/09-workout-complete.jpg`

说明建议：

```text
The Workout Player screen is used for guided exercise playback.
Users can continue through the workout flow with the remote and complete the workout session.
```

### 第 9 页：Remote Control Behavior

建议写法：

```text
Supported remote keys:
- Up / Down / Left / Right: move focus
- Enter: select the focused item
- Back / Return: go to the previous screen
- Play / Pause: control timer-based workout flow when applicable
```

再补一句：

```text
The app is optimized for directional focus navigation, and focus stops at screen edges instead of wrapping.
```

### 第 10 页：Test Information

建议写法：

```text
No login is required.
No in-app purchase is included in the current release.
Recommended review path:
Home -> Library -> Classic -> Plan Calendar -> Day Detail -> Start Workout -> Workout Player -> Back -> Me -> History
```

### 第 11 页：Seller Information

建议内容：

```text
Seller Name: Your Company Name
Support E-mail: your-support@example.com
Homepage: https://your-domain.example
Representative: Your Name
Phone: Your Phone Number
Address: Your Address
```

### 第 12 页：Additional Notes

建议写法：

```text
This app is a Samsung TV web application package (.wgt).
The current release focuses on remote-friendly fitness browsing and guided home workout flows.
Only currently available functions are described in this document.
```

## 4. 建议使用的截图

### 商店截图

1. `store-screenshots/01-home-dashboard.jpg`
2. `store-screenshots/02-library-explore.jpg`
3. `store-screenshots/03-classic-programs.jpg`
4. `store-screenshots/04-workout-player.jpg`

### UI Description 补充截图

1. `ui-description-screenshots/05-welcome-setup.jpg`
2. `ui-description-screenshots/06-history-screen.jpg`
3. `ui-description-screenshots/07-plan-calendar.jpg`
4. `ui-description-screenshots/08-day-detail.jpg`
5. `ui-description-screenshots/09-workout-complete.jpg`

## 5. 对 FitPulse 当前版本最重要的注意事项

- 不要写有登录功能，当前版本没有
- 不要写有内购，当前版本没有
- 不要写搜索是核心功能，当前版本只是展示 UI
- 不要写多语言切换，当前版本没有
- 不要把未来功能写进 PPT

对三星审核来说，真实、完整、可验证，比写得大而全更重要。

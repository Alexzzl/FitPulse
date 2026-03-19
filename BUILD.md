# FitPulse - Tizen Web 应用构建指南

## 项目结构

```
FitPulse/
├── config.xml          # Tizen 应用配置文件
├── index.html          # 主入口页面
├── css/
│   └── style.css      # 应用样式
├── js/
│   └── app.js         # 应用逻辑
├── images/
│   └── icon.svg       # 应用图标 (SVG源文件)
└── README.md          # 本文件
```

## 环境准备

### 1. 安装 Tizen Studio
下载地址：https://developer.tizen.org/development/tizen-studio/download

### 2. 安装所需组件
- Tizen Studio
- Web IDE
- Samsung TV 扩展组件

## 构建步骤

### 方式一：使用 Tizen Studio (图形界面)

1. **打开 Tizen Studio**
   ```
   tizen
   ```

2. **创建新项目**
   - 文件 → 新建 → Tizen 项目
   - 选择 "模板" → "移动设备" → "Web 应用"
   - 选择空项目

3. **导入文件**
   - 用 FitPulse 项目文件替换默认文件
   - 将 `config.xml`、`index.html`、`css/`、`js/`、`images/` 复制到项目根目录

4. **构建安装包**
   - 右键项目 → 构建安装包
   - 选择 "构建"（不是"构建签名安装包"）
   - 输出：`FitnessApp.wgt`

### 方式二：使用 CLI (命令行)

```bash
# 进入项目目录
cd FitPulse

# 使用 Tizen CLI 创建 wgt 安装包
tizen package -w -t wgt -- ./FitnessApp.wgt
```

### 方式三：手动创建 ZIP

1. 创建包含以下文件的 ZIP 包：
   - `config.xml`
   - `index.html`
   - `css/style.css`
   - `js/app.js`
   - `images/` 文件夹

2. 将 `.zip` 后缀改为 `.wgt`

## 三星电视测试

### 1. 开启电视开发者模式
1. 进入三星电视设置
2. 找到 "开发者模式"（隐藏菜单）
3. 启用开发者模式
4. 记录电视 IP 地址

### 2. 通过 Tizen Studio 安装
1. 在 Tizen Studio 中，打开 "连接浏览器"
2. 通过 IP 地址添加电视
3. 右键项目 → 运行 → 以 Tizen Web 应用运行
4. 选择你的电视

## 应用功能

### 导航操作
- **方向键**：在元素间移动
- **确认键**：选择/确认
- **返回键**：返回上一画面

### 训练课程
- 晨间瑜伽 (20 分钟)
- HIIT 燃脂 (15 分钟)
- 舞蹈有氧 (25 分钟)
- 全身力量 (30 分钟)
- 晚间拉伸 (15 分钟)
- 核心训练 (20 分钟)

### 计时器
- 开始/暂停/重置控制
- 训练时长追踪
- 完成提醒

### 进度追踪
- LocalStorage 本地存储
- 连续训练天数统计
- 消耗卡路里估算
- 训练历史记录

## 常见问题

### WGT 无法安装
- 确保电视和电脑在同一网络
- 检查开发者模式是否已开启
- 验证电视 IP 地址是否正确

### 应用无法显示
- 检查 config.xml 是否为有效 XML
- 确保所有文件路径正确
- 查看 Tizen Studio 控制台错误信息

### 遥控器无法操作
- 检查 `keydown` 事件监听器是否已设置
- 先用键盘测试（方向键 + 确认键）
- 检查焦点样式是否可见

## 发布到三星电视商店

1. 创建三星开发者账号
2. 上传 WGT 安装包
3. 提交审核
4. 等待审批（通常 1-2 周）

## 注意事项

- 本应用使用原生 HTML/CSS/JS（无框架）
- 适配 1920x1080 分辨率（Full HD）
- 深色主题，适配电视观看
- 已实现遥控器导航支持

# Tizen TV App 证书问题解决方案

## 问题描述
你在安装Tizen TV应用时遇到错误：`Check certificate error : :Invalid certificate chain with certificate in signature.:<-3>`

这是由于证书链配置不正确导致的。

## 解决方案

### 方法1：使用Tizen Studio GUI重新配置证书（推荐）

1. **打开Tizen Studio**
   - 启动Tizen Studio IDE
   - 等待完全加载

2. **打开证书管理器**
   - 菜单: `Tools` → `Certificate Manager`
   - 或者点击工具栏上的证书管理器图标

3. **删除现有有问题的证书**
   - 在证书管理器中选择 `FitPulse_Developer` 配置
   - 点击 `Delete` 删除它

4. **创建新的证书配置**
   - 点击 `+` 按钮创建新配置
   - 选择 `TV` 作为目标设备类型
   - 填写以下信息：
     - Profile Name: `FitPulse_TV`
     - Author Name: `FitPulse_Developer`
     - Organization: `FitPulse`
     - Email: `developer@fitpulse.com`

5. **生成证书**
   - 选择自动生成证书选项
   - 设置密码：`password123` (或你喜欢的其他密码)
   - 点击 `Finish` 生成证书

6. **重新构建应用**
   ```bash
   cd E:/code/workspace/FitPulse
   npm run build
   ```

7. **在Tizen Studio中导入项目**
   - `File` → `Import` → `Tizen Project`
   - 选择项目根目录
   - 确保使用新创建的 `FitPulse_TV` 配置进行构建

8. **部署到模拟器**
   - 右键项目 → `Run As` → `Tizen Web Application`

### 方法2：命令行修复（如果GUI不可用）

1. **备份并清理现有配置**
   ```bash
   # 备份现有配置
   cp "C:/tizen-studio-data/profile/profiles.xml" "C:/tizen-studio-data/profile/profiles.xml.backup"
   ```

2. **使用现有的有效证书**
   ```bash
   cd E:/code/workspace/FitPulse/dist
   "C:/tizen-studio/tools/ide/bin/tizen.bat" package -t wgt -s ursulinaepzmi51 -- .
   ```

3. **如果仍然失败，尝试重置证书配置**
   ```bash
   # 删除有问题的证书文件
   rm "C:/tizen-studio-data/keystore/author/FitPulse_Developer.*"
   
   # 编辑 profiles.xml，确保使用正确的证书
   # 将 active 属性改为 ursulinaepzmi51
   ```

### 方法3：使用开发模式安装（临时解决方案）

如果以上方法都不工作，你可以尝试在模拟器上启用开发者模式：

1. **在Tizen模拟器中**：
   - 打开模拟器设置
   - 启用开发者模式
   - 允许未签名应用安装

2. **使用以下命令安装**：
   ```bash
   "C:/tizen-studio/tools/ide/bin/tizen.bat" install -n FitPulse.wgt -t T-samsung-10.0-x86_64 --force
   ```

## 验证步骤

1. **检查证书配置**：
   ```bash
   "C:/tizen-studio/tools/ide/bin/tizen.bat" security-profiles list
   ```

2. **验证包签名**：
   ```bash
   "C:/tizen-studio/tools/ide/bin/tizen.bat" build-web --sign ursulinaepzmi51 -- .
   ```

3. **测试安装**：
   ```bash
   "C:/tizen-studio/tools/ide/bin/tizen.bat" install -n FitPulse.wgt -t T-samsung-10.0-x86_64
   ```

## 常见问题

- **证书密码错误**：确保使用正确的密码文件，或直接使用明文密码
- **证书链不完整**：确保使用Tizen Studio生成的完整证书链
- **配置文件损坏**：删除并重新创建profiles.xml文件

## 参考链接

- [Tizen TV开发指南](https://developer.tizen.org/development/guides/web-application/tv-application/getting-started)
- [Tizen证书管理](https://developer.tizen.org/development/tizen-studio/web-tools/certificate-manager)


[TR][Playback][VPN/Out network][ATSC] There is no network pop up
Open | B | 2026-04-21 | Resolve
[TR][Basic Fuction][VPN/Out network][ATSC] TTS works in the app
Open | B | 2026-04-21 | Resolve

解决 
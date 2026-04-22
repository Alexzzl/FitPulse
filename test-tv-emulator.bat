@echo off
echo 正在启动Tizen TV模拟器测试...
echo.
echo 1. 确保Tizen Studio已安装
2. 确保TV模拟器已创建
3. 构建应用...

cd /d "%~dp0"
if exist package.json (
    echo 构建应用...
    call npm run build
    if errorlevel 1 (
        echo 构建失败，请检查错误
        pause
        exit /b 1
    )
)

echo.
echo 构建完成！
echo 接下来：
echo 1. 打开Tizen Studio
echo 2. 启动TV模拟器
echo 3. 在Tizen Studio中导入项目
echo 4. 运行应用

echo.
echo 测试要点：
echo - 遥控器导航是否正常
echo - 所有按钮是否响应
echo - 界面是否适配1920x1080
echo - 应用是否稳定运行

echo.
start "" "https://developer.tizen.org/development/guides/web-application/tv-application/getting-started"

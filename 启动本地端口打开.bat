@echo off
chcp 65001>nul
title 滁滁大学网站服务器

:: 检查端口是否被占用
netstat -ano | findstr "LISTENING" | findstr ":9001" > nul
if not errorlevel 1 (
    echo 警告：9001端口已被占用！
    echo 正在尝试释放端口...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9001" ^| findstr "LISTENING"') do (
        taskkill /f /pid %%a
    )
    timeout /t 2 >nul
)

:: 检查Python环境
echo 正在检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Python未安装！
    echo 请从Microsoft Store安装Python，或访问:
    echo https://www.python.org/downloads/windows/
    echo.
    echo 按任意键退出...
    pause >nul
    exit
)

:: 启动服务器
echo.
echo [信息] Python环境检查通过
echo [信息] 正在启动滁滁大学网站服务器...
echo.
python server.py

if errorlevel 1 (
    echo.
    echo [错误] 服务器启动失败！
    echo 请检查是否有其他程序占用了9001端口
    echo.
    pause
    exit
)
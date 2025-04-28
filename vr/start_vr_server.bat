@echo off
chcp 65001>nul
title 滁滁大学VR全景服务器

:: 检查管理员权限
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo 请求管理员权限...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

:: 检查端口是否被占用
netstat -ano | findstr "LISTENING" | findstr ":9008" > nul
if not errorlevel 1 (
    echo 警告：9008端口已被占用！
    echo 正在尝试释放端口...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9008" ^| findstr "LISTENING"') do (
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
echo [信息] 正在启动VR全景服务器...
echo.

:: 保存当前窗口标题
for /f "tokens=2 delims=," %%a in ('tasklist /v /fi "imagename eq cmd.exe" /fo csv ^| find /i "%~n0"') do set "current_window=%%~a"

:: 启动浏览器并运行服务器
python server.py

if errorlevel 1 (
    echo.
    echo [错误] VR服务器启动失败！
    echo 请检查是否有其他程序占用了9008端口
    echo.
    pause
    exit
)
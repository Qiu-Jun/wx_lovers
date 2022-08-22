CHCP 65001
@echo off

set /p input=请输入(1.启动服务;2.停止服务)
echo 您输入%input%
if "%input%" == "1" (npm run start)
if "%input%" == "2" (npm run stop)

pause
@echo off
echo 🚀 Atlas Admin 开发环境启动器
echo 正在同时启动应用和文档服务器...
echo.

start "Atlas Admin App" cmd /k "cd /d %~dp0.. && pnpm dev"
timeout /t 2 /nobreak >nul
start "Atlas Admin Docs" cmd /k "cd /d %~dp0.. && pnpm docs:dev"

echo ✅ 开发环境启动成功！
echo 📱 应用地址: http://localhost:5173
echo 📚 文档地址: http://localhost:5173/docs
echo.
echo 按任意键关闭此窗口...
pause >nul

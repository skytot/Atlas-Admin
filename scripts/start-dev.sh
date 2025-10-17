#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Atlas Admin 开发环境启动器${NC}"
echo -e "${YELLOW}正在同时启动应用和文档服务器...${NC}"
echo

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 启动应用服务器
echo -e "${GREEN}[APP]${NC} 启动应用开发服务器..."
cd "$PROJECT_ROOT"
pnpm dev &
APP_PID=$!

# 等待应用服务器启动
sleep 3

# 启动文档服务器
echo -e "${BLUE}[DOCS]${NC} 启动文档开发服务器..."
pnpm docs:dev &
DOCS_PID=$!

echo
echo -e "${GREEN}✅ 开发环境启动成功！${NC}"
echo -e "${CYAN}📱 应用地址: http://localhost:5173${NC}"
echo -e "${CYAN}📚 文档地址: http://localhost:5173/docs${NC}"
echo
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"

# 优雅关闭函数
cleanup() {
    echo -e "\n${YELLOW}正在关闭服务...${NC}"
    kill $APP_PID 2>/dev/null
    kill $DOCS_PID 2>/dev/null
    exit 0
}

# 捕获中断信号
trap cleanup SIGINT SIGTERM

# 等待进程
wait

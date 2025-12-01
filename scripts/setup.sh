#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Hand Talk Accessibility Analyzer - Setup Script${NC}"
echo "=================================================="

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed. Please install it first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}[OK] $1 is installed${NC}"
}

echo -e "\n${YELLOW}Checking prerequisites...${NC}"
check_command node
check_command npm

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version must be 18 or higher. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Node.js version $(node -v) is compatible${NC}"

echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}[OK] Backend dependencies installed${NC}"

echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd ../frontend
npm install
echo -e "${GREEN}[OK] Frontend dependencies installed${NC}"

cd ..

echo -e "\n${YELLOW}Setting up environment files...${NC}"
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}[OK] Created backend/.env${NC}"
else
    echo -e "${YELLOW}[SKIP] backend/.env already exists${NC}"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}[OK] Created frontend/.env${NC}"
else
    echo -e "${YELLOW}[SKIP] frontend/.env already exists${NC}"
fi

echo -e "\n${GREEN}Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Make sure MongoDB is running (or use docker compose)"
echo "  2. Run the backend:  cd backend && npm run dev"
echo "  3. Run the frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker Compose:"
echo "  docker compose up"

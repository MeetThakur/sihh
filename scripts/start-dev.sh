#!/bin/bash

# KhetSetu Development Server Startup Script
# This script starts both backend and frontend servers concurrently

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌱 Starting KhetSetu Development Environment${NC}"
echo -e "${BLUE}=====================================\n${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Function to check if MongoDB is running
check_mongodb() {
    if pgrep mongod > /dev/null; then
        echo -e "${GREEN}✅ MongoDB is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  MongoDB is not running. Starting MongoDB...${NC}"
        # Try to start MongoDB
        if command -v systemctl &> /dev/null; then
            sudo systemctl start mongod
        elif command -v brew &> /dev/null && brew services list | grep mongodb-community > /dev/null; then
            brew services start mongodb-community
        else
            echo -e "${RED}❌ Could not start MongoDB automatically. Please start it manually.${NC}"
            exit 1
        fi

        # Wait a moment for MongoDB to start
        sleep 3

        if pgrep mongod > /dev/null; then
            echo -e "${GREEN}✅ MongoDB started successfully${NC}"
        else
            echo -e "${RED}❌ Failed to start MongoDB. Please start it manually.${NC}"
            exit 1
        fi
    fi
}

# Function to install dependencies if needed
install_dependencies() {
    local dir=$1
    local name=$2

    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${YELLOW}📦 Installing $name dependencies...${NC}"
        cd "$dir"
        npm install
        cd ..
    else
        echo -e "${GREEN}✅ $name dependencies already installed${NC}"
    fi
}

# Function to create .env files if they don't exist
setup_env_files() {
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        echo -e "${YELLOW}🔧 Creating backend .env file...${NC}"
        cat > backend/.env << EOL
# Environment
NODE_ENV=development

# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/khetsetu
MONGODB_TEST_URI=mongodb://localhost:27017/khetsetu_test

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (Optional - for development)
EMAIL_FROM=noreply@khetsetu.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Weather API (Optional)
WEATHER_API_KEY=your_openweather_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOL
        echo -e "${GREEN}✅ Backend .env file created${NC}"
    fi

    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        echo -e "${YELLOW}🔧 Creating frontend .env file...${NC}"
        cat > frontend/.env << EOL
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=KhetSetu
VITE_APP_VERSION=1.0.0

# Development flags
VITE_DEV_MODE=true
EOL
        echo -e "${GREEN}✅ Frontend .env file created${NC}"
    fi
}

# Main execution
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check MongoDB
check_mongodb

# Setup environment files
setup_env_files

# Install dependencies
echo -e "\n${BLUE}📦 Checking dependencies...${NC}"
install_dependencies "backend" "Backend"
install_dependencies "frontend" "Frontend"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down development servers...${NC}"
    jobs -p | xargs -r kill
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start backend server
echo -e "\n${BLUE}🚀 Starting Backend Server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo -e "${BLUE}🚀 Starting Frontend Server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}🎉 Development servers started successfully!${NC}"
echo -e "${BLUE}=====================================\n${NC}"
echo -e "${GREEN}📊 Backend:${NC}  http://localhost:5000"
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}📚 API Docs:${NC} http://localhost:5000/api-docs (if available)"
echo -e "\n${YELLOW}💡 Tips:${NC}"
echo -e "   • Press ${RED}Ctrl+C${NC} to stop both servers"
echo -e "   • Backend logs will appear with ${BLUE}[Backend]${NC} prefix"
echo -e "   • Frontend logs will appear with ${GREEN}[Frontend]${NC} prefix"
echo -e "   • Make sure MongoDB is running before starting"
echo -e "\n${BLUE}=====================================${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
